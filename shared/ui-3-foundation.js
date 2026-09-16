/* 408-UI-3.1 — Unified Visual Foundation runtime enhancement.
   Does not alter form names, destinations, submission endpoints, attribution values, or CoverageFit contracts. */
(function(){
  'use strict';
  var d=document;
  var body=d.body;
  if(!body) return;
  body.classList.add('ui3-page');
  body.dataset.uiFoundation='408-UI-3.1';

  function routeKey(){
    var p=(location.pathname||'/').replace(/\/+$/,'')||'/';
    if(p==='/') return 'home';
    if(p.indexOf('/auto-bundle')===0) return 'auto';
    if(p.indexOf('/buyer')===0) return 'buyers';
    if(p.indexOf('/local')===0) return 'local';
    if(p.indexOf('/life')===0) return 'life';
    if(p.indexOf('/contact')===0) return 'contact';
    if(/^\/(healthcare|teachers|tech|engineers)/.test(p)) return 'professionals';
    return '';
  }

  function enhanceHeader(){
    var header=d.querySelector('header.site-header,header.buyer-header,header.life-header,header.contact-choice-header,header.root-header');
    if(!header){
      header=d.createElement('header');
      var skip=d.querySelector('.skip-link');
      if(skip && skip.nextSibling){skip.parentNode.insertBefore(header,skip.nextSibling);}else{body.insertBefore(header,body.firstChild);}
    }
    if(header.dataset.ui3Enhanced==='true') return;
    header.dataset.ui3Enhanced='true';
    header.classList.add('ui3-site-header');

    var brand=header.querySelector('a.brand,a.buyer-brand,a.life-brand');
    if(!brand){
      brand=d.createElement('a');
      brand.href='/';
      brand.className='brand';
      header.insertBefore(brand,header.firstChild);
    }
    var localRoute=routeKey()==='local';
    brand.classList.add('ui3-brand');
    brand.href=localRoute?'/local/':'/';
    brand.setAttribute('aria-label',localRoute?'408 Local home':'Dylan Haysbert insurance home');
    brand.innerHTML=localRoute
      ? '<span class="idsafe-local-wordmark"><span class="idsafe-local-408">408</span><span class="idsafe-local-name">Local</span></span>'
      : '<span class="idsafe-brand-wordmark"><strong class="idsafe-brand-name">Dylan Haysbert</strong><small class="idsafe-brand-role">Insurance Producer · Virginia Tam Insurance Agency, Inc.</small></span>';
    if(localRoute) body.classList.add('idsafe-local');

    var oldNavs=header.querySelectorAll('.root-nav,.local-nav');
    oldNavs.forEach(function(n){n.hidden=true;n.setAttribute('aria-hidden','true');});

    var nav=d.createElement('nav');
    nav.id='ui3-primary-nav';
    nav.className='ui3-primary-nav';
    nav.setAttribute('aria-label','Primary navigation');
    var items=localRoute?[
      ['local','Directory','/local/'],
      ['local-join','For businesses','/local/join/'],
      ['insurance','Insurance help','/?from=408-local']
    ]:[
      ['home','Home','/'],
      ['auto','Home + Auto','/auto-bundle/'],
      ['buyers','Buyers','/buyer/'],
      ['local','408 Local','/local/'],
      ['life','Life','/life/'],
      ['contact','Contact','/contact/']
    ];
    var active=routeKey();
    items.forEach(function(item){
      var a=d.createElement('a');
      a.href=item[2];a.textContent=item[1];
      if(active===item[0]) a.setAttribute('aria-current','page');
      nav.appendChild(a);
    });
    var mobileCall=d.createElement('a');
    mobileCall.href='tel:+14083276377';
    mobileCall.className='ui3-mobile-call';
    mobileCall.textContent=localRoute?'Insurance help with Dylan':'408-FARMERS · (408) 327-6377';
    if(localRoute) mobileCall.href='/?from=408-local';
    nav.appendChild(mobileCall);

    var toggle=d.createElement('button');
    toggle.type='button';
    toggle.className='ui3-menu-toggle';
    toggle.setAttribute('aria-controls',nav.id);
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open navigation');
    toggle.innerHTML='<span></span>';

    var call=d.createElement('a');
    call.href=localRoute?'/local/join/':'tel:+14083276377';
    call.className='ui3-header-call';
    call.textContent=localRoute?'Join 408 Local':'408-FARMERS';
    call.setAttribute('aria-label',localRoute?'Apply to join 408 Local':'Call or text Dylan at 408-327-6377; phone mnemonic 408-FARMERS');

    header.appendChild(nav);
    header.appendChild(toggle);
    header.appendChild(call);

    function closeMenu(){
      header.dataset.menuOpen='false';
      toggle.setAttribute('aria-expanded','false');
      toggle.setAttribute('aria-label','Open navigation');
      body.classList.remove('ui3-menu-locked');
    }
    toggle.addEventListener('click',function(){
      var open=header.dataset.menuOpen==='true';
      header.dataset.menuOpen=open?'false':'true';
      toggle.setAttribute('aria-expanded',open?'false':'true');
      toggle.setAttribute('aria-label',open?'Open navigation':'Close navigation');
      body.classList.toggle('ui3-menu-locked',!open);
    });
    nav.addEventListener('click',function(e){if(e.target.closest('a')) closeMenu();});
    d.addEventListener('keydown',function(e){if(e.key==='Escape') closeMenu();});
    window.addEventListener('resize',function(){if(window.innerWidth>860) closeMenu();},{passive:true});
  }

  function enhanceFooter(){
    var footer=d.querySelector('footer');
    if(!footer){footer=d.createElement('footer');body.appendChild(footer);}
    if(footer.dataset.ui3Enhanced==='true') return;
    footer.dataset.ui3Enhanced='true';
    footer.className='ui3-site-footer';
    if(routeKey()==='local'){
      footer.innerHTML='\
      <div class="ui3-footer-brand">\
        <span class="idsafe-local-wordmark idsafe-local-wordmark--inverse"><span class="idsafe-local-408">408</span><span class="idsafe-local-name">Local</span></span>\
        <p>Supporting the businesses that make the South Bay feel like home.</p>\
        <p class="idsafe-mission-line">Let’s build a stronger South Bay together.</p>\
      </div>\
      <div class="ui3-footer-links">\
        <div><strong>408 Local</strong><a href="/local/">Directory</a><a href="/local/#how-it-works">How it works</a><a href="/local/join/">For businesses</a></div>\
        <div><strong>Program</strong><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a><span>No insurance purchase or quote required.</span></div>\
      </div>\
      <div class="idsafe-local-bridge"><strong>Looking for insurance help?</strong> Dylan also works with California consumers through Virginia Tam Insurance Agency, Inc. <a href="/?from=408-local">Visit Dylan’s insurance page →</a></div>\
      <div class="ui3-footer-legal"><p>Merchant offers are provided by participating businesses and remain subject to merchant terms and availability.</p></div>';
      return;
    }
    footer.innerHTML='\
      <div class="ui3-footer-brand">\
        <span class="idsafe-brand-wordmark idsafe-brand-wordmark--inverse"><strong class="idsafe-brand-name">Dylan Haysbert</strong><small class="idsafe-brand-role">Insurance Producer · Virginia Tam Insurance Agency, Inc.</small></span>\
        <p>Personalized insurance help from one local producer.</p>\
        <p class="idsafe-mission-line">Let’s build a stronger South Bay together.</p>\
      </div>\
      <div class="ui3-footer-links">\
        <div><strong>Explore</strong><a href="/home/">Home</a><a href="/auto-bundle/">Home + Auto</a><a href="/buyer/">Buyers</a><a href="/life/">Life</a><a href="/local/">Local</a></div>\
        <div><strong>Professional</strong><a href="/healthcare/">Healthcare</a><a href="/teachers/">Teachers</a><a href="/tech/">Technology</a><a href="/engineers/">Engineers</a><a href="/snapshot/">Coverage Review</a></div>\
        <div><strong>Contact</strong><a href="tel:+14083276377">(408) 327-6377</a><a href="sms:+14083276377">Text Dylan</a><span>Phone mnemonic: 408-FARMERS</span><a href="mailto:dylan.vtam@farmersagency.com">Email Dylan</a><a href="/contact/">Contact options</a></div>\
      </div>\
      <div class="ui3-footer-legal">\
        <p>Dylan Haysbert · CA License #4528400<br>Insurance Producer with Virginia Tam Insurance Agency, Inc.<br>833 Corporate Way, Fremont, CA 94539</p>\
        <p><a href="/privacy.html">Privacy</a> · <a href="/terms.html">Terms</a></p>\
      </div>';
  }

  enhanceHeader();
  enhanceFooter();
})();
