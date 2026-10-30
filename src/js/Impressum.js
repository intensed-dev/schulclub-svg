const wagonsRoot = document.querySelector("#wagons");
const wagonTemplate = document.querySelector("#wagon-template");
const personTemplate = document.querySelector("#person-template");
const preview = document.querySelector("#preview");
const titleInput = document.querySelector("#magazine-title");
const pageSizeInput = document.querySelector("#page-size");
const accentInput = document.querySelector("#accent-color");
const wagonCount = document.querySelector("#wagon-count");
const pageCount = document.querySelector("#page-count");

let nextId = 1;

function escapeXml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[char]));
}

function addPerson(wagon, data = {}) {
  const fragment = personTemplate.content.cloneNode(true);
  const item = fragment.querySelector(".person-editor");
  const name = item.querySelector(".person-name");
  const roles = item.querySelector(".person-roles");
  const photo = item.querySelector(".person-photo");
  const fileInput = item.querySelector(".photo-input");
  name.value = data.name || "";
  roles.value = data.roles || "";
  if (data.photo) {
    photo.src = data.photo;
    photo.hidden = false;
    item.querySelector(".photo-placeholder").hidden = true;
  }
  name.addEventListener("input", render);
  roles.addEventListener("input", render);
  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      photo.src = reader.result;
      photo.hidden = false;
      item.querySelector(".photo-placeholder").hidden = true;
      render();
    };
    reader.readAsDataURL(file);
  });
  item.querySelector(".remove-person").addEventListener("click", () => {
    item.remove();
    if (!wagon.querySelector(".person-editor")) addPerson(wagon);
    render();
  });
  wagon.querySelector(".people-list").append(fragment);
  render();
}

function addWagon() {
  const fragment = wagonTemplate.content.cloneNode(true);
  const wagon = fragment.querySelector(".wagon-editor");
  wagon.dataset.id = String(nextId++);
  wagon.querySelector(".add-person").addEventListener("click", () => {
    if (wagon.querySelectorAll(".person-editor").length >= 2) return;
    addPerson(wagon);
    updateEditor();
  });
  wagon.querySelector(".remove-wagon").addEventListener("click", () => {
    wagon.remove();
    updateEditor();
    render();
  });
  wagonsRoot.append(fragment);
  const added = wagonsRoot.lastElementChild;
  addPerson(added);
  updateEditor();
}

function collectData() {
  return [...wagonsRoot.querySelectorAll(".wagon-editor")].map(wagon => ({
    people: [...wagon.querySelectorAll(".person-editor")].map(person => ({
      name: person.querySelector(".person-name").value.trim() || "Name fehlt",
      roles: person.querySelector(".person-roles").value.trim() || "Team",
      photo: person.querySelector(".person-photo").hidden ? "" : person.querySelector(".person-photo").src
    }))
  }));
}

function updateEditor() {
  [...wagonsRoot.querySelectorAll(".wagon-editor")].forEach((wagon, index) => {
    wagon.querySelector(".wagon-number").textContent = `WAGON ${String(index + 1).padStart(2, "0")}`;
    const addButton = wagon.querySelector(".add-person");
    const full = wagon.querySelectorAll(".person-editor").length >= 2;
    addButton.disabled = full;
    addButton.innerHTML = full ? '<i class="fa-solid fa-check"></i> Wagon voll' : '<i class="fa-solid fa-user-plus"></i> Zweite Person hinzufügen';
  });
  wagonCount.textContent = `${wagonsRoot.children.length} WAGONS`;
}

function svgText(text, x, y, size, weight = 500, fill = "#252a2c", anchor = "start") {
  return `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${escapeXml(text)}</text>`;
}

function buildSvg() {
  const data = collectData();
  const perPage = Number(pageSizeInput.value);
  const pages = [];
  for (let i = 0; i < data.length; i += perPage) pages.push(data.slice(i, i + perPage));
  if (!pages.length) pages.push([]);
  const pageW = 1000;
  const pageH = Math.max(720, Math.ceil(perPage / 2) * 210 + 290);
  const gap = 64;
  const height = pages.length * (pageH + gap) - gap;
  const accent = accentInput.value;
  const title = titleInput.value.trim() || "Unser Schulmagazin";
  let content = "";
  pages.forEach((page, pageIndex) => {
    const offsetY = pageIndex * (pageH + gap);
    content += `<g transform="translate(0 ${offsetY})">
      <rect width="${pageW}" height="${pageH}" rx="22" fill="#f5f1e8"/>
      <rect x="30" y="30" width="940" height="660" rx="14" fill="none" stroke="#d7d0c3" stroke-width="2"/>
      <rect x="30" y="30" width="940" height="10" rx="5" fill="${accent}"/>
      ${svgText("SCHULCLUB  /  IMPRESSUM", 66, 88, 15, 700, accent)}
      ${svgText(title, 66, 145, 39, 800, "#252a2c")}
      ${svgText("DIE MENSCHEN HINTER DIESER AUSGABE", 68, 174, 12, 600, "#74736e")}
      <path d="M65 192 H935" stroke="#d7d0c3" stroke-width="2"/>
      ${page.map((wagon, index) => {
        const globalIndex = pageIndex * perPage + index;
        const col = index % 2;
        const row = Math.floor(index / 2);
        const x = 66 + col * 440;
        const y = 220 + row * 210;
        const people = wagon.people;
        const personMarkup = people.map((person, pIndex) => {
          const px = x + 20 + pIndex * 195;
          const image = person.photo
            ? `<clipPath id="clip-${globalIndex}-${pIndex}"><circle cx="${px + 42}" cy="${y + 60}" r="31"/></clipPath><image href="${escapeXml(person.photo)}" x="${px + 11}" y="${y + 29}" width="62" height="62" preserveAspectRatio="xMidYMid slice" clip-path="url(#clip-${globalIndex}-${pIndex})"/>`
            : `<circle cx="${px + 42}" cy="${y + 60}" r="31" fill="#e8e0d2"/><text x="${px + 42}" y="${y + 68}" font-family="Arial" font-size="22" fill="#77736b" text-anchor="middle">${escapeXml((person.name[0] || "?").toUpperCase())}</text>`;
          const name = person.name.length > 18 ? person.name.slice(0, 17) + "…" : person.name;
          const role = person.roles.length > 24 ? person.roles.slice(0, 23) + "…" : person.roles;
          return `<g>${image}${svgText(name, px + 84, y + 55, 16, 700)}${svgText(role, px + 84, y + 80, 11, 500, "#6e706d")}</g>`;
        }).join("");
        return `<g>
          <rect x="${x}" y="${y}" width="414" height="150" rx="16" fill="#fffdf8" stroke="#cfc8ba" stroke-width="2"/>
          <rect x="${x}" y="${y}" width="414" height="9" rx="4" fill="${accent}"/>
          <circle cx="${x + 72}" cy="${y + 151}" r="13" fill="#53595a"/><circle cx="${x + 342}" cy="${y + 151}" r="13" fill="#53595a"/>
          ${svgText("WAGON " + String(globalIndex + 1).padStart(2, "0"), x + 20, y + 29, 10, 700, accent)}
          ${personMarkup}
          <path d="M${x + 18} ${y + 119} H${x + 396}" stroke="#e7e0d4" stroke-width="1"/>
        </g>`;
      }).join("")}
      <path d="M66 650 H934" stroke="#d7d0c3" stroke-width="1"/>
      ${svgText("TEAMWORK AUF SCHIENEN", 66, 674, 10, 700, "#858078")}
      ${svgText("SEITE " + (pageIndex + 1) + " / " + pages.length, 934, 674, 10, 700, "#858078", "end")}
    </g>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${pageW}" height="${height}" viewBox="0 0 ${pageW} ${height}">
    <title>${escapeXml(title)} – Impressum</title><desc>Impressum mit ${data.length} Crew-Wagons auf ${pages.length} Seiten.</desc>${content}
  </svg>`;
}

function render() {
  const svg = buildSvg();
  preview.innerHTML = svg;
  const pages = Math.max(1, Math.ceil(wagonsRoot.children.length / Number(pageSizeInput.value)));
  pageCount.textContent = `${pages} ${pages === 1 ? "SEITE" : "SEITEN"}`;
}

function downloadSvg() {
  const blob = new Blob([buildSvg()], {type: "image/svg+xml;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "schulclub-impressum.svg";
  link.click();
  URL.revokeObjectURL(url);
}

document.querySelector("#add-wagon").addEventListener("click", addWagon);
document.querySelector("#download-svg").addEventListener("click", downloadSvg);
document.querySelector("#download-all").addEventListener("click", downloadSvg);
[titleInput, pageSizeInput, accentInput].forEach(input => input.addEventListener("input", render));

addWagon();
addWagon();
