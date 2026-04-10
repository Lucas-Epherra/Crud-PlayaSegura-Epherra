const fechaInput = document.querySelector("#fecha");
const horaInput = document.querySelector("#hora");
const puestoInput = document.querySelector("#puesto");
const marInput = document.querySelector("#mar");
const vientoInput = document.querySelector("#viento");
const codigoInput = document.querySelector("#codigo");

const contenedorInterv = document.querySelector("#intervenciones");
const formulario = document.querySelector("#nueva-intervencion");
const submitBtn = formulario.querySelector('button[type="submit"]');

const DB_NAME = "registroMañana";
const STORE_NAME = "mañana";

let DB;
let editando = false;
let intervObj = crearIntervencionVacia();

window.addEventListener("load", () => {
  eventListeners();
  createDB();
});

function crearIntervencionVacia() {
  return {
    fecha: "",
    hora: "",
    puesto: "",
    mar: "",
    viento: "",
    codigo: "",
  };
}

function eventListeners() {
  formulario.addEventListener("submit", nuevaInterv);

  [
    fechaInput,
    horaInput,
    puestoInput,
    marInput,
    vientoInput,
    codigoInput,
  ].forEach((input) => {
    input.addEventListener("input", datosInterv);
    input.addEventListener("change", datosInterv);
  });
}

function datosInterv(e) {
  intervObj[e.target.name] = e.target.value.trim();
}

function createDB() {
  const request = window.indexedDB.open(DB_NAME, 1);

  request.onerror = () => {
    console.error("Hubo un error al abrir IndexedDB");
  };

  request.onsuccess = () => {
    DB = request.result;
    ui.imprimirIntervenciones();
  };

  request.onupgradeneeded = (e) => {
    const db = e.target.result;

    if (!db.objectStoreNames.contains(STORE_NAME)) {
      const objectStore = db.createObjectStore(STORE_NAME, {
        keyPath: "id",
      });

      objectStore.createIndex("puesto", "puesto", { unique: false });
      objectStore.createIndex("fecha", "fecha", { unique: false });
      objectStore.createIndex("hora", "hora", { unique: false });
      objectStore.createIndex("mar", "mar", { unique: false });
      objectStore.createIndex("viento", "viento", { unique: false });
      objectStore.createIndex("codigo", "codigo", { unique: false });
      objectStore.createIndex("id", "id", { unique: true });
    }
  };
}

class UI {
  imprimirAlerta(mensaje, tipo = "success") {
    Swal.fire({
      title: tipo === "error" ? "Error" : "Listo",
      text: mensaje,
      icon: tipo === "error" ? "error" : "success",
      confirmButtonText: "Aceptar",
      buttonsStyling: false,
      customClass: {
        popup: "swal-popup-custom",
        title: "swal-title-custom",
        htmlContainer: "swal-text-custom",
        confirmButton: "swal-confirm-custom",
      },
    });
  }

  imprimirIntervenciones() {
    this.limpiarHTML();

    if (!DB) return;

    const transaction = DB.transaction(STORE_NAME, "readonly");
    const objectStore = transaction.objectStore(STORE_NAME);

    objectStore.openCursor().onsuccess = (e) => {
      const cursor = e.target.result;

      if (!cursor) return;

      const registro = cursor.value;
      const { fecha, hora, puesto, mar, viento, codigo, id } = registro;

      const divInterv = document.createElement("div");
      divInterv.classList.add("interv", "p-3");
      divInterv.dataset.id = id;

      divInterv.appendChild(this.crearParrafo("Puesto", puesto));
      divInterv.appendChild(this.crearParrafo("Fecha", fecha));
      divInterv.appendChild(this.crearParrafo("Hora del suceso", hora));
      divInterv.appendChild(this.crearParrafo("Estado del mar", mar));
      divInterv.appendChild(this.crearParrafo("Dirección del viento", viento));
      divInterv.appendChild(
        this.crearParrafo("Código de intervención", codigo),
      );

      const actionsRow = document.createElement("div");
      actionsRow.classList.add("actions-row");

      const btnEditar = document.createElement("button");
      btnEditar.type = "button";
      btnEditar.classList.add("crud-btn", "crud-btn--edit");
      btnEditar.innerHTML = `
        Editar
        <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
        </svg>
      `;
      btnEditar.addEventListener("click", () => cargarEdicion({ ...registro }));

      const btnEliminar = document.createElement("button");
      btnEliminar.type = "button";
      btnEliminar.classList.add("crud-btn", "crud-btn--delete");
      btnEliminar.innerHTML = `
        Eliminar
        <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      `;
      btnEliminar.addEventListener("click", () => eliminarInterv(id));

      actionsRow.appendChild(btnEditar);
      actionsRow.appendChild(btnEliminar);
      divInterv.appendChild(actionsRow);

      contenedorInterv.appendChild(divInterv);

      cursor.continue();
    };
  }

  crearParrafo(label, valor) {
    const p = document.createElement("p");
    p.innerHTML = `<span>${label}: </span>${valor}`;
    return p;
  }

  limpiarHTML() {
    while (contenedorInterv.firstChild) {
      contenedorInterv.removeChild(contenedorInterv.firstChild);
    }
  }
}

const ui = new UI();

function nuevaInterv(e) {
  e.preventDefault();

  const { fecha, hora, puesto, mar, viento, codigo } = intervObj;

  if (!fecha || !hora || !puesto || !mar || !viento || !codigo) {
    ui.imprimirAlerta("Todos los campos son obligatorios", "error");
    return;
  }

  if (!DB) {
    ui.imprimirAlerta("La base de datos todavía no está lista", "error");
    return;
  }

  if (editando) {
    actualizarIntervencion();
  } else {
    crearIntervencion();
  }
}

function crearIntervencion() {
  const nueva = {
    ...intervObj,
    id: Date.now(),
  };

  const transaction = DB.transaction(STORE_NAME, "readwrite");
  const objectStore = transaction.objectStore(STORE_NAME);

  objectStore.add(nueva);

  transaction.oncomplete = () => {
    ui.imprimirAlerta("Intervención agregada correctamente");
    ui.imprimirIntervenciones();
    resetFormulario();
  };

  transaction.onerror = () => {
    ui.imprimirAlerta("No se pudo guardar la intervención", "error");
  };
}

function actualizarIntervencion() {
  const actualizada = { ...intervObj };

  const transaction = DB.transaction(STORE_NAME, "readwrite");
  const objectStore = transaction.objectStore(STORE_NAME);

  objectStore.put(actualizada);

  transaction.oncomplete = () => {
    ui.imprimirAlerta("Intervención actualizada correctamente");
    ui.imprimirIntervenciones();
    resetFormulario();
  };

  transaction.onerror = () => {
    ui.imprimirAlerta("No se pudo actualizar la intervención", "error");
  };
}

function cargarEdicion(interv) {
  intervObj = { ...interv };

  fechaInput.value = interv.fecha;
  horaInput.value = interv.hora;
  puestoInput.value = interv.puesto;
  marInput.value = interv.mar;
  vientoInput.value = interv.viento;
  codigoInput.value = interv.codigo;

  submitBtn.textContent = "Guardar cambios";
  editando = true;
}

function resetFormulario() {
  intervObj = crearIntervencionVacia();
  editando = false;
  formulario.reset();
  submitBtn.textContent = "Crear intervención";
}

function eliminarInterv(id) {
  Swal.fire({
    title: "¿Eliminar registro?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
    buttonsStyling: false,
    customClass: {
      popup: "swal-popup-custom",
      title: "swal-title-custom",
      htmlContainer: "swal-text-custom",
      confirmButton: "swal-confirm-custom",
      cancelButton: "swal-cancel-custom",
    },
  }).then((result) => {
    if (!result.isConfirmed) return;

    const transaction = DB.transaction(STORE_NAME, "readwrite");
    const objectStore = transaction.objectStore(STORE_NAME);

    objectStore.delete(id);

    transaction.oncomplete = () => {
      ui.imprimirIntervenciones();

      Swal.fire({
        title: "Eliminado",
        text: "El registro fue eliminado correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
        buttonsStyling: false,
        customClass: {
          popup: "swal-popup-custom",
          title: "swal-title-custom",
          htmlContainer: "swal-text-custom",
          confirmButton: "swal-confirm-custom",
        },
      });

      if (editando && intervObj.id === id) {
        resetFormulario();
      }
    };

    transaction.onerror = () => {
      ui.imprimirAlerta("No se pudo eliminar el registro", "error");
    };
  });
}

const btnCambiarTurno = document.querySelector("#btn-cambiar-turno");
const turnoBadge = document.querySelector("#turno-badge");

if (btnCambiarTurno && turnoBadge) {
  const turnoActual = document.body.dataset.turno;

  const configTurno = {
    mañana: {
      badge: "Turno Mañana",
      boton: "Ir a turno tarde",
      destino: ".././vistas/turnoTarde.html",
    },
    tarde: {
      badge: "Turno Tarde",
      boton: "Ir a turno mañana",
      destino: ".././vistas/turnoManana.html",
    },
  };

  const actual = configTurno[turnoActual];

  if (actual) {
    turnoBadge.textContent = actual.badge;
    btnCambiarTurno.textContent = actual.boton;

    btnCambiarTurno.addEventListener("click", () => {
      window.location.href = actual.destino;
    });
  }
}