document.addEventListener('DOMContentLoaded', () => {

    // --- 1. BASE DE DATOS (Horario) ---
    // Ya no necesitamos la propiedad 'tipo', el color se decide por el 'grupo'.
    const horarioData = [
        // GRUPO 1 (Azul)
        { codigo: "0413", materia: "PROGRAMACION WEB", grupo: "Gpo1", dia: "MARTES", hora: 10, horaFin: "11:40", aula: "E201" },
        { codigo: "0413", materia: "PROGRAMACION WEB", grupo: "Gpo1", dia: "JUEVES", hora: 15, horaFin: "16:40", aula: "E201" },

        // GRUPO 3 (Verde)
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo3", dia: "LUNES", hora: 8, horaFin: "09:40", aula: "D104" },
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo3", dia: "MIERCOLES", hora: 8, horaFin: "09:40", aula: "D104" },

        // GRUPO 4 (Rojo)
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo4", dia: "LUNES", hora: 10, horaFin: "11:40", aula: "E201" },
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo4", dia: "JUEVES", hora: 8, horaFin: "09:40", aula: "E201" },

        // GRUPO 7 (Amarillo)
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo7", dia: "LUNES", hora: 15, horaFin: "04:40", aula: "D104" },
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo7", dia: "JUEVES", hora: 13, horaFin: "02:40", aula: "D104" },

        // GRUPO 8 (Celeste/Cyan)
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo8", dia: "MARTES", hora: 15, horaFin: "04:40", aula: "D104" },
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo8", dia: "MIERCOLES", hora: 13, horaFin: "02:40", aula: "D104" }
    ];

    // Configuración
    const diasSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];
    const horasDia = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]; 

    // Referencias DOM
    const tablaEncabezado = document.getElementById('tablaEncabezado');
    const tablaCuerpo = document.getElementById('tablaCuerpo');
    const btnLista = document.getElementById('btnLista');
    const btnCalendario = document.getElementById('btnCalendario');
    const btnSalir = document.getElementById('btnSalir');


    // --- 2. SISTEMA DE COLORES POR GRUPO ---
    function obtenerColorGrupo(grupo) {
        // Usamos 'text-bg-*' de Bootstrap 5 que ajusta el texto (blanco o negro) automáticamente
        const mapaColores = {
            'Gpo1': 'text-bg-primary',   // Azul
            'Gpo3': 'text-bg-success',   // Verde
            'Gpo4': 'text-bg-danger',    // Rojo
            'Gpo7': 'text-bg-warning',   // Amarillo (texto negro auto)
            'Gpo8': 'text-bg-info'       // Celeste (texto negro auto)
        };
        // Si hay un grupo nuevo que no está en la lista, sale gris
        return mapaColores[grupo] || 'text-bg-secondary';
    }


    // --- 3. RENDERIZADO VISTA LISTA ---
    function renderizarLista() {
        tablaEncabezado.innerHTML = `
            <tr>
                <th>CODIGO</th>
                <th class="text-start w-25">ASIGNATURA</th>
                <th>GRUPO</th>
                <th>DIA</th>
                <th>HORARIO</th>
                <th>AULA</th>
            </tr>
        `;
        tablaCuerpo.innerHTML = '';
        
        horarioData.forEach(clase => {
            // Obtenemos el color según el grupo
            const claseColor = obtenerColorGrupo(clase.grupo);
            // Color azul solo para el texto de la materia Web
            const colorTextoMateria = clase.materia.includes('WEB') ? 'text-primary' : '';

            tablaCuerpo.innerHTML += `
                <tr>
                    <td class="fw-bold text-muted">${clase.codigo}</td>
                    <td class="text-start fw-bold ${colorTextoMateria}">${clase.materia}</td>
                    <td><span class="badge rounded-pill ${claseColor}">${clase.grupo}</span></td>
                    <td>${clase.dia}</td>
                    <td>${formatearHora(clase.hora)} - ${clase.horaFin}</td>
                    <td><span class="badge text-bg-light border text-dark">${clase.aula}</span></td>
                </tr>
            `;
        });
    }


    // --- 4. RENDERIZADO CALENDARIO ---
    function renderizarCalendario() {
        // Header
        let headerHTML = '<tr><th class="bg-light text-muted" style="width: 80px;">HORA</th>';
        diasSemana.forEach(dia => headerHTML += `<th>${dia}</th>`);
        headerHTML += '</tr>';
        tablaEncabezado.innerHTML = headerHTML;

        // Body
        tablaCuerpo.innerHTML = '';

        horasDia.forEach(hora => {
            const row = document.createElement('tr');
            row.innerHTML = `<td class="fw-bold text-secondary bg-light align-middle">${formatearHora(hora)}</td>`;

            diasSemana.forEach(dia => {
                const claseInicio = horarioData.find(c => c.dia === dia && c.hora === hora);
                const claseAnterior = horarioData.find(c => c.dia === dia && c.hora === (hora - 1));

                if (claseInicio) {
                    // CASO: INICIO DE CLASE
                    // 1. Obtenemos el color del grupo
                    const claseColor = obtenerColorGrupo(claseInicio.grupo);
                    
                    // 2. Dibujamos la celda con el color del grupo
                    row.innerHTML += `
                        <td rowspan="2" class="p-1 align-middle border-0">
                            <div class="${claseColor} p-2 rounded shadow h-100 d-flex flex-column justify-content-center">
                                <div class="fw-bold lh-1 mb-1">${claseInicio.materia}</div>
                                <div class="small opacity-75">${claseInicio.aula} - ${claseInicio.grupo}</div>
                                <div class="badge bg-dark bg-opacity-25 mt-1 border border-white border-opacity-25">
                                    ${formatearHora(claseInicio.hora)} - ${claseInicio.horaFin}
                                </div>
                            </div>
                        </td>
                    `;
                } else if (claseAnterior) {
                    // CASO: CONTINUACION (No hacemos nada por el rowspan)
                } else {
                    // CASO: VACIO
                    row.innerHTML += `<td></td>`;
                }
            });
            tablaCuerpo.appendChild(row);
        });
    }


    // --- UTILIDADES ---
    function formatearHora(h) {
        return h > 12 ? (h - 12) + ":00 PM" : h + ":00 AM";
    }

    function cambiarVista(vista) {
        if (vista === 'lista') {
            btnLista.classList.replace('btn-outline-secondary', 'btn-primary');
            btnCalendario.classList.replace('btn-primary', 'btn-outline-secondary');
            renderizarLista();
        } else {
            btnCalendario.classList.replace('btn-outline-secondary', 'btn-primary');
            btnLista.classList.replace('btn-primary', 'btn-outline-secondary');
            renderizarCalendario();
        }
    }

    // --- EVENTOS ---
    btnLista.addEventListener('click', () => cambiarVista('lista'));
    btnCalendario.addEventListener('click', () => cambiarVista('calendario'));
    
    if(btnSalir) {
        btnSalir.addEventListener('click', () => {
            if(confirm('¿Desea cerrar sesión?')) alert('Sesión cerrada');
        });
    }

    // Iniciar
    cambiarVista('lista');
});