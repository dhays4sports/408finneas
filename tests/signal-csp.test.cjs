const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const headers=fs.readFileSync(path.join(__dirname,'../_headers'),'utf8');
const blocks=Object.fromEntries(headers.trim().split(/\n\s*\n/).map(block=>{const [route,...lines]=block.split('\n');return [route,lines.join('\n')];}));
const lab=blocks['/signal-lab/*'];
assert.ok(lab,'dedicated lab policy exists');
assert.match(lab,/connect-src 'self' https:\/\/coveragefit\.com;/);
assert.match(lab,/form-action 'none'/);
assert.match(lab,/Cache-Control: no-store/);
assert.match(lab,/X-Robots-Tag: noindex/);
for(const route of ['/life/*','/life-ops/*']){assert.match(blocks[route],/connect-src 'self';/);assert.equal(blocks[route].includes('https://coveragefit.com'),false);}
console.log('PASS exact lab CSP and unchanged Life route connection restrictions (source check)');
