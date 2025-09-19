const categories = [
  {
    name: "Mods",
    subcategories: [
      { name: "F1", endpoint: "mods/f1" },
      { name: "F2", endpoint: "mods/f2" },
      { name: "F3", endpoint: "mods/f3" },
    ],
  },
  {
    name: "Trackpacks",
    subcategories: [
      { name: "Circuitos", endpoint: "trackpacks/circuits" },
      { name: "Karting", endpoint: "trackpacks/karting" },
      { name: "Rally", endpoint: "trackpacks/rally" },
    ],
  },
  {
    name: "Herramientas",
    subcategories: [
      { name: "Editores", endpoint: "tools/editors" },
      { name: "Launchers", endpoint: "tools/launchers" },
    ],
  },
];

// Elementos del DOM
const navbar = document.getElementById("navbar");
const submenu = document.getElementById("submenu");
const mainContent = document.getElementById("main-content");

// Estado
let currentCategory = null;
let currentSubcategoryButton = null;

// Renderizar navbar principal
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

// Cargar una categoría (muestra submenu)
function loadCategory(category, clickedButton) {
  // Activar botón principal
  document.querySelectorAll("#navbar button").forEach((btn) => {
    btn.classList.remove("active");
  });
  clickedButton.classList.add("active");

  // Limpiar y renderizar submenu
  submenu.innerHTML = "";
  currentCategory = category;

  category.subcategories.forEach((sub) => {
    const btn = document.createElement("button");
    btn.textContent = sub.name;
    btn.setAttribute("aria-label", `Cargar ${sub.name}`);
    btn.dataset.endpoint = sub.endpoint;

    btn.addEventListener("click", () => loadSubcategory(sub, btn));

    submenu.appendChild(btn);
  });

  // Mostrar mensaje inicial
  mainContent.innerHTML = `
    <div class="placeholder-message">
      <h2>📁 ${category.name}</h2>
      <p>Selecciona una subcategoría arriba para ver su contenido.</p>
      <div class="illustration">⬇️</div>
    </div>
  `;
}

// Cargar una subcategoría
async function loadSubcategory(subcategory, clickedButton) {
  // Activar botón del submenu
  if (currentSubcategoryButton) {
    currentSubcategoryButton.classList.remove("active");
  }
  clickedButton.classList.add("active");
  currentSubcategoryButton = clickedButton;

  // Mostrar loading
  mainContent.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Cargando <strong>${subcategory.name}</strong>...</p>
    </div>
  `;

  try {
    const res = await fetch(
      `http://localhost:3000/api/${subcategory.endpoint}`
    );

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();

    if (!Array.isArray(data))
      throw new Error("La respuesta no es un array válido");

    renderSection(subcategory, data);
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

// Renderizar contenido de subcategoría
function renderSection(subcategory, items) {
  const sectionDiv = document.createElement("div");
  sectionDiv.className = "section";
  sectionDiv.setAttribute(
    "aria-labelledby",
    `section-title-${subcategory.endpoint.replace(/\//g, "-")}`
  );

  const header = document.createElement("h2");
  header.id = `section-title-${subcategory.endpoint.replace(/\//g, "-")}`;
  header.textContent = `${currentCategory.name} → ${subcategory.name}`;
  sectionDiv.appendChild(header);

  const itemsDiv = document.createElement("div");
  itemsDiv.className = "items";

  if (items.length === 0) {
    itemsDiv.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No hay elementos disponibles.</p>`;
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

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
  renderNavbar();
});
