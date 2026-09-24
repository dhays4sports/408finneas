const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const contract = require('../shared/signal-contract.js');
const source = fs.readFileSync(__dirname+'/../shared/signal-decision-remote.js','utf8');
function client(config){const window={Farmers408SignalContract:contract,LANDING_PAGE_CONFIG:config,location:{origin:'https://408farmers.com'}};vm.runInNewContext(source,{window,URL});return window.Farmers408SignalDecisionRemote;}
test('endpoint resolution: production default, configured override, explicit test override',()=>{
 assert.equal(client().endpoint(),'https://coveragefit.com/api/signal/decision');
 const c=client({coverageFitSignalDecisionUrl:'https://configured.example/api/decision'});
 assert.equal(c.endpoint(),'https://configured.example/api/decision');
 assert.equal(c.endpoint({endpoint:'https://test.example/api/decision'}),'https://test.example/api/decision');
 const window={};vm.runInNewContext(fs.readFileSync(__dirname+'/../shared/config.js','utf8'),{window});
 assert.equal(client(window.LANDING_PAGE_CONFIG).endpoint(),'https://coveragefit.com/api/signal/decision');
});
test('unsafe protocols rejected; explicit loopback test endpoint supported',()=>{
 for(const endpoint of ['http://external.example/api','javascript:alert(1)','https://[invalid'])assert.throws(()=>client().endpoint({endpoint}));
 assert.equal(client().endpoint({endpoint:'http://127.0.0.1:18765/api'}),'http://127.0.0.1:18765/api');
 assert.throws(()=>client().endpoint({endpoint:'http://localhost.attacker.example/api'}));
});
test('registry owns routes only; both shells delegate transport and load shared config first',()=>{
 const routes=require('../shared/signal-route-registry.js');assert.equal(routes.endpoint,undefined);
 assert.doesNotMatch(fs.readFileSync(__dirname+'/../shared/signal-route-registry.js','utf8'),/https?:|endpoint/i);
 for(const f of ['shared/signal-route-shell.js','signal-life-preview/pilot.js']){
  const s=fs.readFileSync(__dirname+'/../'+f,'utf8');assert.match(s,/remote.evaluate\(flow,session\)/);assert.doesNotMatch(s,/pages\.dev|registry\.endpoint|endpoint:/);
 }
 for(const path of [...routes.routes.map(r=>r.previewPath),' /signal-life-preview/'.trim()]){
  const html=fs.readFileSync(__dirname+'/..'+path+'index.html','utf8');
  assert.ok(html.indexOf('/shared/config.js')>=0);assert.ok(html.indexOf('/shared/config.js')<html.indexOf('/shared/signal-decision-remote.js'));
 }
});
test('Signal CSP permits exact production authority without wildcard or obsolete preview origin',()=>{
 const blocks=Object.fromEntries(fs.readFileSync(__dirname+'/../_headers','utf8').trim().split(/\n\s*\n/).map(b=>{const [p,...lines]=b.split('\n');return [p,lines.join('\n')]}));
 for(const p of ['/signal-preview/*','/signal-life-preview/*','/signal-lab/*']){
  assert.match(blocks[p],/connect-src 'self' https:\/\/coveragefit\.com;/);assert.doesNotMatch(blocks[p],/pages\.dev|connect-src[^;]*\*/);assert.match(blocks[p],/noindex/);
 }
});
