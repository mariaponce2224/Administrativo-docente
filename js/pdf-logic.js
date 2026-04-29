// Simulación de generación de PDF para "Pedido de Suplente"
// Usa la librería jsPDF (debe estar cargada en el HTML)

function generarPedidoSuplente(docente, escuela, motivo) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Estilos Básicos para el PDF "Oficial"
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("FORMULARIO OFICIAL DE PEDIDO DE SUPLENTE", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text("SUPERVISIÓN DE EDUCACIÓN PLÁSTICA", 105, 30, { align: "center" });
    doc.line(20, 35, 190, 35);

    // Cuerpo del documento
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    const fecha = new Intl.DateTimeFormat('es-AR').format(new Date());
    doc.text(`Fecha de Emisión: ${fecha}`, 190, 45, { align: "right" });

    doc.text("Por intermedio de la presente, se solicita la cobertura de suplencia para el siguiente cargo:", 20, 60);

    // Datos en tabla/secciones
    doc.setFont("helvetica", "bold");
    doc.text("DATOS DEL DOCENTE A REEMPLAZAR:", 20, 75);
    doc.setFont("helvetica", "normal");
    doc.text(`Nombre y Apellido: ${docente}`, 30, 85);
    doc.text(`Establecimiento: ${escuela}`, 30, 95);

    doc.setFont("helvetica", "bold");
    doc.text("MOTIVO DE LA SOLICITUD:", 20, 110);
    doc.setFont("helvetica", "normal");
    doc.text(`Motivo: ${motivo}`, 30, 120);
    doc.text("Plazo estimado: A determinar según certificado adjunto.", 30, 130);

    // Firma
    doc.line(120, 180, 180, 180);
    doc.text("Firma y Sello de Supervisión", 150, 185, { align: "center" });

    // Descargar el PDF
    doc.save(`Pedido_Suplente_${docente.replace(" ", "_")}.pdf`);
}

// Escuchar clics en botones de la tabla de la supervisora
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-generar-pdf');
    if (btn) {
        const row = btn.closest('tr');
        const docente = row.cells[0].innerText;
        const escuela = row.cells[1].innerText;
        const motivo = row.cells[2].innerText;
        
        generarPedidoSuplente(docente, escuela, motivo);
    }
});
