const ALLOWED_EVENTS = new Set([
  "page_view",
  "search_start",
  "search_result",
  "plan_adjust",
  "favorite_add",
  "favorite_remove",
  "favorite_rerun",
  "share",
  "corporate_click"
]);

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return json({ ok: true }, 204);
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await request.json();
    const event = String(body?.event || "");

    if (!ALLOWED_EVENTS.has(event)) {
      return json({ error: "invalid event" }, 400);
    }

    // Only coarse, non-PII fields are accepted.
    const row = {
      event,
      session: safe(body?.session, 80),
      version: safe(body?.version, 20),
      destination: enumValue(body?.destination, ["any","central","kasugayama","sea","east","mountain","myoko"], "any"),
      mood: enumValue(body?.mood, ["any","food","cafe","sightseeing","event","nature","onsen","active","rain"], "any"),
      transport: enumValue(body?.transport, ["auto","privatecar","mobilitycar","public","taxi","walk","bike"], "auto"),
      budget: enumValue(body?.budget, ["any","0","1000","3000","5000","10000","20000"], "any"),
      companion: enumValue(body?.companion, ["any","solo","couple","family","group"], "any"),
      timing: enumValue(body?.timing, ["now","later","custom"], "now"),
      resultCount: numberOrNull(body?.resultCount),
      freeMinutes: numberOrNull(body?.freeMinutes),
      buffer: numberOrNull(body?.buffer),
      shareAction: enumValue(body?.shareAction, ["share","line","copy","unknown"], ""),
      adjustSource: enumValue(body?.adjustSource, ["ai","local","none","unknown"], ""),
      rerunMode: enumValue(body?.rerunMode, ["saved_origin","current_origin"], "")
    };

    if (env.ANALYTICS) {
      env.ANALYTICS.writeDataPoint({
        blobs: [
          row.event,
          row.destination,
          row.mood,
          row.transport,
          row.budget,
          row.companion,
          row.timing,
          row.shareAction,
          row.adjustSource,
          row.rerunMode,
          row.version,
          row.session
        ],
        doubles: [
          row.resultCount ?? -1,
          row.freeMinutes ?? -1,
          row.buffer ?? -1
        ],
        indexes: [
          row.event
        ]
      });
    } else {
      // Safe fallback for setup verification. No user text/IP/GPS is logged by this code.
      console.log("NEXITAIME_ANALYTICS", row);
    }

    return json({ ok: true }, 200);
  } catch (e) {
    return json({ error: "invalid request" }, 400);
  }
}

function safe(v,max){
  return String(v ?? "").slice(0,max);
}

function enumValue(v, allowed, fallback){
  const s=String(v ?? "");
  return allowed.includes(s) ? s : fallback;
}

function numberOrNull(v){
  if(v===null || v===undefined || v==="")return null;
  const n=Number(v);
  return Number.isFinite(n) ? n : null;
}

function json(data,status=200){
  return new Response(JSON.stringify(data),{
    status,
    headers:{
      "Content-Type":"application/json; charset=utf-8",
      "Cache-Control":"no-store",
      "Access-Control-Allow-Origin":"*",
      "Access-Control-Allow-Methods":"POST, OPTIONS",
      "Access-Control-Allow-Headers":"Content-Type"
    }
  });
}
