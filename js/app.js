// Mappa base centrata su Bagheria
const map = L.map('map').setView([38.079, 13.510], 13);

// OpenStreetMap layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Marker esempio (fermata finta)
L.marker([38.079, 13.510])
  .addTo(map)
  .bindPopup("Centro Bagheria")
  .openPopup();
