document.addEventListener('DOMContentLoaded', () => {
    const horarioData = [
        // GRUPO 1
        { codigo: "0413", materia: "PROGRAMACION WEB", grupo: "Gpo1", dia: "MARTES", hora: 10, horaFin: "11:40", aula: "E201", tipo: "web" },
        { codigo: "0413", materia: "PROGRAMACION WEB", grupo: "Gpo1", dia: "JUEVES", hora: 15, horaFin: "4:40", aula: "E201", tipo: "web" },

        // GRUPO 3
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo3", dia: "LUNES", hora: 8, horaFin: "09:40", aula: "D104", tipo: "ing" },
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo3", dia: "MIERCOLES", hora: 8, horaFin: "09:40", aula: "D104", tipo: "ing" },

        // GRUPO 4
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo4", dia: "LUNES", hora: 10, horaFin: "11:40", aula: "E201", tipo: "ing" },
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo4", dia: "JUEVES", hora: 8, horaFin: "09:40", aula: "E201", tipo: "ing" },

        // GRUPO 7
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo7", dia: "LUNES", hora: 15, horaFin: "04:40", aula: "D104", tipo: "ing" },
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo7", dia: "JUEVES", hora: 13, horaFin: "02:40", aula: "D104", tipo: "ing" },

        // GRUPO 8
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo8", dia: "MARTES", hora: 15, horaFin: "04:40", aula: "D104", tipo: "ing" },
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo8", dia: "MIERCOLES", hora: 13, horaFin: "02:40", aula: "D104", tipo: "ing" }
    ];

    // Configuración
    const diasSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];
    // IMPORTANTE: El rango debe ser continuo para que el rowspan funcione bien
    const horasDia = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]; 

    // Referencias DOM
    const tablaEncabezado = document.getElementById('tablaEncabezado');
    const tablaCuerpo = document.getElementById('tablaCuerpo');
    const btnLista = document.getElementById('btnLista');
    const btnCalendario = document.getElementById('btnCalendario');
    const btnSalir = document.getElementById('btnSalir');

    // --- RENDERIZADO VISTA LISTA ---
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
            const colorTexto = clase.tipo === 'web' ? 'text-primary' : '';
            tablaCuerpo.innerHTML += `
                <tr>
                    <td class="fw-bold text-muted">${clase.codigo}</td>
                    <td class="text-start fw-bold ${colorTexto}">${clase.materia}</td>
                    <td><span class="badge rounded-pill text-bg-secondary">${clase.grupo}</span></td>
                    <td>${clase.dia}</td>
                    <td>${formatearHora(clase.hora)} - ${clase.horaFin}</td>
                    <td><span class="badge text-bg-info text-dark">${clase.aula}</span></td>
                </tr>
            `;
        });
    }

    // --- RENDERIZADO CALENDARIO (CON LOGICA DE ROWSPAN) ---
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
            
            // Columna Hora
            row.innerHTML = `<td class="fw-bold text-secondary bg-light align-middle">${formatearHora(hora)}</td>`;

            diasSemana.forEach(dia => {
                // 1. ¿Hay una clase que EMPIEZA aquí?
                const claseInicio = horarioData.find(c => c.dia === dia && c.hora === hora);
                
                // 2. ¿Hay una clase que empezó la HORA ANTERIOR y sigue aquí?
                // (Esto evita que dibujemos una celda encima de la que viene de arriba)
                const claseAnterior = horarioData.find(c => c.dia === dia && c.hora === (hora - 1));

                if (claseInicio) {
                    // -> CASO: INICIO DE CLASE
                    // Usamos rowspan="2" para que ocupe esta hora y la siguiente
                    const bgClass = claseInicio.tipo === 'web' ? 'bg-primary' : 'bg-success';
                    
                    row.innerHTML += `
                        <td rowspan="2" class="p-1 align-middle border-0">
                            <div class="${bgClass} text-white p-2 rounded shadow h-100 d-flex flex-column justify-content-center">
                                <div class="fw-bold lh-1 mb-1">${claseInicio.materia}</div>
                                <div class="small opacity-75">${claseInicio.aula} - ${claseInicio.grupo}</div>
                                <div class="badge bg-dark bg-opacity-25 mt-1">${formatearHora(claseInicio.hora)} - ${claseInicio.horaFin}</div>
                            </div>
                        </td>
                    `;
                } else if (claseAnterior) {
                    // -> CASO: CONTINUACION DE CLASE
                    // Si la hora anterior tenía clase, NO DIBUJAMOS NADA (el rowspan de arriba ocupa este espacio).
                    // Si pusiéramos un <td> vacío aquí, la tabla se deformaría hacia la derecha.
                } else {
                    // -> CASO: LIBRE
                    // Dibujamos celda vacía normal
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