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
    subtitleLead: "自社のAI SaaSプロダクトを開発・運営する会社、",
    ctaSolutions: "ソリューションを見る",
    ctaContact: "お問い合わせ",
    mascotButtonAria: "マスコットに挨拶する",
    mascotVideoAria: "FIRST FLUKEのマスコット（カワウソ）",
    scrollHintAria: "下にスクロール",
  },
  about: {
    paragraphs: [
      "FIRST FLUKEは、2026年3月に設立されたAIプロダクトカンパニーです。他社の製品を代わりに開発するのではなく、自分たちの名前を掲げたAI SaaSプロダクトを自ら開発・運営しています。",
      "店舗マーケティング、SNSコンテンツ、法令リサーチ、ショップ運営、アプリのデプロイ、病院の問い合わせ対応、占いなど、さまざまな分野のAIサービスを提供しています。料金や無料で利用できる範囲は、各製品のサイトでご確認いただけます。",
      "複雑な技術を前面に出すのではなく、誰もが理解してすぐに使える体験を設計します。アイデアの段階から実際の利用まで、実行を重視したプロダクトづくりを行います。",
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
    subtitle: "FIRST FLUKEが自社で開発・運営するAIプロダクトです。",
    openAria: "{name}のサイトを開く（外部リンク）",
    viewCta: "サイトを見る",
    liveBadge: "運営中",
    items: {
      "place-haejo": {
        name: "Place Haejo",
        tagline: "URL一つで始まる店舗マーケティングコンサルタント",
        category: "小規模事業者・マーケティング",
        features: [
          "店舗URLを入力するだけで、近隣競合と比較したヘルススコアを診断",
          "チャネル別のレビューを集約し、AIが返信文まで自動生成",
          "週次レポートで今週やるべきことを優先度順に整理",
        ],
      },
      "contents-haejo": {
        name: "Contents Haejo",
        tagline: "SNS運用の「今日は何を投稿する？」を解決",
        category: "クリエイター・コンテンツ",
        features: [
          "チャネルのボイスを学習し、毎日の投稿ネタを提案",
          "本文を入れるだけでカードニュースのスライドまで自動生成",
          "投稿・予約・返信をひとつの場所で管理",
        ],
      },
      "legalize-kr": {
        name: "Legalize Haejo",
        tagline: "法令データを分析・比較するAIリサーチツール",
        category: "規制・法令",
        features: [
          "膨大な法令・条文データをAIが分析",
          "条文間の比較で規制リスクを素早く把握",
          "リサーチ結果を整理された形で提供",
        ],
      },
      shopzy: {
        name: "Shopzy",
        tagline: "会話ひとつで運営するCafe24ショップAIエージェント",
        category: "Eコマース・運営",
        features: [
          "会話だけでショップのデザイン・スキンを即時修正（RAGベース）",
          "商品・注文・在庫をチャットで照会し、その場で修正",
          "すべての修正は自動バックアップされ、いつでもロールバック可能",
        ],
      },
      "deploy-haejo": {
        name: "Deploy Haejo",
        tagline: "ソースコードを接続するだけのワンクリックアプリデプロイプラットフォーム",
        category: "インフラ · デプロイ",
        features: [
          "GitHubリポジトリとクラウド公式アカウント(Vercel、Cloudflare)の簡単連携",
          "フレームワークとルートディレクトリの自動検出およびデプロイ計画の事前確認",
          "リアルタイムのデプロイログ監視とワンクリックでのロールバック対応",
        ],
      },
      medisupporter: {
        name: "Medisupporter",
        tagline: "カカオ・NAVER・ウェブからの問い合わせを一元管理する病院相談SaaS",
        category: "医療 · カスタマーサポート",
        features: [
          "複数チャネルの患者からの問い合わせをひとつの相談トレイに集約",
          "承認済み応対マニュアルとAI下書きによる迅速かつ均一な回答作成",
          "相談からスムーズにつながる予約管理カレンダーと紹介ページを提供",
        ],
      },
      fortunebom: {
        name: "Fortunebom",
        tagline: "四柱推命・紫微斗数・タロット・西洋占星術を網羅したAI占いサービス",
        category: "ライフ · 占い",
        features: [
          "生年月日時をもとにした高精度な万年暦による四柱推命・紫微斗数の命盤分析",
          "西洋占星術のホロスコープとインタラクティブなタロットカードリーディング",
          "今日の運勢から相性、復縁、人生の大運の流れまで網羅したAIレポート",
        ],
      },
    },
  },
  faq: {
    "heading": "製品の選び方とご利用案内",
    "intro": "用途に合った製品の選び方と、利用を始める方法をご案内します。",
    "items": [
      {
        "question": "FIRST FLUKEはどんな会社ですか？",
        "answer": "FIRST FLUKEは2026年3月に設立されたAIプロダクト会社です。Place Haejo、Contents Haejo、Legalize Haejo、Shopzy、Deploy Haejo、Medisupporter、Fortunebomを自社で開発・運営しています。",
        "href": "#about",
        "linkLabel": "会社紹介を見る"
      },
      {
        "question": "店舗のマーケティングやSNSコンテンツ制作には、どの製品が適していますか？",
        "answer": "店舗情報やレビューをもとにマーケティングを管理したい場合はPlace Haejo、SNSの投稿アイデアやコンテンツ制作にはContents Haejoをご覧ください。ソリューション一覧で、それぞれの機能と実際の画面を確認できます。",
        "href": "#solutions",
        "linkLabel": "機能と画面を見る"
      },
      {
        "question": "ショップ運営、病院の問い合わせ対応、アプリのデプロイには、どの製品を選べばよいですか？",
        "answer": "ShopzyはCafe24ショップの運営、Medisupporterは病院の複数チャネルの問い合わせ対応と予約管理、Deploy Haejoはソースコードの接続からアプリのデプロイまでを支援します。管理したい業務に合わせてお選びください。",
        "href": "#solutions",
        "linkLabel": "業務別に製品を見る"
      },
      {
        "question": "Legalize HaejoとFortunebomはどんなサービスですか？",
        "answer": "Legalize Haejoは法令や条文を分析・比較するAIリサーチツールです。Fortunebomは四柱推命、紫微斗数、タロット、西洋占星術を扱うAI占いサービスです。機能と利用方法は各製品のサイトで確認できます。",
        "href": "#solutions",
        "linkLabel": "製品サイトを探す"
      },
      {
        "question": "料金や無料トライアルはどこで確認できますか？",
        "answer": "料金プラン、無料で使える範囲、トライアルの有無は製品によって異なります。ソリューション一覧から各製品のサイトを開き、現在の案内をご確認ください。導入や提携については、問い合わせフォームで製品を選択してご相談いただけます。",
        "href": "#contact",
        "linkLabel": "製品の導入について相談する"
      },
      {
        "question": "製品について問い合わせるにはどうすればよいですか？",
        "answer": "下のフォームで製品を選び、メールアドレスとお問い合わせ内容を送信してください。担当者が確認して返信します。会社の連絡先と事業者情報は、このページの下部でも確認できます。",
        "href": "#contact",
        "linkLabel": "問い合わせフォームへ"
      }
    ]
  },
  team: {
    heading: "チーム",
    subtitle: "FIRST FLUKEをつくる人たち",
    linkedinAria: "{name}のLinkedInプロフィールを開く",
    members: {
      gahyun: {
        name: "キム・ガヒョン",
        role: "共同創業者 · CEO",
        bio: "FIRST FLUKEを率い、プロダクトのシステムアーキテクチャとインフラを担います。複数のAI SaaSが安定して稼働する基盤を自ら設計・運用します。",
      },
      eunkwang: {
        name: "シン・ウングァン",
        role: "共同創業者 · CTO",
        bio: "プロダクト全体の技術を統括。AIへの深い専門性をもとに、フロントエンドからAIモデリングまで技術の方向性を描き、エンジニアリングをリードします。",
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
      "legalize-kr": "Legalize Haejo",
      shopzy: "Shopzy",
      "deploy-haejo": "Deploy Haejo",
      medisupporter: "Medisupporter",
      fortunebom: "Fortunebom",
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
