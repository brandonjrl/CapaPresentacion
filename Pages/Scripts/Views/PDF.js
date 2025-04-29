document.addEventListener("DOMContentLoaded", function () {
    var btnPDF = document.getElementById("btnGenerarPDF");
    if (btnPDF) {
        btnPDF.addEventListener("click", function () {
            var docDefinition = {
                content: [
                    { text: 'Reporte generado con pdfmake', fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
                    { text: 'Este es un ejemplo simple de PDF generado en el cliente.' },
                ]
            };
            pdfMake.createPdf(docDefinition).open();
        });
    }

    var btnImprimir = document.getElementById("btnImprimirPantalla");
    if (btnImprimir) {
        btnImprimir.addEventListener("click", function () {
            window.print();
        });
    }
});
