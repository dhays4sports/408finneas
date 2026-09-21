const assert = require('node:assert/strict');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
global.LANDING_PAGE_CONFIG = { coverageFitSignalDecisionUrl: 'https://coveragefit.com/api/signal/decision' };

const contract = require(path.join(root, 'shared/signal-contract.js'));
const registry = require(path.join(root, 'shared/signal-flow-registry.js'));
const sessionApi = require(path.join(root, 'shared/signal-session.js'));
const remote = require(path.join(root, 'shared/signal-decision-remote.js'));

class FakeStorage {
  constructor(){ this.map = new Map(); }
  getItem(k){ return this.map.has(k) ? this.map.get(k) : null; }
  setItem(k,v){ this.map.set(k,String(v)); }
  removeItem(k){ this.map.delete(k); }
}

const flow = registry.get('foundation_demo');
const store = new FakeStorage();

let session = sessionApi.create(flow, {
  storage: store,
  location: {
    pathname: '/signal-lab/',
    search: '?utm_source=qa&utm_campaign=signal_bridge&partner_name=Jane%20Doe&partner_id=p_123'
  },
  document: { referrer: 'https://example.com/private/path' }
});

const initial = remote.payload(flow, session);
assert.equal(initial.canonicalSignals.product, 'unknown');
assert.equal(initial.attribution.partnerId, 'p_123');
assert.equal(initial.attribution.utmSource, 'qa');
assert.equal(initial.attribution.utmCampaign, 'signal_bridge');
assert.equal(initial.attribution.landingPage, '/signal-lab/');
assert.equal('partnerName' in initial.attribution, false);
assert.equal(JSON.stringify(initial).includes('Jane Doe'), false);
assert.equal(JSON.stringify(initial).includes('example.com'), false);

const productQuestion = contract.validateQuestion({
  id: 'signal_product',
  dimension: 'product',
  prompt: 'What are you looking for help with?',
  canonicalField: 'product',
  options: [
    { code: 'life', label: 'Life coverage', signals: { product: 'life' } },
    { code: 'home', label: 'Home coverage', signals: { product: 'home' } }
  ]
});

session = sessionApi.answerQuestion(session, flow, productQuestion, 'life', { storage: store }).session;
assert.equal(session.canonicalSignals.product, 'life');
assert.deepEqual(session.answers[0].signals, { product: 'life' });

const resumed = sessionApi.load(flow, { storage: store });
assert.equal(resumed.canonicalSignals.product, 'life');
assert.deepEqual(resumed.answers[0].signals, { product: 'life' });

const backed = sessionApi.goBack(session, flow, { storage: store });
assert.equal(backed.answers.length, 0);
assert.equal(backed.canonicalSignals.product, 'foundation_demo');

let captured = null;
global.fetch = async (url, options) => {
  captured = { url, options, body: JSON.parse(options.body) };
  return {
    ok: true,
    status: 200,
    async json() {
      return {
        ok: true,
        schemaVersion: '1.0',
        engine: 'CF-SIGNAL-DECISION-1.0',
        priorityEngine: 'CF-OPPORTUNITY-PRIORITY-1.0',
        decision: 'ASK_ONE_SIGNAL',
        state: 'signal_developing',
        nextQuestionId: 'life_coverage_status',
        missingDimension: 'need',
        nextQuestion: {
          id: 'life_coverage_status',
          dimension: 'need',
          prompt: 'Do you currently have personal life insurance outside of anything through work?',
          canonicalField: 'lifeCoverageStatus',
          options: [
            { code: 'yes_personal', label: 'Yes', signals: { lifeCoverageStatus: 'yes_personal' } },
            { code: 'employer_only', label: 'Only through work', signals: { lifeCoverageStatus: 'employer_only' } },
            { code: 'none', label: 'No', signals: { lifeCoverageStatus: 'none' } },
            { code: 'unsure', label: 'Not sure', signals: { lifeCoverageStatus: 'unsure' } }
          ]
        },
        publicExperience: null,
        evaluatedAt: '2026-09-20T20:00:00.000Z'
      };
    }
  };
};

const remoteDecision = await remote.evaluate(flow, session, { timeoutMs: 1000 });
assert.equal(remoteDecision.mode, 'coveragefit_remote');
assert.equal(remoteDecision.decision, 'ASK_ONE_SIGNAL');
assert.equal(remoteDecision.nextQuestionId, 'life_coverage_status');
assert.equal(remoteDecision.missingDimension, 'need');
assert.equal(remoteDecision.nextQuestion.canonicalField, 'lifeCoverageStatus');
assert.equal(captured.url, 'https://coveragefit.com/api/signal/decision');
assert.equal(captured.options.credentials, 'omit');
assert.equal(captured.options.mode, 'cors');
assert.equal(captured.options.cache, 'no-store');
assert.equal(captured.body.canonicalSignals.product, 'life');

global.fetch = async () => ({
  ok: false,
  status: 503,
  async json(){ return { ok:false, error:{ code:'signal_decision_unavailable', message:'Try again.' } }; }
});
await assert.rejects(
  ()=>remote.evaluate(flow, session, { timeoutMs: 1000 }),
  error=>error?.code==='signal_decision_unavailable'
);

console.log('SIGNAL-DECISION-BRIDGE-1.0 tests passed');
