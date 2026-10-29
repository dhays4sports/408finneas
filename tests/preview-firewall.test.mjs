import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../_worker.js';
test('preview blocks production proxy endpoints before fetch or storage',async(t)=>{
 let network=0,assets=0;
 t.mock.method(globalThis,'fetch',()=>{network++;throw Error('unexpected network');});
 const env={ASSETS:{fetch:()=>{assets++;return new Response('asset');}}};
 for(const path of ['/api/lead','/api/callback/schedule','/api/local/merchant-application','/api/signal/home-contact','/api/life/application-init']){
  assert.equal((await worker.fetch(new Request('https://candidate.408farmers-v2.pages.dev'+path,{method:'POST'}),env)).status,403);
 }
 assert.equal((await worker.fetch(new Request('https://candidate.408farmers-v2.pages.dev/life/'),env)).status,403);
 assert.equal(network,0);assert.equal(assets,0);
 assert.equal((await worker.fetch(new Request('https://candidate.408farmers-v2.pages.dev/shared/condo-entry.css'),env)).status,200);assert.equal(assets,1);
});
