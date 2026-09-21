# SIGNAL-FOUNDATION-1.0 QA

## Automated checks

- Signal contract validates the demo flow.
- Anonymous prohibited fields are rejected by contract validation.
- New session contains no identity/contact data.
- Attribution is captured once from approved query parameters.
- First answer advances to question 2.
- Second answer advances to question 3.
- Final answer completes the session.
- Canonical signals reflect answer codes.
- Back removes the latest answer and reopens its question.
- Editing an earlier answer invalidates downstream answers.
- Persisted sessions can resume.
- Expired sessions are not resumed.
- Restart generates a new session ID.
- Local decision adapter never claims scoring or CoverageFit connectivity.
- Event names are allowlisted.

## Manual browser checks before production-page migration

1. Open \`/signal-lab/?utm_source=qa&utm_campaign=signal_foundation\`.
2. Confirm no contact field appears.
3. Answer question 1 and refresh.
4. Confirm resume prompt appears.
5. Continue and answer question 2.
6. Use Back.
7. Confirm the prior question returns and downstream answer is invalidated.
8. Complete all three questions.
9. Confirm completion says no lead was created.
10. Inspect the local session and verify UTMs + canonical signal codes.
11. Run the lab again and verify a new session ID is created.
12. Confirm \`/signal-lab/\` is noindex and excluded from the sitemap.
13. Confirm keyboard focus moves to each new question.
14. Confirm visible focus state exists for answers/back/restart.
15. Confirm reduced-motion mode does not rely on animation.
16. Confirm the existing \`/life\`, \`/home\`, \`/buyer\`, \`/auto-bundle\`, \`/condo\`, and affinity pages are unchanged by Phase 1.
