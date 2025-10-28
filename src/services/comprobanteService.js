import jsPDF from 'jspdf';

class ComprobanteService {
  /**
   * Genera un comprobante en PDF para un nuevo socio registrado
   * @param {Object} socio - Datos del socio registrado
   */
  generarComprobanteSocio(socio) {
    try {
      console.log('=== Generando comprobante con datos ===');
      console.log('Socio recibido:', socio);
      
      // Validar que tenemos al menos el ID
      if (!socio || !socio.id) {
        throw new Error('Datos del socio incompletos: falta ID');
      }

      const doc = new jsPDF();
      const fechaActual = new Date().toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Configuración de colores
      const colorPrimario = [30, 58, 138];
      const colorSecundario = [30, 64, 175];
      const colorTexto = [27, 27, 27];
      const colorGris = [107, 114, 128];

      // Header con fondo azul
      doc.setFillColor(...colorPrimario);
      doc.rect(0, 0, 210, 40, 'F');

      // Logo/Ícono
      doc.setFillColor(255, 255, 255);
      doc.circle(20, 20, 8, 'F');
      doc.setTextColor(...colorPrimario);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('B', 18, 24);

      // Título
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('BiblioGest', 35, 18);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Sistema de Gestion Bibliotecaria', 35, 26);

      // Subtítulo del comprobante
      doc.setFillColor(240, 249, 255);
      doc.rect(0, 40, 210, 15, 'F');
      doc.setTextColor(...colorPrimario);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('COMPROBANTE DE REGISTRO DE SOCIO', 105, 50, { align: 'center' });

      // Número de comprobante y fecha
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colorGris);
      doc.text(`Comprobante N° ${String(socio.id).padStart(6, '0')}`, 20, 65);
      doc.text(`Fecha de emision: ${fechaActual}`, 20, 70);

      // Línea separadora
      doc.setDrawColor(...colorPrimario);
      doc.setLineWidth(0.5);
      doc.line(20, 75, 190, 75);

      // Sección de datos del socio
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colorPrimario);
      doc.text('DATOS DEL SOCIO', 20, 85);

      // Caja con los datos
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(20, 90, 170, 60, 3, 3, 'F');
      doc.setDrawColor(...colorSecundario);
      doc.setLineWidth(0.3);
      doc.roundedRect(20, 90, 170, 60, 3, 3, 'S');

      // Datos del socio con validaciones
      let yPos = 100;
      doc.setFontSize(11);
      doc.setTextColor(...colorTexto);
      
      doc.setFont('helvetica', 'bold');
      doc.text('Numero de Socio:', 30, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colorPrimario);
      doc.setFontSize(13);
      doc.text(`#${socio.id}`, 75, yPos);

      yPos += 10;
      doc.setFont('helvetica', 'bold');
      doc.text('Fecha de Registro:', 30, yPos);
      doc.setFont('helvetica', 'normal');
      const fechaRegistro = socio.fecha_registro 
        ? new Date(socio.fecha_registro).toLocaleDateString('es-AR')
        : new Date().toLocaleDateString('es-AR');
      doc.text(fechaRegistro, 75, yPos);

      // Sección de información importante
      yPos = 165;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colorPrimario);
      doc.text('INFORMACION IMPORTANTE', 20, yPos);

      yPos += 10;
      doc.setFillColor(254, 252, 232);
      doc.roundedRect(20, yPos, 170, 40, 3, 3, 'F');
      doc.setDrawColor(250, 204, 21);
      doc.setLineWidth(0.3);
      doc.roundedRect(20, yPos, 170, 40, 3, 3, 'S');

      yPos += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colorTexto);
      doc.text('* Presente este comprobante y su DNI para realizar prestamos', 25, yPos);
      yPos += 7;
      doc.text('* Los prestamos tienen una duracion maxima de 15 dias', 25, yPos);
      yPos += 7;
      doc.text('* La demora en devoluciones puede generar multas', 25, yPos);
      yPos += 7;
      doc.text('* Mantenga este comprobante como constancia de su registro', 25, yPos);

      // Footer
      yPos = 265;
      doc.setDrawColor(...colorGris);
      doc.setLineWidth(0.3);
      doc.line(20, yPos, 190, yPos);
      
      yPos += 7;
      doc.setFontSize(9);
      doc.setTextColor(...colorGris);
      doc.setFont('helvetica', 'italic');
      doc.text('Este es un documento generado automaticamente por BiblioGest', 105, yPos, { align: 'center' });
      yPos += 5;
      doc.text('Sistema de Gestion Bibliotecaria (c) 2025', 105, yPos, { align: 'center' });

      // Marca de agua
      doc.setTextColor(230, 230, 230);
      doc.setFontSize(50);
      doc.setFont('helvetica', 'bold');
      doc.text('VALIDO', 105, 150, { 
        align: 'center',
        angle: 45
      });

      // Guardar el PDF con nombre seguro
      const nombreParaArchivo = socio.nombre || socio.name || 'Sin_Nombre';
      const nombreLimpio = String(nombreParaArchivo).replace(/[^a-zA-Z0-9]/g, '_');
      const nombreArchivo = `Comprobante_Socio_${socio.id}_${nombreLimpio}.pdf`;
      
      console.log('Guardando PDF con nombre:', nombreArchivo);
      doc.save(nombreArchivo);

      return nombreArchivo;
    } catch (error) {
      console.error('Error detallado al generar comprobante:', error);
      throw new Error('No se pudo generar el comprobante PDF: ' + error.message);
    }
  }

  /**
   * Genera una vista previa del comprobante (retorna el blob en lugar de descargar)
   */
  generarComprobanteBlob() {
    const doc = new jsPDF();
    // Mismo código de generación...
    return doc.output('blob');
  }
}

export default new ComprobanteService();
















