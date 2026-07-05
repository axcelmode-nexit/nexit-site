export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return json({}, 204);
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await request.json().catch(() => ({}));
    const message = String(body.message || "").trim();

    if (!message) {
      return json({ error: "message is required" }, 400);
    }

    const prompt = `
あなたは AXCEL MODE NEXIT（株式会社アクセル・モード・ネクスト）の採用AIアシスタントです。

応募を検討している方に対して、親切・丁寧・前向きに回答してください。

【会社情報】
・新潟県上越市大和五丁目1-5 フルサット内
・上越妙高駅徒歩2分
・東京案件中心のソフトウェア開発会社
・Webシステム、業務システム、AI活用支援、ITコンサルティング
・コンセプト「東京品質を、上越から。」
・勤務時間 9:30〜18:30
・AI(ChatGPT、Copilot等)を積極活用
・平均65％還元を目標
・UIJターン歓迎
・未経験中途は現在経験者中心
・正式な採用条件は面談時に確認してください

質問:
${message}
`;

const result = await env.AI.run(
  "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
  {
    messages: [
      {
        role: "system",
        content:
          "あなたは株式会社アクセル・モード・ネクストの採用AIアシスタントです。"
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 700,
    temperature: 0.4
  }
);

    return json({
      answer:
        result.response ||
        "すみません。回答を生成できませんでした。"
    });

  } catch (e) {
    console.error(e);

    return json(
      {
        error: String(e)
      },
      500
    );
  }
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
