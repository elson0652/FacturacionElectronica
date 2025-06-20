# 🤝 Guía de Contribución - Sistema CIA-Hermanos

¡Gracias por tu interés en contribuir al Sistema de Facturación CIA-Hermanos! Esta guía te ayudará a entender cómo puedes participar en el desarrollo del proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)
- [Desarrollo Local](#desarrollo-local)
- [Estándares de Código](#estándares-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reconocimientos](#reconocimientos)

## 📜 Código de Conducta

Este proyecto se adhiere al [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). Al participar, se espera que mantengas este código. Por favor reporta comportamientos inaceptables a [soporte@cia-hermanos.com](mailto:soporte@cia-hermanos.com).

## 🚀 Cómo Contribuir

### Tipos de Contribuciones Bienvenidas

- 🐛 **Reportar bugs**
- 💡 **Sugerir nuevas funcionalidades**
- 📝 **Mejorar documentación**
- 🔧 **Corregir código**
- 🎨 **Mejorar diseño/UX**
- 🧪 **Agregar tests**
- 🌐 **Traducciones**

## 🐛 Reportar Bugs

### Antes de Reportar un Bug

1. **Verifica** que estás usando la versión más reciente
2. **Busca** en los [issues existentes](https://github.com/tu-usuario/sistema-facturacion-cia-hermanos/issues)
3. **Reproduce** el bug en un entorno limpio

### Cómo Reportar un Bug

Usa la [plantilla de bug report](https://github.com/tu-usuario/sistema-facturacion-cia-hermanos/issues/new?template=bug_report.md) e incluye:

- **Descripción clara** del problema
- **Pasos para reproducir** el bug
- **Comportamiento esperado** vs **comportamiento actual**
- **Screenshots** si es aplicable
- **Información del entorno**:
  - OS: [ej. Windows 10, macOS 12.0, Ubuntu 20.04]
  - Navegador: [ej. Chrome 96, Firefox 95, Safari 15]
  - Versión de Node.js: [ej. 18.12.0]

### Ejemplo de Reporte de Bug

```markdown
**Descripción del Bug**
El cálculo del IVA no se actualiza automáticamente cuando cambio la cantidad de productos.

**Pasos para Reproducir**
1. Agregar un producto con cantidad 1
2. Cambiar la cantidad a 5
3. Observar que el IVA sigue mostrando el valor para cantidad 1

**Comportamiento Esperado**
El IVA debería recalcularse automáticamente al cambiar la cantidad.

**Screenshots**
[Adjuntar screenshot del problema]

**Información del Entorno**
- OS: Windows 10
- Navegador: Chrome 96.0.4664.110
- Versión de Node.js: 18.12.0
```

## 💡 Sugerir Mejoras

### Antes de Sugerir una Mejora

1. **Verifica** que la funcionalidad no existe ya
2. **Busca** en los [issues existentes](https://github.com/tu-usuario/sistema-facturacion-cia-hermanos/issues)
3. **Considera** si la mejora beneficia a la mayoría de usuarios

### Cómo Sugerir una Mejora

Usa la [plantilla de feature request](https://github.com/tu-usuario/sistema-facturacion-cia-hermanos/issues/new?template=feature_request.md) e incluye:

- **Descripción clara** de la funcionalidad
- **Justificación** de por qué sería útil
- **Casos de uso** específicos
- **Posible implementación** (opcional)
- **Alternativas consideradas**

## 🛠️ Desarrollo Local

### Configuración del Entorno

1. **Fork** el repositorio
2. **Clona** tu fork:
```bash
git clone https://github.com/tu-usuario/sistema-facturacion-cia-hermanos.git
cd sistema-facturacion-cia-hermanos
```

3. **Instala** las dependencias:
```bash
npm install
```

4. **Crea** una rama para tu feature:
```bash
git checkout -b feature/mi-nueva-funcionalidad
```

5. **Inicia** el servidor de desarrollo:
```bash
npm run dev
```

### Estructura de Ramas

- `main`: Rama principal estable
- `develop`: Rama de desarrollo
- `feature/nombre-feature`: Nuevas funcionalidades
- `bugfix/nombre-bug`: Corrección de bugs
- `hotfix/nombre-hotfix`: Correcciones urgentes

## 📏 Estándares de Código

### JavaScript

#### Estilo de Código
```javascript
// ✅ Correcto
function calcularIVA(subtotal) {
    const IVA_RATE = 0.15;
    return subtotal * IVA_RATE;
}

// ❌ Incorrecto
function calculariva(subtotal){
    return subtotal*0.15;
}
```

#### Convenciones de Nomenclatura
- **Variables**: `camelCase`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Funciones**: `camelCase` con verbos descriptivos
- **Clases**: `PascalCase`

#### Comentarios
```javascript
/**
 * Genera el número de autorización del SRI según estándares ecuatorianos
 * @returns {string} Número de autorización de 49 dígitos
 */
function generarNumeroAutorizacionSRI() {
    // Estructura: AAAAMMDDHHMMSS + 35 dígitos adicionales
    const fecha = new Date();
    // ...
}
```

### HTML

#### Estructura Semántica
```html
<!-- ✅ Correcto -->
<section class="form-container">
    <h3>Información del Cliente</h3>
    <form id="clienteForm">
        <label for="ruc">RUC o Cédula:</label>
        <input type="text" id="ruc" required>
    </form>
</section>

<!-- ❌ Incorrecto -->
<div class="form-container">
    <div>Información del Cliente</div>
    <div>
        <div>RUC o Cédula:</div>
        <input type="text">
    </div>
</div>
```

### CSS

#### Organización
```css
/* ✅ Correcto - Organizado por componentes */
.company-header {
    background: linear-gradient(135deg, #4CAF50, #2196F3);
    color: white;
    padding: 20px;
    border-radius: 8px;
}

.company-header h1 {
    margin: 0;
    font-size: 28px;
    font-weight: bold;
}

/* ❌ Incorrecto - Desordenado */
.company-header { background: linear-gradient(135deg, #4CAF50, #2196F3); }
h1 { margin: 0; font-size: 28px; }
```

## 🔄 Proceso de Pull Request

### Antes de Enviar un PR

1. **Asegúrate** de que tu código sigue los estándares
2. **Ejecuta** las pruebas localmente
3. **Actualiza** la documentación si es necesario
4. **Verifica** que no hay conflictos con `main`

### Cómo Enviar un PR

1. **Push** tu rama al fork:
```bash
git push origin feature/mi-nueva-funcionalidad
```

2. **Crea** el Pull Request desde GitHub
3. **Completa** la plantilla de PR
4. **Asigna** reviewers apropiados

### Plantilla de Pull Request

```markdown
## Descripción
Breve descripción de los cambios realizados.

## Tipo de Cambio
- [ ] Bug fix (cambio que corrige un problema)
- [ ] Nueva funcionalidad (cambio que agrega funcionalidad)
- [ ] Breaking change (cambio que podría romper funcionalidad existente)
- [ ] Documentación (cambios solo en documentación)

## Cómo se ha Probado
Describe las pruebas realizadas para verificar los cambios.

## Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado mi código, especialmente en áreas difíciles de entender
- [ ] He realizado cambios correspondientes en la documentación
- [ ] Mis cambios no generan nuevas advertencias
- [ ] He agregado pruebas que demuestran que mi corrección es efectiva o que mi funcionalidad funciona
```

### Revisión de Código

#### Criterios de Revisión
- **Funcionalidad**: ¿El código hace lo que se supone que debe hacer?
- **Legibilidad**: ¿Es fácil de entender?
- **Mantenibilidad**: ¿Es fácil de modificar en el futuro?
- **Rendimiento**: ¿Hay impacto en el rendimiento?
- **Seguridad**: ¿Introduce vulnerabilidades?

#### Proceso de Revisión
1. **Revisión automática** por CI/CD
2. **Revisión por pares** (al menos 1 aprobación)
3. **Pruebas manuales** si es necesario
4. **Merge** a la rama principal

## 🧪 Testing

### Ejecutar Pruebas
```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas con coverage
npm run test:coverage

# Ejecutar pruebas en modo watch
npm run test:watch
```

### Escribir Pruebas
```javascript
// Ejemplo de test para función de validación
describe('validarRUC', () => {
    test('debe validar RUC de 13 dígitos correctamente', () => {
        const resultado = validarRUC('1234567890001');
        expect(resultado.valido).toBe(true);
        expect(resultado.tipo).toBe('RUC');
    });

    test('debe rechazar RUC con formato incorrecto', () => {
        const resultado = validarRUC('123456789');
        expect(resultado.valido).toBe(false);
    });
});
```

## 📚 Documentación

### Actualizar Documentación

Cuando agregues nuevas funcionalidades, asegúrate de actualizar:

- **README.md**: Funcionalidades principales
- **Comentarios en código**: Funciones complejas
- **Wiki**: Guías detalladas de uso
- **CHANGELOG.md**: Registro de cambios

### Estilo de Documentación

```markdown
## Función: generarFacturaCompleta()

### Descripción
Genera una factura completa en formato PDF y XML con numeración oficial del SRI.

### Parámetros
Ninguno (utiliza datos del formulario)

### Retorna
- `Promise<void>`: Promesa que se resuelve cuando la factura se genera exitosamente

### Ejemplo de Uso
```javascript
// Generar factura después de validar productos
if (productos.length > 0) {
    await generarFacturaCompleta();
}
```

### Errores Posibles
- `Error`: Si no hay productos agregados
- `ValidationError`: Si los datos del cliente son inválidos
```

## 🏆 Reconocimientos

### Tipos de Contribuciones Reconocidas

- 🐛 **Bug Reports**
- 💻 **Código**
- 📖 **Documentación**
- 🎨 **Diseño**
- 💡 **Ideas**
- 🤔 **Responder Preguntas**
- 👀 **Revisión de Código**
- 🧪 **Tests**
- 🌍 **Traducción**

### Hall of Fame

Los contribuidores destacados serán reconocidos en:
- README principal del proyecto
- Página de contribuidores
- Releases notes
- Redes sociales del proyecto

## 📞 Obtener Ayuda

### Canales de Comunicación

- **GitHub Issues**: Para bugs y feature requests
- **GitHub Discussions**: Para preguntas generales
- **Discord**: [Servidor de la comunidad](https://discord.gg/cia-hermanos)
- **Email**: [soporte@cia-hermanos.com](mailto:soporte@cia-hermanos.com)

### Preguntas Frecuentes

**P: ¿Puedo contribuir si soy principiante?**
R: ¡Absolutamente! Tenemos issues etiquetados como "good first issue" perfectos para comenzar.

**P: ¿Necesito conocimiento sobre el SRI de Ecuador?**
R: No es necesario, pero es útil. Tenemos documentación que explica los conceptos necesarios.

**P: ¿Cuánto tiempo toma que revisen mi PR?**
R: Generalmente entre 2-5 días hábiles, dependiendo de la complejidad.

---

¡Gracias por contribuir al Sistema de Facturación CIA-Hermanos! 🎉

Tu participación ayuda a crear una mejor herramienta para la comunidad empresarial ecuatoriana.