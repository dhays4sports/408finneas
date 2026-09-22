# SIGNAL-LIFE-1.1 — Contact handoff staging

Status: implementation/regression checks passed; live browser gate pending.
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

Live deployment, browser evidence and remaining gates will be appended after testing.

## Before any live contact or /life migration

A separately authorized staging adapter must test durable idempotency, delivery failures and transactional evidence/permission storage against isolated business tables; production services remain disconnected here. Final channel-specific contact disclosures, retention policy, secure identity handling, confirmed scheduling availability and downstream ZERO-REPEAT integration need review. Safari/Firefox/mobile device validation is not certified by Work Chrome. No merge or production cutover is approved by this report.
