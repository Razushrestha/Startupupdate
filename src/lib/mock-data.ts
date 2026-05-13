import type { AppLocale } from "@/lib/i18n/locales";

export type NewsCategory = "Funding" | "Launch" | "Tech" | "Events";

export type StartupStage = "Pre-seed" | "Seed" | "Series A" | "Series B" | "Grant";

export interface NewsTranslation {
  title: string;
  summary: string;
  body: string[];
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: NewsCategory;
  publishedAt: string;
  startupId: string;
  trending?: boolean;
  body: string[];
  /** Hero / card image (remote, optimized via next/image). */
  coverImage: string;
  imageAlt?: string;
  /** Optional localized story. Add more in CMS; fallback is English + Google Translate link. */
  translations?: Partial<Record<AppLocale, NewsTranslation>>;
}

export interface Founder {
  name: string;
  role: string;
  bio: string;
  linkedIn?: string;
}

export interface FundingRound {
  round: string;
  amount: string;
  date: string;
  investors: string[];
}

export interface Startup {
  id: string;
  slug: string;
  name: string;
  country: string;
  sector: string;
  stage: StartupStage;
  /** One-line summary for listings, tables, and search. */
  description: string;
  mission: string;
  vision: string;
  /** Optional square logo (company or approved leadership / brand image). Place files in `public/` and set e.g. `/logos/acme.png`. */
  brandLogoUrl?: string;
  logoLetter: string;
  engagementScore: number;
  founder: Founder;
  funding: FundingRound[];
}

export type InsightMood = "tension" | "hope" | "clarity" | "care";

export interface InsightPost {
  id: string;
  slug: string;
  title: string;
  dek: string;
  readTime: string;
  author: string;
  /** ISO date; drives freshness on the insights deck. */
  publishedAt: string;
  /** One honest line about why this piece exists (emotional hook). */
  feeling: string;
  /** Short editorial label for the card (human, not a category taxonomy). */
  mood: string;
  moodKind: InsightMood;
  /** A line you can read in one breath; keeps the page from feeling like a memo. */
  pullQuote: string;
}

export const startups: Startup[] = [
  {
    id: "1",
    slug: "monsoon-pay",
    name: "Monsoon Pay",
    country: "Bangladesh",
    sector: "Fintech",
    stage: "Series A",
    description:
      "Embedded payments and working-capital tools for SMB marketplaces across Dhaka and Chittagong.",
    mission:
      "Make trusted commerce infrastructure accessible to every serious SMB in South Asia, without a walled-garden wallet.",
    vision:
      "Become the default financial layer marketplaces and logistics networks plug into for checkout, payouts, and reconciliation.",
    logoLetter: "M",
    engagementScore: 94,
    founder: {
      name: "Nadia Rahman",
      role: "CEO & Co-founder",
      bio: "Former HSBC product lead; built remittance rails for 3M+ users.",
    },
    funding: [
      {
        round: "Series A",
        amount: "$12M",
        date: "2026-04-12",
        investors: ["Sequoia India", "Wavemaker"],
      },
      { round: "Seed", amount: "$3.2M", date: "2025-01-08", investors: ["Accel"] },
    ],
  },
  {
    id: "2",
    slug: "lagoon-health",
    name: "Lagoon Health",
    country: "Sri Lanka",
    sector: "Healthtech",
    stage: "Seed",
    description:
      "Tele-diagnosis and pharmacy logistics for tier-2 cities in Sri Lanka and South India pilots.",
    mission:
      "Deliver reliable specialist access and medicine fulfilment where physical infrastructure lags demand.",
    vision:
      "A regional care continuum where distance and income no longer determine timeliness of diagnosis or treatment.",
    logoLetter: "L",
    engagementScore: 88,
    founder: {
      name: "Arjun Perera",
      role: "Founder",
      bio: "Physician-entrepreneur; previously WHO fellow.",
    },
    funding: [
      { round: "Seed", amount: "$4.5M", date: "2026-03-20", investors: ["Y Combinator", "Omidyar"] },
    ],
  },
  {
    id: "3",
    slug: "delta-grid",
    name: "Delta Grid",
    country: "Pakistan",
    sector: "Climate / Energy",
    stage: "Series B",
    description:
      "Distributed solar leasing and grid analytics for industrial SMEs in Karachi and Lahore.",
    mission:
      "Lower energy cost and carbon intensity for SMEs through transparent metering and financed clean assets.",
    vision:
      "Industrial parks across South Asia run on measurable, dispatchable clean power, with financing that matches how factories actually use energy.",
    logoLetter: "D",
    engagementScore: 91,
    founder: {
      name: "Hassan Ali",
      role: "CEO",
      bio: "Ex-GE Power; focused on DER interoperability.",
    },
    funding: [
      {
        round: "Series B",
        amount: "$28M",
        date: "2026-02-02",
        investors: ["Lightspeed", "Lowercarbon"],
      },
    ],
  },
  {
    id: "4",
    slug: "kathmandu-ledger",
    name: "Kathmandu Ledger",
    country: "Nepal",
    sector: "Enterprise SaaS",
    stage: "Seed",
    description:
      "Compliance automation and e-invoicing for banks and insurers in Nepal and Bhutan.",
    mission:
      "Ship regulatory-grade invoicing and reconciliation APIs that banks can adopt without multi-year core replacements.",
    vision:
      "Cross-border and domestic settlement workflows default to machine-verifiable documents and real-time policy checks.",
    logoLetter: "K",
    engagementScore: 79,
    founder: {
      name: "Prajwal Shrestha",
      role: "Co-founder & CTO",
      bio: "Ex-Databricks; open-source contributor.",
    },
    funding: [
      { round: "Seed", amount: "$2.1M", date: "2025-11-15", investors: ["Global Founders Capital"] },
    ],
  },
];

export const newsItems: NewsItem[] = [
  {
    id: "n1",
    slug: "monsoon-pay-series-a",
    title: "Monsoon Pay closes $12M Series A to scale embedded payments",
    summary: "Round led by Sequoia India as the Dhaka fintech expands to Chittagong corridors.",
    category: "Funding",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    startupId: "1",
    trending: true,
    coverImage: "https://picsum.photos/seed/monsoonpay/1200/675",
    imageAlt: "Warm morning light across a busy Dhaka marketplace with people paying at a stall.",
    body: [
      "Monsoon Pay announced a $12 million Series A to deepen integrations with regional marketplaces and launch working-capital products for SMB sellers.",
      "The round was led by Sequoia India with participation from Wavemaker. CEO Nadia Rahman said the capital will fund hiring across risk, compliance, and partner success teams.",
      "The company claims transaction volume grew 4× year-over-year, with repeat usage in logistics and agritech cohorts. It also plans interoperable QR and wallet rails aligned with Bangladesh Bank directives.",
      "Strategically, Monsoon Pay is positioning as infrastructure (APIs for checkout, payouts, and reconciliation) rather than a standalone consumer wallet.",
    ],
    translations: {
      bn: {
        title: "এমবেডেড পেমেন্ট সম্প্রসারণে মনসুন পে ১২ মিলিয়ন ডলার সিরিজ এ যুগান্তকারী বিনিয়োগ সংগ্রহ করেছে",
        summary:
          "সিকোয়া ইন্ডিয়ার নেতৃত্বে রাউন্ড। ঢাকার এই ফিনটেক চট্টগ্রাম করিডোরে সম্প্রসারণ করছে।",
        body: [
          "মনসুন পে ১২ মিলিয়ন ডলারের সিরিজ এ রাউন্ড ঘোষণা করেছে আঞ্চলিক মার্কেটপ্লেসের গভীর ইন্টিগ্রেশন এবং ছোট ব্যবসার বিক্রেতাদের জন্য ওয়ার্কিং ক্যাপিটাল পণ্য চালু করার জন্য।",
          "রাউন্ডটি সিকোয়া ইন্ডিয়ার নেতৃত্বে এবং ওয়েভমেকারের অংশগ্রহণে সম্পন্ন। সিইও নাদিয়া রহমান বলেন, এই মূলধন ঝুঁকি, কমপ্লায়েন্স এবং পার্টনার সাফল্য দলে নিয়োগে যাবে।",
          "কোম্পানির দাবি, লজিস্টিকস ও অ্যাগ্রিটেক খণ্ডে লেনদেনের পরিমাণ বছরে ৪ গুণ বৃদ্ধি পেয়েছে। বাংলাদেশ ব্যাঙ্কের নির্দেশনার সঙ্গে সামঞ্জস্যপূর্ণ ইন্টারঅপারেবল কিউআর ও ওয়ালেট রেলও পরিকল্পনা রয়েছে।",
          "কৌশলগতভাবে মনসুন পে ইনফ্রাস্ট্রাকচার হিসেবে নিজেকে স্থাপন করছে। চেকআউট, পেআউট ও রিকনসিলিয়েশনের জন্য এপিআই। একটি স্বতন্ত্র ভোক্তা ওয়ালেট নয়।",
        ],
      },
      hi: {
        title: "मॉन्सून पे ने इन्फ्रास्ट्रक्चर भुगतान के विस्तार के लिए $12M सीरीज़ A जुटाई",
        summary:
          "सिक्वोआ इंडिया के नेतृत्व में राउंड। यह ढाका फिनटेक चटगाँव कारिडोर तक पहुँच रहा है।",
        body: [
          "मॉन्सून पे ने क्षेत्रीय मार्केटप्लेस के साथ गहरे इंटीग्रेशन और एसएमबी विक्रेताओं के लिए वर्किंग-कैपिटल उत्पाद लाने के लिए $12 मिलियन सीरीज़ A की घोषणा की।",
          "राउंड का नेतृत्व सिक्वोआ इंडिया ने किया, वेवमेकर ने हिस्सा लिया। सीईओ नादिया रहमान ने कहा कि पूँजी जोखिम, अनुपालन और पार्टनर सफलता टीमों में भर्ती में जाएगी।",
          "कंपनी का दावा है कि लॉजिस्टिक्स और एग्रीटेक समूहों में लेनदेन का आयतन साल-दर-साल 4 गुना बढ़ा। बांग्लादेश बैंक के निर्देशों के अनुरूप इंटरऑपरेबल क्यूआर और वॉलेट रेल्स भी योजनाबद्ध हैं।",
          "रणनीति के तौर पर मॉन्सून पे खुद को इन्फ्रास्ट्रक्चर के रूप में स्थापित कर रहा है। चेकआउट, भुगतान और समाधान के लिए API। न कि केवल एक उपभोक्ता वॉलेट।",
        ],
      },
    },
  },
  {
    id: "n2",
    slug: "lagoon-health-telehealth-pilot",
    title: "Lagoon Health expands telehealth pilot to three new districts",
    summary: "Drone-enabled pharmacy partners join the network as wait times drop 35%.",
    category: "Launch",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    startupId: "2",
    trending: true,
    coverImage: "https://picsum.photos/seed/lagoonhealth/1200/675",
    imageAlt: "A caregiver speaking kindly with a patient over video in a quiet home setting.",
    body: [
      "Lagoon Health is expanding its tele-diagnosis pilot across three additional districts after reporting a 35% drop in median wait times for specialist consults.",
      "Drone-enabled pharmacy partners are now integrated for chronic care refills, with SLA-backed delivery windows.",
      "Clinical governance includes mandatory escalation paths and audit logs shared with provincial regulators.",
    ],
  },
  {
    id: "n3",
    slug: "delta-grid-series-b",
    title: "Delta Grid lands $28M Series B for industrial solar leasing",
    summary: "Lightspeed leads as distributed energy uptake accelerates in Karachi and Lahore.",
    category: "Funding",
    publishedAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    startupId: "3",
    trending: true,
    coverImage: "https://picsum.photos/seed/deltagrid/1200/675",
    imageAlt: "Solar panels on an industrial rooftop at golden hour, suggesting sustainable scale.",
    body: [
      "Delta Grid has raised $28 million in Series B funding led by Lightspeed, with Lowercarbon joining to support DER analytics for industrial parks.",
      "CEO Hassan Ali emphasized interoperability with legacy metering and peak-shaving algorithms tuned for local tariff windows.",
    ],
  },
  {
    id: "n4",
    slug: "south-asia-saas-summit-2026",
    title: "South Asia SaaS Summit 2026 announces founder tracks in Colombo",
    summary: "Workshops on GTM, compliance exports, and cross-border hiring.",
    category: "Events",
    publishedAt: new Date(Date.now() - 52 * 60 * 60 * 1000).toISOString(),
    startupId: "4",
    coverImage: "https://picsum.photos/seed/saassummit/1200/675",
    imageAlt: "Founders networking in a bright conference hall during a product-focused workshop.",
    body: [
      "The South Asia SaaS Summit returns with founder-led tracks on pricing, compliance exports, and remote hiring patterns.",
      "Early-bird tickets open this week with scholarships for student founders.",
    ],
  },
  {
    id: "n5",
    slug: "kathmandu-ledger-compliance",
    title: "Kathmandu Ledger pilots e-invoicing automation with two national banks",
    summary: "API uptime hits 99.98% during parallel run ahead of regulator deadlines.",
    category: "Tech",
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    startupId: "4",
    trending: true,
    coverImage: "https://picsum.photos/seed/kathmanduledger/1200/675",
    imageAlt: "Abstract visualization of secure banking APIs and document flow across institutions.",
    body: [
      "Kathmandu Ledger began a controlled rollout with two national banks, reporting 99.98% API uptime during parallel operation.",
      "The platform bundles policy engines, reconciliation hooks, and anomaly detection tuned for cross-border settlement.",
    ],
  },
  {
    id: "n6",
    slug: "edtech-launch-chennai",
    title: "Regional edtech coalition launches shared credential graph",
    summary: "Founders from Chennai, Dhaka, and Lahore align on interoperable learner records.",
    category: "Launch",
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    startupId: "2",
    coverImage: "https://picsum.photos/seed/edtechgraph/1200/675",
    imageAlt: "Students collaborating around laptops, symbolizing shared learning credentials.",
    body: [
      "A coalition of edtech founders unveiled a shared credential graph aimed at employer verification across South Asia.",
      "Privacy-preserving proofs and selective disclosure are core to the design.",
    ],
  },
];

export const insights: InsightPost[] = [
  {
    id: "i1",
    slug: "cross-border-fintech-compliance-2026",
    title: "Cross-border fintech in 2026: the compliance map founders should watch",
    dek: "Licenses, correspondent rails, and data residency patterns across BD, LK, PK, NP, and IN.",
    readTime: "9 min",
    author: "Priya Menon",
    publishedAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    feeling:
      "The inbox noise is loud; this is the quieter map teams tape above their monitors when policy moves overnight.",
    mood: "Late-night clarity",
    moodKind: "clarity",
    pullQuote:
      "Regulatory humility isn’t retreat; it’s how you keep shipping when the goalposts are shared across borders.",
  },
  {
    id: "i2",
    slug: "climate-smes-financing-gap",
    title: "Why climate financing for SMEs still breaks in South Asia",
    dek: "Unit economics, offtake risk, and how DER installers are reframing ROI.",
    readTime: "7 min",
    author: "Omar Siddiqui",
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    feeling:
      "Hope and frustration share a desk here: the hardware works, the spreadsheets still don’t.",
    mood: "Honest momentum",
    moodKind: "hope",
    pullQuote:
      "If the story stops at ‘green,’ rural installers keep paying the emotional tax of explaining cashflow twice.",
  },
  {
    id: "i3",
    slug: "founder-loneliness-scaleups",
    title: "What changes when your startup crosses fifty people (and nobody warned you)",
    dek: "Decision latency, trusted lieutenants, and the grief of outgrowing your own rituals.",
    readTime: "11 min",
    author: "Meera Vasudevan",
    publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    feeling:
      "A love letter to the founders who miss the old chaos but can’t afford to romanticize it.",
    mood: "Quiet care",
    moodKind: "care",
    pullQuote:
      "Scaling isn’t losing your edge; it’s learning to feel lonely in a room that still cheers for you.",
  },
  {
    id: "i4",
    slug: "south-asia-hiring-remote-trust",
    title: "Remote hiring across South Asia: trust patterns that actually hold",
    dek: "Time zones, proof-of-work rituals, and how teams rebuild social fabric on video.",
    readTime: "8 min",
    author: "Faizan Chaudhry",
    publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    feeling:
      "We wrote this after three founders admitted they’d cried after stand-ups, not from conflict, from relief.",
    mood: "Human signals",
    moodKind: "tension",
    pullQuote:
      "Trust isn’t a policy PDF; it’s the tone someone uses when a deadline slips and shame shows up first.",
  },
];

export function getStartupById(id: string) {
  return startups.find((s) => s.id === id);
}

export function getStartupBySlug(slug: string) {
  return startups.find((s) => s.slug === slug);
}

export function getNewsBySlug(slug: string) {
  return newsItems.find((n) => n.slug === slug);
}

export function formatRelativeTime(iso: string) {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 48) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function trendingStartups(limit = 10) {
  return [...startups].sort((a, b) => b.engagementScore - a.engagementScore).slice(0, limit);
}

export function newsForStartup(startupId: string) {
  return newsItems.filter((n) => n.startupId === startupId);
}
