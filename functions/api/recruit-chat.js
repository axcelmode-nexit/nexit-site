export async function onRequest(context) {
  const { request, env } = context;

  try {
    const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "user", content: "日本語で一言だけ、テスト成功と返してください。" }
      ]
    });

    return json({
      ok: true,
      result
    });
  } catch (e) {
    return json({
      ok: false,
      error: String(e),
      stack: e?.stack
    }, 500);
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
