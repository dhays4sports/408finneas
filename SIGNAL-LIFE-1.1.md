# SIGNAL-LIFE-1.1 — Contact handoff staging

Status: PASS for synthetic staging in Work Chrome; real contact delivery and additional browser engines remain gated.
Date: 2026-09-22 UTC.
Branch: signal-life-1.0, stacked on signal-decision-bridge-1.0 (PR #3 stays draft).
Starting head: 5aa2a932bc5858752ac2f015204b2c75a7d2bfd8.
CoverageFit head: e02e85737051e65a5e1e0fdbf5f76cb9dd36ea35 (unchanged).

## Scope

After an explicit Talk with a person action, /signal-life-preview/contact/ offers Talk now, Choose a time, and Text me. It shows existing answers without asking again. Details appear only after a contact method is chosen. A mode-specific unchecked simulation-permission control is required and resets when the method changes. Scheduling is a Pacific-time window preference, never an availability promise or booking.

This phase is a synthetic staging contract, not a live contact integration. The fixed fictional number +12025550123 is the only accepted contact. The browser stores no contact inputs or permission in localStorage/sessionStorage. The existing anonymous handoff remains in sessionStorage with a 30-minute expiration and contactPermissionGranted=false. The detailed read-only application preview remains available after validation; the original /life application is unchanged.

## Boundary

The existing Pages advanced-mode _worker.js dispatches only /api/signal/life-handoff-preview to a new handler before existing business routes. No new Functions directory and no changes to _routes.json are needed. The handler receives no environment binding and calls no integration. It checks the exact stable Life preview host and Origin, POST/JSON, an 8-KiB streaming body limit, fixed synthetic phone, explicit simulated channel permission, expiry, strict field allowlists, Life answer codes and canonical/history consistency. It does not decide qualification or contain weights. Future canonical question changes must update this versioned staging contract rather than silently dropping evidence.

The response is a non-durable preview validation receipt. Identical evidence/mode/time preference produces the same receipt, but this is not durable idempotency or an accepted callback. Every business-object/permission/message guardrail is false. The endpoint cannot serve production hosts. No CORS credentials or wildcard origins; contact CSP allows same-origin connections only. Parent Life CSP remains exact CoverageFit preview plus self.

The client uses credentials:omit, a 10-second timeout, preserves anonymous answers on failure, and shows Retry handoff. It does not fall back to production lead/callback APIs. Contact fields remain synthetic even after failure.

## Verification

Local tests: node --test tests/signal-life-handoff-preview.test.mjs (requires sibling CoverageFit checkout); node tests/signal-life-preview.test.cjs. All pass. Tests exercise actual canonical Life decisions, all three modes, stable retry receipt, no binding access, wrong host/origin/method, oversized/malformed JSON, unknown PII fields, real-number rejection, unchecked/mismatched permission, expired handoff, mismatched evidence, missing time preference, and zero-answer human override. JavaScript syntax checks pass.

Live deployment, browser evidence and remaining gates are recorded below.

## Before any live contact or /life migration

A separately authorized staging adapter must test durable idempotency, delivery failures and transactional evidence/permission storage against isolated business tables; production services remain disconnected here. Final channel-specific contact disclosures, retention policy, secure identity handling, confirmed scheduling availability and downstream ZERO-REPEAT integration need review. Safari/Firefox/mobile device validation is not certified by Work Chrome. No merge or production cutover is approved by this report.

## Live Chrome QA — 2026-09-22, 20:27–20:40 UTC

PASS for the synthetic staging scope. Work Chrome/CDP only; browser engine/version beyond the tool-reported Chrome identity was not independently established. No claim of Safari/Firefox/device certification.

- Implementation: a3f120b68a02dded10a2f9fe66c6a466900ce4e7; deployment 7dc27104-ceaa-4610-aa20-2651b08c7759.
- Temporary real HTTP 503 fixture: bf31e7bc9ef3dca0d271df5fe4a5489412728436; deployment 8166227b-6df6-413f-942f-98db4c2fbb08.
- Tested restored/fixed source: 1b6ed589a788363def2b9f4603a5d66a4aee1088; deployment ca4687a1-f137-4d83-9307-1269b3e9f50b (https://ca4687a1.408farmers-v2.pages.dev).
- Browser origin: https://signal-life-1-0.408farmers-v2.pages.dev.
- Decision origin: https://cf-signal-decision-1-0.coveragefit.pages.dev, CoverageFit e02e85737051e65a5e1e0fdbf5f76cb9dd36ea35 unchanged.
- No Cloudflare settings, bindings, or databases changed in this phase. Existing CoverageFit preview D1 remains coveragefit-signal-preview / api_rate_limits only per prior verification. The new contact handler has no database dependency or environment access.

| Case | Result | Actual evidence |
| --- | --- | --- |
| Fresh Life happy path | PASS | Only through work → I am open to it → Within 30 days → conversation outcome, before and after fix |
| Explicit human entry | PASS | Contact page first shows three unselected methods; details appear only after selection |
| ZERO-REPEAT | PASS | Current coverage, intent and timing all visible without re-answering; API returns matching canonical evidence and answerCount=3 |
| Call permission unchecked | PASS | Submission blocked with visible instruction until simulation permission is checked |
| Talk now | PASS | preview_validated receipt; no callback/permission/message created |
| Choose a time | PASS | Method change clears permission; missing time is blocked; Pacific afternoon preference validates without booking |
| Text me | PASS | Method change clears permission and uses text-specific copy; synthetic validation succeeds |
| Repeated submission | PASS | Same text receipt preview-c50bdb3df1a7554dcbd827cf on repeated submission; no durable operation exists |
| Real outage | PASS | Temporary endpoint returned HTTP 503; visible Retry handoff, all answers and selection preserved |
| Restored Retry | PASS | Same browser page recovered to 3-answer success, original call receipt preview-2754234ce9fd7cb800112236 |
| Browser Back | FAIL → FIXED → PASS | Initial selected radio restored with details hidden. pageshow synchronization fixes details and resets permission. Regression test plus live Back retest passed |
| Detailed application preview | PASS | Existing coverage question skipped; other detailed fields disabled; known evidence visible; no submit action |
| Resume | PASS | Return to Life shows Continue where you left off; Continue returns qualified outcome with retained answers |
| Wrong origin | PASS | Controlled request with https://unapproved.example returns 403 |
| CSP/credentials | PASS | Contact response contains restrictive self-only connect-src policy intersecting parent policy; API response has no Allow-Origin/Allow-Credentials. Client uses credentials:omit. Pages static HTML has Cloudflare's existing Access-Control-Allow-Origin:* header; this is not API authorization and was not introduced by this change |
| Real contact/unknown PII/expired or inconsistent evidence | PASS (local handler tests) | Strict request validation rejects them; local env proxy throws on any binding access and was never accessed |
| Production host | PASS (local handler test) | Endpoint returns 404 before touching bindings. No production POST was made |
| No score UI | PASS | Only public conversation copy, known answers and receipt; no score/queue terminology |
| No durable business action | PASS | Handler receives no env, performs no fetch/DB/integration calls; all returned business guardrails false. No AgencyZoom, lead, opportunity, callback, consultation, message or permission API was called |
| Safari / Firefox / mobile device | NOT RUN | Not exposed by this Work Chrome browser; remains an external validation gate |

Screenshots: [503 failure](qa/signal-life-1.1/contact-outage.png), [restored successful handoff](qa/signal-life-1.1/contact-success.png). Controlled response: [contact-response.json](qa/signal-life-1.1/contact-response.json).

The 503 fixture was removed in 1b6ed589. No temporary bridge-origin wiring was introduced: shared/config.js and /signal-lab/ remain production-safe from 625aa027. The Life route's exact preview endpoint is intentional pilot configuration, not production /life wiring. All PRs remain draft. This gate permits further isolated staging work only; it does not authorize live contact delivery or /life migration.

### Final visual correction and evidence

Screenshot review found missing shared page classes on the new contact route. Fixed in 8c499e8d9174e74f01bf71c0ae5bd7f3c1a0e4dc, deployed as 41dcccde-3dee-4266-b517-095a79db0c69 (https://41dcccde.408farmers-v2.pages.dev). Retest confirmed matching Life typography/card width and successful 3-answer call validation. This is the final tested application source. Only documentation/evidence is added afterward.

The success screenshot records the top of the final contact interface; the complete visible result, including receipt preview-bada3f58fe1d689f1aea1f0e, is preserved in [success-dom.txt](qa/signal-life-1.1/success-dom.txt). Browser screenshot capture did not reliably scroll to the result, so the report does not treat the screenshot alone as receipt proof. The separate API JSON and live DOM provide that proof.
