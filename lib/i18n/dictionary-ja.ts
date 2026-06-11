import type { Dictionary } from "@/lib/i18n/i18n.types";

export const DICTIONARY_JA: Dictionary = {
  header: {
    homeAria: "FIRST FLUKE ホーム",
  },
  languageSwitcher: {
    groupAria: "言語を選択",
  },
  nav: {
    sectionsAria: "セクションナビゲーション",
    backToTopAria: "ページ上部へ",
  },
  badge: {
    chipLabel: "2026年選定",
    providerLabel: "AIソリューション供給企業",
    linkAria: "「モドゥの創業」2026 選定ページを開く",
  },
  hero: {
    titleLine1: "最初の幸運を、",
    titleLine2: "ともにつくります",
    subtitleLead: "AIとテクノロジーで、より良い日常をつくるチーム、",
    ctaSolutions: "ソリューションを見る",
    ctaContact: "お問い合わせ",
    mascotButtonAria: "マスコットに挨拶する",
    mascotVideoAria: "FIRST FLUKEのマスコット（カワウソ）",
  },
  about: {
    paragraphs: [
      "AIとテクノロジーで、より良い日常をつくるチームです。",
      "FIRST FLUKEは、機能を詰め込んだサービスよりも、長く使い続けてもらえる体験を大切にしています。複雑な技術を前面に出すのではなく、誰もが気軽に理解して使えるよう、構造と流れを設計します。",
      "AI・コンテンツ・自動化を軸に、さまざまなデジタルプロダクトやサービスを企画・開発しています。アイデアの段階から実際の利用まで、実行を重視したプロダクトづくりを行います。",
      "技術そのものよりも、「なぜ必要か」「どんな体験を残すか」を先に考えます。",
    ],
  },
  oma: {
    heading: "自社開発のマルチエージェントハーネス、",
    descriptionLead:
      "ひとつのAIアシスタントにすべてを任せるのではなく、役割の異なる専門エージェントがひとつのチームとして働くように、",
    descriptionStrong: "私たち自身の手で設計",
    descriptionTail:
      "しました。その深さが、ソリューションの一貫した品質を支えています。",
    ctaRepo: "GitHubで見る",
    ctaDocs: "詳しく見る",
    requestLabel: "リクエスト",
    typewriterTexts: [
      "サイトを作って",
      "会員登録機能を作って",
      "予約システムを作って",
      "問い合わせフォームを作って",
    ],
    agents: [
      { tag: "プランナー", desc: "必要な画面を整理" },
      { tag: "フロントエンド", desc: "UI・コンポーネント設計" },
      { tag: "バックエンド", desc: "データ・API連携" },
      { tag: "QAレビュアー", desc: "テスト・検収" },
    ],
    highlights: [
      { label: "Portable", desc: "IDEに縛られない" },
      { label: "Role-based", desc: "プロンプト集ではなくチーム構造" },
      { label: "Multi-vendor", desc: "Claude・Codex・Gemini・Qwenを併用" },
      { label: "Token-efficient", desc: "2層構造でトークン約75%削減" },
    ],
  },
  solutions: {
    heading: "ソリューション",
    openAria: "{name}のサイトを開く（外部リンク）",
    items: {
      "place-haejo": {
        name: "Place Haejo",
        tagline: "小規模事業者のマルチチャネルマーケティングを一括自動化",
        category: "小規模事業者・マーケティング",
      },
      "contents-haejo": {
        name: "Contents Haejo",
        tagline: "コンテンツの企画から収益化までワンストップで",
        category: "クリエイター・コンテンツ",
      },
      "legalize-kr": {
        name: "Legalize KR",
        tagline: "法令データを分析・比較するAI",
        category: "規制・法令",
      },
      "curate-ai": {
        name: "CurateAI",
        tagline: "顧客診断・レコメンドを自動生成するAI SaaS",
        category: "レコメンド・コンバージョン",
      },
      "prompt-ops": {
        name: "PromptOps",
        tagline: "PMが自ら扱えるプロンプト運用プラットフォーム",
        category: "AI Ops・インフラ",
      },
      shopzy: {
        name: "Shopzy",
        tagline: "ひと言の会話で運営できるオンラインショップ",
        category: "Eコマース・運営",
      },
    },
  },
  contact: {
    heading: "お問い合わせ",
    subtitle: "確認のうえ、営業日24時間以内にご返信いたします。",
    productLabel: "お問い合わせ種別",
    productPlaceholder: "どのソリューションに関するお問い合わせですか？",
    productOptions: {
      "place-haejo": "Place Haejo",
      "contents-haejo": "Contents Haejo",
      "legalize-kr": "Legalize KR",
      "curate-ai": "CurateAI",
      "prompt-ops": "PromptOps",
      shopzy: "Shopzy",
      oma: "OMA (oh-my-agent)",
      etc: "その他",
    },
    emailLabel: "メールアドレス",
    messageLabel: "メッセージ",
    messagePlaceholder: "お問い合わせ内容をご記入ください。",
    agreePrefix: "個人情報の収集・利用に同意します。",
    agreeLink: "詳細を見る",
    submitIdle: "送信",
    submitBusy: "送信中…",
    successTitle: "お問い合わせを受け付けました。",
    successBody: "確認のうえ、ご返信いたします。",
    successReset: "新しいお問い合わせを作成",
    errorRateLimited:
      "短時間に送信が集中しています。しばらくしてからもう一度お試しください。",
    errorSendFailed:
      "送信に失敗しました。しばらくしてからもう一度お試しください。",
    validation: {
      emailRequired: "メールアドレスを入力してください。",
      emailInvalid: "メールアドレスの形式が正しくありません。",
      messageRequired: "メッセージを入力してください。",
      messageTooLong: "メッセージが長すぎます。",
      agreeRequired: "個人情報の収集・利用に同意してください。",
      productRequired: "お問い合わせ種別を選択してください。",
    },
  },
  footer: {
    flukeDefinition: "思いがけない幸運。",
    legalAria: "法的情報",
    privacyLabel: "プライバシーポリシー",
    business: {
      triggerAria: "事業者情報を表示",
      title: "事業者情報",
      rows: [
        { label: "事業者登録番号", value: "711-23-02368" },
        { label: "代表者", value: "キム・ガヒョン（Kim Gahyun）" },
        { label: "電話", value: "+82-10-3953-2827" },
        { label: "住所", value: "ソウル特別市冠岳区チョウォン路25" },
      ],
    },
  },
  privacy: {
    backLink: "← FIRST FLUKE ホームへ戻る",
    title: "プライバシーポリシー",
    effectiveDate: "施行日: 2026-05-09",
    sections: [
      {
        title: "1. 収集する個人情報の項目",
        body: [
          "必須項目: メールアドレス、メッセージ本文",
          "自動収集: 接続IPアドレス、接続日時、ブラウザ情報（スパム防止目的、短期間のみ保管）",
        ],
      },
      {
        title: "2. 収集・利用の目的",
        body: ["お問い合わせの受付および返信", "スパム・不正利用の防止"],
      },
      {
        title: "3. 保管期間",
        body: [
          "返信完了後6か月間保管し、その後直ちに破棄します。（返信・記録保管目的）",
        ],
      },
      {
        title: "4. 第三者への提供",
        body: ["原則として提供しません。"],
      },
      {
        title: "5. 処理の委託",
        body: [
          "メール送信サービス: Resend, Inc.（メール本文、受信者メールアドレス）",
          "スパム防止: Cloudflare, Inc.（Turnstileトークン検証）",
        ],
      },
      {
        title: "6. 利用者の権利",
        body: [
          "利用者はいつでも、ご自身の個人情報の閲覧・訂正・削除・処理停止を請求できます。",
          "ご請求は、ホーム画面下部の「Contact」セクションにあるお問い合わせフォームからお送りください。",
        ],
      },
      {
        title: "7. 個人情報保護責任者",
        body: [
          "役職: 代表",
          "連絡窓口: ホーム画面下部の「Contact」セクションのお問い合わせフォーム",
        ],
      },
      {
        title: "8. 告知義務",
        body: [
          "本ポリシーの内容に追加・削除・修正がある場合は、施行日の7日前からホームページにて告知します。",
        ],
      },
    ],
  },
};
