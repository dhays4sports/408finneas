# Home + auto combined review 1.0 — coordinated acceptance

Mandate: 408FARMERS-HOME-AUTO-COMBINED-REVIEW-1.0. November 14, 2026 (Pacific). Review candidates only; no merge or production publishing.

## Candidates and scope

Backend: [CoverageFit PR #38](https://github.com/dhays4sports/CoverageFit/pull/38), exact commit `4c0758a75def7cd5a82fcc97ca9c08318d7aa247`, based on `4aacbb82d789bf55a5b7e289a9f014382df5d36f`.

Frontend: this PR, based on production `0c59566f7adb378563124207ec609365aae79968`. Production changes are limited to four scoped CSS rules and the professional stylesheet version (1.2). The full-width Home + auto option is supplied by the canonical backend, never simulated by the frontend. Single-product paths and the published visual hierarchy remain intact. Existing real proxy-to-handler tests are extended for all four combined routes.

[Backend implementation and contract](https://github.com/dhays4sports/CoverageFit/blob/4c0758a75def7cd5a82fcc97ca9c08318d7aa247/docs/PROFESSIONAL-HOME-AUTO-1.0.md).

## Accepted behavior

- Explicit Home + auto choice above the four original options, with equal styling and no preselection.
- Immediate progression and a server-confirmed “Reviewing: Home + auto” label on questions, contact and confirmation.
- **Six questions** on the normal combined path, including selection: coverage → home reason → auto reason → home timing → auto timing → property type. **Five** when home is just research. Contact fields are separate. Early contact remains possible after the first choice.
- Separate per-policy evidence and unknowns; no automatic inference of homeownership, occupancy, discount eligibility, ready-to-buy intent, or exact policy dates.
- One consented request and producer opportunity with readable per-policy facts, source/campaign, contact preference and authenticated JSON export.
- Existing sessions keep their original flow. Back/change removes obsolete active evidence, retains bounded separate audit history, and clears the combined label. Resume, restart, stale revisions, validation, retries and duplicate protection remain effective.

## Verification

Node 24.22.1:

| Check | Result |
| --- | --- |
| Frontend complete suite, `node --test tests/*` | **74/74 passed** |
| New backend combined-review suite | **25/25 passed** |
| Backend complete suite, `node --test tests/*.test.mjs` | **399/400 passed** |
| Four professions × 375, 390, 430, 1280px | **16/16 layouts checked** |

The sole backend failure is `tests/agencyzoom-raw.test.mjs`: an existing assertion expects “48 hours,” while current main returns “READY — outside 7 days; import outside NEW_LEAD pilot.” A separate run on pristine CoverageFit main reproduced it. No unrelated runtime rule or assertion was modified. This is not an all-green full backend suite.

New tests cover four routes with home-first urgency, auto-first urgency, research and partial early contact; six/five-question bounds; distinct evidence, permissions, original attribution and one durable opportunity; export round-trip and authenticated workspace isolation; legacy sessions; Back/change and bounded audit; invalid/stale submissions; failed projection, reconciliation/retry and deduplication; restart; unchanged single-product scope; priority equivalence without product-count points; and safe withdrawal of new combined enrollment.

Actual browser acceptance used the frontend proxy, CoverageFit handlers, real migrations on isolated in-memory SQLite, and the real producer interface. It verified separate timing, property type, refresh/resume, required contact/permission controls, one confirmed request, the readable producer detail, restart and coverage changes. Keyboard focus is a visible 3px outline. All initial choices are at least 52px tall; no horizontal overflow or missing logo/headshot was observed. Width-constrained Chromium frames are not physical iOS/Safari or Instagram WebView certification. Cloud-browser input dispatch had intermittent timing/coordinate failures; state was inspected after failures, and the completed flow was confirmed through visible state and the authoritative receipt rather than assuming an attempted click succeeded.

## Working preview

Check out the frontend candidate and backend exact commit above as sibling directories `408finneas` and `CoverageFit`. Run:

`node qa/professional/combined-server.mjs`

The default port is 4173, overridable with `PORT`. Node's built-in SQLite is required; no packages or real credentials are needed. The Work session also has the tested preview and producer record open.

The preview provides profession and width controls, a fresh synthetic session, and `/qa-producer`, a visibly labeled local fixture of the real producer workspace. Its public synthetic token grants access only to the in-memory test database. The production producer authentication path remains intact. The harness localizes assets and omits Secure on local HTTP cookies, as the existing QA harness does; production CSP/cookies are not changed. No provider credentials, production database, external CRM delivery or real customer communications are used or certified.

## Evidence

[Evidence directory](home-auto-evidence/).

| Evidence | File |
| --- | --- |
| Full-width combined opening, mobile | [Opening](home-auto-evidence/opening-mobile-detail.png) |
| Home question and confirmed label | [Home reason](home-auto-evidence/combined-home-reason.png) |
| Separate auto timing | [Auto timing](home-auto-evidence/distinct-auto-timing.png) |
| Shared contact and explicit permission | [Contact](home-auto-evidence/contact.png) |
| Confirmed handoff | [Confirmation](home-auto-evidence/confirmation.png) |
| Readable real producer interface | [Producer record](home-auto-evidence/producer-record.png) |
| Authoritative synthetic source projection | [Receipt](home-auto-evidence/authoritative-receipt.json) |
| Responsive measurements | [Viewports](home-auto-evidence/viewports.json) |
| Browser acceptance summary | [Checks](home-auto-evidence/browser-checks.json) |

The receipt records exactly one opportunity, Home + auto requested, home renewal change / 31–60 days / condo, and auto immediate need / today-or-now. Permission permits the selected personal call, not automated marketing. Relative windows remain reported windows requiring exact-date confirmation.

## Deployment and rollback

After separate production authorization, deploy this backward-compatible frontend styling first, then the pinned CoverageFit backend. No migration or provider activation is required by this feature. Confirm the exact deployed pair, assets, cookies, contact request and producer visibility before declaring hosted acceptance.

For withdrawal, retain the compatible backend and set `PROFESSIONAL_COMBINED_NEW_REVIEWS=0`: new sessions return to single-product choices while saved combined sessions remain readable and actionable. Do not deploy an older backend that cannot understand saved version-1 records. Styling rollback does not erase evidence, but retain the full-width choice rule while combined sessions remain.

Unpublished backend #36/#37 and frontend #9/#10 remain separate and untouched. They overlap session/transport code; reconcile explicitly if integrated later. Their audience-isolation/preview-provider work is not silently adopted here. Existing cross-audience cookie behavior remains a known inherited limitation. Backend CSV portability work and external AgencyZoom mappings are not certified by this change. Hosted Cloudflare previews may require Access and a correctly isolated backend pairing; an automatic build is not hosted acceptance.
