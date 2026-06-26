'use strict';

const SYSTEM_PROMPT = `You are Vibe, an expert music curator with deep knowledge across all genres and eras. When given a mood or scenario, you build the perfect playlist using the provided tools.

Steps:
1. Call set_playlist_info first — give the playlist a creative name, a short evocative description (2–3 sentences), and one emoji.
2. Call add_track_to_playlist for each of 8–12 songs that genuinely fit the vibe.

Track selection rules:
- Choose real, existing songs
- Mix well-known tracks with a few hidden gems
- Vary the eras unless the vibe demands otherwise
- Write a specific "why it fits" (1–2 sentences) — not generic phrases like "great energy"
- Pick 2–4 mood tags per track that describe the texture and feel`;

const TOOLS = [
  {
    name: 'set_playlist_info',
    description: 'Set the playlist name, description and emoji before adding tracks.',
    input_schema: {
      type: 'object',
      properties: {
        name:        { type: 'string', description: 'Creative playlist name' },
        description: { type: 'string', description: 'Short evocative description (2–3 sentences)' },
        emoji:       { type: 'string', description: 'Single emoji representing the vibe' }
      },
      required: ['name', 'description', 'emoji']
    }
  },
  {
    name: 'add_track_to_playlist',
    description: 'Add one song to the playlist.',
    input_schema: {
      type: 'object',
      properties: {
        title:      { type: 'string' },
        artist:     { type: 'string' },
        album:      { type: 'string' },
        year:       { type: 'integer' },
        genres:     { type: 'array', items: { type: 'string' }, description: '1–3 genre labels' },
        why_it_fits:{ type: 'string', description: '1–2 sentences on why this track fits the vibe' },
        mood_tags:  { type: 'array', items: { type: 'string' }, description: '2–4 mood/texture descriptors' }
      },
      required: ['title', 'artist', 'album', 'year', 'genres', 'why_it_fits', 'mood_tags']
    }
  }
];

// ── State ─────────────────────────────────────
let apiKey = localStorage.getItem('vibe_api_key') || '';
let trackCount = 0;
let generating = false;

// ── DOM refs ──────────────────────────────────
const $ = id => document.getElementById(id);
const keySetup      = $('keySetup');
const mainApp       = $('mainApp');
const apiKeyInput   = $('apiKeyInput');
const saveKeyBtn    = $('saveKeyBtn');
const changeKeyBtn  = $('changeKeyBtn');
const vibeInput     = $('vibeInput');
const generateBtn   = $('generateBtn');
const playlistSection = $('playlistSection');
const playlistHeader  = $('playlistHeader');
const tracksGrid      = $('tracksGrid');
const loadingMore     = $('loadingMore');

// ── Init ──────────────────────────────────────
function init() {
  if (apiKey) showMain();
}

function showMain() {
  keySetup.classList.add('hidden');
  mainApp.classList.remove('hidden');
}

function showKeySetup() {
  mainApp.classList.add('hidden');
  keySetup.classList.remove('hidden');
  apiKeyInput.value = '';
  apiKeyInput.focus();
}

// ── API key handlers ──────────────────────────
saveKeyBtn.addEventListener('click', () => {
  const k = apiKeyInput.value.trim();
  if (!k.startsWith('sk-ant-')) {
    alert('Please enter a valid Anthropic API key (starts with sk-ant-).');
    return;
  }
  apiKey = k;
  localStorage.setItem('vibe_api_key', apiKey);
  showMain();
});

apiKeyInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') saveKeyBtn.click();
});

changeKeyBtn.addEventListener('click', () => {
  if (generating) return;
  localStorage.removeItem('vibe_api_key');
  apiKey = '';
  showKeySetup();
});

// ── Suggestion chips ──────────────────────────
document.querySelectorAll('.suggestion-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    if (generating) return;
    vibeInput.value = chip.dataset.vibe;
    generatePlaylist();
  });
});

// ── Generate ──────────────────────────────────
generateBtn.addEventListener('click', generatePlaylist);

vibeInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    generatePlaylist();
  }
});

async function generatePlaylist() {
  const vibe = vibeInput.value.trim();
  if (!vibe || generating) return;

  generating = true;
  trackCount = 0;

  // Reset UI
  tracksGrid.innerHTML = '';
  playlistHeader.innerHTML = '';
  playlistSection.classList.remove('hidden');
  loadingMore.classList.remove('hidden');
  generateBtn.disabled = true;
  generateBtn.querySelector('.btn-text').textContent = 'Generating…';

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4096,
        stream: true,
        system: SYSTEM_PROMPT,
        tools: TOOLS,
        messages: [{ role: 'user', content: `Create a playlist for this vibe: ${vibe}` }]
      })
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error?.message || `API error ${res.status}`);
    }

    await consumeStream(res.body);

  } catch (err) {
    showError(err.message);
    if (/authentication|401|invalid.+key/i.test(err.message)) {
      localStorage.removeItem('vibe_api_key');
      apiKey = '';
      setTimeout(showKeySetup, 1800);
    }
  } finally {
    loadingMore.classList.add('hidden');
    generating = false;
    generateBtn.disabled = false;
    generateBtn.querySelector('.btn-text').textContent = 'Generate Playlist';
  }
}

// ── SSE stream parser ─────────────────────────
async function consumeStream(body) {
  const reader  = body.getReader();
  const decoder = new TextDecoder();
  let buf = '';

  let currentBlock = null; // { type, name }
  let jsonBuf = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buf += decoder.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop(); // keep trailing partial line

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const raw = line.slice(6).trim();
      if (raw === '[DONE]') continue;

      let evt;
      try { evt = JSON.parse(raw); } catch { continue; }

      switch (evt.type) {
        case 'content_block_start':
          currentBlock = evt.content_block;
          jsonBuf = '';
          break;

        case 'content_block_delta':
          if (evt.delta.type === 'input_json_delta') {
            jsonBuf += evt.delta.partial_json;
          }
          break;

        case 'content_block_stop':
          if (currentBlock?.type === 'tool_use') {
            try {
              const input = JSON.parse(jsonBuf);
              handleTool(currentBlock.name, input);
            } catch (e) {
              console.warn('Failed to parse tool input:', e, jsonBuf);
            }
          }
          currentBlock = null;
          jsonBuf = '';
          break;
      }
    }
  }
}

// ── Tool handlers ─────────────────────────────
function handleTool(name, input) {
  if (name === 'set_playlist_info')     renderHeader(input);
  else if (name === 'add_track_to_playlist') renderTrack(input);
}

function renderHeader({ name, description, emoji }) {
  playlistHeader.innerHTML =
    `<div class="playlist-title">${esc(emoji)} ${esc(name)}</div>` +
    `<div class="playlist-desc">${esc(description)}</div>`;
}

function renderTrack({ title, artist, album, year, genres = [], why_it_fits, mood_tags = [] }) {
  trackCount++;
  const card = document.createElement('div');
  card.className = 'track-card';

  const allTags = [...genres, ...mood_tags]
    .filter((t, i, a) => a.indexOf(t) === i) // dedupe
    .slice(0, 6);

  card.innerHTML =
    `<div class="track-num">${trackCount}</div>` +
    `<div class="track-info">` +
      `<div class="track-title">${esc(title)}</div>` +
      `<div class="track-artist"><strong>${esc(artist)}</strong> · ${esc(album)}</div>` +
      `<div class="track-why">${esc(why_it_fits)}</div>` +
      (allTags.length
        ? `<div class="track-tags">${allTags.map(t => `<span class="track-tag">${esc(t)}</span>`).join('')}</div>`
        : '') +
    `</div>` +
    `<div class="track-year">${year || ''}</div>`;

  tracksGrid.appendChild(card);
}

function showError(msg) {
  playlistHeader.innerHTML = `<div class="error-banner">⚠️ ${esc(msg)}</div>`;
}

// ── Helpers ───────────────────────────────────
function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

init();
