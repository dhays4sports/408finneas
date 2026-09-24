# 408FARMERS Signal route expansion

Preview-only extension of the Life experience. No live acquisition form is replaced.

## Entry points

Hub: `/signal-preview/`.

| Existing route | Signal preview | Initial product |
|---|---|---|
| `/` | `/signal-preview/start/` | Unknown; ask product |
| `/home/` | `/signal-preview/home/` | Home |
| `/buyer/` | `/signal-preview/buyer/` | Home |
| `/condo/` | `/signal-preview/condo/` | Home |
| `/auto-bundle/` | `/signal-preview/auto-bundle/` | Home first |
| `/tech/` | `/signal-preview/tech/` | Unknown; ask product |
| `/healthcare/` | `/signal-preview/healthcare/` | Unknown; ask product |
| `/teachers/` | `/signal-preview/teachers/` | Unknown; ask product |
| `/engineers/` | `/signal-preview/engineers/` | Unknown; ask product |
| New preview entry | `/signal-preview/auto/` | Auto |
| New preview entry | `/signal-preview/business/` | Business |
| Existing Life preview | `/signal-life-preview/` | Life; unchanged |

Contact, referrals, local directory, operations and confirmation pages retain their existing purposes. Route names do not assert occupation, eligibility, property type or buying intent. Home + auto starts with the supported Home product; the engine does not have a combined product contract. Product-specific advice is not generated.

## Reuse and behavior

`shared/signal-route-registry.js` declares routes. `shared/signal-route-shell.js` renders the existing CoverageFit remote decision contract using the existing Signal session and remote client. Scoring and question selection remain in CoverageFit; no local fallback or duplicate decision engine is introduced.

Each route has its own versioned, 30-day anonymous session. Back removes downstream evidence. Resume, restart, retry, learn, later and explicit human choice are supported. Anonymous signals are transmitted to the existing CoverageFit preview endpoint; no identifying input is collected. Human choice shows an honest preview boundary: no callback, appointment, contact delivery or consent is created. The Life-only staging API is not reused for unsupported products.

## Deployment and boundaries

Use the existing allowed Life preview origin for hosted review:
`https://signal-life-1-0.408farmers-v2.pages.dev/signal-preview/`.

A separate `signal-routes-1.0` branch origin is NOT automatically authorized by CoverageFit's exact CORS allowlist. Do not broaden that allowlist with wildcards. Publishing a Git branch does not prove a hosted deployment works.

No production route replacement, SMS sending, AgencyZoom write, migration, live contact delivery or CoverageFit backend deployment is part of this expansion. The combined CoverageFit SMS preview remains separate.

## Validation

Run `node tests/signal-routes.test.cjs`. The existing tests expect the CoverageFit checkout at sibling `../CoverageFit`; use the Signal Decision implementation there. Run all `tests/*.cjs` and `tests/*.mjs` for regression coverage.

New tests cover 11 route configurations and 58 engine paths, terminal decisions, Back, unique session identities, no invented route facts, anonymous static wrappers, offline/retry and non-delivering human preview. All nine test scripts passed locally, including the ten handoff/staging subtests. Browser verification is a separate hosted check.

Next release gate: review the preview experiences, then connect a consent-aware cross-product human handoff before replacing live forms.
