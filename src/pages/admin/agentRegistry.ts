// Agent Registry — maps every LazyUnicorn agent to its config

export type AgentCategory = "Content" | "Commerce" | "Media" | "Dev" | "Monitor" | "Intelligence";

export interface AgentAction {
  label: string;
  fn: string;
  primary?: boolean;
}

export interface AgentStatDef {
  label: string;
  table: string;
  type: "count" | "count_today" | "count_week";
  dateField?: string;
}

export interface AgentConfig {
  key: string;
  label: string;
  slug: string;
  category: AgentCategory;
  settingsTable: string;
  runField: string;
  contentTable?: string;
  errorTable?: string;
  subtitle: string;
  actions: AgentAction[];
  stats: AgentStatDef[];
  requiredSecrets?: { field: string; label: string }[];
  settingsFields?: string[];
}

export const CATEGORIES: AgentCategory[] = [
  "Content", "Commerce", "Media", "Dev", "Monitor", "Intelligence",
];

export const CATEGORY_AGENTS: Record<AgentCategory, string[]> = {
  Content: ["blogger", "seo", "geo", "crawl", "perplexity", "repurpose", "trend"],
  Commerce: ["store", "drop", "print", "pay", "mail", "sms", "churn"],
  Media: ["voice", "stream", "youtube"],
  Dev: ["code", "gitlab", "linear", "contentful", "design", "auth", "granola"],
  Monitor: ["alert", "telegram", "supabase", "security", "watch"],
  Intelligence: ["fix", "build", "intel", "agents"],
};

export const AGENTS: AgentConfig[] = [
  // ── Content ──
  {
    key: "blogger", label: "Blogger", slug: "blogger", category: "Content",
    settingsTable: "blog_settings", runField: "is_publishing", contentTable: "blog_posts", errorTable: "blog_errors",
    subtitle: "Autonomous blog post generation across all products",
    actions: [
      { label: "PUBLISH NOW →", fn: "auto-publish-blog", primary: true },
    ],
    stats: [
      { label: "Posts today", table: "blog_posts", type: "count_today", dateField: "created_at" },
      { label: "Posts this week", table: "blog_posts", type: "count_week", dateField: "created_at" },
      { label: "SEO posts total", table: "seo_posts", type: "count" },
      { label: "GEO posts total", table: "geo_posts", type: "count" },
    ],
  },
  {
    key: "seo", label: "SEO", slug: "seo", category: "Content",
    settingsTable: "seo_settings", runField: "is_running", contentTable: "seo_posts", errorTable: "seo_errors",
    subtitle: "Search engine optimisation content engine",
    actions: [
      { label: "PUBLISH NOW →", fn: "lazy-seo-publish", primary: true },
      { label: "DISCOVER KEYWORDS", fn: "lazy-seo-analyse" },
    ],
    stats: [
      { label: "Posts published", table: "seo_posts", type: "count" },
      { label: "Keywords found", table: "seo_keywords", type: "count" },
    ],
  },
  {
    key: "geo", label: "GEO", slug: "geo", category: "Content",
    settingsTable: "geo_settings", runField: "is_running", contentTable: "geo_posts", errorTable: "geo_errors",
    subtitle: "Generative engine optimisation for AI search",
    actions: [
      { label: "PUBLISH NOW →", fn: "lazy-geo-publish", primary: true },
      { label: "DISCOVER QUERIES", fn: "lazy-geo-discover" },
      { label: "TEST CITATIONS", fn: "lazy-geo-test" },
    ],
    stats: [
      { label: "Posts published", table: "geo_posts", type: "count" },
      { label: "Queries found", table: "geo_queries", type: "count" },
    ],
  },
  {
    key: "crawl", label: "Crawl", slug: "crawl", category: "Content",
    settingsTable: "crawl_settings", runField: "is_running", errorTable: "crawl_errors",
    subtitle: "Web crawling and intelligence extraction",
    actions: [{ label: "CRAWL NOW →", fn: "crawl-run", primary: true }, { label: "PUBLISH INTEL", fn: "crawl-publish" }],
    stats: [], requiredSecrets: [],
  },
  {
    key: "perplexity", label: "Perplexity", slug: "perplexity", category: "Content",
    settingsTable: "perplexity_settings", runField: "is_running", errorTable: "perplexity_errors",
    subtitle: "AI-powered research and citation monitoring",
    actions: [{ label: "RESEARCH NOW →", fn: "perplexity-research", primary: true }, { label: "TEST CITATIONS", fn: "perplexity-test-citations" }],
    stats: [],
  },
  {
    key: "repurpose", label: "Repurpose", slug: "repurpose", category: "Content",
    settingsTable: "repurpose_settings", runField: "is_running", errorTable: "repurpose_errors",
    subtitle: "Transform content across formats and channels",
    actions: [{ label: "RUN NOW →", fn: "repurpose-run", primary: true }],
    stats: [],
  },
  {
    key: "trend", label: "Trend", slug: "trend", category: "Content",
    settingsTable: "trend_settings", runField: "is_running", errorTable: "trend_errors",
    subtitle: "Trending topic discovery and content seeding",
    actions: [{ label: "SCAN NOW →", fn: "trend-scan", primary: true }, { label: "SEED AGENTS", fn: "trend-seed" }],
    stats: [],
  },

  // ── Commerce ──
  {
    key: "store", label: "Store", slug: "store", category: "Commerce",
    settingsTable: "store_settings", runField: "is_running", errorTable: "store_errors",
    subtitle: "Product listing and conversion optimisation",
    actions: [{ label: "DISCOVER →", fn: "store-discover", primary: true }, { label: "OPTIMISE", fn: "store-optimise" }],
    stats: [],
  },
  {
    key: "drop", label: "Drop", slug: "drop", category: "Commerce",
    settingsTable: "drop_settings", runField: "is_running", errorTable: "drop_errors",
    subtitle: "Dropshipping product sync and content",
    actions: [{ label: "SYNC NOW →", fn: "drop-sync", primary: true }, { label: "PUBLISH CONTENT", fn: "drop-content" }],
    stats: [],
  },
  {
    key: "print", label: "Print", slug: "print", category: "Commerce",
    settingsTable: "print_settings", runField: "is_running", errorTable: "print_errors",
    subtitle: "Print-on-demand product sync and content",
    actions: [{ label: "SYNC NOW →", fn: "print-sync", primary: true }, { label: "PUBLISH CONTENT", fn: "print-content" }],
    stats: [],
  },
  {
    key: "pay", label: "Pay", slug: "pay", category: "Commerce",
    settingsTable: "pay_settings", runField: "is_running", errorTable: "pay_errors",
    subtitle: "Payment processing and revenue optimisation",
    actions: [{ label: "OPTIMISE NOW →", fn: "pay-optimise", primary: true }, { label: "RUN RECOVERY", fn: "pay-recover" }],
    stats: [],
    requiredSecrets: [{ field: "stripe_secret_key", label: "Stripe Secret Key" }],
  },
  {
    key: "mail", label: "Mail", slug: "mail", category: "Commerce",
    settingsTable: "mail_settings", runField: "is_running", errorTable: "mail_errors",
    subtitle: "Email campaigns and subscriber management",
    actions: [{ label: "SEND CAMPAIGN →", fn: "mail-campaign", primary: true }, { label: "OPTIMISE", fn: "mail-optimise" }],
    stats: [],
    requiredSecrets: [{ field: "resend_api_key", label: "Resend API Key" }],
  },
  {
    key: "sms", label: "SMS", slug: "sms", category: "Commerce",
    settingsTable: "sms_settings", runField: "is_running", errorTable: "sms_errors",
    subtitle: "SMS sequences and delivery management",
    actions: [{ label: "RUN SEQUENCES →", fn: "sms-sequences-run", primary: true }, { label: "OPTIMISE", fn: "sms-optimise" }],
    stats: [],
    requiredSecrets: [{ field: "twilio_account_sid", label: "Twilio Account SID" }],
  },
  {
    key: "churn", label: "Churn", slug: "churn", category: "Commerce",
    settingsTable: "churn_settings", runField: "is_running", errorTable: "churn_errors",
    subtitle: "Churn detection and retention automation",
    actions: [{ label: "ANALYSE NOW →", fn: "churn-analyse", primary: true }],
    stats: [],
  },

  // ── Media ──
  {
    key: "voice", label: "Voice", slug: "voice", category: "Media",
    settingsTable: "voice_settings", runField: "is_running", contentTable: "voice_episodes", errorTable: "voice_errors",
    subtitle: "Text-to-speech podcast generation",
    actions: [{ label: "NARRATE NOW →", fn: "voice-generate", primary: true }],
    stats: [
      { label: "Episodes generated", table: "voice_episodes", type: "count" },
    ],
    requiredSecrets: [{ field: "elevenlabs_api_key", label: "ElevenLabs API Key" }],
  },
  {
    key: "stream", label: "Stream", slug: "stream", category: "Media",
    settingsTable: "stream_settings", runField: "is_running", contentTable: "stream_content", errorTable: "stream_errors",
    subtitle: "Live stream processing and content extraction",
    actions: [{ label: "PROCESS LAST STREAM →", fn: "stream-process", primary: true }],
    stats: [
      { label: "Streams processed", table: "stream_sessions", type: "count" },
      { label: "Content published", table: "stream_content", type: "count" },
    ],
  },
  {
    key: "youtube", label: "YouTube", slug: "youtube", category: "Media",
    settingsTable: "youtube_settings", runField: "is_running", errorTable: "youtube_errors",
    subtitle: "YouTube channel sync and comment extraction",
    actions: [{ label: "SYNC NOW →", fn: "youtube-sync", primary: true }, { label: "FETCH COMMENTS", fn: "youtube-extract-comments" }],
    stats: [],
    requiredSecrets: [{ field: "youtube_channel_id", label: "YouTube Channel ID" }],
  },

  // ── Dev ──
  {
    key: "code", label: "Code", slug: "code", category: "Dev",
    settingsTable: "code_settings", runField: "is_running", errorTable: "code_errors",
    subtitle: "Repository commit analysis and roadmap sync",
    actions: [{ label: "SYNC ROADMAP →", fn: "code-sync-roadmap", primary: true }],
    stats: [],
  },
  {
    key: "gitlab", label: "GitLab", slug: "gitlab", category: "Dev",
    settingsTable: "gitlab_settings", runField: "is_running", errorTable: "gitlab_errors",
    subtitle: "GitLab commit and MR processing",
    actions: [{ label: "SYNC ROADMAP →", fn: "gitlab-sync-roadmap", primary: true }],
    stats: [],
    requiredSecrets: [{ field: "gitlab_url", label: "GitLab URL" }, { field: "gitlab_token", label: "GitLab Token" }],
  },
  {
    key: "linear", label: "Linear", slug: "linear", category: "Dev",
    settingsTable: "linear_settings", runField: "is_running", errorTable: "linear_errors",
    subtitle: "Linear issue sync and velocity reports",
    actions: [{ label: "SYNC NOW →", fn: "linear-sync-all", primary: true }, { label: "VELOCITY REPORT", fn: "linear-velocity-report" }],
    stats: [],
    requiredSecrets: [{ field: "linear_api_key", label: "Linear API Key" }],
  },
  {
    key: "contentful", label: "Contentful", slug: "contentful", category: "Dev",
    settingsTable: "contentful_settings", runField: "is_running", errorTable: "contentful_errors",
    subtitle: "Contentful CMS pull and push sync",
    actions: [{ label: "PULL NOW →", fn: "contentful-pull", primary: true }, { label: "PUSH NOW", fn: "contentful-push" }],
    stats: [],
    requiredSecrets: [{ field: "contentful_space_id", label: "Contentful Space ID" }],
  },
  {
    key: "design", label: "Design", slug: "design", category: "Dev",
    settingsTable: "design_settings", runField: "is_running", errorTable: "design_errors",
    subtitle: "Design system upgrade automation",
    actions: [{ label: "RUN UPGRADE →", fn: "design-upgrade", primary: true }],
    stats: [],
  },
  {
    key: "auth", label: "Auth", slug: "auth", category: "Dev",
    settingsTable: "auth_settings", runField: "is_running", errorTable: "auth_errors",
    subtitle: "User management and role administration",
    actions: [],
    stats: [],
  },
  {
    key: "granola", label: "Granola", slug: "granola", category: "Dev",
    settingsTable: "granola_settings", runField: "is_running", contentTable: "granola_outputs", errorTable: "granola_errors",
    subtitle: "Meeting intelligence and content extraction",
    actions: [{ label: "SYNC NOW →", fn: "granola-sync", primary: true }, { label: "PUBLISH CONTENT", fn: "granola-write-post" }],
    stats: [
      { label: "Meetings synced", table: "granola_meetings", type: "count" },
      { label: "Content published", table: "granola_outputs", type: "count" },
    ],
  },

  // ── Monitor ──
  {
    key: "alert", label: "Alert", slug: "alert", category: "Monitor",
    settingsTable: "alert_settings", runField: "is_running", errorTable: "alert_errors",
    subtitle: "Multi-channel alert dispatching",
    actions: [{ label: "SEND TEST →", fn: "alert-test", primary: true }, { label: "BRIEFING NOW", fn: "alert-briefing" }],
    stats: [],
  },
  {
    key: "telegram", label: "Telegram", slug: "telegram", category: "Monitor",
    settingsTable: "telegram_settings", runField: "is_running", errorTable: "telegram_errors",
    subtitle: "Telegram bot notifications and briefings",
    actions: [{ label: "SEND TEST →", fn: "telegram-test", primary: true }, { label: "BRIEFING NOW", fn: "telegram-briefing" }],
    stats: [],
  },
  {
    key: "supabase-agent", label: "Supabase", slug: "supabase", category: "Monitor",
    settingsTable: "supabase_settings", runField: "is_running", errorTable: "supabase_errors",
    subtitle: "Supabase usage monitoring and milestone tracking",
    actions: [{ label: "CHECK NOW →", fn: "supabase-monitor", primary: true }, { label: "WEEKLY REPORT", fn: "supabase-weekly-report" }],
    stats: [],
  },
  {
    key: "security", label: "Security", slug: "security", category: "Monitor",
    settingsTable: "security_settings", runField: "is_running", errorTable: "security_errors",
    subtitle: "Automated pentesting and vulnerability scanning",
    actions: [{ label: "RUN PENTEST →", fn: "security-scan", primary: true }, { label: "QUICK SCAN", fn: "security-monitor" }],
    stats: [],
    requiredSecrets: [{ field: "aikido_project_id", label: "Aikido Project ID" }],
  },
  {
    key: "watch", label: "Watch", slug: "watch", category: "Monitor",
    settingsTable: "watch_settings", runField: "is_running", errorTable: "watch_errors",
    subtitle: "Agent health monitoring and issue creation",
    actions: [{ label: "RUN NOW →", fn: "watch-monitor", primary: true }],
    stats: [],
    requiredSecrets: [{ field: "github_token", label: "GitHub Token" }],
  },

  // ── Intelligence ──
  {
    key: "fix", label: "Fix", slug: "fix", category: "Intelligence",
    settingsTable: "fix_settings", runField: "is_running", errorTable: "fix_errors",
    subtitle: "Automated error analysis and fix PRs",
    actions: [{ label: "RUN NOW →", fn: "fix-analyse", primary: true }],
    stats: [],
    requiredSecrets: [{ field: "github_token", label: "GitHub Token" }],
  },
  {
    key: "build", label: "Build", slug: "build", category: "Intelligence",
    settingsTable: "build_settings", runField: "is_running", errorTable: "build_errors",
    subtitle: "New agent builder and scaffolding",
    actions: [{ label: "BUILD NEW AGENT →", fn: "build-engine", primary: true }],
    stats: [],
    requiredSecrets: [{ field: "github_token", label: "GitHub Token" }],
  },
  {
    key: "intel", label: "Intel", slug: "intel", category: "Intelligence",
    settingsTable: "intel_settings", runField: "is_running", errorTable: "intel_errors",
    subtitle: "Weekly intelligence reports and topic seeding",
    actions: [{ label: "RUN NOW →", fn: "intel-weekly", primary: true }, { label: "SEED AGENTS", fn: "intel-seed" }],
    stats: [],
  },
  {
    key: "agents", label: "Agents", slug: "agents", category: "Intelligence",
    settingsTable: "agent_settings", runField: "is_running", errorTable: "agent_errors",
    subtitle: "Meta-agent orchestration and self-improvement",
    actions: [{ label: "RUN ALL NOW →", fn: "agents-run-all", primary: true }],
    stats: [],
    requiredSecrets: [{ field: "github_token", label: "GitHub Token" }],
  },
];

export const TOTAL_AGENTS = 36;

export function getAgentBySlug(slug: string): AgentConfig | undefined {
  return AGENTS.find((a) => a.slug === slug);
}

export function getAgentsByCategory(category: AgentCategory | "All"): AgentConfig[] {
  if (category === "All") return AGENTS;
  return AGENTS.filter((a) => a.category === category);
}
