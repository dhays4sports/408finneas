# 408FARMERS Professional Landing Experience 1.0

Date: October 22, 2026 (Pacific). Status: unpublished candidate; conditional release readiness.
Mandate: 408FARMERS-PROFESSIONAL-EXPERIENCE-1.0.

## Current-state audit

Canonical acquisition repository: dhays4sports/408finneas. Baseline main: c53c8b6. CoverageFit integration baseline: 2cafacb7d0e8b7c05479758c66c46c5b13f16802. No CoverageFit source was changed.

Live inspection confirmed `/tech`, `/healthcare`, and `/teachers` serve a generic “A focused insurance review with Dylan” opening. `/engineers` redirects to `/engineers/` and serves the older, longer occupational landing page. This is deliberate staged routing, not evidence that the existing questionnaire is broken. `ACTIVE_ENTRY_ROUTES` excludes engineers at baseline; `_routes.json` omits its trailing-slash Worker dispatch. Historical documentation explicitly leaves Engineers inactive by operator decision; Healthcare hosted certification was waived, not passed.

The three active professional routes request server-rendered HTML from CoverageFit `/api/distribution/presentation`. The browser uses the shared `entry-client.js`, posting through same-origin `/api/entry/interact` and `/events`. CoverageFit owns question selection, versioned answers, cookie continuity, explicit contact consent, and producer projection. Live Tech Auto selection advanced and reported Saved; no live contact request was submitted.

The first question offers Home, Auto, Life and Business. Questions adapt to the selected product and prior answers. Back uses revision checks; stale or invalid answers are rejected. Contact requests require name, phone, selected call/text channel and explicit permission. They do not authorize automated marketing. On confirmed producer delivery, the UI says the request reached Dylan's workspace; failed delivery has a retry state. The canonical journey does not automatically schedule an appointment. Existing review/appointment links retain the legacy workflow.

Legacy Engineers contains name, phone, email, address, engineering field and callback-related controls; personal-contact consent and separate optional automated-marketing consent are distinct. Its large hero, repeated review explanations, advisor sections and competing contact links differ from the canonical opening. Existing agency license/address text was not independently verified; it is retained only in untouched legacy assets, not copied into the new presentation.

## Design and implementation

Shared presentation adapter: `server/professional-presentation.mjs`. Scoped stylesheet: `shared/professional-entry.css`. The adapter decorates the existing canonical HTML; it does not recreate state, questions, options, scripts or intake logic. Unknown upstream markup is returned unchanged. Upstream format changes are therefore a maintenance consideration.

All four candidate routes share warm white, navy, restrained gold, system fonts, generous spacing, profession label, the campaign headline, conditional discount copy, “Quick review”, a 48px advisor portrait, and a compact personal-review promise. Cards retain existing answer codes and labels. The introductory question is “What would you like me to review?”; after Back, the unchanged canonical client renders its original equivalent prompt. No new fields, frontend JavaScript, fonts, pixels or services were added.

Existing Farmers SVG and 160px Dylan WebP are reused without redrawing. Displayed identity is Dylan Haysbert, Insurance Advisor, Virginia Tam Insurance Agency, Inc., CA Insurance License #4528400, California. No unverified agency license number or address is added.

`entry-presentation-proxy.mjs` applies styling only to these four professions. Its CSP permits same-origin styles/images for those routes; original script/connect restrictions remain. Stale response Content-Length/ETag are removed after transformation. Non-professional rendering and transport remain unchanged.

Engineers joins the canonical route set in this unmerged candidate. The original page is copied byte-for-byte to `engineers/legacy.html`; both legacy aliases explicitly bypass the canonical handler. `_worker.js` and `_routes.json` route those aliases and the trailing-slash professional page. This is a real migration of the Engineers entry experience and must be considered during release approval.

## Functional acceptance evidence

Run `node --test tests/*` from 408finneas, with CoverageFit checked out as sibling `../CoverageFit` at the SHA above. Node 24.19.0.

- 61/61 acquisition tests pass, including regression suites for existing signal routes, endpoint ownership, privacy, retry and life handoffs.
- 16 new route × product integration cases execute the actual acquisition proxy and CoverageFit handlers against isolated in-memory SQLite with real migrations. They verify initial choice, progression to terminal state, Back, invalid answers, required consent, invalid phone, one producer opportunity despite repeated submission, original route, audience, paid-social campaign, call permission and zero SMS conversations.
- CoverageFit's existing distribution journey suite: 25/25 pass, including resume, delivery failure/retry, stale revision rejection, cookie security and measurement behavior.
- Browser: Engineers Auto journey exercised selection, Back, adaptive questions, required-field validation, explicit consent and synthetic contact submission. `browser-confirmation.jpg` records the confirmation; `browser-receipt.json` records one synthetic producer opportunity with saved answers and source context. Its CRM status is pending and appointment is null: neither external CRM delivery nor scheduling is certified by this test.

The preview used actual CoverageFit handlers with an isolated SQLite store, empty provider environment and local static assets. Only the local HTTP test harness omitted Secure on its session cookie and removed frame-ancestor restrictions for viewport frames. Production cookie handling and CSP were not weakened for tests. No real prospect communications were sent. No provider integrations were activated.

## Visual and mobile acceptance

`professional-experience-evidence/` contains before/after screenshots for Tech, Healthcare, Engineers and Teachers at 390px. Before images are local source-baseline renderings, not screenshots captured from mobile production. Legacy Engineers scripts were disabled in the baseline preview to prevent production calls. After images are the unpublished candidate. Full-page capture timed out during the batch; remaining images use the browser viewport and may not include the entire footer.

Browser DOM measurements across all four routes at 320, 390, 768 and 1280px show document width equal to viewport width, loaded logo/headshot, and selection targets at least 52px tall. See `viewport-checks.json`. Mobile and desktop screenshots were visually inspected for hierarchy, spacing and wrapping. Focus styles remain explicit; native validation and question focus worked in the browser. This is Chromium with width-constrained frames, not iOS device emulation or Instagram WebView certification. Actual Instagram/iOS and hosted CSP/assets remain release checks. No measured conversion or real-network speed improvement is claimed.

Added CSS is 4,215 bytes; existing headshot 4,094 bytes and SVG 5,785 bytes, approximately 14.1KB total uncompressed assets. No added JavaScript. The proxy buffers professional HTML to decorate it; production latency was not benchmarked.

## Conversion readiness

| Stage | Verified state |
|---|---|
| Landing visit / initial question | Existing `landing_view` / `first_question_view` events retained |
| Interest selection / start | Existing first-answer and session-start events; product persists in canonical answers |
| Questionnaire completion | Existing session-completed event |
| Submitted review / producer receipt | Existing contact-requested and producer-handoff events; isolated durable receipt verified |
| Qualified prospect | Canonical decision evidence retained; no new qualification definition or attribution dashboard added |
| Scheduled review | Legacy appointment link preserved; live calendar handoff not tested |
| Completed quote / written premium | No end-to-end ad-to-premium attribution verified in this scope |

Route/audience and allowed UTM values persist without becoming individual profession/eligibility evidence. Unsafe identity parameters are not forwarded into the handoff. Existing structured `attribution.utm` and distribution `firstTouch` retain campaign context. Paid social requires consistent `utm_medium=paid_social`; the browser test omitted medium and correctly remained organic_web under existing rules. No new third-party analytics were installed. Campaign naming and paid-medium discipline are operational requirements, not new code.

## Advertising review

Farmers' public Auto FAQ states profession can be a discount factor (https://www.farmers.com/faq/auto/). Its discount overview says availability varies by policy and state (https://www.farmers.com/discounts/). These support cautious general framing but do not certify every technology, healthcare, engineering or education role in California. GroupSelect materials are not treated as evidence for this agency's products.

Before production: agency/compliance must confirm the four occupation-specific statements, existing logo/headshot authorization, Insurance Advisor title and personal-review promise. No guaranteed savings, eligibility, approval, response time or automatic coverage change is represented. Existing privacy links and canonical consent are retained. The new disclosure states eligibility/underwriting/policy conditions and no automatic binding or policy change.

## Release recommendation and rollback

Recommendation: ready for design/code review and isolated hosted acceptance; NOT yet approved for production. No merge, production publish, ad launch, paid subscription, provider configuration or outbound automation occurred.

Remaining gates:
1. Agency/compliance approval of copy, identity and existing assets.
2. Isolated hosted test of all four routes through deployed Pages and CoverageFit, with authoritative producer receipt, campaign context, cookie/CSP behavior and legacy scheduling continuity. Especially important for Engineers' prior inactive decision and Healthcare's previously waived certification.
3. iPhone/Instagram in-app-browser smoke test; real mobile load check.
4. Separate owner production-release approval, as required by this mandate.

Deploy only the acquisition candidate after those gates; no CoverageFit migration is required by this change. Pin the accepted commit and retain the previous Cloudflare deployment. Roll back by restoring the prior acquisition deployment or reverting this change. This restores the old active route set and Engineers static entry; it does not delete sessions, prospects, consent or other CoverageFit data. Do not clear the database during rollback.
