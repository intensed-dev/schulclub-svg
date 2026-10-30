const wagonsRoot = document.querySelector("#wagons");
const wagonTemplate = document.querySelector("#wagon-template");
const personTemplate = document.querySelector("#person-template");
const preview = document.querySelector("#preview");
const accentInput = document.querySelector("#accent-color");
const wagonCount = document.querySelector("#wagon-count");
const pageCount = document.querySelector("#page-count");

let nextId = 1;

function escapeXml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[char]));
}

function addPerson(wagon) {
  const fragment = personTemplate.content.cloneNode(true);
  const item = fragment.querySelector(".person-editor");
  const name = item.querySelector(".person-name");
  const roles = item.querySelector(".person-roles");
  const photo = item.querySelector(".person-photo");
  const fileInput = item.querySelector(".photo-input");

  name.addEventListener("input", render);
  roles.addEventListener("input", render);
  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
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
    updateEditor();
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
    addButton.innerHTML = full
      ? '<i class="fa-solid fa-check"></i> Wagon voll'
      : '<i class="fa-solid fa-user-plus"></i> Zweite Person hinzufügen';
  });
  wagonCount.textContent = `${wagonsRoot.children.length} WAGONS`;
}

function svgText(value, x, y, size, weight = 500, fill = "#252a2c", anchor = "start") {
  return `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${escapeXml(value)}</text>`;
}

function personWindow(person, x, y, width, id) {
  const photoSize = 48;
  const photoX = x + 12;
  const photoY = y + 14;
  const centerY = photoY + photoSize / 2;
  const image = person.photo
    ? `<clipPath id="portrait-${id}"><circle cx="${photoX + photoSize / 2}" cy="${centerY}" r="${photoSize / 2}"/></clipPath><image href="${escapeXml(person.photo)}" x="${photoX}" y="${photoY}" width="${photoSize}" height="${photoSize}" preserveAspectRatio="xMidYMid slice" clip-path="url(#portrait-${id})"/>`
    : `<circle cx="${photoX + photoSize / 2}" cy="${centerY}" r="${photoSize / 2}" fill="#e8dfca"/><text x="${photoX + photoSize / 2}" y="${centerY + 7}" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700" fill="#746d5e">${escapeXml((person.name[0] || "?").toUpperCase())}</text>`;
  const name = person.name.length > 15 ? person.name.slice(0, 14) + "…" : person.name;
  const role = person.roles.length > 19 ? person.roles.slice(0, 18) + "…" : person.roles;
  return `<g>
    <rect x="${x}" y="${y}" width="${width}" height="78" rx="8" fill="#f6eedc" stroke="#d9c89f" stroke-width="2"/>
    ${image}
    ${svgText(name, photoX + photoSize + 9, y + 34, 13, 700, "#292b2b")}
    ${svgText(role, photoX + photoSize + 9, y + 53, 9, 500, "#68675f")}
  </g>`;
}

function buildWagon(wagon, index, x, y, accent) {
  const people = wagon.people.slice(0, 2);
  const windowWidth = people.length === 1 ? 188 : 145;
  const windowGap = people.length === 1 ? 0 : 10;
  const firstX = people.length === 1 ? x + 86 : x + 22;
  const windows = people.map((person, personIndex) =>
    personWindow(person, firstX + personIndex * (windowWidth + windowGap), y + 58, windowWidth, `w${index}-p${personIndex}`)
  ).join("");

  return `<g>
    <!-- classic carriage roof -->
    <path d="M${x + 30} ${y + 48} Q${x + 30} ${y + 23} ${x + 58} ${y + 23} H${x + 302} Q${x + 330} ${y + 23} ${x + 330} ${y + 48} Z" fill="#292e30" stroke="#171b1c" stroke-width="3"/>
    <rect x="${x + 12}" y="${y + 43}" width="356" height="113" rx="13" fill="${accent}" stroke="#292e30" stroke-width="4"/>
    <path d="M${x + 20} ${y + 51} H${x + 360}" stroke="#f0d9a5" stroke-width="4"/>
    ${windows}
    <path d="M${x + 20} ${y + 137} H${x + 360}" stroke="#f0d9a5" stroke-width="4"/>
    <rect x="${x + 155}" y="${y + 145}" width="70" height="13" rx="3" fill="#292e30"/>
    <path d="M${x + 10} ${y + 164} H${x + 370}" stroke="#292e30" stroke-width="7" stroke-linecap="round"/>
    <rect x="${x + 46}" y="${y + 157}" width="278" height="12" rx="4" fill="#4a4d4b"/>
    <circle cx="${x + 92}" cy="${y + 177}" r="20" fill="#252a2c" stroke="#a9a08e" stroke-width="5"/>
    <circle cx="${x + 288}" cy="${y + 177}" r="20" fill="#252a2c" stroke="#a9a08e" stroke-width="5"/>
    <circle cx="${x + 92}" cy="${y + 177}" r="6" fill="#d8cba9"/>
    <circle cx="${x + 288}" cy="${y + 177}" r="6" fill="#d8cba9"/>
    <path d="M${x} ${y + 154} H${x + 12} M${x + 368} ${y + 154} H${x + 380}" stroke="#292e30" stroke-width="7" stroke-linecap="round"/>
  </g>`;
}

function buildSvg() {
  const wagons = collectData();
  const width = 1200;
  const columns = 3;
  const rowHeight = 235;
  const rows = Math.max(1, Math.ceil(wagons.length / columns));
  const height = rows * rowHeight + 24;
  const accent = accentInput.value;
  const content = wagons.map((wagon, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    return buildWagon(wagon, index, 10 + column * 400, 10 + row * rowHeight, accent);
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <title>Schulclub Impressum-Zug</title>
    <desc>${wagons.length} klassische Zugwagons, jeweils mit bis zu zwei Personen.</desc>
    ${content}
  </svg>`;
}

function render() {
  preview.innerHTML = buildSvg();
  pageCount.textContent = `${wagonsRoot.children.length} WAGONS`;
}

function downloadSvg() {
  const blob = new Blob([buildSvg()], {type: "image/svg+xml;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "schulclub-impressum-zug.svg";
  link.click();
  URL.revokeObjectURL(url);
}

document.querySelector("#add-wagon").addEventListener("click", addWagon);
document.querySelector("#download-svg").addEventListener("click", downloadSvg);
accentInput.addEventListener("input", render);

addWagon();
addWagon();
addWagon();
