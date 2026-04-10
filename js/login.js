// declaracion de variables para los usuarios
let user;
let password;

// funcion reutilizable para entrar a una vista
const goToTurno = (turno, isDemo = false) => {
  localStorage.setItem("encargado turno", JSON.stringify(turno));
  localStorage.setItem("modoDemo", JSON.stringify(isDemo));

  if (turno === "tarde") {
    window.location = "./vistas/turnoTarde.html";
  } else if (turno === "mañana") {
    window.location = "./vistas/turnoMañana.html";
  }
};

// funcion de login con validacion de usuario
const login = () => {
  user = document.getElementById("usuario").value.trim().toLowerCase();
  password = document.getElementById("contraseña").value.trim();

  if (user === "tarde" && password === "admin") {
    goToTurno("tarde");
  } else if (user === "mañana" && password === "admin") {
    goToTurno("mañana");
  } else {
    alert("Usuario o contraseña incorrectos");
  }
};

// eventos
const botonLogin = document.getElementById("btn-login");
const botonDemoManana = document.getElementById("btn-demo-manana");
const botonDemoTarde = document.getElementById("btn-demo-tarde");

botonLogin.addEventListener("click", login);
botonDemoManana.addEventListener("click", () => goToTurno("mañana", true));
botonDemoTarde.addEventListener("click", () => goToTurno("tarde", true));
