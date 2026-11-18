/* =========================================================
   雾津日报 · 版面原型
   复用 ../src/data.js 与 ../src/engine.js（window 全局）
   ========================================================= */
(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var stage = $('#stage');
  var panelInner = $('#panelInner');
  var toastEl = $('#toast');
  var overlay = $('#overlay');

  /* ---------------- 舞台缩放 ---------------- */
  function fit() {
    var s = Math.min(window.innerWidth / 1600, window.innerHeight / 900);
    stage.style.transform = 'translate(-50%,-50%) scale(' + s + ')';
  }
  window.addEventListener('resize', fit);
  fit();

  /* ---------------- 图标 ---------------- */
  var ICONS = {
    credibility: '<svg viewBox="0 0 24 24"><path d="M4 10v4l9 4V6z"/><path d="M13 6l5-2v16l-5-2"/><path d="M4 14l1 5h3"/></svg>',
    independence: '<svg viewBox="0 0 24 24"><path d="M12 3l2.4 5.6L20 11l-5.6 2.4L12 19l-2.4-5.6L4 11l5.6-2.4z"/></svg>',
    humanity: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.5-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.5-7 9-7 9z"/></svg>',
    business: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v8M9.5 9.6h4a1.6 1.6 0 0 1 0 3.2h-3a1.6 1.6 0 0 0 0 3.2h4"/></svg>',
    influence: '<svg viewBox="0 0 24 24"><path d="M6 21V4"/><path d="M6 5h11l-2.4 3.6L17 12H6"/></svg>'
  };

  /* ---------------- 运行时状态 ---------------- */
  var epIndex = 0;
  var stepIndex = 0;
  var curEpisode = null;
  var curStep = null;
  var locked = false;
  var lastHeadline = '';
  var typeTimer = null;
  var toastTimer = null;
  var cashShown = 0;

  var NODE_OF_TYPE = { topic: 0, frame: 1, headline: 1, reporter: 2, pressure: 3, twist: 4 };
  var TAG_OF_TYPE = { topic: null, frame: '框架', headline: '标题', reporter: '记者', pressure: '压力', twist: '反转' };
  var PICK_LABEL = {
    topic: '选择此选题', frame: '选择此框架', headline: '选择此标题',
    reporter: '派他前往', pressure: '这样回复', twist: '作此决定'
  };
  var FOOT_RIGHT = {
    topic: '选择将改变今日议程 TOP 3',
    frame: '框架决定读者该怪谁',
    headline: '标题出去，就收不回来',
    reporter: '派谁去，等于表明我们信谁',
    pressure: '这一次，压力有名字',
    twist: '距付印还有四十分钟'
  };
  var SAY = {
    topic: '先敲定头条，印刷厂还等着排版。',
    frame: '同一件事，怎么讲，比讲什么更要紧。',
    headline: '标题出了街，就收不回来了。',
    reporter: '派谁去，等于告诉读者我们信谁。',
    pressure: '电话是打给我的，决定还得你做。',
    twist: '还有四十分钟。你说了算。'
  };

  /* =========================================================
     初始化
     ========================================================= */
  function init() {
    // 设计稿起手数值
    gameState.scores = { credibility: 78, independence: 62, humanity: 85, business: 51, influence: 67 };
    gameState.cash = 80;
    gameState.position = { economic: 12, social: -8 };

    renderStats();
    updateCash(false);
    updateCompass();
    startEpisode();
  }

  /* ---------------- 五维 ---------------- */
  function renderStats() {
    var order = ['credibility', 'independence', 'humanity', 'business', 'influence'];
    $('#stats').innerHTML = order.map(function (k) {
      return '<div class="stat" data-key="' + k + '">' +
        '<span class="ico">' + ICONS[k] + '</span>' +
        '<span class="name">' + DIM_LABELS[k] + '</span>' +
        '<span class="val">' + gameState.scores[k] + '</span>' +
        '<div class="bar"><i style="width:0%"></i></div>' +
        '</div>';
    }).join('');

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        order.forEach(function (k, i) {
          setTimeout(function () {
            var el = $('.stat[data-key="' + k + '"] .bar i');
            if (el) el.style.width = gameState.scores[k] + '%';
          }, 160 + i * 90);
        });
      });
    });
  }

  function updateStats(before) {
    ['credibility', 'independence', 'humanity', 'business', 'influence'].forEach(function (k) {
      var el = $('.stat[data-key="' + k + '"]');
      if (!el) return;
      el.querySelector('.bar i').style.width = gameState.scores[k] + '%';
      var val = el.querySelector('.val');
      val.textContent = gameState.scores[k];
      if (before && before[k] !== gameState.scores[k]) {
        val.classList.remove('bump');
        void val.offsetWidth;
        val.classList.add('bump');
        setTimeout(function () { val.classList.remove('bump'); }, 620);
      }
    });
  }

  /* ---------------- 现金 / 立场 ---------------- */
  function formatMoney(n) {
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function updateCash(animate) {
    var target = gameState.cash * 155;
    var el = $('#cashNum');
    var box = $('#cashBox');

    if (animate) {
      box.classList.remove('flash');
      void box.offsetWidth;
      box.classList.add('flash');
    }

    var from = cashShown || target;
    var start = performance.now();
    var dur = 520;
    function tick(now) {
      var p = Math.min(1, (now - start) / dur);
      var v = from + (target - from) * (1 - Math.pow(1 - p, 3));
      el.textContent = formatMoney(v);
      if (p < 1) requestAnimationFrame(tick);
      else { cashShown = target; el.textContent = formatMoney(target); }
    }
    requestAnimationFrame(tick);
  }

  function updateCompass() {
    var dot = $('#compassDot');
    if (!dot) return;
    var x = 50 + gameState.position.economic * 0.42;
    var y = 26 - gameState.position.social * 0.18;
    dot.setAttribute('cx', Math.max(9, Math.min(91, x)).toFixed(1));
    dot.setAttribute('cy', Math.max(8, Math.min(44, y)).toFixed(1));
  }

  /* ---------------- 台词打字机 ---------------- */
  function say(text) {
    var el = $('#line');
    clearInterval(typeTimer);
    el.textContent = '';
    el.classList.add('caret');
    var i = 0;
    typeTimer = setInterval(function () {
      i++;
      el.textContent = text.slice(0, i);
      if (i >= text.length) {
        clearInterval(typeTimer);
        setTimeout(function () { el.classList.remove('caret'); }, 600);
      }
    }, 34);
  }

  /* =========================================================
     流程
     ========================================================= */
  function startEpisode() {
    curEpisode = GAME_DATA.episodes[epIndex];
    stepIndex = 0;
    lastHeadline = '';
    syncSteps();
    renderStep();
    say(SAY.topic);
  }

  function renderStep() {
    if (stepIndex >= curEpisode.steps.length) { showEpisodeEnd(); return; }
    curStep = curEpisode.steps[stepIndex];
    locked = false;

    var parts = curStep.title.split('·');
    var eyebrow = 'STEP ' + ('0' + (stepIndex + 1)).slice(-2) + ' · ' + parts[0].trim();
    var title = parts.slice(1).join('·').trim() || parts[0].trim();

    panelInner.classList.remove('in');
    panelInner.innerHTML =
      '<div class="step-eyebrow">' + eyebrow + '</div>' +
      '<h2 class="step-title">' + titleChars(title) + '</h2>' +
      '<div class="rule"></div>' +
      '<div class="options">' + curStep.options.map(function (o, i) { return cardHTML(o, i); }).join('') + '</div>' +
      '<div class="panel-foot"><span>' + (curStep.hint || '') + '</span><span>' + (FOOT_RIGHT[curStep.type] || '') + '</span></div>';

    void panelInner.offsetWidth;
    panelInner.classList.add('in');

    panelInner.querySelectorAll('.opt').forEach(function (el) {
      el.addEventListener('click', function () { choose(el.dataset.id); });
    });

    if (SAY[curStep.type]) say(SAY[curStep.type]);
    syncSteps();
  }

  function titleChars(text) {
    return text.split('').map(function (ch, i) {
      return '<span class="ch" style="animation-delay:' + (80 + i * 34) + 'ms">' + (ch === ' ' ? '&nbsp;' : ch) + '</span>';
    }).join('');
  }

  function cardHTML(opt, i) {
    var title = (opt.label || opt.name || '').replace(/[《》]/g, '');
    title = breakTitle(title);

    var sub = opt.sub || opt.angle || opt.question || opt.role || opt.style || '';
    if (!sub && opt.highlight) sub = '突出：' + opt.highlight;

    var quoteSpeaker = '老编';
    var quoteText = '';
    if (opt.bubble && typeof opt.bubble === 'object') {
      quoteSpeaker = opt.bubble.speaker || quoteSpeaker;
      quoteText = opt.bubble.text;
    } else if (typeof opt.bubble === 'string') {
      quoteText = opt.bubble;
    } else if (curStep.type === 'pressure') {
      quoteSpeaker = curStep.from || '来电';
      quoteText = curStep.content || '';
    } else if (curStep.type === 'twist') {
      quoteSpeaker = '电报';
      quoteText = curStep.content || '';
    }

    var facts = [];
    if (opt.facts) facts = opt.facts.slice();
    if (curStep.type === 'frame') {
      facts = ['突出：' + opt.highlight, '弱化：' + opt.downplay];
    } else if (curStep.type === 'reporter') {
      facts = [opt.specialty];
    } else if (curStep.type === 'twist' && opt.note) {
      facts = [opt.note];
    }

    var tag = curStep.type === 'topic' ? (['要闻', '民生', '劳工'][i] || '要闻') : (TAG_OF_TYPE[curStep.type] || '选题');

    return '<article class="opt" data-id="' + opt.id + '">' +
      '<div class="opt-tab">' + tag + '</div>' +
      '<h3 class="opt-title">' + title + '</h3>' +
      '<div class="opt-sub">' + (sub || '') + '</div>' +
      '<div class="opt-body">' +
        '<p class="opt-quote"><b>' + quoteSpeaker + '：</b>' + quoteText + '</p>' +
        (facts.length ? '<div class="opt-facts">' + facts.map(function (f) { return '<span class="opt-fact">' + f + '</span>'; }).join('') + '</div>' : '') +
      '</div>' +
      '<button class="pick"><span class="radio"></span>' + (PICK_LABEL[curStep.type] || '选择') + '</button>' +
      '</article>';
  }

  function breakTitle(t) {
    if (t.length < 12) return t;
    var at = t.indexOf('，');
    if (at < 0 || at > 14) return t;
    if (t.length - at - 1 <= 9) return t.slice(0, at + 1) + '<br>' + t.slice(at + 1);
    var mid = Math.ceil(t.length / 2);
    return t.slice(0, mid) + '<br>' + t.slice(mid);
  }

  /* ---------------- 选择 ---------------- */
  function choose(id) {
    if (locked) return;
    var opt = curStep.options.filter(function (o) { return o.id === id; })[0];
    if (!opt) return;
    locked = true;

    panelInner.querySelectorAll('.opt').forEach(function (el) {
      if (el.dataset.id === id) el.classList.add('chosen');
      else el.classList.add('dim');
    });

    var before = {
      credibility: gameState.scores.credibility, independence: gameState.scores.independence,
      humanity: gameState.scores.humanity, business: gameState.scores.business,
      influence: gameState.scores.influence
    };

    var result = applyDelta(opt.delta);
    logChoice(curEpisode, curStep, opt, result);

    if (curStep.type === 'headline') lastHeadline = (opt.label || '').replace(/[《》]/g, '');

    updateStats(before);
    updateCash(true);
    updateCompass();

    setTimeout(function () { showToast(result); }, 240);

    stepIndex++;
    setTimeout(function () {
      if (gameState.cash <= 0) { showStopped(); return; }
      renderStep();
    }, 760);
  }

  /* ---------------- 反馈条 ---------------- */
  function showToast(result) {
    var html = '';
    if (result.thresholdLine) {
      html = '<span class="toast-line">' + result.thresholdLine + '</span>';
    } else if (result.shown.length) {
      html = result.shown.map(function (item) {
        return '<span class="kv"><em>' + item.label + '</em>' + (item.value > 0 ? '+' : '−') + Math.abs(item.value) + '</span>';
      }).join('<span class="dot">·</span>');
    } else {
      html = '<span class="toast-line">这一版，什么也没有改变。</span>';
    }
    notify(html);
  }

  function notify(html) {
    toastEl.innerHTML = html;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2000);
  }

  /* ---------------- 五步节点 ---------------- */
  function syncSteps() {
    var node = NODE_OF_TYPE[curStep ? curStep.type : 'topic'] || 0;
    document.querySelectorAll('.step').forEach(function (el) {
      var n = Number(el.dataset.step);
      el.classList.toggle('done', n < node);
      el.classList.toggle('active', n === node);
    });
  }

  /* =========================================================
     每期结束 / 停印 / 三天结算
     ========================================================= */
  function showEpisodeEnd() {
    document.querySelectorAll('.step').forEach(function (el) { el.classList.add('done'); });
    snapshotEpisode(curEpisode);

    var isLast = epIndex >= GAME_DATA.episodes.length - 1;
    var headline = lastHeadline || (curEpisode.steps[0].options[0].label || '').replace(/[《》]/g, '');

    panelInner.innerHTML =
      '<div class="end-wrap">' +
        '<div class="step-eyebrow">付印 · PRESS RUN</div>' +
        '<h2 class="step-title">报纸开印了</h2>' +
        '<div class="printed">' + headline + '</div>' +
        '<p class="end-note">印刷机的声音隔着两层楼都能听见。你回到办公室，桌上已经堆着明天的素材。窗外的雾散了一点，港口的方向有汽笛声。</p>' +
        '<button class="btn-next">' + (isLast ? '收工 · 看这三天的结算 →' : '进入下一期 →') + '</button>' +
      '</div>';

    $('.btn-next').addEventListener('click', function () {
      epIndex++;
      if (epIndex >= GAME_DATA.episodes.length) { showFinal(); return; }
      startEpisode();
    });

    say('这一版，出去了。');
  }

  function showStopped() {
    panelInner.innerHTML =
      '<div class="end-wrap">' +
        '<div class="step-eyebrow">停印 · STOP PRESS</div>' +
        '<h2 class="step-title">这一期没能印出来</h2>' +
        '<p class="end-note">账上已经没有钱了。纸厂的账、印刷厂的工资、记者的差旅，全都停在那里。<br><br>《雾津日报》第一次在早晨没有出现在报摊上。</p>' +
        '<button class="btn-next">看这三天的结算 →</button>' +
      '</div>';
    $('.btn-next').addEventListener('click', function () { openReport(); });
    say('机器停了。');
  }

  function showFinal() {
    say('三天，就这么过去了。');
    openReport();
  }

  /* =========================================================
     工具按钮 / 日志
     ========================================================= */
  $('#btnSave').addEventListener('click', function () {
    notify('<span class="toast-line">版面进度已记录。</span>');
  });

  $('#btnSetting').addEventListener('click', function () {
    notify('<span class="toast-line">设置面板尚未开放。</span>');
  });

  $('#btnLog').addEventListener('click', function () {
    var body = $('#logBody');
    if (!gameState.choiceLog.length) {
      body.innerHTML = '<div class="log-empty">今天的编辑日志还是空白的。</div>';
    } else {
      body.innerHTML = gameState.choiceLog.map(function (c) {
        return '<div class="log-item">' +
          '<div class="meta">' + c.episode + ' · ' + c.stepTitle + '</div>' +
          '<div class="what">' + c.label + '</div>' +
          '<div class="chg">' + (c.thresholdLine || c.toast || '—') + '</div>' +
          '</div>';
      }).join('');
    }
    overlay.classList.add('open');
  });

  function closeOverlay() { overlay.classList.remove('open'); }
  $('#overlayClose').addEventListener('click', closeOverlay);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeOverlay(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeOverlay(); });

  /* ---------------- go ---------------- */
  init();
})();
