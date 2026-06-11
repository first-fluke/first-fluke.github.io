import type { ProductId } from "@/lib/contact/products";

export const LOCALES = ["ko", "en", "ja"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ko";

/** Native-language names, used for switcher option labels. */
export const LOCALE_LABELS: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
};

export interface AgentCopy {
  tag: string;
  desc: string;
}

export interface HighlightCopy {
  label: string;
  desc: string;
}

export interface SolutionCopy {
  name: string;
  tagline: string;
  category: string;
}

export interface BusinessInfoRow {
  label: string;
  value: string;
}

export interface PrivacySection {
  title: string;
  body: string[];
}

export interface ContactValidationMessages {
  emailRequired: string;
  emailInvalid: string;
  messageRequired: string;
  messageTooLong: string;
  agreeRequired: string;
  productRequired: string;
}

export interface Dictionary {
  header: {
    homeAria: string;
  };
  languageSwitcher: {
    groupAria: string;
  };
  nav: {
    sectionsAria: string;
    backToTopAria: string;
  };
  badge: {
    chipLabel: string;
    providerLabel: string;
    linkAria: string;
  };
  hero: {
    titleLine1: string;
    titleLine2: string;
    subtitleLead: string;
    ctaSolutions: string;
    ctaContact: string;
    mascotButtonAria: string;
    mascotVideoAria: string;
  };
  about: {
    paragraphs: [string, string, string, string];
  };
  oma: {
    heading: string;
    descriptionLead: string;
    descriptionStrong: string;
    descriptionTail: string;
    ctaRepo: string;
    ctaDocs: string;
    requestLabel: string;
    typewriterTexts: string[];
    agents: AgentCopy[];
    highlights: HighlightCopy[];
  };
  solutions: {
    heading: string;
    /** aria-label template; `{name}` is replaced with the solution name. */
    openAria: string;
    items: Record<string, SolutionCopy>;
  };
  contact: {
    heading: string;
    subtitle: string;
    productLabel: string;
    productPlaceholder: string;
    productOptions: Record<ProductId, string>;
    emailLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    agreePrefix: string;
    agreeLink: string;
    submitIdle: string;
    submitBusy: string;
    successTitle: string;
    successBody: string;
    successReset: string;
    errorRateLimited: string;
    errorSendFailed: string;
    validation: ContactValidationMessages;
  };
  footer: {
    flukeDefinition: string;
    legalAria: string;
    privacyLabel: string;
    business: {
      triggerAria: string;
      title: string;
      rows: BusinessInfoRow[];
    };
  };
  privacy: {
    backLink: string;
    title: string;
    effectiveDate: string;
    sections: PrivacySection[];
  };
}
