// script.js (ES module)
const BK_CSV = 'BK.csv';
const MEDIA_INDEX = 'media-index.json';

const state = {
  items: [],        // parsed rows
  mediaFiles: [],   // list of filenames in /Media/
  filters: {
    types: new Set(),
    affs: new Set(),
  },
  selectedTypes: new Set(),
  selectedAffs: new Set(),
};

document.addEventListener('DOMContentLoaded', init);

async function init(){
  await Promise.all([loadCSV(), loadMediaIndex()]);
  buildFiltersUI();
  renderGallery();
  attachUIEvents();
}

async function loadCSV(){
  try {
    const res = await fetch(BK_CSV);
    if(!res.ok) throw new Error('BK.csv fetch failed');
    const text = await res.text();
    state.items = parseCSV(text);
  } catch (e){
    console.error('Error loading CSV', e);
    state.items = [];
  }
}

async function loadMediaIndex(){
  try {
    const res = await fetch(MEDIA_INDEX);
    if(!res.ok) throw new Error('media-index.json fetch failed');
    state.mediaFiles = await res.json(); // expects array of filenames like ["fab851.png", ...]
  } catch (e){
    console.error('Error loading media index', e);
    state.mediaFiles = [];
  }
}

function parseCSV(text){
  // Simple CSV parser assuming no newlines inside fields and comma-separated,
  // headers in first row: ID,Name,Type,Affiliation,Desc,imgId
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if(lines.length < 2) return [];
  const headers = lines[0].split(',').map(h=>h.trim());
  const rows = lines.slice(1).map(line => {
    // split respecting quoted fields (basic)
    const values = csvSplit(line);
    const obj = {};
    headers.forEach((h,i)=> obj[h] = (values[i] || '').trim());
    // collect available filters
    if(obj.Type) state.filters.types.add(obj.Type);
    if(obj.Affiliation) state.filters.affs.add(obj.Affiliation);
    return obj;
  });
  return rows;
}

function csvSplit(line){
  const result = [];
  let cur = '';
  let inQuotes = false;
  for(let i=0;i<line.length;i++){
    const ch = line[i];
    if(ch === '"' ){
      if(inQuotes && line[i+1] === '"'){ cur += '"'; i++; } else { inQuotes = !inQuotes; }
    } else if(ch === ',' && !inQuotes){
      result.push(cur); cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result;
}

function buildFiltersUI(){
  const typeList = document.getElementById('typeList');
  const affList = document.getElementById('affList');

  // sort for consistent order
  const types = Array.from(state.filters.types).sort((a,b)=> a.localeCompare(b,'uk'));
  const affs = Array.from(state.filters.affs).sort((a,b)=> a.localeCompare(b,'uk'));

  types.forEach(t => {
    const id = `type_${cssSafe(t)}`;
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" data-type="${escapeHtml(t)}" id="${id}"> <span>${escapeHtml(t)}</span>`;
    typeList.appendChild(label);
  });

  affs.forEach(a => {
    const id = `aff_${cssSafe(a)}`;
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" data-aff="${escapeHtml(a)}" id="${id}"> <span>${escapeHtml(a)}</span>`;
    affList.appendChild(label);
  });
}

function attachUIEvents(){
  // Filter checkboxes
  document.getElementById('typeList').addEventListener('change', (e)=>{
    const cb = e.target;
    if(cb.matches('input[type="checkbox"]') && cb.dataset.type !== undefined){
      const val = cb.dataset.type;
      if(cb.checked) state.selectedTypes.add(val); else state.selectedTypes.delete(val);
      renderGallery();
    }
  });
  document.getElementById('affList').addEventListener('change', (e)=>{
    const cb = e.target;
    if(cb.matches('input[type="checkbox"]') && cb.dataset.aff !== undefined){
      const val = cb.dataset.aff;
      if(cb.checked) state.selectedAffs.add(val); else state.selectedAffs.delete(val);
      renderGallery();
    }
  });

  document.getElementById('clearType').addEventListener('click', ()=>{
    state.selectedTypes.clear();
    document.querySelectorAll('#typeList input[type="checkbox"]').forEach(i=>i.checked=false);
    renderGallery();
  });
  document.getElementById('clearAff').addEventListener('click', ()=>{
    state.selectedAffs.clear();
    document.querySelectorAll('#affList input[type="checkbox"]').forEach(i=>i.checked=false);
    renderGallery();
  });

  // gallery click (delegate)
  document.getElementById('gallery').addEventListener('click', (e)=>{
    const card = e.target.closest('.card');
    if(!card) return;
    const id = card.dataset.id;
    const item = state.items.find(it => it.ID === id);
    if(item) openModal(item);
  });

  // modal
  document.getElementById('closeModal').addEventListener('click', closeModal);
  document.getElementById('overlay').addEventListener('click', (e)=>{
    if(e.target === document.getElementById('overlay')) closeModal();
  });

  // mobile toggle
  const toggleFilters = document.getElementById('toggleFilters');
  if(toggleFilters) toggleFilters.addEventListener('click', ()=>{
    const f = document.getElementById('filters');
    f.style.display = (f.style.display === 'none' || getComputedStyle(f).display === 'none') ? 'block' : 'none';
  });
}

function renderGallery(){
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';
  const filtered = state.items.filter(item => {
    // type filter
    if(state.selectedTypes.size > 0 && !state.selectedTypes.has(item.Type)) return false;
    // affiliation filter
    if(state.selectedAffs.size > 0 && !state.selectedAffs.has(item.Affiliation)) return false;
    return true;
  });

  if(filtered.length === 0){
    document.getElementById('noResults').hidden = false;
  } else {
    document.getElementById('noResults').hidden = true;
  }

  filtered.forEach(it => {
    const card = document.createElement('article');
    card.className = 'card';
    card.dataset.id = it.ID;
    card.innerHTML = `<h4>${escapeHtml(it.Name)}</h4><div class="type">${escapeHtml(it.Type)}</div>`;
    gallery.appendChild(card);
  });
}

/* Modal logic */
function openModal(item){
  const overlay = document.getElementById('overlay');
  document.getElementById('modalTitle').textContent = item.Name;
  document.getElementById('modalType').textContent = item.Type;
  document.getElementById('modalAff').textContent = item.Affiliation;
  document.getElementById('modalDesc').textContent = item.Desc || '';

  // build media gallery: select media files that startsWith(imgId)
  const mid = item.imgId || '';
  const matched = state.mediaFiles.filter(fn => fn.toLowerCase().startsWith(mid.toLowerCase()));
  const mediaRoot = 'Media/';
  const mg = document.getElementById('mediaGallery');
  mg.innerHTML = '';
  if(matched.length === 0){
    mg.innerHTML = '<div class="media-item">Медіа не знайдено.</div>';
  } else {
    matched.forEach(fn => {
      const ext = fn.split('.').pop().toLowerCase();
      const wrapper = document.createElement('div');
      wrapper.className = 'media-item';
      if(['mp4','webm','ogg'].includes(ext)){
        const v = document.createElement('video');
        v.controls = true;
        v.src = mediaRoot + fn;
        v.setAttribute('playsinline','');
        wrapper.appendChild(v);
      } else {
        const img = document.createElement('img');
        img.alt = item.Name + ' - media';
        img.src = mediaRoot + fn;
        wrapper.appendChild(img);
      }
      mg.appendChild(wrapper);
    });
  }

  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal(){
  const overlay = document.getElementById('overlay');
  overlay.hidden = true;
  document.body.style.overflow = '';
}

/* utilities */
function cssSafe(s){ return String(s).replace(/\s+/g,'_').replace(/[^\w\-]/g,''); }
function escapeHtml(s){ return String(s||''); }
