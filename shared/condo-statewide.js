/* 408-CA-CONDO-STATEWIDE-1.0 — honest statewide context with optional regional message match. */
(function(window,document){
  'use strict';
  var BUILD='408-CA-CONDO-STATEWIDE-1.0';
  var copy={
    'bay-area':'Bay Area condo owner? Start here.',
    'los-angeles':'Los Angeles-area condo owner? Start here.',
    'orange-county':'Orange County condo owner? Start here.',
    'san-diego':'San Diego-area condo owner? Start here.',
    'sacramento':'Sacramento-area condo owner? Start here.',
    'inland-empire':'Inland Empire condo owner? Start here.'
  };
  function cleanRegion(value){return String(value||'').trim().toLowerCase().replace(/[^a-z0-9-]/g,'').slice(0,40);}
  function init(){
    var params;try{params=new URLSearchParams(window.location.search||'');}catch(_){return;}
    var region=cleanRegion(params.get('region'));
    if(!copy[region])return;
    var node=document.querySelector('[data-condo-region-copy]');
    if(node)node.textContent=copy[region];
    var form=document.getElementById('leadForm');
    var variant=form&&form.elements&&form.elements.campaign_variant;
    if(variant&&!variant.value)variant.value='ca_region_'+region.replace(/-/g,'_');
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push({event:'condo_region_context_applied',region:region,build:BUILD});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})(window,document);
