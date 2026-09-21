(function (root, factory) {
  'use strict';
  var api = factory();
  root.Farmers408SignalContract = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var BUILD = '408-SIGNAL-FOUNDATION-1.0';
  var SCHEMA_VERSION = '1.0';
  var SESSION_TTL_DAYS = 30;
  var MAX_ANSWERS = 16;
  var MAX_EVENTS = 120;

  var SESSION_STATES = Object.freeze([
    'signal_only',
    'signal_developing',
    'qualified_signal',
    'opportunity',
    'complete'
  ]);

  var DECISIONS = Object.freeze([
    'ASK_ONE_SIGNAL',
    'OFFER_HUMAN',
    'OFFER_LEARN',
    'CONTINUE_LATER',
    'FOUNDATION_COMPLETE'
  ]);

  var EVENT_NAMES = Object.freeze([
    'signal_session_started',
    'signal_session_resumed',
    'signal_session_restarted',
    'signal_question_viewed',
    'signal_answered',
    'signal_answer_changed',
    'signal_back_used',
    'signal_decision_received',
    'signal_next_question_shown',
    'signal_handoff_shown',
    'signal_handoff_selected',
    'contact_request_started',
    'contact_permission_granted',
    'lead_promoted',
    'booking_started',
    'booking_saved',
    'coveragefit_handoff_opened',
    'signal_session_abandoned',
    'signal_session_completed',
    'signal_storage_unavailable',
    'signal_error'
  ]);

  var ATTRIBUTION_KEYS = Object.freeze([
    'source', 'surface', 'source_family', 'source_key',
    'campaign', 'campaign_id', 'campaign_variant', 'variant', 'creative',
    'partner_id', 'partner_name', 'batch_id',
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
    'realtor_id', 'realtor_name', 'referred_by'
  ]);

  var CANONICAL_SIGNAL_FIELDS = Object.freeze([
    'product',
    'statedTrigger',
    'shoppingIntent',
    'decisionTiming',
    'reviewReason',
    'renewalTiming',
    'closingDate',
    'propertyType',
    'autoNeed',
    'businessNeed',
    'businessType',
    'professionalProgram',
    'lifeCoverageStatus',
    'lifeProtectionTrigger',
    'lifeGoal'
  ]);

  // These fields are intentionally not allowed in anonymous SignalSession answers.
  // If identity/contact becomes necessary, it belongs in the later explicit handoff.
  var PROHIBITED_ANONYMOUS_FIELDS = Object.freeze([
    'name', 'firstName', 'lastName', 'email', 'phone', 'mobile',
    'dateOfBirth', 'dob', 'ssn', 'socialSecurityNumber', 'driverLicense',
    'medicalHistory', 'healthInformation', 'vin', 'fullAddress'
  ]);

  function clean(value, max) {
    return String(value == null ? '' : value)
      .replace(/[\u0000-\u001F\u007F]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, max || 180);
  }

  function token(value, max) {
    return clean(value, max || 100)
      .toLowerCase()
      .replace(/[\s-]+/g, '_')
      .replace(/[^a-z0-9_.:]/g, '')
      .slice(0, max || 100);
  }

  function iso(value) {
    var time = Date.parse(value || '');
    return Number.isFinite(time) ? new Date(time).toISOString() : '';
  }

  function safeObject(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  }

  function clone(value) {
    try { return JSON.parse(JSON.stringify(value)); } catch (_) { return null; }
  }

  function isAllowedCanonicalField(value) {
    return CANONICAL_SIGNAL_FIELDS.indexOf(value) !== -1;
  }

  function validateOption(option) {
    var item = safeObject(option);
    var code = token(item.code, 80);
    if (!code) throw new TypeError('Signal option requires a stable code.');
    var label = clean(item.label, 160);
    if (!label) throw new TypeError('Signal option requires a label.');
    var signals = safeObject(item.signals);
    Object.keys(signals).forEach(function (key) {
      if (!isAllowedCanonicalField(key)) throw new TypeError('Unsupported canonical signal field: ' + key);
      if (PROHIBITED_ANONYMOUS_FIELDS.indexOf(key) !== -1) throw new TypeError('PII is not allowed in SignalSession answers.');
    });
    return Object.freeze({
      code: code,
      label: label,
      next: token(item.next, 100),
      signals: Object.freeze(Object.keys(signals).reduce(function (out, key) {
        out[key] = clean(signals[key], 160);
        return out;
      }, {}))
    });
  }

  function validateQuestion(question) {
    var item = safeObject(question);
    var id = token(item.id, 100);
    if (!id) throw new TypeError('Signal question requires an id.');
    var prompt = clean(item.prompt, 240);
    if (!prompt) throw new TypeError('Signal question requires a prompt.');
    var canonicalField = clean(item.canonicalField, 80);
    if (canonicalField && !isAllowedCanonicalField(canonicalField)) {
      throw new TypeError('Unsupported canonical field: ' + canonicalField);
    }
    var options = Array.isArray(item.options) ? item.options.map(validateOption) : [];
    if (!options.length) throw new TypeError('Signal question requires options.');
    var seen = {};
    options.forEach(function (option) {
      if (seen[option.code]) throw new TypeError('Duplicate signal option code: ' + option.code);
      seen[option.code] = true;
    });
    return Object.freeze({
      id: id,
      dimension: token(item.dimension, 40),
      prompt: prompt,
      supportingText: clean(item.supportingText, 280),
      canonicalField: canonicalField,
      options: Object.freeze(options),
      allowBack: item.allowBack !== false,
      version: clean(item.version || '1.0', 40)
    });
  }

  function validateFlow(flow) {
    var item = safeObject(flow);
    var id = token(item.id, 100);
    if (!id) throw new TypeError('Signal flow requires an id.');
    var questions = Array.isArray(item.questions) ? item.questions.map(validateQuestion) : [];
    if (!questions.length) throw new TypeError('Signal flow requires at least one question.');
    var map = {};
    questions.forEach(function (question) {
      if (map[question.id]) throw new TypeError('Duplicate signal question id: ' + question.id);
      map[question.id] = question;
    });
    questions.forEach(function (question) {
      question.options.forEach(function (option) {
        if (option.next && !map[option.next]) throw new TypeError('Unknown next question: ' + option.next);
      });
    });
    var firstQuestionId = token(item.firstQuestionId || questions[0].id, 100);
    if (!map[firstQuestionId]) throw new TypeError('Signal flow firstQuestionId is invalid.');
    return Object.freeze({
      id: id,
      flowVersion: clean(item.flowVersion || '1.0', 40),
      product: token(item.product || 'unknown', 80),
      title: clean(item.title || 'Signal flow', 160),
      description: clean(item.description, 260),
      firstQuestionId: firstQuestionId,
      questions: Object.freeze(questions),
      questionMap: Object.freeze(map),
      completion: Object.freeze({
        eyebrow: clean(item.completion && item.completion.eyebrow || 'Foundation complete', 100),
        title: clean(item.completion && item.completion.title || 'Signal captured.', 180),
        body: clean(item.completion && item.completion.body || 'The Signal Foundation stored the anonymous answers locally.', 320)
      })
    });
  }

  return Object.freeze({
    BUILD: BUILD,
    SCHEMA_VERSION: SCHEMA_VERSION,
    SESSION_TTL_DAYS: SESSION_TTL_DAYS,
    MAX_ANSWERS: MAX_ANSWERS,
    MAX_EVENTS: MAX_EVENTS,
    SESSION_STATES: SESSION_STATES,
    DECISIONS: DECISIONS,
    EVENT_NAMES: EVENT_NAMES,
    ATTRIBUTION_KEYS: ATTRIBUTION_KEYS,
    CANONICAL_SIGNAL_FIELDS: CANONICAL_SIGNAL_FIELDS,
    PROHIBITED_ANONYMOUS_FIELDS: PROHIBITED_ANONYMOUS_FIELDS,
    clean: clean,
    token: token,
    iso: iso,
    safeObject: safeObject,
    clone: clone,
    isAllowedCanonicalField: isAllowedCanonicalField,
    validateOption: validateOption,
    validateQuestion: validateQuestion,
    validateFlow: validateFlow
  });
});
