let productos = [];
let ventasAcumuladas = {}; // Para acumular las ventas de todos los productos
let valoresVentas = {}; // Para acumular los valores monetarios de las ventas

// Nueva lista de productos con códigos únicos
const catalogoProductos = {
    'AUD001': { nombre: 'Audífonos Bluetooth inalámbricos', precio: 9.80 },
    'PAR002': { nombre: 'Parlante portátil recargable', precio: 15.50 },
    'POW003': { nombre: 'Power Bank 10,000 mAh', precio: 12.00 },
    'REL004': { nombre: 'Reloj inteligente (Smartwatch)', precio: 18.90 },
    'TER005': { nombre: 'Termo acero inoxidable 1 litro', precio: 6.75 },
    'CUC006': { nombre: 'Set de cuchillos de cocina 6 piezas', precio: 11.40 },
    'LIN007': { nombre: 'Linterna LED recargable', precio: 5.90 },
    'HUM008': { nombre: 'Humidificador de aire USB', precio: 7.25 }
};

const coloresBarras = {
    'AUD001': '#4CAF50',
    'PAR002': '#2196F3',
    'POW003': '#FF9800',
    'REL004': '#9C27B0',
    'TER005': '#F44336',
    'CUC006': '#00BCD4',
    'LIN007': '#795548',
    'HUM008': '#607D8B'
};

document.getElementById('btnAgregar').addEventListener('click', agregarProducto);
document.getElementById('btnGenerar').addEventListener('click', generarFacturaCompleta);
document.getElementById('btnGenerarPDF').addEventListener('click', () => generarFactura('pdf'));
document.getElementById('btnGenerarXML').addEventListener('click', () => generarFactura('xml'));

// Agregar eventos para convertir a mayúsculas automáticamente
document.getElementById('cliente').addEventListener('input', function() {
    this.value = this.value.toUpperCase();
});

document.getElementById('direccion').addEventListener('input', function() {
    this.value = this.value.toUpperCase();
});

// Función para validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Función para generar número de autorización del SRI
function generarNumeroAutorizacionSRI() {
    // Formato típico del SRI: 49 dígitos
    // Estructura: AAAAMMDDHHMMSS + 35 dígitos adicionales
    const fecha = new Date();
    const año = fecha.getFullYear().toString();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const hora = fecha.getHours().toString().padStart(2, '0');
    const minuto = fecha.getMinutes().toString().padStart(2, '0');
    const segundo = fecha.getSeconds().toString().padStart(2, '0');
    
    // Primeros 14 dígitos: fecha y hora
    let autorizacion = año + mes + dia + hora + minuto + segundo;
    
    // Agregar 35 dígitos adicionales (simulados para demo)
    for (let i = 0; i < 35; i++) {
        autorizacion += Math.floor(Math.random() * 10);
    }
    
    return autorizacion;
}

// Función para generar clave de acceso (44 dígitos)
function generarClaveAcceso() {
    const fecha = new Date();
    const fechaStr = fecha.getDate().toString().padStart(2, '0') + 
                    (fecha.getMonth() + 1).toString().padStart(2, '0') + 
                    fecha.getFullYear().toString();
    
    // Estructura de clave de acceso del SRI
    // DDMMAAAA + TipoComprobante + RUC + Ambiente + Serie + Secuencial + CodigoNumerico + TipoEmision
    const tipoComprobante = '01'; // 01 = Factura
    const rucEmisor = '1234567890001'; // RUC de la empresa (demo)
    const ambiente = '2'; // 1=Pruebas, 2=Producción
    const serie = '001001'; // Serie del establecimiento
    const secuencial = Date.now().toString().slice(-9); // Últimos 9 dígitos del timestamp
    const codigoNumerico = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    const tipoEmision = '1'; // 1=Emisión normal
    
    let claveAcceso = fechaStr + tipoComprobante + rucEmisor + ambiente + serie + secuencial + codigoNumerico + tipoEmision;
    
    // Calcular dígito verificador (algoritmo módulo 11)
    let suma = 0;
    const multiplicadores = [2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7, 2];
    
    for (let i = 0; i < claveAcceso.length; i++) {
        suma += parseInt(claveAcceso[i]) * multiplicadores[i];
    }
    
    const residuo = suma % 11;
    const digitoVerificador = residuo === 0 ? 0 : residuo === 1 ? 1 : 11 - residuo;
    
    return claveAcceso + digitoVerificador.toString();
}

function validarRUC(valor) {
    // Eliminar espacios y guiones
    valor = valor.replace(/[\s-]/g, '');
    
    // Verificar si es RUC (13 dígitos)
    if (/^\d{13}$/.test(valor)) {
        return { valido: true, tipo: 'RUC' };
    }
    
    // Verificar si es cédula (10 dígitos)
    if (/^\d{10}$/.test(valor)) {
        return { valido: true, tipo: 'CEDULA' };
    }
    
    return { valido: false, tipo: null };
}

function limpiarErrores() {
    document.getElementById('rucError').textContent = '';
    document.getElementById('clienteError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('direccionError').textContent = '';
    document.getElementById('cantidadError').textContent = '';
}

function validarFormulario() {
    let esValido = true;
    limpiarErrores();

    const ruc = document.getElementById('ruc').value;
    const cliente = document.getElementById('cliente').value;
    const email = document.getElementById('email').value;
    const direccion = document.getElementById('direccion').value;
    const cantidad = document.getElementById('cantidad').value;

    const validacionRuc = validarRUC(ruc);
    if (!validacionRuc.valido) {
        document.getElementById('rucError').textContent = 'Debe ingresar un RUC válido (13 dígitos) o cédula válida (10 dígitos)';
        esValido = false;
    }

    if (!cliente.trim()) {
        document.getElementById('clienteError').textContent = 'Cliente es requerido';
        esValido = false;
    }

    if (!email.trim()) {
        document.getElementById('emailError').textContent = 'Email es requerido';
        esValido = false;
    } else if (!validarEmail(email)) {
        document.getElementById('emailError').textContent = 'Debe ingresar un email válido';
        esValido = false;
    }

    if (!direccion.trim()) {
        document.getElementById('direccionError').textContent = 'Dirección es requerida';
        esValido = false;
    }

    if (!cantidad || cantidad <= 0) {
        document.getElementById('cantidadError').textContent = 'Cantidad debe ser mayor a 0';
        esValido = false;
    }

    return esValido;
}

function agregarProducto() {
    if (!validarFormulario()) {
        return;
    }

    const codigoProducto = document.getElementById('producto').value;
    const productoInfo = catalogoProductos[codigoProducto];
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const precio = productoInfo.precio;
    const subtotal = cantidad * precio;
    const iva = subtotal * 0.15;
    const total = subtotal + iva;

    productos.push({
        codigo: codigoProducto,
        producto: productoInfo.nombre,
        cantidad,
        precio,
        subtotal,
        iva,
        total
    });

    // Actualizar ventas acumuladas (cantidad)
    if (ventasAcumuladas[codigoProducto]) {
        ventasAcumuladas[codigoProducto] += cantidad;
    } else {
        ventasAcumuladas[codigoProducto] = cantidad;
    }

    // Actualizar valores de ventas acumulados (valor monetario total)
    if (valoresVentas[codigoProducto]) {
        valoresVentas[codigoProducto] += total;
    } else {
        valoresVentas[codigoProducto] = total;
    }

    actualizarListaProductos();
    actualizarTotales();
    actualizarGrafico();
    document.getElementById('cantidad').value = '';
}

function eliminarProducto(index) {
    const productoEliminado = productos[index];
    
    // Reducir de las ventas acumuladas (cantidad)
    ventasAcumuladas[productoEliminado.codigo] -= productoEliminado.cantidad;
    if (ventasAcumuladas[productoEliminado.codigo] <= 0) {
        delete ventasAcumuladas[productoEliminado.codigo];
    }

    // Reducir de los valores de ventas acumulados
    valoresVentas[productoEliminado.codigo] -= productoEliminado.total;
    if (valoresVentas[productoEliminado.codigo] <= 0) {
        delete valoresVentas[productoEliminado.codigo];
    }
    
    productos.splice(index, 1);
    actualizarListaProductos();
    actualizarTotales();
    actualizarGrafico();
}

function actualizarListaProductos() {
    const tableBody = document.getElementById('productsTableBody');
    const table = document.getElementById('productsTable');
    const noProductsMessage = document.getElementById('noProductsMessage');
    
    tableBody.innerHTML = '';

    if (productos.length === 0) {
        table.style.display = 'none';
        noProductsMessage.style.display = 'block';
        return;
    }

    table.style.display = 'table';
    noProductsMessage.style.display = 'none';

    productos.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${item.codigo}</strong><br><small>${item.producto}</small></td>
            <td>${item.cantidad}</td>
            <td>$${item.precio.toFixed(2)}</td>
            <td>$${item.subtotal.toFixed(2)}</td>
            <td>$${item.iva.toFixed(2)}</td>
            <td><strong>$${item.total.toFixed(2)}</strong></td>
            <td>
                <button class="delete-btn" onclick="eliminarProducto(${index})">
                    Eliminar
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function actualizarTotales() {
    const subtotal = productos.reduce((sum, item) => sum + item.subtotal, 0);
    const iva = productos.reduce((sum, item) => sum + item.iva, 0);
    const total = productos.reduce((sum, item) => sum + item.total, 0);

    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('iva').textContent = iva.toFixed(2);
    document.getElementById('total').textContent = total.toFixed(2);
}

function actualizarGrafico() {
    const svg = document.getElementById('salesChart');
    const noDataMessage = document.getElementById('noChartData');
    
    // Limpiar SVG
    svg.innerHTML = '';
    
    // Si no hay ventas, mostrar mensaje
    if (Object.keys(valoresVentas).length === 0) {
        svg.style.display = 'none';
        noDataMessage.style.display = 'block';
        return;
    }
    
    svg.style.display = 'block';
    noDataMessage.style.display = 'none';
    
    // Configuración del gráfico vertical
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 120, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    // Obtener datos ordenados por valor de ventas
    const datosOrdenados = Object.entries(valoresVentas)
        .sort((a, b) => b[1] - a[1]);
    
    const maxValor = Math.max(...Object.values(valoresVentas));
    const barWidth = chartWidth / datosOrdenados.length * 0.7;
    const barSpacing = chartWidth / datosOrdenados.length * 0.3;
    
    // Crear grupo principal
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${margin.left}, ${margin.top})`);
    
    // Crear ejes
    // Eje Y (vertical)
    const ejeY = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    ejeY.setAttribute('x1', '0');
    ejeY.setAttribute('y1', '0');
    ejeY.setAttribute('x2', '0');
    ejeY.setAttribute('y2', chartHeight);
    ejeY.setAttribute('stroke', '#666');
    ejeY.setAttribute('stroke-width', '2');
    g.appendChild(ejeY);
    
    // Eje X (horizontal)
    const ejeX = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    ejeX.setAttribute('x1', '0');
    ejeX.setAttribute('y1', chartHeight);
    ejeX.setAttribute('x2', chartWidth);
    ejeX.setAttribute('y2', chartHeight);
    ejeX.setAttribute('stroke', '#666');
    ejeX.setAttribute('stroke-width', '2');
    g.appendChild(ejeX);
    
    // Crear barras verticales y etiquetas
    datosOrdenados.forEach((item, index) => {
        const [codigoProducto, valor] = item;
        const nombreProducto = catalogoProductos[codigoProducto].nombre;
        const barHeight = (valor / maxValor) * chartHeight;
        const x = index * (barWidth + barSpacing) + barSpacing / 2;
        const y = chartHeight - barHeight;
        
        // Crear barra vertical
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', barWidth);
        rect.setAttribute('height', barHeight);
        rect.setAttribute('fill', coloresBarras[codigoProducto] || '#4CAF50');
        rect.setAttribute('class', 'bar');
        rect.setAttribute('rx', '4'); // Bordes redondeados
        g.appendChild(rect);
        
        // Etiqueta del código del producto (eje X - primera línea)
        const labelCodigo = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        labelCodigo.setAttribute('x', x + barWidth / 2);
        labelCodigo.setAttribute('y', chartHeight + 20);
        labelCodigo.setAttribute('text-anchor', 'middle');
        labelCodigo.setAttribute('class', 'axis-label');
        labelCodigo.setAttribute('font-weight', 'bold');
        labelCodigo.setAttribute('font-size', '12px');
        labelCodigo.setAttribute('fill', coloresBarras[codigoProducto] || '#4CAF50');
        labelCodigo.textContent = codigoProducto;
        g.appendChild(labelCodigo);
        
        // Nombre del producto (segunda línea en el eje X)
        const labelNombre = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        labelNombre.setAttribute('x', x + barWidth / 2);
        labelNombre.setAttribute('y', chartHeight + 35);
        labelNombre.setAttribute('text-anchor', 'middle');
        labelNombre.setAttribute('class', 'axis-label');
        labelNombre.setAttribute('font-size', '9px');
        labelNombre.setAttribute('fill', '#666');
        // Truncar nombre si es muy largo para que quepa en el ancho de la barra
        const maxChars = Math.floor(barWidth / 6); // Aproximadamente 6px por carácter
        const nombreCorto = nombreProducto.length > maxChars ? 
            nombreProducto.substring(0, maxChars - 3) + '...' : nombreProducto;
        labelNombre.textContent = nombreCorto;
        g.appendChild(labelNombre);
        
        // Tercera línea con precio unitario
        const precioUnitario = catalogoProductos[codigoProducto].precio;
        const labelPrecio = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        labelPrecio.setAttribute('x', x + barWidth / 2);
        labelPrecio.setAttribute('y', chartHeight + 50);
        labelPrecio.setAttribute('text-anchor', 'middle');
        labelPrecio.setAttribute('class', 'axis-label');
        labelPrecio.setAttribute('font-size', '8px');
        labelPrecio.setAttribute('fill', '#888');
        labelPrecio.textContent = `$${precioUnitario.toFixed(2)} c/u`;
        g.appendChild(labelPrecio);
        
        // Valor encima de la barra (valor monetario total)
        const labelValue = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        labelValue.setAttribute('x', x + barWidth / 2);
        labelValue.setAttribute('y', y - 8);
        labelValue.setAttribute('text-anchor', 'middle');
        labelValue.setAttribute('class', 'bar-label');
        labelValue.setAttribute('font-weight', 'bold');
        labelValue.setAttribute('font-size', '12px');
        labelValue.setAttribute('fill', coloresBarras[codigoProducto] || '#4CAF50');
        labelValue.textContent = `$${valor.toFixed(2)}`;
        g.appendChild(labelValue);

        // Cantidad vendida dentro de la barra (si la barra es suficientemente alta)
        if (barHeight > 40) {
            const labelCantidad = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            labelCantidad.setAttribute('x', x + barWidth / 2);
            labelCantidad.setAttribute('y', y + barHeight / 2 + 4);
            labelCantidad.setAttribute('text-anchor', 'middle');
            labelCantidad.setAttribute('class', 'bar-label');
            labelCantidad.setAttribute('fill', 'white');
            labelCantidad.setAttribute('font-size', '11px');
            labelCantidad.setAttribute('font-weight', 'bold');
            labelCantidad.setAttribute('text-shadow', '1px 1px 2px rgba(0,0,0,0.5)');
            labelCantidad.textContent = `${ventasAcumuladas[codigoProducto]} unid.`;
            g.appendChild(labelCantidad);
        }
    });
    
    // Etiquetas de los ejes
    const labelEjeY = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelEjeY.setAttribute('x', -60);
    labelEjeY.setAttribute('y', chartHeight / 2);
    labelEjeY.setAttribute('text-anchor', 'middle');
    labelEjeY.setAttribute('transform', `rotate(-90, -60, ${chartHeight / 2})`);
    labelEjeY.setAttribute('class', 'axis-label');
    labelEjeY.setAttribute('font-weight', 'bold');
    labelEjeY.setAttribute('font-size', '14px');
    labelEjeY.textContent = 'Valor de Ventas ($)';
    g.appendChild(labelEjeY);
    
    const labelEjeX = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelEjeX.setAttribute('x', chartWidth / 2);
    labelEjeX.setAttribute('y', chartHeight + 80);
    labelEjeX.setAttribute('text-anchor', 'middle');
    labelEjeX.setAttribute('class', 'axis-label');
    labelEjeX.setAttribute('font-weight', 'bold');
    labelEjeX.setAttribute('font-size', '14px');
    labelEjeX.textContent = 'Productos';
    g.appendChild(labelEjeX);
    
    // Líneas de referencia en el eje Y con valores monetarios
    const stepValue = Math.ceil(maxValor / 5 / 5) * 5; // Redondear a múltiplos de 5
    for (let i = 1; i <= 5; i++) {
        const valor = stepValue * i;
        if (valor <= maxValor) {
            const yPos = chartHeight - (valor / maxValor) * chartHeight;
            
            // Línea de referencia horizontal
            const lineaRef = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            lineaRef.setAttribute('x1', '0');
            lineaRef.setAttribute('y1', yPos);
            lineaRef.setAttribute('x2', chartWidth);
            lineaRef.setAttribute('y2', yPos);
            lineaRef.setAttribute('stroke', '#ddd');
            lineaRef.setAttribute('stroke-dasharray', '2,2');
            g.appendChild(lineaRef);
            
            // Etiqueta del valor monetario en el eje Y
            const labelValor = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            labelValor.setAttribute('x', '-10');
            labelValor.setAttribute('y', yPos + 4);
            labelValor.setAttribute('text-anchor', 'end');
            labelValor.setAttribute('class', 'axis-label');
            labelValor.setAttribute('font-size', '10px');
            labelValor.textContent = `$${valor}`;
            g.appendChild(labelValor);
        }
    }
    
    svg.appendChild(g);
}

function generarXML(numeroAutorizacion, claveAcceso) {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<factura>
    <infoTributaria>
        <ambiente>2</ambiente>
        <tipoEmision>1</tipoEmision>
        <razonSocial>CIA-HERMANOS</razonSocial>
        <nombreComercial>CIA-HERMANOS</nombreComercial>
        <ruc>1234567890001</ruc>
        <claveAcceso>${claveAcceso}</claveAcceso>
        <codDoc>01</codDoc>
        <estab>001</estab>
        <ptoEmi>001</ptoEmi>
        <secuencial>000000001</secuencial>
        <dirMatriz>QUITO - ECUADOR</dirMatriz>
    </infoTributaria>
    <infoFactura>
        <fechaEmision>${new Date().toLocaleDateString('es-EC')}</fechaEmision>
        <dirEstablecimiento>QUITO - ECUADOR</dirEstablecimiento>
        <obligadoContabilidad>SI</obligadoContabilidad>
        <tipoIdentificacionComprador>${validarRUC(document.getElementById('ruc').value).tipo === 'RUC' ? '04' : '05'}</tipoIdentificacionComprador>
        <razonSocialComprador>${document.getElementById('cliente').value}</razonSocialComprador>
        <identificacionComprador>${document.getElementById('ruc').value}</identificacionComprador>
        <direccionComprador>${document.getElementById('direccion').value}</direccionComprador>
        <emailComprador>${document.getElementById('email').value}</emailComprador>
        <totalSinImpuestos>${document.getElementById('subtotal').textContent}</totalSinImpuestos>
        <totalDescuento>0.00</totalDescuento>
        <totalConImpuestos>
            <totalImpuesto>
                <codigo>2</codigo>
                <codigoPorcentaje>2</codigoPorcentaje>
                <baseImponible>${document.getElementById('subtotal').textContent}</baseImponible>
                <valor>${document.getElementById('iva').textContent}</valor>
            </totalImpuesto>
        </totalConImpuestos>
        <importeTotal>${document.getElementById('total').textContent}</importeTotal>
        <moneda>DOLAR</moneda>
    </infoFactura>
    <detalles>`;
    
    productos.forEach(item => {
        xml += `
        <detalle>
            <codigoPrincipal>${item.codigo}</codigoPrincipal>
            <descripcion>${item.producto}</descripcion>
            <cantidad>${item.cantidad}</cantidad>
            <precioUnitario>${item.precio.toFixed(2)}</precioUnitario>
            <descuento>0.00</descuento>
            <precioTotalSinImpuesto>${item.subtotal.toFixed(2)}</precioTotalSinImpuesto>
            <impuestos>
                <impuesto>
                    <codigo>2</codigo>
                    <codigoPorcentaje>2</codigoPorcentaje>
                    <tarifa>15.00</tarifa>
                    <baseImponible>${item.subtotal.toFixed(2)}</baseImponible>
                    <valor>${item.iva.toFixed(2)}</valor>
                </impuesto>
            </impuestos>
        </detalle>`;
    });

    xml += `
    </detalles>
    <infoAdicional>
        <campoAdicional nombre="NUMERO_AUTORIZACION">${numeroAutorizacion}</campoAdicional>
        <campoAdicional nombre="FECHA_AUTORIZACION">${new Date().toISOString()}</campoAdicional>
        <campoAdicional nombre="ESTADO_AUTORIZACION">AUTORIZADO</campoAdicional>
        <campoAdicional nombre="EMAIL_CLIENTE">${document.getElementById('email').value}</campoAdicional>
    </infoAdicional>
</factura>`;

    return xml;
}

function generarPDF(numeroFactura = null, numeroAutorizacion = null, claveAcceso = null) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configuración de colores
    const colorPrimario = [76, 175, 80]; // Verde
    const colorSecundario = [33, 150, 243]; // Azul
    const colorTexto = [51, 51, 51]; // Gris oscuro
    
    // Encabezado de la empresa
    doc.setFillColor(...colorPrimario);
    doc.rect(0, 0, 210, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('CIA-HERMANOS', 20, 20);
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema de Facturación', 20, 30);
    
    doc.setFontSize(12);
    doc.text('Factura Electrónica', 20, 37);
    doc.text('RUC: 1234567890001', 20, 42);
    
    // Número de factura, fecha y autorización
    doc.setTextColor(...colorTexto);
    doc.setFontSize(10);
    let yInfoPos = 20;
    if (numeroFactura) {
        doc.text(`Factura N°: ${numeroFactura}`, 140, yInfoPos);
        yInfoPos += 7;
    }
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-EC')}`, 140, yInfoPos);
    yInfoPos += 7;
    
    // Información de autorización del SRI
    if (numeroAutorizacion) {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('AUTORIZACIÓN SRI:', 140, yInfoPos);
        yInfoPos += 5;
        doc.setFont('helvetica', 'normal');
        doc.text(numeroAutorizacion, 140, yInfoPos);
        yInfoPos += 5;
    }
    
    if (claveAcceso) {
        doc.setFont('helvetica', 'bold');
        doc.text('CLAVE DE ACCESO:', 140, yInfoPos);
        yInfoPos += 5;
        doc.setFont('helvetica', 'normal');
        // Dividir la clave de acceso en líneas para mejor legibilidad
        const claveLinea1 = claveAcceso.substring(0, 22);
        const claveLinea2 = claveAcceso.substring(22);
        doc.text(claveLinea1, 140, yInfoPos);
        yInfoPos += 4;
        doc.text(claveLinea2, 140, yInfoPos);
    }
    
    // Información del cliente
    let yPos = 65;
    doc.setTextColor(...colorSecundario);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN DEL CLIENTE', 20, yPos);
    
    yPos += 10;
    doc.setTextColor(...colorTexto);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const ruc = document.getElementById('ruc').value;
    const cliente = document.getElementById('cliente').value;
    const email = document.getElementById('email').value;
    const direccion = document.getElementById('direccion').value;
    const tipoDoc = validarRUC(ruc).tipo;
    
    doc.text(`${tipoDoc}: ${ruc}`, 20, yPos);
    yPos += 7;
    doc.text(`Cliente: ${cliente}`, 20, yPos);
    yPos += 7;
    doc.text(`Email: ${email}`, 20, yPos);
    yPos += 7;
    doc.text(`Dirección: ${direccion}`, 20, yPos);
    
    // Tabla de productos
    yPos += 20;
    doc.setTextColor(...colorSecundario);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DETALLE DE PRODUCTOS', 20, yPos);
    
    yPos += 10;
    
    // Encabezados de la tabla
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos, 170, 8, 'F');
    
    doc.setTextColor(...colorTexto);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Código', 25, yPos + 5);
    doc.text('Producto', 50, yPos + 5);
    doc.text('Cant.', 110, yPos + 5);
    doc.text('P. Unit.', 125, yPos + 5);
    doc.text('Subtotal', 145, yPos + 5);
    doc.text('IVA', 165, yPos + 5);
    doc.text('Total', 180, yPos + 5);
    
    yPos += 8;
    
    // Filas de productos
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    productos.forEach((item, index) => {
        if (index % 2 === 0) {
            doc.setFillColor(250, 250, 250);
            doc.rect(20, yPos, 170, 7, 'F');
        }
        
        doc.text(item.codigo, 25, yPos + 5);
        // Truncar nombre del producto si es muy largo
        const nombreCorto = item.producto.length > 25 ? 
            item.producto.substring(0, 25) + '...' : item.producto;
        doc.text(nombreCorto, 50, yPos + 5);
        doc.text(item.cantidad.toString(), 110, yPos + 5);
        doc.text(`$${item.precio.toFixed(2)}`, 125, yPos + 5);
        doc.text(`$${item.subtotal.toFixed(2)}`, 145, yPos + 5);
        doc.text(`$${item.iva.toFixed(2)}`, 165, yPos + 5);
        doc.text(`$${item.total.toFixed(2)}`, 180, yPos + 5);
        
        yPos += 7;
    });
    
    // Totales
    yPos += 10;
    doc.setFillColor(...colorPrimario);
    doc.rect(120, yPos, 70, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    
    const subtotal = document.getElementById('subtotal').textContent;
    const iva = document.getElementById('iva').textContent;
    const total = document.getElementById('total').textContent;
    
    doc.text(`Subtotal: $${subtotal}`, 125, yPos + 7);
    doc.text(`IVA (15%): $${iva}`, 125, yPos + 14);
    doc.text(`TOTAL: $${total}`, 125, yPos + 21);
    
    // Pie de página con información adicional del SRI
    yPos = 260;
    doc.setTextColor(...colorTexto);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Documento autorizado por el Servicio de Rentas Internas del Ecuador', 105, yPos, { align: 'center' });
    yPos += 5;
    doc.text(`Email del cliente: ${email}`, 105, yPos, { align: 'center' });
    yPos += 5;
    doc.text('Gracias por su compra', 105, yPos, { align: 'center' });
    yPos += 5;
    doc.text('CIA-Hermanos - Sistema de Facturación', 105, yPos, { align: 'center' });
    
    return doc;
}

async function generarFacturaCompleta() {
    if (productos.length === 0) {
        alert('Debe agregar al menos un producto');
        return;
    }

    // Generar números de autorización y clave de acceso
    const numeroAutorizacion = generarNumeroAutorizacionSRI();
    const claveAcceso = generarClaveAcceso();
    const xml = generarXML(numeroAutorizacion, claveAcceso);
    
    try {
        const response = await fetch('http://localhost:3000/generar-factura', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                xml: xml,
                ruc: document.getElementById('ruc').value,
                cliente: document.getElementById('cliente').value,
                email: document.getElementById('email').value,
                direccion: document.getElementById('direccion').value,
                productos: productos,
                totales: {
                    subtotal: parseFloat(document.getElementById('subtotal').textContent),
                    iva: parseFloat(document.getElementById('iva').textContent),
                    total: parseFloat(document.getElementById('total').textContent)
                },
                numeroAutorizacion: numeroAutorizacion,
                claveAcceso: claveAcceso
            })
        });

        const result = await response.json();
        
        if (result.success) {
            // Generar y descargar PDF con información del SRI
            const pdf = generarPDF(result.numeroFactura, numeroAutorizacion, claveAcceso);
            pdf.save(`factura_${result.numeroFactura}.pdf`);
            
            // Descargar XML
            const blob = new Blob([xml], { type: 'application/xml' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `factura_${result.numeroFactura}.xml`;
            a.click();
            window.URL.revokeObjectURL(url);
            
            alert(`Factura generada exitosamente.\nNúmero: ${result.numeroFactura}\nAutorización SRI: ${numeroAutorizacion}\nClave de Acceso: ${claveAcceso}\n\nSe han descargado tanto el PDF como el XML.`);
            
            // Limpiar formulario después de generar factura
            productos = [];
            actualizarListaProductos();
            actualizarTotales();
            // NO limpiar ventasAcumuladas ni valoresVentas para mantener el historial del gráfico
            document.getElementById('ruc').value = '';
            document.getElementById('cliente').value = '';
            document.getElementById('email').value = '';
            document.getElementById('direccion').value = '';
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al procesar la factura');
    }
}

async function generarFactura(tipo = 'completa') {
    if (productos.length === 0) {
        alert('Debe agregar al menos un producto');
        return;
    }

    if (tipo === 'pdf') {
        // Solo generar PDF con información del SRI
        const numeroAutorizacion = generarNumeroAutorizacionSRI();
        const claveAcceso = generarClaveAcceso();
        const pdf = generarPDF(null, numeroAutorizacion, claveAcceso);
        const timestamp = Date.now();
        pdf.save(`factura_${timestamp}.pdf`);
        alert(`PDF generado y descargado exitosamente.\nAutorización SRI: ${numeroAutorizacion}`);
        return;
    }

    if (tipo === 'xml') {
        // Solo generar XML con información del SRI
        const numeroAutorizacion = generarNumeroAutorizacionSRI();
        const claveAcceso = generarClaveAcceso();
        const xml = generarXML(numeroAutorizacion, claveAcceso);
        const blob = new Blob([xml], { type: 'application/xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const timestamp = Date.now();
        a.download = `factura_${timestamp}.xml`;
        a.click();
        window.URL.revokeObjectURL(url);
        alert(`XML generado y descargado exitosamente.\nAutorización SRI: ${numeroAutorizacion}`);
        return;
    }
}

// Inicializar gráfico vacío al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarGrafico();
});