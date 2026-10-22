import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {deriveSignalDecision} from '../../CoverageFit/server/signal-decision-core.mjs';
import {entryInput,renderEntry} from '../../CoverageFit/server/entry-presentation.mjs';
import {normalizeDistribution} from '../../CoverageFit/server/distribution-contract.mjs';
import {distributionEntry,distributionJourney,distributionInteract,distributionEvent,distributionPresentation} from '../../CoverageFit/server/distribution-journey.mjs';
import {createPVXRecordStore} from '../../CoverageFit/server/d1-json-store.mjs';
const now='2026-09-26T16:00:00.000Z';
const input=()=>({version:'coveragefit-distribution-v1',entry:'buyer',bootstrapId:'pvxb_abcdefghijklmnopqrstuvwx',occurredAt:now,attribution:{campaignId:'buyer_fall',campaignVariant:'a',partnerId:'partner_alpha'},evidence:{product:'home',reviewReason:'buying_home'},knownContext:{housing:'buyer',bundleInterest:'yes'},contactChoice:'text'});
function fixture(){
  const sql=new DatabaseSync(':memory:');
  for(const f of readdirSync(new URL('../../CoverageFit/migrations/',import.meta.url)).filter(f=>f.endsWith('.sql')).sort())sql.exec(readFileSync(new URL('../../CoverageFit/migrations/'+f,import.meta.url),'utf8'));
  const db={prepare(q){let args=[];const s={bind(...v){args=v;return s},async first(){return sql.prepare(q).get(...args)||null},async all(){return {results:sql.prepare(q).all(...args)}},async run(){return {meta:sql.prepare(q).run(...args)}}};return s},async batch(stmts){sql.exec('BEGIN');try{const out=[];for(const s of stmts)out.push(await s.run());sql.exec('COMMIT');return out;}catch(e){sql.exec('ROLLBACK');throw e}}};
  return {sql,db,store:createPVXRecordStore(db),env:{},now};
}
const req=(path,body,cookie='',origin='https://coveragefit.com')=>new Request('https://coveragefit.com/api/distribution/'+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',Cookie:cookie},body:JSON.stringify(body)});
async function start(f,payload=input()){
  const response=await distributionEntry(req('entry',payload,'','https://408farmers.com'),f);assert.equal(response.status,303,await response.clone().text());
  const cookie=response.headers.get('set-cookie').split(';')[0];
  const post=body=>distributionJourney(req('journey',body,cookie),f);
  return {cookie,post,state:await (await post({action:'load'})).json(),response};
}

import {entryPage,entryAction} from '../server/entry-presentation-proxy.mjs';
for(const entry of ['tech','healthcare','engineers','teachers'])for(const product of ['home','auto','life','commercial'])test(`${entry}/${product}: adapter → canonical journey → durable producer receipt`,async()=>{
 const f=fixture();let cookie='';
 try{
  const upstream=async(url,init)=>{const r=new Request(url,init);if(url.includes('/presentation?')){const handoff=entryInput(new URL(url),new Date(now));return new Response(renderEntry(handoff,distributionPresentation(handoff,new Date(now))),{headers:{'Content-Type':'text/html'}});}return distributionInteract(r,f);};
  const page=await entryPage(new Request(`https://408farmers.com/${entry}/?utm_source=instagram&utm_medium=paid_social&utm_campaign=professional_test&email=private@example.com`),{entry},{fetch:upstream});const html=await page.text();const boot=JSON.parse(html.match(/id="entry-data">([\s\S]*?)<\/script>/)[1]);
  assert.equal(boot.handoff.entry,entry);assert.equal(boot.handoff.attribution.utmCampaign,'professional_test');assert.doesNotMatch(html,/private@example.com/);
  const post=async body=>{const result=await entryAction(new Request('https://408farmers.com/api/entry/interact',{method:'POST',headers:{Origin:'https://408farmers.com','Content-Type':'application/json',Cookie:cookie},body:JSON.stringify(body)}),{fetch:upstream});if(result.headers.has('set-cookie'))cookie=result.headers.get('set-cookie').split(';')[0];return result};
  const code=boot.state.question.options.find(o=>o.code===product)?.code || (product==='commercial'?boot.state.question.options.find(o=>/Business/.test(o.label))?.code:null);assert.ok(code);
  let response=await post({action:'start',handoff:boot.handoff,questionId:boot.state.question.id,code});assert.equal(response.status,200);let state=await response.json();
  response=await post({action:'back',revision:state.revision});assert.equal(response.status,200);state=await response.json();assert.equal(state.question.id,boot.state.question.id);
  response=await post({action:'answer',revision:state.revision,questionId:state.question.id,code:'invalid_option'});assert.equal(response.status,422);
  state=await (await post({action:'answer',revision:state.revision,questionId:state.question.id,code})).json();
  let steps=0;while(state.question&&steps++<12){state=await(await post({action:'answer',revision:state.revision,questionId:state.question.id,code:state.question.options[0].code})).json();assert.equal(state.ok,true)}assert.equal(state.question,null);
  const contact={action:'contact',revision:state.revision,name:'Synthetic Professional',phone:'2025550123',mode:'call',permission:true};assert.equal((await post({...contact,permission:false})).status,422);assert.equal((await post({...contact,phone:'bad'})).status,422);
  response=await post(contact);assert.equal(response.status,200);state=await response.json();assert.equal(state.contactSubmitted,true);assert.match(state.message,/reached Dylan/);
  assert.equal((await post(contact)).status,200);assert.equal(f.sql.prepare('SELECT count(*) n FROM cf_solo_opportunities').get().n,1);
  const source=JSON.parse(f.sql.prepare("SELECT summary_json FROM cf_solo_sources WHERE kind='lead'").get().summary_json);
  assert.equal(source.attribution.audience,entry);assert.equal(source.attribution.sourceFamily,'paid_social');assert.equal(source.attribution.utm.campaign,'professional_test');assert.equal(source.attribution.landingPage,`/${entry}/`);assert.equal(source.context.distribution.firstTouch.utmCampaign,'professional_test');assert.equal(source.permission.callPermitted,true);assert.equal(f.sql.prepare("SELECT count(*) n FROM sms_conversations").get().n,0);
 }finally{f.sql.close()}
});
