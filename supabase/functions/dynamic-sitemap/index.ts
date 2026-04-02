import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const SITE = "https://www.lazyunicorn.ai";
const TODAY = new Date().toISOString().slice(0, 10);

const STATIC_PAGES = [
  { loc: "/", changefreq: "daily", priority: "1.0" },
  { loc: "/blog", changefreq: "daily", priority: "0.8" },
  { loc: "/pricing", changefreq: "monthly", priority: "0.8" },
  { loc: "/about", changefreq: "monthly", priority: "0.8" },
  { loc: "/how-it-works", changefreq: "monthly", priority: "0.8" },
  { loc: "/use-cases", changefreq: "monthly", priority: "0.8" },
  { loc: "/autonomy", changefreq: "monthly", priority: "0.8" },
  { loc: "/changelog", changefreq: "weekly", priority: "0.8" },
  { loc: "/upgrade-guide", changefreq: "monthly", priority: "0.8" },
  { loc: "/listen", changefreq: "weekly", priority: "0.8" },
  { loc: "/seo-blog", changefreq: "daily", priority: "0.8" },
  { loc: "/geo-blog", changefreq: "daily", priority: "0.8" },
  { loc: "/streams", changefreq: "weekly", priority: "0.8" },
  { loc: "/waitlist", changefreq: "monthly", priority: "0.8" },
  { loc: "/docs", changefreq: "weekly", priority: "0.8" },
];

const PRODUCT_PAGES = [
  "/lazy-run", "/lazy-admin", "/lazy-blogger", "/lazy-seo", "/lazy-geo",
  "/lazy-crawl", "/lazy-perplexity", "/lazy-contentful",
  "/lazy-store", "/lazy-pay", "/lazy-sms", "/lazy-mail",
  "/lazy-voice", "/lazy-stream", "/lazy-launch", "/lazy-cloud",
  "/lazy-github", "/lazy-gitlab", "/lazy-linear", "/lazy-design", "/lazy-auth",
  "/lazy-alert", "/lazy-telegram", "/lazy-supabase", "/lazy-security",
  "/lazy-agents", "/lazy-youtube", "/lazy-granola",
  "/lazy-watch", "/lazy-fix", "/lazy-build", "/lazy-intel",
  "/lazy-repurpose", "/lazy-trend", "/lazy-churn",
  "/lazy-waitlist", "/lazy-drop", "/lazy-print",
];

function urlEntry(loc: string, lastmod: string, changefreq: string, priority: string) {
  return `  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const sb = createClient(supabaseUrl, supabaseKey);

  const entries: string[] = [];

  for (const p of STATIC_PAGES) {
    entries.push(urlEntry(p.loc, TODAY, p.changefreq, p.priority));
  }

  for (const loc of PRODUCT_PAGES) {
    entries.push(urlEntry(loc, TODAY, "weekly", "0.8"));
  }

  // Blog posts
  const { data: blogPosts } = await sb
    .from("blog_posts")
    .select("slug, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  for (const p of blogPosts || []) {
    const mod = p.published_at ? p.published_at.slice(0, 10) : TODAY;
    entries.push(urlEntry(`/blog/${p.slug}`, mod, "monthly", "0.6"));
  }

  // SEO posts
  const { data: seoPosts } = await sb
    .from("seo_posts")
    .select("slug, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  for (const p of seoPosts || []) {
    const mod = p.published_at ? p.published_at.slice(0, 10) : TODAY;
    entries.push(urlEntry(`/seo-blog/${p.slug}`, mod, "monthly", "0.6"));
  }

  // GEO posts
  const { data: geoPosts } = await sb
    .from("geo_posts")
    .select("slug, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  for (const p of geoPosts || []) {
    const mod = p.published_at ? p.published_at.slice(0, 10) : TODAY;
    entries.push(urlEntry(`/geo-blog/${p.slug}`, mod, "monthly", "0.6"));
  }

  // Stream content
  const { data: streamContent } = await sb
    .from("stream_content")
    .select("slug, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  for (const p of streamContent || []) {
    const mod = p.published_at ? p.published_at.slice(0, 10) : TODAY;
    entries.push(urlEntry(`/streams/${p.slug}`, mod, "monthly", "0.6"));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
