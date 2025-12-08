document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.getElementById("gallery");
    const typeFilter = document.getElementById("filterType");
    const affFilter = document.getElementById("filterAff");
    const clearBtn = document.getElementById("clearFilters");

    const overlay = document.getElementById("overlay");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");
    const closeModal = document.getElementById("closeModal");

    let items = [];

    // Load CSV
    fetch("./data/BK.csv")
        .then((response) => response.text())
        .then((text) => {
            items = parseCSV(text);
            populateFilters(items);
            renderGallery(items);
        });

    function parseCSV(data) {
        const rows = data.split("\n").map((r) => r.trim()).filter(Boolean);
        const headers = rows.shift().split(",");

        return rows.map((line) => {
            const values = line.split(",");
            let obj = {};
            headers.forEach((h, i) => {
                obj[h.trim()] = values[i] ? values[i].trim() : "";
            });
            return obj;
        });
    }

    function populateFilters(data) {
        const types = [...new Set(data.map(i => i.Type))].sort();
        const affs = [...new Set(data.map(i => i.Affiliation))].sort();

        types.forEach(t => {
            const opt = document.createElement("option");
            opt.value = t;
            opt.textContent = t;
            typeFilter.appendChild(opt);
        });

        affs.forEach(a => {
            const opt = document.createElement("option");
            opt.value = a;
            opt.textContent = a;
            affFilter.appendChild(opt);
        });
    }

    function renderGallery(data) {
        gallery.innerHTML = "";

        data.forEach((item) => {
            const card = document.createElement("div");
            card.className = "card";

            const imgSrc = `./Media/${item.imgId}.webp`;

            card.innerHTML = `
                <img src="${imgSrc}" alt="${item.Name}">
                <h3>${item.Name}</h3>
                <p><b>Type:</b> ${item.Type}</p>
                <p><b>Affiliation:</b> ${item.Affiliation}</p>
            `;

            // Make card clickable
            card.addEventListener("click", () => openModal(item, imgSrc));

            gallery.appendChild(card);
        });
    }

    function applyFilters() {
        const t = typeFilter.value;
        const a = affFilter.value;

        const filtered = items.filter(x =>
            (t === "" || x.Type === t) &&
            (a === "" || x.Affiliation === a)
        );

        renderGallery(filtered);
    }

    typeFilter.addEventListener("change", applyFilters);
    affFilter.addEventListener("change", applyFilters);

    clearBtn.addEventListener("click", () => {
        typeFilter.value = "";
        affFilter.value = "";
        renderGallery(items);
    });

    function openModal(item, imgSrc) {
        modalTitle.textContent = item.Name;

        modalBody.innerHTML = `
            <img src="${imgSrc}" alt="${item.Name}">
            <p><b>Type:</b> ${item.Type}</p>
            <p><b>Affiliation:</b> ${item.Affiliation}</p>
            <p>${item.Desc}</p>
        `;

        overlay.classList.add("active");
    }

    closeModal.addEventListener("click", () => {
        overlay.classList.remove("active");
    });

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.classList.remove("active");
    });
});
