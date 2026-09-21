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

  if (request.method === "GET") {
    return handleAdminGet(request, env);
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

    const row = {
      event,
      session: safe(body?.session, 80),
      ts: safe(body?.ts || new Date().toISOString(), 40),
      app: safe(body?.app || "NEXITAIME", 40),
      version: safe(body?.version, 20),

      destination: enumValue(
        body?.destination,
        ["any", "central", "kasugayama", "sea", "east", "mountain", "myoko"],
        "any"
      ),

      mood: enumValue(
        body?.mood,
        ["any", "food", "cafe", "sightseeing", "event", "nature", "onsen", "active", "rain"],
        "any"
      ),

      transport: enumValue(
        body?.transport,
        ["auto", "privatecar", "mobilitycar", "public", "taxi", "walk", "bike"],
        "auto"
      ),

      budget: enumValue(
        body?.budget,
        ["any", "0", "1000", "3000", "5000", "10000", "20000"],
        "any"
      ),

      companion: enumValue(
        body?.companion,
        ["any", "solo", "couple", "family", "group"],
        "any"
      ),

      timing: enumValue(
        body?.timing,
        ["now", "later", "custom"],
        "now"
      ),

      resultCount: numberOrNull(body?.resultCount),
      freeMinutes: numberOrNull(body?.freeMinutes),
      buffer: numberOrNull(body?.buffer),

      shareAction: enumValue(
        body?.shareAction,
        ["share", "line", "copy", "unknown"],
        ""
      ),

      adjustSource: enumValue(
        body?.adjustSource,
        ["ai", "local", "none", "unknown"],
        ""
      ),

      rerunMode: enumValue(
        body?.rerunMode,
        ["saved_origin", "current_origin"],
        ""
      )
    };

    if (env.DB) {
      await env.DB.prepare(`
        INSERT INTO analytics_events (
          event,
          session,
          ts,
          app,
          version,
          destination,
          mood,
          transport,
          budget,
          companion,
          timing,
          extra_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        row.event,
        row.session || null,
        row.ts || null,
        row.app || "NEXITAIME",
        row.version || null,
        row.destination || null,
        row.mood || null,
        row.transport || null,
        row.budget || null,
        row.companion || null,
        row.timing || null,
        JSON.stringify({
          resultCount: row.resultCount,
          freeMinutes: row.freeMinutes,
          buffer: row.buffer,
          shareAction: row.shareAction || null,
          adjustSource: row.adjustSource || null,
          rerunMode: row.rerunMode || null
        })
      ).run();
    }

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
    }

    if (!env.DB && !env.ANALYTICS) {
      console.log("NEXITAIME_ANALYTICS", row);
    }

    return json({ ok: true }, 200);

  } catch (e) {
    console.error("NEXITAIME_ANALYTICS_ERROR", e);
    return json({ error: "invalid request" }, 400);
  }
}

async function handleAdminGet(request, env) {
  if (!env.DB) {
    return json({ error: "DB binding missing" }, 500);
  }

  const configuredKey = String(env.ANALYTICS_ADMIN_KEY || "");

  if (!configuredKey) {
    return json(
      { error: "ANALYTICS_ADMIN_KEY is not configured" },
      503
    );
  }

  const suppliedKey = request.headers.get("X-Admin-Key") || "";

  if (!constantTimeEqual(suppliedKey, configuredKey)) {
    return json({ error: "unauthorized" }, 401);
  }

  const url = new URL(request.url);
  const days = clampInt(
    url.searchParams.get("days"),
    1,
    365,
    30
  );

  const sinceExpr = `-${days} days`;

  try {
    const [
      totals,
      eventBreakdown,
      topTransport,
      topMood,
      topDestination,
      dailySearches
    ] = await Promise.all([

      env.DB.prepare(`
        SELECT
          COUNT(*) AS events,

          COUNT(
            DISTINCT CASE
              WHEN session IS NOT NULL
              AND session <> ''
              THEN session
            END
          ) AS sessions,

          SUM(
            CASE
              WHEN event = 'page_view'
              THEN 1 ELSE 0
            END
          ) AS page_views,

          SUM(
            CASE
              WHEN event = 'search_start'
              THEN 1 ELSE 0
            END
          ) AS searches,

          SUM(
            CASE
              WHEN event = 'search_result'
              THEN 1 ELSE 0
            END
          ) AS result_events,

          SUM(
            CASE
              WHEN event = 'plan_adjust'
              THEN 1 ELSE 0
            END
          ) AS plan_adjusts,

          SUM(
            CASE
              WHEN event = 'share'
              THEN 1 ELSE 0
            END
          ) AS shares,

          SUM(
            CASE
              WHEN event = 'favorite_add'
              THEN 1 ELSE 0
            END
          ) AS favorites,

          ROUND(
            AVG(
              CASE
                WHEN event = 'search_start'
                THEN CAST(
                  json_extract(
                    extra_json,
                    '$.freeMinutes'
                  ) AS REAL
                )
              END
            ),
            1
          ) AS avg_free_minutes,

          MAX(
            COALESCE(ts, created_at)
          ) AS latest_event_at

        FROM analytics_events

        WHERE datetime(
          COALESCE(ts, created_at)
        ) >= datetime('now', ?)
      `).bind(sinceExpr).first(),

      env.DB.prepare(`
        SELECT
          event AS label,
          COUNT(*) AS value

        FROM analytics_events

        WHERE datetime(
          COALESCE(ts, created_at)
        ) >= datetime('now', ?)

        GROUP BY event

        ORDER BY
          value DESC,
          label ASC
      `).bind(sinceExpr).all(),

      env.DB.prepare(`
        SELECT
          transport AS label,
          COUNT(*) AS value

        FROM analytics_events

        WHERE
          event = 'search_start'
          AND datetime(
            COALESCE(ts, created_at)
          ) >= datetime('now', ?)

        GROUP BY transport

        ORDER BY
          value DESC,
          label ASC

        LIMIT 10
      `).bind(sinceExpr).all(),

      env.DB.prepare(`
        SELECT
          mood AS label,
          COUNT(*) AS value

        FROM analytics_events

        WHERE
          event = 'search_start'
          AND datetime(
            COALESCE(ts, created_at)
          ) >= datetime('now', ?)

        GROUP BY mood

        ORDER BY
          value DESC,
          label ASC

        LIMIT 10
      `).bind(sinceExpr).all(),

      env.DB.prepare(`
        SELECT
          destination AS label,
          COUNT(*) AS value

        FROM analytics_events

        WHERE
          event = 'search_start'
          AND datetime(
            COALESCE(ts, created_at)
          ) >= datetime('now', ?)

        GROUP BY destination

        ORDER BY
          value DESC,
          label ASC

        LIMIT 10
      `).bind(sinceExpr).all(),

      env.DB.prepare(`
        SELECT
          date(
            COALESCE(ts, created_at)
          ) AS label,

          COUNT(*) AS value

        FROM analytics_events

        WHERE
          event = 'search_start'
          AND datetime(
            COALESCE(ts, created_at)
          ) >= datetime('now', ?)

        GROUP BY date(
          COALESCE(ts, created_at)
        )

        ORDER BY label ASC
      `).bind(sinceExpr).all()

    ]);

    return json({
      ok: true,
      days,

      totals: totals || {},

      eventBreakdown:
        eventBreakdown.results || [],

      topTransport:
        topTransport.results || [],

      topMood:
        topMood.results || [],

      topDestination:
        topDestination.results || [],

      dailySearches:
        dailySearches.results || []
    }, 200);

  } catch (e) {
    console.error(
      "NEXITAIME_ANALYTICS_ADMIN_ERROR",
      e
    );

    return json(
      { error: "analytics query failed" },
      500
    );
  }
}

function safe(v, max) {
  return String(v ?? "").slice(0, max);
}

function enumValue(v, allowed, fallback) {
  const s = String(v ?? "");
  return allowed.includes(s)
    ? s
    : fallback;
}

function numberOrNull(v) {
  if (
    v === null ||
    v === undefined ||
    v === ""
  ) {
    return null;
  }

  const n = Number(v);

  return Number.isFinite(n)
    ? n
    : null;
}

function clampInt(
  v,
  min,
  max,
  fallback
) {
  const n = Number.parseInt(
    String(v ?? ""),
    10
  );

  if (!Number.isFinite(n)) {
    return fallback;
  }

  return Math.min(
    max,
    Math.max(min, n)
  );
}

function constantTimeEqual(a, b) {
  const aa = new TextEncoder().encode(
    String(a)
  );

  const bb = new TextEncoder().encode(
    String(b)
  );

  const len = Math.max(
    aa.length,
    bb.length
  );

  let diff =
    aa.length ^
    bb.length;

  for (let i = 0; i < len; i++) {
    diff |=
      (aa[i] || 0) ^
      (bb[i] || 0);
  }

  return diff === 0;
}

function json(data, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,

      headers: {
        "Content-Type":
          "application/json; charset=utf-8",

        "Cache-Control":
          "no-store",

        "Access-Control-Allow-Origin":
          "*",

        "Access-Control-Allow-Methods":
          "GET, POST, OPTIONS",

        "Access-Control-Allow-Headers":
          "Content-Type, X-Admin-Key"
      }
    }
  );
}
