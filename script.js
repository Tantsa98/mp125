// script.js — виправлений, надійний варіант
const CSV_PATH = './data/BK.csv';
const MEDIA_INDEX_PATH = './data/media-index.json';
const MEDIA_FOLDER = './Media/';

let items = [];
let mediaFiles = []; // flat array of filenames (from media-index.json)
let activeTypes = new Set();
let activeAffs = new Set();

function log(...args){ console.log('[BK]', ...args); }

// --- DOM ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadAll();
    renderFilters();
    renderGallery();
    attachUIHandlers();
    log('Init finished');
  } catch (err) {
    console.error('[BK] Init error:', err);
    const g = document.getElementById('gallery');
    if (g) g.innerHTML = `<div class="no-results">Помилка ініціалізації — дивись консоль.</div>`;
  }
});

// --- Load CSV + media index
async function loadAll(){
  const [csvText, mediaJson] = await Promise.all([
    fetchText(CSV_PATH),
    fetchJson(MEDIA_INDEX_PATH)
  ]);
  items = parseCSV(csvText);
  // media-index.json may be either an array or object mapping prefixes -> arrays
  if (Array.isArray(mediaJson)) {
    mediaFiles = mediaJson.slice();
  } else if (typeof mediaJson === 'object' && mediaJson !== null) {
    // flatten object values
    mediaFiles = Object.values(mediaJson).flat();
  } else {
    mediaFiles = [];
  }
  log(`Loaded ${items.length} items, ${mediaFiles.length} media files`);
}

async function fetchText(path){
  const r = await fetch(path);
  if(!r.ok) throw new Error(`Cannot fetch ${path}: ${r.status} ${r.statusText}`);
  return await r.text();
}
async function fetchJson(path){
  const r = await fetch(path);
  if(!r.ok) throw new Error(`Cannot fetch ${path}: ${r.status} ${r.statusText}`);
  return await r.json();
}

// --- Robust CSV parser (handles quoted cells)
function parseCSV(text){
  if(!text) return [];
  const lines = text.replace(/\r/g,'').split('\n').filter(l=>l.trim()!=='');
  if(lines.length < 1) return [];
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  for(let i=1;i<lines.length;i++){
    const cols = parseCSVLine(lines[i]);
    if(cols.length === 0) continue;
    const obj = {};
    for(let j=0;j<headers.length;j++){
      obj[headers[j]] = cols[j] ?? '';
    }
    rows.push(obj);
  }
  return rows;
}
function parseCSVLine(line){
  const res = [];
  let cur = '';
  let inQuotes = false;
  for(let i=0;i<line.length;i++){
    const ch = line[i];
    if(ch === '"'){
      // peek next: if double quote -> escaped quote
      if(inQuotes && line[i+1] === '"'){ cur += '"'; i++; continue; }
      inQuotes = !inQuotes;
      continue;
    }
    if(ch === ',' && !inQuotes){ res.push(cur); cur=''; continue; }
    cur += ch;
  }
  res.push(cur);
  return res.map(s=>s.trim());
}

// --- Filters UI
function uniqueValues(field){
  const s = new Set();
  items.forEach(it=>{
    const v = (it[field] ?? '').trim();
    if(v) s.add(v);
  });
  return Array.from(s).sort((a,b)=>a.localeCompare(b,'uk'));
}

function renderFilters(){
  const typeRoot = document.getElementById('filter-type');
  const affRoot = document.getElementById('filter-aff');
  if(!typeRoot || !affRoot) { log('Filter roots not found'); return; }

  typeRoot.innerHTML = '';
  affRoot.innerHTML = '';

  uniqueValues('Type').forEach(t=>{
    const id = `ft-${safeId(t)}`;
    const lbl = createCheckbox(id, t, ()=>toggleType(t));
    typeRoot.appendChild(lbl);
  });

  uniqueValues('Affiliation').forEach(a=>{
    const id = `fa-${safeId(a)}`;
    const lbl = createCheckbox(id, a, ()=>toggleAff(a));
    affRoot.appendChild(lbl);
  });
}

function createCheckbox(id, labelText, onChange){
  const wrapper = document.createElement('label');
  wrapper.className = 'filter-item';
  wrapper.innerHTML = `<input type="checkbox" id="${id}"> <span>${escapeHtml(labelText)}</span>`;
  const input = wrapper.querySelector('input');
  input.addEventListener('change', onChange);
  return wrapper;
}

function toggleType(value){
  const chk = document.querySelector(`#ft-${safeId(value)}`);
  if(chk && chk.checked) activeTypes.add(value); else activeTypes.delete(value);
  renderGallery();
}
function toggleAff(value){
  const chk = document.querySelector(`#fa-${safeId(value)}`);
  if(chk && chk.checked) activeAffs.add(value); else activeAffs.delete(value);
  renderGallery();
}

// --- Gallery
function renderGallery(){
  const gallery = document.getElementById('gallery');
  const noResults = document.getElementById('no-results');
  if(!gallery) { log('Gallery root not found'); return; }
  gallery.innerHTML = '';

  const filtered = items.filter(it=>{
    const matchType = (activeTypes.size === 0) || activeTypes.has(it.Type);
    const matchAff = (activeAffs.size === 0) || activeAffs.has(it.Affiliation);
    return matchType && matchAff;
  });

  if(filtered.length === 0){
    if(noResults) noResults.hidden = false;
    return;
  }
  if(noResults) noResults.hidden = true;

  filtered.forEach(it=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.tabIndex = 0;
    card.innerHTML = `<div class="title">${escapeHtml(it.Name)}</div><div class="type">${escapeHtml(it.Type)}</div>`;
    card.addEventListener('click', ()=>openModalFor(it));
    card.addEventListener('keypress', (e)=>{ if(e.key === 'Enter') openModalFor(it); });
    gallery.appendChild(card);
  });
}

// --- Modal
function openModalFor(item){
  const overlay = document.getElementById('overlay');
  if(!overlay) return;
  // remove hidden attr and add class show (both) to be robust
  overlay.removeAttribute('hidden');
  overlay.classList.add('show');

  document.getElementById('modalTitle').textContent = item.Name || '';
  document.getElementById('modalType').textContent = item.Type || '';
  document.getElementById('modalAff').textContent = item.Affiliation || '';
  document.getElementById('modalDesc').textContent = item.Desc || '';

  const mg = document.getElementById('mediaGallery');
  if(!mg) return;
  mg.innerHTML = '';

  const prefix = (item.imgId || '').toString().trim();
  if(!prefix){
    mg.innerHTML = '<div class="no-results">Не вказано imgId для цього запису.</div>';
    return;
  }

  const matches = mediaFiles.filter(f => f.toLowerCase().startsWith(prefix.toLowerCase()));
  if(matches.length === 0){
    mg.innerHTML = '<div class="no-results">Медіафайлів не знайдено.</div>';
  } else {
    matches.forEach(fname=>{
      const ext = fname.split('.').pop().toLowerCase();
      const wrapper = document.createElement('div');
      wrapper.className = 'media-item';
      if(['mp4','webm','ogg'].includes(ext)){
        const v = document.createElement('video');
        v.src = MEDIA_FOLDER + fname;
        v.controls = true;
        v.preload = 'metadata';
        wrapper.appendChild(v);
      } else {
        const img = document.createElement('img');
        img.src = MEDIA_FOLDER + fname;
        img.alt = fname;
        wrapper.appendChild(img);
      }
      mg.appendChild(wrapper);
    });
  }
}

function closeModal(){
  const overlay = document.getElementById('overlay');
  if(!overlay) return;
  overlay.classList.remove('show');
  // set hidden attribute after a tick to avoid flash
  setTimeout(()=> overlay.setAttribute('hidden',''), 120);
}

// --- Events attach
function attachUIHandlers(){
  document.getElementById('resetType')?.addEventListener('click', ()=>{
    activeTypes.clear();
    document.querySelectorAll('#filter-type input[type=checkbox]').forEach(i=>i.checked=false);
    renderGallery();
  });
  document.getElementById('resetAff')?.addEventListener('click', ()=>{
    activeAffs.clear();
    document.querySelectorAll('#filter-aff input[type=checkbox]').forEach(i=>i.checked=false);
    renderGallery();
  });

  const overlay = document.getElementById('overlay');
  const closeBtn = document.getElementById('closeModal');
  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', (e)=>{
    if(e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e)=> { if(e.key === 'Escape') closeModal(); });
}

// --- Utilities
function safeId(s){ return String(s || '').replace(/\s+/g,'_').replace(/[^\w\-]/g,'').toLowerCase(); }
function escapeHtml(str){ return String(str ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
