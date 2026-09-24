(function(){
'use strict';
function esc(v){return String(v||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
window.Farmers408HomeContact={open:function(box,session,back){
 var summary=Object.entries(session.canonicalSignals||{}).filter(function(pair){return pair[0]!=='product';}).map(function(pair){return esc(pair[1].replace(/_/g,' '));}).join(' · ');
 box.innerHTML='<section class="signal-card"><h1 tabindex="-1">How would you like to connect?</h1><p>Your Home answers will come with your request.</p><p>'+summary+'</p><form id="home-contact"><label>First name<input name="name" autocomplete="given-name" maxlength="80" required></label><label>Phone number<input name="phone" type="tel" autocomplete="tel" maxlength="24" required pattern="[+0-9() .-]{10,24}"></label><label>Contact preference<select name="mode"><option value="call">Request a call</option><option value="text">Request a personal text</option><option value="callback">Request a callback window</option></select></label><label id="home-window" hidden>Preferred window (Pacific)<select name="timePreference"><option value="">Choose a window</option><option value="weekday_morning">Weekday morning</option><option value="weekday_afternoon">Weekday afternoon</option></select></label><p>Callback windows are preferences, not confirmed appointments.</p><label class="home-permission"><input type="checkbox" name="permission" required> I ask Dylan at Virginia Tam Insurance Agency, Inc. to contact me at this number using my selected method about this Home request. This does not authorize automated marketing texts.</label><p id="home-contact-status" role="status" aria-live="polite"></p><button class="signal-choice" type="submit">Send my request</button><button class="signal-choice" type="button" id="home-back">Back to my answers</button></form><p>Prefer to reach out yourself? <a href="tel:+14083276377">Call 408-327-6377</a> or <a href="sms:+14083276377">open a text to Dylan</a>. These links do not transfer your answers.</p></section>';
 box.querySelector('h1').focus({preventScroll:true});
 var form=box.querySelector('form'),status=box.querySelector('#home-contact-status'),sending=false;
 form.elements.mode.addEventListener('change',function(){var callback=form.elements.mode.value==='callback';box.querySelector('#home-window').hidden=!callback;form.elements.timePreference.required=callback;form.elements.permission.checked=false;});
 box.querySelector('#home-back').addEventListener('click',function(){if(!sending)back();});
 form.addEventListener('submit',async function(e){e.preventDefault();if(sending||!form.reportValidity())return;sending=true;
 var body={version:'signal-home-contact-v1',sessionId:session.sessionId,name:form.elements.name.value,phone:form.elements.phone.value,mode:form.elements.mode.value,timePreference:form.elements.mode.value==='callback'?form.elements.timePreference.value:'',permission:form.elements.permission.checked,answers:(session.answers||[]).map(function(a){return {questionId:a.questionId,optionCode:a.optionCode};})};
 var controls=Array.from(form.elements);controls.forEach(function(el){el.disabled=true;});status.textContent='Sending your request…';
 try{
  var response=await fetch('/api/signal/home-contact',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)}),result=await response.json();
  if(!response.ok||result.ok!==true)throw Error('not_confirmed');
  box.innerHTML='<section class="signal-card"><h1 tabindex="-1">Your request reached CoverageFit.</h1><p>Your contact preference and Home answers are saved in Dylan’s producer desk. No appointment has been booked. Dylan will review your request.</p><p>Reference: '+esc(result.receipt)+'</p><a href="/signal-preview/">Return to the preview hub</a></section>';box.querySelector('h1').focus({preventScroll:true});
 }catch(error){status.textContent='We could not confirm delivery. Your answers are still saved. Retry the same request, or use the call/text links below. No appointment is confirmed.';controls.forEach(function(el){el.disabled=false;});}
 finally{sending=false;}
 });
}};
})();
