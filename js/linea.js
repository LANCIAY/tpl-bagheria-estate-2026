const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let lineeData = [];
let fermateData = [];
let orariData = {};
let percorsiData = {};

Promise.all([
  fetch("data/linee.json").then(r => r.json()),
  fetch("data/fermate.json").then(r => r.json()),
  fetch("data/orari.json").then(r => r.json()),
  fetch("data/percorsi.json").then(r => r.json())
]).then(([linee, fermate, orari, percorsi]) => {

  lineeData = linee;
  fermateData = fermate;
  orariData = orari;
  percorsiData = percorsi;

  init();
});

function init() {

  const linea = lineeData.find(l => l.id === id);
  if (!linea) return;

  document.getElementById("nomeLinea").innerText = linea.nome;
  document.getElementById("capolinea").innerText = linea.capolinea;

  // 🗺️ MAPPA
  const map = L.map('map').setView([38.079, 13.510], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  // 🚏 FERMA TE
  let fermateLinea = fermateData
    .filter(f => f.linee && f.linee[id] !== undefined)
    .sort((a, b) => a.linee[id] - b.linee[id]);

  fermateLinea.forEach((f) => {

    L.marker([f.lat, f.lng])
      .addTo(map)
      .bindPopup(`
        <b>${f.nome}</b><br/>
        <button onclick="showFermata('${f.id}')">
          Dettagli fermata
        </button>
      `);
  });

  // 🟦 PERCORSO
  const coords = percorsiData[id];

  if (coords) {
    L.polyline(coords, {
      color: linea.colore || "blue",
      weight: 4
    }).addTo(map);
  }

  // 🕒 ORARI
  const orari = orariData[id] || [];

  const main = document.querySelector("main");

  let old = document.getElementById("orariBox");
  if (old) old.remove();

  const orariBox = document.createElement("div");
  orariBox.id = "orariBox";
  orariBox.innerHTML = `
    <h3>Orari</h3>
    <p>${orari.join(" • ")}</p>
  `;

  main.appendChild(orariBox);
}

window.showFermata = function(id) {

  const fermata = fermateData.find(f => f.id == id);
  if (!fermata) return;

  const lineeAttive = Object.keys(fermata.linee || {});

  let html = `
    <div id="popupFermata" style="
      position:fixed;
      bottom:0;
      left:0;
      right:0;
      background:white;
      padding:15px;
      border-top:2px solid #ccc;
      z-index:9999;
    ">
      <h3>📍 ${fermata.nome}</h3>
      <p><b>Linee che passano:</b></p>
      <ul>
  `;

  lineeAttive.forEach(l => {
    html += `<li>🚌 Linea ${l}</li>`;
  });

  html += `
      </ul>
      <button onclick="document.getElementById('popupFermata').remove()">
        Chiudi
      </button>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", html);
};
