# SIGNAL_REMOTE_BROWSER_QA_1.0

## Life pilot browser completion — 2026-09-22 19:28–19:32 UTC

**PASS: preview-only Life routing and read-only ZERO-REPEAT demonstration in Work Chrome/CDP.** This supersedes prior origin-blocked notes. No Safari/Firefox certification or production readiness is claimed.

Tested 408 branch signal-life-1.0 SHA7bc27f40a23daa31c6d35ad91d0a1d78c73d6beb (implementation7cf637ce8d7e55203f9211a8e8952d6c134b1600); deployment a9beaa88-c249-46b1-9868-eae6b739e74a.
Origin https://signal-life-1-0.408farmers-v2.pages.dev, route /signal-life-preview/.
CoverageFit cf-signal-decision-1.0 SHAe02e85737051e65a5e1e0fdbf5f76cb9dd36ea35; deployment0e641c8b-9c0c-4da1-9190-cf7ce0c92b5a.
Origin https://cf-signal-decision-1-0.coveragefit.pages.dev; isolated Preview COVERAGEFIT_DB remains coveragefit-signal-preview.

Operator's pasted value showed the cause: second origin began https// (missing colon). Operator corrected it; fresh deployment now returns204 with exact Life Allow-Origin and no Allow-Credentials. Random origin still403. No CORS rule was broadened.

| Browser case | Result | Observed evidence |
|---|---|---|
| Error / Retry recovery | PASS | Previously visible next-step error recovered via Retry after corrected preview deployment. No local fallback. |
| Life-first entry | PASS | First question is personal coverage status, selected by CoverageFit with product=life already seeded. No product question or contact fields. |
| Three-answer happy path | PASS | Only through work → I am open to it → Within30 → This looks worth a quick conversation. |
| Explicit human action | PASS | Talk with a person opens only the read-only local application preview; no business request or permission grant. |
| ZERO-REPEAT coverage handoff | PASS | Summary retains life/employer_only/open_to_review/within_30; prior coverage question absent from downstream visible DOM. Unknown goal/resilience still shown. All application controls disabled. |
| Resume | PASS | Fresh employer-only answer, reopen → Continue where you left off → Continue → Intent. |
| Back / changed evidence | PASS | Timing → Back → Not really → come back when timing changes. |
| Later action | PASS | Keep this for later displays saved anonymous answers/no follow-up requested, with Continue and human override. |
| Weak Life / learn action | PASS | No → Mostly researching → learn-first outcome; Learn the basics opens education copy, human option and later action. |
| Existing personal coverage | PASS | Yes → open → within30 → canonical protection goal; no fabricated gap. |
| ZERO-REPEAT coverage + goal | PASS | Mortgage or home → human outcome → explicit handoff; summary life/yes_personal/open_to_review/within_30/mortgage. Both coverage and protection question groups absent; unknown resilience remains. |
| Consumer boundary | PASS | No score or internal queue displayed. No identity fields on initial Signal route; downstream identity fields disabled. No identity value entered. |
| CORS/CSP | PASS | Exact-origin preflight204; unrelated origin403. Live Signal route connect-src self + exact CF preview, form-action none; downstream additionally connect-src none. |
| Regression | PASS | tests/signal-life-preview.test.cjs passes actual canonical-engine routing, handoff mapping, Back, learn/later and explicit-action boundary. |

Evidence is the observed browser DOM in this Work task and the preserved test/deployment details here. Bridge API JSON evidence remains in SIGNAL_REMOTE_BROWSER_QA_1.0.md. Pilot error recovery was tested from an empty session; answered-session outage/retry was tested on the bridge earlier, not repeated as a separate outage in this pilot.

No lead, Opportunity, AgencyZoom record, callback, consultation, quote request, SMS/email or contact permission was created by these actions. Evidence is scoped to stateless decision calls, isolated rate-limit-only Preview setup, disabled/non-submitting application controls and source graph; no independent dashboard-wide object audit is claimed.

Cleanup: bridge shared/config.js and lab CSP remain production-safe after625aa02; CF temporary rejection fixture remains reverted2970962. The new Life route deliberately retains its exact preview endpoint/CSP on its own preview-only branch. Do not merge that preview configuration into production. Production /life and application source remain unchanged.

Readiness: preview pilot is implemented, deployed, and ready for review. A controlled /life migration still requires live downstream ZERO-REPEAT consumption/consent integration, isolated submission validation, broader browser/mobile testing, final consumer copy/design review, removal of preview-specific wiring and separate production authorization. No merge or production cutover performed.


## Completed cross-preview scenario matrix — 2026-09-22 18:57–19:06 UTC

**PASS for the requested scenarios in Work Chrome/CDP across the two deployed origins.** This is cross-origin preview certification in one browser engine, not a claim of Safari/Firefox certification. Earlier blocked entries below are historical.

- 408 branch signal-decision-bridge-1.0: tested SHA f6287a424ff833b086845bd1274275ec7db4d0c9; deployment 2b47763e-cf0e-42a3-9502-028c7059e83e. Temporary wiring originated at 141edf785b1b2e82abd012eecc2dfa1c877c273f.
- 408 origin: https://signal-decision-bridge-1-0.408farmers-v2.pages.dev
- CoverageFit branch cf-signal-decision-1.0: matrix SHA 3d4fdb208a1f6bc4f5b6fdd6a2ad28b2986117c5; deployment fad93ffb-031f-44b2-a8b9-09242da8fcac.
- CoverageFit origin: https://cf-signal-decision-1-0.coveragefit.pages.dev
- Recovery/Life retest SHA 29709626512922794efc6faac4de5fe8cce6c2d9; deployment 70f2cf1e-7eba-4ceb-b4d7-4963a995a6c6. Endpoint source restored byte-for-byte to pre-fixture blob aff79daf19f005efdef707ab6cceb309c0fecad4.
- D1: operator-created coveragefit-signal-preview, Preview-only COVERAGEFIT_DB; operator applied only api_rate_limits and its reset_at index. Schema and binding screenshots supplied. Actual endpoint now successfully executes limiter SQL. No migration0019 or production DB use.
- Root cause of 503: runtime binding_missing, confirmed by live log at18:53:19. Recreating the Preview binding and deploying3d4fdb2 resolved it. No business logic fix was required.
- Browser evidence: observed DOM snapshots in Work; exact public JSON preserved below. No screenshot is claimed for this run.

| Case | Result | Actual outcome |
|---|---|---|
| Local foundation | PASS | Deployed Chrome smoke at18:39: three questions, completion No lead created, anonymous inspector; earlier refresh/resume verified. |
| Remote first question | PASS | Retry recovered to CoverageFit product question, never local foundation. |
| Life happy path | PASS | Life → employer_only → open_to_review → within_30 → OFFER_HUMAN; expected public headline. |
| Public JSON | PASS | Direct controlled POST using same Origin and evidence: qualified_signal, both engine IDs; no internal score/ranges/queue/dimensions/reasons or decision results. Negative underwriting/eligibility/pricing guardrails are present as false. |
| Resume | PASS | Fresh Life/employer-only, reopen → Continue where you left off → Continue → Intent. |
| Back / changed evidence | PASS | From Timing, Back returned to Intent; Not really → CONTINUE_LATER. Inspector retained life/employer_only/not_interested and no timing or old intent. |
| Weak Life | PASS | No coverage/Mostly researching → OFFER_LEARN immediately; timing unnecessary. |
| Existing personal Life | PASS | Yes/open/within30 → What are you mainly trying to protect or improve? No fabricated coverage gap. |
| Home | PASS | nonrenewal_notice/ready_now/within_14 → OFFER_HUMAN, no Shoot Now or score. |
| Auto new vehicle | PASS | new_vehicle/open_to_review/days_31_60 → OFFER_HUMAN. |
| Auto need now | PASS | need_now/ready_now/now → OFFER_HUMAN. |
| Business class gate | PASS | coi/ready_now/now → business type required; contractor → OFFER_HUMAN. |
| Explicit low intent | PASS | not_interested → CONTINUE_LATER; no forced call. |
| Real failure / retry | PASS | Temporary exact-preview-origin rejection632a3e98e56692c61a8918b893bdbc3241853033 deployed2d6bbfa0-a8bb-4a97-aca1-d33e10ba2557. Browser showed next step could not load / Failed to fetch / Retry, no fallback. All3 answers retained. Revert2970962 restored permission; Retry without reload resumed Timing and completed Life. |
| Anonymous boundaries | PASS | Inspected sessions contain bounded signals only, contact anonymous/not_requested, empty leadCheckpointId/opportunityId. All handoff actions deliberately unwired; no business endpoint/action exercised. |
| Exact CORS | PASS | Browser success; random origin OPTIONS403; exact-origin responses have exact Allow-Origin and no Allow-Credentials. Client credentials omit. |
| Narrow CSP | PASS | Live lab connect-src self + exact CoverageFit preview; no wildcard. Static Pages HTML Allow-Origin wildcard is unrelated to Signal API CORS. |
| Business persistence | PASS, scoped evidence | Isolated preview DB initialized with only limiter schema, stateless endpoint graph and inspected sessions/negative response guardrails. No leads, Opportunities, AgencyZoom, callbacks, consultations, contact permissions, SMS/email or quote actions invoked. No independent dashboard-wide audit is claimed. Only expected endpoint writes are rate-limit buckets. |

Recovery session3c27207c-902f-4d24-a3d6-4a864ba56ef7 retained life/employer_only/open_to_review through actual CORS failure. After Retry, within_30 completed the same session at19:06:22.385Z with state qualified_signal and no promotion/contact permission.

Public Life response (18:59:59.501Z, deploymentfad93ffb):
```json
{"ok":true,"schemaVersion":"1.0","engine":"CF-SIGNAL-DECISION-1.0","priorityEngine":"CF-OPPORTUNITY-PRIORITY-1.0","signalSessionId":"c01fb08f-b0c3-4f02-99bc-3be83e807978","flowId":"foundation_demo_remote","flowVersion":"1.0","decision":"OFFER_HUMAN","state":"qualified_signal","nextQuestionId":null,"missingDimension":null,"nextQuestion":null,"publicExperience":{"eyebrow":"Next step","headline":"This looks worth a quick conversation.","body":"A licensed agent can pick up from what you already shared instead of starting over.","actions":["talk_now","choose_time","text"]},"evaluatedAt":"2026-09-22T18:59:59.501Z","guardrails":{"anonymous":true,"persisted":false,"leadCreated":false,"opportunityCreated":false,"contactPermissionGranted":false,"consumerScoreExposed":false,"underwritingDecision":false,"eligibilityDecision":false,"pricingDecision":false,"bindAuthorized":false}}
```

Cleanup: this report commit restores shared/config.js to https://coveragefit.com/api/signal/decision and /signal-lab/* connect-src to the exact https://coveragefit.com default. The successful tested wiring SHA is preserved above. Temporary CoverageFit rejection has already been removed. Preview infrastructure remains isolated and available. No merge, ready-for-merge marking, production deployment or /life cutover.

Readiness: sufficient to begin SIGNAL-LIFE-1.0 as a separate stacked preview-only implementation. Keep PRs draft. A new Life branch origin will need exact Preview CORS authorization before its browser test. Production migration additionally requires downstream ZERO-REPEAT integration/consent review and browser coverage beyond Work Chrome.


## Preview schema verification — 2026-09-22 18:46 UTC

Operator screenshots confirm Preview branch settings (all non-production branches), COVERAGEFIT_DB -> coveragefit-signal-preview, correct api_rate_limits columns and reset_at index. This resolves the earlier uncertainty about saved settings/schema.

Fresh Git-triggered deployment 9e6b0967-6df5-48ec-80be-fbc70bb25021 at documentation-only CoverageFit commit 1db955c06bc74699e8cd2bb045740da3b92faa9e succeeded, but remote POST still returned rate_limit_unavailable. A stale retry is therefore not established as the cause.

Found an observability defect: fail-closed D1 errors were returned without server diagnostics. CoverageFit fix 071bd2b7fac4fc602901bef9533b1b9f5c1b23d0 logs only bounded categories binding_missing/table_missing/schema_mismatch/query_failed. Public response remains identical; no raw error, SQL values, client IP or request data is logged by this new path. Regression verifies all categories, unchanged503 response and no handler execution. Full offline HTTP/SQLite suite including Life passes again.

Next required evidence: runtime log category from the new feature preview. Full remote browser gate remains blocked. Temporary 408 wiring remains active pending completion and must be reverted before merge readiness. No production settings, merges or business actions.

## Cross-preview browser attempt — 2026-09-22 18:40 UTC

BLOCKED: remote API returns rate_limit_unavailable. User reports creating isolated coveragefit-signal-preview with api_rate_limits/index and binding COVERAGEFIT_DB in Preview, then setting exact allowed origin and redeploying.

CoverageFit cf-signal-decision-1.0 SHA 2b58e1ead97083baa2d364a5a4c16b6dd3b454c2; deployment 7734716e-93e7-4820-8e86-d713ea286b1e. Tested API origin https://cf-signal-decision-1-0.coveragefit.pages.dev.
408 signal-decision-bridge-1.0 temporary wiring SHA 141edf785b1b2e82abd012eecc2dfa1c877c273f; deployment 39117ad6-19aa-435e-a9f6-2604887119c0. Tested origin https://signal-decision-bridge-1-0.408farmers-v2.pages.dev.

Work Chrome/CDP: local three questions/completion/anonymous inspector PASS. Remote first evaluation displays The next step could not load, rate_limit_unavailable, Retry decision; no local fallback. Remote inspector has separate session, empty answers, anonymous/not_requested and empty promotion IDs. Answer preservation/retry recovery and remaining remote matrix are NOT RUN.

Direct HTTP: exact-origin OPTIONS 204 with exact Allow-Origin and no Allow-Credentials PASS; random origin rejected PASS. Deployed lab CSP permits self and exact CF preview only PASS. Static HTML also has Cloudflare's wildcard Allow-Origin header; this is separate from the restricted Signal API CORS and does not broaden connect-src.

Minimal SQL matches migration0001/limiter. Public error cannot distinguish absent binding from query failure. Need Preview binding and actual schema verification; dashboard remains inaccessible here. No business actions or production changes performed. Source preview wiring remains temporarily active and MUST be reverted before merge readiness. Both PRs stay draft; SIGNAL-LIFE-1.0 remains gated.

## Closing-flow build follow-up — 2026-09-22 18:03 UTC

The supplied log for deployment d22a91b9-fe88-4749-9e3c-821d33100133 identified one remaining JSON import attribute in server/closing-flow.mjs. This supersedes the unknown-cause note below.

Fix commit: 2b58e1ead97083baa2d364a5a4c16b6dd3b454c2 on cf-signal-decision-1.0. closing-flow now imports the same generated producer-config.mjs. All 106 server JavaScript modules at parent 86a9555 were fetched and inspected; closing-flow was the only remaining attribute occurrence. The parity regression now includes closing-flow and recursively scans the whole server directory for JSON import assertions/attributes.

PASS: expanded configuration parity/recursive scan, closing-flow syntax, Signal Decision core regressions, cross-repo HTTP/SQLite suite including Life happy path (2026-09-22T18:02:07Z). These checks do not replace a deployed browser test.

Cloudflare triggered preview deployment a9e6f423-989d-43f8-b83b-a784cc9a8cac for this fix. Confirmed result: DEPLOY SUCCESSFUL via Cloudflare PR bot.
- Immutable origin: https://a9e6f423.coveragefit.pages.dev
- Stable branch origin: https://cf-signal-decision-1-0.coveragefit.pages.dev
The complete Pages Functions graph now builds successfully in the deployed environment.

Preview D1 binding remains unverified because dashboard access is blocked. No remote endpoint was exercised, no settings/bindings changed, no temporary origin wiring introduced and no business action performed. Remote browser gate and SIGNAL-LIFE-1.0 remain blocked.

## Pages build follow-up — 2026-09-22 17:54 UTC

Status: DEPLOYMENT STILL FAILED; REMOTE BROWSER GATE BLOCKED.

The user supplied the original build log for CoverageFit 2b15f8bb7d54c292863237b2a8dac6b31bd1d49c. Wrangler 3.114.17 failed during Pages Functions compilation on JSON import attributes (`with {type:'json'}`) in quote-template-api.mjs, recommendation-api.mjs and solo-desk-repository.mjs. This failure occurs before database initialization; it does not establish a D1 binding problem.

CoverageFit feature-branch fix: 86a955534c7680850abffb5bd4a5ca60575d6223.
The three consumers now import a generated plain ESM producer-config.mjs. The original producer.json remains unchanged. A sync script and parity regression preserve the same parsed configuration. No score weights, endpoint behavior, CORS, CSP, bindings or production settings changed.

Local verification PASS: syntax checks for all three modules; producer configuration parity before and after regeneration; Signal Decision core tests; actual cross-repo HTTP/isolated SQLite integration suite including Life happy path, routing, failure/retry, input rejection, exact CORS and rate limiting. These are not proof of a successful Wrangler build or remote browser execution.

Cloudflare automatically attempted the new feature head. Its PR bot reports Build failed for 86a9555 at 2026-09-22T17:53:44Z:
- Deployment ID: d22a91b9-fe88-4749-9e3c-821d33100133
- [New build log](https://dash.cloudflare.com/?to=/ac46c14627f1ad50d6f4c92b347c957c/pages/view/coveragefit/d22a91b9-fe88-4749-9e3c-821d33100133)

The new failure cause is unknown until that deployment's log is available. GitHub combined status supplies no additional details, and dashboard security verification still prevents log/binding access in Work. Do not assume the new failure matches the original parser error.

No safe Preview D1 binding has been verified or created. No remote endpoint evaluation was performed. No temporary preview-origin wiring was introduced, so no source-wiring revert is needed. No business object or contact action was created by this follow-up. Both PRs remain draft; SIGNAL-LIFE-1.0 remains blocked. Earlier records below retain their original run context.

## Browser follow-up — 2026-09-22 17:48 UTC

Current status: LOCAL DEPLOYED BROWSER SMOKE PASS; CROSS-PREVIEW GATE BLOCKED.

Both user-specified heads were verified current before this run:
408 7a98a3affaa2dea09ebd37fa78bb81354fd5ac61; CoverageFit 2b15f8bb7d54c292863237b2a8dac6b31bd1d49c. Both PRs remain draft/unmerged.

Cloudflare bot deployment records in the PRs identify:
- Pages project 408farmers-v2: successful deployment 6bf8d1d2-9717-40be-b43b-8194abc604b0 at the exact requested 408 SHA.
- Exact tested deployment origin: https://6bf8d1d2.408farmers-v2.pages.dev
- Reported stable branch alias: https://signal-decision-bridge-1-0.408farmers-v2.pages.dev (not used for this immutable-SHA test).
- Pages project coveragefit: build failed at exact CoverageFit SHA; deployment f4a5c3be-bb5f-4842-b8af-2835373d6dc0.
- Production domain mappings/branches and environment bindings are not yet independently verified in the dashboard.

Real browser: Work cloud Chrome/CDP. Opened deployed /signal-lab/?fresh=1.
PASS: first question renders; Something changed selected; reload shows Continue where you left off; Continue restores Intent; Open to a review leads to Timing; Within 30 days completes; heading says Three signals captured. No lead created.
PASS: Inspect local session opens JSON; canonical signals something_changed/open_to_review/within_30; contact anonymous, permissionState not_requested; leadCheckpointId and opportunityId empty. No name/phone/email/DOB/SSN/health/VIN/full address in displayed session. No contact fields or internal numeric priority score in inspected UI.
Screenshot saved as signal-local-browser-proof.jpg with this Work task.
This updates ONLY local browser smoke coverage; all remote browser cases and deployed CORS/CSP enforcement remain untested.

External blocker: dash.cloudflare.com repeatedly rendered Performing security verification after one reload. Browser could not reach login, logs, project settings or bindings. This is not evidence of a D1 cause. GitHub combined status contained no detailed diagnostic; Cloudflare bot comment only states Build failed. The cause remains undiagnosed pending build-log access.

No new deployment was manually triggered, no environment/binding/database settings changed, no temporary source wiring introduced, no business action performed, and no production deployment requested. A report-only commit may automatically produce another preview through existing Git integration; tested SHA above remains authoritative. SIGNAL-LIFE-1.0 remains gated.

The offline matrix below is the earlier run's record, superseded for local browser smoke by this addendum.


Date: 2026-09-22, final offline run 07:14 UTC.
Status: OFFLINE PREFLIGHT PASS; REAL BROWSER / CLOUDFLARE GATE DEFERRED.

## Scope and environment

The user's latest instruction defers all Cloudflare work. No Cloudflare dashboard, deployment, binding, environment variable, production database, or production route was changed in this pass. No PR was merged or marked ready. SIGNAL-LIFE-1.0 has NOT begun because its full browser gate remains unresolved.

Tested source:
- dhays4sports/408finneas, signal-decision-bridge-1.0: 832adcb45c261b0220a5a4472fbcf12c0403835d
- dhays4sports/CoverageFit, cf-signal-decision-1.0: 2b15f8bb7d54c292863237b2a8dac6b31bd1d49c
- CoverageFit VERSION: 3.20.256.
- Foundation PR #1 and Opportunity Priority PR #2 remained draft/unmerged when inspected.
- Node 24.19.0; actual Node HTTP transport; native in-memory SQLite with a D1-shaped adapter.
- Origin header: http://127.0.0.1:18765. API: ephemeral loopback port, recorded by test at runtime through server.address(). No external preview origins or deployment IDs exist for this run.
- Browser: Work cloud Chrome (CDP). Attempt to open http://127.0.0.1:8765/signal-lab/?fresh=1 failed with net::ERR_BLOCKED_BY_CLIENT. No browser scenario was certified. No alternate browser-control mechanism or security bypass was used.
- D1: no Cloudflare D1 used. SQLite contains only api_rate_limits plus its index, extracted from migrations/0001_ops_cf_1_1.sql. Migration 0019 was not applied.

## Test matrix

PASS below refers only to the stated offline layer. Every browser case remains NOT RUN.

| Requested test | Offline result / actual outcome | Browser result |
|---|---|---|
| Local foundation three questions | PASS existing core suite; local adapter/session behavior | NOT RUN: page render, controls, inspector and visual confirmation |
| Remote initial question | PASS actual HTTP returns signal_product, chosen by CoverageFit | NOT RUN |
| Life employer-only / open / within 30 | PASS OFFER_HUMAN, qualified_signal, correct public headline | NOT RUN |
| Actual API JSON | PASS actual endpoint over loopback HTTP; both engine IDs and negative guardrails; no score/range/queue/dimensions/internal reasons | NOT RUN on preview |
| Resume | PASS persisted session reload returns Intent; VM shell test consumes fresh=1 and displays resume prompt with same session | NOT RUN in real storage/browser |
| Back / changed evidence | PASS removes Intent and downstream Timing; reevaluates Intent; not_interested changes route to CONTINUE_LATER | NOT RUN |
| Weak Life | PASS OFFER_LEARN immediately after Mostly researching; canonical engine intentionally does not need the future-timing question; supplied future timing also covered by core suite | NOT RUN |
| Existing personal Life | PASS yes_personal retained; asks life_protection_goal | NOT RUN |
| Home nonrenewal | PASS asks explicit Intent after fix; ready_now + within_14 yields OFFER_HUMAN | NOT RUN |
| Auto new vehicle | PASS open_to_review + days_31_60 yields OFFER_HUMAN | NOT RUN |
| Auto need_now | PASS ready_now + now yields OFFER_HUMAN | NOT RUN |
| Commercial COI | PASS asks business_type before handoff; contractor yields OFFER_HUMAN | NOT RUN |
| Explicit low intent | PASS CONTINUE_LATER | NOT RUN |
| Remote failure/retry | PASS revoke exact allowed origin => actual HTTP 403; client rejects, saved answers unchanged; restore => OFFER_HUMAN | NOT RUN: visible error and Retry control |
| No durable business object | PASS isolated endpoint graph and only rate-limit SQLite table; no business service configured or called | Preview DB audit deferred |
| CORS | PASS exact origin, unauthorized origin and alternate localhost port rejected, preflight 204, no Allow-Credentials | Browser enforcement deferred |
| CSP | PASS source regression verifies exact CoverageFit origin only on lab; Life routes self-only; no wildcard connect-src | Deployed response/browser enforcement deferred |
| Missing database | PASS fail-closed 503 | Preview binding deferred |
| Rate limiting | PASS first 90 requests succeed, next returns 429 for isolated test bucket | D1 runtime deferred |
| PII / unexpected input | PASS synthetic prohibited fields rejected; unknown request envelope fields rejected | UI/session inspection deferred |
| Consumer score | PASS public JSON recursively excludes internal score keys; shell source renders public decisions and canonical signals only | Visual certification deferred |

## Bugs and fixes

1. Previously fixed CommonJS top-level await test-runner error: c3790ba1a40e9c29eb6f1eea3efdd5fa9411e9d4.
2. Home nonrenewal could count as inferred Intent in the inherited priority engine and skip the visitor's intent question. Signal Decision now requires explicit shoppingIntent before using priority completeness. No score weights or persisted Opportunity behavior changed.
3. Unknown top-level request keys were silently ignored, including a health key. Strict envelope validation and explicit health prohibition now reject these.
   - Runtime fix: 0b2711c2933b8032ea6b9d28058ea21f31deb2fc
   - Regression tests: 40a639608420ae7d2944ec571a331345415b29c0
   - Architecture notes: 2b15f8bb7d54c292863237b2a8dac6b31bd1d49c
4. fresh=1 remained in the URL, causing a new session on refresh. The shell consumes the reset parameter through history.replaceState, preserving decision mode, other query parameters and hash.
   - Fix: b20415c66ec9f208e89c63a0d7d6175db2838fa7
   - VM regression: cd89abd7e825dffec1f76b3f9b4ee97db947af0e
5. Existing _headers permitted CoverageFit on /life-ops/* instead of /signal-lab/*. Corrected the exact scope: lab permits https://coveragefit.com; Life operations returns to self-only.
   - Fix: 1451b29b82c03bf255aa91a6dcd082d0ed3e22c6
   - Regression: 832adcb45c261b0220a5a4472fbcf12c0403835d
6. Actual HTTP/SQLite integration regression: 02c91d3210fc884ee19f7771e5acf3292edd76e8.

All affected tests and Life HTTP smoke test passed after fixes. No real name/contact/health values were used; rejection tests use only synthetic values.

## Reproduce offline

Check out the exact feature heads above into sibling directories named 408finneas and CoverageFit. Node 22.13+ is required for native SQLite; this run used Node 24.19.0. Alternatively set COVERAGEFIT_REPO to the CoverageFit checkout.

From 408finneas:
```
node tests/signal-foundation.test.cjs
node tests/signal-decision-bridge.test.cjs
node tests/signal-shell-resume.test.cjs
node tests/signal-csp.test.cjs
node tests/signal-http-integration.test.mjs
```

From CoverageFit:
```
node tests/signal-decision-core.test.mjs
```

The HTTP harness adds Origin explicitly because Node fetch does not synthesize/enforce browser CORS. It uses the actual bridge evaluator and actual endpoint, not a fabricated decision response. The VM resume test uses a DOM stub: it is not browser certification.

## Deferred manual Cloudflare handoff

1. Identify existing projects, Pages versus Workers, production branches and preview controls without altering production.
2. Inspect CoverageFit Preview bindings. Use a verified non-production DB, or create a dedicated preview-only database and apply only:
```sql
CREATE TABLE IF NOT EXISTS api_rate_limits (
  bucket_key TEXT PRIMARY KEY,
  request_count INTEGER NOT NULL DEFAULT 0,
  reset_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_reset_at ON api_rate_limits(reset_at);
```
3. Bind as COVERAGEFIT_DB in Preview only. Never proceed with a production DB as the sole option without stopping.
4. Deploy both named feature branches as previews. Record actual SHA, stable alias, origin and deployment ID; do not guess aliases.
5. Set CoverageFit Preview CF_SIGNAL_ALLOWED_ORIGINS to the exact 408 preview origin; leave localhost disabled. Redeploy as needed.
6. Temporarily commit shared/config.js endpoint and the /signal-lab/* CSP to the exact CoverageFit preview origin on the bridge branch. Do not touch Life routes or broaden origins.
7. Run all requested browser paths, actual preview response inspection, failure/retry, CORS rejection and isolated DB audit. Weak Life may finish early with OFFER_LEARN.
8. Fix/retest any deployment/browser defects, preserve tested SHA and evidence, then revert temporary preview-origin wiring.
9. Only after the complete gate passes, begin the stacked SIGNAL-LIFE-1.0 preview route. Keep production /life intact.

Preview wiring cleanup: NOT APPLICABLE in this pass; no temporary preview URL was introduced. Default https://coveragefit.com endpoint and narrow lab CSP remain. No Cloudflare resources were created or deleted.

## Final judgment

Ready for operator-assisted preview deployment and browser certification. NOT certified for merge, production, or SIGNAL-LIFE-1.0 implementation under the original conditional gate.

## Captured final test output
```text
SIGNAL-FOUNDATION-1.0 core tests passed
SIGNAL-DECISION-BRIDGE-1.0 tests passed
PASS shell fresh URL consumption and refresh/resume control flow (VM DOM stub, not browser QA)
PASS exact lab CSP and unchanged Life route connection restrictions (source check)
PASS Life HTTP happy path, public response and guardrails
PASS session reload, Back, changed evidence, low intent and local/remote isolation
PASS weak/existing Life, Home, both Auto paths and mandatory business type
PASS real HTTP failure/retry, preserved answers, exact CORS, preflight and fail-closed missing DB
PASS rate limit and minimal SQLite schema; no business tables or external business services
{
  "publicLifeResponse": {
    "ok": true,
    "schemaVersion": "1.0",
    "engine": "CF-SIGNAL-DECISION-1.0",
    "priorityEngine": "CF-OPPORTUNITY-PRIORITY-1.0",
    "signalSessionId": "c44563d8-e13a-409a-98c8-6e32388d5b83",
    "flowId": "foundation_demo_remote",
    "flowVersion": "1.0",
    "decision": "OFFER_HUMAN",
    "state": "qualified_signal",
    "nextQuestionId": null,
    "missingDimension": null,
    "nextQuestion": null,
    "publicExperience": {
      "eyebrow": "Next step",
      "headline": "This looks worth a quick conversation.",
      "body": "A licensed agent can pick up from what you already shared instead of starting over.",
      "actions": [
        "talk_now",
        "choose_time",
        "text"
      ]
    },
    "evaluatedAt": "2026-09-22T07:14:34.049Z",
    "guardrails": {
      "anonymous": true,
      "persisted": false,
      "leadCreated": false,
      "opportunityCreated": false,
      "contactPermissionGranted": false,
      "consumerScoreExposed": false,
      "underwritingDecision": false,
      "eligibilityDecision": false,
      "pricingDecision": false,
      "bindAuthorized": false
    }
  }
}

```


## SIGNAL-LIFE-1.1 follow-on — 2026-09-22

Synthetic contact handoff staging passed in Work Chrome on signal-life-1.0. See [SIGNAL-LIFE-1.1.md](SIGNAL-LIFE-1.1.md) for the complete matrix and evidence. Final tested source: 8c499e8d9174e74f01bf71c0ae5bd7f3c1a0e4dc; preview deployment 41dcccde-3dee-4266-b517-095a79db0c69. CoverageFit stayed at e02e85737051e65a5e1e0fdbf5f76cb9dd36ea35.

Talk now / Choose a time / Text me preserve the anonymous Life evidence after explicit human selection. Only a fixed fictional number and simulated channel permission are accepted. No business tables, production adapters, real permission, messages, appointments, leads or opportunities are involved. A real preview-only 503 test preserved answers and Retry recovered after restoration. Browser Back restoration and missing shared page styling were fixed and retested. Temporary outage code was reverted; shared bridge endpoint/CSP defaults remain production-safe. Safari/Firefox/mobile and live downstream contact integration remain unresolved migration gates. No merge or production cutover.
