const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let lineeData = [];
let fermateData = [];
let orariData = {};

fetch("data/linee.json")
  .then(r => r.json())
  .then(data => {
    lineeData = data;
    return fetch("data/fermate.json");
  })
  .then(r => r.json())
  .then(data => {
    fermateData = data;
    return fetch("data/orari.json");
  })
  .then(r => r.json())
  .then(data => {
    orariData = data;
    init();
  });

function init() {
  const linea = lineeData.find(l => l.id === id);

  if (!linea) return;

  document.getElementById("nomeLinea").innerText = linea.nome;
  document.getElementById("capolinea").innerText = linea.capolinea;

  const fermateList = document.getElementById("fermate");
  fermateList.innerHTML = "";

  fermateData.forEach(f => {
    const li = document.createElement("li");
    li.innerText = f.nome;
    fermateList.appendChild(li);
  });

  // ORARI
  const orari = orariData[id] || [];
  const orariBox = document.createElement("div");
  orariBox.innerHTML = "<h3>Orari</h3>" + orari.join(" - ");
  document.querySelector("main").appendChild(orariBox);

  // MAPPA
  const map = L.map('map').setView([38.079, 13.510], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  fermateData.forEach(f => {
    L.marker([f.lat, f.lng])
      .addTo(map)
      .bindPopup(f.nome);
  });
}
