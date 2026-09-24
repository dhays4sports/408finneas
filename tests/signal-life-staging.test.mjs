import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import worker from '../_worker.js';
const origin='https://signal-life-1-0.408farmers-v2.pages.dev';
const migration=readFileSync(new URL('../migrations/signal-preview/0001_handoff_staging.sql',import.meta.url),'utf8');
function fixture(){const at=new Date().toISOString();const answers=[['life_coverage_status','lifeCoverageStatus','employer_only'],['life_shopping_intent','shoppingIntent','open_to_review'],['life_decision_timing','decisionTiming','within_30']].map(([questionId,field,code])=>({questionId,questionVersion:'1.0',optionCode:code,signals:{[field]:code},answeredAt:at}));return {schemaVersion:'SIGNAL-LIFE-1.2',mode:'call_now',phone:'+12025550123',timePreference:'',permission:{version:'preview-permission-v1',channel:'phone',checked:true},handoff:{schemaVersion:'1.0',previewOnly:true,signalSessionId:crypto.randomUUID(),canonicalSignals:{product:'life',lifeCoverageStatus:'employer_only',shoppingIntent:'open_to_review',decisionTiming:'within_30'},answers,action:'human',contactPermissionGranted:false,createdAt:at,expiresAt:new Date(Date.parse(at)+1800000).toISOString()}};}
function adapter(sql,hook=()=>{}){return {prepare(query){return {bind(...args){return {async run(){const result=sql.prepare(query).run(...args);hook(query);return result;},async first(){return sql.prepare(query).get(...args);}};},async first(){return sql.prepare(query).get();}};}};}
function database(){const sql=new DatabaseSync(':memory:');sql.exec(migration);return sql;}
async function request(body,db,overrides={}){return worker.fetch(new Request((overrides.host||origin)+'/api/signal/life-handoff-staging',{method:'POST',headers:{Origin:overrides.origin||origin,'Content-Type':'application/json'},body:JSON.stringify(body)}),{SIGNAL_HANDOFF_PREVIEW_DB:db});}
test('durable row survives reopen, preserving answers and scoped permission atomically',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'signal12-')),file=join(dir,'test.sqlite');let sql=new DatabaseSync(file);sql.exec(migration);
 try{const b=fixture();const r=await request(b,adapter(sql));assert.equal(r.status,200);const result=await r.json();assert.equal(result.status,'staging_recorded');sql.close();sql=new DatabaseSync(file);
 const row=sql.prepare('SELECT * FROM signal_handoff_staging').get();assert.deepEqual(JSON.parse(row.answers_json),b.handoff.answers);assert.deepEqual(JSON.parse(row.canonical_signals_json),b.handoff.canonicalSignals);
 const permission=JSON.parse(row.permission_evidence_json);assert.equal(permission.scope,'simulation_only');assert.equal(permission.checked,true);assert.equal(permission.contactPermissionGranted,false);assert.equal(row.delivery_state,'disabled');assert.equal(row.expires_at-row.created_at,7*86400000);assert.equal(result.guardrails.messageSent,false);
 }finally{sql.close();rmSync(dir,{recursive:true,force:true});}
});
test('concurrent duplicates create one immutable row; lost acknowledgement retries recover',async()=>{
 const sql=database(),b=fixture();let lost=false;const db=adapter(sql,q=>{if(q.startsWith('INSERT')&&!lost){lost=true;throw Error('acknowledgement lost after committed insert');}});
 assert.equal((await request(b,db)).status,503);
 const before=sql.prepare('SELECT * FROM signal_handoff_staging').get();
 const results=await Promise.all(Array.from({length:20},()=>request(b,adapter(sql)).then(r=>r.json())));
 assert.equal(new Set(results.map(r=>r.receipt)).size,1);assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM signal_handoff_staging').get().n,1);assert.deepEqual(sql.prepare('SELECT * FROM signal_handoff_staging').get(),before);sql.close();
});
test('mode, time and evidence changes create distinct requests',async()=>{
 const sql=database(),db=adapter(sql),b=fixture();await request(b,db);
 b.mode='text';b.permission.channel='sms';assert.equal((await request(b,db)).status,200);
 b.mode='choose_time';b.permission.channel='phone';b.timePreference='weekday_morning_pacific';assert.equal((await request(b,db)).status,200);
 b.timePreference='weekday_afternoon_pacific';assert.equal((await request(b,db)).status,200);
 assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM signal_handoff_staging').get().n,4);sql.close();
});
test('missing/unverified DB fails closed; validation rejects before any database access',async()=>{
 assert.equal((await request(fixture(),undefined)).status,503);
 const sql=new DatabaseSync(':memory:');assert.equal((await request(fixture(),adapter(sql))).status,503);assert.equal(sql.prepare("SELECT COUNT(*) AS n FROM sqlite_master WHERE type='table'").get().n,0);sql.close();
 const forbidden={prepare(){throw Error('should not access database');}};
 for(const change of [b=>b.permission.checked=false,b=>b.phone='+12025559999',b=>b.handoff.canonicalSignals.name='Test',b=>b.handoff.answers[0].optionCode='none']){const b=fixture();change(b);assert.equal((await request(b,forbidden)).status,400);}
 assert.equal((await request(fixture(),forbidden,{origin:'https://other.example'})).status,403);assert.equal((await request(fixture(),forbidden,{host:'https://408farmers.com'})).status,404);
});
test('expiry pruning, bounded staging capacity, and no mutation of original receipt on retry',async()=>{
 const sql=database(),db=adapter(sql),b=fixture();await request(b,db);const row=sql.prepare('SELECT request_id FROM signal_handoff_staging').get();sql.prepare('UPDATE signal_handoff_staging SET created_at=1,expires_at=2 WHERE request_id=?').run(row.request_id);
 const fresh=fixture();await request(fresh,db);assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM signal_handoff_staging').get().n,1);
 sql.exec(`WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM n WHERE x<4999)
 INSERT INTO signal_handoff_staging SELECT 'capacity-'||n.x,schema_version,signal_session_id,contact_mode,synthetic_phone,time_preference,canonical_signals_json,answers_json,permission_evidence_json,source_origin,status,delivery_state,created_at,expires_at FROM signal_handoff_staging CROSS JOIN n`);
 assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM signal_handoff_staging').get().n,5000);
 assert.equal((await request(fixture(),db)).status,503);assert.equal((await request(fresh,db)).status,200);sql.close();
});
