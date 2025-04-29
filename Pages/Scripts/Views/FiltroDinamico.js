var tabla;

// === Filtros dinámicos ===
// Cada filtro tiene un ID único (no debe chocar con IDs del formulario)
var filtros = [
    { id: 'filtroNombre', label: 'NOMBRE', campo: 'Nombre' },
    { id: 'filtroDescripcion', label: 'DESCRIPCIÓN', campo: 'Descripcion' },
    { id: 'filtroCodigo', label: 'CÓDIGO', campo: 'Codigo' },
];

// === Definición de columnas que se muestran en la tabla ===
var columnas = [
    { data: 'Codigo', title: 'Código' },
    { data: 'Nombre', title: 'Nombre' },
    { data: 'Descripcion', title: 'Descripción' }
];

// === Campos que se generan dinámicamente en el formulario ===
var camposFormulario = [
    { id: 'Codigo', label: 'Código', type: 'text', required: true },
    { id: 'Nombre', label: 'Nombre', type: 'text', required: true },
    { id: 'Descripcion', label: 'Descripción', type: 'text', required: false },
    { id: 'Descripcion', label: 'Descripción', type: 'date', required: false },
];

// === Datos temporales (mock) ===
// Aquí es donde puedes reemplazar por datos reales desde la BDD
var datosDummy = [
    { ID: 1, Codigo: 'PEL001', Nombre: 'Caída de altura', Descripcion: 'Peligro por trabajo en alturas' },
    { ID: 2, Codigo: 'PEL002', Nombre: 'Electrocución', Descripcion: 'Peligro eléctrico' },
    { ID: 3, Codigo: 'PEL003', Nombre: 'Ruido excesivo', Descripcion: 'Peligro por ruido' },
    { ID: 4, Codigo: 'PEL004', Nombre: 'Electrocución', Descripcion: 'Contacto con cables vivos' },
    { ID: 5, Codigo: 'PEL005', Nombre: 'Caída de altura', Descripcion: 'Caída en escalera' }
];

// === Inicialización del DOM al cargar la página ===
$(document).ready(function () {
    generarFiltros();              // Genera los filtros dinámicos
    generarEncabezados();          // Encabezado de la tabla
    generarFormulario();           // Formulario modal
    inicializarTabla();            // DataTable
    cargarDatosEnTabla(datosDummy); // Aquí puedes llamar luego a cargarDatosDesdeServidor()

    // Botón "Nuevo"
    $('#btnNuevo').click(function () {
        abrirModal(null);
    });

    // Botón "Guardar"
    $('#btnGuardar').click(function () {
        guardar();
    });

    // Eventos de cambio en los filtros
    filtros.forEach(f => {
        $('#' + f.id).change(function () {
            aplicarFiltro();
        });
    });
});

// ---------------------------- Filtros ----------------------------

// Genera los filtros (combos) con opciones únicas extraídas de los datos
function generarFiltros() {
    const contenedor = $('#contenedorFiltros');
    contenedor.empty();

    filtros.forEach(f => {
        const opciones = obtenerValoresUnicos(f.campo);
        contenedor.append(`
            <div class="col-sm-3">
                <label><strong>${f.label}:</strong></label>
                <select id="${f.id}" class="form-control form-control-sm">
                    <option value="">-- Todos --</option>
                    ${opciones.map(op => `<option value="${op}">${op}</option>`).join('')}
                </select>
            </div>
        `);
    });
}

// Devuelve valores únicos de un campo (para los combos)
function obtenerValoresUnicos(campo) {
    const valores = datosDummy.map(item => item[campo] ?? item[capitalizeFirstLetter(campo)]);
    return [...new Set(valores.filter(v => v !== undefined && v !== null && v !== ''))];
}

// Filtra los datos mostrados en base a los filtros activos
function aplicarFiltro() {
    const filtrados = datosDummy.filter(item => {
        return filtros.every(f => {
            const valorFiltro = $('#' + f.id).val();
            if (!valorFiltro) return true;
            const valorCampo = item[f.campo] ?? item[capitalizeFirstLetter(f.campo)];
            return valorCampo === valorFiltro;
        });
    });

    actualizarOpcionesFiltros(filtrados); // Refresca combos si son dependientes
    cargarDatosEnTabla(filtrados);
}

// Refresca las opciones de los combos de filtro sin perder selección actual
function actualizarOpcionesFiltros(data) {
    filtros.forEach(f => {
        const valores = [...new Set(data.map(item => item[f.campo]).filter(v => v !== null && v !== ''))];
        const $ddl = $('#' + f.id);
        const valorActual = $ddl.val();

        $ddl.empty().append(`<option value="">-- Todos --</option>`);
        valores.forEach(v => {
            $ddl.append(`<option value="${v}" ${v === valorActual ? 'selected' : ''}>${v}</option>`);
        });
    });
}

// ---------------------------- Tabla ----------------------------

// Genera dinámicamente los <th> del encabezado de la tabla
function generarEncabezados() {
    const $thead = $('#dynamicHeaders');
    $thead.empty();
    columnas.forEach(col => {
        $thead.append(`<th>${col.title}</th>`);
    });
    $thead.append('<th>Acciones</th>');
}

// Configura la DataTable
function inicializarTabla() {
    tabla = $('#tbdata').DataTable({
        data: [],
        columns: [
            ...columnas.map(c => ({ data: c.data })),
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class='btn btn-sm btn-primary' onclick='abrirModalPorID(${row.ID})'>
                            <i class='fa fa-pen'></i>
                        </button>
                        <button class='btn btn-sm btn-danger ml-2' onclick='eliminar(${row.ID})'>
                            <i class='fa fa-trash'></i>
                        </button>`;
                },
                orderable: false,
                searchable: false
            }
        ],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
        }
    });
}

// Carga los datos en la tabla
function cargarDatosEnTabla(data) {
    tabla.clear().rows.add(data).draw();
}

// ---------------------------- Formulario ----------------------------

// Crea los inputs del formulario
function generarFormulario() {
    const $form = $('#form-dinamico');
    $form.empty();

    camposFormulario.forEach(c => {
        $form.append(`
            <div class="form-group">
                <label for="${c.id}">${c.label}</label>
                <input type="${c.type}" id="${c.id}" class="form-control form-control-sm" ${c.required ? 'required' : ''}>
            </div>
        `);
    });
}

// Abre el modal para nuevo o edición
function abrirModal(data) {
    const $form = $('#form-dinamico');
    $form[0].reset();
    $form.data('editing-id', data ? data.ID : null);

    if (data) {
        camposFormulario.forEach(c => {
            if (data.hasOwnProperty(c.id)) {
                $('#' + c.id).val(data[c.id]);
            }
        });
    }

    $('#FormModal').modal('show');
}

function abrirModalPorID(id) {
    const registro = datosDummy.find(d => d.ID === id);
    if (registro) abrirModal(registro);
}

// Guarda o actualiza un registro
function guardar() {
    const nuevo = {};
    camposFormulario.forEach(c => {
        nuevo[c.id] = $('#' + c.id).val();
    });

    const idEditar = $('#form-dinamico').data('editing-id');

    if (idEditar) {
        const index = datosDummy.findIndex(d => d.ID === idEditar);
        if (index !== -1) {
            datosDummy[index] = { ...datosDummy[index], ...nuevo };
        }
    } else {
        nuevo.ID = datosDummy.length ? Math.max(...datosDummy.map(d => d.ID)) + 1 : 1;
        datosDummy.push(nuevo);
    }

    $('#FormModal').modal('hide');
    Swal.fire("Éxito", "Registro guardado correctamente.", "success");
    aplicarFiltro();

    // Aquí podrías llamar a una función guardarEnServidor(nuevo);
}

// ---------------------------- Eliminar ----------------------------

// Elimina un registro por ID
function eliminar(id) {
    Swal.fire({
        title: "¿Deseas eliminar este registro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then(result => {
        if (result.isConfirmed) {
            datosDummy = datosDummy.filter(item => item.ID !== id);
            limpiarFiltros(); // Limpia filtros después de borrar
            Swal.fire("Eliminado", "Registro eliminado correctamente.", "success");
            aplicarFiltro();

            //Aquí podrías llamar a eliminarEnServidor(id);
        }
    });
}

// Limpia los filtros seleccionados
function limpiarFiltros() {
    filtros.forEach(f => {
        $('#' + f.id).val('');
    });
}

// ---------------------------- Utilidades ----------------------------

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// ----------------------------BDD------------------------------------
/*
 function cargarDatosDesdeServidor() {
    $.ajax({
        url: '/...../ObtenerTodos', // Controlador y acción MVC
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            datosDummy = data;
            generarFiltros(); // importante regenerar
            aplicarFiltro();  // o cargarDatosEnTabla(datosDummy);
        },
        error: function () {
            Swal.fire("Error", "No se pudieron cargar los datos.", "error");
        }
    });
}

function guardarEnServidor(obj) {
    $.ajax({
        url: '/...../Guardar',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(obj),
        success: function () {
            Swal.fire("Guardado", "Registro guardado exitosamente.", "success");
            cargarDatosDesdeServidor();
        },
        error: function () {
            Swal.fire("Error", "No se pudo guardar el registro.", "error");
        }
    });
}

function eliminarEnServidor(id) {
    $.ajax({
        url: `/....../Eliminar/${id}`,
        type: 'DELETE',
        success: function () {
            Swal.fire("Eliminado", "Registro eliminado correctamente.", "success");
            cargarDatosDesdeServidor();
        },
        error: function () {
            Swal.fire("Error", "No se pudo eliminar.", "error");
        }
    });
}

 */