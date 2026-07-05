export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return json({}, 204);
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const message = (await request.text()).trim();

    if (!message) {
      return json({ error: "message is required" }, 400);
    }

    const prompt = `
あなたは AXCEL MODE NEXIT の採用AIアシスタントです。
日本語で、丁寧に、短く分かりやすく回答してください。

会社情報:
- 新潟県上越市大和五丁目1-5 フルサット内
- 上越妙高駅徒歩2分
- 東京案件中心のソフトウェア開発会社
- AI活用支援、Web/業務システム開発、保守運用、ITコンサル
- 平均65％還元を目標
- UIJターン歓迎
- 未経験中途は現在経験者中心
- 応募はENTRYより案内

質問:
${message}
`;

    const result = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
      messages: [
        { role: "system", content: "あなたはAXCEL MODE NEXITの採用AIです。" },
        { role: "user", content: prompt }
      ],
      max_tokens: 700,
      temperature: 0.4
    });

    return json({
      answer: result.response || "すみません。回答を生成できませんでした。"
    });

  } catch (e) {
    return json({ error: String(e) }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
