# Cursor prompts — thechaithanya.com

## Before you start (5 minutes)
1. Make one folder, e.g. `thechaithanya-site/`, with:
   ```
   thechaithanya-site/
   ├─ BUILD-SPEC.md
   ├─ PROMPTS.md
   ├─ .cursor/rules/project.mdc
   ├─ design-reference/          (6 html files)
   └─ The-Chaithanya-Brand-Kit/  (your brand kit, unzipped)
   ```
2. Open the folder in Cursor. Use **Agent mode** with the strongest model available.
3. Paste the **MASTER PROMPT** first. Then paste the phase prompts one by one (new chat per phase works best). Don't skip the check after each phase.

---

## MASTER PROMPT (paste first)

```
You are a senior Next.js engineer and designer. Build my personal brand website thechaithanya.com.

Read these before writing any code:
1. BUILD-SPEC.md — the full spec. Section 0 "FINAL DECISIONS" overrides everything else.
2. .cursor/rules/project.mdc — rules you must always follow.
3. design-reference/*.html — the approved designs (01-home, 02-blog, 03-blog-post, 04-products, 05-newsletter-contact, 06-ask-me-panel). Open and study them; match layout, spacing, type, colours and motion exactly. Rebuild them as clean Next.js components — do not copy their <x-dc> markup.
4. The-Chaithanya-Brand-Kit/ — my real logos and icons. List its folders and files, and use these files instead of redrawing.

Then reply with:
- a short summary of what you will build,
- the list of brand kit files you will use and where they go in public/,
- any questions or conflicts you found (between spec, designs and brand kit),
- the build plan following spec section 22 (11 phases).

Do NOT start coding until I reply "go". Then build ONE phase at a time. After each phase: run npm run build, fix every error, show me what changed, list what I must do by hand, and wait for me to say "next".
```

---

## PHASE PROMPTS (after you reply "go", or use these one per chat)

**Phase 1 — Setup**
```
Phase 1 (BUILD-SPEC sections 0, 3, 5, 6): create the Next.js App Router + TypeScript + Tailwind project with static export, Manrope + JetBrains Mono via next/font, brand tokens as CSS variables + Tailwind colours, motion utilities (blink, lift, arrow, marquee, spin) with reduced-motion, folder structure, .env.example, lib/site.ts with all placeholders. Copy favicons/app icons and logo SVGs from The-Chaithanya-Brand-Kit into public/. Run the build.
```

**Phase 2 — Brand + layout**
```
Phase 2 (sections 7, 8): BinduMark, Logo (use the brand kit horizontal logo SVG if present), Wordmark, BigWordmark; floating sticky pill Nav with mobile menu; Footer; skip link; Ask me floating button (shell only). Match design-reference/01-home.html header and footer.
```

**Phase 3 — UI kit**
```
Phase 3: Button (ink / saffron / outline), Pill, Chip (aria-pressed), Card with lift, SectionLabel with blinking dot, Marquee, EmailForm (states from 13.1 + section 0 point 3; calls one subscribe() function that POSTs to /api/subscribe). Make a hidden /dev/ui page that shows every component.
```

**Phase 4 — Home**
```
Phase 4 (section 9.1): build the Home page to match design-reference/01-home.html exactly — hero with blinking-dot headline and Ask bar + chips, rotated topic marquee, bento grid (latest video, story, newsletter, ask me, follow list, products soon), numbered latest-3 blog list with empty state, end CTA, footer wordmark. Check it at 1440px and 375px.
```

**Phase 5 — Notion blog pipeline**
```
Phase 5 (section 10): lib/notion.ts with Notion API version 2025-09-03 and the data source query endpoint; scripts/fetch-notion.ts that writes content/posts/*.json and downloads all images to public/blog-images; rate-limit + retry; lib/posts.ts helpers. Add npm scripts "fetch" and "build" (fetch → next build → feeds). Tell me exactly how to create the Notion "Blog" database (properties in 10.2), the integration, and how to find the data source ID.
```

**Phase 6 — Blog + Post pages**
```
Phase 6 (sections 9.2, 9.3, 10.5): /blog matching design-reference/02-blog.html (featured bento, URL-synced topic filter, live search, numbered list, empty state) and /blog/[slug] matching 03-blog-post.html (progress bar, breadcrumb, meta, Listen via speechSynthesis, Share, lite YouTube, sticky TOC with active state, TL;DR box, NotionBlocks renderer incl. Steal this + Copy, pull quote, tags, subscribe band, Read next).
```

**Phase 7 — Products, Newsletter, Privacy, 404**
```
Phase 7 (sections 9.4–9.7 + section 0): /products matching 04-products.html but locked cards say "Coming soon" (no product hints); /newsletter matching 05-newsletter-contact.html with the contact form posting to /api/contact; /privacy (Notion + Cloudflare as processors, placeholders, DPDP Act 2023 mention); not-found page.
```

**Phase 8 — Ask me**
```
Phase 8 (section 12): content/faq.json (starter list in 12.4), scripts/build-faq-index.ts, components/askme/matcher.ts with unit tests, accessible AskMePanel matching 06-ask-me-panel.html (dialog, focus trap, Esc, live region, chips, link cards, fallback to contact). Wire the hero ask bar, chips, bento tile, blog ask bar and post sidebar card to open it pre-filled. No AI, no external API.
```

**Phase 9 — SEO + AI files**
```
Phase 9 (sections 14, 15): metadata per route, canonical, OG images (default + per post at build time), JSON-LD (WebSite, Person, Organization, Blog, BlogPosting, BreadcrumbList, VideoObject, FAQPage), sitemap, robots (allow AI crawlers), rss.xml, llms.txt, llms-full.txt, per-post .md files. Show me the generated llms.txt.
```

**Phase 10 — Worker + deploy**
```
Phase 10 (sections 11, 20 + section 0 points 3–5): workers/api with /api/subscribe and /api/contact saving to Notion Subscribers and Inbox (validation, honeypot, rate limit, CORS); wrangler.jsonc for static assets from ./out; security headers; .github/workflows/deploy.yml (cron every 30 min, manual run, skip if unchanged, Lighthouse CI). Then give me a step-by-step checklist: Cloudflare account, domain, secrets, Notion databases, first deploy.
```

**Phase 11 — QA**
```
Phase 11 (sections 16–18, 21, 25): full QA — accessibility (keyboard, focus, contrast, reduced motion), performance budget, responsive at 375/768/1440, all tests passing. List every issue, fix them, then show me the launch checklist with what's done and what I still must do.
```

---

## Useful follow-up prompts
- "Compare the page at localhost with design-reference/0X-....html and list every visual difference, then fix them."
- "Search the repo for `[` placeholders and list them with file and line."
- "Explain in simple steps how I publish a new blog post."
