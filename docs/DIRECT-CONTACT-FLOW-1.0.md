# Direct Contact Flow 1.0 — frontend

Mandate: 408FARMERS-DIRECT-CONTACT-FLOW-1.0. Unmerged preview candidate.

The CoverageFit counterpart implements the canonical session action and shared client. This repository adds restrained secondary-action styling and a cache version update for professional, buyer and condo presentation. Home presentation is otherwise unchanged; home visual alignment and auto expansion remain separate. Existing single products, combined Home + auto, QR attribution and legacy destinations are preserved.

`tests/direct-contact.test.mjs` exercises nine actual frontend-proxy → backend-handler paths, including home/condo QR, opening with no answers, no opportunity on opening, explicit channel-specific permission and one accepted opportunity on submission. Run with the coordinated CoverageFit checkout as ../CoverageFit. `node --test tests/*.test.mjs`: 71/71 pass. Backend full suite: 437/438; inherited AgencyZoom timing assertion, detailed in the backend report. Browser layout observations cover all nine routes at 375, 390, 430 and 1280px for opening and form: 72 checks, no overflow or buttons below 44px.

## Working isolated previews

Run the managed preview with the checkout-local dev command `node qa/professional/direct-server.mjs` through sites-preview. The harness uses actual frontend proxies, backend handlers, migrations and producer UI against in-memory SQLite; all data is synthetic, external provider fetches disabled. Consumer: / ; producer: /qa-producer. Toolbar selects route and width. Fresh synthetic session only clears the preview cookie. Producer token is a public, hardcoded local test fixture with no production authority. Keep this harness off production; no production route imports it. In-memory data resets if the managed server restarts.

The browser verified completed combined delivery with six answers, different home/auto reasons and timing, edited condo property, text preference, plus a distinct zero-answer condo QR call request with afternoon preference. Each produced exactly one opportunity through authoritative local projection. Opening forms produced none. See accepted-receipts.json and producer-review-export.json for saved proof. Both producer records explicitly label contact stage and completion status. No external messages or production requests were sent.

## Evidence

All files are under direct-contact/:

- opening-390.jpg — visible secondary contact access beneath all coverage choices.
- partial-form-390.jpg — shared form with Home + auto retained before completing questions.
- automatic-form-390.jpg — form displayed directly after the sixth confirmed answer; draft preserved.
- confirmation-390.jpg — authoritative accepted request confirmation.
- producer-combined.jpg — one combined opportunity with separate evidence and original source.
- producer-opening-qr.jpg — explicit early-contact/unknown-details evidence and QR attribution.
- condo-qr-desktop.jpg and contact-condo-qr-desktop.jpg — representative desktop states.
- layout-opening.json and layout-contact.json — measured route/viewport bounds and target heights.
- combined-receipt.json — first combined request: one opportunity.
- accepted-receipts.json — two distinct submitted reviews: two opportunities.
- producer-review-export.json — downloaded through the actual producer export button.

Desktop browser frames approximate mobile layout; no physical-device claim. Drafts/permission clear on refresh and restart; browser confirmed both. Handler/VM tests cover uncertain saves, stale tabs, pending recovery and duplicate retries that are not artificially injected into screenshots. No hosted-runtime acceptance or conversion improvement is claimed. Backend report describes precise event semantics and inherited cross-audience-cookie limitations.

## Coordination

Deploy this backward-compatible CSS/cache update before the CoverageFit action, renderer and shared-client release. No migrations or provider changes. Rollback frontend styling independently; retain backend open_contact compatibility while draining cached clients, or reload into old assets. Durable saved/accepted requests must remain intact. Backend dependency: CoverageFit commit ea545c679dfdad9136d3fc7890b72776d8fdcc70 (feature/direct-contact-1); coordinated PR is linked in the PR description. Do not merge or publish under this mandate.
