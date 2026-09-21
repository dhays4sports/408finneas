const assert = require('node:assert/strict');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const contract = require(path.join(root, 'shared/signal-contract.js'));
const registry = require(path.join(root, 'shared/signal-flow-registry.js'));
const sessionApi = require(path.join(root, 'shared/signal-session.js'));
const decision = require(path.join(root, 'shared/signal-decision-local.js'));

class FakeStorage {
  constructor(){ this.map = new Map(); }
  getItem(k){ return this.map.has(k) ? this.map.get(k) : null; }
  setItem(k,v){ this.map.set(k,String(v)); }
  removeItem(k){ this.map.delete(k); }
}

function loc(search=''){
  return { pathname:'/signal-lab/', search };
}

const flow = registry.get('foundation_demo');
assert.ok(flow, 'foundation flow exists');
assert.equal(flow.questions.length, 3);
assert.equal(flow.firstQuestionId, 'foundation_trigger');

assert.throws(() => contract.validateFlow({
  id:'bad',
  questions:[{id:'q',prompt:'Bad?',options:[{code:'x',label:'X',signals:{email:'x@example.com'}}]}]
}), /Unsupported canonical signal field/);

const store = new FakeStorage();
const created = sessionApi.loadOrCreate(flow, {
  storage:store,
  location:loc('?utm_source=qa&utm_campaign=foundation&campaign_id=signal_test&partner_id=partner_1'),
  document:{referrer:'https://example.com/path?secret=do-not-store'}
});
assert.equal(created.created, true);
assert.equal(created.resumed, false);
assert.equal(created.session.state, 'signal_only');
assert.equal(created.session.answers.length, 0);
assert.equal(created.session.attribution.utm_source, 'qa');
assert.equal(created.session.attribution.utm_campaign, 'foundation');
assert.equal(created.session.attribution.campaign_id, 'signal_test');
assert.equal(created.session.attribution.partner_id, 'partner_1');
assert.equal(created.session.attribution.landingPage, '/signal-lab/');
assert.equal(created.session.attribution.referrerHost, 'example.com');
assert.equal(JSON.stringify(created.session).includes('do-not-store'), false);
assert.equal(JSON.stringify(created.session).includes('email'), false);
assert.equal(JSON.stringify(created.session).includes('phone'), false);

let session = created.session;
let result = sessionApi.answer(session, flow, 'foundation_trigger', 'something_changed', {storage:store, now:new Date('2026-09-20T20:00:00Z')});
session = result.session;
assert.equal(session.state, 'signal_developing');
assert.equal(session.currentQuestionId, 'foundation_intent');
assert.equal(session.answers.length, 1);
assert.equal(session.canonicalSignals.statedTrigger, 'something_changed');
let d = decision.evaluate(flow, session);
assert.equal(d.decision, 'ASK_ONE_SIGNAL');
assert.equal(d.nextQuestionId, 'foundation_intent');
assert.equal(d.scoringApplied, false);
assert.equal(d.coverageFitConnected, false);

result = sessionApi.answer(session, flow, 'foundation_intent', 'open_to_review', {storage:store, now:new Date('2026-09-20T20:01:00Z')});
session = result.session;
assert.equal(session.currentQuestionId, 'foundation_timing');
assert.equal(session.answers.length, 2);
assert.equal(session.canonicalSignals.shoppingIntent, 'open_to_review');

const persisted = sessionApi.load(flow, {storage:store, now:new Date('2026-09-20T20:02:00Z')});
assert.equal(persisted.sessionId, session.sessionId);
assert.equal(persisted.answers.length, 2);

session = sessionApi.goBack(session, flow, {storage:store, now:new Date('2026-09-20T20:03:00Z')});
assert.equal(session.currentQuestionId, 'foundation_intent');
assert.equal(session.answers.length, 1);
assert.equal(session.canonicalSignals.shoppingIntent, undefined);
assert.equal(session.canonicalSignals.statedTrigger, 'something_changed');

result = sessionApi.answer(session, flow, 'foundation_intent', 'ready_now', {storage:store, now:new Date('2026-09-20T20:04:00Z')});
session = result.session;
assert.equal(session.canonicalSignals.shoppingIntent, 'ready_now');
assert.equal(session.answers.length, 2);

result = sessionApi.answer(session, flow, 'foundation_timing', 'within_30', {storage:store, now:new Date('2026-09-20T20:05:00Z')});
session = result.session;
assert.equal(session.state, 'complete');
assert.equal(session.answers.length, 3);
assert.equal(session.canonicalSignals.decisionTiming, 'within_30');
d = decision.evaluate(flow, session);
assert.equal(d.decision, 'FOUNDATION_COMPLETE');
assert.equal(d.state, 'complete');

const idBefore = session.sessionId;
const restarted = sessionApi.restart(flow, {storage:store, location:loc('?utm_source=restart'), document:{referrer:''}, now:new Date('2026-09-20T20:06:00Z')});
assert.notEqual(restarted.sessionId, idBefore);
assert.equal(restarted.answers.length, 0);
assert.equal(restarted.attribution.utm_source, 'restart');

const expired = sessionApi.create(flow, {storage:store, location:loc(), document:{referrer:''}, now:new Date('2026-01-01T00:00:00Z')});
assert.ok(expired.expiresAt);
assert.equal(sessionApi.load(flow, {storage:store, now:new Date('2026-09-20T00:00:00Z')}), null);

assert.equal(contract.EVENT_NAMES.includes('signal_session_started'), true);
assert.equal(contract.EVENT_NAMES.includes('lead_promoted'), true);
assert.equal(contract.PROHIBITED_ANONYMOUS_FIELDS.includes('email'), true);
assert.equal(contract.CANONICAL_SIGNAL_FIELDS.includes('shoppingIntent'), true);

console.log('SIGNAL-FOUNDATION-1.0 core tests passed');
