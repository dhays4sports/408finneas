import test from 'node:test';
import assert from 'node:assert/strict';
import {entryInput,renderEntry} from '../../CoverageFit/server/entry-presentation.mjs';
import {condoPresentation} from '../server/condo-presentation.mjs';
import {entryPage} from '../server/entry-presentation-proxy.mjs';
test('condo shares buyer shell with agency primary and canonical questionnaire intact',()=>{
 const before=renderEntry(entryInput(new URL('https://coveragefit.com/?entry=condo'))),after=condoPresentation(before);
 assert.equal(after.match(/id="entry-data">(.*?)<\/script>/s)[1],before.match(/id="entry-data">(.*?)<\/script>/s)[1]);
 for(const word of ['What brings you here for condo insurance?','Let’s review the coverage your condo may need.','farmers-insurance-official.svg','dylan-headshot-160.webp','Virginia Tam','Insurance Advisor','#4528400','CONDO-1.0'])assert.ok(after.includes(word),word);
 assert.doesNotMatch(after,/>408<span>FARMERS/);assert.doesNotMatch(after,/href="\/condo\/legacy.html"/);assert.match(after,/original confirmation link/);assert.equal(condoPresentation('unknown'),'unknown');
});
test('condo proxy allows only same-origin approved assets and preserves safe source parameters',async()=>{
 let target;const fetch=async(url)=>{target=new URL(url);return new Response(renderEntry(entryInput(target)),{headers:{ETag:'old','Content-Length':'123'}})};
 const r=await entryPage(new Request('https://408farmers.com/condo/?utm_campaign=condo_qa&phone=2025550123'),{entry:'condo'},{fetch});
 assert.equal(r.status,200);assert.match(r.headers.get('content-security-policy'),/img-src 'self'/);assert.equal(r.headers.get('etag'),null);assert.equal(r.headers.get('content-length'),null);assert.equal(target.searchParams.get('utm_campaign'),'condo_qa');assert.equal(target.searchParams.has('phone'),false);assert.match(await r.text(),/condo-entry/);
});
