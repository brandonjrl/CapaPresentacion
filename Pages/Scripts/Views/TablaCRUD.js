let columnasTabla = [
    { campo: "Oid", titulo: "Oid" },
    { campo: "TipoServicio", titulo: "Tipo Servicio" },
    { campo: "ListaVerificacion", titulo: "Lista Verificación" },
    { campo: "Organizacion", titulo: "Nombre Organización" },
    { campo: "FechaInicio", titulo: "Fecha Inicio" },
    { campo: "FechaFin", titulo: "Fecha Fin" }
];

let camposFormulario = [
    { campo: "Oid", titulo: "Oid", tipoInput: "number", mostrarEnFormulario: false, mostrarEnDetalle: true, requerido: false },
    { campo: "TipoServicio", titulo: "Tipo Servicio", tipoInput: "select", opciones: ["OMA", "OTRO"], mostrarEnFormulario: true, mostrarEnDetalle: true, requerido: true },
    { campo: "ListaVerificacion", titulo: "Lista Verificación", tipoInput: "text", mostrarEnFormulario: true, mostrarEnDetalle: true, requerido: true },
    { campo: "Organizacion", titulo: "Nombre Organización", tipoInput: "text", mostrarEnFormulario: true, mostrarEnDetalle: true, requerido: true },
    { campo: "FechaInicio", titulo: "Fecha Inicio", tipoInput: "date", mostrarEnFormulario: true, mostrarEnDetalle: true, requerido: true },
    { campo: "FechaFin", titulo: "Fecha Fin", tipoInput: "date", mostrarEnFormulario: true, mostrarEnDetalle: true, requerido: true },
    { campo: "ArchivoAdjunto", titulo: "Adjuntar Archivo", tipoInput: "file", mostrarEnFormulario: true, mostrarEnDetalle: false, requerido: false },
    { campo: "Observaciones", titulo: "Observaciones", tipoInput: "textarea", mostrarEnFormulario: true, mostrarEnDetalle: true, requerido: false },
    { campo: "CreadoPor", titulo: "Creado Por", tipoInput: "text", mostrarEnFormulario: false, mostrarEnDetalle: false, requerido: false }
];

let datosDummy = [
    {
        Oid: "28",
        TipoServicio: "OMA",
        ListaVerificacion: "LV145-II-4-MIA",
        Organizacion: "TRANSPACIFICO S.A.",
        FechaInicio: "2025-03-01",
        FechaFin: "2025-03-09",
        Observaciones: "Todo bien",
        CreadoPor: "admin",
        ArchivoAdjunto: "archivo.pdf"
    }
];

$(document).ready(function () {
    generarEncabezado();
    cargarTabla();

    $('#btnNuevo').click(function () {
        abrirModalNuevo();
    });

    $('#btnGuardarNuevo').click(function () {
        guardarNuevoRegistro();
    });
});

function generarEncabezado() {
    let thead = $('#thead-columns');
    thead.empty();

    columnasTabla.forEach(col => {
        thead.append(`<th>${col.titulo}</th>`);
    });

    thead.append(`<th>Acciones</th>`);
}

function cargarTabla() {
    const idTabla = '#tablaVisualizacion';

    // Destruir DataTable si ya fue inicializado
    if ($.fn.DataTable.isDataTable(idTabla)) {
        $(idTabla).DataTable().destroy();
    }

    const tbody = $(idTabla + ' tbody');
    tbody.empty();

    if (datosDummy.length === 0) {
        tbody.append(`<tr><td colspan="${columnasTabla.length + 1}" class="text-center text-muted">No hay registros para mostrar.</td></tr>`);
    } else {
        datosDummy.forEach((item, index) => {
            let fila = '<tr>';
            columnasTabla.forEach(col => {
                fila += `<td>${item[col.campo] || ''}</td>`;
            });

            fila += `<td>
                <button class="btn btn-sm btn-primary" onclick='abrirFormulario(${JSON.stringify(JSON.stringify(item))})'>
                    <i class="fas fa-pen"></i>
                </button>
                <button class="btn btn-sm btn-danger ml-2" onclick='eliminarRegistro(${index})'>
                    <i class="fa fa-trash"></i>
                </button>
            </td>`;
            fila += '</tr>';

            tbody.append(fila);
        });
    }

    // Inicializar DataTable con idioma español
    $(idTabla).DataTable({
        language: {
            url: $.MisUrls.url.Url_datatable_spanish
        }
    });
}


function abrirModalDetalle(json) {
    const data = json ? JSON.parse(json) : {};
    const contenedor = $("#detalleCampos");
    contenedor.empty();

    camposFormulario.forEach(col => {
        if (!col.mostrarEnDetalle) return;

        contenedor.append(`
            <div class="form-group col-md-6">
                <label>${col.titulo}:</label>
                <input type="text" class="form-control form-control-sm"
                       name="${col.campo}"
                       value="${data[col.campo] || ''}"
                       disabled />
            </div>
        `);
    });

    $('#formVisualizacion').modal('show');
}

function abrirModalNuevo() {
    const contenedor = $("#nuevoCampos");
    contenedor.empty();

    camposFormulario.forEach(col => {
        if (!col.mostrarEnFormulario) return;

        let inputHtml = '';
        let requerido = col.requerido ? 'required' : '';
        let label = col.titulo + (col.requerido ? ' <span class="text-danger">*</span>' : '');

        switch (col.tipoInput) {
            case "select":
                inputHtml = `<select class="form-control form-control-sm" name="${col.campo}" ${requerido}>
                                <option value="">-- Seleccionar --</option>
                                ${col.opciones.map(op => `<option value="${op}">${op}</option>`).join('')}
                             </select>`;
                break;
            case "date":
            case "number":
                inputHtml = `<input type="${col.tipoInput}" class="form-control form-control-sm" name="${col.campo}" ${requerido} />`;
                break;
            case "file":
                inputHtml = `<input type="file" class="form-control-file" name="${col.campo}" ${requerido} />`;
                break;
            case "textarea":
                inputHtml = `<textarea class="form-control form-control-sm" name="${col.campo}" ${requerido}></textarea>`;
                break;
            default:
                inputHtml = `<input type="text" class="form-control form-control-sm" name="${col.campo}" ${requerido} />`;
        }

        contenedor.append(`
            <div class="form-group col-md-6">
                <label>${label}</label>
                ${inputHtml}
            </div>
        `);
    });

    $('#tituloModalFormulario').text("Nuevo Registro");
    $('#formNuevoRegistro').modal('show');

    $('#btnGuardarNuevo')
        .removeClass('btn-primary')
        .addClass('btn-success')
        .off('click')
        .click(function () {
            guardarNuevoRegistro();
        });
}

function guardarNuevoRegistro() {
    const formElement = document.getElementById('formNuevo');
    const formData = new FormData(formElement);
    let faltantes = [];

    camposFormulario.forEach(col => {
        if (col.requerido && col.mostrarEnFormulario && col.tipoInput !== "file") {
            const valor = formData.get(col.campo);
            if (!valor) faltantes.push(col.titulo);
        }
    });

    if (faltantes.length > 0) {
        Swal.fire({
            icon: "warning",
            title: "Campos requeridos",
            html: `Debes completar los siguientes campos:<br><strong>${faltantes.join(", ")}</strong>`,
            confirmButtonText: "Entendido"
        });
        return;
    }

    const nuevo = {};
    camposFormulario.forEach(col => {
        if (col.tipoInput === "file") {
            nuevo[col.campo] = formData.get(col.campo) ?.name || "";
        } else {
            nuevo[col.campo] = formData.get(col.campo);
        }
    });

    datosDummy.push(nuevo);
    $('#formNuevoRegistro').modal('hide');
    limpiarFormularioNuevo();
    Swal.fire("Éxito", "Registro agregado correctamente.", "success");
    cargarTabla();
}

function guardarEdicionRegistro(oid) {
    const formElement = document.getElementById('formNuevo');
    const formData = new FormData(formElement);
    let faltantes = [];

    camposFormulario.forEach(col => {
        if (col.requerido && col.mostrarEnFormulario && col.tipoInput !== "file") {
            const valor = formData.get(col.campo);
            if (!valor) faltantes.push(col.titulo);
        }
    });

    if (faltantes.length > 0) {
        Swal.fire({
            icon: "warning",
            title: "Campos requeridos",
            html: `Debes completar los siguientes campos:<br><strong>${faltantes.join(", ")}</strong>`,
            confirmButtonText: "Entendido"
        });
        return;
    }

    const index = datosDummy.findIndex(item => item.Oid == oid);
    if (index === -1) return;

    camposFormulario.forEach(col => {
        if (col.tipoInput === "file") {
            datosDummy[index][col.campo] = formData.get(col.campo) ?.name || datosDummy[index][col.campo];
        } else {
            datosDummy[index][col.campo] = formData.get(col.campo);
        }
    });

    $('#formNuevoRegistro').modal('hide');
    limpiarFormularioNuevo();
    Swal.fire("Éxito", "Registro actualizado correctamente.", "success");
    cargarTabla();
}

function abrirFormulario(json) {
    const data = JSON.parse(json);
    const contenedor = $("#nuevoCampos");
    contenedor.empty();

    camposFormulario.forEach(col => {
        if (!col.mostrarEnFormulario) return;

        let valor = data[col.campo] || '';
        let requerido = col.requerido ? 'required' : '';
        let label = col.titulo + (col.requerido ? ' <span class="text-danger">*</span>' : '');
        let inputHtml = '';

        switch (col.tipoInput) {
            case "select":
                inputHtml = `<select class="form-control form-control-sm" name="${col.campo}" ${requerido}>
                                <option value="">-- Seleccionar --</option>
                                ${col.opciones.map(op => `<option value="${op}" ${valor === op ? "selected" : ""}>${op}</option>`).join('')}
                             </select>`;
                break;
            case "date":
            case "number":
            case "text":
                inputHtml = `<input type="${col.tipoInput}" class="form-control form-control-sm" name="${col.campo}" value="${valor}" ${requerido} />`;
                break;
            case "textarea":
                inputHtml = `<textarea class="form-control form-control-sm" name="${col.campo}" ${requerido}>${valor}</textarea>`;
                break;
            case "file":
                inputHtml = `<input type="file" class="form-control-file" name="${col.campo}" ${requerido} />`;
                break;
            default:
                inputHtml = `<input type="text" class="form-control form-control-sm" name="${col.campo}" value="${valor}" ${requerido} />`;
        }

        contenedor.append(`
            <div class="form-group col-md-6">
                <label>${label}</label>
                ${inputHtml}
            </div>
        `);
    });

    $('#tituloModalFormulario').text("Editar Registro");
    $('#formNuevoRegistro').modal('show');

    $('#btnGuardarNuevo')
        .removeClass('btn-success')
        .addClass('btn-primary')
        .off('click')
        .click(function () {
            guardarEdicionRegistro(data.Oid);
        });
}

function eliminarRegistro(index) {
    Swal.fire({
        title: "¿Deseas eliminar este registro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then(result => {
        if (result.isConfirmed) {
            datosDummy.splice(index, 1);
            cargarTabla();
            Swal.fire("Eliminado", "Registro eliminado correctamente.", "success");
        }
    });
}

function limpiarFormularioNuevo() {
    $('#formNuevo')[0].reset();
}
