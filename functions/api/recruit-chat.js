export async function onRequest(context) {
  try {
    const { request, env } = context;

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    if (!env.GEMINI_API_KEY) {
      return json({ error: "GEMINI_API_KEY is not configured." }, 500);
    }

    const body = await request.json().catch(() => ({}));
    const message = String(body.message || "").trim();

    if (!message) {
      return json({ error: "message is required." }, 400);
    }

    const payload = {
      contents: [{
        role: "user",
        parts: [{
          text: `あなたはAXCEL MODE NEXITの採用AIアシスタントです。
日本語で丁寧に、短く分かりやすく回答してください。
不明点は断定せず、正式な条件は面談時に確認と添えてください。

会社情報:
- 上越妙高駅徒歩2分
- 東京案件中心のソフトウェア開発会社
- AI活用支援、Web/業務システム開発、保守運用、ITコンサル
- 平均65％還元を目指す
- 未経験中途は現時点では経験者中心
- リモートはプロジェクトによる
- 応募はENTRYより案内

質問:
${message}`
        }]
      }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 700
      }
    };

    const model = "gemini-2.5-flash-lite";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error", data);
      return json({ error: "Gemini API error" }, 500);
    }

    const answer =
      data?.candidates?.[0]?.content?.parts?.map(p => p.text).join("") ||
      "すみません。回答を生成できませんでした。";

    return json({ answer });
  } catch (e) {
    console.error(e);
    return json({ error: "Internal server error" }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
