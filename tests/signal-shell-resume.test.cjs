const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const contract=require('../shared/signal-contract.js');
const registry=require('../shared/signal-flow-registry.js');
const sessions=require('../shared/signal-session.js');
const source=fs.readFileSync(require.resolve('../shared/signal-shell.js'),'utf8');
const data=new Map();
const storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
let url=new URL('https://preview.example/signal-lab/?decision=remote&fresh=1&utm_source=qa#resume');
function mount(){
  const container={innerHTML:'',getAttribute:k=>k==='data-signal-flow'?'foundation_demo':null,querySelector:()=>null,addEventListener:()=>{}};
  const document={readyState:'loading',referrer:'',querySelector:()=>container,addEventListener:()=>{}};
  const api={...sessions,loadOrCreate:(flow,opts)=>sessions.loadOrCreate(flow,{...opts,storage}),save:(s,flow)=>sessions.save(s,flow,{storage})};
  const window={document,location:url,history:{state:null,replaceState:(_,__,value)=>{url=new URL(value,url);}},Farmers408SignalContract:contract,Farmers408SignalFlowRegistry:registry,Farmers408SignalSession:api,Farmers408SignalAnalytics:{emit:()=>{}},Farmers408SignalDecisionLocal:{},Farmers408SignalDecisionRemote:{evaluate:()=>new Promise(()=>{})}};
  vm.runInNewContext(source,{window,URLSearchParams});
  const shell=window.Farmers408SignalShell.install();return {shell,container};
}
const first=mount();assert.equal(url.searchParams.has('fresh'),false);assert.equal(url.searchParams.get('decision'),'remote');assert.equal(url.searchParams.get('utm_source'),'qa');assert.equal(url.hash,'#resume');
let s=first.shell.getSession();
for(const [id,field,code] of [['signal_product','product','life'],['life_coverage_status','lifeCoverageStatus','employer_only']]){
  s=sessions.answerQuestion(s,first.shell.flow,{id,dimension:field==='product'?'product':'need',prompt:'Test question',canonicalField:field,options:[{code,label:code,signals:{[field]:code}}]},code,{storage}).session;
}
const second=mount();assert.match(second.container.innerHTML,/Continue where you left off/);assert.equal(second.shell.getSession().sessionId,s.sessionId);assert.equal(second.shell.getSession().canonicalSignals.lifeCoverageStatus,'employer_only');
console.log('PASS shell fresh URL consumption and refresh/resume control flow (VM DOM stub, not browser QA)');
