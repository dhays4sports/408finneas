(function (root, factory) {
  'use strict';
  var api = factory(root.Farmers408SignalContract);
  root.Farmers408SignalFlowRegistry = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis, function (contract) {
  'use strict';

  if (!contract && typeof require === 'function') contract = require('./signal-contract.js');
  if (!contract) throw new Error('Signal contract is required.');

  var BUILD = '408-SIGNAL-FOUNDATION-1.0';

  // Foundation-only lab flow. This is deliberately not a production insurance
  // funnel. Its job is to certify session, attribution, resume, back/edit,
  // canonical answer mapping, analytics, and rendering before /life or /home move.
  var FOUNDATION_DEMO = contract.validateFlow({
    id: 'foundation_demo',
    flowVersion: '1.0',
    product: 'foundation_demo',
    title: 'Signal Foundation Lab',
    description: 'A non-production three-question flow used to certify the reusable Signal Page engine.',
    firstQuestionId: 'foundation_trigger',
    questions: [
      {
        id: 'foundation_trigger',
        dimension: 'need',
        version: '1.0',
        prompt: 'What best describes why you opened this page?',
        supportingText: 'This is a test flow. No contact information is collected.',
        canonicalField: 'statedTrigger',
        options: [
          { code: 'something_changed', label: 'Something changed', signals: { statedTrigger: 'something_changed' }, next: 'foundation_intent' },
          { code: 'comparing_options', label: 'I am comparing options', signals: { statedTrigger: 'comparing_options' }, next: 'foundation_intent' },
          { code: 'just_exploring', label: 'I am just exploring', signals: { statedTrigger: 'just_exploring' }, next: 'foundation_intent' }
        ]
      },
      {
        id: 'foundation_intent',
        dimension: 'intent',
        version: '1.0',
        prompt: 'How active is your interest right now?',
        supportingText: 'The answer is stored only as an anonymous signal code in this lab.',
        canonicalField: 'shoppingIntent',
        options: [
          { code: 'ready_now', label: 'Ready to act now', signals: { shoppingIntent: 'ready_now' }, next: 'foundation_timing' },
          { code: 'open_to_review', label: 'Open to a review', signals: { shoppingIntent: 'open_to_review' }, next: 'foundation_timing' },
          { code: 'researching', label: 'Mostly researching', signals: { shoppingIntent: 'researching' }, next: 'foundation_timing' }
        ]
      },
      {
        id: 'foundation_timing',
        dimension: 'timing',
        version: '1.0',
        prompt: 'When would you want the next step to happen?',
        supportingText: 'This proves timing capture and completion behavior without creating a lead.',
        canonicalField: 'decisionTiming',
        options: [
          { code: 'now', label: 'Now', signals: { decisionTiming: 'now' } },
          { code: 'within_30', label: 'Within 30 days', signals: { decisionTiming: 'within_30' } },
          { code: 'later', label: 'Later', signals: { decisionTiming: 'later' } }
        ]
      }
    ],
    completion: {
      eyebrow: 'Foundation test complete',
      title: 'Three signals captured. No lead created.',
      body: 'Phase 1 preserved your anonymous answers, attribution, and session state. Production routing will be added in the CoverageFit Signal Decision phase.'
    }
  });

  var FLOWS = Object.freeze({ foundation_demo: FOUNDATION_DEMO });

  function get(flowId) {
    return FLOWS[contract.token(flowId, 100)] || null;
  }

  function list() {
    return Object.keys(FLOWS).map(function (key) { return FLOWS[key]; });
  }

  return Object.freeze({ BUILD: BUILD, get: get, list: list, FLOWS: FLOWS });
});
