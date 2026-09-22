# SIGNAL-LIFE-1.2 — Durable synthetic staging handoff

Date: 2026-09-22 UTC.
Status: LOCAL PERSISTENCE TESTS PASS; remote D1/browser persistence gate BLOCKED pending dedicated Preview binding. Not ready for live contact or production.
Starting 408 head: eb29992ae6a53168906a64457b20f35c744b4ecd, signal-life-1.0, draft PR #3.
CoverageFit stays e02e85737051e65a5e1e0fdbf5f76cb9dd36ea35. No decision-engine changes.

## Implementation

The existing stateless 1.1 endpoint/UI remains the default. Opt-in contact URL:
https://signal-life-1-0.408farmers-v2.pages.dev/signal-life-preview/contact/?stage=durable
First use Life preview and explicitly choose Talk with a person; then open this URL in the same tab to retain the anonymous handoff.

POST /api/signal/life-handoff-staging accepts schemaVersion SIGNAL-LIFE-1.2 through the existing exact-origin, synthetic-phone-only, explicit simulated-permission and canonical/history validation. Real contact information remains rejected. It uses ONLY SIGNAL_HANDOFF_PREVIEW_DB and checks a dedicated environment marker before any mutation. Missing binding/table/marker/database errors return 503; there is no fallback to another DB or to stateless success.

One row atomically holds request ID, SignalSession ID, canonical answers, complete answer history, selected contact method, fixed fictional phone, time preference, versioned simulated permission evidence and server receipt time. Permission scope is simulation_only, contactPermissionGranted=false. Delivery state is constrained to disabled. There is no SMS/email/calendar/AgencyZoom/lead/opportunity adapter, queue, or dispatch call.

Idempotency is a deterministic full SHA-256 ID over session, schema, mode, time preference, fixed phone, canonical signals, answer history and permission version. INSERT ... ON CONFLICT DO NOTHING is the concurrency boundary. Identical evidence/method within the same SignalSession reuses the existing request and original timestamps, including after a lost response. Changing method, timing, or evidence creates a distinct staging request. This is intentional staging semantics, not a completed production idempotency policy.

Expiry is seven days from the first successful insert and is not extended by retry. Expired rows are pruned on subsequent accepted staging requests; there is no scheduled cleanup yet. Therefore physical deletion may occur later than expiry during inactivity. Do not claim a guaranteed seven-day physical retention maximum. A 5,000-row cap rejects new requests while existing-request retries still succeed. No request body, phone, IP, or user-agent is logged by this handler.

## Local verification

Node 24 built-in SQLite executes the actual migration and SQL through a small D1-compatible adapter. This is real local persistence testing, not Cloudflare D1 certification.

PASS: file-backed database reopen preserves answers/permission; 20 concurrent retries yield one immutable row; simulated lost acknowledgement after committed INSERT recovers on retry; three modes and changed time create separate rows; unknown/real contact data, unchecked permission, inconsistent evidence and wrong origin/production host reject before storage; absent/unverified database fails closed without creating tables; expired rows prune; 5,000-row cap rejects new writes while duplicates recover. Existing 1.1 tests and browser-Back regression also pass (10 tests total).

Commands:
```
node --test tests/signal-life-staging.test.mjs tests/signal-life-handoff-preview.test.mjs
```
The 1.1 tests require the sibling CoverageFit source used by the existing project test setup.

## Required operator setup — Preview only

Cloudflare dashboard automation remains blocked by its browser verification challenge, and no Cloudflare connector is available in this task. No database or binding has been created by this phase.

1. Create a NEW D1 database named `408-signal-handoff-preview`. Do not select coveragefit-production or coveragefit-signal-preview.
2. Run [0001_handoff_staging.sql](migrations/signal-preview/0001_handoff_staging.sql) once in that new database. It creates only the environment marker, staging handoff table and expiry index.
3. Verify:
```
SELECT * FROM signal_preview_environment;
SELECT COUNT(*) AS staging_records FROM signal_handoff_staging;
```
Expected marker scope: 408-signal-handoff-preview-v1, synthetic_only=1, delivery_enabled=0; count=0 before QA.
4. Open Pages project **408farmers-v2**, Settings, **Preview** environment. Add D1 binding **SIGNAL_HANDOFF_PREVIEW_DB** to **408-signal-handoff-preview**. Do not alter any production binding.
5. Redeploy the **signal-life-1.0** preview branch after saving. The old deployment does not acquire new bindings retroactively. No CoverageFit configuration change is needed.

Cloudflare binding reference: https://developers.cloudflare.com/pages/functions/bindings/#d1-databases

## Remote gate after binding

Run Life happy path, explicit human entry, then the durable URL. Submit each synthetic mode. Inspect D1 count and stored canonical/answer/permission JSON; repeat identical requests and confirm one row/original receipt. Verify no delivery or business objects. Test retry and reload with retained answers, unauthorized Origin, and missing/invalid permission. Restore any temporary fault configuration, record both tested SHA and deployment ID, and update this report. Do not call this gate passed until actual preview D1 persistence and browser receipts are verified.

No merge, production deployment, /life migration, real permission, real contact collection, or outbound delivery is authorized by this phase. Safari/Firefox/mobile remain separate outstanding gates.

## Deployed verification — 2026-09-22 21:19–21:22 UTC

Implementation SHA: b53c0cff1a4d044e6b97f381fff1be5c00e84831.
Preview deployment: ef57da02-571d-4e77-bf23-a2f0520c4887, https://ef57da02.408farmers-v2.pages.dev; Cloudflare GitHub bot reported deployment success.

PASS: Work Chrome resumed the existing three-answer Life session to the qualified conversation outcome. Default stateless contact submission still returned success with three answers. Opt-in durable page displayed the retention/simulation notice and all known answers. Submission showed visible failure/Retry with all answers and choice preserved. A controlled same-Origin POST returned HTTP 503 with `{"error":"staging_binding_missing"}`.

BLOCKED: successful deployed D1 write/read/duplicate-count verification. No remote staging row or simulated permission evidence has been created. The operator setup above is required before certifying this gate. The 1.1 route remains available; no fallback masks the durable-mode failure. Browser DOM evidence is in qa/signal-life-1.2/missing-binding-dom.txt.
