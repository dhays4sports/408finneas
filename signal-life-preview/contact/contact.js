(function(){
'use strict';
var durable=new URLSearchParams(location.search).get('stage')==='durable';
var box=document.getElementById('contact-content'),handoff;
try{handoff=JSON.parse(sessionStorage.getItem(window.SignalLifePreview.HANDOFF_KEY)||'null');}catch(e){}
if(!handoff||handoff.previewOnly!==true||handoff.action!=='human'||!Number.isFinite(Date.parse(handoff.expiresAt))||Date.parse(handoff.expiresAt)<=Date.now()){
 box.textContent='Start with the Life preview and select “Talk with a person” to carry your answers here.';return;
}
var form=document.createElement('form');form.noValidate=true;
form.innerHTML='<h2>Your answers so far</h2><ul class="known-answers"></ul><fieldset><legend>Contact preference</legend><label class="contact-choice"><input type="radio" name="mode" value="call_now" required>Talk now</label><label class="contact-choice"><input type="radio" name="mode" value="choose_time">Choose a time</label><label class="contact-choice"><input type="radio" name="mode" value="text">Text me</label></fieldset><div id="contact-details" hidden><label class="contact-field" for="test-phone">Test phone number</label><input class="contact-input" id="test-phone" type="tel" value="202-555-0123" readonly aria-describedby="test-note"><p id="test-note">This preview uses a fixed fictional number. Do not enter personal contact information.</p><div id="time-details" hidden><label class="contact-field" for="time-preference">Preferred time window</label><select id="time-preference"><option value="">Choose a window</option value="weekday_morning_pacific">Weekday morning · Pacific time</option><option value="weekday_afternoon_pacific">Weekday afternoon · Pacific time</option></select><p>A preference only; no appointment is reserved.</p></div><label class="contact-choice"><input id="preview-permission" type="checkbox"><span id="permission-copy"></span></label><button class="signal-choice" type="submit">Test this handoff</button></div><p id="contact-status" role="status" aria-live="polite"></p><p id="application-link" hidden><a href="../application/">Review the application preview</a></p>';
box.appendChild(form);
if(durable){var note=document.createElement('p');note.textContent='Durable staging test: synthetic handoff and simulated permission evidence are saved with a seven-day expiration. Nothing is sent or booked.';form.prepend(note);}
var labels={product:'Coverage',lifeCoverageStatus:'Current coverage',shoppingIntent:'Interest',decisionTiming:'Timing',lifeGoal:'Protection goal'};
var values={life:'Life',employer_only:'Only through work',yes_personal:'Personal coverage',none:'No personal coverage',unsure:'Not sure',ready_now:'Ready now',open_to_review:'Open to it',researching:'Mostly researching',not_interested:'Not interested',now:'As soon as possible',within_30:'Within 30 days',within_90:'Next few months',future:'Not sure yet',family_income:'Family income',mortgage:'Mortgage or home',children:'Children or dependents',business:'Business or key person',final_expenses:'Final expenses',review_existing:'Review existing coverage'};
Object.keys(handoff.canonicalSignals||{}).forEach(function(k){if(!labels[k])return;var li=document.createElement('li');li.textContent=labels[k]+': '+(values[handoff.canonicalSignals[k]]||'Answer retained');form.querySelector('ul').appendChild(li);});
var details=form.querySelector('#contact-details'),timing=form.querySelector('#time-details'),permission=form.querySelector('#preview-permission'),status=form.querySelector('#contact-status'),submit=form.querySelector('button'),busy=false;
function syncPreference(){
 var selected=form.querySelector('input[name="mode"]:checked');
 details.hidden=!selected;timing.hidden=!selected||selected.value!=='choose_time';permission.checked=false;
 if(selected)form.querySelector('#permission-copy').textContent=selected.value==='text'?'Simulate permission for a text about my Life request. This does not grant actual contact permission.':'Simulate permission for a call about my Life request. This does not grant actual contact permission.';
 status.textContent='';form.querySelector('#application-link').hidden=true;submit.textContent='Test this handoff';
}
form.addEventListener('change',function(e){if(e.target.name==='mode')syncPreference();});
// Browsers may restore radio selection after Back without firing change.
window.addEventListener('pageshow',syncPreference);
form.addEventListener('submit',async function(e){
 e.preventDefault();if(busy)return;
 var selected=form.querySelector('input[name="mode"]:checked'),mode=selected&&selected.value,slot=mode==='choose_time'?form.querySelector('select').value:'';
 if(!mode||!permission.checked||(mode==='choose_time'&&!slot)){status.textContent='Choose a contact preference, a time window if needed, and check the preview permission box.';return;}
 busy=true;Array.from(form.elements).forEach(function(el){el.disabled=true;});status.textContent='Checking the preview handoff…';
 var controller=new AbortController(),timer=setTimeout(function(){controller.abort();},10000);
 try{
  var response=await fetch(durable?'/api/signal/life-handoff-staging':'/api/signal/life-handoff-preview',{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({schemaVersion:durable?'SIGNAL-LIFE-1.2':'SIGNAL-LIFE-1.1',mode:mode,phone:'+12025550123',timePreference:slot,permission:{version:'preview-permission-v1',channel:mode==='text'?'sms':'phone',checked:true},handoff:handoff})});
  var result=await response.json();
  if(!response.ok||result.status!==(durable?'staging_recorded':'preview_validated'))throw new Error('Preview unavailable');
  status.textContent=(durable?'Staging handoff recorded. ':'Preview handoff verified. ')+result.answerCount+' answers carried forward.\nNo call, text, appointment, lead or contact-permission record was created.\nReceipt: '+result.receipt+(durable?'\nSimulated permission evidence stored; no actual contact permission granted.':'');
  form.querySelector('#application-link').hidden=false;submit.textContent='Test again';
 }catch(error){status.textContent='The handoff could not load. Your Life answers and selections are still here. Retry the handoff. If your preview has expired, return to your Life answers and select Talk with a person again.';submit.textContent='Retry handoff';}
 finally{clearTimeout(timer);busy=false;Array.from(form.elements).forEach(function(el){el.disabled=false;});}
});
})();
