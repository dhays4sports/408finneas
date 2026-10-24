# Buyer staging isolation and lead reliability 1.2

Date: 2026-10-24. Disposition: **BLOCKED for hosted acceptance and production release**.

Continues acquisition PR #6 at `b945cc21b01eee8df9ace7b08b8b57cee3eb39ab` and CoverageFit PR #32 at `bacb8e84edb219eff0ec7f569bddade5d11f151c`. Prior implementation and evidence remain in the PR history. Neither PR is merged. No production settings, customer records, communications, calendar events, CRM records, ad tracking or spending were changed.

## Cloudflare findings and remaining evidence

The Cloud Browser was navigated to the known account's Pages dashboard. Cloudflare redirected it to sign-in. No authenticated configuration was visible. No secret values were requested or inspected.

| Item | Finding |
|---|---|
| Projects | Existing projects: `coveragefit`, `408farmers-v2` (previous deployment evidence) |
| Production vs Preview D1 identities | **Unknown — must compare binding names and database IDs** |
| Synthetic-only database | Not verified; no database created |
| Preview provider secrets/capabilities | Names, bindings and enablement not inspectable |
| Existing preview routing | Accepted 1.1 audit showed acquisition preview calling production CoverageFit; source hard-coded it |
| New routing | Controlled by server environment plus fixed host validation; never browser input |
| Cost | No resources or recurring costs added. Existing account capacity/free allocation cannot be certified without account inspection |
| Hosted submissions | **Not run**; unknown D1/provider isolation is not an acceptable test environment |

Smallest owner evidence: for **both projects**, show **Production and Preview** Bindings (D1 binding name and database identity) and Variables/Secrets **names only**, plus current Preview deployment URL/commit. Hide every secret value. If a D1 ID is not visible on the binding screen, its database overview identity is sufficient; do not open tables or customer records. Also show outbound enable/disable controls with values concealed if they contain credentials.

If there is no suitable isolated database, the minimum proposal is one synthetic-only D1 binding for CoverageFit Preview with existing migrations, no copied customer data, no production service/R2/KV bindings, and no outbound provider credentials. Do not create it until account limits/costs and authority are established. Acquisition needs no new database for this flow.

## Source changes

Acquisition `_worker.js` now passes server environment to the existing entry proxy. `server/entry-presentation-proxy.mjs` retains production CoverageFit for canonical production hosts and the production project alias. Deployment/branch previews require:

- `BUYER_STAGING_ISOLATED=1`, set only after actual isolation is verified.
- `COVERAGEFIT_PREVIEW_ORIGIN=https://<8-hex-deployment>.coveragefit.pages.dev`, pinned to an immutable candidate deployment.

Missing/invalid preview configuration returns 503 before upstream fetch. No production fallback, arbitrary upstream, redirect following, wildcard CSP or request-selected URL. Preview CSP allows only the configured backend assets plus existing same-origin resources. Preview HTML must contain the BUYER-1.0 client at that backend and cannot contain production asset URLs. APIs stay same-origin on acquisition; the proxy forwards the backend's own Origin and only the existing opaque resume cookie. Preview pages remain noindex.

CoverageFit adds `server/distribution-preview.mjs`, guards distribution functions before the rate limiter/database path, and renders contextual CSS/JS from the request's validated CoverageFit preview origin. Preview requires the isolation flag; production canonical origins and root project alias retain behavior. Direct preview entry accepts only its own Origin. This flag is an operator acknowledgement, **not technical evidence that D1 or secrets are isolated**. Do not set it based only on a passing build.

## Recovery contract and operator action

The existing `leads` sync now first reconciles up to ten pending canonical distribution contact requests from existing `pvx_records`. It reuses the original lead checkpoint, normalization, attribution, contact permission and producer projection. No new table, queue, scheduler, provider send, or CRM integration.

New consented requests persist under the existing lead-retention policy (default 730 days, existing bounded environment override). The browser capability still expires after seven days. Anonymous progress retains its original expiry. Reconciliation does not renew or expose browser tokens.

The request becomes delivered only after durable lead persistence **and** producer projection. CAS prevents stale recovery from overwriting a concurrent success. Failed attempts retain inputs, expose pending counts in the existing workspace sync status, and rotate behind other records. Repeated reconciliation and visitor retries use the same deterministic opportunity identity.

**Accepted bounded mechanism, pending hosted certification:** Dylan opens `/agent/workspace/`, uses Work → WEB / DIRECT and Refresh. Initial authenticated load also syncs. Refresh until pending is zero and bounded source paging is complete; escalate persistent failures. This is operator-triggered recovery, not unattended automatic delivery. A closed workspace does not retry by itself. A completely unavailable database cannot expose counts until it returns. Pre-1.2 requests retain their existing storage expiration; the longer consented retention applies at new contact acceptance.

Local authenticated API tests verify recovery, WEB / DIRECT discoverability, urgent context, phone/call preference and original campaign attribution. They **do not certify Dylan's hosted access**. Hosted inspection must verify the actual detail and suggested next action. Urgency ranking is not required; urgency remains in buyer detail and urgent next-task text.

AgencyZoom automatic synchronization remains unverified and nonblocking only after the producer queue is hosted-verified. Callback acceptance is independent of scheduling. No appointment is created or claimed.

## Acceptance evidence

| Verification | Result |
|---|---|
| Acquisition suite | 68/68 local tests pass |
| Backend buyer/distribution/reliability subset | 45/45 local tests pass |
| Backend full suite | 347/348 pass |
| Inherited failure | `agencyzoom-raw.test.mjs:13`: expects “48 hours”; existing rule says outside 7 days. Previously reproduced on unchanged main; unrelated files/business logic left untouched |
| New recovery/security scenarios | 11/11 pass: pre-lead failure; expiry; persistent failure; projection failure; concurrent retries/reconciliation; consent absence; pre-storage preview guard; paired origin/assets; final-save failure; authorized producer API; bounded backlog rotation |
| Existing buyer scenarios | Urgent house, condo, townhome, exploratory/no address, attribution, Back/resume, qualification event, duplicate handling remain passing |
| Hosted paired journey, D1/provider isolation | **Blocked — not executed** |
| Real iPhone Facebook/Instagram | **Not executed** |
| Agency advertising review | **Outstanding** |

Evidence logs in this directory's `buyer-evidence/` are local synthetic tests. No production customer payloads or provider credentials are present. Prior mobile/desktop visual evidence remains in BUYER-CONVERSION-1.0.md; no new hosted screenshots are claimed.

## Hosted acceptance sequence after isolation

1. Verify Production/Preview D1 IDs differ, staging contains only synthetic data, and all Preview service/storage/provider bindings and secret names exclude production customer capabilities. Do not open production records.
2. Configure only CoverageFit Preview isolation acknowledgement after this check; deploy PR #32 candidate. Record commit and immutable deployment URL.
3. Configure acquisition Preview acknowledgement and the exact backend immutable origin; deploy PR #6 candidate. Record commit and immutable URL. Production configuration stays unchanged.
4. Verify HTML, BUYER-1.0 script, stylesheet, CSP, same-origin action proxy and cookie behavior before any synthetic submit. Confirm no production network destination.
5. Run urgent, condo, townhome, exploratory, consent/error/retry, repeat submission, same-browser resume and original UTM paths; verify each expected single producer opportunity in isolated D1 and authenticated WEB / DIRECT.
6. Exercise failure recovery using an isolated fault mechanism only; never break production bindings or credentials. Verify pending status, Refresh recovery and no duplicate opportunity. If there is no safe hosted fault mechanism, report the local fault evidence separately rather than claim hosted coverage.
7. Recheck /tech, /healthcare, /engineers and /teachers. Record sanitized evidence and provider request absence.

No currently verified isolated mobile link is available. Once steps 1–7 pass, on **iPhone Facebook and Instagram separately**: open the pinned acquisition staging buyer link; answer first question; advance; Back and correct an answer; submit an authorized synthetic callback; verify truthful confirmation and producer receipt; close/reopen in the same in-app browser and inspect resume. Check keyboard, touch targets, overflow, loading/error recovery and call link without placing a call. Chromium results are not Meta in-app acceptance.

## Measurement and release

First-party UTM retention and qualified-accepted events remain unchanged. No Pixel/CAPI added and no buyer contact/property/answer data sent to Meta. Internal events are not Meta-verified website conversions. Existing 1.1 tracking recommendation remains conditional on separately authorized campaign configuration.

After hosted acceptance, real-device checks, agency review and explicit production approval: release CoverageFit compatibility/recovery first, verify it, then acquisition. Do not enable staging variables in production. Keep `buyerFlowVersion:1` handling intact.

Rollback: revert acquisition presentation/routing first if needed; retain the compatible CoverageFit buyer engine and recovery while existing sessions/requests are active. A backend rollback to the 1.0 candidate preserves buyerFlowVersion 1 but removes operator recovery, so reconcile pending requests beforehand or retain/backport the recovery fix. Do not roll backend back to pre-buyer main while version-1 sessions remain. Do not delete D1 records, run destructive migrations, reset attribution or change affinity routes. For staging shutdown unset its acknowledgement (fails closed), never repoint it to production. No database migration is added by 1.2.

**Next owner action:** provide the limited Cloudflare configuration screenshots above. Hosted acceptance remains blocked until that evidence establishes isolation; no production release approval is requested yet.
