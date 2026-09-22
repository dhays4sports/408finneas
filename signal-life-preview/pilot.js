(function(){
'use strict';
var api=window.Farmers408SignalSession,remote=window.Farmers408SignalDecisionRemote,pilot=window.SignalLifePreview,flow=pilot.FLOW,box=document.querySelector('[data-life-pilot]');
var endpoint='https://cf-signal-decision-1-0.coveragefit.pages.dev/api/signal/decision';
var params=new URLSearchParams(location.search),fresh=params.get('fresh')==='1';
var loaded=api.loadOrCreate(flow,{forceNew:fresh,location:location,document:document}),session=loaded.session,question=null,busy=false;
if(fresh){params.delete('fresh');history.replaceState(null,'',location.pathname+(params.toString()?'?'+params:'')+location.hash);}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function button(label,action){return '<button type="button" class="signal-choice" data-action="'+action+'">'+esc(label)+'</button>';}
function render(title,body,controls){
 box.innerHTML='<section class="signal-card"><span class="signal-eyebrow">Life coverage · Preview</span><h1 tabindex="-1">'+esc(title)+'</h1><p>'+esc(body)+'</p><div class="signal-choice-list">'+controls+'</div><p class="signal-meta">Anonymous answers stay on this device. No request has been sent.</p></section>';
 box.querySelector('h1').focus({preventScroll:true});
}
function human(){return button('Talk with a person','human');}
async function evaluate(){
 if(busy)return;busy=true;box.setAttribute('aria-busy','true');
 try{
  var d=await remote.evaluate(flow,session,{endpoint:endpoint});question=d.nextQuestion;
  session.currentQuestionId=d.nextQuestionId||'';session.state=d.state;
  session.decision={status:'coveragefit_remote',decision:d.decision,nextQuestionId:d.nextQuestionId||'',evaluatedAt:d.evaluatedAt};
  session=api.save(session,flow);
  if(d.decision==='ASK_ONE_SIGNAL'){
   var choices=question.options.map(function(o){return button(o.label,'answer:'+o.code);}).join('');
   render(question.prompt,question.supportingText||'',choices+(session.answers.length?button('Back','back'):'')+human());
  }else{
   var p=d.publicExperience,controls=d.decision==='OFFER_HUMAN'?human()+button('Learn first','learn'):d.decision==='OFFER_LEARN'?button('Learn the basics','learn')+human():button('Keep this for later','later')+human();
   render(p.title,p.body,controls+button('Start again','restart'));
  }
 }catch(e){render('The next step could not load.','Your answers are saved on this device. Please retry.',button('Retry decision','retry')+human());}
 finally{busy=false;box.removeAttribute('aria-busy');}
}
box.addEventListener('click',function(e){
 var el=e.target.closest('[data-action]');if(!el||busy)return;var a=el.dataset.action;
 if(a.indexOf('answer:')===0&&question){session=api.answerQuestion(session,flow,question,a.slice(7)).session;void evaluate();}
 else if(a==='back'){session=api.goBack(session,flow);void evaluate();}
 else if(a==='retry'||a==='continue')void evaluate();
 else if(a==='restart'){session=api.restart(flow,{location:location,document:document});void evaluate();}
 else if(a==='human'){
  try{sessionStorage.setItem(pilot.HANDOFF_KEY,JSON.stringify(pilot.handoff(session,'human')));location.assign('./contact/');}
  catch(error){render('Your answers could not be carried forward.','Please allow storage for this preview, then try again. No request was sent.',human()+button('Return to questions','continue'));}
 }else if(a==='learn')render('Start with what you want to protect.','Personal life coverage can help with family income, a mortgage, dependents or other obligations. Workplace coverage and a personal policy can serve different needs. A licensed agent can explain options; this preview makes no eligibility or pricing decision.',human()+button('Keep this for later','later')+button('Return to my result','continue'));
 else if(a==='later')render('Come back when you are ready.','Your anonymous answers remain on this device for up to 30 days. No call or follow-up has been requested.',button('Continue','continue')+human());
});
if(loaded.resumed&&session.answers.length)render('Continue where you left off?','Your anonymous Life answers are saved on this device.',button('Continue','continue')+button('Start over','restart'));
else void evaluate();
})();
