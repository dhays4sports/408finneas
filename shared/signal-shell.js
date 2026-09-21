(function (root, factory) {
  'use strict';
  var api = factory(
    root,
    root.Farmers408SignalContract,
    root.Farmers408SignalFlowRegistry,
    root.Farmers408SignalSession,
    root.Farmers408SignalAnalytics,
    root.Farmers408SignalDecisionLocal,
    root.Farmers408SignalDecisionRemote
  );
  root.Farmers408SignalShell = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis, function (root, contract, registry, sessionApi, analytics, localDecision, remoteDecision) {
  'use strict';

  var BUILD = '408-SIGNAL-DECISION-BRIDGE-1.0';
  var mounted = false;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }

  function focusHeading(container) {
    var heading = container.querySelector('[data-signal-question-title], [data-signal-complete-title], [data-signal-error-title]');
    if (!heading) return;
    heading.setAttribute('tabindex', '-1');
    try { heading.focus({ preventScroll: true }); } catch (_) { heading.focus(); }
  }

  function dispatchSession(session) {
    try {
      if (root.dispatchEvent && root.CustomEvent) root.dispatchEvent(new root.CustomEvent('408farmers:signal-session-updated', { detail: contract.clone(session) }));
    } catch (_) {}
  }

  function progressCopy(session) {
    var answered = session.answers ? session.answers.length : 0;
    if (answered === 0) return 'One quick question';
    if (answered === 1) return 'One more thing';
    return 'A little more context';
  }

  function install(options) {
    if (mounted) return null;
    if (!contract || !registry || !sessionApi || !analytics || !localDecision) throw new Error('Signal Foundation dependencies are unavailable.');
    var opts = options || {}, container = root.document && root.document.querySelector(opts.selector || '[data-signal-shell]');
    if (!container) return null;

    var flowId = container.getAttribute('data-signal-flow') || opts.flowId || 'foundation_demo';
    var flow = registry.get(flowId);
    if (!flow) throw new Error('Unknown Signal flow: ' + flowId);

    var params = new URLSearchParams(root.location && root.location.search || '');
    var decisionMode = params.get('decision') === 'remote' ? 'remote' : 'local';
    if (decisionMode === 'remote' && !remoteDecision) throw new Error('Remote Signal Decision client is unavailable.');
    var decisionAdapter = decisionMode === 'remote' ? remoteDecision : localDecision;
    var decisionEndpoint = container.getAttribute('data-signal-decision-url') || opts.decisionEndpoint || '';
    var forceNew = params.get('fresh') === '1';
    var loaded = sessionApi.loadOrCreate(flow, { forceNew: forceNew, location: root.location, document: root.document });
    var session = loaded.session;
    var activeQuestion = null;
    var busy = false;
    var resumePending = loaded.resumed && session.state !== 'complete' && !forceNew && (session.answers || []).length > 0;
    mounted = true;

    analytics.emit(loaded.created ? 'signal_session_started' : 'signal_session_resumed', session);

    function modeLabel() {
      return decisionMode === 'remote' ? 'CoverageFit decision mode' : 'Local foundation mode';
    }

    function renderResume() {
      container.innerHTML = '<section class="signal-card signal-resume" aria-labelledby="signal-resume-title">' +
        '<span class="signal-eyebrow">' + esc(modeLabel()) + '</span>' +
        '<h1 id="signal-resume-title">Continue where you left off?</h1>' +
        '<p>Your anonymous answers are still on this device. Continue the lab, or start a fresh session. No lead or contact record has been created.</p>' +
        '<div class="signal-actions"><button type="button" class="signal-choice signal-choice--primary" data-signal-resume>Continue</button>' +
        '<button type="button" class="signal-text-action" data-signal-restart>Start over</button></div></section>';
      focusHeading(container);
    }

    function currentQuestion() {
      if (activeQuestion && activeQuestion.id === session.currentQuestionId) return activeQuestion;
      return flow.questionMap[session.currentQuestionId] || null;
    }

    function renderQuestion(question) {
      var answered = (session.answers || []).length;
      var back = answered && question.allowBack !== false ? '<button class="signal-back" type="button" data-signal-back aria-label="Go back to the previous signal question">← Back</button>' : '<span></span>';
      var choices = question.options.map(function (option) {
        return '<button class="signal-choice" type="button" data-signal-option="' + esc(option.code) + '"><span>' + esc(option.label) + '</span><span aria-hidden="true">→</span></button>';
      }).join('');
      container.innerHTML = '<section class="signal-card" aria-labelledby="signal-question-title">' +
        '<div class="signal-topline">' + back + '<span class="signal-progress">' + esc(progressCopy(session)) + '</span></div>' +
        '<span class="signal-eyebrow">' + esc(modeLabel()) + '</span>' +
        '<h1 id="signal-question-title" data-signal-question-title>' + esc(question.prompt) + '</h1>' +
        (question.supportingText ? '<p class="signal-supporting">' + esc(question.supportingText) + '</p>' : '') +
        '<div class="signal-choice-list" role="group" aria-label="' + esc(question.prompt) + '">' + choices + '</div>' +
        '<div class="signal-meta"><span>Anonymous on this device</span><span>Build ' + esc(BUILD) + '</span></div>' +
        '<p class="signal-status" aria-live="polite" data-signal-status></p>' +
        '</section>';
      analytics.emit('signal_question_viewed', session, { questionId: question.id });
      if (answered) analytics.emit('signal_next_question_shown', session, { questionId: question.id });
      focusHeading(container);
    }

    function renderComplete(decision) {
      var c = decision.publicExperience || flow.completion;
      var rows = Object.keys(session.canonicalSignals || {}).filter(function (key) {
        return key !== 'product' || session.canonicalSignals[key] !== 'foundation_demo';
      }).map(function (key) {
        return '<li><span>' + esc(key) + '</span><strong>' + esc(session.canonicalSignals[key]) + '</strong></li>';
      }).join('');
      var actionText = c && Array.isArray(c.actions) && c.actions.length
        ? '<div class="signal-foundation-note"><strong>Future handoff actions</strong><span>' + esc(c.actions.join(' · ')) + ' — intentionally not wired in this bridge lab.</span></div>'
        : '';
      container.innerHTML = '<section class="signal-card signal-complete" aria-labelledby="signal-complete-title">' +
        '<span class="signal-eyebrow">' + esc(c && c.eyebrow || modeLabel()) + '</span>' +
        '<h1 id="signal-complete-title" data-signal-complete-title>' + esc(c && (c.title || c.headline) || 'Signal evaluated.') + '</h1>' +
        '<p>' + esc(c && c.body || 'The anonymous Signal Session was evaluated.') + '</p>' +
        '<ul class="signal-summary" aria-label="Captured canonical signals">' + rows + '</ul>' +
        '<div class="signal-foundation-note"><strong>Decision</strong><span>' + esc(decision.decision) + ' · No lead or contact permission was created.</span></div>' +
        actionText +
        '<div class="signal-actions"><button type="button" class="signal-choice signal-choice--primary" data-signal-restart>Run the lab again</button>' +
        '<button type="button" class="signal-text-action" data-signal-inspect>Inspect local session</button></div>' +
        '<pre class="signal-inspector" data-signal-inspector hidden></pre>' +
        '</section>';
      analytics.emit(decision.decision === 'OFFER_HUMAN' ? 'signal_handoff_shown' : 'signal_session_completed', session, { decision: decision.decision });
      focusHeading(container);
    }

    function renderError(error) {
      container.innerHTML = '<section class="signal-card signal-error" aria-labelledby="signal-error-title">' +
        '<span class="signal-eyebrow">' + esc(modeLabel()) + '</span>' +
        '<h1 id="signal-error-title" data-signal-error-title>The next step could not load.</h1>' +
        '<p>Your anonymous answers are still on this device. Remote mode does not silently fall back to local decisions because that would hide integration failures.</p>' +
        '<div class="signal-foundation-note"><strong>Error</strong><span>' + esc(error && (error.code || error.message) || 'signal_decision_failed') + '</span></div>' +
        '<div class="signal-actions"><button type="button" class="signal-choice signal-choice--primary" data-signal-retry>Retry decision</button>' +
        '<button type="button" class="signal-text-action" data-signal-inspect>Inspect local session</button></div>' +
        '<pre class="signal-inspector" data-signal-inspector hidden></pre>' +
        '</section>';
      analytics.emit('signal_error', session, { decision: session.decision && session.decision.decision || '' });
      focusHeading(container);
    }

    async function evaluateAndRender() {
      if (busy) return;
      busy = true;
      try {
        var decision = await Promise.resolve(decisionAdapter.evaluate(flow, session, { endpoint: decisionEndpoint }));
        if (!decision || contract.DECISIONS.indexOf(decision.decision) === -1) throw new Error('Signal Decision returned an unsupported state.');
        activeQuestion = decision.decision === 'ASK_ONE_SIGNAL'
          ? (decision.nextQuestion || flow.questionMap[decision.nextQuestionId] || null)
          : null;
        if (decision.decision === 'ASK_ONE_SIGNAL' && !activeQuestion) throw new Error('Signal Decision did not provide a renderable next question.');
        session.currentQuestionId = activeQuestion ? activeQuestion.id : '';
        session.decision = {
          status: decision.mode,
          decision: decision.decision,
          nextQuestionId: decision.nextQuestionId || '',
          evaluatedAt: decision.evaluatedAt
        };
        session.state = decision.state || (decision.decision === 'OFFER_HUMAN' ? 'qualified_signal' : 'signal_developing');
        session = sessionApi.save(session, flow);
        analytics.emit('signal_decision_received', session, { decision: decision.decision, questionId: decision.nextQuestionId || '' });
        dispatchSession(session);
        if (decision.decision === 'ASK_ONE_SIGNAL') renderQuestion(activeQuestion);
        else renderComplete(decision);
        try {
          if (root.dispatchEvent && root.CustomEvent) root.dispatchEvent(new root.CustomEvent('408farmers:signal-decision', { detail: decision }));
        } catch (_) {}
      } catch (error) {
        renderError(error);
      } finally {
        busy = false;
      }
    }

    async function choose(button) {
      if (busy) return;
      var question = currentQuestion();
      if (!question) return;
      var code = button.getAttribute('data-signal-option');
      button.disabled = true;
      try {
        var result = decisionMode === 'remote'
          ? sessionApi.answerQuestion(session, flow, question, code)
          : sessionApi.answer(session, flow, question.id, code);
        session = result.session;
        analytics.emit(result.changed ? 'signal_answer_changed' : 'signal_answered', session, { questionId: question.id, optionCode: result.option.code });
        await evaluateAndRender();
      } catch (error) {
        button.disabled = false;
        var status = container.querySelector('[data-signal-status]');
        if (status) status.textContent = 'That answer could not be saved. Please try again.';
        analytics.emit('signal_error', session, { questionId: question.id });
      }
    }

    container.addEventListener('click', function (event) {
      var option = event.target.closest && event.target.closest('[data-signal-option]');
      if (option) { void choose(option); return; }
      var back = event.target.closest && event.target.closest('[data-signal-back]');
      if (back && !busy) {
        analytics.emit('signal_back_used', session, { questionId: session.currentQuestionId });
        session = sessionApi.goBack(session, flow);
        activeQuestion = null;
        void evaluateAndRender();
        return;
      }
      var resume = event.target.closest && event.target.closest('[data-signal-resume]');
      if (resume) { resumePending = false; void evaluateAndRender(); return; }
      var retry = event.target.closest && event.target.closest('[data-signal-retry]');
      if (retry) { void evaluateAndRender(); return; }
      var restart = event.target.closest && event.target.closest('[data-signal-restart]');
      if (restart && !busy) {
        analytics.emit('signal_session_restarted', session);
        session = sessionApi.restart(flow, { location: root.location, document: root.document });
        activeQuestion = null;
        dispatchSession(session);
        void evaluateAndRender();
        return;
      }
      var inspect = event.target.closest && event.target.closest('[data-signal-inspect]');
      if (inspect) {
        var panel = container.querySelector('[data-signal-inspector]');
        if (panel) { panel.hidden = !panel.hidden; panel.textContent = JSON.stringify(session, null, 2); }
      }
    });

    if (resumePending) renderResume(); else void evaluateAndRender();

    return Object.freeze({
      flow: flow,
      decisionMode: decisionMode,
      getSession: function () { return contract.clone(session); },
      restart: function () {
        session = sessionApi.restart(flow, { location: root.location, document: root.document });
        activeQuestion = null;
        void evaluateAndRender();
      }
    });
  }

  function autoInstall() {
    if (root.document && root.document.querySelector('[data-signal-shell]')) install();
  }

  if (root.document) {
    if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded', autoInstall, { once: true });
    else autoInstall();
  }

  return Object.freeze({ BUILD: BUILD, install: install });
});
