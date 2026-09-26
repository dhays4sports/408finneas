const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {payload}=require('../shared/distribution-launch.js');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
test('thin buyer sends bounded campaign context by POST without identity or a local engine',()=>{
  const value=payload({campaign_id:'buyer_fall',partner_id:'partner_a',utm_source:'referral',name:'Person',phone:'2025550123',email:'person@example.com',utm_content:'person@example.com'},'pvxb_abcdefghijklmnopqrstuvwx','2026-09-26T16:00:00Z');
  assert.equal(value.attribution.campaignId,'buyer_fall');assert.equal(value.attribution.partnerId,'partner_a');assert.deepEqual(value.evidence,{product:'home'});
  assert.doesNotMatch(JSON.stringify(value),/Person|2025550123|@/);
  const html=read('buyer/continue.html');assert.match(html,/method="post"/);assert.match(html,/noindex,nofollow/);assert.doesNotMatch(html,/signal-route-shell|signal-decision-local|appointment-first-intake|leadForm/);
});
test('candidate preserves active buyer, campaign references and specialized life',()=>{
  assert.match(read('buyer/index.html'),/data-appointment-flow="buyer"/);
  assert.match(read('shared/config.js'),/coverageFitDistributionUrl: "https:\/\/coveragefit.com\/api\/distribution\/entry"/);
  assert.match(read('_headers'),/form-action https:\/\/coveragefit.com/);
  assert.ok(fs.existsSync(path.join(__dirname,'..','life/index.html')));
});
