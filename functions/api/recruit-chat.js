const KNOWLEDGE_FILES = [
  "company.md",
  "representative.md",
  "vision.md",
  "recruit.md",
  "working.md",
  "salary-rules.md",
  "welfare.md",
  "ai-policy.md",
  "joetsu.md",
  "technology.md",
  "faq.md"
];

// GitHubでMarkdownを更新したら、Cloudflare Pages側の環境変数に設定してください。
// 例: KNOWLEDGE_BASE_URL=https://raw.githubusercontent.com/<org>/<repo>/main/knowledge
const FALLBACK_KNOWLEDGE = String.raw`
===== ai-policy.md =====
# ai-policy.md
# AI利用方針

## 基本方針
NEXITでは、AIを活用できるエンジニアの育成を重視しています。
業務上AIサービスを利用する場合は、会社ルールに従う必要があります。

## 禁止事項
顧客情報、個人情報、機密情報、未公開情報等をAIサービスへ入力してはいけません。

## 回答時の伝え方
NEXITはAI活用に前向きですが、情報管理を重視しています。
「AIを使う会社」ではなく、「AIを正しく安全に使いこなす会社」として説明してください。

===== company.md =====
# company.md
# 株式会社アクセル・モード・ネクスト 会社情報

## 基本情報
- 会社名: 株式会社アクセル・モード・ネクスト
- 英語表記: Axcel-Mode Nexit Inc.
- 代表取締役: 吉田 臣男
- 所在地: 〒943-0861 新潟県上越市大和五丁目1-5 フルサット内
- 最寄り: 上越妙高駅 徒歩約2分
- 設立: 2026年4月23日
- 拠点: 新潟県上越市

## 事業内容
- ソフトウェア開発
- Webシステム開発
- 業務システム開発
- 保守・運用
- IT活用支援
- AI活用支援
- ITコンサルティング
- 人材育成

## 会社の特徴
NEXITは、上越を拠点とするソフトウェア開発会社です。
東京案件中心の開発体制を目指し、地方にいながら都市部水準の開発案件に関われる環境づくりを進めています。

## ブランドメッセージ
- 挑戦を、確かな前進に。
- 一歩外へ。次の未来へ。

## 回答時の注意
正式な採用条件、待遇、選考内容は面談時に確認するよう案内してください。

===== faq.md =====
# faq.md
# NEXIT AI FAQ

## 会社・代表

Q. 会社名は何ですか？
A. 株式会社アクセル・モード・ネクストです。英語表記は Axcel-Mode Nexit Inc. です。

Q. 社長は誰ですか？
A. 代表取締役は吉田 臣男です。

Q. 所在地はどこですか？
A. 新潟県上越市大和五丁目1-5 フルサット内です。

Q. 最寄り駅はどこですか？
A. 上越妙高駅です。オフィスは徒歩約2分の場所にあります。

Q. いつ設立されましたか？
A. 2026年4月23日に設立されました。

## 採用

Q. 未経験でも応募できますか？
A. 現時点では中途未経験者の採用は厳しい方針です。未経験者は来年以降の新卒採用で検討します。

Q. 新卒は未経験でも大丈夫ですか？
A. 新卒採用では未経験者も検討対象です。技術への興味や学ぶ意欲を重視します。

Q. 経験者は応募できますか？
A. はい。経験者エンジニアを中心に採用しています。

Q. UIJターンは歓迎ですか？
A. はい。UIJターン希望者を歓迎しています。

Q. 上越に住んでいなくても応募できますか？
A. 応募は可能です。勤務形態や転居については面談時に確認してください。

Q. カジュアル面談はできますか？
A. 可能性があります。正式な受付方法や日程はENTRYまたは問い合わせで確認してください。

## 働き方

Q. 勤務時間は？
A. 基本の勤務時間は9:30〜18:30、休憩1時間です。

Q. 時差出勤はありますか？
A. 業務上支障がなく会社が承認した場合、9:00〜18:00、9:30〜18:30、10:00〜19:00などの勤務時間帯を選べます。

Q. 休日は？
A. 土日、祝日、年末年始休暇、その他会社が指定する日です。

Q. 夏季休暇はありますか？
A. 7月1日から9月30日までの間に3日間の夏季特別休暇があります。

Q. リモートワークはできますか？
A. 原則は出社勤務です。ただし、豪雪、災害、通勤困難、感染症対策、育児・介護などの場合に会社が在宅勤務を認めることがあります。

Q. 大雪の日はどうなりますか？
A. 豪雪や通勤困難の場合、会社が在宅勤務を認めることがあります。

Q. 副業はできますか？
A. 副業・兼業は事前申請と会社の許可が必要です。競業や情報漏洩リスクがある場合は制限されることがあります。

## 給与・報酬

Q. 給与体系は？
A. 最低保証給、売上成果報酬、組織成果給、超過時間外勤務手当、決算賞与で構成されます。

Q. 最低保証給は？
A. 能力、経験、職務内容、保有スキル、市場価値などを総合的に勘案して個別に決定します。

Q. 固定残業はありますか？
A. 最低保証給には月20時間分の固定残業手当を含みます。20時間を超える時間外勤務は別途割増賃金を支給します。

Q. 65%還元とは何ですか？
A. NEXITでは平均65％還元を目標としています。詳細な算定方法や正式条件は面談時に確認してください。

Q. 賞与はありますか？
A. 通常賞与は支給しません。業績に応じて決算賞与を支給することがあります。

Q. 昇給はありますか？
A. 原則として毎年4月に実施します。売上・粗利、稼働率、業務遂行能力、顧客評価、育成・組織貢献などを総合評価します。

Q. 給与日はいつですか？
A. 毎月25日に支給します。支払日が休日の場合は前営業日です。

Q. 賃金計算期間は？
A. 毎月21日から翌月20日までです。

## 通勤・交通

Q. 通勤手当はありますか？
A. 公共交通機関は合理的な通勤経路による実費を月額20,000円まで支給します。マイカー通勤者には会社承認制で月額10,000円を支給します。

Q. 車通勤はできますか？
A. 会社の承認を受けた場合に限り可能です。有効な運転免許証と対人・対物賠償無制限の任意保険加入が必要です。

## 休暇・福利厚生

Q. 有給休暇はありますか？
A. 年次有給休暇は法令に基づき付与されます。

Q. 半日有給は取れますか？
A. はい。年次有給休暇は半日単位で取得できます。

Q. 慶弔休暇はありますか？
A. あります。本人の結婚5日、配偶者の出産2日、配偶者・子・父母の死亡5日、祖父母・兄弟姉妹の死亡3日などです。

Q. 育児・介護休業はありますか？
A. 法令に基づき、育児休業、介護休業、子の看護休暇、介護休暇などを認めます。

## AI・技術

Q. AIは開発で使っていますか？
A. NEXITではAIを活用できるエンジニアの育成を重視しています。業務でAIを利用する場合は会社ルールに従います。

Q. AIに顧客情報を入れてもいいですか？
A. いいえ。顧客情報、個人情報、機密情報、未公開情報等をAIサービスへ入力してはいけません。

Q. どんな開発をしていますか？
A. Webシステム、業務システム、ソフトウェア開発、保守運用、IT活用支援、AI活用支援などです。

## 選考・条件

Q. 正式な給与条件を教えてください。
A. 正式な給与条件は、経験、スキル、職務内容などを踏まえて面談時に確認します。

Q. 内定できますか？
A. AIでは内定可否は判断できません。選考結果は正式な選考を通じて会社から案内します。

Q. 応募方法は？
A. 採用ページのENTRYまたは問い合わせから案内します。

===== joetsu.md =====
# joetsu.md
# 上越で働くこと

## 拠点
NEXITの所在地は、新潟県上越市大和五丁目1-5 フルサット内です。
上越妙高駅から徒歩約2分の場所です。

## 上越勤務の特徴
- 地方にいながら、東京案件中心の仕事に関われる可能性があります。
- UIJターンを歓迎しています。
- 自然が近く、生活環境と仕事のバランスを取りやすい地域です。
- 豪雪や通勤困難時には、会社が在宅勤務を認める場合があります。

## 回答時の注意
雪や生活環境については、過度に楽観的に言い切らず、現実的に説明してください。

===== recruit.md =====
# recruit.md
# 採用情報

## 採用方針
- 経験者エンジニアを中心に採用します。
- 中途未経験者の採用は、現時点では厳しい方針です。
- 未経験者は来年以降の新卒採用で検討します。
- UIJターン希望者は歓迎します。
- 上越で働きたい人、地方で技術を磨きたい人、AI活用に興味がある人を歓迎します。

## 求める人物像
- ソフトウェア開発に真剣に取り組みたい人
- AIを活用しながら成長したい人
- 地方から価値を生み出すことに関心がある人
- 誠実に仕事へ向き合える人

## 回答時の注意
未経験中途については、期待を持たせすぎず、正直に「現時点では厳しい」と伝えてください。
ただし、新卒や今後の学習相談には前向きに応じてください。

===== representative.md =====
# representative.md
# 代表について

## 代表
株式会社アクセル・モード・ネクストの代表取締役は、吉田 臣男です。

## 代表メッセージの要旨
代表の吉田臣男は、上越を「帰る場所」ではなく「新しく始める場所」として捉えています。
都市部で培った経験とテクノロジーの力を活かし、上越から新しい仕事や価値を生み出すことを目指しています。

## NEXITの考え方
NEXITは、挑戦する人の一歩を支え、その一歩を確かな前進に変えていく会社です。

## AI回答例
Q. 社長は誰ですか？
A. 株式会社アクセル・モード・ネクストの代表取締役は、吉田 臣男です。

===== salary-rules.md =====
# salary-rules.md
# 賃金・評価・報酬

## 賃金構成
従業員の賃金は以下で構成されます。
- 最低保証給
- 売上成果報酬
- 組織成果給（管理職のみ）
- 超過時間外勤務手当
- 決算賞与

## 等級
- ジュニア
- メンバー
- コアメンバー
- リード
- マネージャー（管理職）

## 最低保証給
最低保証給は、能力、経験、職務内容、保有スキル、市場価値などを総合的に勘案して個別に決定します。
最低保証給には月20時間分の固定残業手当を含みます。
月20時間を超える時間外勤務については、別途割増賃金を支給します。

## 最低保証給の目安
- ジュニア: 200,000円
- メンバー: 220,000円
- コアメンバー: 240,000円
- リード: 260,000円
- マネージャー: 280,000円

## 売上成果報酬
売上成果報酬は、従業員個人の売上実績等に応じて支給する成果連動型の報酬です。
対象売上、還元率、計算方法は別途定める売上成果報酬テーブルに基づきます。

## 売上成果報酬テーブル
- 〜49万円: 0%
- 50〜59万円: 5%（上限3万円）
- 60〜69万円: 15%
- 70〜79万円: 20%
- 80〜89万円: 25%
- 90〜99万円: 30%
- 100万円以上: 35%

## 昇給
昇給は原則として毎年4月に実施します。
評価項目には、売上・粗利、稼働率、業務遂行能力、顧客評価、育成・組織貢献などがあります。

## 賞与
通常賞与は支給しません。
会社業績に応じて決算賞与を支給することがあります。

## 賃金計算・支払
- 賃金計算期間: 毎月21日から翌月20日まで
- 支払日: 毎月25日
- 支払日が休日の場合は前営業日
- 支払方法: 従業員指定の金融機関口座へ振込

===== technology.md =====
# technology.md
# 技術・開発領域

## 開発領域
- Webシステム開発
- 業務システム開発
- ソフトウェア開発
- 保守・運用
- IT活用支援
- AI活用支援
- ITコンサルティング

## 利用ツール例
- Google Workspace
- Slack
- Microsoft 365
- Notion
- その他会社が指定するツール

## 技術方針
NEXITは、AIを活用できるエンジニアの育成を重視します。
AIに仕事を任せるだけでなく、AIを使ってより良い成果を出すエンジニアを育てることを目指します。

===== vision.md =====
# vision.md
# NEXITの理念・ビジョン

## ビジョン
挑戦を、確かな前進に。

## ブランドメッセージ
一歩外へ。次の未来へ。

## 目指す姿
NEXITは、上越から新しい仕事と価値を生み出すことを目指しています。
地方にいながら都市部水準の仕事に挑戦できる環境をつくり、AIを活用できるエンジニアの育成にも力を入れます。

## 大切にする価値観
- 構想で終わらせず、実装する
- 小さな前進を積み重ねる
- 誠実である
- 現状に留まらず、一歩外へ出る

===== welfare.md =====
# welfare.md
# 休暇・福利厚生・通勤

## 年次有給休暇
年次有給休暇は、労働基準法その他関係法令に基づき付与します。
取得時は原則として事前申請が必要です。

## 半日有給
年次有給休暇は半日単位で取得できます。

## 慶弔休暇
- 本人の結婚: 5日
- 配偶者の出産: 2日
- 配偶者、子または父母の死亡: 5日
- 祖父母または兄弟姉妹の死亡: 3日
- その他会社が必要と認めた場合

## 育児・介護
育児休業、介護休業、子の看護休暇、介護休暇などは法令に基づきます。

## 通勤手当
公共交通機関利用者には、合理的な通勤経路による実費を月額20,000円を上限に支給します。
マイカー通勤者には、会社承認制で月額10,000円を支給します。

## マイカー通勤
会社の承認を受けた場合に限り認めます。
有効な運転免許証と、対人・対物賠償無制限の任意保険加入が必要です。

## 休職
私傷病などにより長期間就業できない場合、会社は休職を命じることがあります。

===== working.md =====
# working.md
# 働き方・勤務制度

## 勤務時間
- 所定労働時間: 9:30〜18:30
- 休憩時間: 1時間

## 時差出勤
業務上支障がない場合、会社が承認した勤務時間で勤務できます。
勤務時間帯の例:
- 9:00〜18:00
- 9:30〜18:30
- 10:00〜19:00

## 休日
- 土曜日
- 日曜日
- 国民の祝日
- 年末年始休暇（12月29日〜1月3日）
- その他会社が指定する日

## 夏季特別休暇
毎年7月1日から9月30日までの間に3日間付与されます。
未取得分は翌年度へ繰り越しません。

## リモートワーク・在宅勤務
勤務形態は原則として出社勤務です。
ただし、次のような場合は会社が在宅勤務を認めることがあります。
- 豪雪その他天候不良
- 災害
- 通勤困難
- 感染症対策
- 育児または介護
- その他会社が必要と認める場合

## 出退勤
会社が指定する方法で出退勤時刻を記録します。
遅刻・早退・欠勤の場合は、速やかに会社へ連絡・申請します。
`;

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return json({}, 204);
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const message = await readMessage(request);

    if (!message) {
      return json({ error: "message is required" }, 400);
    }

    const knowledgeBase = await loadKnowledge(env);

    const systemPrompt = `
あなたは株式会社アクセル・モード・ネクスト（AXCEL MODE NEXIT）のAI採用担当です。

回答は必ず、以下のナレッジ内容を最優先してください。
- knowledge/faq.md
- knowledge/recruit.md
- knowledge/representative.md

禁止事項:
- 「公開されていません」
- 「記載は見つかりません」
- 「公式情報では確認できません」
- 「直接会社に問い合わせてください」を安易に使わない

代表について聞かれた場合:
- 代表取締役は吉田 臣男
- アクセル・モードの取締役副社長として東京・仙台・京都の事業に関わってきた
- 上越市に新しい開発拠点をつくるためNEXITを立ち上げた
- 上越を「地方」や「帰る場所」ではなく、技術者が成長し新しい仕事を生み出す場所にしたい
- レース好き・車好き
- F1、SUPER GT、SUPER FORMULA、スーパー耐久に関心がある
- 技術、チームワーク、準備、判断、改善の積み重ねを大切にしている
グループ連携について聞かれた場合:
- アクセル・モードグループの一員
- 株式会社アクセル・モード
- 株式会社アンドフラッグ
- 東京・仙台・京都で培った開発実績
- プライム案件、上流工程
を必ず含める

目的:
質問に答えるだけではなく、求職者の不安を減らし、NEXITを正しく理解してもらい、その人に合う次の一歩を一緒に考えること。

話し方:
- 日本語で答える
- 丁寧だが、堅すぎない
- 短く分かりやすく
- 採用担当として、正直で落ち着いたトーンにする
- 押し売りしない
- 分からないことは推測で断定しない
- 正式条件は面談時に確認するよう案内する

回答ルール:
1. 最初に結論を短く答える
2. knowledgeBase の内容を最優先して回答する
3. NEXITらしい情報を1つ入れる
4. 最後に会話が続く質問を1つだけ返す
5. 「社長」「代表」「代表者」と聞かれたら、代表取締役 吉田 臣男 と答える
6. 中途未経験について聞かれたら、現時点では厳しく、未経験は来年以降の新卒採用で検討すると答える
7. 個別の給与額、内定可否、選考結果、未公開情報は断定しない
8. 会社情報・規程・FAQにない内容は、分からないと伝え、面談または問い合わせで確認するよう案内する

以下はNEXITの公式知識ベースです。
${knowledgeBase}
`;

    const result = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 1000,
      temperature: 0.3,
      stream: true
    });

    if (result && typeof result.getReader === "function") {
      return streamText(result);
    }

    return text(result?.response || "すみません。回答を生成できませんでした。");

  } catch (e) {
    return json({ error: String(e) }, 500);
  }
}

async function loadKnowledge(env) {
  const baseUrl = (env.KNOWLEDGE_BASE_URL || "").replace(/\/$/, "");

  if (!baseUrl) {
    return FALLBACK_KNOWLEDGE;
  }

  try {
    const responses = await Promise.all(
      KNOWLEDGE_FILES.map(async (file) => {
        const res = await fetch(`${baseUrl}/${file}`, {
          headers: { "User-Agent": "NEXIT-AI-Knowledge" },
          cf: { cacheTtl: 300, cacheEverything: true }
        });

        if (!res.ok) {
          throw new Error(`Failed to load ${file}: ${res.status}`);
        }

        const text = await res.text();
        return `===== ${file} =====\n${text.trim()}`;
      })
    );

    return responses.join("\n\n");
  } catch (e) {
    console.error("Knowledge load failed. Using fallback.", e);
    return FALLBACK_KNOWLEDGE;
  }
}


function streamText(aiStream) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = aiStream.getReader();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Workers AI streaming is usually Server-Sent Events.
          // Convert SSE chunks to plain text so existing pages can render them safely.
          const events = buffer.split("\n\n");
          buffer = events.pop() || "";

          for (const event of events) {
            const lines = event.split("\n");
            for (const line of lines) {
              if (!line.startsWith("data:")) continue;

              const data = line.replace(/^data:\s*/, "").trim();
              if (!data || data === "[DONE]") continue;

              let textChunk = "";

              try {
                const parsed = JSON.parse(data);
                textChunk =
                  parsed.response ||
                  parsed.delta ||
                  parsed.text ||
                  parsed.choices?.[0]?.delta?.content ||
                  parsed.choices?.[0]?.text ||
                  "";
              } catch {
                textChunk = data;
              }

              if (textChunk) {
                controller.enqueue(encoder.encode(textChunk));
              }
            }
          }
        }

        // If the upstream returned plain text rather than SSE, flush it.
        if (buffer.trim() && !buffer.includes("data:")) {
          controller.enqueue(encoder.encode(buffer));
        }
      } catch (e) {
        controller.error(e);
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

function text(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}


async function readMessage(request) {
  const contentType = request.headers.get("Content-Type") || "";

  if (contentType.includes("application/json")) {
    const body = await request.json();
    return String(body.message || "").trim();
  }

  return (await request.text()).trim();
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
