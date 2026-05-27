// Central per-project site config — regeneracjafalownikow.pl
// Components and layouts read from here. Hardcoded values nowhere else.

export const siteConfig = {
  // Brand
  name: "Regeneracja Falowników",
  shortName: "Regeneracja Falowników",
  url: "https://www.regeneracjafalownikow.pl",
  locale: "pl_PL",
  lang: "pl",

  // Legal
  legal: {
    adminName: "INVERTO Krzysztof Łukaszewicz",
    adminAddress: "Mstowo 23, 87-860 Chodecz",
    adminNip: "8882926027",
    adminEmail: "kontakt@regeneracjafalownikow.pl",
  },

  // Feature flags
  features: {
    // GA4 ID — auto-provisioned by playbook 11 (property 539254706).
    ga4: "G-JTRKMX9728" as string | null,

    // Formularz kontaktowy — Lambda + SES (playbook 08).
    contactForm: true,

    // Brak sklepu / checkoutu online — lead-gen tylko.
    hasShop: false,

    // Blog: szkielet aktywny, na start bez wpisów.
    hasBlog: true,
  },

  // Contact (footer / structured data)
  contact: {
    email: "kontakt@regeneracjafalownikow.pl",
    phone: "+48 889 281 795" as string | null,
  },
} as const;

export type SiteConfig = typeof siteConfig;
