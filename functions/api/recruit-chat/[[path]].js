export async function onRequest(context) {
  try {
    const { request, env } = context;
    if (!env.GEMINI_API_KEY) return json({ error: "GEMINI_API_KEY is not configured." }, 500);

    const body = await request.json().catch(() => ({}));
    const message = String(body.message || "").trim();
    if (!message) return json({ error: "message is required." }, 400);

    const prompt = `
あなたは AXCEL MODE NEXIT（株式会社アクセル・モード・ネクスト）の採用AIアシスタントです。
応募検討者に丁寧でわかりやすく、前向きに回答してください。
分からないことは断定せず、正式な条件は面談時に確認と添えてください。
回答は日本語で、1〜4段落程度にしてください。

会社情報:
- 新潟県上越市大和五丁目1-5 フルサット内
- 上越妙高駅 徒歩2分
- 2026年設立のソフトウェア開発会社
- 東京案件中心。首都圏企業向けプロジェクトが中心
- 事業: 企業向けシステム開発、Webシステム、業務システム、保守・運用、AI活用支援、ITコンサルティング、PM/PMO
- コンセプト: 東京品質を、上越から。
- UIJターン歓迎
- 勤務時間: 9:30〜18:30
- 月給25万円〜。経験・スキル・役割を考慮
- 売上の平均65％をエンジニアへ還元することを目標。案件や役割により異なる
- ChatGPTやGitHub CopilotなどAIを積極活用
- 未経験中途は現時点では経験者中心。未経験枠は今後の新卒採用で検討予定
- リモートワークはプロジェクトに応じて出社とリモートを組み合わせる想定
- 福利厚生: 社会保険完備、交通費支給、PC貸与、資格取得支援、書籍購入補助を予定
- ENTRYより問い合わせを案内する

応募者からの質問:
${message}
`;

    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 800 }
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${env.GEMINI_API_KEY}`;
    const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json();
    if (!response.ok) {
  return json({
    error: "Gemini API error",
    status: response.status,
    detail: data}, 500);}

    const answer = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join("") || "すみません。回答を生成できませんでした。";
    return json({ answer });
  } catch (e) {
    console.error(e);
    return json({ error: "Internal server error." }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}
