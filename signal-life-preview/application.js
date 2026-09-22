(function(){
'use strict';
var p=window.SignalLifePreview,root=document.querySelector('[data-application-preview]'),handoff;
try{handoff=JSON.parse(sessionStorage.getItem(p.HANDOFF_KEY)||'null');}catch(e){}
if(!handoff||handoff.previewOnly!==true||handoff.action!=='human'||!Number.isFinite(Date.parse(handoff.expiresAt))||Date.parse(handoff.expiresAt)<=Date.now()){
 root.textContent='Start with the Life preview and explicitly choose Talk with a person to continue.';return;
}
var saved=document.querySelector('[data-known-answers]');
Object.entries(handoff.canonicalSignals).forEach(function(pair){
 var li=document.createElement('li');li.textContent=pair[0].replace(/([A-Z])/g,' $1')+': '+String(pair[1]).replace(/_/g,' ');saved.appendChild(li);
});
root.appendChild(document.querySelector('template').content.cloneNode(true));
var form=root.querySelector('form');form.addEventListener('submit',function(e){e.preventDefault();});
form.querySelectorAll('input').forEach(function(input){input.disabled=true;});
Object.entries(p.applicationMapping(handoff.canonicalSignals)).forEach(function(pair){
 var input=Array.from(form.querySelectorAll('input')).find(function(i){return i.name===pair[0]&&i.value===pair[1];});
 if(input){input.checked=true;var group=input.closest('[data-life-step]');if(group)group.hidden=true;}
});
// A known goal without an equivalent legacy checkbox stays in the summary, never re-asked or invented.
if(handoff.canonicalSignals.lifeGoal){var goalGroup=form.querySelector('[data-life-step="1"]');if(goalGroup)goalGroup.hidden=true;}
form.querySelectorAll('[data-life-error],[data-life-submit-status],.life-bot-field').forEach(function(n){n.hidden=true;});
// Unknown application facts are not invented. No submission or identity persistence.
})();
