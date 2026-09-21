(function (root, factory) {
  'use strict';
  var api = factory(root, root.Farmers408SignalContract);
  root.Farmers408SignalSession = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis, function (root, contract) {
  'use strict';

  if (!contract && typeof require === 'function') contract = require('./signal-contract.js');
  if (!contract) throw new Error('Signal contract is required.');

  var BUILD = '408-SIGNAL-FOUNDATION-1.0';
  var KEY_PREFIX = '408farmers.signal.session.v1:';
  var MEMORY = {};

  function nowIso(now) {
    var value = now instanceof Date ? now : new Date();
    return value.toISOString();
  }

  function uuid() {
    try {
      if (root.crypto && typeof root.crypto.randomUUID === 'function') return root.crypto.randomUUID();
      if (root.crypto && typeof root.crypto.getRandomValues === 'function') {
        var bytes = new Uint8Array(16); root.crypto.getRandomValues(bytes);
        bytes[6] = (bytes[6] & 15) | 64; bytes[8] = (bytes[8] & 63) | 128;
        var h = Array.prototype.map.call(bytes, function (b) { return b.toString(16).padStart(2, '0'); }).join('');
        return h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20);
      }
    } catch (_) {}
    return 'signal-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12);
  }

  function storage(candidate) {
    if (candidate) return candidate;
    try {
      var s = root.localStorage;
      var k = '__408_signal_probe__';
      s.setItem(k, '1'); s.removeItem(k);
      return s;
    } catch (_) { return null; }
  }

  function key(flowId) { return KEY_PREFIX + contract.token(flowId, 100); }

  function parse(value) {
    try { return value ? JSON.parse(value) : null; } catch (_) { return null; }
  }

  function readRaw(flowId, store) {
    var k = key(flowId), s = storage(store);
    if (s) return parse(s.getItem(k));
    return contract.clone(MEMORY[k] || null);
  }

  function writeRaw(flowId, value, store) {
    var k = key(flowId), s = storage(store), serialized = JSON.stringify(value);
    if (s) s.setItem(k, serialized);
    else MEMORY[k] = contract.clone(value);
    return value;
  }

  function removeRaw(flowId, store) {
    var k = key(flowId), s = storage(store);
    if (s) s.removeItem(k); else delete MEMORY[k];
  }

  function referrerHost(documentLike) {
    var raw = contract.clean(documentLike && documentLike.referrer, 500);
    if (!raw) return '';
    try { return new URL(raw).hostname.slice(0, 160); } catch (_) { return ''; }
  }

  function attribution(locationLike, documentLike) {
    var value = locationLike || {};
    var out = {};
    var params;
    try { params = new URLSearchParams(String(value.search || '')); } catch (_) { params = new URLSearchParams(''); }
    contract.ATTRIBUTION_KEYS.forEach(function (name) {
      var values = params.getAll(name);
      if (values.length === 1) out[name] = contract.clean(values[0], 160);
    });
    out.landingPage = contract.clean(value.pathname || '/', 240) || '/';
    out.referrerHost = referrerHost(documentLike || root.document);
    return Object.freeze(out);
  }

  function expiresAt(createdAt) {
    var base = Date.parse(createdAt || '');
    if (!Number.isFinite(base)) base = Date.now();
    return new Date(base + contract.SESSION_TTL_DAYS * 86400000).toISOString();
  }

  function newSession(flow, options) {
    var at = nowIso(options && options.now);
    return {
      schemaVersion: contract.SCHEMA_VERSION,
      build: BUILD,
      recordType: '408farmers_signal_session',
      sessionId: uuid(),
      flowId: flow.id,
      flowVersion: flow.flowVersion,
      product: flow.product,
      state: 'signal_only',
      currentQuestionId: flow.firstQuestionId,
      answers: [],
      canonicalSignals: { product: flow.product },
      attribution: attribution(options && options.location || root.location, options && options.document || root.document),
      decision: { status: 'not_evaluated', decision: '', nextQuestionId: flow.firstQuestionId, evaluatedAt: '' },
      contact: { state: 'anonymous', requestType: '', permissionState: 'not_requested' },
      promotion: { leadCheckpointId: '', opportunityId: '' },
      createdAt: at,
      updatedAt: at,
      expiresAt: expiresAt(at)
    };
  }

  function validSession(value, flow, now) {
    if (!value || typeof value !== 'object') return false;
    if (value.schemaVersion !== contract.SCHEMA_VERSION || value.recordType !== '408farmers_signal_session') return false;
    if (value.flowId !== flow.id || value.flowVersion !== flow.flowVersion) return false;
    if (!contract.clean(value.sessionId, 120)) return false;
    if (!Array.isArray(value.answers) || value.answers.length > contract.MAX_ANSWERS) return false;
    if (value.expiresAt && Date.parse(value.expiresAt) <= (now instanceof Date ? now.getTime() : Date.now())) return false;
    return true;
  }

  function load(flow, options) {
    var value = readRaw(flow.id, options && options.storage);
    return validSession(value, flow, options && options.now) ? value : null;
  }

  function create(flow, options) {
    var value = newSession(flow, options || {});
    return writeRaw(flow.id, value, options && options.storage);
  }

  function loadOrCreate(flow, options) {
    var opts = options || {}, existing = opts.forceNew ? null : load(flow, opts);
    if (existing) return { session: existing, resumed: true, created: false };
    if (opts.forceNew) removeRaw(flow.id, opts.storage);
    return { session: create(flow, opts), resumed: false, created: true };
  }

  function recomputeSignals(flow, answers) {
    var signals = { product: flow.product };
    answers.forEach(function (answer) {
      var question = flow.questionMap[answer.questionId];
      if (!question) return;
      var option = question.options.find(function (item) { return item.code === answer.optionCode; });
      if (!option) return;
      if (question.canonicalField) signals[question.canonicalField] = option.signals[question.canonicalField] || option.code;
      Object.keys(option.signals || {}).forEach(function (field) {
        if (contract.isAllowedCanonicalField(field)) signals[field] = option.signals[field];
      });
    });
    return signals;
  }

  function save(session, flow, options) {
    var next = contract.clone(session);
    next.updatedAt = nowIso(options && options.now);
    next.canonicalSignals = recomputeSignals(flow, next.answers || []);
    return writeRaw(flow.id, next, options && options.storage);
  }

  function answer(session, flow, questionId, optionCode, options) {
    var question = flow.questionMap[contract.token(questionId, 100)];
    if (!question) throw new TypeError('Unknown signal question.');
    var code = contract.token(optionCode, 80);
    var option = question.options.find(function (item) { return item.code === code; });
    if (!option) throw new TypeError('Unknown signal answer.');
    var at = nowIso(options && options.now), answers = (session.answers || []).slice();
    var existingIndex = answers.findIndex(function (item) { return item.questionId === question.id; });
    var changed = existingIndex !== -1 && answers[existingIndex].optionCode !== option.code;

    if (existingIndex !== -1) {
      // Editing an earlier answer invalidates every downstream answer. This is
      // intentionally conservative until CoverageFit decision dependencies exist.
      answers = answers.slice(0, existingIndex);
    }
    answers.push({
      questionId: question.id,
      questionVersion: question.version,
      optionCode: option.code,
      answeredAt: at
    });
    if (answers.length > contract.MAX_ANSWERS) throw new Error('Signal answer limit exceeded.');

    var next = contract.clone(session);
    next.answers = answers;
    next.currentQuestionId = option.next || '';
    next.state = option.next ? 'signal_developing' : 'complete';
    next.decision = {
      status: 'local_foundation',
      decision: option.next ? 'ASK_ONE_SIGNAL' : 'FOUNDATION_COMPLETE',
      nextQuestionId: option.next || '',
      evaluatedAt: at
    };
    return { session: save(next, flow, options), changed: changed, option: option };
  }

  function goBack(session, flow, options) {
    var answers = (session.answers || []).slice();
    if (!answers.length) return save(session, flow, options);
    var removed = answers.pop();
    var next = contract.clone(session);
    next.answers = answers;
    next.currentQuestionId = removed.questionId;
    next.state = answers.length ? 'signal_developing' : 'signal_only';
    next.decision = { status: 'not_evaluated', decision: '', nextQuestionId: removed.questionId, evaluatedAt: '' };
    return save(next, flow, options);
  }

  function restart(flow, options) {
    removeRaw(flow.id, options && options.storage);
    return create(flow, options || {});
  }

  function destroy(flowId, options) {
    removeRaw(flowId, options && options.storage);
  }

  return Object.freeze({
    BUILD: BUILD,
    KEY_PREFIX: KEY_PREFIX,
    attribution: attribution,
    create: create,
    load: load,
    loadOrCreate: loadOrCreate,
    save: save,
    answer: answer,
    goBack: goBack,
    restart: restart,
    destroy: destroy,
    recomputeSignals: recomputeSignals,
    validSession: validSession
  });
});
