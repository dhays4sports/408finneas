# Distribution Engine 1.5 acceptance checkpoint

Status: BLOCKED. No hosted inquiry, production promotion, live provider call, outreach change, or credential change in this pass. Reuse CoverageFit #36/#37 and 408finneas #9/#10.

## Verified configuration and access

- Chrome reads authenticated Cloudflare dashboard. Both immutable preview origins show Cloudflare Access login in the available session: frontend 3283cafa.408farmers-v2.pages.dev (0e914e8); backend e3e82f5a.coveragefit.pages.dev (2b9a1d1).
- Access authentication log, last 12 hours: two allowed user logins, frontend Oct 28 11:36:18 PM Pacific and backend 11:36:50 PM; zero blocked in that displayed window. This validates the user's prior sign-in, not the current browser's ability to load either app and not Worker service authentication.
- Frontend Preview has BUYER_STAGING_ISOLATED=1 and COVERAGEFIT_PREVIEW_ORIGIN pinned to the backend. Both COVERAGEFIT_PREVIEW_ACCESS_CLIENT_ID and COVERAGEFIT_PREVIEW_ACCESS_CLIENT_SECRET are absent. The Worker requires these before making upstream requests; it does not forward browser Access cookies.
- Backend Access app caf60b9a-6e0b-4c99-982e-9d94307fda78 has the legacy Allow Members policy, no Service Auth policy, and disabled edit/save controls. No bypass attempted.
- Backend Preview binds COVERAGEFIT_DB to coveragefit-distribution-test, database f5ac694d-1028-4a30-9fbd-c264b2e5995e, workspace distribution-engine:synthetic-test. No RingCentral/OpenAI/Resend/AgencyZoom provider credentials listed. AI, SMS Signal and calendar actions disabled.
- Read-only D1 SQL confirmed TEST database marker and 0 pvx_records / 0 cf_solo_opportunities. No synthetic record was injected through the console.
- A Preview producer access token is configured but its value was not read. Cloudflare Access login and the application's producer bearer authentication are distinct. Producer UI/API receipt remains unverified.
- Production remains frontend main 29ea29a / c889dcd4 and backend main 4aacbb8 / 363b3a27 at inspection.

## Minimal administrator action

Authorize an Access administrator to provision one short-lived service token for the frontend Preview Worker, with a Service Auth policy restricted to the immutable backend preview and /api/distribution/*, retaining the existing user Allow policy for browser assets and producer UI. If a more-specific Access application is required to narrow the wildcard Pages app, preserve equivalent user access there and never add Bypass or extend service access to production/older preview deployments. Store the token ID and secret only as encrypted frontend Preview variables named COVERAGEFIT_PREVIEW_ACCESS_CLIENT_ID and COVERAGEFIT_PREVIEW_ACCESS_CLIENT_SECRET. Redeploy the existing frontend branch with those secrets; do not recreate projects or databases. Verify denied requests without credentials, allowed service calls, and browser asset loading. Revoke the temporary token after acceptance.

A new scoped credential/policy requires action-time security approval; current editor is disabled. User must complete browser sign-in and enter the existing Preview producer key privately into the hosted workspace. Do not copy keys into chat or reuse production provider credentials.

## Regression repair and evidence

CoverageFit: node --test tests/*.test.mjs => 388/388 pass at 2b9a1d1.
Frontend: node --test tests/*.test.mjs tests/*.test.cjs => 76/76 pass after this change.

Nine legacy Life-handler tests expected public preview routes to run, contradicting the distribution firewall. Export the existing handler for direct unit tests, preserve its validation/durability tests, and assert both legacy routes remain denied at the Worker boundary. No route, allowed host, provider behavior or firewall rule was relaxed. The frontend suite expects a sibling checkout named CoverageFit; that local test setup was corrected before evaluating the nine failures.

These are local regressions, not browser passes. Desktop interaction, mobile viewport, actual Safari, in-app browsers, source retention, consent, offline recovery, end-to-end D1 write and hosted producer retrieval remain blocked by access/pairing. Actual Safari/in-app browsers were not available. Post-completion touches remain stored in the journey but not automatically reprojected to an already delivered producer source.

## Proposed producer notification (approval package; not enabled)

Reuse server/producer-notification.mjs and existing authorized Resend sender configuration in CoverageFit. Do not use AgencyZoom enrollment as a notification substitute. Current template says Home Coverage Review; adapt it explicitly for a restaurant inquiry and link to authenticated /agent/workspace/. Keep names, phone, address and underwriting answers out of email. Confirm the exact Dylan recipient and sender before activation.

Trigger only after accepted durable storage and successful Solo Desk projection. A handoff failure keeps the stable accepted ID and delivery-pending state; reconciliation projects the same lead before creating the alert. Use one durable notification record keyed by workspace + accepted request ID + alert type/version, with a unique constraint, atomic claim/lease, attempt count, next-attempt timestamp, sent timestamp and provider message ID. Both immediate and retry paths use the same ledger and provider Idempotency-Key. Concurrent calls cannot enqueue another alert; sent is terminal. Keep the payload stable on retries. Retry transient timeouts/429/5xx with bounded backoff (1m, 5m, 30m, 2h, 6h), cap attempts, and expose exhausted/ambiguous delivery in the producer workflow. Do not blindly retry beyond the provider's verified deduplication window; reconcile provider status or require producer review. Permanent rejection stops retries. Acceptance must never depend on email success. Pending notification recovery must reuse an existing authorized scheduled reconciliation runner, verified before activation; waitUntil alone is not durable recovery.

TEST traffic or any preview host must skip provider invocation regardless of configuration. Mock-provider tests must cover a committed send with lost acknowledgement, concurrent retries, permanent error, lease recovery, and no second alert on intake retry. The existing transport's idempotency header and two immediate attempts are useful primitives, but are not a complete durable alert integration. This is a prepared proposal, not implemented/ready for live activation.

AgencyZoom remains disabled for this path. Agency must confirm tenant/account, exact commercial pipeline ID/name, initial stage ID/name, assigned producer/owner ID, source mapping, duplicate matching rules, and whether that stage triggers automatic email/SMS/tasks. web_coveragefit_business and sms_business currently map to personal; fail closed for missing commercial mapping. Never fall back to personal lines. Do not activate automations implicitly when assigning a stage.

## Targeted security findings and limits

Account audit log (last 7 days) showed Pages updates under the account user and certificate system activity. The reviewed frontend update events show fail_open=false for BOTH Preview and Production at Oct 28 23:00:00 (audit 01a1863e-6ccf-7ac9-bb71-dcf6d54f6220), then fail_open=true for BOTH at 23:01:24 (01a1863f-b34d-76e0-8c58-f1704e73ed7c). Both projects currently display Fail open. Therefore restoration to a fail-closed state is not established; the observed last change restored true. Access authentication remains a separate enforced gate. No settings were changed in this review.

The displayed Access logs contain the user's two allowed logins. Neither these logs nor Pages configuration audit events establish the absence of historic outbound provider invocations, database access, or credential exposure. No positive evidence of unauthorized sending or breach was found in the inspected subset. Historical Worker request/subrequest and provider delivery/access logs were not established; investigation is incomplete. Earlier provider-bearing immutable deployments and unclassified historical records remain concerns; current configuration removal does not prove old credentials were revoked.

Recommend planned revocation/replacement of the formerly shared OpenAI API key and RingCentral JWT/client secret after identifying all legitimate production consumers and validating replacement configuration. Assess the conversation hash secret separately: rotation may affect identity continuity and needs a migration plan. Client ID and sending number are identifiers, not secret-rotation targets. No rotation or production change without explicit approval. Establish historical log coverage and a fail-closed runtime decision before release; do not infer a breach or claim zero exposure.

## Release gates/order

1. Scoped Access administration and browser/producer authentication.
2. Secure paired hosted test: tagged synthetic restaurant identity, all alcohol branches, consent, stable accepted ID, TEST D1 persistence, first/additional touch, failed projection retry without duplicate, authenticated API and actual hosted producer UI receipt.
3. Desktop/mobile and real Safari/in-app acceptance; resolve or explicitly accept post-completion attribution limitation.
4. Approve notification integration and exact recipient; agency commercial mapping and Farmers copy/consent/eligibility/destination review. Complete security disposition and any separately approved rotation.
5. Separate coordinated production authorization: frontend cookie bridge e52b3f9 first; compatible backend #36+#37 second; remaining frontend #9+#10 last. Preserve cookies and durable records during rollback.

Six approved distribution inquiries and all existing automations remain unchanged.
