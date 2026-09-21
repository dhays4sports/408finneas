(function (root, factory) {
  'use strict';
  var api = factory(root, root.Farmers408SignalContract);
  root.Farmers408SignalDecisionRemote = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis, function (root, contract) {
  'use strict';

  if (!contract && typeof require === 'function') contract = require('./signal-contract.js');
  if (!contract) throw new Error('Signal contract is required.');

  var BUILD = '408-SIGNAL-DECISION-BRIDGE-1.0';
  var DEFAULT_ENDPOINT = 'https://coveragefit.com/api/signal/decision';
  var PRODUCTS = ['home','auto','life','business','unknown'];

  function clean(value, max) {
    return contract.clean(value, max || 120);
  }

  function safeToken(value, max) {
    var raw = clean(value, max || 120);
    if (!raw || /@/.test(raw) || /\d{7,}/.test(raw)) return '';
    return raw.replace(/\s+/g, '_').replace(/[^A-Za-z0-9_.:/-]/g, '').slice(0, max || 120);
  }

  function endpoint(options) {
    var configured = clean(options && options.endpoint, 300) ||
      clean(root.LANDING_PAGE_CONFIG && root.LANDING_PAGE_CONFIG.coverageFitSignalDecisionUrl, 300) ||
      DEFAULT_ENDPOINT;
    var url;
    try { url = new URL(configured, root.location && root.location.origin || 'https://408farmers.com'); }
    catch (_) { throw new Error('CoverageFit Signal Decision URL is invalid.'); }
    if (url.protocol !== 'https:' && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(url.origin)) {
      throw new Error('CoverageFit Signal Decision must use HTTPS.');
    }
    return url.toString();
  }

  function product(value) {
    var normalized = contract.token(value, 80);
    return PRODUCTS.indexOf(normalized) === -1 ? 'unknown' : normalized;
  }

  function signals(session) {
    var source = contract.safeObject(session && session.canonicalSignals), out = {};
    contract.CANONICAL_SIGNAL_FIELDS.forEach(function (field) {
      if (source[field] == null || source[field] === '') return;
      out[field] = clean(source[field], 160);
    });
    out.product = product(out.product || session && session.product);
    return out;
  }

  function attribution(session) {
    var a = contract.safeObject(session && session.attribution), out = {};
    var map = {
      source:'source',
      source_family:'sourceFamily',
      source_key:'sourceKey',
      campaign_id:'campaignId',
      campaign_variant:'campaignVariant',
      creative:'creative',
      partner_id:'partnerId',
      batch_id:'batchId',
      utm_source:'utmSource',
      utm_medium:'utmMedium',
      utm_campaign:'utmCampaign',
      utm_content:'utmContent',
      utm_term:'utmTerm'
    };
    Object.keys(map).forEach(function (from) {
      var value = safeToken(a[from], 120);
      if (value) out[map[from]] = value;
    });
    var landing = clean(a.landingPage, 180);
    if (landing && landing.charAt(0) === '/' && landing.indexOf('://') === -1 && !/[?#]/.test(landing)) out.landingPage = landing;
    return out;
  }

  function payload(flow, session) {
    return {
      schemaVersion: '1.0',
      signalSessionId: clean(session && session.sessionId, 120),
      flowId: clean(flow && flow.id || session && session.flowId, 100),
      flowVersion: clean(flow && flow.flowVersion || session && session.flowVersion || '1.0', 40),
      canonicalSignals: signals(session),
      attribution: attribution(session)
    };
  }

  function publicExperience(value) {
    var item = contract.safeObject(value);
    if (!Object.keys(item).length) return null;
    return Object.freeze({
      eyebrow: clean(item.eyebrow, 100),
      title: clean(item.headline || item.title, 180),
      body: clean(item.body, 360),
      actions: Object.freeze(Array.isArray(item.actions) ? item.actions.map(function (action) { return contract.token(action, 60); }).filter(Boolean).slice(0, 6) : [])
    });
  }

  async function evaluate(flow, session, options) {
    if (typeof root.fetch !== 'function') throw new Error('Fetch is unavailable.');
    var controller = typeof AbortController === 'function' ? new AbortController() : null;
    var timeout = setTimeout(function () { try { controller && controller.abort(); } catch (_) {} }, Math.max(1000, Number(options && options.timeoutMs) || 4500));
    var response;
    try {
      response = await root.fetch(endpoint(options), {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-store',
        redirect: 'error',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload(flow, session)),
        signal: controller ? controller.signal : undefined
      });
    } finally {
      clearTimeout(timeout);
    }

    var data = {};
    try { data = await response.json(); } catch (_) {}
    if (!response.ok || data.ok !== true) {
      var error = new Error(clean(data && data.error && data.error.message, 220) || 'CoverageFit could not evaluate this Signal Session.');
      error.code = clean(data && data.error && data.error.code, 80) || 'signal_decision_failed';
      error.status = response.status;
      throw error;
    }

    var decision = contract.token(data.decision, 80).toUpperCase();
    if (contract.DECISIONS.indexOf(decision) === -1 || decision === 'FOUNDATION_COMPLETE') throw new Error('CoverageFit returned an unsupported Signal decision.');
    var question = null;
    if (decision === 'ASK_ONE_SIGNAL') {
      if (!data.nextQuestion) throw new Error('CoverageFit did not return the next Signal question.');
      question = contract.validateQuestion(data.nextQuestion);
    }

    return Object.freeze({
      build: BUILD,
      engine: clean(data.engine, 100),
      priorityEngine: clean(data.priorityEngine, 100),
      mode: 'coveragefit_remote',
      decision: decision,
      state: contract.token(data.state, 60),
      nextQuestionId: question ? question.id : '',
      nextQuestion: question,
      missingDimension: contract.token(data.missingDimension, 60),
      publicExperience: publicExperience(data.publicExperience),
      evaluatedAt: contract.iso(data.evaluatedAt) || new Date().toISOString(),
      scoringApplied: true,
      coverageFitConnected: true
    });
  }

  return Object.freeze({
    BUILD: BUILD,
    DEFAULT_ENDPOINT: DEFAULT_ENDPOINT,
    endpoint: endpoint,
    payload: payload,
    evaluate: evaluate
  });
});
