(function(root,factory){
var api=factory(root.Farmers408SignalContract);root.SignalLifePreview=api;
if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis,function(contract){
'use strict';
if(!contract&&typeof require==='function')contract=require('../shared/signal-contract.js');
var FLOW=Object.freeze({id:'signal_life_preview',flowVersion:'1.0',product:'life',firstQuestionId:'',questionMap:{}});
var HANDOFF_KEY='408farmers.signal.life.preview.handoff.v1';
function handoff(session,action){
 if(action!=='human')throw new Error('Explicit human action required.');
 var signals={product:'life'};
 contract.CANONICAL_SIGNAL_FIELDS.forEach(function(key){if(session.canonicalSignals&&session.canonicalSignals[key])signals[key]=contract.clean(session.canonicalSignals[key],160);});
 return {schemaVersion:'1.0',previewOnly:true,signalSessionId:session.sessionId,canonicalSignals:signals,answers:contract.clone(session.answers||[]),action:'human',contactPermissionGranted:false,createdAt:new Date().toISOString(),expiresAt:new Date(Date.now()+1800000).toISOString()};
}
function applicationMapping(s){
 var out={},coverage={employer_only:'work',yes_personal:'personal',none:'none',unknown:'not_sure',not_sure:'not_sure'};
 var goals={family_income:'family_income',mortgage:'home_mortgage',children:'children',business:'business',final_expenses:'debt_final_expenses'};
 if(coverage[s.lifeCoverageStatus])out.existing_life_coverage=coverage[s.lifeCoverageStatus];
 if(goals[s.lifeGoal])out.protection_priority=goals[s.lifeGoal];
 return out;
}
return Object.freeze({FLOW:FLOW,HANDOFF_KEY:HANDOFF_KEY,handoff:handoff,applicationMapping:applicationMapping});
});
