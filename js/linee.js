fetch("data/linee.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("lineeContainer");

    data.forEach(linea => {
      const div = document.createElement("div");

      div.className = "card";
      div.innerHTML = `
        <h3>${linea.nome}</h3>
        <p>${linea.capolinea}</p>
      `;

      div.onclick = () => {
        window.location.href = `linea.html?id=${linea.id}`;
      };

      container.appendChild(div);
    });
  });
