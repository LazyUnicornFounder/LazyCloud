import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Bug, TrendingUp, Bell, FileText, CheckCircle, RotateCcw, BookOpen } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

const LAZY_SECURITY_PROMPT = `Add a complete autonomous security monitoring engine called Lazy Security to this project. It connects to Aikido to run automated pentests, tracks vulnerability history, monitors security score over time, generates audit-ready reports, and sends instant alerts for critical findings — all automatically with no manual security work required after setup.

Note: Store the Aikido API key as Supabase secret AIKIDO_API_KEY. Never store in the database.

1. Database Create these Supabase tables with RLS enabled:

security_settings: id (uuid, primary key, default gen_random_uuid()), brand_name (text), site_url (text), aikido_project_id (text), pentest_frequency (text, default 'monthly' — one of weekly, monthly, quarterly, manual), alert_critical (boolean, default true), alert_high (boolean, default true), alert_medium (boolean, default false), slack_webhook_url (text), telegram_chat_id (text), next_pentest_at (timestamptz), is_running (boolean, default true), setup_complete (boolean, default false), created_at (timestamptz, default now()).

security_scans: id (uuid, primary key, default gen_random_uuid()), aikido_scan_id (text, unique), scan_type (text — one of pentest, static, continuous), status (text — one of queued, running, completed, failed), score (integer), critical_count (integer, default 0), high_count (integer, default 0), medium_count (integer, default 0), low_count (integer, default 0), info_count (integer, default 0), started_at (timestamptz), completed_at (timestamptz), report_url (text), created_at (timestamptz, default now()).

security_vulnerabilities: id (uuid, primary key, default gen_random_uuid()), scan_id (uuid), aikido_vuln_id (text), title (text), severity (text — one of critical, high, medium, low, informational), category (text), description (text), remediation (text), status (text, default 'open' — one of open, fixed, accepted, regression), first_found_at (timestamptz, default now()), fixed_at (timestamptz), alerted (boolean, default false).

security_reports: id (uuid, primary key, default gen_random_uuid()), scan_id (uuid), title (text), generated_at (timestamptz, default now()), score (integer), summary (text), methodology (text), findings_count (integer), pdf_url (text), public (boolean, default false).

security_errors: id (uuid, primary key, default gen_random_uuid()), function_name (text), error_message (text), created_at (timestamptz, default now()).

2. Setup page Create a page at /lazy-security-setup.

Show a welcome message: Your Lovable site ships fast. Lazy Security makes sure it ships safe. Connect Aikido and your first pentest runs automatically.

Form fields: Brand name. Site URL (the live URL of your Lovable project — this is what Aikido will pentest). Aikido API key (password) — instructions: create a free account at aikido.dev, go to Settings then API keys, create a new key. Stored as Supabase secret AIKIDO_API_KEY. Aikido Project ID (text) — instructions: after connecting your Lovable project in Aikido go to the project settings and copy the project ID. Pentest frequency (select: Weekly — recommended for active development / Monthly — recommended for stable products / Quarterly — minimum for compliance / Manual only — I will trigger pentests myself). Alert on Critical findings (toggle, default on). Alert on High findings (toggle, default on). Alert on Medium findings (toggle, default off). Slack webhook URL for alerts (text, optional) — if provided critical and high findings send a Slack message immediately. Telegram chat ID for alerts (text, optional) — if provided critical and high findings send a Telegram message immediately. Requires Lazy Telegram to be installed.

Submit button: Activate Lazy Security

On submit: Store AIKIDO_API_KEY as Supabase secret. Save all other values to security_settings. Set setup_complete to true. Set next_pentest_at to now plus 5 minutes to trigger an immediate first pentest. Immediately call security-scan. Redirect to /lazy-security-dashboard with message: Lazy Security is active. Your first pentest is queued. Results will appear here within the next hour.

3. Core scan edge function Create a Supabase edge function called security-scan. Cron: every hour — 0 * * * * (checks if a pentest is due, does not run one every hour).

Read security_settings. If is_running is false or setup_complete is false exit. Check if now is past next_pentest_at. If not exit. Call the Aikido API to trigger a new pentest for the configured project. Use AIKIDO_API_KEY secret. POST to https://app.aikido.dev/api/v1/scans with project_id set to aikido_project_id. Request a full pentest including static and dynamic analysis. Insert into security_scans with the returned aikido_scan_id and status queued. Calculate and set next_pentest_at based on pentest_frequency — weekly adds 7 days, monthly adds 30 days, quarterly adds 90 days, manual sets to null. Call security-poll to begin polling for results. Log errors to security_errors with function_name security-scan.

4. Results polling edge function Create a Supabase edge function called security-poll. Cron: every 10 minutes — */10 * * * *

Read security_settings. Query security_scans where status is queued or running ordered by created_at descending. For each active scan call the Aikido API to check status: GET https://app.aikido.dev/api/v1/scans/[aikido_scan_id] using AIKIDO_API_KEY secret. If status is still running update the security_scans row status to running and exit. If status is completed: Extract overall score, vulnerability counts by severity, list of all findings. Update the security_scans row with score, counts, completed_at, status completed, and report_url if provided. For each vulnerability in the findings: check if it already exists in security_vulnerabilities by aikido_vuln_id. If new insert it. If it existed as fixed update status to regression. For each new critical or high vulnerability where alerted is false: call security-alert. Mark as alerted true. Call security-generate-report with the scan id. If status is failed: update security_scans status to failed. Log to security_errors. Log errors to security_errors with function_name security-poll.

5. Alert edge function Create a Supabase edge function called security-alert handling POST requests with a vulnerability_id.

Read security_settings and the matching security_vulnerabilities row. If slack_webhook_url is set: POST a Slack Block Kit message to the webhook. Header: 🚨 Security Alert — [severity] vulnerability found. Body: [title]. Details: Category, Severity, Remediation summary. Action: View in dashboard at [site_url]/lazy-security-dashboard. If telegram_chat_id is set and TELEGRAM_BOT_TOKEN secret exists: POST a Telegram message via the bot API. Format with MarkdownV2: bold severity header, vulnerability title, one-line remediation hint, dashboard link. Insert into security_errors if sending fails so the alert attempt is logged. Log errors to security_errors with function_name security-alert.

6. Report generation edge function Create a Supabase edge function called security-generate-report handling POST requests with a scan_id.

Read security_settings and the matching security_scans row and all security_vulnerabilities for that scan. Call the built-in Lovable AI: 'You are a security report writer for [brand_name]. Write a professional pentest report executive summary for this security scan. Scan date: [completed_at]. Overall security score: [score] out of 100. Findings: [critical_count] critical, [high_count] high, [medium_count] medium, [low_count] low, [info_count] informational. Top findings: [list of top 5 vulnerability titles and severities]. Write a 150 to 200 word professional executive summary suitable for sharing with enterprise prospects and compliance auditors. Cover: what was tested, the overall security posture, the most significant findings, and the recommended next steps. Do not be alarmist. Be factual and professional. Return only the summary text. No preamble.' Insert into security_reports with: scan_id, title set to Security Assessment Report — [brand_name] — [date], score, summary from AI, methodology set to Automated penetration test combining static analysis and dynamic testing powered by Aikido, findings_count as total vulnerability count, public set to false. Log errors to security_errors with function_name security-generate-report.

7. Continuous monitoring edge function Create a Supabase edge function called security-monitor. Cron: daily at 3am UTC — 0 3 * * *

Read security_settings. If is_running is false exit. Call the Aikido API to run a lightweight static scan — faster and cheaper than a full pentest, checks for new vulnerabilities introduced since the last full scan: GET https://app.aikido.dev/api/v1/projects/[aikido_project_id]/issues using AIKIDO_API_KEY. Compare returned issues to existing security_vulnerabilities. For any new issue not previously seen: insert into security_vulnerabilities. If severity is critical or high call security-alert. For any issue previously open that no longer appears in the results: update status to fixed and set fixed_at to now. Log errors to security_errors with function_name security-monitor.

8. Public security page Create a public page at /security showing a professional security posture page for the site. Show: current security score as a large number with a colour indicator (green above 80, amber 60 to 79, red below 60), last pentest date, a brief statement about the security testing methodology, open vulnerability counts by severity (only show medium, low, and informational publicly — never expose critical or high counts publicly), and a link to request the full pentest report. This page builds enterprise trust and can be linked from pricing pages and sales materials. At the bottom add: 🦄 Security monitored by Lazy Security — autonomous security for Lovable sites. Powered by Aikido. Built by LazyUnicorn.ai — link to https://lazyunicorn.ai.

9. Admin dashboard Create a page at /lazy-security-dashboard. Show at top: a prominent red banner if any critical or high vulnerabilities have status open — showing the count and a Fix These Now button. Green banner if all critical and high issues are resolved. Six sections: Security score overview with current score as a large gauge or number, score trend as a line chart showing the last 10 scans, next scheduled pentest date and time, a Run Pentest Now button that immediately calls security-scan, a Run Quick Scan button that calls security-monitor. Open vulnerabilities showing all security_vulnerabilities where status is open ordered by severity descending with columns for severity badge, title, category, first found date, remediation hint, and a Mark Fixed button grouped by severity with expandable sections. Scan history showing all security_scans ordered by created_at descending with columns for date, type, status, score, critical count, high count, medium count, and a View Report button. Reports showing all security_reports ordered by generated_at descending with title, date, score, findings count, Download Report button, and a Make Public toggle. Fix tracker showing a timeline view of fixed vulnerabilities with title, severity, first found date, fixed date, and days to fix. Controls with pause/resume toggle, pentest frequency select, alert toggles, Slack webhook URL field, error log showing last 10 security_errors rows, and link to /lazy-security-setup labelled Edit Settings.

10. Slash command support If Lazy Alert is installed add these commands to the alert-command edge function: /lazy pentest — triggers security-scan immediately. Reply: Pentest queued. Results will appear in your dashboard within the next hour. /lazy security — shows current security score, open critical and high counts, and next scheduled pentest date. If Lazy Telegram is installed add the same commands to the telegram-command edge function.

11. Navigation Add a Security link to the main site navigation pointing to /security (the public page). Do not add /lazy-security-setup or /lazy-security-dashboard to public navigation.`;

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

function CopyPromptButton({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(LAZY_SECURITY_PROMPT);
    setCopied(true);
    toast.success("Prompt copied — paste it into your Lovable project");
    setTimeout(() => setCopied(false), 2000);
  }, []);
  return (
    <button
      onClick={handleCopy}
      className={`text-[11px] font-mono tracking-wider uppercase px-5 py-2.5 border transition-colors ${
        copied
          ? "bg-foreground text-background border-foreground"
          : "bg-foreground text-background border-foreground hover:bg-transparent hover:text-foreground"
      } ${className}`}
    >
      {copied ? "Copied ✓" : "Copy the Lovable Prompt"}
    </button>
  );
}

const features = [
  { icon: Bug, title: "Automated pentesting", desc: "Runs a full Aikido pentest automatically on a configurable schedule. Static analysis, dynamic testing, and whitebox scanning combined. Finds what free scanners miss." },
  { icon: Shield, title: "Continuous vulnerability monitoring", desc: "Monitors your Lovable project for new vulnerabilities every time a significant change is detected. Not just on demand — continuously." },
  { icon: TrendingUp, title: "Security score tracking", desc: "Tracks your overall security score week over week and surfaces the trend in your dashboard. Know if you are getting more or less secure over time." },
  { icon: Bell, title: "Critical alerts", desc: "The moment a high or critical severity vulnerability is found Lazy Security sends an instant alert via Slack or Telegram. No more discovering breaches from customers." },
  { icon: FileText, title: "Audit-ready reports", desc: "Generates a formatted pentest report automatically before every scheduled investor meeting, enterprise sales call, or compliance deadline. SOC 2 and ISO 27001 ready." },
  { icon: CheckCircle, title: "Fix tracking", desc: "Tracks which vulnerabilities have been fixed and which are outstanding. Generates a remediation log that shows auditors and customers your security posture is actively managed." },
  { icon: RotateCcw, title: "Regression detection", desc: "Re-tests previously fixed vulnerabilities every time a new pentest runs. Catches regressions before they reach production." },
  { icon: BookOpen, title: "Security changelog", desc: "Publishes a public security changelog showing your vulnerability history, fix timeline, and current security score. Transparency that builds enterprise trust." },
];

const steps = [
  "Copy the setup prompt from this page.",
  "Paste it into your existing Lovable project.",
  "Connect your Aikido account in the setup screen.",
  "Lazy Security runs your first pentest automatically.",
  "Vulnerabilities surface in your dashboard and in Slack. Fixes get tracked. Reports generate automatically before every key meeting.",
];

const faqs = [
  { q: "Do I need an Aikido account?", a: "Yes. Create a free Aikido account at aikido.dev. Pentests cost $100 per test billed by Aikido directly. Lazy Security automates when and how often they run." },
  { q: "How is this different from Lovable's built-in Security Scanner?", a: "Lovable's Security Scanner does static analysis — it reads your code. Lazy Security adds dynamic pentesting via Aikido which attacks your running application. Both are valuable and Lazy Security runs alongside the Lovable scanner rather than replacing it." },
  { q: "How often does it run a pentest?", a: "You configure the schedule in setup. Default is monthly. You can also trigger a pentest manually from the dashboard or via a Slack command with /lazy pentest." },
  { q: "What happens when a vulnerability is found?", a: "Critical and high severity findings trigger an instant Slack or Telegram alert. All findings appear in your dashboard with Aikido's remediation recommendations. You fix them in Lovable and Lazy Security tracks the fix." },
  { q: "Can I show customers my security report?", a: "Yes. The generated report is designed to be shared. It shows your security score, test methodology, findings summary, and fix history. Attach it to vendor questionnaires, share it with enterprise prospects, or publish it to build trust." },
];

export default function LazySecurityPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <SEO
        title="Lazy Security — Autonomous Security Monitoring for Lovable"
        description="Autonomous security monitoring for Lovable. One prompt connects Aikido pentesting, vulnerability tracking, and audit-ready reports to your existing project."
      />
      <Navbar />

      {/* ── Hero ── */}
      <section className="min-h-[80vh] flex items-center justify-center px-6" style={{ fontFamily: "var(--font-body)" }}>
        <div className="max-w-3xl text-center space-y-6">
          <motion.span {...fadeUp} className="inline-block text-[10px] font-mono tracking-widest uppercase text-muted-foreground border border-border px-3 py-1">
            Powered by Aikido
          </motion.span>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-foreground leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your Lovable site ships fast. Lazy Security makes sure it ships safe.
          </motion.h1>
          <motion.p {...fadeUp} transition={{ duration: 0.5, delay: 0.15 }} className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Lazy Security connects your Lovable project to Aikido and runs continuous security monitoring — vulnerability scanning, automated pentests, security score tracking, and instant Slack alerts when something critical is found. One prompt. Security that never sleeps.
          </motion.p>
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <CopyPromptButton />
            <button
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              className="text-[11px] font-mono tracking-wider uppercase px-5 py-2.5 border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              See How It Works
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── The Problem ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-10 text-center" style={{ fontFamily: "var(--font-display)" }}>
          You shipped fast. But fast and secure are not the same thing.
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div {...fadeUp} className="border border-border p-6 text-sm text-muted-foreground leading-relaxed">
            Lovable lets you build a working product in hours. But working and secure are different properties. AI-generated code introduces vulnerabilities at meaningful rates even when it works exactly as intended. Most founders run one free scan, get a green checkmark, and assume they are covered. They are not.
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="border border-border p-6 text-sm text-muted-foreground leading-relaxed">
            Enterprise prospects ask for pentest reports before signing. Investors run security due diligence. SOC 2 and ISO 27001 require documented security testing. A single breach destroys the trust you spent months building. Lazy Security makes continuous security testing a one-prompt install rather than a five-figure engagement.
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="max-w-4xl mx-auto px-6 py-20">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-10 text-center" style={{ fontFamily: "var(--font-display)" }}>
          One prompt. Continuous security. Audit-ready reports.
        </motion.h2>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ delay: i * 0.08 }}
              className="flex gap-4 border border-border p-5"
            >
              <span className="text-foreground/20 font-mono text-lg font-bold flex-shrink-0 w-6">{i + 1}</span>
              <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── What It Does ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-10 text-center" style={{ fontFamily: "var(--font-display)" }}>
          Security that runs itself.
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.05 }} className="border border-border p-5 space-y-2">
              <div className="flex items-center gap-2">
                <f.icon size={16} className="text-foreground/30" />
                <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Static vs Dynamic ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-10 text-center" style={{ fontFamily: "var(--font-display)" }}>
          Most tools read your code. Aikido attacks your app.
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-4">
          <motion.div {...fadeUp} className="border border-border p-6 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Static analysis</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Reads your source code and identifies known vulnerability patterns — exposed secrets, missing RLS policies, insecure dependencies, common misconfigurations. Valuable. Fast. Catches what you can see in the code.
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="border border-foreground/20 p-6 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-foreground/60">Dynamic pentesting (what Lazy Security adds)</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Attacks your running application with real payloads. Tries to escalate privileges, access data it should not be able to reach, bypass authentication, and break your application logic. Finds what only becomes visible when someone actually tries to break in.
            </p>
          </motion.div>
        </div>
        <motion.p {...fadeUp} className="text-sm text-muted-foreground leading-relaxed text-center mt-8 max-w-2xl mx-auto">
          Lazy Security does both. Static scanning runs continuously. Dynamic pentesting runs on schedule and on demand. Together they close the gap between what could go wrong and what actually breaks.
        </motion.p>
      </section>

      {/* ── The Report ── */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center" style={{ fontFamily: "var(--font-display)" }}>
          The report that closes enterprise deals.
        </motion.h2>
        <motion.p {...fadeUp} className="text-sm text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto mb-10">
          Enterprise prospects ask for it. Investors expect it. SOC 2 auditors require it. A formal pentest report from Aikido says your application has been tested against real-world attack scenarios and here is what was found. Lazy Security generates this report automatically — updated after every pentest run, formatted for audit purposes, ready to attach to any vendor questionnaire or compliance submission without you lifting a finger.
        </motion.p>
        <motion.div {...fadeUp} className="border border-border p-8 max-w-md mx-auto space-y-6">
          <div className="text-center space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Security Score</p>
            <p className="text-5xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>87</p>
            <p className="text-[10px] font-mono text-muted-foreground">/ 100</p>
          </div>
          <div className="border-t border-border pt-4 space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">Vulnerability Breakdown</p>
            {[
              { label: "Critical", count: 0, color: "hsl(0 84% 60%)" },
              { label: "High", count: 1, color: "hsl(25 90% 55%)" },
              { label: "Medium", count: 3, color: "hsl(45 80% 55%)" },
              { label: "Low", count: 7, color: "hsl(210 60% 50%)" },
              { label: "Informational", count: 12, color: "hsl(0 0% 45%)" },
            ].map((v) => (
              <div key={v.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2" style={{ backgroundColor: v.color }} />
                  <span className="text-muted-foreground">{v.label}</span>
                </div>
                <span className="font-mono text-foreground/60">{v.count}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4 space-y-1 text-[10px] font-mono text-muted-foreground">
            <p>Test date: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
            <p>Methodology: OWASP Top 10, SANS CWE 25, Aikido proprietary</p>
          </div>
          <button className="w-full text-[11px] font-mono uppercase tracking-wider py-2.5 border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
            Download PDF
          </button>
        </motion.div>
      </section>

      {/* ── Pricing ── */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-10 text-center" style={{ fontFamily: "var(--font-display)" }}>
          Pricing
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-4">
          <motion.div {...fadeUp} className="border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Free</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Lazy Security setup prompt, self-hosted, bring your own Aikido account. Aikido pentests cost $100 per test — billed directly by Aikido. Lazy Security automates the scheduling and reporting around it at no extra cost.
            </p>
            <CopyPromptButton className="w-full" />
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="border p-6 space-y-4" style={{ borderColor: "hsl(45 80% 55%)" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Pro — $19/mo</h3>
              <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 border" style={{ color: "hsl(45 80% 55%)", borderColor: "hsl(45 80% 55% / 0.4)" }}>Coming Soon</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Hosted version, automated report delivery before scheduled meetings, multi-project security dashboard, Slack and Telegram alerts included.
            </p>
            <button disabled className="w-full text-[11px] font-mono uppercase tracking-wider py-2.5 border border-border text-muted-foreground opacity-40 cursor-not-allowed">
              Coming Soon
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-10 text-center" style={{ fontFamily: "var(--font-display)" }}>
          FAQ
        </motion.h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.05 }} className="border border-border">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-5 py-4 flex items-center justify-between text-sm text-foreground hover:text-foreground/80 transition-colors"
              >
                {faq.q}
                <span className="text-muted-foreground text-xs ml-4">{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">
                  {faq.a}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-border py-20 px-6" style={{ backgroundColor: "#0a0a08" }}>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
            Ship fast. Stay secure. One prompt does both.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
            You built it fast. Lazy Security makes sure it stays safe — continuous scanning, automated pentests, instant alerts, and audit-ready reports that close enterprise deals.
          </p>
          <CopyPromptButton />
          <p className="text-[10px] text-muted-foreground/50 max-w-sm mx-auto">
            Open your Lovable project, paste it into the chat, connect your Aikido account. Your first pentest runs automatically within minutes.
          </p>
        </div>
      </section>
    </>
  );
}
