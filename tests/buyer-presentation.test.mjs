import test from 'node:test';
import assert from 'node:assert/strict';
import {entryInput,renderEntry} from '../../CoverageFit/server/entry-presentation.mjs';
import {buyerPresentation} from '../server/buyer-presentation.mjs';
import {entryPage} from '../server/entry-presentation-proxy.mjs';
test('buyer presentation preserves canonical payload and semantic first question',()=>{
 const input=entryInput(new URL('https://coveragefit.com/?entry=buyer'));const before=renderEntry(input);const after=buyerPresentation(before);
 assert.equal(after.match(/id="entry-data">(.*?)<\/script>/s)[1],before.match(/id="entry-data">(.*?)<\/script>/s)[1]);
 for(const word of ['closing_coverage','compare_purchase','understand_coverage','planning','farmers-insurance-official.svg','dylan-headshot-160.webp','#4528400'])assert.ok(after.includes(word));
 assert.match(after,/Help with an existing review or appointment/);assert.doesNotMatch(after,/href="\/buyer\/legacy.html"/);assert.equal(buyerPresentation('<html>unknown</html>'),'<html>unknown</html>');
});
test('buyer proxy permits reused assets, drops stale entity headers and retains only accepted attribution',async()=>{
 let target;const fetch=async(url)=>{target=new URL(url);return new Response(renderEntry(entryInput(target)),{headers:{ETag:'old','Content-Length':'123'}})};
 const r=await entryPage(new Request('https://408farmers.com/buyer/?utm_source=instagram&utm_medium=paid_social&utm_campaign=buyer_qa&phone=2025550123&fbclid=untrusted'),{entry:'buyer'},{fetch});
 assert.equal(r.status,200);assert.match(r.headers.get('content-security-policy'),/img-src 'self'/);assert.equal(r.headers.get('etag'),null);assert.equal(r.headers.get('content-length'),null);
 assert.equal(target.searchParams.get('utm_campaign'),'buyer_qa');assert.equal(target.searchParams.has('phone'),false);assert.equal(target.searchParams.has('fbclid'),false);
});
