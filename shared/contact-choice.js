(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.CROContactChoice = api;
  if (root && root.document) {
    if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded', function () { api.apply(root.document, root.location.search); });
    else api.apply(root.document, root.location.search);
  }
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  var PHONE = '+14083276377';
  var EMAIL = 'dylan.vtam@farmersagency.com';
  var CONTEXTS = {
    general: {
      kicker: 'Talk with a local insurance producer',
      intro: 'Start a direct conversation about what you are trying to protect. You can text, call, or email—whichever works best on this device.',
      message: 'Hi Dylan, I would like an insurance review.',
      subject: 'Coverage review'
    },
    business: {
      kicker: 'Business coverage conversation',
      intro: 'Tell Dylan a little about your operations and what prompted the review. Choose text, call, or email to start the conversation.',
      message: 'Hi Dylan, I would like to discuss business insurance.',
      subject: 'Business coverage review'
    },
    landlord: {
      kicker: 'Rental property coverage conversation',
      intro: 'Start with the property and what you want to review. Choose text, call, or email to reach Dylan directly.',
      message: 'Hi Dylan, I would like to review insurance for a rental property.',
      subject: 'Rental property coverage review'
    },
    life: {
      kicker: 'Family protection conversation',
      intro: 'Start a private conversation about who you want to protect and what you are planning for. Choose text, call, or email.',
      message: 'Hi Dylan, I would like to review life insurance.',
      subject: 'Family protection review'
    },
    renters: {
      kicker: 'Auto + renters coverage conversation',
      intro: 'Your first-step details are submitted. Continue directly with Dylan to review renters protection, auto coverage, possible bundle discounts, and overall value.',
      message: 'Hi Dylan, I completed the auto and renters first step and would like to review my bundle options.',
      subject: 'Auto and renters coverage review'
    }
  };

  function resolve(search) {
    var params = new URLSearchParams(String(search || '').replace(/^\?/, ''));
    var intent = String(params.get('intent') || '').toLowerCase();
    if (!Object.prototype.hasOwnProperty.call(CONTEXTS, intent)) intent = 'general';
    var attribution = {};
    ['utm_source','utm_medium','utm_campaign','utm_content','partner_id','placement_id'].forEach(function(key){
      var value=params.get(key);
      if(value && /^[A-Za-z0-9][A-Za-z0-9_.-]{0,79}$/.test(value) && !/[0-9]{7,}/.test(value)) attribution[key]=value;
    });
    var source=attribution.partner_id||attribution.utm_source;
    var placement=attribution.placement_id||attribution.utm_content;
    var reference=[source,placement].filter(Boolean).join(' / ');
    var context=Object.assign({},CONTEXTS[intent]);
    if(reference)context.message+=' I found your information through '+reference.replace(/_/g,' ')+'.';
    var query=new URLSearchParams(attribution).toString();
    return { intent:intent, context:context, attribution:attribution, reference:reference,
      callbackHref:(intent==='business'?'/business/':'/home/')+(query?'?'+query:'') };
  }

  function smsHref(context) {
    return 'sms:' + PHONE + '?body=' + encodeURIComponent(context.message);
  }

  function emailHref(context) {
    return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(context.subject) + '&body=' + encodeURIComponent(context.message);
  }

  function apply(document, search) {
    if (!document || typeof document.querySelector !== 'function') return resolve(search);
    var result = resolve(search);
    var kicker = document.querySelector('[data-contact-kicker]');
    var intro = document.querySelector('[data-contact-intro]');
    var sms = document.querySelector('[data-contact-sms]');
    var email = document.querySelector('[data-contact-email]');
    if (kicker) kicker.textContent = result.context.kicker;
    if (intro) intro.textContent = result.context.intro;
    if (sms) sms.setAttribute('href', smsHref(result.context));
    if (email) email.setAttribute('href', emailHref(result.context));
    var callback=document.querySelector('[data-contact-callback]');
    if(callback && result.intent==='business')callback.setAttribute('href',result.callbackHref);
    var sourceNote=document.querySelector('[data-contact-source]');
    if(sourceNote)sourceNote.textContent=result.reference?'Calling instead? Mention this source to Dylan: '+result.reference+'. Phone calls are not automatically attributed.':'';
    if (document.body) document.body.setAttribute('data-contact-intent', result.intent);
    return result;
  }

  return {
    BUILD: '408-CRO-1.2',
    PHONE: PHONE,
    EMAIL: EMAIL,
    CONTEXTS: CONTEXTS,
    resolve: resolve,
    smsHref: smsHref,
    emailHref: emailHref,
    apply: apply
  };
});
