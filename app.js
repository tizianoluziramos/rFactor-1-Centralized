const warnings = [
  {
    path: ["Mods", "World Karting"],
    url: "https://t.me/+9aIYb9arV29iYzYx",
  },
  {
    path: ["Pistas", "World Karting"],
    url: "https://t.me/+9qTPI6X-LxRjZTNh",
  },
  {
    path: ["Mods", "Formula", "FE"],
    url: "https://t.me/+KnMGfM2nnUdjMzhh",
  },
  {
    path: ["Trackpacks", "Formula", "FE"],
    url: "https://t.me/+uT85E4nfxUk4NmMx",
  },
  {
    path: ["Trackpacks", "Formula", "F1"],
    url: "https://t.me/+Bev4vD2MmURjNmI5",
  },
  {
    path: ["Mods", "Fiat"],
    url: "https://t.me/+pm1YZpdMbIQyNmEx",
  },
];

const categories = [
  {
    name: "Mods",
    subcategories: [
      {
        name: "Formula",
        subcategories: [
          { name: "F1", endpoint: "mods/formula/f1.json" },
          { name: "F2", endpoint: "mods/formula/f2.json" },
          { name: "F3", endpoint: "mods/formula/f3.json" },
          { name: "FE", endpoint: "mods/formula/fe.json" },
        ],
      },
      {
        name: "World Karting",
        endpoint: "mods/worldkarting.json",
      },
      {
        name: "Fiat",
        endpoint: "mods/fiat.json",
      },
    ],
  },
  {
    name: "Pistas",
    subcategories: [
      {
        name: "Formula",
        subcategories: [{ name: "F1", endpoint: "tracks/formula/f1.json" }],
      },
      {
        name: "World Karting",
        endpoint: "tracks/worldkarting.json",
      },
    ],
  },
  {
    name: "Trackpacks",
    subcategories: [
      {
        name: "Formula",
        subcategories: [
          {
            name: "F1",
            endpoint: "trackpack/formula/f1.json",
          },
          {
            name: "FE",
            endpoint: "trackpack/formula/fe.json",
          },
        ],
      },
    ],
  },
  {
    name: "Software",
    endpoint: "software.json",
  },
  {
    name: "Plugins",
    endpoint: "plugins.json",
  },
];

const navbar = document.getElementById("navbar");
const mainContent = document.getElementById("main-content");
let currentPath = [];

function renderNavbar() {
  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.setAttribute("aria-label", `Explorar ${category.name}`);
    btn.dataset.category = category.name;
    btn.addEventListener("click", () => loadCategory(category, btn));
    navbar.appendChild(btn);
  });
}

function loadCategory(category, clickedButton) {
  document
    .querySelectorAll("#navbar button")
    .forEach((btn) => btn.classList.remove("active"));
  clickedButton.classList.add("active");
  currentPath = [category];
  renderCategory(category, mainContent);
}

function createBackButton(container) {
  if (currentPath.length <= 1) return;
  const backBtn = document.createElement("button");
  backBtn.textContent = "← Volver";
  backBtn.className = "back-btn";
  backBtn.addEventListener("click", () => {
    currentPath.pop();
    renderCategory(currentPath[currentPath.length - 1], container);
  });
  container.prepend(backBtn);
}

function renderCategory(category, container) {
  const sectionDiv = document.createElement("div");
  sectionDiv.className = "section";
  createBackButton(sectionDiv);

  const matchedWarning = warnings.find((w) => {
    if (w.path.length !== currentPath.length) return false;
    return w.path.every((name, idx) => currentPath[idx].name === name);
  });
  if (matchedWarning) {
    const warning = document.createElement("p");
    warning.style.color = "orange";
    warning.style.fontWeight = "bold";
    warning.innerHTML = `⚠️ Advertencia: Debes unirte al grupo de Telegram para descargar los archivos: <a href="${matchedWarning.url}" target="_blank">Únete aquí</a>`;
    sectionDiv.appendChild(warning);
  }

  const breadcrumbDiv = document.createElement("div");
  breadcrumbDiv.className = "breadcrumbs";
  currentPath.forEach((cat, idx) => {
    const span = document.createElement("span");
    span.textContent = cat.name;
    span.className = "breadcrumb-item";
    span.addEventListener("click", () => {
      currentPath = currentPath.slice(0, idx + 1);
      renderCategory(currentPath[currentPath.length - 1], mainContent);
    });
    breadcrumbDiv.appendChild(span);
    if (idx < currentPath.length - 1) {
      const separator = document.createElement("span");
      separator.textContent = " → ";
      breadcrumbDiv.appendChild(separator);
    }
  });
  sectionDiv.appendChild(breadcrumbDiv);

  const header = document.createElement("h2");
  header.textContent = category.name;
  sectionDiv.appendChild(header);

  const itemsDiv = document.createElement("div");
  itemsDiv.className = "items";

  if (category.subcategories && category.subcategories.length > 0) {
    category.subcategories.forEach((sub) => {
      const a = document.createElement("a");
      a.href = "#";
      a.textContent = sub.name;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        currentPath.push(sub);
        renderCategory(sub, container);
      });
      itemsDiv.appendChild(a);
    });
  } else if (category.endpoint) {
    loadSubcategory({ name: category.name, endpoint: category.endpoint });
    return;
  } else {
    itemsDiv.innerHTML =
      '<p style="grid-column:1/-1;text-align:center;color:var(--muted)">No hay elementos disponibles.</p>';
  }

  sectionDiv.appendChild(itemsDiv);
  container.innerHTML = "";
  container.appendChild(sectionDiv);
}

async function loadSubcategory(subcategory) {
  mainContent.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Cargando <strong>${subcategory.name}</strong>...</p>
    </div>
  `;
  try {
    const baseUrl = `${window.location.protocol}//${window.location.host}`;

    const res = await fetch(
      `${baseUrl}/rFactor-1-Centralized/${subcategory.endpoint}`
    );

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data))
      throw new Error("La respuesta no es un array válido");
    renderItems(subcategory, data);
  } catch (err) {
    console.error("Error al cargar:", subcategory.name, err);
    mainContent.innerHTML = `
      <div class="error">
        <h3>⚠️ Error al cargar</h3>
        <p>No se pudo cargar <strong>${subcategory.name}</strong>. Inténtalo más tarde.</p>
        <button onclick="location.reload()" class="retry-btn">Reintentar</button>
      </div>
    `;
  }
}

function renderItems(subcategory, items) {
  const sectionDiv = document.createElement("div");
  sectionDiv.className = "section";
  createBackButton(sectionDiv);

  const breadcrumbDiv = document.createElement("div");
  breadcrumbDiv.className = "breadcrumbs";
  currentPath.forEach((cat, idx) => {
    const span = document.createElement("span");
    span.textContent = cat.name;
    span.className = "breadcrumb-item";
    span.addEventListener("click", () => {
      currentPath = currentPath.slice(0, idx + 1);
      renderCategory(currentPath[currentPath.length - 1], mainContent);
    });
    breadcrumbDiv.appendChild(span);
    if (idx < currentPath.length - 1) {
      const separator = document.createElement("span");
      separator.textContent = " → ";
      breadcrumbDiv.appendChild(separator);
    }
  });
  sectionDiv.appendChild(breadcrumbDiv);

  const header = document.createElement("h2");
  header.textContent = subcategory.name;
  sectionDiv.appendChild(header);

  const matchedWarning = warnings.find((w) => {
    if (w.path.length !== currentPath.length) return false;
    return w.path.every((name, idx) => currentPath[idx].name === name);
  });
  if (matchedWarning) {
    const warning = document.createElement("p");
    warning.style.color = "orange";
    warning.style.fontWeight = "bold";
    warning.innerHTML = `⚠️ Advertencia: Debes unirte al grupo de Telegram para descargar los archivos: <a href="${matchedWarning.url}" target="_blank">Únete aquí</a>`;
    sectionDiv.appendChild(warning);
  }

  const itemsDiv = document.createElement("div");
  itemsDiv.className = "items";

  if (items.length === 0) {
    itemsDiv.innerHTML =
      '<p style="grid-column:1/-1;text-align:center;color:var(--muted)">No hay elementos disponibles.</p>';
  } else {
    items.forEach((item) => {
      const a = document.createElement("a");
      a.href = item.url || "#";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = item.name || "Sin nombre";
      a.title = `Abrir ${item.name || "elemento"}`;
      itemsDiv.appendChild(a);
    });
  }

  sectionDiv.appendChild(itemsDiv);
  mainContent.innerHTML = "";
  mainContent.appendChild(sectionDiv);
}

document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    const updateYear = () => {
      yearSpan.textContent = new Date().getFullYear();
    };
    updateYear();
    setInterval(updateYear, 1000 * 60 * 60);
  }

  renderNavbar();
});
