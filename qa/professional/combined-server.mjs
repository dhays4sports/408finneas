// Local QA only. Uses actual CoverageFit handlers with an in-memory database,
// no credentials, no external fetch, and no provider delivery configuration.
import http from 'node:http';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {resolve,extname,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {onRequest as presentation} from '../../../CoverageFit/functions/api/distribution/presentation.js';
import {distributionInteract,distributionEvent} from '../../../CoverageFit/server/distribution-journey.mjs';
import {createPVXRecordStore} from '../../../CoverageFit/server/d1-json-store.mjs';
import {handleSoloDesk} from '../../../CoverageFit/server/solo-desk-api.mjs';
import {entryPage,entryAction} from '../../server/entry-presentation-proxy.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const cf=resolve(root,'../CoverageFit');
const baseline='29ea29a9818006ed139cf87f0990306c769b63c9';
const oldFile=path=>execFileSync('git',['show',`${baseline}:${path}`],{cwd:root,encoding:'utf8'});
const {professionalPresentation:beforePresentation}=await import('data:text/javascript;base64,'+Buffer.from(oldFile('server/professional-presentation.mjs')).toString('base64'));
const beforeCSS=oldFile('shared/professional-entry.css');
const sql=new DatabaseSync(':memory:');
for(const f of readdirSync(resolve(cf,'migrations')).filter(f=>f.endsWith('.sql')).sort())sql.exec(readFileSync(resolve(cf,'migrations',f),'utf8'));
const db={prepare(q){let args=[];const s={bind(...v){args=v;return s},async first(){return sql.prepare(q).get(...args)||null},async all(){return {results:sql.prepare(q).all(...args)}},async run(){return {meta:sql.prepare(q).run(...args)}}};return s},async batch(stmts){sql.exec('BEGIN');try{const out=[];for(const s of stmts)out.push(await s.run());sql.exec('COMMIT');return out}catch(e){sql.exec('ROLLBACK');throw e}}};
const options={db,store:createPVXRecordStore(db),env:{COVERAGEFIT_DB:db,COVERAGEFIT_SOLO_WORKSPACE_ID:'combined-qa',COVERAGEFIT_PRODUCER_ACCESS_TOKEN:'synthetic-combined-preview-only'}};
const upstream=async(url,init)=>{const request=new Request(url,init),u=new URL(url);if(u.pathname.endsWith('/presentation'))return presentation({request,env:{COVERAGEFIT_DB:db}});return u.pathname.endsWith('/events')?distributionEvent(request,options):distributionInteract(request,options)};
const routes=['tech','healthcare','engineers','teachers'];
const mime={'.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.html':'text/html'};
http.createServer(async(req,res)=>{try{
 const u=new URL(req.url,'http://localhost');let response;
 if(u.pathname==='/qa-fresh'){
  const route=routes.includes(u.searchParams.get('route'))?u.searchParams.get('route'):'tech';
  const width=[320,375,390,430,768,1280].includes(Number(u.searchParams.get('width')))?Number(u.searchParams.get('width')):390;
  response=new Response(null,{status:303,headers:{Location:`/?route=${route}&width=${width}`,'Set-Cookie':'cf_distribution_resume=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax'}});
 }else if(u.pathname==='/'){
  const route=routes.includes(u.searchParams.get('route'))?u.searchParams.get('route'):'tech';
  const width=[320,375,390,430,768,1280].includes(Number(u.searchParams.get('width')))?Number(u.searchParams.get('width')):390;
  const before=u.searchParams.has('before');
  response=new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>408FARMERS Home + auto preview</title></head><body style="margin:0;background:#e6e8eb;font-family:system-ui"><nav style="padding:12px;font-size:13px;line-height:1.8"><strong>${before?'BEFORE — current source':'HOME + AUTO — unpublished candidate'}</strong> · isolated synthetic preview · ${route} · ${width}px<br>${routes.map(r=>`<a href="/?route=${r}&width=${width}${before?'&before':''}">${r}</a>`).join(' · ')}<br>${[375,390,430,1280].map(w=>`<a href="/?route=${route}&width=${w}${before?'&before':''}">${w}px</a>`).join(' · ')} · <a href="/qa-producer">Synthetic producer workspace</a> · <a href="/qa-fresh?route=${route}&width=${width}">Fresh synthetic session</a></nav><iframe title="Professional preview" src="/${before?'before/':''}${route}/?utm_source=preview&utm_medium=paid_social&utm_campaign=combined_qa" style="display:block;border:0;width:${width}px;height:1800px;margin:0 auto;background:#faf9f6"></iframe></body></html>`,{headers:{'Content-Type':'text/html'}});
 }else if(/^\/(before\/)?(tech|healthcare|engineers|teachers)\/$/.test(u.pathname)){
  const parts=u.pathname.split('/').filter(Boolean),route=parts.at(-1);let html;
  if(parts[0]==='before'){
   const raw=await upstream('https://coveragefit.com/api/distribution/presentation?entry='+route+'&presentation=408_contextual'+u.search.replace('?','&'),{headers:{}});
   html=beforePresentation(await raw.text(),route).replace('/shared/professional-entry.css?v=1','/qa/baseline-professional.css');
  }else{
   response=await entryPage(new Request('https://408farmers.com/'+route+'/'+u.search,{headers:{Cookie:req.headers.cookie||''}}),{entry:route},{fetch:upstream});html=await response.text();
  }
  // QA-only asset localization and iframe allowance; production CSP is unchanged.
  html=html.replaceAll('https://coveragefit.com/assets/','/cf-assets/');
  response=new Response(html,{headers:{'Content-Type':'text/html; charset=utf-8'}});
 }else if(u.pathname==='/qa/baseline-professional.css')response=new Response(beforeCSS,{headers:{'Content-Type':'text/css'}});
 else if(u.pathname.startsWith('/api/entry/')){
  let body='';for await(const c of req)body+=c;
  response=await entryAction(new Request('https://408farmers.com'+u.pathname,{method:req.method,headers:{Origin:'https://408farmers.com','Content-Type':'application/json',Cookie:req.headers.cookie||''},body}),{fetch:upstream});
  // Local HTTP compatibility only; production cookie handling is untouched.
  const headers=new Headers(response.headers);if(headers.has('set-cookie'))headers.set('set-cookie',headers.get('set-cookie').replace('; Secure',''));response=new Response(response.body,{status:response.status,headers});
 }else if(u.pathname==='/qa-producer'){
  // Public synthetic fixture credential: local in-memory QA only, no real access.
  const html=readFileSync(resolve(cf,'agent/workspace/index.html'),'utf8').replace('<body>','<body><p style="padding:12px;background:#fff2cc">Synthetic isolated producer workspace — no production data or provider access.</p><script>sessionStorage.setItem("coveragefit.producerInbox.token","synthetic-combined-preview-only")</script>');
  response=new Response(html,{headers:{'Content-Type':'text/html'}});
 }else if(u.pathname.startsWith('/api/solo-desk/')){
  let body='';for await(const c of req)body+=c;
  response=await handleSoloDesk({request:new Request('https://coveragefit.com'+u.pathname+u.search,{method:req.method,headers:{Origin:'https://coveragefit.com','Content-Type':'application/json',Authorization:req.headers.authorization||''},...(body?{body}:{})}),env:options.env,fetch:async()=>{throw Error('External requests disabled in QA')}});
 }else if(u.pathname.startsWith('/agent/')||u.pathname.startsWith('/assets/')){
  let file=resolve(cf,'.'+u.pathname);if(u.pathname.endsWith('/'))file=resolve(file,'index.html');response=file.startsWith(cf+'/')&&existsSync(file)?new Response(readFileSync(file),{headers:{'Content-Type':mime[extname(file)]||'application/octet-stream'}}):new Response('Not found',{status:404});
 }else if(u.pathname==='/qa-receipt')response=Response.json({opportunities:sql.prepare('SELECT count(*) n FROM cf_solo_opportunities').get().n,sources:sql.prepare("SELECT summary_json FROM cf_solo_sources WHERE kind='lead'").all().map(r=>JSON.parse(r.summary_json))});
 else{
  const assetRoot=u.pathname.startsWith('/cf-assets/')?resolve(cf,'assets'):resolve(root,'shared');
  const file=resolve(assetRoot,'.'+(u.pathname.startsWith('/cf-assets/')?u.pathname.slice(10):u.pathname.slice(7)));
  response=file.startsWith(assetRoot+'/')&&existsSync(file)?new Response(readFileSync(file),{headers:{'Content-Type':mime[extname(file)]||'application/octet-stream'}}):new Response('Not found',{status:404});
 }
 res.writeHead(response.status,{...Object.fromEntries(response.headers),'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'});res.end(Buffer.from(await response.arrayBuffer()));
 }catch(error){console.error(error);res.writeHead(500);res.end('Isolated preview error')}}).listen(Number(process.env.PORT)||4173,'0.0.0.0',()=>console.log('Isolated professional preview ready'));
