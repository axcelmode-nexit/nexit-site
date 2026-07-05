export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const { message } = await request.json();
    if (!message) return json({ error: "message is required" }, 400);

    const prompt = `
あなたは AXCEL MODE NEXIT の採用AIアシスタントです。
日本語で、丁寧に、短く分かりやすく回答してください。
不明点は断定せず、正式な条件は面談時に確認と添えてください。

会社情報:
- 新潟県上越市、上越妙高駅徒歩2分
- 東京案件中心のソフトウェア開発会社
- AI活用支援、Web/業務システム開発、保守運用、ITコンサル
- 平均65％還元を目指す
- 未経験中途は現時点では経験者中心
- リモートはプロジェクトによる
- 応募はENTRYより案内

質問:
${message}
`;

    const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: "あなたは採用担当AIです。" },
        { role: "user", content: prompt }
      ]
    });

    return json({ answer: result.response });
  } catch (e) {
    console.error(e);
    catch (e) { console.error(e); return json({error: String(e),stack: e?.stack}, 500);
}
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
