const turnoGuardado = JSON.parse(localStorage.getItem("encargado turno"));
const turnoEsperado = document.body.dataset.turno;

if (!turnoGuardado || turnoGuardado !== turnoEsperado) {
  window.location.href = "../index.html";
}

const volverAlInicio = () => {
  localStorage.removeItem("encargado turno");
  localStorage.removeItem("modoDemo");
  window.location.href = "../index.html";
};

document.addEventListener("DOMContentLoaded", () => {
  const btnVolver = document.getElementById("btn-volver");
  if (btnVolver) {
    btnVolver.addEventListener("click", volverAlInicio);
  }
});