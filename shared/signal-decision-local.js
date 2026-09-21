(function (root, factory) {
  'use strict';
  var api = factory(root.Farmers408SignalContract);
  root.Farmers408SignalDecisionLocal = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis, function (contract) {
  'use strict';

  if (!contract && typeof require === 'function') contract = require('./signal-contract.js');
  if (!contract) throw new Error('Signal contract is required.');

  var BUILD = '408-SIGNAL-FOUNDATION-1.0';

  function evaluate(flow, session) {
    var nextId = contract.token(session && session.currentQuestionId, 100);
    if (nextId && flow.questionMap[nextId]) {
      return Object.freeze({
        build: BUILD,
        mode: 'local_foundation_only',
        decision: 'ASK_ONE_SIGNAL',
        state: session.answers && session.answers.length ? 'signal_developing' : 'signal_only',
        nextQuestionId: nextId,
        publicExperience: null,
        evaluatedAt: new Date().toISOString(),
        scoringApplied: false,
        coverageFitConnected: false
      });
    }
    return Object.freeze({
      build: BUILD,
      mode: 'local_foundation_only',
      decision: 'FOUNDATION_COMPLETE',
      state: 'complete',
      nextQuestionId: '',
      publicExperience: flow.completion,
      evaluatedAt: new Date().toISOString(),
      scoringApplied: false,
      coverageFitConnected: false
    });
  }

  return Object.freeze({ BUILD: BUILD, evaluate: evaluate });
});
