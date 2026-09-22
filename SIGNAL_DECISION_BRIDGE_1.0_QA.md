# SIGNAL-DECISION-BRIDGE-1.0 QA

## Automated / contract gates

- Foundation placeholder product maps to `unknown` for CoverageFit.
- Dynamic CoverageFit questions validate through the local Signal contract.
- Dynamic answer stores its canonical signal map.
- Resume preserves dynamic canonical signals.
- Back removes the dynamic answer and recomputes remaining signals.
- Partner/realtor names and referrer host are not included in remote decision payloads.
- Remote requests use `credentials: omit`.
- Remote requests use `cache: no-store`.
- Failed remote decisions reject visibly rather than falling back to local logic.
- Local Phase-1 adapter remains available as the default lab mode.

## Browser preview gate

CoverageFit:
1. Deploy `cf-signal-decision-1.0`.
2. Set `CF_SIGNAL_ALLOWED_ORIGINS` to the exact 408FARMERS preview origin if it differs from production.
3. Confirm `POST /api/signal/decision` is reachable.

408FARMERS:
1. Deploy `signal-decision-bridge-1.0`.
2. Open `/signal-lab/?decision=remote&fresh=1`.
3. First screen should come from CoverageFit, not the local foundation questions.
4. Choose Life.
5. Confirm the next question is personal Life coverage status.
6. Choose employer-only.
7. Confirm CoverageFit asks Intent.
8. Choose open-to-review.
9. Confirm CoverageFit asks Timing.
10. Choose within 30 days.
11. Confirm the public outcome is `OFFER_HUMAN`.
12. Confirm no score/queue/dimensions are visible in Network response.
13. Refresh midway and confirm Resume restores the remote sequence.
14. Back up one question and change the answer; confirm downstream answer is invalidated.
15. Disable/block the CoverageFit request and confirm visible retry state with preserved answers.
16. Confirm no lead/opportunity/AgencyZoom record is created by the lab.
17. Confirm no phone/email/name field appears.

## Production migration gate

Do not begin a public `/life` cutover until the remote browser gate passes.
