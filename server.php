<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

function registrarOperacion($operacion, $detalles = []) {
    $logFile = 'bitacora.log';
    $timestamp = date('Y-m-d H:i:s');
    $ip = $_SERVER['REMOTE_ADDR'];
    $detallesStr = json_encode($detalles);
    $logEntry = "[{$timestamp}] IP: {$ip} - {$operacion} - Detalles: {$detallesStr}\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND);
}

function validarFactura($data) {
    $errores = [];
    
    if (!isset($data['ruc']) || !preg_match('/^\d{13}$/', $data['ruc'])) {
        $errores[] = 'RUC inválido - debe tener 13 dígitos';
    }
    
    if (empty($data['cliente'])) {
        $errores[] = 'El nombre del cliente es requerido';
    }
    
    if (empty($data['direccion'])) {
        $errores[] = 'La dirección es requerida';
    }
    
    if (empty($data['productos'])) {
        $errores[] = 'Debe incluir al menos un producto';
    }
    
    return $errores;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Registrar intento de generación de factura
        registrarOperacion('Inicio de generación de factura', [
            'cliente' => $data['cliente'],
            'ruc' => $data['ruc']
        ]);
        
        $errores = validarFactura($data);
        
        if (!empty($errores)) {
            registrarOperacion('Error de validación', ['errores' => $errores]);
            http_response_code(400);
            echo json_encode(['error' => implode(', ', $errores)]);
            exit;
        }
        
        // Generar número único de factura
        $numeroFactura = date('Ymd') . '-' . uniqid();
        
        // Crear directorio si no existe
        if (!file_exists('facturas')) {
            mkdir('facturas', 0777, true);
        }
        
        // Guardar XML
        $xmlFilename = "facturas/{$numeroFactura}.xml";
        file_put_contents($xmlFilename, $data['xml']);
        
        // Registrar generación exitosa
        registrarOperacion('Factura generada exitosamente', [
            'numeroFactura' => $numeroFactura,
            'cliente' => $data['cliente'],
            'total' => $data['totales']['total']
        ]);
        
        echo json_encode([
            'success' => true,
            'mensaje' => 'Factura procesada exitosamente',
            'numeroFactura' => $numeroFactura
        ]);
        
    } catch (Exception $e) {
        registrarOperacion('Error en el sistema', ['error' => $e->getMessage()]);
        http_response_code(500);
        echo json_encode(['error' => 'Error interno del servidor']);
    }
} else {
    registrarOperacion('Método no permitido', ['method' => $_SERVER['REQUEST_METHOD']]);
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}
?>