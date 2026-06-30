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
])
.then(([linee, fermate, orari, percorsi]) => {

  lineeData = linee;
  fermateData = fermate;
  orariData = orari;
  percorsiData = percorsi;

  start();
})
.catch(err => {
  console.error("Errore caricamento dati:", err);
});

function start() {

  const linea = lineeData.find(l => l.id === id);
  if (!linea) {
    console.error("Linea non trovata:", id);
    return;
  }

  document.getElementById("nomeLinea").innerText = linea.nome;
  document.getElementById("capolinea").innerText = linea.capolinea;

  // MAPPA
  const map = L.map('map').setView([38.079, 13.510], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  // FERAMTE
  let fermateLinea = fermateData.filter(f =>
    f.linee && f.linee[id] !== undefined
  );

const map = L.map('map').setView([38.079, 13.510], 13);
  
  fermateLinea.forEach(f => {
    L.marker([f.lat, f.lng])
      .addTo(map)
      .bindPopup(f.nome);
  });

  // PERCORSO
  const coords = percorsiData[id];

  if (coords) {
    L.polyline(coords, {
      color: linea.colore || "blue",
      weight: 4
    }).addTo(map);
  }

  // ORARI
  const orari = orariData[id] || [];

  const main = document.querySelector("main");

  let old = document.getElementById("orariBox");
  if (old) old.remove();

  const box = document.createElement("div");
  box.id = "orariBox";
  box.innerHTML = `
    <h3>Orari</h3>
    <p>${orari.join(" • ")}</p>
  `;

  main.appendChild(box);
}

window.showFermata = function(id) {
  const f = fermateData.find(x => x.id == id);
  if (!f) return;

  alert(f.nome);
};
