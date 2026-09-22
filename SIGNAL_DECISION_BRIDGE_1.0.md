# 408FARMERS — SIGNAL-DECISION-BRIDGE-1.0

**Build:** 408-SIGNAL-DECISION-BRIDGE-1.0  
**408FARMERS package:** 1.4.4  
**Status:** Internal bridge lab / pre-production  
**Date:** 2026-09-20

## Purpose

Connect the reusable 408FARMERS Signal Foundation to CoverageFit's stateless Signal Decision API without migrating a customer-facing product page.

The bridge preserves the architecture:

```text
408FARMERS SignalSession
        ↓
CoverageFit Signal Decision
        ↓
one next question OR a public route
```

408FARMERS remains the interaction layer. CoverageFit chooses what the evidence means.

## Lab modes

Default:

`/signal-lab/`

uses the original local Phase-1 decision adapter.

Remote QA:

`/signal-lab/?decision=remote&fresh=1`

uses:

`https://coveragefit.com/api/signal/decision`

The local and remote labs use separate SignalSession keys so their answers cannot contaminate one another.

## Dynamic questions

CoverageFit may return a declarative question that does not exist in the 408FARMERS Flow Registry.

SignalSession now stores each answer's bounded canonical `signals` map alongside:
- question ID
- question version
- option code
- timestamp

This allows:
- refresh/resume
- Back
- downstream invalidation
- canonical-signal recomputation

without copying CoverageFit's question library into 408FARMERS.

## Remote decision client

`/shared/signal-decision-remote.js`

The client:
- uses POST JSON
- sends no credentials/cookies
- uses no-store
- has a bounded timeout
- normalizes unsupported lab product names to `unknown`
- sends only the canonical Signal fields
- reduces attribution to non-personal source/campaign IDs and UTMs
- omits partner names, realtor names, referrer host and other non-decision context
- validates CoverageFit's returned question through the 408 Signal contract

## Failure behavior

Remote QA never silently falls back to local decision logic.

If CoverageFit cannot be reached, the lab:
- preserves the anonymous SignalSession locally
- shows a visible retry state
- emits `signal_error`
- allows inspection of the local session

This prevents a broken integration from looking successful.

## Network boundary

The `/signal-lab/` CSP allows connections only to:
- the same 408FARMERS origin
- `https://coveragefit.com`

It does not permit arbitrary API hosts.

If a separate CoverageFit preview hostname is used, the lab CSP and configured Signal Decision URL must be intentionally updated for that preview. Do not broaden production CSP merely to make preview testing easier.

## Current completion behavior

The bridge lab renders CoverageFit's public decision and action codes, but it does not execute those actions.

For example, `OFFER_HUMAN` may display:
- talk_now
- choose_time
- text

Those actions remain deliberately unwired until the ZERO-REPEAT handoff/promotion phase.

## Hard boundaries

This build does not:
- migrate `/life`
- migrate `/home`
- create a lead
- create a CoverageFit Opportunity
- create AgencyZoom records
- collect contact identity
- grant contact permission
- book a callback
- send a text/email
- expose Opportunity Priority score

## Next gate

1. Deploy the CoverageFit Signal Decision branch to a reachable test endpoint.
2. Ensure that endpoint allows the 408FARMERS preview origin.
3. Deploy this 408FARMERS bridge branch.
4. Open `/signal-lab/?decision=remote&fresh=1`.
5. Certify the complete anonymous remote loop.
6. Only then begin `SIGNAL-LIFE-1.0`.
