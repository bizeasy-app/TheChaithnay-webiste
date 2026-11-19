# thechaithanya.com — Complete Build Spec (for Cursor)

> **How to use this file**
> 1. Create an empty folder, open it in Cursor, and put this file at the root as `BUILD-SPEC.md`.
> 2. Copy section **24 (Cursor rules)** into `.cursor/rules/project.mdc`.
> 3. Build phase by phase using the prompts in **section 22**. One phase per chat. Check the acceptance list before moving on.
> 4. Visual reference: `/design-reference/*.html` (offline copies of the approved design — open in a browser). Online canvas (owner only): https://claude.ai/artifact/LVY4yYyxgFB91b9unEQvU9
> 5. Anything in `[BRACKETS]` is a placeholder Chaithanya must fill in (full list in **section 23**).

---

## 0. FINAL DECISIONS (override anything below that conflicts)

1. **Design reference:** the approved designs are in `/design-reference/*.html` (open them in a browser). Match their layout, spacing, type sizes, colours and motion. They are prototypes: copy the look, not the code structure (they use a special `<x-dc>` format — rebuild properly in Next.js components). Note `04-products.html` locked cards: use the text "Coming soon" instead of the audience labels shown.
2. **Brand kit:** real files are in `/The-Chaithanya-Brand-Kit/` (same project folder). Use them, never redraw if a file exists:
   - Logos: `01-logo-masters/` (SVG, 4 layouts × 4 colourways) → copy needed ones to `public/brand/`
   - Favicons & app icons: `09-web-and-app-icons/` (favicon.ico, favicon.svg, apple-touch-icon 180, Android 192/512) → `public/`
   - Profile/avatar images (`02-profile-pictures/`) can be used for the author avatar and OG fallback.
   - If a needed file is missing, fall back to the `BinduMark` SVG in section 7.1 and list what was missing.
   - Do not move or edit the brand kit folder; copy from it.
3. **Newsletter signups → Notion "Subscribers" database** (free). No newsletter tool yet.
   - Properties: Email (title), First name (text), Source (select: home, blog, post, products, newsletter), Tag (multi-select), Date (created time), Status (select: Active, Unsubscribed).
   - Form posts to the Cloudflare Worker `POST /api/subscribe` → creates a page in Subscribers (skip if the email already exists → still show success).
   - Success text: "You're on the list. The founder log comes every Saturday." No double opt-in for now.
   - Later a newsletter tool will be chosen and the Notion list imported — keep the form code provider-agnostic (one `subscribe()` function).
4. **Contact form → Notion "Inbox" database** (free).
   - Properties: Name (title), Email (email), Reason (select: Collaboration, Sponsorship, Podcast or interview, Suggest an experiment, Just saying hi), Message (text), Date (created time), Status (select: New, Replied, Archived).
   - Form posts to `POST /api/contact` (same Worker). The Products "idea box" posts here with Reason = "Suggest an experiment".
   - No email-sending service.
5. **One Worker for both** (`workers/api`, route `thechaithanya.com/api/*`): `/api/subscribe` and `/api/contact`, honeypot, validation, rate limit 5/hour/IP, CORS only for the site origin, Notion token stored with `wrangler secret put NOTION_TOKEN`, Notion API version `2025-09-03`, create pages with parent `{ "type": "data_source_id", "data_source_id": ... }`.
6. **Placeholders stay:** `[HANDLE]`, `[CONTACT_EMAIL]`, social URLs, latest video. Keep them in ONE place (`lib/site.ts` and `content/faq.json`) so they are easy to fill later.
7. **Privacy page:** say emails and messages are stored in Notion (processor) and hosted on Cloudflare.
8. Env vars to add: `NOTION_SUBSCRIBERS_DATA_SOURCE_ID`, `NOTION_INBOX_DATA_SOURCE_ID` (Worker secrets). Remove `NEXT_PUBLIC_NEWSLETTER_FORM_URL`, `CONTACT_TO_EMAIL`, `EMAIL_API_KEY`.

---

## 1. Project overview

| Item | Value |
|---|---|
| Site | **thechaithanya.com** |
| Brand | **The Chaithanya** (always: capital T, capital C, "Chaithanya" with "th") |
| Owner | Chaithanya — solo Indian founder, team of ten, builds products with AI tools (Claude Code etc.) |
| Promise | "I try new things first, and show you how to win with them." |
| Tagline | **Try new. Learn fast. Build big.** |
| Primary goal | Grow followers (YouTube, Instagram, X, LinkedIn) and the **email list** |
| Secondary goal | Blog: written founder logs and lessons |
| Audience | Young Indians (18–30) who want to build something: aspiring/early founders, curious learners |
| Language | English |
| Face | Faceless brand — never use a photo of a person |

### Hard rules (do not break)
- **No products/projects are shown anywhere on the site yet.** The Products page is a "coming soon / in the lab" page. No product names (no BizEasy, Nehemiah, etc.) in copy, metadata, FAQ, llms.txt or JSON-LD.
- **No AI chatbot.** The "Ask me" assistant is a free, rule-based FAQ matcher (section 12). Never label it "AI".
- **No fake data:** no invented subscriber counts, stats, testimonials, view counts or dates. Missing values stay as `[PLACEHOLDER]` until filled.
- **Brand voice:** simple words, short sentences, numbers over adjectives, no hype words ("insane", "game-changer", "secret", "crazy").
- **Cost target: ₹0/month** (only the domain is paid).

---

## 2. Sitemap & routes

```
/                      Home
/blog                  Blog index (filter by topic)
/blog/[slug]           Single post (from Notion)
/products              Products & experiments (coming soon / lab)
/newsletter            Newsletter signup + contact form
/privacy               Privacy policy (required before collecting emails)
/404                   Not found
/rss.xml               RSS feed of posts
/sitemap.xml           Sitemap
/robots.txt            Robots
/llms.txt              Site summary for AI assistants (Markdown)
/llms-full.txt         Full text of all posts for AI assistants (Markdown)
```

"Ask me" is **not a page** — it is a floating button + slide-up panel available on every page (section 12).

---

## 3. Tech stack (all free)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript**, `output: 'export'` (static site) | Fast, SEO-friendly, no server needed → free hosting, no adapter issues |
| Styling | **Tailwind CSS** + CSS variables for brand tokens | Quick to build, consistent |
| Font | **Manrope** via `next/font/google` (weights 500, 600, 700, 800); **JetBrains Mono** 500 for code blocks only | Brand font |
| CMS | **Notion** (one database "Blog") via official `@notionhq/client`, **API version `2025-09-03`** | Chaithanya writes in Notion, no code |
| Notion → HTML | Custom block renderer (section 10.5) | Full control over brand styling |
| Search/"Ask me" | Client-side JSON + simple scoring (no AI, no API) | Free forever |
| Hosting | **Cloudflare Workers static assets** (or Cloudflare Pages) — free plan | Free, commercial use allowed |
| Rebuild | **GitHub Actions** cron (every 30 min) + manual "Run workflow" button | New Notion posts go live automatically |
| Forms | Newsletter: `[NEWSLETTER PROVIDER]` embed/API (choose one with a free tier). Contact: tiny Cloudflare Worker `POST /api/contact` that forwards to email, or a free form service `[FORM SERVICE]` | No paid backend |
| Analytics | Cloudflare Web Analytics (free, no cookies) | Privacy-friendly |

> Note: because the site is a static export, any server code (contact form) lives in a **separate small Cloudflare Worker**, not in Next.js API routes.

---

## 4. Architecture

```
          Chaithanya writes in Notion ("Blog" database, Status = Published)
                               │
         GitHub Actions (cron every 30 min, or manual "Run workflow")
                               │
             1. scripts/fetch-notion.ts
                - query Notion data source (Status = Published)
                - download blocks + images → content/posts/*.json, public/blog-images/
                - build public/faq-index.json (FAQ + post titles/summaries)
             2. next build (static export → /out)
             3. generate rss.xml, sitemap.xml, llms.txt, llms-full.txt
             4. wrangler deploy (/out → Cloudflare)
                               │
                     thechaithanya.com (static)
                               │
      Browser: "Ask me" panel loads /faq-index.json and matches questions locally
      Forms: newsletter → [NEWSLETTER PROVIDER]; contact → Cloudflare Worker /api/contact
```

**Why download images:** Notion file URLs are temporary (they expire after about an hour). Every image must be downloaded at build time into `public/blog-images/` and referenced locally.

---

## 5. Folder structure

```
.
├─ BUILD-SPEC.md
├─ .cursor/rules/project.mdc
├─ .github/workflows/deploy.yml
├─ app/
│  ├─ layout.tsx                 # fonts, <Nav/>, <Footer/>, <AskMe/>, analytics
│  ├─ page.tsx                   # Home
│  ├─ blog/page.tsx              # Blog index
│  ├─ blog/[slug]/page.tsx       # Post (generateStaticParams from content/posts)
│  ├─ products/page.tsx
│  ├─ newsletter/page.tsx
│  ├─ privacy/page.tsx
│  ├─ not-found.tsx
│  ├─ sitemap.ts
│  ├─ robots.ts
│  ├─ opengraph-image.tsx        # default OG image (static)
│  └─ globals.css
├─ components/
│  ├─ brand/Logo.tsx  BinduMark.tsx  Wordmark.tsx
│  ├─ layout/Nav.tsx  Footer.tsx  BigWordmark.tsx
│  ├─ ui/Button.tsx  Pill.tsx  Chip.tsx  Card.tsx  EmailForm.tsx  SectionLabel.tsx  Marquee.tsx  BlinkDot.tsx
│  ├─ home/Hero.tsx  TopicMarquee.tsx  Bento.tsx  BlogList.tsx  EndCTA.tsx
│  ├─ blog/PostRow.tsx  TopicFilter.tsx  FeaturedPost.tsx
│  ├─ post/ProgressBar.tsx  Toc.tsx  TldrBox.tsx  StealThis.tsx  NotionBlocks.tsx  ReadNext.tsx  ShareButton.tsx
│  ├─ products/LabBento.tsx  HowIBuild.tsx  IdeaBox.tsx
│  └─ askme/AskMeButton.tsx  AskMePanel.tsx  matcher.ts
├─ content/
│  ├─ faq.json                   # hand-written FAQ (section 12.4)
│  └─ posts/                     # generated by fetch-notion (git-ignored)
├─ lib/
│  ├─ site.ts                    # site constants (name, url, socials, tagline)
│  ├─ notion.ts                  # Notion client + queries
│  ├─ posts.ts                   # read content/posts/*.json
│  ├─ seo.ts                     # metadata helpers + JSON-LD builders
│  └─ readingTime.ts
├─ scripts/
│  ├─ fetch-notion.ts
│  ├─ build-faq-index.ts
│  └─ generate-feeds.ts          # rss.xml, llms.txt, llms-full.txt
├─ public/
│  ├─ favicon.ico favicon.svg apple-touch-icon.png icon-192.png icon-512.png  (from brand kit folder 09-web-and-app-icons)
│  ├─ og/default.png             # 1200×630
│  └─ blog-images/               # generated
├─ workers/contact/              # separate Cloudflare Worker for the contact form
├─ tailwind.config.ts
├─ next.config.ts                # output: 'export', images.unoptimized: true, trailingSlash: false
└─ wrangler.jsonc                # static assets from ./out
```

---

## 6. Design system

### 6.1 Colours (60 / 30 / 10)

| Token | Hex | Use |
|---|---|---|
| `--cloud` | `#F0EEE9` | Page background (60%) |
| `--ink` | `#1A1714` | Text, dark sections, primary buttons (30%) |
| `--saffron` | `#E8792B` | The bindu dot, ONE highlight word, primary CTA on dark (10%) |
| `--indigo` | `#26305C` | Video/feature tiles (rare) |
| `--white` | `#FFFFFF` | Cards on Cloud |
| `--muted` | `#6B625A` | Secondary text on Cloud ("The", labels) |
| `--muted-dark` | `#B3A99E` | Secondary text on Ink |
| `--body` | `#4A433D` | Long body text on Cloud |
| `--line` | `#E2DED6` | Card borders |
| `--line-strong` | `#CFC9BF` | Input/chip borders |
| `--ink-2` | `#26221E` / `#2A2521` | Inputs/panels on Ink |
| `--on-indigo` | `#C9C6D9` / `#D9D6E6` | Secondary text on Indigo |

**Contrast rules (must pass WCAG AA):**
- Ink on Cloud 15:1 ✓ · Saffron on Ink ~6:1 ✓ · Cloud on Indigo 11:1 ✓ · Ink on Saffron ✓
- **Saffron on Cloud ≈ 2.5:1 ✗ — never use saffron for text on light backgrounds.** On Cloud, saffron is only for the dot, shapes, borders, and a period at display size.

### 6.2 Typography (Manrope)

| Style | Size | Weight | Tracking | Line height |
|---|---|---|---|---|
| Display XL (hero h1) | `clamp(56px, 9.6vw, 150px)` | 800 | −0.055em | 0.92 |
| Display L (section h2) | `clamp(44px, 6vw, 80px)` | 800 | −0.05em | 0.95 |
| Post title | `clamp(44px, 6.4vw, 96px)` | 800 | −0.05em | 0.96 |
| H2 in post | 40px | 800 | −0.035em | 1.1 |
| Card title | 26–34px | 800 | −0.03em | 1.1 |
| Lead | 21px | 500 | 0 | 1.5 |
| Body (post) | 20px | 500 | 0 | 1.75 |
| Body (UI) | 15–17px | 500–600 | 0 | 1.55 |
| Label / eyebrow | 13px, UPPERCASE | 800 | +0.08–0.1em | 1 |
| Code | JetBrains Mono 15px | 500 | 0 | 1.7 |

Wordmark: "The" Manrope 500 in muted colour + "Chaithanya" Manrope 700, tracking −0.035em.

### 6.3 Shape, spacing, depth

- Radius: pills `999px`; cards `22–28px`; big panels `36px`; inputs `12–14px` (or pill).
- Container: `max-width: 1240px`, side padding `20px` (mobile 16px).
- Section spacing: 88–128px between major sections (mobile 64–80px).
- Bento gap: 16px.
- Shadows: hover `0 18px 40px rgba(26,23,20,.12)`; floating `0 16px 40px rgba(26,23,20,.18)`.
- Dot texture (dark/indigo panels only): `background-image: radial-gradient(rgba(240,238,233,.08–.12) 1.5px, transparent 1.5px); background-size: 22–24px`.
- **No** gradient washes, no left-border cards, no emoji as icons, no stock photos of people.

### 6.4 Motion (micro-interactions)

| Name | Spec |
|---|---|
| `blink` | Saffron dot blinks like a cursor: `steps(1)`, 1.2s infinite (visible 0–45%, hidden 50–95%) |
| `lift` | Cards: hover `translateY(-4px)` + hover shadow, 250ms ease |
| `arrow` | Row hover: arrow `translateX(6px)`, 250ms |
| `marquee` | Topic strip scrolls left, 32s linear infinite, content duplicated ×2, strip rotated −1.2° |
| `spin` | Big bindu mark in Products lab tile rotates 360° in 14s |
| Reading progress | 4px saffron bar at top of post, width = scroll % |
| **Reduced motion** | `@media (prefers-reduced-motion: reduce)` → disable blink, marquee, spin, lift, arrow |

### 6.5 Icons
Inline stroke SVGs (24px viewBox, stroke 2, round caps): arrow-right, arrow-up-right, play (filled), lock, share, copy, close. Decorative SVGs get `aria-hidden="true"`. Do **not** use platform brand logos — social links are text labels.

### 6.6 Tailwind setup (summary)
Extend `theme.colors` with the tokens above, `fontFamily.sans = ['var(--font-manrope)', 'system-ui']`, `fontFamily.mono = ['var(--font-mono)']`, add keyframes `blink`, `marquee`, `spin-slow` and utilities `.lift`, `.blink`.

---

## 7. Brand components

### 7.1 `BinduMark` (the logo mark)
```tsx
// viewBox 0 0 40 40 — C opened ~96° to the right, saffron bindu on the circle's path
<svg viewBox="0 0 40 40" aria-hidden="true">
  <path d="M29.37 9.6 A14 14 0 1 0 29.37 30.4" fill="none" stroke={stroke} strokeWidth="5" strokeLinecap="round"/>
  <circle cx="34" cy="20" r="4" fill="#E8792B" className={blink ? 'blink' : ''}/>
</svg>
```
Props: `size`, `tone: 'ink' | 'cloud'` (stroke `#1A1714` or `#F0EEE9`), `blink?: boolean`. The bindu is always saffron (except mono versions).

### 7.2 `Logo` (horizontal lockup)
BinduMark (32px) + 10px gap + Wordmark (18px). Links to `/`, `aria-label="The Chaithanya — home"`. Prefer the official SVG from the brand kit (`01-logo-masters`) if available.

### 7.3 `BigWordmark` (footer)
`Chaithanya` + saffron `.` — `clamp(64px, 15vw, 230px)`, weight 800, tracking −0.06em, `aria-hidden="true"`, no wrap, overflow hidden.

---

## 8. Global layout

### 8.1 Nav (every page)
- **Floating pill**, `position: sticky; top: 16px`, max-width 1240, inner padding `10px 10px 10px 20px`, radius 999, background `rgba(240,238,233,.82)` + `backdrop-filter: blur(14px)`, border `1px solid rgba(26,23,20,.08)`.
- Left: `Logo`. Right links: **Blog**, **Products**, **Ask me** (opens panel), **Join the log** (Ink pill button → `/newsletter`).
- Active page link: white pill background, weight 800, `aria-current="page"`.
- Mobile (<640px): logo + "Join the log" + a menu button (44×44) opening a full-width sheet with the links.

### 8.2 Footer (every page)
- Row: footer nav (Home, Blog, Products, Newsletter, Contact → `/newsletter#contact`, Ask me, Privacy) + `© 2026 The Chaithanya · thechaithanya.com`.
- Below: `BigWordmark`.

### 8.3 "Ask me" floating button (every page, bottom-right)
Ink pill, 24px from right/bottom, BinduMark (cloud) + "Ask me anything". Opens `AskMePanel` (section 12). Hide while the panel is open.

---

## 9. Pages — section by section

> Copy below is final unless shown as `[PLACEHOLDER]`. Keep wording; it follows the brand voice.

### 9.1 Home `/`

1. **Hero**
   - Announcement pill (white, border): black mini-pill "NEW" + `Founder log, week [X] drops Saturday →` (links to YouTube channel).
   - H1 (Display XL): `Try new.` / `Learn fast.` / `Build big` + saffron blinking dot as the full stop.
   - Row (wraps on mobile):
     - Lead (max 520px): "I try new things first, and show you how to win with them. A solo Indian founder building with AI — wins and failures, on screen."
     - **Ask bar**: label "ASK ME ANYTHING"; Ink pill input with BinduMark, placeholder "How do you build apps with AI?", saffron round submit (48px). Submitting opens AskMePanel with the question pre-filled and answered.
     - 3 suggestion chips (outline pills): "Who is Chaithanya?", "Where do I start?", "Best AI tools for founders" → open AskMePanel with that question.
2. **Topic marquee** (Ink strip, rotated −1.2°, full-bleed, `aria-hidden`): `Founder log ● AI tools & building ● Startup lessons ● Money & mindset ● Steal this ● Here's what actually happened ●` (dots saffron).
3. **Bento grid** (4 columns desktop → 1 column under 860px, gap 16, auto rows min 250px):
   - **Latest video** (2×2, Indigo + dot texture): pill "LATEST VIDEO", centre play button (96px Cloud circle), title "Founder log, week [X]: **here's what actually happened.**" (second part saffron), sub `[Video title + length]`. Links to the latest YouTube video `[LATEST_VIDEO_URL]`.
   - **The story** (2×1, white): label "THE STORY", h2 "No face. Just the build.", text: "I'm Chaithanya — a solo founder with a team of ten, building with tools like Claude Code. Chaitanya means awareness: the dot where something begins."
   - **Newsletter** (1×1, Saffron bg, Ink text): "NEWSLETTER" / "One log. Every Saturday." / "Subscribe →" → `/newsletter`.
   - **Ask me** (1×1, Ink): "ASK ME", two chat bubbles ("What should I learn first?" / "Start with week 1" + blinking dot), "Start a chat →" opens panel.
   - **Follow** (2×1, white list): rows with bottom borders, each a link with hover arrow: YouTube — "Weekly founder log"; Instagram — "3 Reels a week"; X — "Build notes"; LinkedIn — "Founder lessons". URLs from `lib/site.ts`.
   - **Products soon** (2×1, dashed border): BinduMark 96px with blinking bindu, "BUILDING IN PUBLIC", "Products drop here soon.", "Get notified →" → `/products`.
4. **Blog list**: h2 "Lessons, written down." + outline pill "All posts" → `/blog`. Then the **3 latest posts** as numbered rows: `01` · topic (uppercase label) · title (30px/800) · arrow. Rows separated by 1.5px Ink lines. Link to `/blog/[slug]`.
5. **End CTA** (Ink panel, radius 36, dot texture, giant faded BinduMark top-right): h2 "Start where I started. **Week 1.**" (saffron), email form "Get the founder log every Saturday".
6. Footer.

### 9.2 Blog index `/blog`

1. Eyebrow with blinking dot "THE BLOG"; H1 "Founder log & lessons." (saffron period).
2. Row: lead "Every video, written down — plus what doesn't fit in a video. Simple words, real numbers, no hype." + **search/ask bar** (same Ink pill style; typing filters the list by title/summary live; Enter opens AskMePanel).
3. **Featured bento**: Featured post tile (3×2, Indigo + faded BinduMark, pills "FEATURED" + "With video" if `VideoURL` set, topic label, title with the last clause in saffron if `TitleHighlight` set, summary, "Read the log →"). Saffron tile "EVERY SATURDAY / Get new posts in your inbox. / Subscribe →". Ink tile "NOT SURE WHERE TO START? / Ask me to pick a post for you / Start a chat →".
   - Featured = newest post with `Featured = true`, else newest post.
4. **All posts**: h2 "All posts" + topic filter chips (All, Startup lessons, AI tools & building, Money & investing, Life & mindset). Selected chip = Ink filled; `aria-pressed`. List = numbered rows (renumber after filtering). Filter state also in URL `?topic=ai-tools` (shareable).
5. End CTA: "Never miss a lesson. **Steal it.**" + email form.
6. Empty state (no posts yet): "First post coming Saturday." + email form.

### 9.3 Single post `/blog/[slug]`

1. **Reading progress bar** (sticky top, 4px saffron on 8% ink track, `role="progressbar"` with `aria-valuenow`).
2. Breadcrumb: Blog / [Topic].
3. H1 post title (+ blinking ink dot after it).
4. Meta row: author avatar (Ink circle with Cloud BinduMark), "Chaithanya", `[Date] · [X] min read · Founder log, week [N]` (week only if set). Buttons: **Listen** (uses the browser's built-in `speechSynthesis` to read the post — free; hide if unsupported) and **Share** (Web Share API, fallback copy link).
5. **Video version** (if `VideoURL`): 16:8 Indigo frame with play button; on click replace with a lite YouTube embed (`youtube-nocookie.com`, load iframe only after click).
6. Two-column body (wraps on mobile):
   - **Sidebar** (sticky, 240–280px): "ON THIS PAGE" table of contents from H2s (active section highlighted Ink pill via IntersectionObserver) + Ink card "ASK ABOUT THIS POST — Stuck on a step? Ask, and get an answer from this post. Start a chat →" (opens AskMePanel scoped to this post).
   - **Article** (max 760px, body 20px/1.75):
     - **TL;DR box** (white card): label "TL;DR IN 3 LINES", bullet list from Notion property `TLDR` (one line per bullet).
     - Notion content rendered by `NotionBlocks` (section 10.5).
     - Special blocks: a Notion **callout** whose first word is `Steal` renders as the **Steal this** panel (Ink, h2 "Steal this." with saffron period, text, mono code box, saffron **Copy** button with "Copied!" state). Notion **quote** = pull quote (30px/800, 4px saffron left border).
     - End: closing question (last paragraph styled large if it ends with "?") + tag pills from `Tags`.
7. **Subscribe band** (Saffron panel): "Liked this? Get next week's." + email form on Ink pill.
8. **Read next**: 3 cards (same topic first, then newest), white, lift on hover.
9. Footer.

### 9.4 Products `/products` (no real products)

1. Eyebrow "THE LAB · BUILDING IN PUBLIC" (blinking dot); H1 "Products & experiments." (saffron period).
2. Lead "Everything I build, shown honestly — what works, what breaks, what's next. The first products open here soon." + Ink pill email form "BE FIRST TO SEE THE LAUNCHES" / button "Notify me" (newsletter tag: `product-launch`).
3. **Lab bento**: big Ink tile (2×2, spinning faded BinduMark): pill "IN THE LAB", "Several products. One founder. **Built with AI.**", "Each one becomes a story on the founder log. They open here one by one." + 3 locked teaser cards `01`, `02`, `03` (lock icon, grey skeleton bars, text "Coming soon") + dashed card "04+ More in the lab — Revealed on the founder log."
   - **Teaser card text must stay generic ("Coming soon").** Do not hint at product names or audiences.
4. **How I build.**: 4 steps in a grid with 2px top rules (4th rule saffron): 01 Try it first — "Pick a real problem — mine or a small business's — and test a new tool on it." · 02 Build with AI — "Ship fast with tools like Claude Code and a small team." · 03 Test with real people — "Put it in front of real users and watch what actually happens." · 04 Share the log — "Wins and failures, every Saturday. You steal what works."
5. **Idea box** (Saffron panel): "What should I try next?" + "Suggest a tool, skill or experiment. The best ideas become a founder log episode." + input on Ink pill + "Send idea" (posts to contact Worker with `reason: "Suggest an experiment"`).
6. Footer.
7. **Later** (when Chaithanya is ready): replace teasers with real cards from a Notion "Products" database (Name, Status: Built/Building/Planned, One-liner, URL, Order, Visible). Keep `Visible = false` by default.

### 9.5 Newsletter + Contact `/newsletter`

1. **Newsletter hero** (Ink panel): eyebrow "THE WEEKLY FOUNDER LOG"; H1 "Learn what I learn, **a week early.**"; 3 bullets with saffron dots: "What I tried this week, and what happened" · "One AI tool or system you can steal" · "Every Saturday. No hype, no spam." Form card: First name, Email, saffron button "Send me the founder log", note "Unsubscribe anytime with one click." + consent line linking to `/privacy`.
2. **Contact** (`id="contact"`): label "CONTACT", h2 "Let's build something together.", text "Collaborations, sponsorships, podcast invites, or an experiment you want me to try. I read every message.", email `[CONTACT_EMAIL]`. Form (white card): Name, Email, "What's it about?" select (Collaboration, Sponsorship, Podcast or interview, Suggest an experiment, Just saying hi), Message, "Send message". Hidden honeypot field. Success and error states inline.
3. Footer.

### 9.6 Privacy `/privacy`
Plain page in the brand style. Must cover: what is collected (name, email, contact message), why (newsletter, replying), the newsletter provider `[NEWSLETTER PROVIDER]` as processor, Cloudflare Web Analytics (no cookies), how to unsubscribe/delete data (email `[CONTACT_EMAIL]`), last updated date. Written in plain language; mention India's Digital Personal Data Protection Act, 2023. Chaithanya should have it reviewed — this is not legal advice.

### 9.7 404
H1 "This page is still in the lab." + BinduMark with blinking dot + buttons "Go home" and "Read the blog".

---

## 10. Notion CMS

### 10.1 Setup (Chaithanya, one time)
1. Create a full-page **database** in Notion called **Blog** with the properties below.
2. Go to notion.so/profile/integrations → **New integration** (internal) → copy the secret → `NOTION_TOKEN`.
3. Open the Blog database → `•••` → **Connections** → add the integration.
4. Get the **data source ID**: call `GET /v1/databases/{database_id}` with header `Notion-Version: 2025-09-03`; use `data_sources[0].id` → `NOTION_BLOG_DATA_SOURCE_ID`. (The script should also do this automatically if only `NOTION_BLOG_DATABASE_ID` is given.)

### 10.2 Database properties

| Property | Type | Required | Notes |
|---|---|---|---|
| Title | Title | ✓ | Post title |
| Slug | Text | ✓ | lowercase-with-dashes; if empty, generate from Title |
| Status | Select: Draft / Published | ✓ | Only `Published` goes live |
| Date | Date | ✓ | Publish date (posts with a future date are skipped) |
| Topic | Select: Startup lessons / AI tools & building / Money & investing / Life & mindset | ✓ | Drives filters |
| Summary | Text | ✓ | 1–2 sentences, used in lists, meta description (≤155 chars), Ask me |
| TLDR | Text | – | 3 lines, one per line → TL;DR box |
| TitleHighlight | Text | – | Part of the title shown in saffron on dark tiles |
| Cover | Files & media | – | 1200×630 preferred; downloaded at build |
| VideoURL | URL | – | YouTube link → video block |
| Week | Number | – | Founder log week number |
| Tags | Multi-select | – | Shown as pills |
| Featured | Checkbox | – | Featured on /blog |
| SEOTitle | Text | – | Overrides `<title>` if set |
| FAQ | Text | – | Optional Q&A lines for Ask me: `Q: ... \| A: ...` one per line |

### 10.3 Queries (`lib/notion.ts`)
- Client: `new Client({ auth: process.env.NOTION_TOKEN, notionVersion: '2025-09-03' })`.
- Query: `POST /v1/data_sources/{data_source_id}/query` (SDK v5: `notion.dataSources.query`; otherwise `notion.request`) with filter `Status = Published` and `Date on_or_before today`, sort `Date desc`, handle pagination (`has_more` / `next_cursor`).
- Blocks: `GET /v1/blocks/{page_id}/children` recursively (page_size 100, paginate, fetch children when `has_children`).
- Respect the rate limit (about 3 requests/second): queue requests with a small delay and retry on 429 using `Retry-After`.

### 10.4 Build output (`scripts/fetch-notion.ts`)
For each published post write `content/posts/{slug}.json`:
```json
{ "slug": "", "title": "", "titleHighlight": "", "date": "", "topic": "", "summary": "",
  "tldr": [], "cover": "/blog-images/{slug}/cover.jpg", "videoUrl": "", "week": 0,
  "tags": [], "featured": false, "seoTitle": "", "faq": [{"q": "", "a": ""}],
  "readingMinutes": 0, "headings": [{"id": "", "text": ""}], "blocks": [ /* simplified block tree */ ],
  "plainText": "" }
```
- Download every image (cover + image blocks) to `public/blog-images/{slug}/` with stable names; rewrite URLs.
- `readingMinutes = ceil(words / 200)`.
- Heading ids = slugified heading text (unique).
- Fail the build loudly if a required property is missing (show which post).

### 10.5 Block renderer (`NotionBlocks.tsx`)
Support: paragraph, heading_1/2/3 (H1 in Notion → render as h2), bulleted/numbered list (+ nesting), to_do (read-only), quote (pull quote), callout (Steal this if it starts with "Steal", otherwise a white note card), code (mono box + Copy), image (with caption → `<figure>`/`<figcaption>`, lazy, width/height set), divider, toggle (`<details>`), bookmark/embed of YouTube (lite embed), table (scrollable box). Rich text: bold, italic, code, strikethrough, underline, links (external → `rel="noopener"`). Notion colours are ignored (brand colours only). Unsupported blocks are skipped with a build warning.

---

## 11. Publishing flow (GitHub Actions)

`.github/workflows/deploy.yml`:
- Triggers: `schedule: cron "*/30 * * * *"` (every 30 min), `workflow_dispatch` (manual "Run workflow" button = publish now), `push` to `main`.
- Steps: checkout → setup Node (LTS) → `npm ci` → `npm run fetch` (Notion) → `npm run build` (next build + feeds) → **skip deploy if `content/` and `public/blog-images/` hash didn't change and the trigger was the cron** → `npx wrangler deploy`.
- Secrets: `NOTION_TOKEN`, `NOTION_BLOG_DATA_SOURCE_ID` (or `NOTION_BLOG_DATABASE_ID`), `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.

**Chaithanya's publishing routine:** write in Notion → fill properties → Status = Published → post is live within 30 minutes (or press "Run workflow" in GitHub for instant).

---

## 12. "Ask me" assistant (free, no AI)

### 12.1 UX
- Panel: 420×680 on desktop (bottom-right, above the button, radius 20), full-screen sheet on mobile. `role="dialog"`, `aria-modal="true"`, focus trap, Esc closes, focus returns to the trigger.
- Header (Ink): BinduMark, "Ask The Chaithanya", sub "Quick answers from this site", close button (44×44).
- Messages area (`aria-live="polite"`): bot bubbles white with border (left), user bubbles Ink (right).
- Greeting: "Hi! Ask me who Chaithanya is, what he's building, or where to start on the blog."
- Suggestion chips (always visible, 4): "Who is Chaithanya?", "What are you building?", "Where do I start on the blog?", "How do I get the newsletter?"
- Input + saffron round send button.
- Answers can include up to 3 **link cards** (post title + topic) to relevant posts/pages.
- Keep the conversation in memory only (no storage, no tracking of questions).

### 12.2 Data
At build time `scripts/build-faq-index.ts` creates `public/faq-index.json`:
- All entries from `content/faq.json`
- FAQ lines from each post's `FAQ` property
- One entry per post: `{ type: "post", title, summary, topic, slug, keywords }`

### 12.3 Matching algorithm (`components/askme/matcher.ts`)
1. Normalise: lowercase, remove punctuation, collapse spaces; small stop-word list (the, a, is, are, how, do, i, you, what, to, of, in, for, my, me).
2. Score each FAQ: +3 per keyword phrase hit (from `keywords`), +1 per token overlap with `q`, +2 if the question contains an exact `q` phrase.
3. Score each post: +2 per token in title, +1 per token in summary/topic.
4. If best FAQ score ≥ 3 → reply with its `a` (+ its `links`).
5. Else if any post score ≥ 3 → reply "These posts should help:" + top 3 post cards.
6. Else → fallback: "I don't have an answer for that yet. Try a suggestion below, or send Chaithanya a message on the Contact page." + link to `/newsletter#contact`.
7. Optional: a small synonym map (e.g. "ai" ↔ "claude", "tools"; "newsletter" ↔ "email", "subscribe"; "start" ↔ "begin", "first").

### 12.4 Starter `content/faq.json`
```json
[
  {"id":"who","q":"Who is Chaithanya?","keywords":["who","about","chaithanya","founder"],
   "a":"Chaithanya is a solo Indian founder with a team of ten. He builds with AI tools like Claude Code and shares the whole journey — wins and failures — as a weekly founder log.","links":["/"]},
  {"id":"building","q":"What are you building?","keywords":["building","build","products","product","projects"],
   "a":"Several products, built with AI, in public. They'll open on the Products page soon — join the founder log to see them first.","links":["/products","/newsletter"]},
  {"id":"start","q":"Where do I start on the blog?","keywords":["start","begin","first","read","blog"],
   "a":"Start with Founder log, week 1. Then pick a topic on the Blog page.","links":["/blog"]},
  {"id":"newsletter","q":"How do I get the newsletter?","keywords":["newsletter","email","subscribe","inbox","saturday"],
   "a":"Sign up on the Newsletter page. One founder log every Saturday — what I tried, what happened, one thing to steal.","links":["/newsletter"]},
  {"id":"schedule","q":"When do new videos come out?","keywords":["when","video","youtube","schedule","new"],
   "a":"A new founder log video comes out every Saturday on YouTube.","links":["[YOUTUBE_URL]"]},
  {"id":"faceless","q":"Why don't you show your face?","keywords":["face","faceless","camera","show"],
   "a":"The focus is the build, not the person — screen, voice and story. No face. Just the build.","links":[]},
  {"id":"tools","q":"What AI tools do you use?","keywords":["tools","ai","claude","stack","software"],
   "a":"Mainly Claude and Claude Code for building, plus automation tools. The AI tools & building posts go deeper.","links":["/blog?topic=ai-tools"]},
  {"id":"contact","q":"How can I contact you?","keywords":["contact","reach","message","email you","dm"],
   "a":"Use the contact form on the Newsletter page and pick a reason. I read every message.","links":["/newsletter#contact"]},
  {"id":"collab","q":"Can we collaborate or sponsor?","keywords":["collab","collaborate","sponsor","sponsorship","brand deal","partner"],
   "a":"Yes — send the details through the contact form and choose Collaboration or Sponsorship.","links":["/newsletter#contact"]},
  {"id":"podcast","q":"Can you come on my podcast?","keywords":["podcast","interview","guest","speak"],
   "a":"Send an invite through the contact form and choose Podcast or interview.","links":["/newsletter#contact"]},
  {"id":"idea","q":"Can I suggest an experiment?","keywords":["suggest","idea","experiment","try next"],
   "a":"Please do. The best ideas become a founder log episode. Use the idea box on the Products page.","links":["/products"]},
  {"id":"topics","q":"What do you write about?","keywords":["topics","write","about what","content"],
   "a":"Mostly startup lessons and AI tools & building, plus money & investing and life & mindset once a week.","links":["/blog"]},
  {"id":"steal","q":"What does 'Steal this' mean?","keywords":["steal this","steal"],
   "a":"Every post ends with something you can copy right away — a prompt, template or checklist.","links":["/blog"]},
  {"id":"social","q":"Where can I follow you?","keywords":["follow","instagram","x","twitter","linkedin","social"],
   "a":"YouTube for the weekly founder log, Instagram for Reels, X for build notes and LinkedIn for founder lessons.","links":["[YOUTUBE_URL]","[INSTAGRAM_URL]","[X_URL]","[LINKEDIN_URL]"]},
  {"id":"language","q":"Is the content in Telugu?","keywords":["telugu","hindi","language"],
   "a":"Right now it's in English.","links":[]}
]
```

---

## 13. Forms

### 13.1 Newsletter (`EmailForm` component, used in 6 places)
- Fields: email (required), first name (only on `/newsletter`). Hidden `source` (page) and `tag` (e.g. `product-launch`).
- Submit to `[NEWSLETTER PROVIDER]` (embed form endpoint or API via the contact Worker if a secret key is needed — never expose secret keys in the static site).
- States: idle → loading (button disabled, "Sending…") → success ("You're in. Check your inbox to confirm.") → error ("That didn't work. Try again in a minute.").
- Double opt-in on (provider setting). Consent text: "By subscribing you agree to the [privacy policy](/privacy)."

### 13.2 Contact Worker (`workers/contact`)
- `POST /api/contact` (route on the same domain) accepts JSON `{name, email, reason, message, website}` (`website` = honeypot; reject if filled).
- Validate (email format, message 10–5000 chars), basic rate limit per IP (e.g. 5/hour using a KV or in-memory map), then forward to `[CONTACT_EMAIL]` via `[EMAIL SENDING SERVICE with free tier]` or store in a Notion "Inbox" database (free) — choose one.
- CORS: only `https://thechaithanya.com`.
- Return `{ok:true}` or `{ok:false, error}`.

---

## 14. SEO

### 14.1 Site constants (`lib/site.ts`)
```ts
export const site = {
  name: 'The Chaithanya',
  url: 'https://thechaithanya.com',
  tagline: 'Try new. Learn fast. Build big.',
  description: 'Founder log from a solo Indian founder building with AI. Startup lessons, AI tools and real experiments — wins and failures, every Saturday.',
  author: 'Chaithanya',
  locale: 'en_IN',
  twitter: '@[HANDLE]',
  socials: { youtube: '[YOUTUBE_URL]', instagram: '[INSTAGRAM_URL]', x: '[X_URL]', linkedin: '[LINKEDIN_URL]' },
}
```

### 14.2 Per-page metadata (Next.js `metadata` / `generateMetadata`)

| Route | `<title>` (≤60 chars) | Meta description (≤155 chars) |
|---|---|---|
| `/` | The Chaithanya — Try new. Learn fast. Build big. | Founder log from a solo Indian founder building with AI. Startup lessons, AI tools and real experiments — wins and failures, every Saturday. |
| `/blog` | Blog — Founder log & lessons \| The Chaithanya | Startup lessons, AI tools and honest founder logs from India. Simple words, real numbers, no hype. New post every Saturday. |
| `/blog/[slug]` | `{SEOTitle or Title} \| The Chaithanya` | `{Summary}` (trim to 155) |
| `/products` | Products & experiments \| The Chaithanya | What I'm building with AI, in public. The first products open here soon — get notified when they launch. |
| `/newsletter` | The weekly founder log newsletter \| The Chaithanya | One email every Saturday: what I tried, what happened, and one AI tool or system you can steal. Free. |
| `/privacy` | Privacy policy \| The Chaithanya | How The Chaithanya handles your email and messages. |

Every page also sets: `alternates.canonical` (absolute URL), `openGraph` (type `website`; posts `article` with `publishedTime`, `section` = Topic, `tags`), `twitter.card = 'summary_large_image'`, `robots: { index: true, follow: true }` (privacy: index true, 404: noindex), `metadataBase = new URL(site.url)`, `<html lang="en">`, `themeColor` `#F0EEE9` (light).

### 14.3 Open Graph images (1200×630)
- Default (`public/og/default.png`): Ink background, BinduMark (cloud stroke, saffron bindu) left, "Try new. Learn fast. **Build big.**" (Build big in saffron), "thechaithanya.com" small.
- Posts: generated at build time (static) with `@vercel/og`-style JSX → PNG via `satori` + `@resvg/resvg-js` in `scripts/generate-feeds.ts`: Indigo background, topic label, title (Cloud, 64px/800), BinduMark corner badge (same corner every time, like YouTube thumbnails). Save to `public/og/{slug}.png`.

### 14.4 Structured data (JSON-LD in `<script type="application/ld+json">`)
- **Home:** `WebSite` (name, url, `potentialAction` SearchAction → `/blog?q={search_term_string}`) + `Person` (name "Chaithanya", url, `sameAs` = social URLs, `jobTitle` "Founder", description) + `Organization` for the brand (name "The Chaithanya", logo `/icon-512.png`, sameAs).
- **Blog index:** `Blog` with `blogPost` list (headline, url, datePublished).
- **Post:** `BlogPosting` (headline, description, image, datePublished, dateModified (Notion `last_edited_time`), author Person, publisher Organization, mainEntityOfPage, articleSection, keywords) + `BreadcrumbList` (Home › Blog › Post) + `VideoObject` if `VideoURL` (name, description, thumbnailUrl, uploadDate = post date, embedUrl) + `FAQPage` if the post has FAQ lines.
- **Newsletter:** `WebPage` + `ContactPage` for the contact section.
- Validate with Google's Rich Results Test before launch.

### 14.5 Sitemap / robots / RSS
- `app/sitemap.ts`: all static routes + every post (`lastModified` = Notion last edited time). Exclude 404.
- `app/robots.ts`: `User-agent: *` Allow `/`; `Sitemap: https://thechaithanya.com/sitemap.xml`. **AI crawlers are allowed** (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) — the goal is to be found and cited.
- `/rss.xml`: RSS 2.0, latest 20 posts (title, link, guid, pubDate, description = summary, category = topic). Add `<link rel="alternate" type="application/rss+xml">` in the head.

### 14.6 On-page SEO rules
- One `h1` per page; logical h2/h3 order.
- Post URLs: `/blog/{slug}` — short, keyword-first, no dates.
- Internal links: each post links to 3 "Read next" posts + topic; Home lists latest 3.
- All images: meaningful `alt` (Notion caption → alt; else post title), explicit width/height, lazy below the fold.
- Google Search Console + Bing Webmaster Tools: verify domain, submit sitemap (Chaithanya, after launch).

---

## 15. Files for AI assistants

### 15.1 `/llms.txt` (generated at build by `scripts/generate-feeds.ts`)
```markdown
# The Chaithanya

> Founder log from Chaithanya, a solo Indian founder building with AI. Startup lessons, AI tools & building, money & investing, and life & mindset — shared honestly, wins and failures, every Saturday. Tagline: Try new. Learn fast. Build big.

The Chaithanya is a faceless personal brand: screen, voice and story — no face on camera. Content is in English, for young Indians (18–30) who want to build something. Products are being built in public and are not public yet.

## Start here
- [Home](https://thechaithanya.com/): who Chaithanya is and what the founder log is
- [Blog](https://thechaithanya.com/blog): all posts, filterable by topic
- [Newsletter](https://thechaithanya.com/newsletter): the weekly founder log by email, every Saturday

## Posts
- [{Title}](https://thechaithanya.com/blog/{slug}): {Summary}   ← one line per published post, newest first

## Topics
- Startup lessons
- AI tools & building
- Money & investing
- Life & mindset

## Follow
- [YouTube]([YOUTUBE_URL]): weekly founder log video, every Saturday
- [Instagram]([INSTAGRAM_URL]): Reels
- [X]([X_URL]): build notes
- [LinkedIn]([LINKEDIN_URL]): founder lessons

## Optional
- [Full text of all posts](https://thechaithanya.com/llms-full.txt)
- [Products & experiments](https://thechaithanya.com/products): coming soon
- [Contact](https://thechaithanya.com/newsletter#contact): collaborations, sponsorships, podcasts, experiment ideas
```

### 15.2 `/llms-full.txt`
Same header as llms.txt, then every published post in full as Markdown: `# {Title}`, `Published: {date} · Topic: {topic} · URL: {url}`, TL;DR bullets, body converted from Notion blocks to Markdown (headings, lists, quotes, code fences, image alt text as `![alt](url)`), separated by `---`.

### 15.3 Per-post Markdown (optional, nice to have)
Also write `/blog/{slug}.md` (same Markdown as in llms-full) and link it with `<link rel="alternate" type="text/markdown" href="/blog/{slug}.md">`.

---

## 16. Accessibility (WCAG 2.2 AA)
- Real elements: `<a href>` for navigation, `<button>` for actions, `<label>` for every input.
- Visible focus ring everywhere: `outline: 3px solid #E8792B; outline-offset: 3px` (on Ink use Cloud outline).
- Touch targets ≥ 44×44px.
- Colour contrast per section 6.1 (no saffron text on Cloud).
- Skip link "Skip to content" as the first focusable element.
- Marquee and decorative SVGs `aria-hidden`; motion respects `prefers-reduced-motion`.
- Ask me panel: dialog semantics, focus trap, Esc to close, live region for answers.
- Topic filters: `aria-pressed`; TOC: `aria-current="true"` on the active item.
- Forms: errors announced (`aria-live`), linked with `aria-describedby`.

## 17. Performance budget
- Lighthouse (mobile): Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100.
- LCP < 2.0s, CLS < 0.05, INP < 200ms.
- JS: keep client components minimal (Nav menu, AskMe, filters, progress bar, TOC, share/listen/copy). Everything else server/static.
- Fonts: `next/font` with `display: swap`, only the weights listed.
- Images: build-time resized (cover 1200w + 600w via `sharp`), WebP, lazy.
- YouTube: lite embed (no iframe until click).
- No third-party scripts except Cloudflare Web Analytics and the newsletter embed (only on pages with forms, loaded on interaction if possible).

## 18. Responsive
| Breakpoint | Behaviour |
|---|---|
| ≥1240px | Full layout, container 1240 |
| 861–1239px | Bento 4 columns shrink; hero row wraps if needed |
| ≤860px | Bento 1 column (all spans reset); post sidebar moves above the article as a collapsible "On this page"; nav collapses to menu |
| ≤480px | Side padding 16px; display type uses the clamp minimums; email forms stack (button full width) |
Design is fluid (%, rem, clamp) — no fixed pixel widths on page roots.

## 19. Environment variables
```
NOTION_TOKEN=
NOTION_BLOG_DATABASE_ID=          # or
NOTION_BLOG_DATA_SOURCE_ID=
NEXT_PUBLIC_SITE_URL=https://thechaithanya.com
NEXT_PUBLIC_NEWSLETTER_FORM_URL=  # public embed endpoint (no secret)
NEXT_PUBLIC_CF_ANALYTICS_TOKEN=
# Contact Worker (set with `wrangler secret put`)
CONTACT_TO_EMAIL=
EMAIL_API_KEY=                    # if an email service is used
# GitHub Actions secrets
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ACCOUNT_ID=
```
Never commit `.env*`. Add `.env.example` with empty values.

## 20. Deployment (Cloudflare, free)
1. Buy/point **thechaithanya.com** to Cloudflare (nameservers).
2. `wrangler.jsonc`: name `thechaithanya`, `assets: { directory: "./out", not_found_handling: "404-page" }`, route = the custom domain. (Cloudflare Pages with output dir `out` is also fine.)
3. Deploy the contact Worker separately with route `thechaithanya.com/api/*`.
4. Turn on: Always Use HTTPS, HSTS, Brotli, Web Analytics.
5. Redirect `www.thechaithanya.com` → `thechaithanya.com` (301).
6. Security headers (via `_headers` or Worker): `Content-Security-Policy` (self + youtube-nocookie + newsletter provider + Cloudflare analytics), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera=(), microphone=(), geolocation=()).

## 21. Testing
- Unit: `matcher.ts` (each starter FAQ question returns its answer; nonsense returns the fallback), slug/readingTime helpers, Notion block → Markdown converter.
- Build test: run `fetch-notion` against a test Notion database with one post containing every supported block type.
- Manual: keyboard-only walkthrough of every page; screen reader check of Ask me panel; phone check at 375px.
- Lighthouse CI in the GitHub workflow (warn under budget).

---

## 22. Build phases (prompts for Cursor)

Do them in order. Paste the prompt, review the diff, run it, tick the checklist.

**Phase 1 — Setup**
> "Read BUILD-SPEC.md sections 3, 5, 6. Create a Next.js App Router + TypeScript + Tailwind project with static export, Manrope + JetBrains Mono via next/font, brand tokens as CSS variables and Tailwind colours, the motion utilities in 6.4 (with reduced-motion), and the folder structure in section 5 with empty files. Add .env.example and lib/site.ts."
- [ ] `npm run dev` works · [ ] `npm run build` creates `/out` · [ ] tokens usable as `bg-ink`, `text-saffron` etc.

**Phase 2 — Brand + layout**
> "Build BinduMark, Logo, Wordmark, BigWordmark (section 7), then Nav, Footer and the Ask me floating button shell (section 8) and put them in app/layout.tsx with a skip link."
- [ ] Sticky floating nav · [ ] mobile menu works with keyboard · [ ] active link styling

**Phase 3 — UI kit**
> "Build Button (ink, saffron, outline, pill sizes), Pill, Chip (aria-pressed), Card with lift, SectionLabel with optional blink dot, Marquee, EmailForm (states from 13.1, provider URL from env)."

**Phase 4 — Home**
> "Build the Home page exactly as section 9.1 using the UI kit. Blog list reads from lib/posts.ts (return [] if no posts and show the empty state)."
- [ ] Bento collapses to 1 column ≤860px · [ ] marquee stops with reduced motion

**Phase 5 — Notion pipeline**
> "Implement section 10: lib/notion.ts using Notion API version 2025-09-03 and the data source query endpoint, scripts/fetch-notion.ts writing content/posts/*.json and downloading images, rate-limit handling, and lib/posts.ts helpers (getAllPosts, getPost, getByTopic, getFeatured, getReadNext)."
- [ ] Draft posts excluded · [ ] future-dated posts excluded · [ ] images load from /blog-images

**Phase 6 — Blog index + Post page**
> "Build /blog (section 9.2) with URL-synced topic filter and live search, and /blog/[slug] (section 9.3) with generateStaticParams, NotionBlocks renderer (10.5), progress bar, TOC with active state, TL;DR, Steal this with Copy, Listen (speechSynthesis), Share, lite YouTube, Read next."

**Phase 7 — Products, Newsletter, Privacy, 404**
> "Build /products (9.4, generic teasers only), /newsletter (9.5) with the contact form posting to /api/contact, /privacy (9.6) with placeholders, and not-found (9.7)."

**Phase 8 — Ask me**
> "Implement section 12: build-faq-index script, content/faq.json from 12.4, matcher.ts with tests, and the accessible AskMePanel. Hero ask bar, chips, bento tile and post sidebar card all open the panel (optionally pre-filled)."

**Phase 9 — SEO + AI files**
> "Implement section 14 (metadata per route, canonical, OG images, JSON-LD builders in lib/seo.ts, sitemap, robots, RSS) and section 15 (llms.txt, llms-full.txt, per-post .md)."
- [ ] Rich Results Test passes for a post · [ ] /llms.txt lists posts

**Phase 10 — Contact Worker + deploy**
> "Create workers/contact (section 13.2), wrangler.jsonc for static assets (section 20), security headers, and .github/workflows/deploy.yml (section 11) with cron, manual trigger, skip-if-unchanged and Lighthouse CI."

**Phase 11 — QA**
> "Go through sections 16, 17, 18 and 21. List every issue found, then fix them."

---

## 23. Placeholders Chaithanya must fill

| Placeholder | Where |
|---|---|
| `[HANDLE]` | Same handle on every platform (still undecided) |
| `[YOUTUBE_URL]` `[INSTAGRAM_URL]` `[X_URL]` `[LINKEDIN_URL]` | lib/site.ts, FAQ, llms.txt |
| `[LATEST_VIDEO_URL]`, week number `[X]` | Home hero pill + video tile (or read from the newest post with VideoURL) |
| `[CONTACT_EMAIL]` | Newsletter page, privacy, Worker (e.g. hello@thechaithanya.com — must exist) |
| `[NEWSLETTER PROVIDER]` | Pick one with a free tier |
| `[FORM SERVICE]` / `[EMAIL SENDING SERVICE]` | Contact Worker delivery |
| Privacy policy text | /privacy (get it reviewed) |
| Brand kit files | `public/` icons + logo SVGs from The-Chaithanya-Brand-Kit (folder 09) |
| First posts in Notion | At least 1 published post before launch (Founder log, week 1) |

---

## 24. Cursor rules (`.cursor/rules/project.mdc`)

```markdown
---
description: The Chaithanya website rules
alwaysApply: true
---
- Source of truth: BUILD-SPEC.md. Follow it exactly; ask before changing scope.
- Next.js App Router, TypeScript strict, Tailwind. Static export only (no server code in Next.js; server code lives in workers/).
- Brand: colours/typography/motion from spec section 6 only. Saffron never as text on Cloud. Manrope only (JetBrains Mono for code).
- Never show product names or real projects anywhere. Products page stays generic "coming soon".
- "Ask me" is rule-based, never call it AI, never add an LLM or paid API.
- No fake data: no invented stats, testimonials, dates or counts. Use [PLACEHOLDER].
- Copy voice: simple words, short sentences, no hype words (insane, game-changer, secret, crazy).
- Accessibility: semantic elements, labels, focus rings, 44px targets, reduced motion.
- Notion API version 2025-09-03, data source query endpoint; download Notion images at build time.
- Keep client components minimal; mark with 'use client' only when needed.
- Never commit secrets or .env files.
```

---

## 25. Launch checklist
- [ ] Domain live on HTTPS, www → apex redirect
- [ ] At least 1 published post; RSS, sitemap, llms.txt include it
- [ ] Newsletter signup tested end-to-end (double opt-in email received)
- [ ] Contact form tested (message received)
- [ ] Privacy policy published and linked from every form
- [ ] All `[PLACEHOLDER]`s replaced (search the repo for `[`)
- [ ] Lighthouse budgets met on Home, Blog, Post
- [ ] Search Console + Bing verified, sitemap submitted
- [ ] Social bios link to thechaithanya.com
