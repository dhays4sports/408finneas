# SIGNAL-NORTH-STAR-1.0 — production integration

2026-09-24. Canonical broad Signal candidate: `signal-routes-1.0`. This supersedes preview-only deployment instructions; historical QA remains preserved. Infrastructure publication does not activate the public acquisition routes.

## Boundaries

408FARMERS owns acquisition, anonymous interaction, attribution and explicit contact choice. CoverageFit owns evidence interpretation, Opportunity Priority, FIV, NBA and producer context. Anonymous participation does not earn buying-intent credit; a qualified signal is not a durable opportunity or contact permission. Home handoff requires explicit identity, channel choice and permission. SMS is a separate identified context and stays review-first. AgencyZoom remains outbound cadence/CRM owner.

Current: Exposure → Signal → Evidence → Opportunity Priority / FIV → NBA → Execution → Outcome Measurement.
Future: Exposure → Signal → Evidence → State → Action EV → Execution → Outcome → Learning → Acquisition Capital Allocation.
No calibrated P(Bind), Action EV, DIG/$, contactability model, response-velocity model or market.ad runtime is implemented. See CoverageFit `docs/SIGNAL-NORTH-STAR-1.0.md` for the conformance matrix, attribution/outcome contract and phases A–F. Future market.ad needs source and feedback adapters, not a replacement decision engine.

## Endpoint ownership defect fixed

Before: route registry embedded an obsolete CoverageFit preview endpoint; route shell explicitly overrode production transport configuration. Life pilot had the same override.
After: route registry owns route metadata only. Both shells delegate to `signal-decision-remote.js`. The pages load `shared/config.js` before the remote client. Resolution is explicit test override → LANDING_PAGE_CONFIG.coverageFitSignalDecisionUrl → production default `https://coveragefit.com/api/signal/decision`.

HTTPS validation and bounded loopback test support remain. Signal CSP now permits exactly self and https://coveragefit.com, without wildcard. Tests prove default/config/explicit precedence, unsafe protocol rejection, registry ownership, shell delegation, config load order and exact CSP. No production decision path uses an obsolete preview backend.

## Preview reference classification

| Occurrence | Treatment |
|---|---|
| Route registry and route shell | Removed transport override |
| Life pilot shell | Removed obsolete decision endpoint |
| `_headers` Signal/Life policies | Exact production CoverageFit connect-src |
| Home proxy allowed destinations | Removed preview target; production-only destination |
| Home proxy synthetic test | Uses production URL with injected fake transport; no network send |
| `_worker.js` Life preview handler | Retained exact historical origin guard; returns 404 on production origins |
| `migrations/signal-preview/` | Historical isolated Life staging only; do not apply in production |
| Life staging/handoff tests | Historical isolation fixtures retained; not production delivery certification |
| QA/docs | Historical notices added; no evidence deleted |
| Local decision demo | Lab-only foundation fixture, not loaded by remote product surfaces |

## Route semantics and preservation

Home, buyer and condo seed home; auto seeds auto; business seeds business; auto-bundle remains home-first without fabricated ownership/eligibility. Tech/healthcare/teachers/engineers remain unknown product and do not imply employment or carrier fit. General start remains unknown.

Signal routes remain noindex/nofollow and outside the sitemap. Current `/home/`, `/buyer/`, affinity routes and other public funnels are not activated by this patch. The pre-existing candidate's 1.4.2 production-handoff baseline (`fcba145`) remains: condo, appointment intake and tech assets are not reverted. No live route activation commit is included.

## Certification

- CoverageFit: 137 test entries passed, zero failures/skips; 192 server/functions/tests syntax checks passed; local Pages Functions build passed.
- 408: 22 test entries passed, zero failures/skips, across 11 scripts including new endpoint tests. Route suite covers 11 routes / 58 paths. Foundation, bridge, shell resume, CSP, loopback HTTP, Life preview/handoff/staging, Home proxy and routes included.
- 408 syntax: 62 JS/MJS/CJS files passed. VM and local HTTP/SQLite tests are not deployed browser canaries.
- No new migrations, scoring weights or dependency framework.

## Git and production gates

Verified starting main fd4c6849a871649dd9840ff61eaa5a9407a515d0; starting candidate cd015fc52890830a991ab304681ab8816b2d0a09 was 53 ahead / 0 behind. Retain `pre-signal-production-20260924` at fd4c6849a871649dd9840ff61eaa5a9407a515d0 and the feature branch. Publish this certified candidate with a normal fast-forward; never force main. Exact resulting SHA is recorded in the execution handoff/Git history.

No Cloudflare configuration has been confirmed by Dylan during this mandate. A Git merge is not proof of successful deployment. Production-hosted Signal, Home durable receipt, authenticated producer workspace, approved SMS send and real traffic remain unverified until their gates pass. Public route activation stays deferred.

## Manual Cloudflare checkpoint (production only)

| Project | Setting | Type | Required value / verification |
|---|---|---|---|
| 408FARMERS | Decision URL | Source config | Already https://coveragefit.com/api/signal/decision; no dashboard variable needed |
| 408FARMERS | CSP | Source `_headers` | Already exact production CoverageFit; no dashboard edit needed |
| 408FARMERS | SIGNAL_HOME_HANDOFF_URL | Variable | https://coveragefit.com/api/signal/home-handoff |
| Both | COVERAGEFIT_LEAD_SYNC_SECRET | Secret | Same strong value, at least 32 characters; never return it in chat |
| CoverageFit | COVERAGEFIT_DB | D1 binding | Existing production database, preserve identity |
| CoverageFit | migration 0019 | Manual SQL | Verify existing tables/indexes; apply exact additive file only if missing |
| CoverageFit | COVERAGEFIT_PRODUCER_ACCESS_TOKEN | Secret | Preserve existing valid token, at least 24 characters |
| CoverageFit | CF_SIGNAL_ALLOWED_ORIGINS | Variable | Unset uses built-in production origins; if set: https://408farmers.com,https://www.408farmers.com |
| CoverageFit | CF_SIGNAL_ALLOW_LOCALHOST | Variable | Unset or false |
| CoverageFit | SIGNAL_HOME_HANDOFF_ENABLED | Variable | Keep 0 until matching Home secret/URL are configured; then 1 for synthetic canary |
| CoverageFit | CF_SMS_SIGNAL_ENABLED | Variable | Keep 0 until separate internal canary checkpoint |

Do not configure SIGNAL_HANDOFF_PREVIEW_DB or apply Life preview migrations in production. After manual settings, redeploy the existing main deployments. Return deployment SHAs, database name, migration verification results and setting names confirmed—never secrets. Previous checkpoint A is still pending; no need to repeat an item already completed, only report it.

Next: anonymous production journeys, then synthetic Home handoff with producer receipt at CoverageFit `/agent/workspace/` (Original Inquiry) and retry dedupe. UI success alone is insufficient. No automatic SMS or AgencyZoom write. Internal SMS canary waits for deliberate manual enablement and exact-send approval. Do not begin market.ad.
