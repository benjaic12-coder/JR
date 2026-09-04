// Sistema de Cliente
class ClientApp {
    constructor() {
        this.auth = auth;
        this.init();
    }

    init() {
        // Verificar que hay sesión activa
        const session = this.auth.getSession();
        if (!session || session.role !== 'client') {
            window.location.href = '../index.html';
            return;
        }

        // Mostrar información del cliente
        this.loadClientInfo();

        // Inicializar modal
        this.setupPasswordModal();
    }

    loadClientInfo() {
        const session = this.auth.getSession();
        const user = this.auth.getUser(session.userId);

        if (user) {
            // Header
            document.getElementById('clientName').textContent = user.name || user.username;
            document.getElementById('clientEmail').textContent = user.email;

            // Perfil
            document.getElementById('profileUsername').textContent = user.username;
            document.getElementById('profileEmail').textContent = user.email;

            // Actividad
            document.getElementById('lastLogin').textContent = new Date().toLocaleString('es-ES');
            document.getElementById('loginCount').textContent = Math.floor(Math.random() * 10) + 1;
        }
    }

    setupPasswordModal() {
        const modal = document.getElementById('passwordModal');
        const form = document.getElementById('passwordForm');

        form.addEventListener('submit', (e) => this.handlePasswordChange(e));

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closePasswordModal();
            }
        });
    }

    openChangePasswordModal() {
        document.getElementById('passwordModal').classList.add('show');
    }

    closePasswordModal() {
        document.getElementById('passwordModal').classList.remove('show');
        document.getElementById('passwordForm').reset();
    }

    handlePasswordChange(e) {
        e.preventDefault();

        const session = this.auth.getSession();
        const user = this.auth.getUser(session.userId);
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Verificar contraseña actual
        if (!this.auth.verifyPassword(currentPassword, user.password)) {
            alert('Contraseña actual incorrecta');
            return;
        }

        // Verificar que las contraseñas nuevas coinciden
        if (newPassword !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        // Verificar longitud mínima
        if (newPassword.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        // Actualizar contraseña
        this.auth.updateUser(session.userId, {
            password: this.auth.hashPassword(newPassword)
        });

        alert('Contraseña cambiada correctamente');
        this.closePasswordModal();
    }

    logout() {
        if (confirm('¿Desea cerrar sesión?')) {
            this.auth.logout();
        }
    }
}

// Inicializar la aplicación cliente
const clientApp = new ClientApp();