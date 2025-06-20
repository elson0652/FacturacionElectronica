import express from 'express';
import cors from 'cors';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

function registrarOperacion(operacion, detalles = {}) {
    const timestamp = new Date().toISOString();
    const ip = '127.0.0.1'; // In production, get from request
    const detallesStr = JSON.stringify(detalles);
    const logEntry = `[${timestamp}] IP: ${ip} - ${operacion} - Detalles: ${detallesStr}\n`;
    
    return writeFile('bitacora.log', logEntry, { flag: 'a' });
}

function validarRUC(valor) {
    if (!valor) return { valido: false, tipo: null };
    
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

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarFactura(data) {
    const errores = [];
    
    const validacionRuc = validarRUC(data.ruc);
    if (!validacionRuc.valido) {
        errores.push('RUC/Cédula inválido - debe tener 13 dígitos (RUC) o 10 dígitos (cédula)');
    }
    
    if (!data.cliente) {
        errores.push('El nombre del cliente es requerido');
    }
    
    if (!data.email) {
        errores.push('El email del cliente es requerido');
    } else if (!validarEmail(data.email)) {
        errores.push('El email del cliente no tiene un formato válido');
    }
    
    if (!data.direccion) {
        errores.push('La dirección es requerida');
    }
    
    if (!data.productos || data.productos.length === 0) {
        errores.push('Debe incluir al menos un producto');
    }
    
    return errores;
}

app.post('/generar-factura', async (req, res) => {
    try {
        const data = req.body;
        
        // Registrar intento de generación de factura
        await registrarOperacion('Inicio de generación de factura', {
            cliente: data.cliente,
            email: data.email,
            ruc: data.ruc,
            numeroAutorizacion: data.numeroAutorizacion,
            claveAcceso: data.claveAcceso
        });
        
        const errores = validarFactura(data);
        
        if (errores.length > 0) {
            await registrarOperacion('Error de validación', { errores });
            return res.status(400).json({ error: errores.join(', ') });
        }
        
        // Generar número único de factura
        const numeroFactura = `${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Date.now()}`;
        
        // Crear directorio si no existe
        const facturasDir = 'facturas';
        if (!existsSync(facturasDir)) {
            await mkdir(facturasDir);
        }
        
        // Guardar XML
        const xmlFilename = join(facturasDir, `${numeroFactura}.xml`);
        await writeFile(xmlFilename, data.xml);
        
        // Registrar generación exitosa
        await registrarOperacion('Factura generada exitosamente', {
            numeroFactura,
            cliente: data.cliente,
            email: data.email,
            total: data.totales.total,
            tipoDocumento: validarRUC(data.ruc).tipo,
            numeroAutorizacion: data.numeroAutorizacion,
            claveAcceso: data.claveAcceso
        });
        
        res.json({
            success: true,
            mensaje: 'Factura procesada exitosamente',
            numeroFactura,
            numeroAutorizacion: data.numeroAutorizacion,
            claveAcceso: data.claveAcceso
        });
        
    } catch (error) {
        await registrarOperacion('Error en el sistema', { error: error.message });
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});