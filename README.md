# JR - Sistema de Gestión de Usuarios

Sistema completo de autenticación y gestión de usuarios con panel administrativo e interfaz para clientes.

## 🎯 Características

### Panel de Administrador
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gestión completa de usuarios (crear, editar, eliminar)
- ✅ Reportes y análisis de actividad
- ✅ Configuración del sistema
- ✅ Backup de datos
- ✅ Control de seguridad

### Panel de Cliente
- ✅ Visualización de perfil personal
- ✅ Cambio de contraseña
- ✅ Historial de accesos
- ✅ Información de servicios
- ✅ Contacto con soporte

### Sistema de Autenticación
- ✅ Login seguro con roles
- ✅ Gestión de sesiones
- ✅ Almacenamiento local de datos
- ✅ Control de acceso basado en roles (RBAC)

## 📁 Estructura del Proyecto

```
JR/
├── index.html                 # Página de login principal
├── css/
│   └── style.css             # Estilos principales
├── js/
│   └── auth.js               # Sistema de autenticación
├── admin/
│   ├── dashboard.html        # Panel de administrador
│   └── admin.js              # Lógica del admin
├── client/
│   ├── dashboard.html        # Panel de cliente
│   └── client.js             # Lógica del cliente
└── README.md                 # Este archivo
```

## 🚀 Cómo Usar

### 1. Acceder al Sistema

Abre `index.html` en tu navegador y verás la pantalla de login.

### 2. Credenciales de Prueba

**Administrador:**
- Usuario: `admin`
- Contraseña: `admin123`
- Rol: Administrador

**Cliente:**
- Usuario: `cliente1`
- Contraseña: `cliente123`
- Rol: Cliente

### 3. Panel de Administrador

Una vez logueado como admin, tendrás acceso a:
- **Dashboard**: Vista general del sistema
- **Usuarios**: Crear, editar, eliminar usuarios
- **Reportes**: Estadísticas de uso
- **Configuración**: Parámetros del sistema

### 4. Panel de Cliente

Los clientes pueden:
- Ver su información de perfil
- Cambiar su contraseña
- Ver historial de accesos
- Contactar soporte

## 🔐 Seguridad

- Las contraseñas se almacenan en Base64 (en desarrollo)
- Las sesiones se almacenan en localStorage
- Validación de roles en cada página
- Protección contra accesos no autorizados

**⚠️ NOTA:** En producción, implementar:
- Cifrado bcrypt o Argon2 para contraseñas
- Base de datos segura (no localStorage)
- HTTPS obligatorio
- Autenticación 2FA
- Rate limiting

## 🛠️ Desarrollo

### Agregar Nuevo Usuario Programáticamente

```javascript
const result = auth.register('usuario', 'password', 'email@example.com', 'client');
if (result.success) {
    console.log('Usuario creado:', result.user);
}
```

### Obtener Sesión Actual

```javascript
const session = auth.getSession();
console.log(session.username, session.role);
```

### Verificar Autenticación

```javascript
if (!auth.isSessionValid()) {
    window.location.href = 'index.html';
}
```

## 📊 API del Sistema de Autenticación

### Métodos Principales

- `register(username, password, email, role)` - Registrar nuevo usuario
- `getSession()` - Obtener sesión actual
- `isSessionValid()` - Verificar sesión activa
- `logout()` - Cerrar sesión
- `updateUser(userId, updates)` - Actualizar usuario
- `deleteUser(userId)` - Eliminar usuario
- `getAllUsers()` - Obtener todos los usuarios
- `getClientUsers()` - Obtener solo clientes

## 🎨 Temas de Color

- **Primario:** #667eea (Púrpura)
- **Secundario:** #764ba2 (Púrpura oscuro)
- **Éxito:** #27ae60 (Verde)
- **Peligro:** #e74c3c (Rojo)
- **Info:** #3498db (Azul)

## 📱 Responsividad

El sistema es totalmente responsive y funciona en:
- Escritorio (1920x1080+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🐛 Troubleshooting

**P: No puedo acceder al panel admin**
R: Verifica que estés usando el usuario `admin` y rol `Administrador`

**P: Se perdieron mis datos**
R: Los datos se guardan en localStorage del navegador. Borra cookies = pierdes datos.

**P: Las sesiones expiran muy rápido**
R: Puedes cambiar el timeout en Configuración > Seguridad

## 📝 Versión

**v1.0.0** - Versión inicial
- Autenticación básica
- Panel admin completo
- Panel cliente
- Gestión de usuarios

## 👨‍💻 Autor

Desarrollado como sistema de gestión de usuarios completo.

## 📄 Licencia

Proyecto de demostración - Libre para modificar y distribuir.

---

**¿Necesitas ayuda?** Contacta con soporte@jr.com