// === Variable global para almacenar la instancia de DataTable ===
var tabla;

// === Columnas que se mostraran en la tabla HTML ===
let columnas = [
    { campo: "Codigo", titulo: "CÓDIGO" },
    { campo: "Descripcion", titulo: "DESCRIPCIÓN" },
    { campo: "Proveedor", titulo: "PROVEEDOR" },
    { campo: "Estado", titulo: "ESTADO" }
];

// === Datos de ejemplo que simulan datos reales ===
// Reemplazar al conectar con la base de datos función cargarDatosDesdeServidor
let datosDummy = [
    { Codigo: "001", Descripcion: "Producto A", Proveedor: "Proveedor X", Estado: true, Estado2: 1 },
    { Codigo: "002", Descripcion: "Producto B", Proveedor: "Proveedor Y", Estado: false, Estado2: 1 },
    { Codigo: "004", Descripcion: "Producto r", Proveedor: "Proveedor r", Estado: false, Estado2: 0 },
    { Codigo: "004", Descripcion: "Producto d", Proveedor: "Proveedor p", Estado: false, Estado2: 1 },
    { Codigo: "003", Descripcion: "Producto A", Proveedor: "Proveedor X", Estado: false, Estado2: 0 }
];

// === Filtros disponibles para búsqueda en la tabla ===
let filtros = [
    { id: 'ddlProveedor', label: 'PROVEEDOR', campo: 'Proveedor' },
    { id: 'ddlEstado', label: 'ESTADO', campo: 'Estado' },
    { id: 'ddlDescripcion', label: 'DESCRIPCIÓN', campo: 'Descripcion' },
    { id: 'ddlCodigo', label: 'CODIGO', campo: 'Codigo' }
];

// === Campos que se usarán en el formulario modal ===
let camposFormulario = [
    { id: 'Codigo', label: 'Código', type: 'text', required: true },
    { id: 'Descripcion', label: 'Descripción', type: 'text', required: true },
    { id: 'Proveedor', label: 'Proveedor', type: 'text', required: true },
    { id: 'Estado', label: 'Estado', type: 'select', opciones: ['Activo', 'No Activo'], required: true }
];


// === Al cargar el documento ===
$(document).ready(function () {
    generarFiltros();          // Construye filtros con base en datosDummy
    generarEncabezadoTabla();  // Crea <th> dinámicos
    inicializarTabla();        // Configura DataTable

    cargarDatosEnTabla(datosDummy); //Aqui se debe reemplazar por cargarDatosDesdeServidor();

    // Evento botón Buscar
    $(document).on("click", "#btnBuscar", function () {
        aplicarFiltro();
    });

    // Evento botón Nuevo
    $(document).on("click", "#btnNuevo", function () {
        abrirFormulario(null);
    });

    // Evento botón Guardar
    $(document).on("click", "#btnGuardarCambios", function () {
        guardarRegistro(); //Función de prueba, reemplazable por guardarEnServidor()
    });
});


// === FUNCIONES DE BACKEND: reemplazar cuando se conecte a la BDD ===

/*
function cargarDatosDesdeServidor() {
    $.ajax({
        url: "/Controlador/ObtenerDatos", //esto se puede suscribir en _Layout 
        type: "GET",
        dataType: "json",
        success: function (response) {
            if (response.data) {
                datosDummy = response.data; // Usamos datos del backend
                cargarDatosEnTabla(datosDummy);
                generarFiltros(); // Actualiza filtros con nuevos datos
            }
        },
        error: function (err) {
            console.error("Error al cargar datos desde el servidor:", err);
        }
    });
}
*/

// === Filtros dinámicos ===
function generarFiltros() {
    const contenedor = $("#contenedorFiltros");
    contenedor.empty(); // Limpia antes de generar

    filtros.forEach(f => {
        let opciones = obtenerValoresUnicos(f.campo); // Saca los valores únicos de cada campo

        contenedor.append(`
            <div class="col-sm-2">
                <label class="mb-0"><strong>${f.label}:</strong></label>
                <select id="${f.id}" class="form-control form-control-sm">
                    <option value="">-- ${f.label} --</option>
                    ${opciones.map(o => `<option value="${o}">${o}</option>`).join("")}
                </select>
            </div>
        `);
    });

    // Botones de acción
    contenedor.append(`
        <div class="col-sm-2">
            <button id="btnBuscar" type="button" class="btn btn-sm btn-primary btn-block">
                <i class="fas fa-search"></i> Buscar
            </button>
        </div>
        <div class="col-sm-3">
            <button id="btnNuevo" type="button" class="btn btn-sm btn-success">
                <i class="fa fa-plus" aria-hidden="true"></i> Agregar Nuevo
            </button>
        </div>
    `);
}

// === Obtiene valores únicos de un campo (para los filtros) ===
function obtenerValoresUnicos(campo) {
    let valores = datosDummy.map(d => {
        let val = d[campo] ?? d[capitalizeFirstLetter(campo)];
        // Formatea booleanos como "Activo" o "No Activo"
        if (typeof val === "boolean") return val ? "Activo" : "No Activo";
        return val;
    });
    return [...new Set(valores.filter(v => v !== undefined))];
}

// === Convierte la primera letra a mayúscula ===
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// === Crea los <th> de la tabla de manera dinámica ===
function generarEncabezadoTabla() {
    let encabezado = $("#dynamic-headers");
    encabezado.empty();
    columnas.forEach(c => encabezado.append(`<th>${c.titulo}</th>`));
    encabezado.append(`<th>Acciones</th>`);
}

// === Inicializa la DataTable con configuración de columnas y botones ===
function inicializarTabla() {
    tabla = $("#tbdata").DataTable({
        data: [],
        columns: [
            ...columnas.map(c => ({
                data: c.campo,
                render: function (data, type, row) {
                    // Render especial para mostrar booleanos como etiquetas
                    if (c.campo === "Estado") {
                        return data
                            ? '<span class="badge badge-success">Activo</span>'
                            : '<span class="badge badge-danger">No Activo</span>';
                    }
                    return data;
                }
            })),
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-primary" onclick='abrirFormulario(${JSON.stringify(JSON.stringify(row))})'>
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="btn btn-sm btn-danger ml-2" onclick='eliminarRegistro("${row.Codigo}")'>
                            <i class="fa fa-trash"></i>
                        </button>`;
                },
                orderable: false
            }
        ],
        language: {
            url: "//cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json"
        }
    });
}

// === Recarga los datos en la tabla ===
function cargarDatosEnTabla(data) {
    tabla.clear().rows.add(data).draw();
}

// === Filtra los datos en base a los valores seleccionados en los combos ===
function aplicarFiltro() {
    let filtrados = datosDummy.filter(item => {
        return filtros.every(f => {
            const valorFiltro = $(`#${f.id}`).val();
            if (!valorFiltro) return true;

            let valorDato = item[f.campo] ?? item[capitalizeFirstLetter(f.campo)];
            if (typeof valorDato === "boolean") valorDato = valorDato ? "Activo" : "No Activo";
            return valorDato === valorFiltro;
        });
    });

    cargarDatosEnTabla(filtrados);
}

// === Abre el formulario modal, sea para editar o crear ===
function abrirFormulario(json) {
    $("#form").empty();
    const datos = json ? JSON.parse(json) : {};

    camposFormulario.forEach(c => {
        const val = datos[c.id] || "";
        let inputHtml = "";

        switch (c.type) {
            case "select":
                inputHtml = `<select class="form-control form-control-sm" name="${c.id}" ${c.required ? 'required' : ''}>
                                <option value="">-- Seleccionar --</option>
                                ${c.opciones.map(op => `<option value="${op}" ${op === val ? "selected" : ""}>${op}</option>`).join('')}
                             </select>`;
                break;
            case "file":
                inputHtml = `<input type="file" class="form-control-file" name="${c.id}" ${c.required ? 'required' : ''} />`;
                break;
            case "textarea":
                inputHtml = `<textarea class="form-control form-control-sm" name="${c.id}" ${c.required ? 'required' : ''}>${val}</textarea>`;
                break;
            default:
                inputHtml = `<input type="${c.type}" class="form-control form-control-sm" name="${c.id}" value="${val}" ${c.required ? 'required' : ''} />`;
        }

        $("#form").append(`
            <div class="form-group">
                <label>${c.label}:</label>
                ${inputHtml}
            </div>
        `);
    });

    $('#FormModal').modal('show');
}


// === Función temporal para guardar un nuevo registro en datosDummy ===
function guardarRegistro() {
    const nuevo = {};
    camposFormulario.forEach(c => {
        nuevo[c.id] = $(`[name='${c.id}']`).val();
    });

    // Convierte texto a booleano si es necesario
    nuevo.Estado = nuevo.Estado === "true" || nuevo.Estado === "1" || nuevo.Estado.toLowerCase() === "activo";

    datosDummy.push(nuevo);
    $('#FormModal').modal('hide');
    cargarDatosEnTabla(datosDummy);
    Swal.fire("Éxito", "Registro agregado correctamente.", "success");
}

// === Elimina un registro desde datosDummy (por Código) ===
function eliminarRegistro(codigo) {
    Swal.fire({
        title: "¿Deseas eliminar este registro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then(result => {
        if (result.isConfirmed) {
            datosDummy = datosDummy.filter(item => item.Codigo !== codigo);
            cargarDatosEnTabla(datosDummy);
            Swal.fire("Eliminado", "Registro eliminado correctamente.", "success");
        }
    });
}

// Se debera crear las funciones guardarRegistro() y eliminarRegistro(codigo) para ser utilizadas con conexion a BDD
// Se puede usar la logica de FiltroDinamico.js