// ======================
// CONFIG
// ======================
const CSV_PATH = "./data/BK.csv";
const MEDIA_INDEX_PATH = "./data/media-index.json";

// ======================
// GLOBAL STATE
// ======================
let items = [];
let mediaIndex = {};
let selectedTypes = new Set();
let selectedAff = new Set();

// ======================
// INIT
// ======================
document.addEventListener("DOMContentLoaded", async () => {
  await loadCSV();
  await loadMediaIndex();

  buildFilters();
  renderGallery();

  setupEvents();
});

// ======================
// LOADERS
// ======================
async function loadCSV() {
  const res = await fetch(CSV_PATH);
  const text = await res.text();

  const lines = text.trim().split("\n");
  const headers = lines[0].split(",");

  items = lines.slice(1).map(line => {
    const cols = line.split(",");

    return {
      ID: cols[0],
      Name: cols[1],
      Type: cols[2],
      Affiliation: cols[3],
      Desc: cols[4],
      imgId: cols[5]
    };
  });
}

async function loadMediaIndex() {
  const res = await fetch(MEDIA_INDEX_PATH);
  mediaIndex = await res.json();
}

// ======================
// FILTERS
// ======================
function buildFilters() {
  const typeRoot = document.getElementById("filter-type");
  const affRoot = document.getElementById("filter-aff");

  const uniqueTypes = [...new Set(items.map(i => i.Type))].sort();
  const uniqueAff = [...new Set(items.map(i => i.Affiliation))].sort();

  uniqueTypes.forEach(t => {
    const id = "ft_" + t;
    typeRoot.appendChild(makeCheckbox(id, t, selectedTypes));
  });

  uniqueAff.forEach(a => {
    const id = "fa_" + a;
    affRoot.appendChild(makeCheckbox(id, a, selectedAff));
  });
}

function makeCheckbox(id, label, setRef) {
  const wrap = document.createElement("label");
  wrap.className = "check-row";

  const input = document.createElement("input");
  input.type = "checkbox";
  input.id = id;

  input.addEventListener("change", () => {
    if (input.checked) setRef.add(label);
    else setRef.delete(label);
    renderGallery();
  });

  const span = document.createElement("span");
  span.textContent = label;

  wrap.appendChild(input);
  wrap.appendChild(span);

  return wrap;
}

// ======================
// GALLERY
// ======================
function renderGallery() {
  const g = document.getElementById("gallery");
  g.innerHTML = "";

  let filtered = items;

  if (selectedTypes.size > 0) {
    filtered = filtered.filter(i => selectedTypes.has(i.Type));
  }

  if (selectedAff.size > 0) {
    filtered = filtered.filter(i => selectedAff.has(i.Affiliation));
  }

  // No results message
  document.getElementById("no-results").hidden = filtered.length > 0;

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${item.Name}</h4>
      <p class="type">${item.Type}</p>
    `;

    card.addEventListener("click", () => openModal(item));
    g.appendChild(card);
  });
}

// ======================
// MODAL
// ======================
function openModal(item) {
  document.getElementById("overlay").hidden = false;

  document.getElementById("modalTitle").textContent = item.Name;
  document.getElementById("modalType").textContent = item.Type;
  document.getElementById("modalAff").textContent = item.Affiliation;
  document.getElementById("modalDesc").textContent = item.Desc;

  const mg = document.getElementById("mediaGallery");
  mg.innerHTML = "";

  // find media matching prefix
  const mediaList = mediaIndex[item.imgId] || [];

  mediaList.forEach(file => {
    const ext = file.toLowerCase().split(".").pop();

    if (["mp4", "webm"].includes(ext)) {
      const v = document.createElement("video");
      v.src = "./Media/" + file;
      v.controls = true;
      mg.appendChild(v);
    } else {
      const img = document.createElement("img");
      img.src = "./Media/" + file;
      mg.appendChild(img);
    }
  });
}

function closeModal() {
  document.getElementById("overlay").hidden = true;
}

// ======================
// EVENTS
// ======================
function setupEvents() {
  document.getElementById("closeModal").addEventListener("click", closeModal);

  document.getElementById("resetType").addEventListener("click", () => {
    selectedTypes.clear();
    document.querySelectorAll("#filter-type input").forEach(i => (i.checked = false));
    renderGallery();
  });

  document.getElementById("resetAff").addEventListener("click", () => {
    selectedAff.clear();
    document.querySelectorAll("#filter-aff input").forEach(i => (i.checked = false));
    renderGallery();
  });

  document.getElementById("overlay").addEventListener("click", e => {
    if (e.target.id === "overlay") closeModal();
  });
}
