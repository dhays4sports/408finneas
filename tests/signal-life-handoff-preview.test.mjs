import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../_worker.js';
import sessionApi from '../shared/signal-session.js';
import pilot from '../signal-life-preview/core.js';
import remote from '../shared/signal-decision-remote.js';
import {deriveSignalDecision} from '../../CoverageFit/server/signal-decision-core.mjs';
const origin='https://signal-life-1-0.408farmers-v2.pages.dev';
const storage={getItem(){return null},setItem(){},removeItem(){}};
function fixture(){
 let s=sessionApi.create(pilot.FLOW,{storage,location:{pathname:'/signal-life-preview/',search:''}});
 for(const code of ['employer_only','open_to_review','within_30']){
 const q=deriveSignalDecision(remote.payload(pilot.FLOW,s)).public.nextQuestion;
 s=sessionApi.answerQuestion(s,pilot.FLOW,q,code,{storage}).session;
 }
 return {schemaVersion:'SIGNAL-LIFE-1.1',mode:'call_now',phone:'+12025550123',timePreference:'',permission:{version:'preview-permission-v1',channel:'phone',checked:true},handoff:pilot.handoff(s,'human')};
}
const env=new Proxy({}, {get(){throw Error('Preview must never access bindings or integrations');}});
async function send(body,overrides={}){
 return worker.fetch(new Request((overrides.host||origin)+'/api/signal/life-handoff-preview',{method:overrides.method||'POST',headers:{Origin:overrides.origin||origin,'Content-Type':'application/json'},...((overrides.method||'POST')==='POST'?{body:typeof body==='string'?body:JSON.stringify(body)}:{})}),env);
}
test('all contact modes preserve evidence and remain stateless; retries have stable receipt',async()=>{
 for(const mode of ['call_now','choose_time','text']){
 const b=fixture();b.mode=mode;b.permission.channel=mode==='text'?'sms':'phone';b.timePreference=mode==='choose_time'?'weekday_morning_pacific':'';
 const r=await send(b);assert.equal(r.status,200);const result=await r.json();
 assert.deepEqual(result.canonicalSignals,b.handoff.canonicalSignals);assert.equal(result.answerCount,3);
 assert.equal(result.receipt,(await(await send(b)).json()).receipt);
 for(const [key,value] of Object.entries(result.guardrails))assert.equal(value,key==='syntheticContactOnly');
 }
});
test('rejects missing permission, real contacts, PII, tampered signals, expired handoff and invalid timing',async()=>{
 const changes=[b=>b.permission.checked=false,b=>b.phone='+12025559999',b=>b.email='test@example.invalid',b=>b.handoff.canonicalSignals.name='Test',b=>b.handoff.canonicalSignals.lifeCoverageStatus='none',b=>b.handoff.answers[0].signals.phone='x',b=>b.handoff.expiresAt=new Date(0).toISOString(),b=>b.permission.channel='sms',b=>{b.mode='choose_time';},b=>b.handoff.action='automatic'];
 for(const change of changes){const b=fixture();change(b);assert.equal((await send(b)).status,400);}
});
test('exact host/origin, method and body size gates',async()=>{
 assert.equal((await send(fixture(),{host:'https://408farmers.com'})).status,404);
 assert.equal((await send(fixture(),{origin:'https://random.example'})).status,403);
 assert.equal((await send(null,{method:'GET'})).status,405);
 assert.equal((await send('{')).status,400);
 assert.equal((await send(' '.repeat(8193))).status,413);
 const r=await send(fixture());assert.equal(r.headers.get('access-control-allow-origin'),null);assert.equal(r.headers.get('access-control-allow-credentials'),null);
});
test('human override carries an empty anonymous Life session without invented answers',async()=>{
 const b=fixture();const s=sessionApi.create(pilot.FLOW,{storage});b.handoff=pilot.handoff(s,'human');
 const r=await send(b);assert.equal(r.status,200);assert.equal((await r.json()).answerCount,0);
});

test('browser Back restoration shows the restored method and resets permission',async()=>{
 const {default:vm}=await import('node:vm');const {readFileSync}=await import('node:fs');
 const events={};let selected={value:'text'};
 const nodes={ul:{appendChild(){}},'#contact-details':{hidden:true},'#time-details':{hidden:true},'#preview-permission':{checked:true},'#contact-status':{textContent:'old receipt'},button:{textContent:'Test again'},'#permission-copy':{},'#application-link':{hidden:false}};
 const form={noValidate:false,innerHTML:'',querySelector(k){return k==='input[name="mode"]:checked'?selected:nodes[k];},addEventListener(){}};
 const document={getElementById(){return {appendChild(){}};},createElement(tag){return tag==='form'?form:{textContent:''};}};
 const window={SignalLifePreview:pilot,addEventListener(name,fn){events[name]=fn;}};
 vm.runInNewContext(readFileSync(new URL('../signal-life-preview/contact/contact.js',import.meta.url),'utf8'),{document,window,sessionStorage:{getItem(){return JSON.stringify(fixture().handoff);}}});
 events.pageshow();assert.equal(nodes['#contact-details'].hidden,false);assert.equal(nodes['#preview-permission'].checked,false);assert.match(nodes['#permission-copy'].textContent,/text about/);assert.equal(nodes['#application-link'].hidden,true);
 selected={value:'choose_time'};events.pageshow();assert.equal(nodes['#time-details'].hidden,false);assert.match(nodes['#permission-copy'].textContent,/call about/);
});
