
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const puestoInput = document.querySelector('#puesto');
const marInput = document.querySelector('#mar');
const vientoInput = document.querySelector('#viento');
const codigoInput = document.querySelector('#codigo');

//Contenedor para las intervenciones estaticas
const contenedorIntervEstaticas = document.querySelector('#intervencionesEstaticas');

// Contenedor para las intervenciones dinamicas
const contenedorInterv = document.querySelector('#intervenciones');

// Formulario nuevas intervenciones
const formulario = document.querySelector('#nueva-intervencion')
formulario.addEventListener('submit', nuevaInterv);

let editando = false;

// IndexedDB -- Creacion ---------
function createDB() {
    // creacion de la base de datos en version 1.0
    const createDB = window.indexedDB.open('registrosMañana', 1)

    //si hay un error
    createDB.onerror = () => {
        console.log("Hubo un error")
    }

    // si todo va bien 

    createDB.onsuccess = () => {
        console.log("Base de datos creada")

        DB = createDB.result;

        // mostrar intervenciones al cargar (con indexedDB listo)
        ui.imprimirIntervenciones();
    }

    // definir esquema

    createDB.onupgradeneeded = function (e) {
        const db = e.target.result;

        const objectStore = db.createObjectStore('tarde', {
            keyPath: 'id',
            autoIncrement: true
        });

        //Definir todas las columnas
        objectStore.createIndex('puesto', 'puesto', { unique: false });
        objectStore.createIndex('fecha', 'fecha', { unique: false });
        objectStore.createIndex('hora', 'hora', { unique: false });
        objectStore.createIndex('mar', 'mar', { unique: false });
        objectStore.createIndex('viento', 'viento', { unique: false });
        objectStore.createIndex('codigo', 'codigo', { unique: false });
        objectStore.createIndex('id', 'id', { unique: true });

        console.log('DB creada y lista')
    }
}

window.onload = () => {
    eventListeners();
    createDB();
}

// Eventos ---------

function eventListeners() {
    fechaInput.addEventListener('change', datosInterv);
    horaInput.addEventListener('change', datosInterv);
    puestoInput.addEventListener('change', datosInterv);
    marInput.addEventListener('change', datosInterv);
    vientoInput.addEventListener('change', datosInterv);
    codigoInput.addEventListener('change', datosInterv);
}

let intervObj = [{
    fecha: '',
    puesto: '',
    mar: '',
    viento: '',
    codigo: '',
    hora: '',
}]

function datosInterv(e) {
    // Obtener el Input
    intervObj[e.target.name] = e.target.value;
}


// CLasses ---------
class Intervenciones {
    constructor() {
        this.intervenciones = []
    }
    agregarInterv(interv) {
        this.intervenciones = [...this.intervenciones, interv];
    }
    editarInterv(intervencionActualizada) {
        this.intervenciones = this.intervenciones.map(interv => interv.id === intervencionActualizada.id ? intervencionActualizada : interv)
    }

    eliminarInterv(id) {
        this.intervenciones = this.intervenciones.filter(interv => interv.id !== id);
    }
}
class UI {
    imprimirAlerta(mensaje, tipo) {
        // Crea el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        // Si es de tipo error agrega una clase
        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en el DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-intervencion'));

        // Quitar el alert despues de 3 segundos
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    imprimirIntervenciones() {

        this.limpiarHTML();

        //leer el contenido de la base de datos
        const objectStore = DB.transaction('tarde').objectStore('tarde');

        objectStore.openCursor().onsuccess = function (e) {

            const cursor = e.target.result;

            if (cursor) {
                const { fecha, hora, puesto, mar, viento, codigo, id } = cursor.value;

                const divInterv = document.createElement('div');
                divInterv.classList.add('interv', 'p-3');
                divInterv.dataset.id = id;

                // SCRIPTING DE LOS ELEMENTOS...

                const puestoParrafo = document.createElement('p');
                puestoParrafo.innerHTML = `<span class="font-weight-bolder">Puesto: </span> ${puesto}`;

                const fechaParrafo = document.createElement('p');
                fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha: </span> ${fecha}`;

                const horaParrafo = document.createElement('p');
                horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora del suceso: </span> ${hora}`;

                const marParrafo = document.createElement('p');
                marParrafo.innerHTML = `<span class="font-weight-bolder">Estado del mar: </span> ${mar}`;

                const vientoParrafo = document.createElement('p');
                vientoParrafo.innerHTML = `<span class="font-weight-bolder">Direccion del viento: </span> ${viento}`;

                const codigoParrafo = document.createElement('p');
                codigoParrafo.innerHTML = `<span class="font-weight-bolder">Codigo de intervencion: </span> ${codigo}`;

                // Agregar un botón de eliminar...
                const btnEliminar = document.createElement('button');
                btnEliminar.onclick = () => eliminarInterv(id); // añade la opción de eliminar
                btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
                btnEliminar.innerHTML = 'Eliminar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'

                // Añade un botón de editar...
                const btnEditar = document.createElement('button');
                const interv = cursor.value;
                btnEditar.onclick = () => cargarEdicion(interv);

                btnEditar.classList.add('btn', 'btn-info');
                btnEditar.innerHTML = 'Editar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'

                // Agregar al HTML
                divInterv.appendChild(puestoParrafo);
                divInterv.appendChild(fechaParrafo);
                divInterv.appendChild(horaParrafo);
                divInterv.appendChild(marParrafo);
                divInterv.appendChild(vientoParrafo);
                divInterv.appendChild(codigoParrafo);
                divInterv.appendChild(btnEliminar)
                divInterv.appendChild(btnEditar)

                contenedorInterv.appendChild(divInterv);

                // ir al sgte elemento de la bd
                cursor.continue();
            }
        }
    }

    limpiarHTML() {
        while (contenedorInterv.firstChild) {
            contenedorInterv.removeChild(contenedorInterv.firstChild);
        }
    }
}

const ui = new UI();
const administrarIntervenciones = new Intervenciones();

function nuevaInterv(e) {
    e.preventDefault();

    const { fecha, hora, puesto, mar, viento, codigo } = intervObj;

    // Validar
    if (fecha === '' || hora === '' || puesto === '' || mar === '' || viento === '' || codigo === '') {
        ui.imprimirAlerta('Todos los campos son Obligatorios', 'error')

        return;
    }
    // Estamos editando

    if (editando) {

        administrarIntervenciones.editarInterv({ ...intervObj });

        // Edita en IndexDB

        const transaction = DB.transaction(['tarde'], 'readwrite');
        const objectStore = transaction.objectStore('tarde')

        objectStore.put(intervObj);

        transaction.oncomplete = () => {

            ui.imprimirAlerta('Guardado Correctamente');

            formulario.querySelector('button[type="submit"]').textContent = 'Crear Intervencion';

            editando = false;
        }

        transaction.onerror = () => {
            console.log('Hubo un error');
        }

    } else {
        // Nuevo Registrando

        // Generar un ID único
        intervObj.id = Date.now();

        // Añade la nueva intervencion
        administrarIntervenciones.agregarInterv({ ...intervObj });

        //insertar nuevo registro en IndexedDB
        const transaction = DB.transaction('tarde', 'readwrite');

        //habilitar el objectstore
        const objectStore = transaction.objectStore('tarde');

        //insertar en la bd
        objectStore.add(intervObj);

        transaction.oncomplete = function () {
            console.log('Intervencion Agregada')

            // Mostrar mensaje de que todo esta bien...
            ui.imprimirAlerta('Se agregó correctamente')
        }

    }

    // Imprimir el HTML de intervenciones
    ui.imprimirIntervenciones();

    // Reinicia el objeto para evitar futuros problemas de validación
    reiniciarObjeto();

    // Reiniciar Formulario
    formulario.reset();

}

function reiniciarObjeto() {
    // Reiniciar el objeto
    intervObj.fecha = '';
    intervObj.hora = '';
    intervObj.puesto = '';
    intervObj.mar = '';
    intervObj.viento = '';
    intervObj.codigo = '';
}


function eliminarInterv(id) {
    Swal.fire({
        title: 'Estas seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'advertencia',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Sí, bórralo!'
    }).then((result) => {

        const transaction = DB.transaction(['tarde'], 'readwrite');
        const objectStore = transaction.objectStore('tarde');

        objectStore.delete(id);


        transaction.oncomplete = () => {
            ui.imprimirIntervenciones();
        }
        if (result.isConfirmed) {
            Swal.fire(
                '¡Eliminado!',
                'Su registro ha sido eliminado.',
                'éxito'
            )
        }
    })

    transaction.onerror = () => {
        console.log('Hubo un error');
    }
}

function cargarEdicion(interv) {

    const { fecha, hora, puesto, mar, viento, codigo, id } = interv;

    // Reiniciar el objeto
    intervObj.fecha = fecha;
    intervObj.hora = hora;
    intervObj.puesto = puesto;
    intervObj.mar = mar;
    intervObj.viento = viento
    intervObj.codigo = codigo;
    intervObj.id = id;

    // Llenar los Inputs
    fechaInput.value = fecha;
    horaInput.value = hora;
    puestoInput.value = puesto;
    marInput.value = mar;
    vientoInput.value = viento;
    codigoInput.value = codigo;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;

}