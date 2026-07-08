# NEXIT AI v4 GitHub版

## 目的
NEXIT AIの知識を `knowledge/*.md` で管理し、GitHub上で更新できるようにした構成です。

## 配置
Cloudflare Pages のリポジトリに以下を配置してください。

```text
/
├── functions/
│   └── api/
│       └── recruit-chat.js
├── knowledge/
│   ├── company.md
│   ├── representative.md
│   ├── vision.md
│   ├── recruit.md
│   ├── working.md
│   ├── salary-rules.md
│   ├── welfare.md
│   ├── ai-policy.md
│   ├── joetsu.md
│   ├── technology.md
│   └── faq.md
└── ai-recruit.html
```

## 使い方

### 1. まずはそのまま差し替え
`functions/api/recruit-chat.js` を差し替えるだけで動きます。  
このファイルには fallback knowledge が埋め込まれているため、環境変数なしでも回答できます。

### 2. GitHubのMarkdownを読ませる場合
Cloudflare Pages の環境変数に以下を設定してください。

```text
KNOWLEDGE_BASE_URL=https://raw.githubusercontent.com/<org>/<repo>/main/knowledge
```

例:

```text
KNOWLEDGE_BASE_URL=https://raw.githubusercontent.com/axcelmode-nexit/site/main/knowledge
```

これで `knowledge/*.md` を更新するだけで、NEXIT AIの知識を更新できます。

## 動作確認質問
デプロイ後、以下を聞いてください。

- 社長は誰？
- 代表は？
- 未経験でも応募できますか？
- 勤務時間は？
- リモートワークはできますか？
- 副業できますか？
- 65%還元とは？
- 賞与はありますか？
- AIは開発で使っていますか？
- 大雪の日はどうなりますか？

## 注意
正式な給与条件、選考結果、内定可否などはAIが断定しない設計にしています。
