const API_URL = "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/";

const ALLOWED_DESTINATIONS = new Set(["any","central","kasugayama","sea","east","mountain","myoko"]);
const ALLOWED_MOODS = new Set(["food","cafe"]);
const ALLOWED_KINDS = new Set(["any","ラーメン","定食","海鮮","寿司","そば","カフェ","中華","洋食"]);

// Search points are intentionally coarse. GPS coordinates are never sent from the browser.
const CENTERS = {
  central: [
    { area:"takada", area_name:"高田", lat:37.1157, lng:138.2421 },
    { area:"joetsumyoko", area_name:"上越妙高", lat:37.0810, lng:138.2482 }
  ],
  kasugayama: [
    { area:"kasugayama", area_name:"春日山", lat:37.1473, lng:138.2070 }
  ],
  sea: [
    { area:"naoetsu", area_name:"直江津", lat:37.1706, lng:138.2427 },
    { area:"ogata", area_name:"大潟", lat:37.2350, lng:138.3370 },
    { area:"kakizaki", area_name:"柿崎", lat:37.2770, lng:138.3860 },
    { area:"nadachi", area_name:"名立", lat:37.1565, lng:138.0928 }
  ],
  east: [
    { area:"kubiki", area_name:"頸城", lat:37.1970, lng:138.3190 },
    { area:"uragawara", area_name:"浦川原", lat:37.1670, lng:138.4280 }
  ],
  mountain: [
    { area:"itakura", area_name:"板倉", lat:37.0520, lng:138.2900 },
    { area:"yasuzuka", area_name:"安塚", lat:37.1270, lng:138.4460 },
    { area:"kiyosato", area_name:"清里", lat:37.0760, lng:138.3290 }
  ],
  myoko: [
    { area:"myoko_arai", area_name:"新井", lat:37.0250, lng:138.2530 },
    { area:"myoko_kogen", area_name:"妙高高原", lat:36.8728, lng:138.2110 },
    { area:"myoko_akakura", area_name:"赤倉", lat:36.8946, lng:138.1761 }
  ]
};

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === "OPTIONS") return json({ ok:true }, 204, 300);
  if (request.method !== "GET") return json({ error:"Method not allowed" }, 405);
  if (!env.HOTPEPPER_API_KEY) return json({ error:"HOTPEPPER_API_KEY is not configured" }, 503);

  const url = new URL(request.url);
  const destination = ALLOWED_DESTINATIONS.has(url.searchParams.get("destination"))
    ? url.searchParams.get("destination") : "any";
  const mood = ALLOWED_MOODS.has(url.searchParams.get("mood"))
    ? url.searchParams.get("mood") : "food";
  const kind = ALLOWED_KINDS.has(url.searchParams.get("kind"))
    ? url.searchParams.get("kind") : "any";

  const cacheUrl = new URL(request.url);
  cacheUrl.search = new URLSearchParams({destination,mood,kind}).toString();
  const cacheKey = new Request(cacheUrl.toString(), {method:"GET"});
  const cache = globalThis.caches?.default;
  if (cache) {
    const cached = await cache.match(cacheKey);
    if (cached) return cached;
  }

  try {
    const centers = centersFor(destination);
    const keyword = keywordFor(mood, kind);
    const responses = await Promise.all(centers.map(c => queryCenter(env.HOTPEPPER_API_KEY, c, keyword)));
    const byId = new Map();
    for (const shops of responses) {
      for (const shop of shops) {
        if (!shop?.id || byId.has(shop.id)) continue;
        const center = nearestCenter(shop, centers);
        const row = toNexitaimeShop(shop, center, kind);
        if (row && center) row.distance_hint_km = haversine(Number(shop.lat), Number(shop.lng), center.lat, center.lng);
        byId.set(shop.id, row);
      }
    }

    const restaurants = [...byId.values()]
      .filter(Boolean)
      .sort((a,b) => (a.distance_hint_km ?? 99) - (b.distance_hint_km ?? 99))
      .slice(0, 18)
      .map(({distance_hint_km, ...row}) => row);

    const response = json({
      ok:true,
      provider:"hotpepper",
      destination,
      kind,
      restaurants
    }, 200, 900);
    if (cache) context.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (e) {
    return json({ error:"Hot Pepper API request failed" }, 502, 60);
  }
}

function centersFor(destination) {
  if (destination !== "any") return CENTERS[destination] || CENTERS.central;
  return [
    CENTERS.central[0], CENTERS.central[1],
    CENTERS.kasugayama[0], CENTERS.sea[0],
    CENTERS.myoko[0], CENTERS.myoko[1]
  ];
}

function keywordFor(mood, kind) {
  if (mood === "cafe") return "カフェ";
  const map = {
    "ラーメン":"ラーメン",
    "定食":"定食",
    "海鮮":"海鮮",
    "寿司":"寿司",
    "そば":"そば",
    "カフェ":"カフェ",
    "中華":"中華",
    "洋食":"洋食"
  };
  return map[kind] || "";
}

async function queryCenter(key, center, keyword) {
  const params = new URLSearchParams({
    key,
    lat:String(center.lat),
    lng:String(center.lng),
    range:"5",
    count:"30",
    order:"4",
    format:"json"
  });
  if (keyword) params.set("keyword", keyword);
  const res = await fetch(`${API_URL}?${params.toString()}`, {
    headers:{ Accept:"application/json" }
  });
  if (!res.ok) return [];
  const body = await res.json();
  return Array.isArray(body?.results?.shop) ? body.results.shop : [];
}

function toNexitaimeShop(shop, center, requestedKind) {
  const lat = Number(shop.lat), lng = Number(shop.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const cats = classify(shop, requestedKind);
  const area = center?.area || "takada";
  const areaName = center?.area_name || "上越・妙高";
  const estimated = budgetUpper(shop?.budget?.name || shop?.budget?.average || "");
  const family = childFriendly(shop?.child);
  const parking = String(shop?.parking||"").includes("あり");
  const summary = [shop?.genre?.name, shop?.genre?.catch, shop?.catch]
    .filter(Boolean).join("。 ").slice(0, 180);

  return {
    id:`hotpepper-${shop.id}`,
    hotpepper_id:shop.id,
    provider:"hotpepper",
    title:shop.name,
    venue:shop.name,
    area,
    area_name:areaName,
    address:String(shop.address||""),
    lat,
    lng,
    categories:cats,
    summary:summary || "ホットペッパーグルメ掲載の飲食店。",
    indoor:true,
    family_friendly:family,
    couple_friendly:true,
    solo_friendly:true,
    group_friendly:true,
    parking,
    estimated_cost_yen:estimated,
    hours_text:String(shop.open||"").slice(0,220),
    closed_text:String(shop.close||"").slice(0,120),
    stay_minutes:stayMinutes(cats),
    url:String(shop?.urls?.pc || "https://www.hotpepper.jp/"),
    source_note:"ホットペッパーグルメ Webサービス"
  };
}

function classify(shop, requestedKind) {
  const text = [shop?.name, shop?.genre?.name, shop?.genre?.catch, shop?.catch].filter(Boolean).join(" ");
  const out = new Set(["食","ごはん","グルメ","飲食","雨OK"]);
  const add = (label, re) => { if (re.test(text)) out.add(label); };
  if (requestedKind && requestedKind !== "any") out.add(requestedKind);
  add("ラーメン", /ラーメン|らーめん|拉麺|中華そば/);
  add("定食", /定食|食堂/);
  add("海鮮", /海鮮|魚介|鮮魚|刺身/);
  add("寿司", /寿司|鮨|すし/);
  add("そば", /そば|蕎麦/);
  add("うどん", /うどん/);
  add("カフェ", /カフェ|喫茶|珈琲|コーヒー/);
  add("スイーツ", /スイーツ|ケーキ|ジェラート|甘味/);
  add("中華", /中華|中国料理|餃子|担々/);
  add("洋食", /洋食|イタリアン|フレンチ|パスタ|ピザ/);
  add("焼肉", /焼肉|焼き肉|ホルモン/);
  add("居酒屋", /居酒屋|酒場/);
  return [...out];
}

function stayMinutes(categories) {
  const cats = new Set(categories||[]);
  if (cats.has("ラーメン") || cats.has("そば") || cats.has("うどん")) return {min:30,recommended:45,max:60};
  if (cats.has("カフェ") || cats.has("スイーツ")) return {min:30,recommended:60,max:90};
  if (cats.has("海鮮") || cats.has("寿司") || cats.has("焼肉")) return {min:45,recommended:60,max:90};
  if (cats.has("居酒屋")) return {min:60,recommended:90,max:120};
  return {min:45,recommended:60,max:90};
}

function budgetUpper(text) {
  const nums = String(text||"").replace(/,/g,"").match(/\d+/g)?.map(Number) || [];
  if (!nums.length) return null;
  return Math.max(...nums);
}

function childFriendly(value) {
  const s = String(value||"");
  if (!s) return false;
  return !/不可|お断り/.test(s) && /お子様|子供|子ども|歓迎|OK|可/.test(s);
}

function nearestCenter(shop, centers) {
  let best=null, bestD=Infinity;
  for (const c of centers) {
    const d = haversine(Number(shop.lat), Number(shop.lng), c.lat, c.lng);
    if (d < bestD) { bestD=d; best=c; }
  }
  return best ? {...best, distance_hint_km:bestD} : null;
}

function haversine(lat1,lon1,lat2,lon2) {
  const R=6371, d2r=Math.PI/180;
  const dLat=(lat2-lat1)*d2r, dLon=(lon2-lon1)*d2r;
  const a=Math.sin(dLat/2)**2 + Math.cos(lat1*d2r)*Math.cos(lat2*d2r)*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(a));
}

function json(data,status=200,maxAge=0) {
  return new Response(JSON.stringify(data), {
    status,
    headers:{
      "Content-Type":"application/json; charset=utf-8",
      "Cache-Control":maxAge?`public, max-age=${maxAge}`:"no-store",
      "Access-Control-Allow-Origin":"*",
      "Access-Control-Allow-Methods":"GET, OPTIONS",
      "Access-Control-Allow-Headers":"Content-Type"
    }
  });
}
