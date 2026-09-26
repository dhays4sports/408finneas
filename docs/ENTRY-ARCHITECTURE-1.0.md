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

### Runtime redirect compatibility correction
The next production log confirmed stage=fetch, status=null, TypeError after the
receiver change. Cloudflare workerd source (src/workerd/api/http.c++, Request
constructor and tryParseRedirect) explicitly rejects redirect=error, contrary to
its Request reference documentation. Both entry transports now use manual and
reject redirects before returning any location, cookie or response body. No
redirect is followed. All 32 tests pass, including 301/302/303/307/308 on both
paths. Hosted certification remains required; activation stays paused.
Source: https://github.com/cloudflare/workerd/blob/main/src/workerd/api/http.c%2B%2B

### Home-only rollout following transport verification
User confirmed successful page load after redirect fix. Browser verification of
/buyer/continue.html confirmed immediate buyer-specific question, first answer
saved, next canonical question, and reload resuming that next question without
repeating the first. No contact details submitted or provider messages sent.
Activate only Home; other public entries and QR remain unchanged. Home hosted
verification is pending deployment. Rollback: empty ACTIVE_ENTRY_ROUTES set.

### Hosted Home verification and compatibility correction
Home activation is live. Existing anonymous buyer session resumed on Home,
accepted its second answer, stopped at researching completion, and retained that
completion after reload. No contact or SMS sent. Compatibility link exposed an
asset-normalization issue: legacy.html normalizes to legacy, which previously
fell through Home campaign fallback. Both aliases now dispatch to the pretty
legacy asset path and are in Pages include routes. Buyer activation remains on
hold until this compatibility correction is verified hosted. 33 local tests pass.

### Home compatibility verified; Buyer prepared, not activated
Hosted legacy Home link now opens the original appointment flow and advances to
step 2. Home save/completion/resume verified with an existing anonymous session.
Fresh visitor hosted certification is still pending; the available browser has
an existing secure session and no supported isolated-context API. Buyer legacy
appointment copy and both pretty/html dispatch paths are prepared while public
Buyer activation remains off. 34 local tests pass. No contact details or SMS sent.

### Buyer activation after Home fresh-session confirmation
Dylan confirmed private-browser Home first answer advances and reload retains
next question. Buyer candidate previously passed first-answer/save/resume and
buyer-specific first question. Hosted Buyer compatibility destination now renders
original form. Activate only Home + Buyer and include /buyer/ in Pages routing.
Condo/affinity/QR remain inactive. Local suite: 34 pass, zero fail/skip. Buyer
public hosted verification follows deployment. Rollback: remove buyer from the
active set; existing buyer/index.html is untouched.

### Condo staged conversion
Buyer public Back/save/reload now confirmed hosted. Condo uses the existing
canonical home engine with retained condo audience context; no property-type
repeat, no route-derived intent. Original Condo form is preserved at legacy
aliases with pretty-path asset dispatch. Home/Buyer/Condo active; Tech and later
routes remain off pending Condo hosted check. 35 local tests pass. Rollback:
remove condo from active set, retaining original index.html and all records.

### Tech preparation, inactive
Retain Tech original form as a compatibility asset, including its relative
scripts and old URLs. Canonical replacement starts with insurance product rather
than mandatory profession. No profession-derived intent/fit. Public Tech still
inactive pending Condo certification. 36 tests pass. This increment stays on the
working branch, not main, until the hosted gate is resolved.

### Tech activation after Condo receipt certification
Authenticated Work confirms the fresh Condo record, original route/source/audience and submitted answers. Tech now joins the active set; canonical first question has no professional-role gate. Original Tech form and aliases retained. 36 tests pass. Remaining affinity/QR inactive until Tech certification. No Cloudflare configuration changes. Rollback removes tech from ACTIVE_ENTRY_ROUTES only.
