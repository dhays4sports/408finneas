# SIGNAL-LIFE-1.0 — preview pilot

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
