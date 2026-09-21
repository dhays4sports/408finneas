(function (root, factory) {
  'use strict';
  var api = factory(root, root.Farmers408SignalContract);
  root.Farmers408SignalAnalytics = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis, function (root, contract) {
  'use strict';

  if (!contract && typeof require === 'function') contract = require('./signal-contract.js');
  if (!contract) throw new Error('Signal contract is required.');

  var BUILD = '408-SIGNAL-FOUNDATION-1.0';
  var LOG_KEY = '408farmers.signal.events.v1';
  var memory = [];

  function store() {
    try {
      var s = root.localStorage, key = '__408_signal_event_probe__';
      s.setItem(key, '1'); s.removeItem(key); return s;
    } catch (_) { return null; }
  }

  function read() {
    var s = store();
    if (!s) return memory.slice();
    try {
      var value = JSON.parse(s.getItem(LOG_KEY) || '[]');
      return Array.isArray(value) ? value.slice(-contract.MAX_EVENTS) : [];
    } catch (_) { return []; }
  }

  function write(items) {
    var bounded = items.slice(-contract.MAX_EVENTS), s = store();
    if (!s) { memory = bounded; return bounded; }
    try { s.setItem(LOG_KEY, JSON.stringify(bounded)); } catch (_) { memory = bounded; }
    return bounded;
  }

  function id() {
    try { return root.crypto && root.crypto.randomUUID ? root.crypto.randomUUID() : 'evt_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8); }
    catch (_) { return 'evt_' + Date.now().toString(36); }
  }

  function emit(name, session, detail) {
    if (contract.EVENT_NAMES.indexOf(name) === -1) throw new TypeError('Unsupported signal event: ' + name);
    var d = contract.safeObject(detail);
    var event = {
      eventId: id(),
      event: name,
      build: BUILD,
      schemaVersion: contract.SCHEMA_VERSION,
      sessionId: contract.clean(session && session.sessionId, 120),
      flowId: contract.clean(session && session.flowId, 100),
      flowVersion: contract.clean(session && session.flowVersion, 40),
      questionId: contract.token(d.questionId, 100),
      optionCode: contract.token(d.optionCode, 80),
      decision: contract.token(d.decision, 80),
      route: contract.clean(root.location && root.location.pathname, 240),
      occurredAt: new Date().toISOString()
    };
    write(read().concat(event));
    try {
      if (root.dataLayer && Array.isArray(root.dataLayer)) root.dataLayer.push(Object.assign({}, event));
      if (root.dispatchEvent && root.CustomEvent) root.dispatchEvent(new root.CustomEvent('408farmers:signal-event', { detail: event }));
    } catch (_) {}
    return Object.freeze(event);
  }

  function all() { return read(); }
  function clear() { write([]); }

  return Object.freeze({ BUILD: BUILD, LOG_KEY: LOG_KEY, emit: emit, all: all, clear: clear });
});
