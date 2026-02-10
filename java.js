document.addEventListener('DOMContentLoaded', () => {

    // ---------------------------------------------------------
    // 1. BASE DE DATOS COMPLETA (JSON)
    // ---------------------------------------------------------
    // Aquí están las 10 clases de tu horario original.
    // IMPORTANTE: Las horas están en formato militar (24h) para poder ordenarlas.
    // 13 = 1:00 PM, 15 = 3:00 PM
    const horarioData = [
        // PROGRAMACIÓN WEB (Gpo 1)
        { codigo: "0413", materia: "PROGRAMACION WEB", grupo: "Gpo1", dia: "MARTES", hora: 10, horaFin: "11:40", aula: "E201", tipo: "web" },
        { codigo: "0413", materia: "PROGRAMACION WEB", grupo: "Gpo1", dia: "JUEVES", hora: 15, horaFin: "16:40", aula: "E201", tipo: "web" },

        // INTRO INGENIERIA (Gpo 3)
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo3", dia: "LUNES", hora: 8, horaFin: "09:40", aula: "D104", tipo: "ing" },
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo3", dia: "MIERCOLES", hora: 8, horaFin: "09:40", aula: "D104", tipo: "ing" },

        // INTRO INGENIERIA (Gpo 4)
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo4", dia: "LUNES", hora: 10, horaFin: "11:40", aula: "E201", tipo: "ing" },
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo4", dia: "JUEVES", hora: 8, horaFin: "09:40", aula: "E201", tipo: "ing" },

        // INTRO INGENIERIA (Gpo 7 - Turno Tarde)
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo7", dia: "LUNES", hora: 15, horaFin: "04:40", aula: "D104", tipo: "ing" }, // 03:00 PM
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo7", dia: "JUEVES", hora: 13, horaFin: "02:40", aula: "D104", tipo: "ing" }, // 01:00 PM

        // INTRO INGENIERIA (Gpo 8 - Turno Tarde)
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo8", dia: "MARTES", hora: 15, horaFin: "04:40", aula: "D104", tipo: "ing" }, // 03:00 PM
        { codigo: "0402", materia: "INTRO. INGENIERIA", grupo: "Gpo8", dia: "MIERCOLES", hora: 13, horaFin: "02:40", aula: "D104", tipo: "ing" } // 01:00 PM
    ];

    // ---------------------------------------------------------
    // 2. CONFIGURACIÓN DEL MOTOR
    // ---------------------------------------------------------
    const diasSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];
    // Definimos las horas que queremos dibujar en el calendario (Eje Y)
    const horasDia = [8, 9, 10, 11, 12, 13, 14, 15, 16]; 

    // Referencias al HTML
    const tablaEncabezado = document.getElementById('tablaEncabezado');
    const tablaCuerpo = document.getElementById('tablaCuerpo');
    const btnLista = document.getElementById('btnLista');
    const btnCalendario = document.getElementById('btnCalendario');
    const btnSalir = document.getElementById('btnSalir');

    // ---------------------------------------------------------
    // 3. FUNCIÓN: RENDERIZAR VISTA DE LISTA (TABLA CLÁSICA)
    // ---------------------------------------------------------
    function renderizarLista() {
        // A. Crear Encabezado
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

        // B. Crear Filas
        tablaCuerpo.innerHTML = ''; // Limpiar tabla
        
        horarioData.forEach(clase => {
            // Estilo condicional: Azul para Web, Negro para el resto
            const colorTexto = clase.tipo === 'web' ? 'text-primary' : '';
            // Convertir hora militar a formato amigable
            const horaMostrar = formatearHora(clase.hora);

            const fila = `
                <tr>
                    <td class="fw-bold text-muted">${clase.codigo}</td>
                    <td class="text-start fw-bold ${colorTexto}">${clase.materia}</td>
                    <td><span class="badge rounded-pill text-bg-secondary">${clase.grupo}</span></td>
                    <td>${clase.dia}</td>
                    <td>${horaMostrar} - ${clase.horaFin}</td>
                    <td><span class="badge text-bg-info text-dark">${clase.aula}</span></td>
                </tr>
            `;
            tablaCuerpo.innerHTML += fila;
        });
    }

    // ---------------------------------------------------------
    // 4. FUNCIÓN: RENDERIZAR CALENDARIO (EL RETO)
    // ---------------------------------------------------------
    function renderizarCalendario() {
        // A. Crear Encabezado con los Días
        let headerHTML = '<tr><th class="columna-hora">HORA</th>';
        diasSemana.forEach(dia => headerHTML += `<th>${dia}</th>`);
        headerHTML += '</tr>';
        tablaEncabezado.innerHTML = headerHTML;

        // B. Crear Cuerpo (Bucle de Horas)
        tablaCuerpo.innerHTML = ''; // Limpiar tabla

        horasDia.forEach(hora => {
            const row = document.createElement('tr');
            
            // 1. Primera celda: La Hora
            const horaLabel = formatearHora(hora);
            row.innerHTML = `<td class="columna-hora">${horaLabel}</td>`;

            // 2. Celdas de los Días (Bucle dentro de Bucle)
            diasSemana.forEach(dia => {
                // Buscamos si hay una clase en este DIA y a esta HORA exacta
                const clase = horarioData.find(c => c.dia === dia && c.hora === hora);

                if (clase) {
                    // SI HAY CLASE: Dibujamos la tarjeta de color
                    const bgClass = clase.tipo === 'web' ? 'bg-primary' : 'bg-success'; // Azul o Verde
                    
                    row.innerHTML += `
                        <td class="celda-calendario">
                            <div class="asignatura-card ${bgClass} text-white">
                                <div class="fw-bold small">${clase.materia}</div>
                                <div class="info-detalle mt-1">
                                    ${clase.aula} - ${clase.grupo}
                                </div>
                            </div>
                        </td>
                    `;
                } else {
                    // SI NO HAY CLASE: Dibujamos celda vacía (Requisito del reto)
                    row.innerHTML += `<td></td>`;
                }
            });

            tablaCuerpo.appendChild(row);
        });
    }

    // ---------------------------------------------------------
    // 5. UTILIDADES Y EVENTOS
    // ---------------------------------------------------------
    
    // Función auxiliar para convertir 13 -> 1:00 PM
    function formatearHora(h) {
        return h > 12 ? (h - 12) + ":00 PM" : h + ":00 AM";
    }

    // Control de botones (Toggle de estilos)
    function cambiarVista(vista) {
        if (vista === 'lista') {
            btnLista.className = 'btn btn-primary'; // Activo
            btnCalendario.className = 'btn btn-outline-secondary'; // Inactivo
            renderizarLista();
        } else {
            btnLista.className = 'btn btn-outline-secondary'; // Inactivo
            btnCalendario.className = 'btn btn-primary'; // Activo
            renderizarCalendario();
        }
    }

    // Listeners
    btnLista.addEventListener('click', () => cambiarVista('lista'));
    btnCalendario.addEventListener('click', () => cambiarVista('calendario'));
    
    if(btnSalir) {
        btnSalir.addEventListener('click', () => {
            if(confirm('¿Desea cerrar sesión?')) alert('Sesión cerrada');
        });
    }

    // Iniciar por defecto en Vista LISTA
    cambiarVista('lista');
});