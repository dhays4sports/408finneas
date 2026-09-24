import test from 'node:test';import assert from 'node:assert/strict';import {handleHomeContact} from '../server/signal-home-proxy.mjs';
const origin='https://408farmers.test',secret='synthetic-test-secret-not-a-real-credential';
const req=(o=origin)=>new Request(origin+'/api/signal/home-contact',{method:'POST',headers:{origin:o,'content-type':'application/json'},body:'{}'});
test('proxy fails closed on missing configuration, cross-origin and upstream false success',async()=>{
 assert.equal((await handleHomeContact(req(),{})).status,503);
 assert.equal((await handleHomeContact(req('https://other.test'),{})).status,403);
 const env={SIGNAL_HOME_HANDOFF_URL:'https://coveragefit.com/api/signal/home-handoff',COVERAGEFIT_LEAD_SYNC_SECRET:secret};
 assert.equal((await handleHomeContact(req(),{...env,SIGNAL_HOME_HANDOFF_URL:'https://obsolete.example/api/signal/home-handoff'})).status,503);
 assert.equal((await handleHomeContact(req(),env,async()=>Response.json({ok:true,durable:true}))).status,503);
 const r=await handleHomeContact(req(),env,async(url,o)=>{assert.equal(o.redirect,'error');assert.match(o.headers['X-CoverageFit-Signature'],/^[a-f0-9]{64}$/);return Response.json({ok:true,durable:true,operatorVisible:true,receipt:'test-receipt'});});
 assert.deepEqual(await r.json(),{ok:true,receipt:'test-receipt',booked:false});
});
