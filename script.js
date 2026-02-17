document.addEventListener('DOMContentLoaded', () => {

    // --- 1. BASE DE DATOS (Horario) ---
    const horarioData = [
        // GRUPO 1 (Azul Pastel)
        { codigo: "0413", materia: "PROGRAMACION WEB", grupo: "Gpo1", dia: "MARTES", hora: 10, horaFin: "11:40", aula: "E201" },
        { codigo: "0413", materia: "PROGRAMACION WEB", grupo: "Gpo1", dia: "JUEVES", hora: 15, horaFin: "16:40", aula: "E201" },

        // GRUPO 3 (Verde Pastel)
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo3", dia: "LUNES", hora: 8, horaFin: "09:40", aula: "D104" },
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo3", dia: "MIERCOLES", hora: 8, horaFin: "09:40", aula: "D104" },

        // GRUPO 4 (Rojo Suave)
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo4", dia: "LUNES", hora: 10, horaFin: "11:40", aula: "E201" },
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo4", dia: "JUEVES", hora: 8, horaFin: "09:40", aula: "E201" },

        // GRUPO 7 (Amarillo Suave)
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo7", dia: "LUNES", hora: 15, horaFin: "04:40", aula: "D104" },
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo7", dia: "JUEVES", hora: 13, horaFin: "02:40", aula: "D104" },

        // GRUPO 8 (Cyan/Celeste Pastel)
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


    // --- 2. PALETA DE COLORES PASTEL (Bootstrap 5) ---
    // Usamos bg-opacity-25 para el fondo suave y text-* para que la letra resalte
    function obtenerColorGrupo(grupo) {
        const mapaColores = {
            // Azul suave
            'Gpo1': 'bg-primary bg-opacity-25 text-primary border border-primary border-opacity-25',
            // Verde suave
            'Gpo3': 'bg-success bg-opacity-25 text-success border border-success border-opacity-25',
            // Rojo suave
            'Gpo4': 'bg-danger bg-opacity-25 text-danger border border-danger border-opacity-25',
            // Amarillo suave (letras oscuras para contraste)
            'Gpo7': 'bg-warning bg-opacity-25 text-dark border border-warning border-opacity-25',
            // Celeste suave (letras oscuras)
            'Gpo8': 'bg-info bg-opacity-25 text-dark border border-info border-opacity-25'
        };
        return mapaColores[grupo] || 'bg-secondary bg-opacity-25 text-secondary';
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
            const claseColor = obtenerColorGrupo(clase.grupo);
            // Si la materia es Web, ponemos el texto azul, si no, negro
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
                    // Obtenemos el estilo pastel
                    const claseColor = obtenerColorGrupo(claseInicio.grupo);
                    
                    row.innerHTML += `
                        <td rowspan="2" class="p-1 align-middle border-0">
                            <div class="${claseColor} p-2 rounded shadow-sm h-100 d-flex flex-column justify-content-center">
                                <div class="fw-bold lh-1 mb-1">${claseInicio.materia}</div>
                                <div class="small opacity-75 fw-bold">${claseInicio.aula} - ${claseInicio.grupo}</div>
                                
                                <div class="badge bg-white bg-opacity-50 text-dark mt-1 border-0">
                                    ${formatearHora(claseInicio.hora)} - ${claseInicio.horaFin}
                                </div>
                            </div>
                        </td>
                    `;
                } else if (claseAnterior) {
                    // Espacio ocupado
                } else {
                    // Celda vacía
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