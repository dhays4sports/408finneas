const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const routes=require('../shared/signal-route-registry.js');
const sessions=require('../shared/signal-session.js');
const remote=require('../shared/signal-decision-remote.js');
(async()=>{
 const {deriveSignalDecision}=await import('../../CoverageFit/server/signal-decision-core.mjs');
 const data=new Map(),storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
 let paths=0;
 for(const r of routes.routes){
  const flow=routes.flow(r.id),location={pathname:r.previewPath,search:''};
  const seed=sessions.create(flow,{storage,location});
  assert.equal(seed.canonicalSignals.product,r.product);
  assert.equal(seed.canonicalSignals.professionalProgram,undefined);
  assert.equal(seed.canonicalSignals.propertyType,undefined);
  const evaluate=s=>deriveSignalDecision(remote.payload(flow,s)).public;
  const initial=evaluate(seed);assert.equal(initial.decision,'ASK_ONE_SIGNAL');
  for(const option of initial.nextQuestion.options){
   let s=sessions.answerQuestion(seed,flow,initial.nextQuestion,option.code,{storage}).session;
   assert.equal(s.answers.length,1);
   const back=sessions.goBack(s,flow,{storage});assert.deepEqual(back.canonicalSignals,seed.canonicalSignals);
   let d=evaluate(s),depth=1;
   while(d.decision==='ASK_ONE_SIGNAL'&&depth<16){
    s=sessions.answerQuestion(s,flow,d.nextQuestion,d.nextQuestion.options[0].code,{storage}).session;
    d=evaluate(s);depth++;
   }
   assert.notEqual(d.decision,'ASK_ONE_SIGNAL',r.id+' must terminate');
   assert.ok(['OFFER_HUMAN','OFFER_LEARN','CONTINUE_LATER'].includes(d.decision));paths++;
  }
  const page=fs.readFileSync(__dirname+'/..'+r.previewPath+'index.html','utf8');
  assert.match(page,/data-signal-route=/);assert.doesNotMatch(page,/<input|<form|signal-decision-local/);
 }
 assert.equal(new Set(routes.routes.map(r=>routes.flow(r.id).id)).size,routes.routes.length);
 assert.throws(()=>routes.get('arbitrary'));
 data.clear();
 const source=fs.readFileSync(__dirname+'/../shared/signal-route-shell.js','utf8');
 let handler,html='',calls=0;
 const box={dataset:{signalRoute:'home'},setAttribute(){},removeAttribute(){},querySelector(){return {focus(){}}},addEventListener(_,fn){handler=fn},set innerHTML(v){html=v},get innerHTML(){return html}};
 const document={querySelector:()=>box,referrer:''},location={pathname:'/signal-preview/home/',search:''};
 const api={...sessions,loadOrCreate:(f,o)=>sessions.loadOrCreate(f,{...o,storage}),save:(s,f)=>sessions.save(s,f,{storage})};
 vm.runInNewContext(source,{window:{Farmers408SignalSession:api,Farmers408SignalRoutes:routes,Farmers408SignalDecisionRemote:{evaluate:async()=>{calls++;throw Error('offline')}}},document,location,history:{replaceState(){}},URLSearchParams});
 await new Promise(r=>setImmediate(r));assert.match(html,/could not load/);assert.equal(calls,1);
 handler({target:{closest:()=>({dataset:{action:'human'}})}});assert.match(html,/no callback or appointment has been requested/);assert.equal(calls,1);
 handler({target:{closest:()=>({dataset:{action:'retry'}})}});await new Promise(r=>setImmediate(r));assert.equal(calls,2);
 assert.doesNotMatch(source,/signal-decision-local|fetch\(|XMLHttpRequest|sendBeacon/);
 console.log('PASS '+routes.routes.length+' routes, '+paths+' engine paths, Back, isolation, privacy, terminal decisions, offline/retry and non-delivering human preview');
})().catch(e=>{console.error(e);process.exitCode=1});
