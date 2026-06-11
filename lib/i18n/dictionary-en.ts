import type { Dictionary } from "@/lib/i18n/i18n.types";

export const DICTIONARY_EN: Dictionary = {
  header: {
    homeAria: "FIRST FLUKE home",
  },
  languageSwitcher: {
    groupAria: "Select language",
  },
  nav: {
    sectionsAria: "Section navigation",
    backToTopAria: "Back to top",
  },
  badge: {
    chipLabel: "Selected 2026",
    providerLabel: "AI Solution Provider",
    linkAria: "Open the Modoo Startup 2026 selection page",
  },
  hero: {
    titleLine1: "Crafting your first",
    titleLine2: "stroke of luck, together",
    subtitleLead: "A team building a better everyday with AI and technology —",
    ctaSolutions: "Explore solutions",
    ctaContact: "Contact us",
    mascotButtonAria: "Say hi to the mascot",
    mascotVideoAria: "FIRST FLUKE mascot (an otter)",
  },
  about: {
    paragraphs: [
      "We are a team that makes everyday life better with AI and technology.",
      "Rather than packing in features, FIRST FLUKE focuses on experiences people keep coming back to. Instead of putting complex technology front and center, we design structures and flows anyone can understand and use with ease.",
      "We plan and build digital products and services powered by AI, content, and automation — execution-driven products that carry an idea all the way to everyday use.",
      "Before the technology itself, we ask why it is needed — and what kind of experience it leaves behind.",
    ],
  },
  oma: {
    heading: "Our in-house multi-agent harness,",
    descriptionLead:
      "Instead of one AI assistant shouldering everything, specialized agents with distinct roles work as a single team — ",
    descriptionStrong: "designed in-house, by us",
    descriptionTail:
      ". That depth is what keeps the quality of our solutions consistent.",
    ctaRepo: "View on GitHub",
    ctaDocs: "Learn more",
    requestLabel: "Request",
    typewriterTexts: [
      "Build me a website",
      "Add a sign-up flow",
      "Build a booking system",
      "Create a contact form",
    ],
    agents: [
      { tag: "Planner", desc: "Maps out the screens you need" },
      { tag: "Frontend", desc: "UI · component design" },
      { tag: "Backend", desc: "Data · API integration" },
      { tag: "QA Reviewer", desc: "Testing · review" },
    ],
    highlights: [
      { label: "Portable", desc: "Not tied to any IDE" },
      { label: "Role-based", desc: "A team structure, not a prompt bundle" },
      { label: "Multi-vendor", desc: "Mixes Claude · Codex · Gemini · Qwen" },
      { label: "Token-efficient", desc: "~75% fewer tokens with a 2-tier structure" },
    ],
  },
  solutions: {
    heading: "Solutions",
    openAria: "Visit the {name} website (external link)",
    items: {
      "place-haejo": {
        name: "Place Haejo",
        tagline: "Automate multi-channel marketing for local businesses, all at once",
        category: "Local Business · Marketing",
      },
      "contents-haejo": {
        name: "Contents Haejo",
        tagline: "From content planning to monetization, in one place",
        category: "Creator · Content",
      },
      "legalize-kr": {
        name: "Legalize KR",
        tagline: "AI that analyzes and compares legislation data",
        category: "Regulation · Legal",
      },
      "curate-ai": {
        name: "CurateAI",
        tagline: "AI SaaS that auto-generates customer assessments and recommendations",
        category: "Recommendation · Conversion",
      },
      "prompt-ops": {
        name: "PromptOps",
        tagline: "A prompt operations platform PMs can run themselves",
        category: "AI Ops · Infra",
      },
      shopzy: {
        name: "Shopzy",
        tagline: "Run your online store with a single conversation",
        category: "E-commerce · Operations",
      },
    },
  },
  contact: {
    heading: "Get in touch",
    subtitle: "We will get back to you within 24 business hours.",
    productLabel: "Inquiry type",
    productPlaceholder: "Which solution is this about?",
    productOptions: {
      "place-haejo": "Place Haejo",
      "contents-haejo": "Contents Haejo",
      "legalize-kr": "Legalize KR",
      "curate-ai": "CurateAI",
      "prompt-ops": "PromptOps",
      shopzy: "Shopzy",
      oma: "OMA (oh-my-agent)",
      etc: "Other",
    },
    emailLabel: "Email",
    messageLabel: "Message",
    messagePlaceholder: "Tell us what you would like to ask.",
    agreePrefix: "I agree to the collection and use of my personal information.",
    agreeLink: "View details",
    submitIdle: "Send",
    submitBusy: "Sending…",
    successTitle: "Your inquiry has been received.",
    successBody: "We will review it and get back to you.",
    successReset: "Write another inquiry",
    errorRateLimited: "Too many attempts — please try again in a moment.",
    errorSendFailed: "Something went wrong while sending. Please try again shortly.",
    validation: {
      emailRequired: "Please enter your email.",
      emailInvalid: "That email address does not look right.",
      messageRequired: "Please enter a message.",
      messageTooLong: "Your message is too long.",
      agreeRequired: "Please agree to the collection and use of personal information.",
      productRequired: "Please select an inquiry type.",
    },
  },
  footer: {
    flukeDefinition: "an unexpected stroke of luck.",
    legalAria: "Legal",
    privacyLabel: "Privacy Policy",
    business: {
      triggerAria: "View business information",
      title: "Business Information",
      rows: [
        { label: "Business Reg. No.", value: "711-23-02368" },
        { label: "Representative", value: "Gahyun Kim" },
        { label: "Phone", value: "+82 10-3953-2827" },
        {
          label: "Address",
          value: "25 Jowon-ro, Gwanak-gu, Seoul, Republic of Korea",
        },
      ],
    },
  },
  privacy: {
    backLink: "← Back to FIRST FLUKE home",
    title: "Privacy Policy",
    effectiveDate: "Effective date: 2026-05-09",
    sections: [
      {
        title: "1. Personal Information We Collect",
        body: [
          "Required: email address, message body",
          "Automatically collected: IP address, access time, browser information (for spam prevention; retained only briefly)",
        ],
      },
      {
        title: "2. Purpose of Collection and Use",
        body: [
          "Receiving and responding to inquiries",
          "Preventing spam and abuse",
        ],
      },
      {
        title: "3. Retention Period",
        body: [
          "Retained for 6 months after our reply is sent, then deleted immediately. (for reply and record-keeping purposes)",
        ],
      },
      {
        title: "4. Disclosure to Third Parties",
        body: [
          "As a rule, we do not share your personal information with third parties.",
        ],
      },
      {
        title: "5. Outsourced Processing",
        body: [
          "Email delivery: Resend, Inc. (message body, recipient email address)",
          "Spam prevention: Cloudflare, Inc. (Turnstile token verification)",
        ],
      },
      {
        title: "6. Your Rights",
        body: [
          "You may request access to, correction or deletion of, or suspension of the processing of your personal information at any time.",
          "Please submit requests through the inquiry form in the 'Contact' section at the bottom of the home page.",
        ],
      },
      {
        title: "7. Privacy Officer",
        body: [
          "Title: Representative",
          "Contact channel: the inquiry form in the 'Contact' section at the bottom of the home page",
        ],
      },
      {
        title: "8. Notification of Changes",
        body: [
          "Any additions, deletions, or amendments to this policy will be announced on this website at least 7 days before they take effect.",
        ],
      },
    ],
  },
};
