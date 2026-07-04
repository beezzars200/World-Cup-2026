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
    tab: 'live',
    liveSubTab: 'bracket',
    standings: {},
    lastUpdated: null,
    sweepTeam: null,
    scorers: [],
    scorersUpdated: null,
    cards: [],
    cardsUpdated: null,
    groupTeamFilter: [],
    groupMatchFilter: 'all',
    drawFilter: '',
    drawExpanded: {},
    drawSubTab: 'list',
    playerStatsSubTab: 'scorers',
    mdExpanded: {},
  };

  document.addEventListener('DOMContentLoaded', function () {
    populateCountrySelector();
    bindTabButtons();
    bindSubTabButtons();
    bindGroupFilters();
    bindBusterCtas();
    bindDrawSearch();
    renderCeremonies();
    startCountdownTicker();
    Promise.all([fetchResults(), fetchScorers(), fetchCards()]).then(function () {
      computeAllStandings();
      renderLiveNow();
      renderCurrentTab();
      setInterval(function () {
        Promise.all([fetchResults(), fetchScorers(), fetchCards()]).then(function () {
          computeAllStandings();
          renderLiveNow();
          renderCeremonies();
          renderCurrentTab();
          refreshOpenMatchModal();
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
      renderCeremonies();
      renderCurrentTab();
      tickCountdowns();
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
            // Keep the raw entry: scores are in ESPN home/away order and get
            // oriented to our bracket slots in resolveKnockoutTeams, once the
            // teams are known.
            m.raw = r;
            m.status = r.status || m.status;
            m.winner = r.winner || null;
          }
        });
      })
      .catch(function () {});
  }

  function fetchCards() {
    return fetch('data/cards.json?_=' + Date.now())
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !Array.isArray(data.cards)) return;
        state.cards = data.cards;
        state.cardsUpdated = data.lastUpdated || null;
      })
      .catch(function () {});
  }

  function fetchScorers() {
    return fetch('data/scorers.json?_=' + Date.now())
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !Array.isArray(data.scorers)) return;
        state.scorers = data.scorers;
        state.scorersUpdated = data.lastUpdated || null;
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
    resolveKnockoutTeams();
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

  // ── KNOCKOUT TEAM RESOLUTION ──────────────────────────────────────────────
  // Fills in the actual teams behind the placeholder labels: the eight best
  // third-placed teams ("best 3rd"), and the winners/losers that carry forward
  // through the bracket (W-NN / L-NN). Runs each cycle after standings.
  function resolveKnockoutTeams() {
    var ko = getKnockoutArray();
    var byId = {};
    ko.forEach(function (m) { byId[m.id] = m; });

    // Map each "best 3rd" R32 match to the group whose third-placed team plays
    // there, using the official allocation table for the qualifying combination.
    var combo = qualifyingThirdsCombo();
    var alloc = combo ? WC.THIRD_PLACE_ALLOCATION[combo] : null;

    function thirdTeamForGroup(g) {
      var st = state.standings[g];
      return (st && st.complete && st.rows.length >= 3) ? st.rows[2].team : null;
    }

    function koWinnerLoser(m, wantWinner) {
      var t1 = koTeamFor(m, 'team1'), t2 = koTeamFor(m, 'team2');
      // Explicit winner code (set when a tie is decided on penalties, but also
      // present for normal results) takes precedence over the scoreline.
      if (m.winner && t1 && t2) {
        if (m.winner === t1.code) return wantWinner ? t1 : t2;
        if (m.winner === t2.code) return wantWinner ? t2 : t1;
      }
      if (m.score1 === null || m.score2 === null || m.score1 === m.score2) return null;
      var homeWon = m.score1 > m.score2;
      if (wantWinner) return homeWon ? t1 : t2;
      return homeWon ? t2 : t1;
    }

    function koTeamFor(m, slot) {
      if (m[slot] && m[slot].code) return m[slot];
      var label = m[slot + 'Label'];
      if (label === 'best 3rd') return alloc ? thirdTeamForGroup(alloc[m.id]) : null;
      var posTeam = resolveKoTeam(null, label);
      if (posTeam) return posTeam;
      var win = label && label.match(/^W-(\d+)$/);
      if (win && byId['M' + win[1]]) return koWinnerLoser(byId['M' + win[1]], true);
      var los = label && label.match(/^L-(\d+)$/);
      if (los && byId['M' + los[1]]) return koWinnerLoser(byId['M' + los[1]], false);
      return null;
    }

    function valOrNull(v) { return v === undefined ? null : v; }

    // Copy scores from the raw results entry onto the match, flipping them when
    // ESPN's home side is our team2 (data is stored in home/away order).
    function applyScores(m) {
      var r = m.raw;
      if (!r) return;
      var flip = !!(r.home && m.team1 && m.team2 &&
                    m.team1.code !== r.home && m.team2.code === r.home);
      m.score1 = valOrNull(flip ? r.score2 : r.score1);
      m.score2 = valOrNull(flip ? r.score1 : r.score2);
      m.pens1  = valOrNull(flip ? r.pens2  : r.pens1);
      m.pens2  = valOrNull(flip ? r.pens1  : r.pens2);
    }

    // Resolve in match-number order so each round's sources (teams AND oriented
    // scores) are settled before later rounds consult them.
    ko.slice().sort(function (a, b) { return a.no - b.no; }).forEach(function (m) {
      m.team1 = koTeamFor(m, 'team1');
      m.team2 = koTeamFor(m, 'team2');
      applyScores(m);
    });
  }

  // Sorted string of the eight group letters whose third-placed team qualifies,
  // or null until all twelve groups have finished.
  function qualifyingThirdsCombo() {
    var thirds = [];
    var groups = Object.keys(WC.GROUPS);
    for (var i = 0; i < groups.length; i++) {
      var st = state.standings[groups[i]];
      if (!st || !st.complete || st.rows.length < 3) return null;
      var r = st.rows[2];
      thirds.push({ g: groups[i], pts: r.pts, gd: r.gd, gf: r.gf, name: r.team.name });
    }
    thirds.sort(function (a, b) {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd  !== a.gd)  return b.gd  - a.gd;
      if (b.gf  !== a.gf)  return b.gf  - a.gf;
      return a.name.localeCompare(b.name);
    });
    return thirds.slice(0, 8).map(function (x) { return x.g; }).sort().join('');
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

  // ── COUNTDOWNS ────────────────────────────────────────────────────────────
  function formatCountdown(ms) {
    var s = Math.floor(ms / 1000);
    var d = Math.floor(s / 86400); s -= d * 86400;
    var h = Math.floor(s / 3600);  s -= h * 3600;
    var m = Math.floor(s / 60);    s -= m * 60;
    if (d > 0) return d + 'd ' + h + 'h ' + m + 'm';
    if (h > 0) return h + 'h ' + m + 'm ' + s + 's';
    return m + 'm ' + s + 's';
  }

  function tickCountdowns() {
    var now = Date.now();
    var needsRerender = false;
    document.querySelectorAll('[data-kickoff]').forEach(function (n) {
      var t = Date.parse(n.dataset.kickoff);
      if (isNaN(t)) return;
      var diff = t - now;
      if (diff <= 0) {
        if (!n.dataset.expired) {
          n.dataset.expired = '1';
          needsRerender = true;
        }
        n.textContent = n.dataset.doneText || '';
      } else {
        n.textContent = (n.dataset.prefix || '⏱ ') + formatCountdown(diff);
      }
    });
    if (needsRerender) renderCurrentTab();
  }

  function startCountdownTicker() {
    tickCountdowns();
    setInterval(tickCountdowns, 1000);
  }

  function formatCeremonyTime(iso, tz) {
    try {
      return new Intl.DateTimeFormat('en-IE', {
        timeZone: tz, weekday: 'short', day: 'numeric', month: 'short',
        hour: '2-digit', minute: '2-digit', hour12: false
      }).format(new Date(iso));
    } catch (e) { return iso; }
  }

  var CEREMONY_DONE_MS = 4 * 3600 * 1000; // hide a ceremony ~4h after it starts

  function renderCeremonies() {
    var strip = document.getElementById('ceremonyStrip');
    if (!strip || !WC.CEREMONIES) return;
    var now = Date.now();

    var allDone = WC.CEREMONIES.every(function (c) {
      return now > Date.parse(c.utc) + CEREMONY_DONE_MS;
    });
    strip.innerHTML = '';
    if (allDone) return;

    var wrap = el('div', 'ceremony-strip');
    var label = el('span', 'ceremony-strip-label');
    label.textContent = '🎉 Ceremonies:';
    wrap.appendChild(label);

    WC.CEREMONIES.forEach(function (c) {
      var start = Date.parse(c.utc);
      var done = now > start + CEREMONY_DONE_MS;

      var pill = el('span', 'ceremony-pill' + (done ? ' ceremony-done' : ''));
      pill.title = c.venue + ' — ' + c.note + (c.lineup ? ' · 🎤 ' + c.lineup : '');

      var flag = el('span', 'ceremony-pill-flag'); flag.textContent = c.flag;
      pill.appendChild(flag);

      var city = el('span', 'ceremony-pill-city'); city.textContent = c.city;
      pill.appendChild(city);

      var timeEl = el('span', 'ceremony-pill-time');
      timeEl.textContent = formatCeremonyTime(c.utc, state.tz);
      pill.appendChild(timeEl);

      var cd = el('span', 'ceremony-pill-cd');
      if (done) {
        cd.textContent = '✅';
      } else {
        cd.dataset.kickoff = c.utc;
        cd.dataset.doneText = '🔴 Underway';
        cd.dataset.prefix = '⏳ ';
        cd.textContent = '⏳ —';
      }
      pill.appendChild(cd);

      wrap.appendChild(pill);
    });
    strip.appendChild(wrap);
    tickCountdowns();
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

  function bindSubTabButtons() {
    document.querySelectorAll('#tab-live .sub-tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.liveSubTab = btn.dataset.subtab;
        document.querySelectorAll('#tab-live .sub-tab-btn').forEach(function (b) {
          b.classList.toggle('active', b === btn);
        });
        document.querySelectorAll('#tab-live .sub-tab-panel').forEach(function (p) {
          p.classList.toggle('active', p.id === 'subtab-' + state.liveSubTab);
        });
        renderCurrentTab();
      });
    });
    document.querySelectorAll('#tab-sweepstake .sub-tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.drawSubTab = btn.dataset.drawsub;
        document.querySelectorAll('#tab-sweepstake .sub-tab-btn').forEach(function (b) {
          b.classList.toggle('active', b === btn);
        });
        document.querySelectorAll('#tab-sweepstake .sub-tab-panel').forEach(function (p) {
          p.classList.toggle('active', p.id === 'drawsub-' + state.drawSubTab);
        });
        renderCurrentTab();
      });
    });
    document.querySelectorAll('#tab-scorers .sub-tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.playerStatsSubTab = btn.dataset.playerstatssub;
        document.querySelectorAll('#tab-scorers .sub-tab-btn').forEach(function (b) {
          b.classList.toggle('active', b === btn);
        });
        document.querySelectorAll('#tab-scorers .sub-tab-panel').forEach(function (p) {
          p.classList.toggle('active', p.id === 'playerstatssub-' + state.playerStatsSubTab);
        });
        renderCurrentTab();
      });
    });
  }

  function renderCurrentTab() {
    if (state.tab === 'live') {
      if (state.liveSubTab === 'groups')  renderGroups();
      if (state.liveSubTab === 'bracket') renderBracket();
    }
    if (state.tab === 'scorers') {
      if (state.playerStatsSubTab === 'scorers') renderScorers();
      if (state.playerStatsSubTab === 'cards')   renderCards();
    }
    if (state.tab === 'sweepstake') {
      renderSweepstake();
      if (state.drawSubTab === 'list')    renderDraw();
      if (state.drawSubTab === 'reserve') renderReserve();
    }
  }

  // ── GROUP FILTERS ─────────────────────────────────────────────────────────
  function bindGroupFilters() {
    var trigger = document.getElementById('teamMsTrigger');
    var panel   = document.getElementById('teamMsPanel');

    if (trigger && panel) {
      // Build sorted team chips
      var teams = [];
      Object.keys(WC.GROUPS).forEach(function (g) {
        WC.GROUPS[g].teams.forEach(function (t) { teams.push(t); });
      });
      teams.sort(function (a, b) { return a.name.localeCompare(b.name); });

      teams.forEach(function (t) {
        var chip = el('button', 'team-chip');
        chip.dataset.code = t.code;
        chip.textContent = t.flag + ' ' + t.name;
        chip.addEventListener('click', function (e) {
          e.stopPropagation();
          var idx = state.groupTeamFilter.indexOf(t.code);
          if (idx >= 0) {
            state.groupTeamFilter.splice(idx, 1);
            chip.classList.remove('selected');
          } else {
            state.groupTeamFilter.push(t.code);
            chip.classList.add('selected');
          }
          updateTeamTrigger();
          renderGroups();
        });
        panel.appendChild(chip);
      });

      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        panel.classList.toggle('open');
      });
      document.addEventListener('click', function () {
        panel.classList.remove('open');
      });
    }

    function updateTeamTrigger() {
      if (!trigger) return;
      var n = state.groupTeamFilter.length;
      trigger.textContent = n === 0 ? 'All Teams ▾' : n + ' team' + (n > 1 ? 's' : '') + ' ▾';
      trigger.classList.toggle('active', n > 0);
    }

    document.querySelectorAll('[data-groupstatus]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.groupMatchFilter = btn.dataset.groupstatus;
        document.querySelectorAll('[data-groupstatus]').forEach(function (b) {
          b.classList.toggle('active', b === btn);
        });
        renderGroups();
      });
    });
  }

  // ── GROUPS TAB ────────────────────────────────────────────────────────────
  function renderGroups() {
    var grid = document.getElementById('groupsGrid');
    grid.innerHTML = '';

    var teamFilter  = state.groupTeamFilter;   // array
    var matchFilter = state.groupMatchFilter;

    var groupKeys = Object.keys(WC.GROUPS).filter(function (g) {
      if (teamFilter.length && !WC.GROUPS[g].teams.some(function (t) { return teamFilter.indexOf(t.code) >= 0; })) return false;
      if (matchFilter === 'upcoming') {
        if (!WC.GROUP_MATCHES.some(function (m) { return m.group === g && m.status !== 'finished'; })) return false;
      }
      if (matchFilter === 'completed') {
        if (!WC.GROUP_MATCHES.some(function (m) { return m.group === g && m.status === 'finished'; })) return false;
      }
      if (matchFilter === 'next24') {
        var cutoff = Date.now() + 24 * 3600 * 1000;
        if (!WC.GROUP_MATCHES.some(function (m) {
          if (m.group !== g) return false;
          if (m.status === 'live') return true;
          var ko = Date.parse(m.date + 'T' + m.utc + ':00Z');
          return m.status !== 'finished' && ko <= cutoff;
        })) return false;
      }
      return true;
    });

    groupKeys.forEach(function (g) { grid.appendChild(buildGroupCard(g)); });

    if (!grid.children.length) {
      var msg = el('div', 'info-banner');
      msg.textContent = matchFilter === 'completed'
        ? (teamFilter.length ? 'No completed matches for selected teams.' : 'No completed matches yet.')
        : (teamFilter.length ? 'No upcoming matches for selected teams.' : 'No upcoming matches.');
      grid.appendChild(msg);
    }
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

      // Hide matchdays with no relevant matches for the active filter
      if (state.groupMatchFilter === 'upcoming') {
        if (mdMatches.every(function (m) { return m.status === 'finished'; })) return;
      }
      if (state.groupMatchFilter === 'completed') {
        if (!mdMatches.some(function (m) { return m.status === 'finished'; })) return;
      }
      if (state.groupMatchFilter === 'next24') {
        var cutoff24 = Date.now() + 24 * 3600 * 1000;
        var hasNext = mdMatches.some(function (m) {
          if (m.status === 'live') return true;
          var ko = Date.parse(m.date + 'T' + m.utc + ':00Z');
          return m.status !== 'finished' && ko <= cutoff24;
        });
        if (!hasNext) return;
      }

      var key = g + '-' + md;
      var explicit = state.mdExpanded[key];
      var hasLive = mdMatches.some(function (m) { return m.status === 'live'; });
      var open = explicit === undefined ? true : explicit;

      var sec = el('div', 'matchday-section');
      var hdrRow = el('div', 'matchday-header');
      var mdLbl = el('div', 'matchday-label');
      mdLbl.textContent = 'Matchday ' + md;
      if (hasLive) {
        var liveDot = el('span', 'live-dot');
        mdLbl.appendChild(liveDot);
      }
      var toggle = el('button', 'matchday-toggle');
      toggle.textContent = open ? '▾ Collapse' : '▸ Expand';
      hdrRow.appendChild(mdLbl);
      hdrRow.appendChild(toggle);
      hdrRow.addEventListener('click', function () {
        state.mdExpanded[key] = !open;
        renderGroups();
      });
      sec.appendChild(hdrRow);

      if (open) {
        var rowsToShow = mdMatches;
        if (state.groupMatchFilter === 'upcoming') {
          rowsToShow = mdMatches.filter(function (m) { return m.status !== 'finished'; });
        } else if (state.groupMatchFilter === 'completed') {
          rowsToShow = mdMatches.filter(function (m) { return m.status === 'finished'; });
        } else if (state.groupMatchFilter === 'next24') {
          var cut = Date.now() + 24 * 3600 * 1000;
          rowsToShow = mdMatches.filter(function (m) {
            if (m.status === 'live') return true;
            var ko = Date.parse(m.date + 'T' + m.utc + ':00Z');
            return m.status !== 'finished' && ko <= cut;
          });
        }
        rowsToShow.forEach(function (m) { sec.appendChild(buildMatchRow(m)); });
      }
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
      var kickoffIsoB = m.date + 'T' + m.utc + ':00Z';
      var kickoffPassedB = Date.parse(kickoffIsoB) <= Date.now();
      var upBadge = el('div', 'mrow-status-badge mrow-upcoming-badge');
      if (kickoffPassedB) {
        upBadge.textContent = '⌛ Starting…';
      } else {
        var upDot = el('span', 'upcoming-dot');
        upBadge.appendChild(upDot);
        upBadge.appendChild(document.createTextNode('Soon'));
      }
      side.appendChild(upBadge);
    }

    var timeEl = el('div', 'mrow-time' + (m.est ? ' est' : ''));
    timeEl.textContent = formatMatchTime(m.date, m.utc, state.tz, m.est);
    side.appendChild(timeEl);

    if (status === 'upcoming') {
      var kickoffIso = m.date + 'T' + m.utc + ':00Z';
      if (Date.parse(kickoffIso) > Date.now()) {
        var cd = el('div', 'mrow-countdown');
        cd.dataset.kickoff = kickoffIso;
        cd.dataset.doneText = '⚽ Kick-off!';
        side.appendChild(cd);
      }
    }

    row.appendChild(body);
    row.appendChild(side);
    return row;
  }

  function gd(row) { return row.gd > 0 ? '+' + row.gd : row.gd; }

  // ── BRACKET TAB ───────────────────────────────────────────────────────────
  function updateBracketBanner() {
    var banner = document.getElementById('bracketBanner');
    if (!banner) return;
    var groups = Object.keys(WC.GROUPS);
    var allComplete = groups.every(function (g) {
      var st = state.standings[g];
      return st && st.complete;
    });
    if (allComplete) {
      banner.classList.add('complete');
      banner.textContent = '✅ Group stage complete — all 32 knockout teams confirmed. 🎟️ shows who drew each team in the Buster.';
    } else {
      banner.classList.remove('complete');
      banner.textContent = '📡 Live data for all games will be available once the tournament starts.';
    }
  }

  function renderBracket() {
    var root = document.getElementById('bracketRoot');
    root.innerHTML = '';
    var koMap = {};
    getKnockoutArray().forEach(function (m) { koMap[m.id] = m; });

    updateBracketBanner();

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

  // Which side of a knockout match won — from the explicit winner code when
  // present (covers penalty shootouts), otherwise from the scoreline.
  function koWinFlags(m, t1, t2) {
    var w1 = m.score1 !== null && m.score2 !== null && m.score1 > m.score2;
    var w2 = m.score1 !== null && m.score2 !== null && m.score2 > m.score1;
    if (m.winner) {
      w1 = m.winner === (t1 && t1.code);
      w2 = m.winner === (t2 && t2.code);
    }
    return { t1: w1, t2: w2 };
  }

  function buildMatchCard(m, type) {
    var card = el('div', 'match-card');
    var status = m.status || (m.score1 !== null && m.score2 !== null ? 'finished' : 'upcoming');
    card.classList.add('card-' + status);

    var t1info = resolveKoTeam(m.team1, m.team1Label);
    var t2info = resolveKoTeam(m.team2, m.team2Label);
    var win = koWinFlags(m, t1info, t2info);

    card.appendChild(buildCardTeamRow(t1info, m.team1Label, m.score1, win.t1, m.pens1));
    card.appendChild(buildCardTeamRow(t2info, m.team2Label, m.score2, win.t2, m.pens2));

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

    card.classList.add('clickable');
    card.addEventListener('click', function () { openMatchModal(m); });
    return card;
  }

  // ── MATCH DETAIL MODAL ────────────────────────────────────────────────────
  var openModalMatchId = null;

  // Rebuild the open modal after each data poll so live scores stay current.
  function refreshOpenMatchModal() {
    if (!openModalMatchId) return;
    var match = null;
    getKnockoutArray().forEach(function (k) { if (k.id === openModalMatchId) match = k; });
    if (match) openMatchModal(match);
  }

  function openMatchModal(m) {
    closeMatchModal();
    openModalMatchId = m.id;

    var status = m.status || (m.score1 !== null && m.score2 !== null ? 'finished' : 'upcoming');
    var t1 = resolveKoTeam(m.team1, m.team1Label);
    var t2 = resolveKoTeam(m.team2, m.team2Label);
    var winFlags = koWinFlags(m, t1, t2);
    var t1win = winFlags.t1, t2win = winFlags.t2;

    var overlay = el('div', 'match-modal-overlay'); overlay.id = 'matchModalOverlay';
    var modal = el('div', 'match-modal');

    var closeBtn = el('button', 'mm-close'); closeBtn.textContent = '✕';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.addEventListener('click', closeMatchModal);
    modal.appendChild(closeBtn);

    var roundLbls = { r32: 'Round of 32', r16: 'Round of 16', qf: 'Quarter-final', sf: 'Semi-final', '3rd': 'Third-place Play-off', final: 'Final' };
    var head = el('div', 'mm-head');
    var rEl = el('div', 'mm-round'); rEl.textContent = (roundLbls[m.round] || 'Knockout') + ' · M' + m.no;
    var sEl = el('span', 'mm-status mm-status-' + status);
    sEl.textContent = status === 'live' ? 'LIVE' : (status === 'finished' ? 'Full time' : 'Upcoming');
    head.appendChild(rEl); head.appendChild(sEl);
    modal.appendChild(head);

    modal.appendChild(buildModalTeam(t1, m.team1Label, m.score1, m.pens1, t1win));
    var vs = el('div', 'mm-vs'); vs.textContent = 'v'; modal.appendChild(vs);
    modal.appendChild(buildModalTeam(t2, m.team2Label, m.score2, m.pens2, t2win));

    if ((m.pens1 !== null && m.pens1 !== undefined) || (m.pens2 !== null && m.pens2 !== undefined)) {
      var pensNote = el('div', 'mm-pens-note');
      var w = t1win ? t1 : (t2win ? t2 : null);
      var wp = t1win ? m.pens1 : m.pens2;
      var lp = t1win ? m.pens2 : m.pens1;
      pensNote.textContent = 'Decided on penalties' + (w ? ' — ' + w.name + ' win ' + (wp || 0) + '–' + (lp || 0) : '');
      modal.appendChild(pensNote);
    }

    var meta = el('div', 'mm-meta');
    var when = el('div', 'mm-meta-row'); when.textContent = '🕒 ' + formatMatchTime(m.date, m.utc, state.tz, m.est);
    meta.appendChild(when);
    if (m.venue) {
      var where = el('div', 'mm-meta-row');
      where.textContent = '📍 ' + m.venue + (m.city && m.city !== 'TBD' ? ', ' + m.city : '');
      meta.appendChild(where);
    }
    modal.appendChild(meta);

    overlay.appendChild(modal);
    overlay.addEventListener('click', function (ev) { if (ev.target === overlay) closeMatchModal(); });
    document.body.appendChild(overlay);
    document.addEventListener('keydown', modalEscHandler);
  }

  function buildModalTeam(teamInfo, label, score, pens, isWinner) {
    var row = el('div', 'mm-team' + (isWinner ? ' winner' : ''));

    var flag = el('span', 'mm-flag'); flag.textContent = teamInfo ? teamInfo.flag : '🏳️';
    row.appendChild(flag);

    var info = el('div', 'mm-team-info');
    var name = el('div', 'mm-team-name');
    name.textContent = teamInfo ? teamInfo.name : formatLabel(label);
    info.appendChild(name);
    var buster = teamInfo ? busterNameForTeam(teamInfo.code) : null;
    if (buster) { var b = el('div', 'mm-team-buster'); b.textContent = '🎟️ ' + buster; info.appendChild(b); }
    row.appendChild(info);

    if (isWinner) { var tick = el('span', 'mm-win-tick'); tick.textContent = '✓'; row.appendChild(tick); }

    var sc = el('span', 'mm-score');
    if (score !== null && score !== undefined) {
      sc.textContent = score;
      if (pens !== null && pens !== undefined) {
        var p = el('span', 'mm-pens'); p.textContent = '(' + pens + ')'; sc.appendChild(p);
      }
    } else {
      sc.textContent = '–';
    }
    row.appendChild(sc);
    return row;
  }

  function modalEscHandler(ev) { if (ev.key === 'Escape') closeMatchModal(); }

  function closeMatchModal() {
    openModalMatchId = null;
    var existing = document.getElementById('matchModalOverlay');
    if (existing) existing.parentNode.removeChild(existing);
    document.removeEventListener('keydown', modalEscHandler);
  }

  function buildCardTeamRow(teamInfo, label, score, isWinner, pens) {
    var row = el('div', 'match-card-team');
    if (isWinner) row.classList.add('winner');
    var flagEl = el('span', 'flag'); flagEl.textContent = teamInfo ? teamInfo.flag : '';

    var info = el('div', 'cinfo');
    var nameEl = el('span', 'cname');
    if (teamInfo) { nameEl.textContent = teamInfo.name; nameEl.classList.add('known'); }
    else { nameEl.textContent = formatLabel(label); }
    info.appendChild(nameEl);
    var buster = teamInfo ? busterNameForTeam(teamInfo.code) : null;
    if (buster) {
      var busterEl = el('span', 'cbuster'); busterEl.textContent = '🎟️ ' + buster;
      info.appendChild(busterEl);
    }

    var scoreEl = el('span', 'cscore');
    if (score !== null) {
      scoreEl.textContent = score;
      if (pens !== null && pens !== undefined) {
        var penEl = el('span', 'cpens'); penEl.textContent = '(' + pens + ')';
        scoreEl.appendChild(penEl);
      }
    }
    row.appendChild(flagEl); row.appendChild(info); row.appendChild(scoreEl);
    return row;
  }

  // Maps a team code to the buster entrant who drew it (1:1 across 48 entries).
  var _busterByTeam = null;
  function busterNameForTeam(code) {
    if (!code) return null;
    if (!_busterByTeam) {
      _busterByTeam = {};
      (WC.DRAW || []).forEach(function (e) { if (e.team) _busterByTeam[e.team] = e.name; });
    }
    return _busterByTeam[code] || null;
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

  // ── DRAW RESULTS TAB ──────────────────────────────────────────────────────
  function bindDrawSearch() {
    var input = document.getElementById('drawSearch');
    if (!input) return;
    input.addEventListener('input', function () {
      state.drawFilter = input.value.trim().toLowerCase();
      renderDraw();
    });
  }

  function getTeamByCode(code) {
    var found = null;
    Object.keys(WC.GROUPS).forEach(function (g) {
      WC.GROUPS[g].teams.forEach(function (t) { if (t.code === code) found = t; });
    });
    return found;
  }

  function getAllMatchesForTeam(code) {
    var out = [];
    WC.GROUP_MATCHES.forEach(function (m) {
      if ((m.team1 && m.team1.code === code) || (m.team2 && m.team2.code === code)) out.push(m);
    });
    getKnockoutArray().forEach(function (m) {
      var t1 = resolveKoTeam(m.team1, m.team1Label);
      var t2 = resolveKoTeam(m.team2, m.team2Label);
      if ((t1 && t1.code === code) || (t2 && t2.code === code)) out.push(m);
    });
    return out.sort(function (a, b) {
      var da = a.date + 'T' + a.utc, db = b.date + 'T' + b.utc;
      return da < db ? -1 : da > db ? 1 : 0;
    });
  }

  function getLiveMatchForTeam(code) {
    var matches = getAllMatchesForTeam(code);
    for (var i = 0; i < matches.length; i++) {
      if (matches[i].status === 'live') return matches[i];
    }
    return null;
  }

  function getNextMatchForTeam(code) {
    var matches = getAllMatchesForTeam(code);
    for (var i = 0; i < matches.length; i++) {
      var m = matches[i];
      if (m.status !== 'finished' && m.status !== 'live' && (m.score1 === null || m.score2 === null)) return m;
    }
    return null;
  }

  function matchPerspective(m, code) {
    var t1 = (m.team1 && m.team1.code) ? m.team1 : resolveKoTeam(m.team1, m.team1Label);
    var t2 = (m.team2 && m.team2.code) ? m.team2 : resolveKoTeam(m.team2, m.team2Label);
    if (t1 && t1.code === code) {
      return { us: t1, them: t2, ours: m.score1, theirs: m.score2, ourPens: m.pens1, theirPens: m.pens2 };
    }
    return { us: t2, them: t1, ours: m.score2, theirs: m.score1, ourPens: m.pens2, theirPens: m.pens1 };
  }

  // W/L/D from a team's perspective — respects penalty-shootout winners, where
  // the scoreline alone would read as a draw.
  function resultLetterFor(m, code, p) {
    if (m.winner) return m.winner === code ? 'W' : 'L';
    return p.ours > p.theirs ? 'W' : (p.ours < p.theirs ? 'L' : 'D');
  }

  function getFinishedMatchesForTeam(code) {
    return getAllMatchesForTeam(code).filter(function (m) {
      return m.status === 'finished' || (m.score1 !== null && m.score2 !== null && m.status !== 'live');
    });
  }

  function normName(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function findScorerStats(pickName, pickCountry) {
    if (!state.scorers || !state.scorers.length) return null;
    var tokens = normName(pickName).split(/\s+/);
    var surname = tokens[tokens.length - 1];
    var first = tokens[0];
    var candidates = state.scorers.filter(function (s) {
      return normName(s.player).indexOf(surname) !== -1;
    });
    if (candidates.length > 1) {
      var byCountry = candidates.filter(function (s) {
        return normName(s.nationality) === normName(pickCountry);
      });
      if (byCountry.length) candidates = byCountry;
    }
    if (candidates.length > 1) {
      var byFirst = candidates.filter(function (s) {
        return normName(s.player).indexOf(first) !== -1;
      });
      if (byFirst.length) candidates = byFirst;
    }
    return candidates.length ? candidates[0] : null;
  }

  function renderDraw() {
    var grid = document.getElementById('drawGrid');
    if (!grid || !WC.DRAW) return;
    grid.innerHTML = '';

    var entries = WC.DRAW;
    if (state.drawFilter) {
      entries = entries.filter(function (e) {
        var team = getTeamByCode(e.team);
        var hay = normName(e.name) + ' ' + normName(team ? team.name : '') + ' ' + normName(e.scorer);
        return hay.indexOf(normName(state.drawFilter)) !== -1;
      });
    }

    if (!entries.length) {
      var none = el('div', 'no-matches');
      none.textContent = 'No entries match your search.';
      grid.appendChild(none);
      return;
    }

    entries.forEach(function (e) { grid.appendChild(buildDrawCard(e)); });
  }

  function buildDrawCard(e) {
    var team = getTeamByCode(e.team);
    var liveMatch = getLiveMatchForTeam(e.team);
    var expanded = !!state.drawExpanded[e.no];

    var card = el('div', 'draw-card' + (liveMatch ? ' draw-live' : '') + (expanded ? ' expanded' : ''));

    var top = el('div', 'draw-card-top');

    var numEl = el('span', 'draw-num'); numEl.textContent = '#' + e.no;
    var nameEl = el('div', 'draw-name'); nameEl.textContent = e.name;
    var nameWrap = el('div', 'draw-name-wrap');
    nameWrap.appendChild(numEl); nameWrap.appendChild(nameEl);
    top.appendChild(nameWrap);

    if (liveMatch) {
      var liveBadge = el('div', 'draw-live-badge');
      var dot = el('span', 'live-dot');
      liveBadge.appendChild(dot);
      liveBadge.appendChild(document.createTextNode('LIVE — tap for info'));
      top.appendChild(liveBadge);
    }
    card.appendChild(top);

    var teamRow = el('div', 'draw-team-row');
    var flag = el('span', 'draw-team-flag'); flag.textContent = team ? team.flag : '';
    var tname = el('span', 'draw-team-name'); tname.textContent = team ? team.name : e.team;
    teamRow.appendChild(flag); teamRow.appendChild(tname);

    if (liveMatch) {
      var liveScore = el('span', 'draw-team-livescore');
      liveScore.textContent = (liveMatch.score1 !== null ? liveMatch.score1 : 0) + ' – ' + (liveMatch.score2 !== null ? liveMatch.score2 : 0);
      teamRow.appendChild(liveScore);
    }
    card.appendChild(teamRow);

    var scorerRow = el('div', 'draw-scorer-row');
    scorerRow.textContent = '⚽ ' + e.scorer + ' (' + e.scorerCountry + ')';
    var stats = findScorerStats(e.scorer, e.scorerCountry);
    if (stats && stats.goals > 0) {
      var goalsPill = el('span', 'draw-goals-pill');
      goalsPill.textContent = stats.goals + ' goal' + (stats.goals !== 1 ? 's' : '');
      scorerRow.appendChild(goalsPill);
    }
    card.appendChild(scorerRow);

    var finished = getFinishedMatchesForTeam(e.team);
    var nextMatch = liveMatch ? null : getNextMatchForTeam(e.team);
    if (finished.length || nextMatch) {
      var quick = el('div', 'draw-quick-row');
      if (finished.length) {
        var lastM = finished[finished.length - 1];
        var p = matchPerspective(lastM, e.team);
        var lastEl = el('span', 'draw-quick-item');
        var res = resultLetterFor(lastM, e.team, p);
        var pensTxt = p.ourPens !== null && p.ourPens !== undefined ? ' (' + p.ourPens + '–' + p.theirPens + ' pens)' : '';
        lastEl.textContent = '📊 Last: ' + res + ' ' + p.ours + '–' + p.theirs + pensTxt + (p.them ? ' v ' + p.them.flag : '');
        lastEl.classList.add('draw-res-' + res.toLowerCase());
        quick.appendChild(lastEl);
      }
      if (nextMatch) {
        var np = matchPerspective(nextMatch, e.team);
        var nextEl = el('span', 'draw-quick-item');
        nextEl.textContent = '📅 Next: ' + formatMatchTime(nextMatch.date, nextMatch.utc, state.tz, nextMatch.est) +
          (np.them ? ' v ' + np.them.flag : '');
        quick.appendChild(nextEl);
      }
      card.appendChild(quick);
    }

    if (expanded) card.appendChild(buildDrawDetail(e, team, liveMatch, stats));

    card.addEventListener('click', function () {
      state.drawExpanded[e.no] = !state.drawExpanded[e.no];
      renderDraw();
    });

    return card;
  }

  function buildDrawDetail(e, team, liveMatch, stats) {
    var detail = el('div', 'draw-detail');

    var m = liveMatch || getNextMatchForTeam(e.team);
    if (m) {
      var lbl = el('div', 'draw-detail-label');
      lbl.textContent = liveMatch ? '🔴 Live now' : '📅 Next match';
      detail.appendChild(lbl);

      var t1 = (m.team1 && m.team1.code) ? m.team1 : resolveKoTeam(m.team1, m.team1Label);
      var t2 = (m.team2 && m.team2.code) ? m.team2 : resolveKoTeam(m.team2, m.team2Label);
      var matchLine = el('div', 'draw-detail-match');
      var n1 = t1 ? (t1.flag + ' ' + t1.name) : formatLabel(m.team1Label);
      var n2 = t2 ? (t2.flag + ' ' + t2.name) : formatLabel(m.team2Label);
      if (liveMatch) {
        matchLine.textContent = n1 + '  ' + (m.score1 !== null ? m.score1 : 0) + ' – ' + (m.score2 !== null ? m.score2 : 0) + '  ' + n2;
      } else {
        matchLine.textContent = n1 + '  vs  ' + n2;
      }
      detail.appendChild(matchLine);

      var meta = el('div', 'draw-detail-meta');
      var when = formatMatchTime(m.date, m.utc, state.tz, m.est);
      meta.textContent = when + ((m.city && m.city !== 'TBD') ? ' · ' + m.city : '');
      detail.appendChild(meta);

      if (!liveMatch) {
        var kickoffIso = m.date + 'T' + m.utc + ':00Z';
        if (Date.parse(kickoffIso) > Date.now()) {
          var cd = el('div', 'draw-detail-countdown');
          cd.dataset.kickoff = kickoffIso;
          cd.dataset.doneText = '⚽ Kick-off!';
          detail.appendChild(cd);
        }
      }
    } else {
      var noneLbl = el('div', 'draw-detail-meta');
      noneLbl.textContent = 'No upcoming fixtures for ' + (team ? team.name : e.team) + '.';
      detail.appendChild(noneLbl);
    }

    var finished = getFinishedMatchesForTeam(e.team);
    if (finished.length) {
      var resLbl = el('div', 'draw-detail-label');
      resLbl.textContent = '📊 Results so far';
      detail.appendChild(resLbl);
      finished.forEach(function (fm) {
        var p = matchPerspective(fm, e.team);
        var line = el('div', 'draw-detail-result');
        var res = resultLetterFor(fm, e.team, p);
        var pd = p.ourPens !== null && p.ourPens !== undefined ? ' (' + p.ourPens + '–' + p.theirPens + ' pens)' : '';
        line.textContent = (p.us ? p.us.flag + ' ' + p.us.name : '?') + '  ' + p.ours + ' – ' + p.theirs + pd + '  ' +
          (p.them ? p.them.flag + ' ' + p.them.name : '?');
        var badge = el('span', 'draw-result-badge draw-res-' + res.toLowerCase());
        badge.textContent = res;
        line.appendChild(badge);
        detail.appendChild(line);
      });
    }

    var scorerLbl = el('div', 'draw-detail-label');
    scorerLbl.textContent = '⚽ Top scorer pick';
    detail.appendChild(scorerLbl);

    var scorerLine = el('div', 'draw-detail-scorer');
    if (stats) {
      scorerLine.textContent = e.scorer + ' — ' + stats.goals + ' World Cup goal' + (stats.goals !== 1 ? 's' : '') +
        (stats.assists ? ' · ' + stats.assists + ' assist' + (stats.assists !== 1 ? 's' : '') : '');
    } else {
      scorerLine.textContent = e.scorer + ' — no World Cup goals yet.';
    }
    detail.appendChild(scorerLine);

    return detail;
  }

  function getTeamByName(name) {
    var found = null;
    Object.keys(WC.GROUPS).forEach(function (g) {
      WC.GROUPS[g].teams.forEach(function (t) { if (t.name === name) found = t; });
    });
    return found;
  }

  function renderReserve() {
    var container = document.getElementById('reserveList');
    if (!container || !WC.RESERVE_SCORERS) return;
    container.innerHTML = '';

    var wrap = el('div', 'reserve-list');
    WC.RESERVE_SCORERS.forEach(function (r, i) {
      var row = el('div', 'reserve-row');

      var num = el('span', 'reserve-num'); num.textContent = i + 1;
      row.appendChild(num);

      var team = getTeamByName(r.country);
      var flag = el('span', 'reserve-flag'); flag.textContent = team ? team.flag : '';
      row.appendChild(flag);

      var info = el('div', 'reserve-info');
      var name = el('div', 'reserve-name'); name.textContent = r.name;
      var country = el('div', 'reserve-country'); country.textContent = r.country;
      info.appendChild(name); info.appendChild(country);
      row.appendChild(info);

      wrap.appendChild(row);
    });
    container.appendChild(wrap);
  }

  // ── SCORERS TAB ───────────────────────────────────────────────────────────
  function renderScorers() {
    var container = document.getElementById('scorersContainer');
    if (!container) return;
    container.innerHTML = '';

    if (!state.scorers || !state.scorers.length) {
      var banner = el('div', 'info-banner');
      banner.textContent = '📡 Top scorer rankings will be live once the tournament starts.';
      container.appendChild(banner);
      return;
    }

    var teamByCode = {};
    Object.keys(WC.GROUPS).forEach(function (g) {
      WC.GROUPS[g].teams.forEach(function (t) { teamByCode[t.code] = t; });
    });

    var wrap = el('div', 'scorers-table-wrap');

    // Map each API scorer to the buster entrant(s) whose top-scorer pick they
    // are, using the same matcher the draw cards use.
    var pickedBy = {};
    (WC.DRAW || []).forEach(function (e) {
      var match = findScorerStats(e.scorer, e.scorerCountry);
      if (match) {
        var key = match.player + '|' + match.teamTla;
        (pickedBy[key] = pickedBy[key] || []).push(e.name);
      }
    });

    var hdr = el('div', 'scorers-header');
    var title = el('span', 'scorers-title'); title.textContent = '⚽ Top Goalscorers';
    hdr.appendChild(title);
    if (state.scorersUpdated) {
      var upd = el('span', 'scorers-updated');
      upd.textContent = 'Updated ' + formatDateTimeDisplay(new Date(state.scorersUpdated));
      hdr.appendChild(upd);
    }
    wrap.appendChild(hdr);

    var tbl = el('table', 'scorers-table');
    var thead = el('thead');
    var hr = el('tr');
    ['#', 'Player', 'G', 'A', 'Pen'].forEach(function (h) {
      var th = el('th'); th.textContent = h; hr.appendChild(th);
    });
    thead.appendChild(hr);
    tbl.appendChild(thead);

    var medals = ['🥇', '🥈', '🥉'];
    var tbody = el('tbody');
    state.scorers.forEach(function (s, i) {
      var rank = i + 1;
      var teamInfo = teamByCode[s.teamTla] || null;

      var tr = el('tr', rank === 1 ? 'scorer-top' : '');

      var tdRank = el('td');
      tdRank.textContent = rank <= 3 ? medals[rank - 1] : String(rank);
      tr.appendChild(tdRank);

      var tdPlayer = el('td');
      var nameEl = el('div', 'scorer-player'); nameEl.textContent = s.player;
      var teamEl = el('div', 'scorer-team');
      teamEl.textContent = teamInfo ? (teamInfo.flag + ' ' + teamInfo.name) : s.team;
      tdPlayer.appendChild(nameEl);
      tdPlayer.appendChild(teamEl);
      var owners = pickedBy[s.player + '|' + s.teamTla];
      if (owners) {
        var ownerEl = el('div', 'scorer-buster');
        ownerEl.textContent = '🎟️ ' + owners.join(', ');
        tdPlayer.appendChild(ownerEl);
      }
      tr.appendChild(tdPlayer);

      var tdGoals = el('td', 'scorer-goals'); tdGoals.textContent = s.goals; tr.appendChild(tdGoals);
      var tdAst   = el('td'); tdAst.textContent = s.assists || 0; tr.appendChild(tdAst);
      var tdPen   = el('td'); tdPen.textContent = s.penalties || 0; tr.appendChild(tdPen);

      tbody.appendChild(tr);
    });
    tbl.appendChild(tbody);
    wrap.appendChild(tbl);
    container.appendChild(wrap);
  }

  // ── CARDS TAB ─────────────────────────────────────────────────────────────
  function renderCards() {
    var container = document.getElementById('cardsContainer');
    if (!container) return;
    container.innerHTML = '';

    if (!state.cards || !state.cards.length) {
      var banner = el('div', 'info-banner');
      banner.textContent = '📡 Disciplinary stats will appear once matches are played.';
      container.appendChild(banner);
      return;
    }

    var teamByCode = {};
    Object.keys(WC.GROUPS).forEach(function (g) {
      WC.GROUPS[g].teams.forEach(function (t) { teamByCode[t.code] = t; });
    });

    var wrap = el('div', 'scorers-table-wrap');

    var hdr = el('div', 'scorers-header');
    var title = el('span', 'scorers-title'); title.textContent = '🟨 Disciplinary';
    hdr.appendChild(title);
    if (state.cardsUpdated) {
      var upd = el('span', 'scorers-updated');
      upd.textContent = 'Updated ' + formatDateTimeDisplay(new Date(state.cardsUpdated));
      hdr.appendChild(upd);
    }
    wrap.appendChild(hdr);

    var tbl = el('table', 'scorers-table');
    var thead = el('thead');
    var hr = el('tr');
    ['#', 'Player', '🟨', '🟨🟥', '🟥'].forEach(function (h) {
      var th = el('th'); th.textContent = h; hr.appendChild(th);
    });
    thead.appendChild(hr);
    tbl.appendChild(thead);

    var tbody = el('tbody');
    state.cards.forEach(function (s, i) {
      var teamInfo = teamByCode[s.teamTla] || null;
      var tr = el('tr');

      var tdRank = el('td'); tdRank.textContent = i + 1; tr.appendChild(tdRank);

      var tdPlayer = el('td');
      var nameEl = el('div', 'scorer-player'); nameEl.textContent = s.player;
      var teamEl = el('div', 'scorer-team');
      teamEl.textContent = teamInfo ? (teamInfo.flag + ' ' + teamInfo.name) : s.team;
      tdPlayer.appendChild(nameEl); tdPlayer.appendChild(teamEl);
      tr.appendChild(tdPlayer);

      var tdY  = el('td', 'scorer-goals'); tdY.textContent  = s.yellow    || 0; tr.appendChild(tdY);
      var tdYR = el('td');                 tdYR.textContent = s.yellowRed || 0; tr.appendChild(tdYR);
      var tdR  = el('td');                 tdR.textContent  = s.red        || 0; tr.appendChild(tdR);

      tbody.appendChild(tr);
    });
    tbl.appendChild(tbody);
    wrap.appendChild(tbl);
    container.appendChild(wrap);
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
  function renderSweepstake() { /* static content, nothing to bind */ }

  function showBusterSuccess(name) {
    var card = document.getElementById('busterCard');
    if (!card) return;

    var firstName = name.split(/\s+/)[0];
    var waMsg = 'Hi Brian, I\'ve just entered the World Cup Buster — ' + name;

    card.innerHTML = '';
    card.className = 'buster-card buster-success-card';

    var icon = el('div', 'success-icon'); icon.textContent = '🎉';
    var heading = el('h2', 'success-heading'); heading.textContent = 'Entry submitted, ' + firstName + '!';
    var msg = el('p', 'success-msg');
    msg.textContent = 'Now WhatsApp Brian to confirm your spot. He\'ll reply with the ' + ENTRY_FEE + ' payment link — spots are first come, first served.';

    var waBtn = el('a', 'whatsapp-btn success-wa-primary');
    waBtn.href = 'https://wa.me/353852789446?text=' + encodeURIComponent(waMsg);
    waBtn.target = '_blank';
    waBtn.rel = 'noopener';
    waBtn.textContent = '💬 WhatsApp Brian to confirm';

    var note = el('p', 'success-pay-warning');
    note.textContent = '⚠️ Your entry is not confirmed until Brian receives your payment.';

    card.appendChild(icon);
    card.appendChild(heading);
    card.appendChild(msg);
    card.appendChild(waBtn);
    card.appendChild(note);
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
