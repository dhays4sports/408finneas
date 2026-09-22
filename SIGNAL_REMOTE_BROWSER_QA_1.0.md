# SIGNAL_REMOTE_BROWSER_QA_1.0

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
