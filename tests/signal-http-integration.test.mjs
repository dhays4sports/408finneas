// Node 22.13+; place the CoverageFit checkout beside this repository or set COVERAGEFIT_REPO.
// Real loopback HTTP and SQLite, not browser or deployed Cloudflare certification.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {DatabaseSync} from 'node:sqlite';
import {createRequire} from 'node:module';
import {resolve, dirname} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {readFileSync} from 'node:fs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const cf=process.env.COVERAGEFIT_REPO||resolve(root,'../CoverageFit');
const require=createRequire(import.meta.url);
const registry=require('../shared/signal-flow-registry.js');
const sessions=require('../shared/signal-session.js');
const remote=require('../shared/signal-decision-remote.js');
const {onRequest}=await import(pathToFileURL(resolve(cf,'functions/api/signal/decision.js')));
const sql=new DatabaseSync(':memory:');
const migration=readFileSync(resolve(cf,'migrations/0001_ops_cf_1_1.sql'),'utf8');
sql.exec(migration.slice(migration.indexOf('CREATE TABLE IF NOT EXISTS api_rate_limits')));
// D1 API adapter over real SQLite; no production binding or business tables exist.
const db={prepare(query){return {bind(...values){const stmt=sql.prepare(query);const args=Object.fromEntries(values.map((v,i)=>[String(i+1),v]));return {async run(){return stmt.run(args);},async first(){return stmt.get(args);}};}};}};
const origin='http://127.0.0.1:18765';
const env={CF_SIGNAL_ALLOWED_ORIGINS:origin,COVERAGEFIT_DB:db};
const pending=[];
let address='integration';
const server=createServer(async(req,res)=>{
  try {
    const chunks=[];for await(const chunk of req)chunks.push(chunk);
    const body=Buffer.concat(chunks);
    const request=new Request('http://127.0.0.1'+req.url,{method:req.method,headers:{...req.headers,'CF-Connecting-IP':address},...(body.length?{body}: {})});
    const response=await onRequest({request,env,waitUntil:p=>pending.push(p)});
    res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
  }catch(error){res.writeHead(500);res.end(String(error));}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const endpoint=`http://127.0.0.1:${server.address().port}/api/signal/decision`;
const nativeFetch=globalThis.fetch;
// Node does not synthesize Origin as a browser does. Add the exact test Origin.
globalThis.fetch=(url,opts)=>nativeFetch(url,{...opts,headers:{...opts.headers,Origin:origin}});
const flow={...registry.get('foundation_demo'),id:'foundation_demo_remote'};
class Storage {constructor(){this.map=new Map();}getItem(k){return this.map.get(k)||null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
const store=new Storage();
const fresh=()=>sessions.create(flow,{storage:store,location:{pathname:'/signal-lab/',search:''}});
const evaluate=s=>remote.evaluate(flow,s,{endpoint});
async function step(s,code){const d=await evaluate(s);assert.equal(d.decision,'ASK_ONE_SIGNAL');assert.ok(d.nextQuestion.options.some(o=>o.code===code),`${d.nextQuestionId}: missing ${code}`);return sessions.answerQuestion(s,flow,d.nextQuestion,code,{storage:store}).session;}
async function adaptive(codes){let s=fresh();const remaining=[...codes];while(remaining.length){const d=await evaluate(s);assert.equal(d.decision,'ASK_ONE_SIGNAL');const i=remaining.findIndex(c=>d.nextQuestion.options.some(o=>o.code===c));assert.ok(i>=0,`No answer for ${d.nextQuestionId}`);s=await step(s,remaining.splice(i,1)[0]);}return s;}
async function path(codes,expected){const s=await adaptive(codes);const d=await evaluate(s);assert.equal(d.decision,expected);return {s,d};}
const post=(body,headers={})=>nativeFetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Origin:origin,...headers},body:JSON.stringify(body)});
try {
  assert.equal((await evaluate(fresh())).nextQuestionId,'signal_product');
  const life=await path(['life','employer_only','open_to_review','within_30'],'OFFER_HUMAN');
  const response=await post(remote.payload(flow,life.s));const publicResult=await response.json();
  assert.equal(publicResult.state,'qualified_signal');assert.equal(publicResult.engine,'CF-SIGNAL-DECISION-1.0');assert.equal(publicResult.priorityEngine,'CF-OPPORTUNITY-PRIORITY-1.0');
  for(const k of ['persisted','leadCreated','opportunityCreated','contactPermissionGranted','consumerScoreExposed'])assert.equal(publicResult.guardrails[k],false);
  const forbidden=new Set(['score','scoreMin','scoreMax','queue','queueLabel','dimensions','internal','reasons']);
  function scan(value){if(value&&typeof value==='object')for(const [key,v] of Object.entries(value)){assert.equal(forbidden.has(key),false,key);scan(v);}}
  scan(publicResult);
  assert.equal(response.headers.get('access-control-allow-origin'),origin);assert.equal(response.headers.get('access-control-allow-credentials'),null);
  console.log('PASS Life HTTP happy path, public response and guardrails');
  let s=await step(await step(fresh(),'life'),'employer_only');
  s=sessions.load(flow,{storage:store});assert.equal(s.canonicalSignals.product,'life');assert.equal(s.canonicalSignals.lifeCoverageStatus,'employer_only');assert.equal((await evaluate(s)).nextQuestionId,'life_shopping_intent');
  s=await step(s,'open_to_review');assert.equal((await evaluate(s)).nextQuestionId,'life_decision_timing');
  s=sessions.goBack(s,flow,{storage:store});assert.equal(s.canonicalSignals.shoppingIntent,undefined);assert.equal(s.canonicalSignals.decisionTiming,undefined);assert.equal((await evaluate(s)).nextQuestionId,'life_shopping_intent');
  s=await step(s,'not_interested');assert.equal((await evaluate(s)).decision,'CONTINUE_LATER');
  assert.equal(sessions.load(registry.get('foundation_demo'),{storage:store}),null);
  console.log('PASS session reload, Back, changed evidence, low intent and local/remote isolation');
  // Canonical engine routes weak research immediately; it need not ask timing.
  await path(['life','none','researching'],'OFFER_LEARN');
  let personal=fresh();for(const c of ['life','yes_personal','open_to_review','within_30'])personal=await step(personal,c);
  assert.equal((await evaluate(personal)).nextQuestionId,'life_protection_goal');assert.equal(personal.canonicalSignals.lifeCoverageStatus,'yes_personal');
  await path(['home','nonrenewal_notice','ready_now','within_14'],'OFFER_HUMAN');
  await path(['auto','new_vehicle','open_to_review','days_31_60'],'OFFER_HUMAN');
  await path(['auto','need_now','ready_now','now'],'OFFER_HUMAN');
  let business=await adaptive(['business','coi','ready_now','now']);
  assert.equal((await evaluate(business)).nextQuestionId,'business_type');business=await step(business,'contractor');assert.equal((await evaluate(business)).decision,'OFFER_HUMAN');
  console.log('PASS weak/existing Life, Home, both Auto paths and mandatory business type');
  const before=JSON.stringify(sessions.load(flow,{storage:store}));env.CF_SIGNAL_ALLOWED_ORIGINS='https://unauthorized.example';
  await assert.rejects(()=>evaluate(business),e=>e.status===403);assert.equal(JSON.stringify(sessions.load(flow,{storage:store})),before);
  env.CF_SIGNAL_ALLOWED_ORIGINS=origin;assert.equal((await evaluate(business)).decision,'OFFER_HUMAN');
  assert.equal((await post(remote.payload(flow,business),{Origin:'https://random.example'})).status,403);
  assert.equal((await post(remote.payload(flow,business),{Origin:'http://127.0.0.1:18766'})).status,403);
  const preflight=await nativeFetch(endpoint,{method:'OPTIONS',headers:{Origin:origin,'Access-Control-Request-Method':'POST'}});assert.equal(preflight.status,204);
  delete env.COVERAGEFIT_DB;assert.equal((await post(remote.payload(flow,business))).status,503);env.COVERAGEFIT_DB=db;
  for(const field of ['name','phone','email','dob','ssn','health','vin','address']){const r=await post({...remote.payload(flow,business),[field]:'synthetic'});assert.ok(r.status>=400,field);}
  console.log('PASS real HTTP failure/retry, preserved answers, exact CORS, preflight and fail-closed missing DB');
  address='rate-limit-only';for(let i=0;i<90;i++)assert.equal((await post(remote.payload(flow,business))).status,200);
  assert.equal((await post(remote.payload(flow,business))).status,429);
  await Promise.all(pending);
  assert.deepEqual(sql.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(r=>r.name),['api_rate_limits']);
  console.log('PASS rate limit and minimal SQLite schema; no business tables or external business services');
  console.log(JSON.stringify({publicLifeResponse:publicResult},null,2));
} finally {globalThis.fetch=nativeFetch;await new Promise(resolve=>server.close(resolve));sql.close();}
