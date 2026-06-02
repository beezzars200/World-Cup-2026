(function () {
  'use strict';

  var WEB3FORMS_KEY = '90ae0c98-630b-4354-829a-4d338db840b5';
  var REVOLUT_URL  = 'https://revolut.me/brianos';
  var ENTRY_FEE    = '€20';
  // SHA-256 of the buster password. Change password by updating this hash.
  // Generate a new hash: https://emn178.github.io/online-tools/sha256.html
  var BUSTER_PASS_HASH = '14dc8f49fa90a3bc7aeaa341e9c70a89528728b0c0e0a172d19ddf35f770a26b';
  var BUSTER_KEY = 'wcBusterUnlocked';

  var state = {
    tz: 'Europe/Dublin',
    tab: 'groups',
    statusFilter: 'all',
    groupFilter: 'all',
    standings: {},
    lastUpdated: null,
    sweepTeam: null,
  };

  document.addEventListener('DOMContentLoaded', function () {
    populateCountrySelector();
    bindTabButtons();
    bindScheduleFilters();
    bindBusterCtas();
    fetchResults().then(function () {
      computeAllStandings();
      renderLiveNow();
      renderCurrentTab();
      setInterval(function () {
        fetchResults().then(function () {
          computeAllStandings();
          renderLiveNow();
          renderCurrentTab();
        });
      }, 60000);
    });
  });

  // ── COUNTRY SELECTOR ──────────────────────────────────────────────────────
  function populateCountrySelector() {
    var sel = document.getElementById('countrySelect');
    var regionOrder = ['Europe', 'North America', 'South America', 'Africa', 'Middle East', 'Asia', 'Oceania'];
    var grouped = {};
    regionOrder.forEach(function (r) { grouped[r] = []; });
    WC.TIMEZONES.forEach(function (tz) {
      if (grouped[tz.region]) grouped[tz.region].push(tz);
    });
    regionOrder.forEach(function (region) {
      var entries = grouped[region];
      if (!entries.length) return;
      var grp = document.createElement('optgroup');
      grp.label = region;
      entries.forEach(function (tz) {
        var opt = document.createElement('option');
        opt.value = tz.tz;
        opt.textContent = tz.flag + ' ' + tz.name;
        if (tz.default) { opt.selected = true; state.tz = tz.tz; }
        grp.appendChild(opt);
      });
      sel.appendChild(grp);
    });
    sel.addEventListener('change', function () {
      state.tz = sel.value;
      renderCurrentTab();
    });
  }

  // ── RESULTS FETCH ─────────────────────────────────────────────────────────
  function fetchResults() {
    return fetch('data/results.json?_=' + Date.now())
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !data.matches) return;
        state.lastUpdated = data.lastUpdated || null;
        var updEl = document.getElementById('lastUpdated');
        if (updEl && state.lastUpdated) {
          updEl.textContent = 'Data last updated: ' + formatDateTimeDisplay(new Date(state.lastUpdated));
        }
        var matches = data.matches;
        WC.GROUP_MATCHES.forEach(function (m) {
          if (matches[m.id]) {
            var r = matches[m.id];
            m.score1 = r.score1 !== undefined ? r.score1 : m.score1;
            m.score2 = r.score2 !== undefined ? r.score2 : m.score2;
            m.status = r.status || m.status;
          }
        });
        getKnockoutArray().forEach(function (m) {
          if (matches[m.id]) {
            var r = matches[m.id];
            m.score1 = r.score1 !== undefined ? r.score1 : m.score1;
            m.score2 = r.score2 !== undefined ? r.score2 : m.score2;
            m.status = r.status || m.status;
            m.winner = r.winner || m.winner;
          }
        });
      })
      .catch(function () {});
  }

  function getKnockoutArray() {
    return [].concat(
      WC.KNOCKOUT.r32,
      WC.KNOCKOUT.r16,
      WC.KNOCKOUT.qf,
      WC.KNOCKOUT.sf,
      [WC.KNOCKOUT.thirdPlace, WC.KNOCKOUT.final]
    );
  }

  // ── STANDINGS ─────────────────────────────────────────────────────────────
  function computeAllStandings() {
    Object.keys(WC.GROUPS).forEach(function (g) {
      state.standings[g] = computeStandings(g);
    });
  }

  function computeStandings(groupLetter) {
    var teams = WC.GROUPS[groupLetter].teams;
    var table = {};
    teams.forEach(function (t) {
      table[t.code] = { team: t, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
    });
    var groupMatches = WC.GROUP_MATCHES.filter(function (m) { return m.group === groupLetter; });
    var playedCount = 0;
    groupMatches.forEach(function (m) {
      if (m.score1 === null || m.score2 === null) return;
      playedCount++;
      var r1 = table[m.team1.code], r2 = table[m.team2.code];
      r1.p++; r2.p++;
      r1.gf += m.score1; r1.ga += m.score2; r1.gd = r1.gf - r1.ga;
      r2.gf += m.score2; r2.ga += m.score1; r2.gd = r2.gf - r2.ga;
      if (m.score1 > m.score2)      { r1.w++; r1.pts += 3; r2.l++; }
      else if (m.score1 < m.score2) { r2.w++; r2.pts += 3; r1.l++; }
      else                           { r1.d++; r1.pts++; r2.d++; r2.pts++; }
    });
    var rows = Object.values(table);
    rows.sort(function (a, b) {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd  !== a.gd)  return b.gd  - a.gd;
      if (b.gf  !== a.gf)  return b.gf  - a.gf;
      return a.team.name.localeCompare(b.team.name);
    });
    return { rows: rows, complete: playedCount === 6, playedCount: playedCount };
  }

  // ── TIME FORMATTING ───────────────────────────────────────────────────────
  function formatMatchTime(dateStr, utcTime, tz, isEst) {
    try {
      var d = new Date(dateStr + 'T' + utcTime + ':00Z');
      var fmt = new Intl.DateTimeFormat('en-IE', {
        timeZone: tz, weekday: 'short', day: 'numeric', month: 'short',
        hour: '2-digit', minute: '2-digit', hour12: false
      }).format(d);
      return isEst ? '~' + fmt : fmt;
    } catch (e) {
      return dateStr + ' ' + utcTime + ' UTC';
    }
  }

  function formatDateTimeDisplay(d) {
    try {
      return new Intl.DateTimeFormat('en-IE', { timeZone: state.tz, dateStyle: 'medium', timeStyle: 'short' }).format(d);
    } catch (e) { return d.toISOString(); }
  }

  function getMatchDateInTz(dateStr, utcTime, tz) {
    try {
      var parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit'
      }).formatToParts(new Date(dateStr + 'T' + utcTime + ':00Z'));
      var y = '', mo = '', dy = '';
      parts.forEach(function (p) {
        if (p.type === 'year') y = p.value;
        if (p.type === 'month') mo = p.value;
        if (p.type === 'day') dy = p.value;
      });
      return y + '-' + mo + '-' + dy;
    } catch (e) { return dateStr; }
  }

  function todayInTz(tz) {
    try {
      var parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit'
      }).formatToParts(new Date());
      var y = '', mo = '', dy = '';
      parts.forEach(function (p) {
        if (p.type === 'year') y = p.value;
        if (p.type === 'month') mo = p.value;
        if (p.type === 'day') dy = p.value;
      });
      return y + '-' + mo + '-' + dy;
    } catch (e) { return new Date().toISOString().slice(0, 10); }
  }

  // ── LIVE NOW SECTION ──────────────────────────────────────────────────────
  function renderLiveNow() {
    var section = document.getElementById('liveNow');
    if (!section) return;

    var liveMatches = WC.GROUP_MATCHES.concat(getKnockoutArray()).filter(function (m) {
      return m.status === 'live';
    });

    section.innerHTML = '';
    if (!liveMatches.length) return;

    var hdr = el('div', 'live-now-header');
    var dot = el('span', 'live-now-dot');
    hdr.appendChild(dot);
    hdr.appendChild(document.createTextNode(
      ' LIVE NOW · ' + liveMatches.length + ' match' + (liveMatches.length !== 1 ? 'es' : '') + ' in progress'
    ));
    section.appendChild(hdr);

    var grid = el('div', 'live-now-grid');
    liveMatches.forEach(function (m) { grid.appendChild(buildLiveTile(m)); });
    section.appendChild(grid);
  }

  function buildLiveTile(m) {
    var tile = el('div', 'live-tile');

    var roundEl = el('div', 'live-tile-round');
    if (m.group) {
      roundEl.textContent = 'Group ' + m.group + ' · Matchday ' + (m.md || '');
    } else {
      var labels = { r32: 'Round of 32', r16: 'Round of 16', qf: 'Quarter-final', sf: 'Semi-final', final: 'Final', '3rd': '3rd Place' };
      roundEl.textContent = labels[m.round] || 'Knockout';
    }
    tile.appendChild(roundEl);

    var t1 = (m.team1 && m.team1.code) ? m.team1 : resolveKoTeam(m.team1, m.team1Label);
    var t2 = (m.team2 && m.team2.code) ? m.team2 : resolveKoTeam(m.team2, m.team2Label);
    var s1 = m.score1 !== null ? m.score1 : 0;
    var s2 = m.score2 !== null ? m.score2 : 0;

    [
      { team: t1, label: m.team1Label, score: s1, other: s2 },
      { team: t2, label: m.team2Label, score: s2, other: s1 }
    ].forEach(function (item) {
      var trow = el('div', 'live-tile-team' + (item.score > item.other ? ' leading' : ''));
      var flag = el('span', 'live-tile-flag'); flag.textContent = item.team ? item.team.flag : '';
      var name = el('span', 'live-tile-name'); name.textContent = item.team ? item.team.name : formatLabel(item.label);
      var score = el('span', 'live-tile-score'); score.textContent = item.score;
      trow.appendChild(flag); trow.appendChild(name); trow.appendChild(score);
      tile.appendChild(trow);
    });

    var footer = el('div', 'live-tile-footer');
    footer.textContent = (m.city && m.city !== 'TBD') ? m.city : '';
    tile.appendChild(footer);

    return tile;
  }

  // ── TAB ROUTING ───────────────────────────────────────────────────────────
  function bindTabButtons() {
    document.querySelectorAll('.tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.tab = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(function (b) {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });
        document.querySelectorAll('.tab-panel').forEach(function (p) {
          p.classList.toggle('active', p.id === 'tab-' + state.tab);
        });
        renderCurrentTab();
      });
    });
  }

  function renderCurrentTab() {
    if (state.tab === 'groups')     renderGroups();
    if (state.tab === 'bracket')    renderBracket();
    if (state.tab === 'schedule')   renderSchedule();
    if (state.tab === 'sweepstake') renderSweepstake();
  }

  // ── GROUPS TAB ────────────────────────────────────────────────────────────
  function renderGroups() {
    var grid = document.getElementById('groupsGrid');
    grid.innerHTML = '';
    Object.keys(WC.GROUPS).forEach(function (g) {
      grid.appendChild(buildGroupCard(g));
    });
  }

  function buildGroupCard(g) {
    var standing = state.standings[g] || { rows: [], complete: false, playedCount: 0 };
    var card = el('div', 'group-card');

    var hdr = el('div', 'group-card-header');
    var lbl = el('div', 'group-letter'); lbl.textContent = 'Group ' + g;
    var badge = el('div', 'group-status-badge');
    if (standing.complete)          { badge.textContent = 'Complete'; badge.classList.add('complete'); }
    else if (standing.playedCount > 0) { badge.textContent = 'Ongoing'; badge.classList.add('ongoing'); }
    else                            { badge.textContent = 'Upcoming'; badge.classList.add('upcoming'); }
    hdr.appendChild(lbl); hdr.appendChild(badge);
    card.appendChild(hdr);

    var tbl = el('table', 'standings-table');
    var thead = el('thead');
    var hr = el('tr');
    ['Team','P','W','D','L','GF','GA','GD','Pts'].forEach(function (h) {
      var th = el('th'); th.textContent = h; hr.appendChild(th);
    });
    thead.appendChild(hr); tbl.appendChild(thead);

    var tbody = el('tbody');
    var rows = standing.rows.length ? standing.rows : WC.GROUPS[g].teams.map(function (t) {
      return { team: t, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
    });
    rows.forEach(function (row, i) {
      var tr = el('tr', 'standings-row');
      if (i < 2) tr.classList.add('qualifying');
      if (i < 2 && standing.complete) tr.classList.add('qualified');
      var tdTeam = el('td');
      var teamCell = el('div', 'team-cell');
      var flagEl = el('span', 'flag'); flagEl.textContent = row.team.flag;
      var nameEl = el('span', 'tname'); nameEl.textContent = row.team.name;
      teamCell.appendChild(flagEl); teamCell.appendChild(nameEl);
      tdTeam.appendChild(teamCell); tr.appendChild(tdTeam);
      [row.p, row.w, row.d, row.l, row.gf, row.ga, gd(row), row.pts].forEach(function (v, vi) {
        var td = el('td'); td.textContent = v;
        if (vi === 7) td.className = 'pts-cell';
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    tbl.appendChild(tbody);
    card.appendChild(tbl);

    var matchSec = el('div', 'group-matches');
    var groupMatches = WC.GROUP_MATCHES.filter(function (m) { return m.group === g; });
    [1, 2, 3].forEach(function (md) {
      var mdMatches = groupMatches.filter(function (m) { return m.md === md; });
      if (!mdMatches.length) return;
      var sec = el('div', 'matchday-section');
      var mdLbl = el('div', 'matchday-label'); mdLbl.textContent = 'Matchday ' + md;
      sec.appendChild(mdLbl);
      mdMatches.forEach(function (m) { sec.appendChild(buildMatchRow(m)); });
      matchSec.appendChild(sec);
    });
    card.appendChild(matchSec);
    return card;
  }

  function buildMatchRow(m) {
    var status = m.status || (m.score1 !== null && m.score2 !== null ? 'finished' : 'upcoming');
    var row = el('div', 'match-row mrow-' + status);
    var hasScore = m.score1 !== null && m.score2 !== null;

    // Two team rows stacked — names no longer get clipped
    var body = el('div', 'mrow-body');
    [0, 1].forEach(function (idx) {
      var team  = idx === 0 ? m.team1  : m.team2;
      var score = idx === 0 ? m.score1 : m.score2;
      var other = idx === 0 ? m.score2 : m.score1;
      var win   = hasScore && score > other;

      var trow = el('div', 'mrow-team' + (win ? ' mrow-winner' : ''));
      var flag = el('span', 'flag'); flag.textContent = team.flag;
      var name = el('span', 'tname'); name.textContent = team.name;
      var sc   = el('span', 'mrow-score');
      if (hasScore) sc.textContent = score;
      trow.appendChild(flag); trow.appendChild(name); trow.appendChild(sc);
      body.appendChild(trow);
    });

    // Right column: status badge + kick-off time
    var side = el('div', 'mrow-side');

    if (status === 'live') {
      var liveBadge = el('div', 'mrow-status-badge mrow-live');
      var dot = el('span', 'live-dot');
      liveBadge.appendChild(dot);
      liveBadge.appendChild(document.createTextNode('LIVE'));
      side.appendChild(liveBadge);
    } else if (status === 'finished') {
      var ftBadge = el('div', 'mrow-status-badge mrow-ft');
      ftBadge.textContent = 'FT';
      side.appendChild(ftBadge);
    } else {
      var upBadge = el('div', 'mrow-status-badge mrow-upcoming-badge');
      var upDot = el('span', 'upcoming-dot');
      upBadge.appendChild(upDot);
      upBadge.appendChild(document.createTextNode('Soon'));
      side.appendChild(upBadge);
    }

    var timeEl = el('div', 'mrow-time' + (m.est ? ' est' : ''));
    timeEl.textContent = formatMatchTime(m.date, m.utc, state.tz, m.est);
    side.appendChild(timeEl);

    row.appendChild(body);
    row.appendChild(side);
    return row;
  }

  function gd(row) { return row.gd > 0 ? '+' + row.gd : row.gd; }

  // ── BRACKET TAB ───────────────────────────────────────────────────────────
  function renderBracket() {
    var root = document.getElementById('bracketRoot');
    root.innerHTML = '';
    var koMap = {};
    getKnockoutArray().forEach(function (m) { koMap[m.id] = m; });

    var leftR32  = [['M74','M77'],['M73','M75'],['M83','M84'],['M81','M82']];
    var leftR16  = [['M89','M90'],['M93','M94']];
    var leftQF   = [['M97','M98']];
    var leftSF   = [['M101']];
    var rightSF  = [['M102']];
    var rightQF  = [['M99','M100']];
    var rightR16 = [['M91','M92'],['M95','M96']];
    var rightR32 = [['M76','M78'],['M79','M80'],['M86','M88'],['M85','M87']];

    var leftHalf  = el('div', 'bracket-half left');
    var rightHalf = el('div', 'bracket-half right');
    var center    = el('div', 'bracket-center');

    leftHalf.appendChild(buildBracketRound('Round of 32',    leftR32, koMap, 'left',  4));
    leftHalf.appendChild(buildBracketRound('Round of 16',    leftR16, koMap, 'left',  2));
    leftHalf.appendChild(buildBracketRound('Quarter-finals', leftQF,  koMap, 'left',  1));
    leftHalf.appendChild(buildBracketRound('Semi-finals',    leftSF,  koMap, 'left',  1));

    var centerTop = el('div', 'center-label'); centerTop.textContent = 'Final';
    var finalCard = buildMatchCard(koMap['M104'], 'final'); finalCard.classList.add('final-card');
    var divider   = el('div', 'center-divider');
    var thirdLbl  = el('div', 'center-label'); thirdLbl.textContent = '3rd Place';
    var thirdCard = buildMatchCard(koMap['M103'], '3rd'); thirdCard.classList.add('third-card');
    center.appendChild(centerTop); center.appendChild(finalCard);
    center.appendChild(divider); center.appendChild(thirdLbl); center.appendChild(thirdCard);

    rightHalf.appendChild(buildBracketRound('Round of 32',    rightR32, koMap, 'right', 4));
    rightHalf.appendChild(buildBracketRound('Round of 16',    rightR16, koMap, 'right', 2));
    rightHalf.appendChild(buildBracketRound('Quarter-finals', rightQF,  koMap, 'right', 1));
    rightHalf.appendChild(buildBracketRound('Semi-finals',    rightSF,  koMap, 'right', 1));

    root.appendChild(leftHalf); root.appendChild(center); root.appendChild(rightHalf);
  }

  function buildBracketRound(label, matchupGroups, koMap) {
    var roundEl = el('div', 'bracket-round');
    if (label === 'Semi-finals') roundEl.classList.add('no-connector');
    var hdr = el('div', 'round-header'); hdr.textContent = label;
    roundEl.appendChild(hdr);
    var matchesWrap = el('div', 'round-matches');
    matchupGroups.forEach(function (pair) {
      var matchup = el('div', 'matchup');
      if (pair.length === 1) matchup.classList.add('single');
      pair.forEach(function (id) {
        var m = koMap[id];
        if (m) { var wrap = el('div', 'card-wrap'); wrap.appendChild(buildMatchCard(m, 'ko')); matchup.appendChild(wrap); }
      });
      matchesWrap.appendChild(matchup);
    });
    roundEl.appendChild(matchesWrap);
    return roundEl;
  }

  function buildMatchCard(m, type) {
    var card = el('div', 'match-card');
    var status = m.status || (m.score1 !== null && m.score2 !== null ? 'finished' : 'upcoming');
    card.classList.add('card-' + status);

    var t1info = resolveKoTeam(m.team1, m.team1Label);
    var t2info = resolveKoTeam(m.team2, m.team2Label);
    var t1win = m.score1 !== null && m.score2 !== null && m.score1 > m.score2;
    var t2win = m.score1 !== null && m.score2 !== null && m.score2 > m.score1;
    if (m.winner) { t1win = (m.winner === (t1info && t1info.code)); t2win = (m.winner === (t2info && t2info.code)); }

    card.appendChild(buildCardTeamRow(t1info, m.team1Label, m.score1, t1win));
    card.appendChild(buildCardTeamRow(t2info, m.team2Label, m.score2, t2win));

    var footer = el('div', 'match-card-footer');
    var noEl = el('span', 'match-card-no'); noEl.textContent = 'M' + m.no;
    var timeEl = el('span', 'match-card-time' + (m.est ? ' est' : ''));
    timeEl.textContent = formatMatchTime(m.date, m.utc, state.tz, m.est);
    var venueEl = el('span', 'match-card-venue-sm');
    venueEl.textContent = m.city !== 'TBD' ? m.city : '';
    footer.appendChild(noEl);
    if (status === 'live') { var dot = el('span', 'card-live-dot'); footer.appendChild(dot); }
    footer.appendChild(timeEl); footer.appendChild(venueEl);
    card.appendChild(footer);
    return card;
  }

  function buildCardTeamRow(teamInfo, label, score, isWinner) {
    var row = el('div', 'match-card-team');
    if (isWinner) row.classList.add('winner');
    var flagEl = el('span', 'flag'); flagEl.textContent = teamInfo ? teamInfo.flag : '';
    var nameEl = el('span', 'cname');
    if (teamInfo) { nameEl.textContent = teamInfo.name; nameEl.classList.add('known'); }
    else { nameEl.textContent = formatLabel(label); }
    var scoreEl = el('span', 'cscore'); scoreEl.textContent = score !== null ? score : '';
    row.appendChild(flagEl); row.appendChild(nameEl); row.appendChild(scoreEl);
    return row;
  }

  function formatLabel(label) {
    if (!label) return '?';
    var posMatch = label.match(/^([12])([A-L])$/);
    if (posMatch) return (posMatch[1] === '1' ? '1st' : '2nd') + ' Group ' + posMatch[2];
    var winMatch = label.match(/^W-(\d+)$/);
    if (winMatch) return 'Win M' + winMatch[1];
    var lossMatch = label.match(/^L-(\d+)$/);
    if (lossMatch) return 'Loss M' + lossMatch[1];
    if (label === 'best 3rd') return 'Best 3rd';
    return label;
  }

  function resolveKoTeam(teamObj, label) {
    if (teamObj && teamObj.code) return teamObj;
    if (!label) return null;
    var posMatch = label.match(/^([12])([A-L])$/);
    if (posMatch) {
      var pos = parseInt(posMatch[1], 10);
      var grp = posMatch[2];
      var st = state.standings[grp];
      if (st && st.complete && st.rows.length >= pos) return st.rows[pos - 1].team;
    }
    return null;
  }

  // ── SCHEDULE TAB ─────────────────────────────────────────────────────────
  function bindScheduleFilters() {
    document.querySelectorAll('.filter-btn[data-status]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.statusFilter = btn.dataset.status;
        document.querySelectorAll('.filter-btn[data-status]').forEach(function (b) {
          b.classList.toggle('active', b === btn);
        });
        renderSchedule();
      });
    });
    var gSel = document.getElementById('groupFilterSelect');
    if (gSel) { gSel.addEventListener('change', function () { state.groupFilter = gSel.value; renderSchedule(); }); }
  }

  function renderSchedule() {
    var body = document.getElementById('scheduleBody');
    body.innerHTML = '';
    var allMatches = buildAllMatchesForSchedule();
    var today = todayInTz(state.tz);

    allMatches = allMatches.filter(function (m) {
      if (state.groupFilter !== 'all') {
        if (state.groupFilter === 'ko') { if (m.group) return false; }
        else { if (m.group !== state.groupFilter) return false; }
      }
      if (state.statusFilter === 'upcoming') {
        return getMatchDateInTz(m.date, m.utc, state.tz) >= today && (m.score1 === null || m.score2 === null);
      }
      if (state.statusFilter === 'today') {
        return getMatchDateInTz(m.date, m.utc, state.tz) === today;
      }
      return true;
    });

    if (!allMatches.length) {
      var none = el('div', 'no-matches'); none.textContent = 'No matches match the selected filters.';
      body.appendChild(none); return;
    }

    var byDate = {}, dateOrder = [];
    allMatches.forEach(function (m) {
      var d = getMatchDateInTz(m.date, m.utc, state.tz);
      if (!byDate[d]) { byDate[d] = []; dateOrder.push(d); }
      byDate[d].push(m);
    });
    dateOrder.forEach(function (d) {
      var group = el('div', 'date-group');
      var hdr = el('div', 'date-header'); hdr.textContent = formatDateHeader(d, state.tz);
      group.appendChild(hdr);
      byDate[d].forEach(function (m) { group.appendChild(buildScheduleItem(m)); });
      body.appendChild(group);
    });
  }

  function formatDateHeader(dateStr, tz) {
    try {
      return new Intl.DateTimeFormat('en-IE', {
        timeZone: tz, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      }).format(new Date(dateStr + 'T12:00:00'));
    } catch (e) { return dateStr; }
  }

  function buildAllMatchesForSchedule() {
    var gm = WC.GROUP_MATCHES.map(function (m) { return Object.assign({}, m, { roundType: 'group' }); });
    var km = getKnockoutArray().map(function (m) { return Object.assign({}, m, { group: null, roundType: 'ko' }); });
    return gm.concat(km).sort(function (a, b) {
      var da = a.date + 'T' + a.utc + ':00Z', db = b.date + 'T' + b.utc + ':00Z';
      return da < db ? -1 : da > db ? 1 : 0;
    });
  }

  function buildScheduleItem(m) {
    var item = el('div', 'match-item');

    var badgeCol = el('div', 'match-item-badge');
    var badge = el('div', 'round-badge');
    if (m.roundType === 'group') { badge.textContent = 'Group ' + m.group; badge.classList.add('group'); }
    else {
      var rLabel = { r32: 'R32', r16: 'R16', qf: 'QF', sf: 'SF', '3rd': '3rd Place', final: 'Final' }[m.round] || 'KO';
      badge.textContent = rLabel; badge.classList.add(m.round === 'final' ? 'final' : 'ko');
    }
    var numEl = el('div', 'match-num'); numEl.textContent = m.id || ('M' + m.no);
    badgeCol.appendChild(badge); badgeCol.appendChild(numEl);
    item.appendChild(badgeCol);

    var teamsCol = el('div', 'match-item-teams');
    var t1, t2, s1, s2;
    if (m.roundType === 'group') { t1 = m.team1; t2 = m.team2; s1 = m.score1; s2 = m.score2; }
    else {
      t1 = resolveKoTeam(m.team1, m.team1Label) || { flag: '', name: formatLabel(m.team1Label), code: null };
      t2 = resolveKoTeam(m.team2, m.team2Label) || { flag: '', name: formatLabel(m.team2Label), code: null };
      s1 = m.score1; s2 = m.score2;
    }
    var t1win = s1 !== null && s2 !== null && s1 > s2;
    var t2win = s1 !== null && s2 !== null && s2 > s1;

    var t1row = el('div', 'match-item-team' + (t1win ? ' winner' : ''));
    var f1 = el('span', 'flag'); f1.textContent = t1 ? t1.flag : '';
    var n1 = el('span', 'tname'); n1.textContent = t1 ? t1.name : (m.team1Label || '?');
    var sc1 = el('span', 'tscore'); sc1.textContent = s1 !== null ? s1 : '';
    t1row.appendChild(f1); t1row.appendChild(n1); t1row.appendChild(sc1);

    var sep = el('div', 'match-item-sep'); sep.textContent = '—';

    var t2row = el('div', 'match-item-team' + (t2win ? ' winner' : ''));
    var f2 = el('span', 'flag'); f2.textContent = t2 ? t2.flag : '';
    var n2 = el('span', 'tname'); n2.textContent = t2 ? t2.name : (m.team2Label || '?');
    var sc2 = el('span', 'tscore'); sc2.textContent = s2 !== null ? s2 : '';
    t2row.appendChild(f2); t2row.appendChild(n2); t2row.appendChild(sc2);

    teamsCol.appendChild(t1row); teamsCol.appendChild(sep); teamsCol.appendChild(t2row);
    item.appendChild(teamsCol);

    var metaCol = el('div', 'match-item-meta');
    var timeEl = el('div', 'match-item-time' + (m.est ? ' est' : ''));
    timeEl.textContent = formatMatchTime(m.date, m.utc, state.tz, m.est);
    var venueEl = el('div', 'match-item-venue');
    venueEl.textContent = m.venue && m.venue !== 'TBD' ? m.venue : '';
    var cityEl = el('div', 'match-item-city');
    cityEl.textContent = m.city && m.city !== 'TBD' ? m.city : '';
    metaCol.appendChild(timeEl);
    if (m.est) { var estBadge = el('span', 'est-badge'); estBadge.textContent = 'est.'; metaCol.appendChild(estBadge); }
    metaCol.appendChild(venueEl); metaCol.appendChild(cityEl);
    item.appendChild(metaCol);
    return item;
  }

  // ── BUSTER CTA BANNERS ───────────────────────────────────────────────────
  function bindBusterCtas() {
    document.querySelectorAll('[data-goto-tab]').forEach(function (el) {
      el.addEventListener('click', function () {
        var target = el.dataset.gotoTab;
        var btn = document.querySelector('.tab-btn[data-tab="' + target + '"]');
        if (btn) btn.click();
      });
    });
  }

  // ── BUSTER TAB ────────────────────────────────────────────────────────────
  function renderSweepstake() {
    initBusterGate();
    var form = document.getElementById('sweepForm');
    if (!form || form.dataset.bound) return;
    form.dataset.bound = '1';

    // Load entry count and update spots display
    fetch('data/entries.json?_=' + Date.now())
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) { updateSpotsDisplay(data); })
      .catch(function () {});

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot check
      var honeypot = form.querySelector('input[name="_gotcha"]');
      if (honeypot && honeypot.value) return;

      var nameInput  = document.getElementById('sweepName');
      var emailInput = document.getElementById('sweepEmail');
      var name  = nameInput.value.trim();
      var email = emailInput.value.trim();

      if (!validateBusterForm(name, email)) return;

      if (WEB3FORMS_KEY === 'YOUR_ACCESS_KEY') {
        showSweepMessage('Buster not yet configured — the organiser needs to add a Web3Forms key.', 'warning');
        return;
      }

      var data = new FormData();
      data.append('access_key', WEB3FORMS_KEY);
      data.append('name',  name);
      data.append('email', email);
      data.append('subject', 'World Cup Buster — New Entry');

      var btn = document.getElementById('sweepSubmit');
      btn.disabled = true; btn.textContent = 'Submitting…';

      fetch('https://api.web3forms.com/submit', {
        method: 'POST', body: data, headers: { 'Accept': 'application/json' }
      }).then(function (r) {
        return r.json();
      }).then(function (json) {
        if (json.success) {
          showBusterSuccess(name);
        } else {
          showSweepMessage('Submission failed — please try again.', 'error');
          btn.disabled = false; btn.textContent = 'Enter the Buster';
        }
      }).catch(function () {
        showSweepMessage('Network error — please try again.', 'error');
        btn.disabled = false; btn.textContent = 'Enter the Buster';
      });
    });
  }

  function updateSpotsDisplay(data) {
    var spotsEl = document.getElementById('busterSpots');
    var submitBtn = document.getElementById('sweepSubmit');
    if (!spotsEl) return;
    if (!data) { spotsEl.textContent = ''; return; }

    var remaining = data.max - data.count;

    if (!data.open || remaining <= 0) {
      spotsEl.className = 'buster-spots spots-full';
      spotsEl.textContent = 'The buster is full — all 48 spots are taken.';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Buster Full'; }
    } else {
      spotsEl.className = 'buster-spots spots-open' + (remaining <= 10 ? ' spots-low' : '');
      spotsEl.textContent = remaining + ' of ' + data.max + ' spots remaining';
    }
  }

  function validateBusterForm(name, email) {
    var nameErr  = document.getElementById('nameError');
    var emailErr = document.getElementById('emailError');
    if (nameErr)  nameErr.textContent  = '';
    if (emailErr) emailErr.textContent = '';
    var valid = true;

    // Name: at least two words, letters only (allows hyphens, apostrophes, accents)
    var nameParts = name.split(/\s+/).filter(Boolean);
    if (nameParts.length < 2) {
      if (nameErr) nameErr.textContent = 'Please enter your first and last name.';
      valid = false;
    } else if (!/^[\p{L}\s'\-\.]+$/u.test(name)) {
      if (nameErr) nameErr.textContent = 'Name should only contain letters.';
      valid = false;
    }

    // Email: proper format with a real-looking domain
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRe.test(email)) {
      if (emailErr) emailErr.textContent = 'Please enter a valid email address.';
      valid = false;
    }

    return valid;
  }

  function initBusterGate() {
    var gate    = document.getElementById('busterGate');
    var content = document.getElementById('busterContent');
    if (!gate || !content) return;

    // Already unlocked this session
    if (localStorage.getItem(BUSTER_KEY) === '1') {
      gate.style.display = 'none';
      content.style.display = 'block';
      return;
    }

    gate.style.display = 'flex';
    content.style.display = 'none';

    var input  = document.getElementById('gatePassword');
    var submit = document.getElementById('gateSubmit');
    var errEl  = document.getElementById('gateError');
    if (!input || !submit || submit.dataset.gateBound) return;
    submit.dataset.gateBound = '1';

    function attempt() {
      hashPassword(input.value).then(function (hash) {
        if (hash === BUSTER_PASS_HASH) {
          localStorage.setItem(BUSTER_KEY, '1');
          gate.style.display = 'none';
          content.style.display = 'block';
        } else {
          errEl.textContent = 'Incorrect password — message Brian if you need it.';
          input.value = '';
          input.focus();
          gate.classList.add('gate-shake');
          setTimeout(function () { gate.classList.remove('gate-shake'); }, 500);
        }
      });
    }

    submit.addEventListener('click', attempt);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') attempt(); });
  }

  function hashPassword(password) {
    var encoded = new TextEncoder().encode(password);
    return crypto.subtle.digest('SHA-256', encoded).then(function (buf) {
      return Array.from(new Uint8Array(buf))
        .map(function (b) { return b.toString(16).padStart(2, '0'); })
        .join('');
    });
  }

  function showBusterSuccess(name) {
    var card = document.getElementById('busterCard');
    if (!card) return;

    var firstName = name.split(/\s+/)[0];
    var revLink = REVOLUT_URL !== 'https://revolut.me/YOUR_USERNAME' ? REVOLUT_URL : null;

    card.innerHTML = '';
    card.className = 'buster-card buster-success-card';

    var icon = el('div', 'success-icon'); icon.textContent = '🎉';
    var heading = el('h2', 'success-heading'); heading.textContent = 'You\'re in, ' + firstName + '!';
    var msg = el('p', 'success-msg');
    msg.textContent = 'Your spot is reserved. Your team will be randomly drawn and emailed to you.';

    card.appendChild(icon);
    card.appendChild(heading);
    card.appendChild(msg);

    var divider = el('div', 'success-divider');
    card.appendChild(divider);

    if (revLink) {
      var payHeading = el('p', 'success-pay-label'); payHeading.textContent = 'Now pay your entry fee:';
      var payBtn = el('a', 'revolut-btn');
      payBtn.href = revLink;
      payBtn.target = '_blank';
      payBtn.rel = 'noopener';
      payBtn.textContent = '💸 Pay ' + ENTRY_FEE + ' via Revolut';
      var payNote = el('p', 'success-pay-note');
      payNote.textContent = 'Add your name as the payment reference: ' + name;
      var payWarning = el('p', 'success-pay-warning');
      payWarning.textContent = '⚠️ Your entry will not be counted until payment is received.';
      card.appendChild(payHeading);
      card.appendChild(payBtn);
      card.appendChild(payNote);
      card.appendChild(payWarning);
    }

    var divider2 = el('div', 'success-divider');
    card.appendChild(divider2);

    var waHeading = el('p', 'success-pay-label'); waHeading.textContent = 'Questions or to confirm your entry:';
    var waBtn = el('a', 'whatsapp-btn');
    waBtn.href = 'https://wa.me/353852789446?text=' + encodeURIComponent('Hi Brian, I\'ve entered the World Cup Buster (' + name + ')');
    waBtn.target = '_blank';
    waBtn.rel = 'noopener';
    waBtn.textContent = '💬 WhatsApp Brian';
    card.appendChild(waHeading);
    card.appendChild(waBtn);
  }

  function showSweepMessage(text, type) {
    var existing = document.getElementById('sweepMessage');
    if (existing) existing.remove();
    var msg = el('div', 'sweep-message sweep-msg-' + type);
    msg.id = 'sweepMessage';
    msg.textContent = text;
    var form = document.getElementById('sweepForm');
    if (form) form.insertBefore(msg, form.firstChild);
  }

  // ── HELPERS ───────────────────────────────────────────────────────────────
  function el(tag, cls) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
  }

})();
