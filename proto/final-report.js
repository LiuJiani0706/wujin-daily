/* =========================================================
   终版 · 媒体画像
   读取 window.gameState（engine.js），把三天里的选择渲染成一张结算报纸
   ========================================================= */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var layer, stage;

  var DIMS = [
    { key: 'credibility',  name: '公信力',
      ico: '<path d="M10 2.5l6 2.3v4.6c0 3.6-3 6.2-6 7.6-3-1.4-6-4-6-7.6V4.8z"/><path d="M7.4 9.8l1.8 1.8 3.4-3.4"/>' },
    { key: 'independence', name: '独立度',
      ico: '<path d="M10 3v14M4 17h12M3 7h14"/><circle cx="10" cy="4.2" r="1.4"/><path d="M3 7l-1.4 3.4h2.8zM17 7l-1.4 3.4h2.8z"/>' },
    { key: 'humanity',     name: '人文关怀',
      ico: '<path d="M10 17c-4.6-3.2-6.4-6.2-5.2-8.8C5.6 5.8 8.4 6 10 8.2 11.6 6 14.4 5.8 15.2 8.2c1.2 2.6-.6 5.6-5.2 8.8z"/>' },
    { key: 'business',     name: '商业成功',
      ico: '<circle cx="10" cy="10" r="7"/><path d="M7.6 6.6L10 9.6l2.4-3M10 9.6V14M7.8 11.4h4.4"/>' },
    { key: 'influence',    name: '影响力',
      ico: '<path d="M5 3v14"/><path d="M5 4h9l-2.6 3.6L14 11H5z"/>' }
  ];

  function el(t, a, p) {
    var e = document.createElementNS(NS, t);
    for (var k in a) e.setAttribute(k, a[k]);
    if (p) p.appendChild(e);
    return e;
  }

  function money(n) {
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function impact(c) {
    var m = (c.toast || '').match(/[+\u2212-]\d+/g) || [];
    return m.reduce(function (n, x) { return n + Math.abs(parseInt(x.replace('\u2212', '-'), 10)); }, 0);
  }

  function axisText(n) {
    return (n > 0 ? '+' : '−') + Math.abs(n);
  }

  /* ---------------- 五维 ---------------- */
  function drawRail(gs) {
    document.getElementById('rlRail').innerHTML = DIMS.map(function (d) {
      var v = gs.scores[d.key];
      return '<div class="rl-stat rl-chip' + (v < 30 ? ' alert' : '') + '">' +
        '<svg class="ico" viewBox="0 0 20 20">' + d.ico + '</svg>' +
        '<div class="top"><span class="name">' + d.name + '</span><span class="val">' + v + '</span></div>' +
        '<div class="bar"><i style="--w:' + v + '%"></i></div></div>';
    }).join('');

  }

  function drawRadar(gs) {
    var svg = document.getElementById('rlRadar');
    svg.innerHTML = '';
    var vals = DIMS.map(function (d) { return gs.scores[d.key]; });
    var cx = 200, cy = 150, R = 104, n = 5;
    function pt(i, r) {
      var a = (-90 + i * 360 / n) * Math.PI / 180;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    }
    for (var ring = 1; ring <= 4; ring++) {
      var d = '';
      for (var i = 0; i < n; i++) {
        var p = pt(i, R * ring / 4);
        d += (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1);
      }
      el('path', { d: d + 'Z', fill: 'none', stroke: '#7a2a22', 'stroke-width': 1, opacity: ring === 4 ? .42 : .2 }, svg);
    }
    for (var i = 0; i < n; i++) {
      var p = pt(i, R);
      el('line', { x1: cx, y1: cy, x2: p[0], y2: p[1], stroke: '#7a2a22', 'stroke-width': 1, opacity: .2 }, svg);
    }
    var poly = '';
    for (var i = 0; i < n; i++) {
      var p = pt(i, R * vals[i] / 100);
      poly += (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1);
    }
    el('path', { d: poly + 'Z', fill: 'rgba(122,42,34,.18)', stroke: '#7a2a22', 'stroke-width': 1.8 }, svg);
    for (var i = 0; i < n; i++) {
      var p = pt(i, R * vals[i] / 100);
      el('circle', { cx: p[0], cy: p[1], r: 3.4, fill: '#7a2a22' }, svg);
      var lp = pt(i, R + 26);
      el('text', {
        x: lp[0], y: lp[1] + 5, 'text-anchor': 'middle', 'font-size': 13.5,
        'font-family': 'Songti SC, serif', fill: '#3a2a1b', 'letter-spacing': 1
      }, svg).textContent = DIMS[i].name;
    }
  }

  /* ---------------- 立场四象限 ---------------- */
  function drawQuad(gs) {
    var q = document.getElementById('rlQuad');
    q.innerHTML = '';
    var mx = 200, my = 158, w = 118, h = 104;
    el('rect', { x: mx - w, y: my - h, width: w * 2, height: h * 2, fill: 'rgba(122,42,34,.04)', stroke: '#7a2a22', 'stroke-width': 1.2, opacity: .5 }, q);
    el('line', { x1: mx, y1: my - h, x2: mx, y2: my + h, stroke: '#7a2a22', 'stroke-width': .9, opacity: .28 }, q);
    el('line', { x1: mx - w, y1: my, x2: mx + w, y2: my, stroke: '#7a2a22', 'stroke-width': .9, opacity: .28 }, q);

    [[mx - w / 2, my - h / 2, '建制喉舌'], [mx + w / 2, my - h / 2, '商界传声'],
     [mx - w / 2, my + h / 2, '民间号角'], [mx + w / 2, my + h / 2, '自由瞭望']]
      .forEach(function (l) {
        el('text', {
          x: l[0], y: l[1], 'text-anchor': 'middle', 'font-size': 12.5,
          'font-family': 'Songti SC, serif', fill: '#7a2a22', opacity: .55, 'letter-spacing': 1
        }, q).textContent = l[2];
      });

    el('text', { x: mx, y: my - h - 12, 'text-anchor': 'middle', 'font-size': 13, 'font-family': 'Songti SC, serif', fill: '#5b4630', 'letter-spacing': 2 }, q).textContent = '秩序';
    el('text', { x: mx, y: my + h + 22, 'text-anchor': 'middle', 'font-size': 13, 'font-family': 'Songti SC, serif', fill: '#5b4630', 'letter-spacing': 2 }, q).textContent = '自由';
    el('text', { x: mx - w - 9, y: my + 4.5, 'text-anchor': 'end', 'font-size': 13, 'font-family': 'Songti SC, serif', fill: '#5b4630', 'letter-spacing': 1 }, q).textContent = '再分配';
    el('text', { x: mx + w + 9, y: my + 4.5, 'text-anchor': 'start', 'font-size': 13, 'font-family': 'Songti SC, serif', fill: '#5b4630', 'letter-spacing': 1 }, q).textContent = '市场';

    var ex = Math.max(-100, Math.min(100, gs.position.economic)) / 100;
    var sy = Math.max(-100, Math.min(100, gs.position.social)) / 100;
    var px = mx + ex * w, py = my + sy * h;

    el('line', { x1: mx, y1: my, x2: px, y2: py, stroke: '#8d1f18', 'stroke-width': 1, 'stroke-dasharray': '3 3', opacity: .45 }, q);
    el('circle', { cx: px, cy: py, r: 12, fill: 'none', stroke: '#8d1f18', 'stroke-width': 1, opacity: .35 }, q);
    el('circle', { cx: px, cy: py, r: 4.6, fill: '#8d1f18' }, q);
    var right = px < mx + 30;
    el('text', {
      x: right ? px + 14 : px - 14, y: py + 19, 'text-anchor': right ? 'start' : 'end',
      'font-size': 12, 'font-family': 'Songti SC, serif', fill: '#8d1f18', 'letter-spacing': 1
    }, q).textContent = '你在这里';
  }

  /* ---------------- 三天里最关键的一步 ---------------- */
  function drawDays(gs) {
    var log = gs.choiceLog || [];
    var snaps = gs.snapshots || [];
    var html = GAME_DATA.episodes.map(function (ep, i) {
      var items = log.filter(function (c) { return c.episode === ep.no; });
      var last = items[0];
      items.forEach(function (c) {
        if (impact(c) >= impact(last)) last = c;
      });
      var snap = snaps[i];
      if (!items.length) {
        return '<div class="rl-day rl-chip void">' +
          '<div class="no">' + ep.no + '</div>' +
          '<div class="act">这一期没能付印。</div>' +
          '<div class="fb">' + (gs.stopped ? '账上没钱了' : '三天没走完') + '</div></div>';
      }
      var scene = (snap && snap.title) || ep.title || '';
      return '<div class="rl-day rl-chip">' +
        '<div class="no">' + ep.no + (scene ? ' · ' + scene : '') + '</div>' +
        '<div class="act">' + last.label + '</div>' +
        '<div class="fb">' + (last.thresholdLine || last.toast || '这一版，什么也没有改变。') + '</div></div>';
    }).join('');
    document.getElementById('rlDays').innerHTML = html;
  }

  /* ---------------- 主渲染 ---------------- */
  function render(gs) {
    gs = gs || window.gameState;
    if (!gs) return;

    gs.position = gs.position || { economic: 0, social: 0 };
    gs.scores = gs.scores || {};
    DIMS.forEach(function (d) {
      if (typeof gs.scores[d.key] !== 'number') gs.scores[d.key] = 50;
    });

    var style = window.getNewspaperTitle ? getNewspaperTitle() : { title: '地方良心', description: '' };
    var title = style.title;
    var e = gs.position.economic, s = gs.position.social;
    var centered = Math.abs(e) < 20 && Math.abs(s) < 20;
    var moneyText = money(gs.cash * 155);
    var stopped = !!gs.stopped;
    var signed = (gs.choiceLog || []).length;

    document.getElementById('rlRankName').textContent = title;
    document.getElementById('rlRankSub').textContent = centered ? '四轴居中'
      : ((e >= 0 ? '市场' : '再分配') + ' + ' + (s >= 0 ? '自由' : '秩序'));
    document.getElementById('rlRankDesc').textContent = style.description || '';
    document.getElementById('rlQuote').textContent = getHistoricalVerdict ? getHistoricalVerdict() : '';

    document.getElementById('rlCashNum').textContent = moneyText;
    document.getElementById('rlSeal').innerHTML = stopped ? '停<br>印' : '已<br>付印';
    document.getElementById('rlIssue').textContent = '第 112 年 · 第 1 期 · ' + (stopped ? '未能付印' : '已付印');
    document.getElementById('rlFootLeft').textContent =
      (stopped ? '两天半' : '三天') + ' · ' + signed + ' 次签字 · 停印 ' + (stopped ? 1 : 0) + ' 次';

    var best = DIMS[0], worst = DIMS[0];
    DIMS.forEach(function (d) {
      if (gs.scores[d.key] > gs.scores[best.key]) best = d;
      if (gs.scores[d.key] < gs.scores[worst.key]) worst = d;
    });
    document.getElementById('rlCapRadar').innerHTML =
      '五个角一起决定报格：<b>' + best.name + ' ' + gs.scores[best.key] + '</b> 最高，<b>' +
      worst.name + ' ' + gs.scores[worst.key] + '</b> 最低。';
    document.getElementById('rlCapQuad').innerHTML = centered
      ? '市场 <b>' + axisText(e) + '</b>、秩序 <b>' + axisText(s) + '</b>：你始终没把自己押给任何一方。'
      : '市场 <b>' + axisText(e) + '</b>、秩序 <b>' + axisText(s) + '</b>：你把自己押在了「<b>' +
        document.getElementById('rlRankSub').textContent + '</b>」这一角。';

    drawRail(gs);
    drawRadar(gs);
    drawQuad(gs);
    drawDays(gs);
  }

  /* ---------------- 舞台缩放 ---------------- */
  function fit() {
    var s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.setProperty('--rls', s);
  }

  /* ---------------- 名片 / 分享 ---------------- */
  function summary() {
    var gs = window.gameState || {};
    var t = (window.getNewspaperTitle ? getNewspaperTitle() : { title: '' }).title;
    var scores = gs.scores || {};
    return '《雾津日报》· 报老板的一天\n报格：' + t +
      '\n公信 ' + scores.credibility + ' · 独立 ' + scores.independence +
      ' · 人文 ' + scores.humanity + ' · 商业 ' + scores.business +
      ' · 影响 ' + scores.influence +
      '\n账上 ' + money((gs.cash || 0) * 155) + ' 元，三天 ' + ((gs.choiceLog || []).length) + ' 次签字。';
  }

  function flash(btn, text) {
    var span = btn.querySelector('.lb');
    var old = span.textContent;
    span.textContent = text;
    setTimeout(function () { span.textContent = old; }, 1400);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    var ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    return Promise.resolve();
  }

  function bind() {
    var btnCard = document.getElementById('rlBtnCard');
    var btnAgain = document.getElementById('rlBtnAgain');
    var btnShare = document.getElementById('rlBtnShare');

    btnCard.addEventListener('click', function () {
      copyText(summary()).then(function () { flash(btnCard, '已复制'); });
    });

    btnAgain.addEventListener('click', function () {
      location.reload();
    });

    btnShare.addEventListener('click', function () {
      var text = summary();
      if (navigator.share) {
        navigator.share({ title: '雾津日报 · 报老板的一天', text: text }).catch(function () {});
      } else {
        copyText(text).then(function () { flash(btnShare, '已复制'); });
      }
    });
  }

  function open() {
    layer.classList.add('open');
    render(window.gameState);
    fit();
  }

  function close() {
    layer.classList.remove('open');
  }

  document.addEventListener('DOMContentLoaded', function () {
    layer = document.getElementById('reportLayer');
    stage = document.getElementById('rlStage');
    if (!layer || !stage) return;
    window.addEventListener('resize', fit);
    bind();
    fit();
  });

  window.openReport = open;
  window.closeReport = close;
  window.renderReport = render;
})();
