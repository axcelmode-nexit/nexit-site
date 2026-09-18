const MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return json({}, 204);
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await readBody(request);
    const message = String(body.message || "").trim();
    const current = body.current && typeof body.current === "object"
      ? body.current
      : {};

    if (!message) {
      return json({ error: "message is required" }, 400);
    }

    if (message.length > 300) {
      return json({ error: "message is too long" }, 400);
    }

    const systemPrompt = `
あなたは上越地域向けアプリ「NEXITAIME 〜上越版〜」の入力解釈専用AIです。

役割:
ユーザーの自然文の希望を、NEXITAIMEの既存検索条件に変換してください。
観光地・営業時間・交通時刻・料金・イベントなどの事実を新しく生成してはいけません。
実際に行けるかどうかはNEXITAIME本体が判定します。

重要:
- 出発地 origin と帰着地 returnTo は絶対に変更しない
- destination はユーザーが明示した場合だけ変更する
- 「近場」「近く」「歩ける範囲」などの明示がある場合は
  destination="any", transport="walk" にしてよい
- 不明な項目は null
- freeMinutes と freeMinutesDelta は同時に設定しない
- note は20文字程度の短い日本語

許可値:

mood:
- any = おまかせ
- food = ごはん
- cafe = カフェ
- sightseeing = 観光
- event = イベント
- nature = 自然・景色
- onsen = 温泉・サウナ
- active = 体を動かす
- rain = 雨でもOK

transport:
- auto = おまかせ
- privatecar = 自家用車
- mobilitycar = カーシェア・レンタカー
- public = 公共交通
- taxi = タクシー
- walk = 徒歩
- bike = レンタル自転車

destination:
- any = おまかせ
- central = 中心部
- kasugayama = 春日山
- sea = 海側
- east = 東部
- mountain = 山側
- myoko = 妙高

必ずJSONだけを返してください。
形式:
{
  "freeMinutes": null,
  "freeMinutesDelta": null,
  "mood": null,
  "transport": null,
  "destination": null,
  "note": ""
}
`;

    const userPrompt = `
ユーザー希望:
${message}

現在条件:
${JSON.stringify(current)}
`;

    const result = await env.AI.run(MODEL, {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 250,
      temperature: 0.1
    });

    const raw = result?.response ?? "";
    const adjustment = parseAdjustment(raw);

    if (!adjustment) {
      return json({ error: "invalid AI response" }, 502);
    }

    return json({
      ok: true,
      adjustment
    });

  } catch (e) {
    return json({ error: String(e) }, 500);
  }
}

function parseAdjustment(raw) {
  if (raw && typeof raw === "object") {
    return sanitizeAdjustment(raw);
  }

  const text = String(raw || "").trim();

  try {
    return sanitizeAdjustment(JSON.parse(text));
  } catch {}

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return sanitizeAdjustment(JSON.parse(match[0]));
  } catch {
    return null;
  }
}

function sanitizeAdjustment(value) {
  if (!value || typeof value !== "object") return null;

  const moods = new Set([
    "any","food","cafe","sightseeing","event","nature","onsen","active","rain"
  ]);
  const transports = new Set([
    "auto","privatecar","mobilitycar","public","taxi","walk","bike"
  ]);
  const destinations = new Set([
    "any","central","kasugayama","sea","east","mountain","myoko"
  ]);

  const numOrNull = (v) => {
    if (v === null || v === undefined || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const freeMinutes = numOrNull(value.freeMinutes);
  const freeMinutesDelta = freeMinutes === null
    ? numOrNull(value.freeMinutesDelta)
    : null;

  return {
    freeMinutes,
    freeMinutesDelta,
    mood: moods.has(value.mood) ? value.mood : null,
    transport: transports.has(value.transport) ? value.transport : null,
    destination: destinations.has(value.destination) ? value.destination : null,
    note: String(value.note || "").slice(0, 80)
  };
}

async function readBody(request) {
  const contentType = request.headers.get("Content-Type") || "";

  if (contentType.includes("application/json")) {
    return await request.json();
  }

  const text = (await request.text()).trim();
  return { message: text, current: {} };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
