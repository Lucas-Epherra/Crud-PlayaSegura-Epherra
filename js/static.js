let encargado = localStorage.getItem('encargado turno');

console.log(encargado)

//Contenedor para las intervenciones estaticas
const contenedorIntervEstaticas = document.querySelector('#intervencionesEstaticas');

// traer datos estaticos desde el json con fetch
renderizarIntervencionesEstaticas = (intervenciones) => {

    if (encargado != '"mañana"') {
        fetch('../json/tarde.json')
            .then((response) => response.json())
            .then((data) => {
                intervenciones = data
                intervenciones.forEach(intervencion => {
                    let { fecha, hora, puesto, mar, viento, codigo, id } = intervencion;

                    const divEstatic = document.createElement('div');
                    divEstatic.classList.add('interv', 'p-3');
                    divEstatic.dataset.id = id;

                    // SCRIPTING DE LOS ELEMENTOS ESTATICOS

                    const tituloEJ = document.createElement('h2');
                    tituloEJ.innerHTML = `<span class="font-weight-bolder">Ejemplo de registro: </span>`;

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

                    // Agregar al HTML
                    divEstatic.appendChild(tituloEJ);
                    divEstatic.appendChild(puestoParrafo);
                    divEstatic.appendChild(fechaParrafo);
                    divEstatic.appendChild(horaParrafo);
                    divEstatic.appendChild(marParrafo);
                    divEstatic.appendChild(vientoParrafo);
                    divEstatic.appendChild(codigoParrafo);

                    contenedorIntervEstaticas.appendChild(divEstatic);
                })
            })
    }

    if (encargado != '"tarde"') {
        fetch('../json/mañana.json')
            .then((response) => response.json())
            .then((data) => {
                intervenciones = data
                intervenciones.forEach(intervencion => {
                    let { fecha, hora, puesto, mar, viento, codigo, id } = intervencion;

                    const divEstatic = document.createElement('div');
                    divEstatic.classList.add('interv', 'p-3');
                    divEstatic.dataset.id = id;

                    // SCRIPTING DE LOS ELEMENTOS ESTATICOS

                    const tituloEJ = document.createElement('h2');
                    tituloEJ.innerHTML = `<span class="font-weight-bolder">Ejemplo de registro: </span>`;

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

                    // Agregar al HTML
                    divEstatic.appendChild(tituloEJ);
                    divEstatic.appendChild(puestoParrafo);
                    divEstatic.appendChild(fechaParrafo);
                    divEstatic.appendChild(horaParrafo);
                    divEstatic.appendChild(marParrafo);
                    divEstatic.appendChild(vientoParrafo);
                    divEstatic.appendChild(codigoParrafo);

                    contenedorIntervEstaticas.appendChild(divEstatic);
                })
            })
    }
}


renderizarIntervencionesEstaticas()

