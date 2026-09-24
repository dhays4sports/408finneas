> Historical preview evidence: deployment/configuration instructions below are superseded by SIGNAL-NORTH-STAR-1.0.md. Signal decision transport now uses production CoverageFit. Life staging remains isolated and is not a production binding requirement.

# SIGNAL-LIFE-1.0 — preview pilot

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


2026-09-22. Stacked on bridge625aa0278c0d6adae6d5829ca43f65fdd437662d, after documented Chrome cross-preview scenario PASS. No production /life cutover or merge.

## Preview scope

Route /signal-life-preview/ uses the existing SignalSession and remote CoverageFit adapter. Its flow seeds product=life only, so CoverageFit chooses life_coverage_status first and every subsequent question. No local fallback, weights, queue labels or consumer score. Typical employer-only/open/within30 path takes3 signal questions. Existing personal coverage may need an additional protection-goal question.

Life sessions are separate from both labs. Refresh/resume, Back, explicit start-over and visible retry are supported. Learn/later outcomes avoid a forced sales conversation; Talk with a person is available as a human override, including during errors. No identity fields appear in the initial route.

Explicitly selecting Talk with a person transfers the anonymous session's complete canonical evidence/answer history into a 30-minute sessionStorage handoff record. This is not contact consent. It opens /signal-life-preview/application/, a read-only, non-submitting preview of the existing detailed form, copied from unchanged /life/index.html atf6287a4. Known coverage/goal inputs are prefilled and their question groups hidden. Other known canonical facts remain in the handoff and visible summary; unknown application facts are not invented. No identity input is saved to storage or sent. No submit control, integration script, callback, Formspree, contact-permission or application API is connected. CSP form-action none; downstream connect-src none.

Production /life/index.html and detailed application code remain byte-for-byte unchanged. This preview demonstrates ZERO-REPEAT data transfer; it does not certify the live application intake's acceptance of a Signal handoff.

## Environment

Only this preview route references https://cf-signal-decision-1-0.coveragefit.pages.dev/api/signal/decision and has that exact connect-src. Shared config/lab defaults stay production-safe. CoverageFit Preview CF_SIGNAL_ALLOWED_ORIGINS must add the exact new branch origin once Cloudflare reports it. No wildcard or credentialed CORS.

## Validation

PASS node tests/signal-life-preview.test.cjs with sibling CoverageFit checkout: actual canonical engine chooses Life status first, three-answer happy path, Back invalidation, learn/later, existing-personal goal, explicit-action requirement, retained answers, mapping and no submitting application scripts/controls. Syntax checks also required before publish.

Browser QA on this new branch is pending its exact-origin authorization. Do not represent a unit test as browser certification. No production deployment or business write is authorized.

## Before controlled /life migration

- Complete new branch browser QA, including returned questions, all three outcomes, error/retry, Back/resume and ZERO-REPEAT prefill.
- Add Safari/Firefox/mobile validation beyond the completed bridge Work Chrome gate.
- Integrate and review the real downstream handoff consumer, consent collection and identity boundary; current application preview deliberately cannot submit.
- Verify existing application/callback behavior in an isolated environment before any live transaction testing.
- Review final consumer copy/design and remove preview-only endpoint wiring before a separately authorized production cutover.

## First deployed browser check — 2026-09-22 19:15 UTC

Initial implementation SHA07823972cbf50cc2c1a43a4669d5936cc40d40a0 deployed successfully:67928c51-5942-4acc-9ac6-59865d87fb17, origin https://signal-life-1-0.408farmers-v2.pages.dev. Work Chrome renders the pilot and visible retry error. Direct preflight confirms403 origin rejection: new Life origin is not yet authorized by CoverageFit Preview. Explicit human override opens only the isolated local application preview and carries product=life; no fields were filled or business request submitted. Full answered-session prefill and adaptive browser paths remain BLOCKED pending exact origin configuration. Application preview fields were made read-only after inspection, and live-encryption wording replaced with accurate preview wording; production form unchanged.

Operator action: add https://signal-life-1-0.408farmers-v2.pages.dev to CoverageFit Preview CF_SIGNAL_ALLOWED_ORIGINS, comma-separated with the existing exact bridge origin, then redeploy the CoverageFit feature branch. Production settings must stay unchanged.

## Allowlist retest — 2026-09-22 19:21 UTC

Operator reported saving both exact origins. Fresh CoverageFit documentation-only commit dab744c27dd4ad46cd1a96a7b612ca3a09aa0f4d deployed successfully as aaff326f-983d-4df3-8849-82b0eec6c590. Controlled preflights against that immutable deployment show bridge origin204/exact Allow-Origin, but Life origin403/code origin. Live Life browser Retry still shows the error state. Source parser verified to accept both exact origins when given the comma-separated value. The deployed configuration therefore still does not authorize the Life origin; its actual saved value needs operator inspection. No broader CORS, production setting, or business-action change made. New Life adaptive browser gate remains BLOCKED; previous bridge PASS remains valid.
