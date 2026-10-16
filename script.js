const categories = [
  { id: "programming", name: "Programmers", color: "#ff6f61", icon: "code" },
  { id: "modeling", name: "Modelers", color: "#ff9b54", icon: "view_in_ar" },
  { id: "ui-design", name: "UI Designers", color: "#a895ff", icon: "web" },
  { id: "visual-effects", name: "VFX Artists", color: "#65bceb", icon: "auto_awesome" },
  { id: "graphics", name: "GFX Artists", color: "#f2cf68", icon: "image" },
  { id: "2d-art", name: "2D Artists", color: "#ed91bd", icon: "palette" },
  { id: "sound-design", name: "SFX Artists", color: "#71d1ba", icon: "graphic_eq" },
  { id: "music", name: "Composers", color: "#c39af2", icon: "music_note" },
  { id: "ugc", name: "UGC Creators", color: "#f3a66a", icon: "local_mall" },
  { id: "clothing", name: "Clothing Designers", color: "#f18ca8", icon: "checkroom" },
  { id: "level-design", name: "Level Designers", color: "#83b6ee", icon: "castle" },
  { id: "animation", name: "Animators", color: "#f0d36c", icon: "directions_run" },
  { id: "management", name: "Managers", color: "#86d39a", icon: "person" }
];

const selected = new Set();
const customRoles = [];
let customRoleDraft = null;
let customRoleId = 0;
const autoScaleRoles = false;
const grid = document.querySelector("#categoryGrid");
const count = document.querySelector("#selectedCount");
const canvas = document.querySelector("#thumbnailCanvas");
const ctx = canvas.getContext("2d");
const canvasWrap = document.querySelector(".canvas-wrap");
const status = document.querySelector("#previewStatus");
const downloadButton = document.querySelector("#downloadButton");
const customRoleField = document.querySelector("#customRoleField");
const customRoleInput = document.querySelector("#customRoleInput");
const customRoleColor = document.querySelector("#customRoleColor");
const headerTextInput = document.querySelector("#headerTextInput");

canvas.addEventListener("contextmenu", event => event.preventDefault());

function iconSvg(category) {
  return `<span class="material-symbols-rounded" aria-hidden="true">${category.icon}</span>`;
}

function renderCards() {
  const cards = categories.map(category => `
    <button class="category-card${selected.has(category.id) ? " selected" : ""}" data-id="${category.id}" type="button" aria-pressed="${selected.has(category.id)}">
      <span class="category-icon" style="--category-color:${category.color}">${iconSvg(category)}</span>
      <span class="category-name">${category.name}</span><span class="category-check">✓</span>
    </button>`);
  customRoles.forEach(role => cards.push(`
    <button class="category-card${selected.has(role.id) ? " selected" : ""}" data-id="${role.id}" type="button" aria-pressed="${selected.has(role.id)}">
      <span class="category-icon" style="--category-color:${role.color}">${iconSvg(role)}</span>
      <span class="category-name">${role.name}</span><span class="category-check">✓</span>
    </button>`));
  cards.push('<button class="category-card add-custom-card" data-id="add-custom" type="button"><span class="category-icon add-custom-icon">+</span><span class="category-name">Add custom role</span></button>');
  grid.innerHTML = cards.join("");
}

function updateUi() {
  count.textContent = selected.size;
  renderCards();
  customRoleField.hidden = !customRoleDraft;
  if (selected.size) {
    drawThumbnail();
    canvasWrap.classList.add("has-content");
    downloadButton.disabled = false;
    status.textContent = `${selected.size} role${selected.size === 1 ? "" : "s"} ready to share`;
  } else {
    canvasWrap.classList.remove("has-content");
    downloadButton.disabled = true;
    status.textContent = "Preview updates as you select roles";
  }
}

function drawThumbnail() {
  if (!document.fonts.check('24px "Material Symbols Rounded"')) {
    document.fonts.ready.then(drawThumbnail);
    return;
  }
  const allRoles = [...categories, ...customRoles];
  const chosen = allRoles.filter(category => selected.has(category.id));
  ctx.clearRect(0, 0, 1600, 900);
  ctx.fillStyle = "#1b2a3b";
  ctx.fillRect(0, 0, 1600, 900);
  ctx.fillStyle = "#2b4056";
  ctx.beginPath(); ctx.arc(1440, 80, 250, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#45e011";
  ctx.beginPath(); ctx.arc(1540, 900, 90, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#f4f8ff"; ctx.font = "800 88px Manrope, sans-serif"; ctx.fillText(headerTextInput.value.trim() || "We're Hiring!", 92, 160);
  ctx.fillStyle = "#0689f0";
  const roleFontSize = autoScaleRoles
    ? Math.max(42, 58 - (chosen.length - 1) * 3)
    : chosen.length === 1 ? 86 : chosen.length === 2 ? 74 : chosen.length <= 6 ? 64 : 58;
  const iconSize = autoScaleRoles
    ? Math.max(62, 82 - (chosen.length - 1) * 3)
    : chosen.length === 1 ? 124 : chosen.length === 2 ? 108 : chosen.length <= 6 ? 94 : 82;
  const iconRadius = Math.round(iconSize * 0.27);
  const columnX = chosen.length <= 2 ? [94] : chosen.length === 3 ? [94, 820] : [94, 820];
  const startY = chosen.length <= 2 ? 290 : 290;
  const rowGap = chosen.length <= 2 ? 180 : chosen.length === 3 ? 170 : chosen.length <= 6 ? 128 : 102;
  chosen.forEach((category, index) => {
    const column = chosen.length <= 2 ? 0 : index % 2;
    const row = chosen.length <= 2 ? index : Math.floor(index / 2);
    const x = columnX[column];
    const y = startY + row * rowGap;
    ctx.fillStyle = category.color; ctx.beginPath(); ctx.roundRect(x, y - iconSize / 2, iconSize, iconSize, iconRadius); ctx.fill();
    drawIcon(category, x + iconSize / 2, y, Math.round(iconSize * 0.76));
    ctx.fillStyle = "#f4f8ff"; ctx.font = `800 ${roleFontSize}px Manrope, sans-serif`;
    ctx.fillText(category.name, x + iconSize + 28, y + roleFontSize * 0.34);
  });
}

function drawIcon(category, x, y, size = 26) {
  ctx.save();
  ctx.fillStyle = "#102238";
  ctx.font = `400 ${size}px "Material Symbols Rounded"`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(category.icon, x, y);
  ctx.restore();
}

grid.addEventListener("click", event => {
  const card = event.target.closest(".category-card");
  if (!card) return;
  const id = card.dataset.id;
  if (id === "add-custom") {
    if (selected.size >= 10) return;
    customRoleDraft = true;
    customRoleField.hidden = false;
    customRoleInput.focus();
    return;
  }
  if (selected.has(id)) selected.delete(id);
  else if (selected.size < 10) selected.add(id);
  else return;
  updateUi();
});

customRoleField.addEventListener("submit", event => {
  event.preventDefault();
  const name = customRoleInput.value.trim();
  if (!name || selected.size >= 10) return;
  const role = {
    id: `custom-${++customRoleId}`,
    name,
    color: customRoleColor.value,
    icon: "star"
  };
  customRoles.push(role);
  selected.add(role.id);
  customRoleDraft = null;
  customRoleInput.value = "";
  customRoleColor.value = "#0689F0";
  updateUi();
});
headerTextInput.addEventListener("input", () => {
  if (selected.size) drawThumbnail();
});
document.querySelector("#clearButton").addEventListener("click", () => { selected.clear(); customRoles.length = 0; customRoleDraft = null; customRoleInput.value = ""; updateUi(); });
document.querySelector("#generateButton").addEventListener("click", () => {
  if (!selected.size) { status.textContent = "Select at least one role to generate"; return; }
  drawThumbnail();
  canvasWrap.classList.add("has-content");
  status.textContent = "Thumbnail generated — ready to download";
  canvasWrap.scrollIntoView({ behavior: "smooth", block: "center" });
});
downloadButton.addEventListener("click", () => {
  if (downloadButton.disabled) return;
  const link = document.createElement("a");
  link.download = "creator-call-thumbnail.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

renderCards();
