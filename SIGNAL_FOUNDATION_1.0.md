# 408FARMERS — SIGNAL-FOUNDATION-1.0

**Build:** 408-SIGNAL-FOUNDATION-1.0  
**408FARMERS package:** 1.4.3  
**Status:** Phase 1 foundation / non-production Signal lab  
**Date:** 2026-09-20

## Doctrine

The first screen does not sell insurance. It earns the next question.

The long-term acquisition chain is:

**Exposure → Signal Session → One Question → Decision → One More Question or Handoff → Opportunity → Human**

Phase 1 implements the reusable browser-side primitives only. It intentionally does not score, create a lead, contact a prospect, or migrate a production product page.

## What Phase 1 adds

### Signal contract
\`/shared/signal-contract.js\`

Owns:
- schema/build version
- canonical SignalSession states
- decision names
- truthful event taxonomy
- attribution allowlist
- canonical signal-field allowlist
- explicit anonymous-PII prohibition
- question/option/flow validation

### Flow Registry
\`/shared/signal-flow-registry.js\`

Owns declarative flows. Phase 1 contains only \`foundation_demo\`.

Production \`/life\`, \`/home\`, \`/buyer\`, \`/auto\`, \`/business\`, and affinity flows are intentionally not registered yet.

### SignalSession
\`/shared/signal-session.js\`

Owns:
- anonymous session ID
- flow + flow version
- localStorage persistence with in-memory fallback
- 30-day expiry
- acquisition attribution captured on session creation
- answer history
- canonical signal projection
- back/edit invalidation
- restart
- local resume
- zero PII at this layer

The session is not a lead and is not written to AgencyZoom or CoverageFit.

### Local analytics
\`/shared/signal-analytics.js\`

Phase 1 records truthful browser-local events only and emits a \`408farmers:signal-event\` CustomEvent. It may also mirror events into an existing \`dataLayer\` if one is already present.

It does not claim server durability.

### Local foundation decision adapter
\`/shared/signal-decision-local.js\`

Provides the temporary Phase 1 decision interface:
- \`ASK_ONE_SIGNAL\`
- \`FOUNDATION_COMPLETE\`

No scoring is performed. This interface is deliberately shaped so Phase 2 can replace it with the CoverageFit Signal Decision API without rewriting the shell.

### Signal Shell
\`/shared/signal-shell.js\`

Owns:
- question rendering
- answer tap targets
- focus management
- back behavior
- resume prompt
- restart
- completion view
- local session inspector
- public CustomEvents for session/decision integration

### Validation surface
\`/signal-lab/\`

A noindex three-question test flow. It exercises:
- session creation
- attribution persistence
- canonical answer mapping
- question progression
- back/edit
- resume
- completion
- restart
- analytics events

It never asks for identity/contact information.

## Canonical SignalSession shape

\`\`\`text
schemaVersion
build
recordType
sessionId
flowId
flowVersion
product
state
currentQuestionId
answers[]
canonicalSignals{}
attribution{}
decision{}
contact{}
promotion{}
createdAt
updatedAt
expiresAt
\`\`\`

## Canonical anonymous signal fields

Phase 1 allows only bounded acquisition context such as:
- product
- statedTrigger
- shoppingIntent
- decisionTiming
- reviewReason
- renewalTiming
- closingDate
- propertyType
- autoNeed
- businessNeed
- businessType
- professionalProgram
- lifeCoverageStatus
- lifeProtectionTrigger
- lifeGoal

Names, phone numbers, email addresses, DOB, SSN, medical information, driver license, VIN, and full address do not belong in anonymous SignalSession answers.

## Attribution contract

Captured once at session creation and preserved through the flow:
- source / surface
- source family / source key
- campaign / campaign ID / campaign variant
- creative
- partner / batch
- UTMs
- realtor/referral context
- landing page
- referrer hostname only

A later flow transition must not reset attribution.

## Event taxonomy

Phase 1 establishes names for the complete future funnel, including:
- signal_session_started
- signal_session_resumed
- signal_question_viewed
- signal_answered
- signal_answer_changed
- signal_back_used
- signal_decision_received
- signal_next_question_shown
- signal_handoff_shown
- signal_handoff_selected
- contact_request_started
- contact_permission_granted
- lead_promoted
- booking_started
- booking_saved
- coveragefit_handoff_opened
- signal_session_abandoned
- signal_session_completed

Only events that actually occur may be emitted.

## Question governance

A future production Signal question belongs before handoff only if at least one possible answer materially changes:
- routing
- priority evidence
- the next question
- the available next action

Questions that merely make later quote/application work easier belong downstream.

## Phase 1 hard boundaries

This release does not:
- replace any current public landing page
- connect to CoverageFit Signal Decision
- calculate Opportunity Priority
- create a durable lead
- send contact information
- ask for contact consent
- create AgencyZoom records
- create callbacks
- send SMS/email
- alter Retell
- expose internal scores

## Phase 2 interface

The shell is built so \`signal-decision-local.js\` can be replaced by a remote decision client whose response includes:

\`\`\`text
decision
state
nextQuestionId
missingDimension
publicExperience
engineVersion
evaluatedAt
\`\`\`

Phase 2 should make CoverageFit—not 408FARMERS—the canonical decision/scoring authority.
