# Professional landing page visual refinement 1.1

Mandate: 408FARMERS-PROFESSIONAL-VISUAL-REFINEMENT-1.1. November 14, 2026 (Pacific).

## Result

The four existing professional routes now share a tighter introductory group, compact header and advisor identity, pale blue review panel with white choices, stronger button boundaries, and a separate “What happens next” reassurance section. The headline, conditional eligibility language, personal promise, identity, license, disclosure and existing links remain intact. Footer/disclosure text is 12px rather than the prior 11px for readability. The CSS asset version changes to 1.1 to avoid stale cached styling.

Production changes are limited to `shared/professional-entry.css` and the stylesheet version and reassurance heading in `server/professional-presentation.mjs`. No interaction JavaScript, question engine, attribution, consent, transport, routing, security policy or CoverageFit source changes. No choices are preselected and no extra step is added. Immediate progression remains intact. Buyer, Condo and Home use their existing separate presentation paths.

## Source and verification

- Acquisition baseline: `29ea29a9818006ed139cf87f0990306c769b63c9` (current remote main at inspection).
- CoverageFit dependency: `4aacbb82d789bf55a5b7e289a9f014382df5d36f` (current remote main at inspection).
- Node 24.22.1: `node --test tests/*` — **70 passed, 0 failed**. Includes 16 profession/product combinations exercising canonical intake, Back, invalid answers, consent, phone validation, attribution and duplicate-safe producer receipts against isolated SQLite.
- Browser: all four pages at 375, 390, 430 and 1280px; no horizontal overflow, images loaded, and initial choices at least 52px tall. This uses width-constrained Chromium frames, not physical iPhone/Safari or Instagram WebView certification.
- Browser: Auto selection immediately advanced and Back restored coverage choices on all four routes. Separate fresh synthetic sessions prevent cross-audience resume from contaminating these checks.
- Browser: keyboard Tab produced a visible 3px gold outline with 3px offset. Empty follow-up submission identified name, phone and explicit permission as invalid. A synthetic Teachers follow-up reached an isolated local producer receipt and Start a New Review restored the choices.
- Contrast: muted body text against the warm background is approximately 6.01:1, against the panel 5.65:1; audience label 5.99:1; gold focus outline against the panel 4.82:1. Final button/input border `#74879c` exceeds 3:1 against the pale blue panel and white surfaces.
- Live inspection confirmed all four production routes use the existing version-1 shared presentation. Live Tech Auto progression was inspected without submitting contact details.

## Preview and evidence

The working preview is an isolated local application using real CoverageFit handlers, an in-memory SQLite database, no credentials and empty provider environment. It cannot send external communications. Its navigation supports all four professions, matching before/after layouts, viewport widths and a fresh synthetic session.

To reproduce: check out the acquisition branch with CoverageFit at the dependency SHA above as sibling `../CoverageFit`, then run `node qa/professional/server.mjs`. Default port is 4173; `PORT` may override it. Open the root URL. Node's built-in SQLite support is required. No packages are needed.

`qa/professional/server.mjs` is QA infrastructure only. It localizes assets, permits preview framing, and omits Secure on its local session cookie for HTTP compatibility. Production CSP and cookies remain untouched. Compatibility/contact/footer destinations are preserved in production; the isolated harness serves only the professional experience and its assets, not the entire legacy site.

Evidence: [directory](professional-visual-1.1-evidence/). Matched screenshots include all four professions at 390px and Tech at 375, 390, 430 and 1280px. Before screenshots render the pinned acquisition baseline using the same CoverageFit dependency and viewport frame as After; they are not physical-device production screenshots. The gray surround and preview toolbar are QA controls, not website changes. Viewport measurements precede the final boundary-contrast adjustment; dimensions and layout rules did not change afterward. Final After screenshots include that adjustment.

| View | Before | After |
| --- | --- | --- |
| Tech mobile, 390px | [Before](professional-visual-1.1-evidence/tech-390-before.png) | [After](professional-visual-1.1-evidence/tech-390-after.png) |
| Tech desktop, 1280px | [Before](professional-visual-1.1-evidence/tech-1280-before.png) | [After](professional-visual-1.1-evidence/tech-1280-after.png) |
| Healthcare, 390px | [Before](professional-visual-1.1-evidence/healthcare-390-before.png) | [After](professional-visual-1.1-evidence/healthcare-390-after.png) |
| Engineers, 390px | [Before](professional-visual-1.1-evidence/engineers-390-before.png) | [After](professional-visual-1.1-evidence/engineers-390-after.png) |
| Teachers, 390px | [Before](professional-visual-1.1-evidence/teachers-390-before.png) | [After](professional-visual-1.1-evidence/teachers-390-after.png) |

## Release state

Prepared for review; no merge or production publishing. Local preview validation does not certify a hosted Cloudflare preview backend, real customer delivery, iOS behavior, or conversion improvement. No infrastructure, provider or campaign configuration was changed. A later authorized release can roll back by reverting the two production files or restoring the previous frontend deployment; no data rollback is needed.
