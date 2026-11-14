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
for(const route of ['tech','healthcare','engineers','teachers','home','buyer','condo','home_qr','condo_qr'])test(route+' contact-first uses canonical proxy and explicit permission once',async()=>{
 const f=fixture();let cookie='';try{
 const entry=route.replace('_qr',''),qr=route.endsWith('_qr');
 const upstream=async(url,init)=>{const r=new Request(url,init);if(url.includes('/presentation?')){const handoff=entryInput(new URL(url),new Date(now));return new Response(renderEntry(handoff,distributionPresentation(handoff,new Date(now))),{headers:{'Content-Type':'text/html'}})}return distributionInteract(r,f)};
 const response=await entryPage(new Request(`https://408farmers.com/${entry}/${qr?'qr/95128/review/':''}?utm_source=instagram&utm_medium=paid_social&utm_campaign=direct_qa`),{entry,...(qr?{market:'95128',campaign:'review'}:{})},{fetch:upstream});const html=await response.text();assert.match(html,/Prefer to talk\? Have Dylan contact me\./);const boot=JSON.parse(html.match(/id="entry-data">([\s\S]*?)<\/script>/)[1]);assert.equal(boot.state.directContact,true);
 let state=boot.state;const post=async body=>{const r=await entryAction(new Request('https://408farmers.com/api/entry/interact',{method:'POST',headers:{Origin:'https://408farmers.com','Content-Type':'application/json',Cookie:cookie},body:JSON.stringify({...body,...(state.reviewVersion?{reviewVersion:state.reviewVersion}:{})})}),{fetch:upstream});if(r.headers.has('set-cookie'))cookie=r.headers.get('set-cookie').split(';')[0];return r};
 let r=await post({action:'open_contact',handoff:boot.handoff});assert.equal(r.status,200);state=await r.json();assert.equal(state.showContact,true);assert.equal(state.canBack,false);assert.equal(f.sql.prepare('SELECT count(*) n FROM cf_solo_opportunities').get().n,0);
 r=await post({action:'contact',revision:state.revision,name:'Synthetic Direct Frontend',phone:'2025550123',mode:'call',permission:true});assert.equal(r.status,200);state=await r.json();assert.equal(state.contactSubmitted,true);
 const stored=JSON.parse(f.sql.prepare("SELECT summary_json FROM cf_solo_sources WHERE kind='lead'").get().summary_json);assert.equal(stored.context.distribution.contactEntry.stage,'opening');assert.equal(stored.context.distribution.contactEntry.answeredCount,0);assert.equal(stored.permission.callPermitted,true);assert.equal(stored.permission.personalTextPermitted,false);assert.equal(f.sql.prepare('SELECT count(*) n FROM cf_solo_opportunities').get().n,1);
 }finally{f.sql.close()}
});
