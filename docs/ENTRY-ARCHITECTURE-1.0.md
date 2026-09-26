# 408FARMERS contextual entry — 1.0

2026-09-26. Supersedes the earlier visible-brand-transition shell recommendation.

408FARMERS presents contextual acquisition. CoverageFit owns questions, evidence, persistence, completion and producer projection. Home shows the first canonical question immediately; first answer starts the saved journey. The adapter forwards only a bounded same-origin operation to a fixed CoverageFit destination, with an opaque private cookie. No local question map, scoring or independent session store is introduced.

Home activation was attempted and then paused after the hosted server-to-server request failed. The active route set is empty; Home retains its existing consumer journey. Original Home review/appointment page remains /home/legacy.html. Buyer/Condo/affinity routes stay unchanged until Home is hosted-certified; the unlinked /buyer/continue candidate uses immediate questions instead of an empty transition button. Strict QR parsing is implemented but public QR activation is gated. Life/commercial and old completion/preview dependencies remain intact.

Canonical specification, acquisition/presentation contracts, route matrix, QA checklist and limitations are in CoverageFit docs/ENTRY-ARCHITECTURE-1.0.md and docs/ENTRY-ROUTE-MATRIX-1.0.md. Do not copy decision rules here. Public title remains Insurance Producer. Source/audience/ZIP never imply intent, fit or priority.

Local tests: 29 top-level pass, 0 fail/skip. Hosted direct CoverageFit first-answer/resume passed. Hosted 408 presentation fetch failed; the exact upstream cause is not yet observed. Mobile certification pending. Rollback Home interception before rolling back CoverageFit endpoints; leave saved data and old routes intact. No migration or Cloudflare setting is required by this increment. Existing district/SMS treatment is unaffected.

Runtime diagnostic: `entry_presentation_upstream_failure` logs only upstream status/error type, never cookie, contact, campaign or response body. Inspect this in the Cloudflare project serving 408farmers.com before changing configuration.

### 2026-09-26 transport diagnostic follow-up
Production candidate returned 503 with `TypeError` and no upstream status in
Pages project `408farmers-v2`. The previous catch did not identify the failing
stage. Preserve the native fetch global receiver and pass a URL string; retain
redirect rejection and fixed destinations. New tests exercise the real default
transport branch with a receiver-sensitive stub. Safe page diagnostics now
separate fetch from response processing, without exception messages or URLs.
31 tests pass; hosted resolution remains unverified. Public activation stays
paused. No configuration, migration, scoring or SMS changes.
