(function(root){
  'use strict';
  var fields={campaign_id:'campaignId',campaign:'campaignId',campaign_variant:'campaignVariant',creative:'creative',partner_id:'partnerId',utm_source:'utmSource',utm_medium:'utmMedium',utm_campaign:'utmCampaign',utm_content:'utmContent',utm_term:'utmTerm'};
  function payload(attribution,bootstrapId,occurredAt){
    var selected={};Object.keys(fields).forEach(function(k){var v=String(attribution[k]||'');if(/^[A-Za-z0-9][A-Za-z0-9_.:/-]{0,119}$/.test(v)&&!/[0-9]{7,}/.test(v)&&!selected[fields[k]])selected[fields[k]]=v;});
    return {version:'coveragefit-distribution-v1',entry:'buyer',bootstrapId:bootstrapId,occurredAt:occurredAt,attribution:selected,evidence:{product:'home'}};
  }
  if(typeof module==='object'&&module.exports){module.exports={payload:payload};return;}
  var form=root.document.querySelector('[data-distribution-entry]');if(!form)return;
  var at=new Date().toISOString(),storageKey='408_distribution_buyer_landing';
  try{var prior=JSON.parse(root.sessionStorage.getItem(storageKey)||'null');if(prior&&Date.now()-Date.parse(prior.at)<7*86400000)at=prior.at;else root.sessionStorage.setItem(storageKey,JSON.stringify({at:at}));}catch(_){}
  form.addEventListener('submit',function(event){
    event.preventDefault();
    try{
      var launcher=root.CoverageFitLauncher,endpoint=root.LANDING_PAGE_CONFIG.coverageFitDistributionUrl;
      if(new URL(endpoint).origin!=='https://coveragefit.com')throw Error('endpoint');
      var data=payload(launcher.getAttribution(),launcher.getBootstrapId('distribution-buyer-'+at),at);
      form.elements.handoff.value=JSON.stringify(data);form.action=endpoint;
      form.querySelector('button').disabled=true;
      root.HTMLFormElement.prototype.submit.call(form);
    }catch(_){root.document.querySelector('[role=status]').textContent='We couldn’t open the review. Please contact Dylan or use the existing buyer page.';}
  });
})(typeof window!=='undefined'?window:globalThis);
