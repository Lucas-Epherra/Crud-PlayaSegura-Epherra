//declaracion de variables para los usuarios
let user;
let password;
let userName;

//funcion de login con validacion de usuario (solo existen esos dos usuarios)
const login = () => {
    user = document.getElementById("usuario").value;
    password = document.getElementById("contraseña").value;

    if (user === "tarde" && password === "admin") {
        window.location = "./vistas/turnoTarde.html";
        user = sessionStorage.setItem('encargado turno',JSON.stringify(user))
    } else if (user === "mañana" && password === "admin") {
        window.location = "./vistas/turnoMañana.html";
        user = sessionStorage.setItem('encargado turno',JSON.stringify(user))
    }
}

//evento agregado al boton de inicio de sesion
let boton = document.getElementById("btn-login")
boton.addEventListener("click", login)