// Sistema de Autenticación y Base de Datos Local
class AuthSystem {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = null;
        this.init();
    }

    init() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Si ya hay sesión activa, redirigir
        const session = this.getSession();
        if (session) {
            this.redirectDashboard(session.role);
        }
    }

    loadUsers() {
        const defaultUsers = [
            {
                id: 1,
                username: 'admin',
                password: this.hashPassword('admin123'), // En producción usar bcrypt
                role: 'admin',
                email: 'admin@jr.com',
                name: 'Administrador'
            },
            {
                id: 2,
                username: 'cliente1',
                password: this.hashPassword('cliente123'),
                role: 'client',
                email: 'cliente@example.com',
                name: 'Cliente Ejemplo'
            }
        ];

        const stored = localStorage.getItem('jr_users');
        return stored ? JSON.parse(stored) : defaultUsers;
    }

    hashPassword(password) {
        // Simple hash (en producción usar bcrypt o argon2)
        return btoa(password);
    }

    verifyPassword(password, hash) {
        return btoa(password) === hash;
    }

    handleLogin(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        const user = this.users.find(u => u.username === username && u.role === role);

        if (!user) {
            this.showError('Usuario o contraseña incorrectos');
            return;
        }

        if (!this.verifyPassword(password, user.password)) {
            this.showError('Usuario o contraseña incorrectos');
            return;
        }

        // Crear sesión
        const sessionData = {
            userId: user.id,
            username: user.username,
            role: user.role,
            name: user.name,
            email: user.email,
            loginTime: new Date().toISOString(),
            token: this.generateToken()
        };

        localStorage.setItem('jr_session', JSON.stringify(sessionData));
        this.currentUser = sessionData;

        // Redirigir según el rol
        this.redirectDashboard(role);
    }

    generateToken() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    getSession() {
        const session = localStorage.getItem('jr_session');
        return session ? JSON.parse(session) : null;
    }

    isSessionValid() {
        const session = this.getSession();
        return session && session.token;
    }

    logout() {
        localStorage.removeItem('jr_session');
        window.location.href = '../index.html';
    }

    redirectDashboard(role) {
        if (role === 'admin') {
            window.location.href = 'admin/dashboard.html';
        } else if (role === 'client') {
            window.location.href = 'client/dashboard.html';
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.add('show');
            setTimeout(() => {
                errorDiv.classList.remove('show');
            }, 5000);
        }
    }

    register(username, password, email, role = 'client') {
        if (this.users.find(u => u.username === username)) {
            return { success: false, message: 'Usuario ya existe' };
        }

        const newUser = {
            id: this.users.length + 1,
            username: username,
            password: this.hashPassword(password),
            role: role,
            email: email,
            name: username,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('jr_users', JSON.stringify(this.users));

        return { success: true, message: 'Usuario registrado', user: newUser };
    }

    saveUsers() {
        localStorage.setItem('jr_users', JSON.stringify(this.users));
    }

    getUser(userId) {
        return this.users.find(u => u.id === userId);
    }

    updateUser(userId, updates) {
        const user = this.getUser(userId);
        if (user) {
            Object.assign(user, updates);
            this.saveUsers();
            return user;
        }
        return null;
    }

    deleteUser(userId) {
        this.users = this.users.filter(u => u.id !== userId);
        this.saveUsers();
        return true;
    }

    getAllUsers() {
        return this.users;
    }

    getClientUsers() {
        return this.users.filter(u => u.role === 'client');
    }
}

// Inicializar el sistema
const auth = new AuthSystem();