/* HOA referral context: no company endorsement is implied. */
(function(window, document){
  'use strict';
  var url=new URL(window.location.href);
  if(url.searchParams.get('ref')!=='hoa')return;
  window.condoHoaReferral=true;
  var raw=url.searchParams.get('partner')||'';
  var partner=/^[a-z0-9][a-z0-9-]{0,63}$/.test(raw)?raw:'';
  if(raw&&!partner)url.searchParams.delete('partner');
  var defaults={campaign_variant:'hoa_referral',utm_source:partner||'hoa',utm_medium:'referral',utm_campaign:'condo_hoa',utm_content:partner||'general'};
  Object.keys(defaults).forEach(function(key){if(!url.searchParams.get(key))url.searchParams.set(key,defaults[key]);});
  // Seed existing attribution before the intake and profile scripts read the URL.
  window.history.replaceState(window.history.state,'',url.pathname+url.search+url.hash);
  document.addEventListener('DOMContentLoaded',function(){
    function copy(selector,text){var node=document.querySelector(selector);if(node)node.textContent=text;}
    copy('.condo-lead','Understand how your individual condo coverage fits with your association’s coverage. Start with a focused review, choose a callback time, and talk through your questions with Dylan.');
    copy('.condo-benefits span','Individual condo coverage');
    copy('.condo-visual strong','A resource for condo owners');
    copy('.condo-visual span','Your unit · Your association · Your questions');
    copy('.condo-context .condo-kicker','Your condo and your HOA');
    copy('#condo-why','Understand what you’re responsible for covering.');
    copy('.condo-context > div > p','Dylan can review your individual coverage alongside relevant HOA documents and master-policy information. No documents are needed to book; he’ll explain what would help during your conversation.');
    var cards=document.querySelectorAll('.condo-steps article');
    var titles=['Your unit','Your association','Your responsibilities'];
    var details=['Questions about interior features, improvements, and belongings.','How relevant HOA documents and master-policy information fit with your individual coverage.','Questions about deductibles, liability, and loss assessments. Coverage depends on the applicable documents and policy terms.'];
    cards.forEach(function(card,i){card.querySelector('strong').textContent=titles[i];card.querySelector('p').textContent=details[i];});
    var note=document.createElement('p');note.className='condo-note';note.textContent='This review is for individual unit-owner coverage, not the association’s master policy. This page does not imply endorsement by your HOA or management company.';
    document.querySelector('.condo-context > div').appendChild(note);
  });
})(window,document);
