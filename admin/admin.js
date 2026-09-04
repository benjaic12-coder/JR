// Sistema de Administración
class AdminApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.auth = auth;
        this.init();
    }

    init() {
        // Verificar que es admin
        const session = this.auth.getSession();
        if (!session || session.role !== 'admin') {
            window.location.href = '../index.html';
            return;
        }

        // Mostrar información del usuario
        document.getElementById('userName').textContent = session.name || session.username;

        // Inicializar eventos
        this.setupNavigation();
        this.loadDashboard();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.switchSection(section);

                // Actualizar navegación activa
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Manejo del modal
        const modal = document.getElementById('userModal');
        const userForm = document.getElementById('userForm');
        
        userForm.addEventListener('submit', (e) => this.handleUserFormSubmit(e));

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeUserModal();
            }
        });
    }

    switchSection(section) {
        this.currentSection = section;

        // Ocultar todas las secciones
        document.querySelectorAll('.content-section').forEach(s => {
            s.classList.remove('active');
        });

        // Mostrar la sección seleccionada
        const selectedSection = document.getElementById(section);
        if (selectedSection) {
            selectedSection.classList.add('active');
            document.getElementById('pageTitle').textContent = this.getSectionTitle(section);
        }

        // Cargar datos según la sección
        if (section === 'dashboard') {
            this.loadDashboard();
        } else if (section === 'usuarios') {
            this.loadUsers();
        } else if (section === 'reportes') {
            this.loadReports();
        }
    }

    getSectionTitle(section) {
        const titles = {
            'dashboard': 'Dashboard',
            'usuarios': 'Gestión de Usuarios',
            'reportes': 'Reportes y Estadísticas',
            'configuracion': 'Configuración'
        };
        return titles[section] || 'Sección';
    }

    loadDashboard() {
        const users = this.auth.getAllUsers();
        const clients = users.filter(u => u.role === 'client');

        document.getElementById('totalUsers').textContent = users.length;
        document.getElementById('activeClients').textContent = clients.length;
        document.getElementById('activeSessions').textContent = '1'; // Simplificado

        // Llenar tabla de usuarios recientes
        const tbody = document.getElementById('recentUsersTable');
        tbody.innerHTML = '';

        users.slice(0, 5).forEach(user => {
            const createdAt = user.createdAt || new Date().toLocaleDateString();
            tbody.innerHTML += `
                <tr>
                    <td><strong>${user.username}</strong></td>
                    <td>${user.email}</td>
                    <td><span style="background: ${user.role === 'admin' ? '#e74c3c' : '#27ae60'}; color: white; padding: 4px 8px; border-radius: 3px; font-size: 12px;">${user.role}</span></td>
                    <td>${createdAt}</td>
                    <td>
                        <button class="btn-small btn-edit" onclick="adminApp.editUser(${user.id})">Editar</button>
                        <button class="btn-small btn-delete" onclick="adminApp.deleteUserConfirm(${user.id})">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    }

    loadUsers() {
        const users = this.auth.getAllUsers();
        const tbody = document.getElementById('usersTable');
        tbody.innerHTML = '';

        users.forEach(user => {
            const createdAt = user.createdAt || 'N/A';
            tbody.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td><strong>${user.username}</strong></td>
                    <td>${user.email}</td>
                    <td><span style="background: ${user.role === 'admin' ? '#e74c3c' : '#27ae60'}; color: white; padding: 4px 8px; border-radius: 3px; font-size: 12px;">${user.role}</span></td>
                    <td>${createdAt}</td>
                    <td>
                        <button class="btn-small btn-edit" onclick="adminApp.editUser(${user.id})">Editar</button>
                        <button class="btn-small btn-delete" onclick="adminApp.deleteUserConfirm(${user.id})">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    }

    loadReports() {
        // Datos simulados para reportes
        document.getElementById('accessesToday').textContent = Math.floor(Math.random() * 50) + 10;
        document.getElementById('newUsersWeek').textContent = Math.floor(Math.random() * 10) + 1;
        document.getElementById('activityRate').textContent = Math.floor(Math.random() * 30) + 70 + '%';
    }

    openUserModal() {
        document.getElementById('modalTitle').textContent = 'Nuevo Usuario';
        document.getElementById('userForm').reset();
        document.getElementById('userModal').classList.add('show');
        document.getElementById('modalPassword').style.display = 'block';
    }

    closeUserModal() {
        document.getElementById('userModal').classList.remove('show');
    }

    handleUserFormSubmit(e) {
        e.preventDefault();

        const username = document.getElementById('modalUsername').value;
        const email = document.getElementById('modalEmail').value;
        const password = document.getElementById('modalPassword').value;
        const role = document.getElementById('modalRole').value;

        const result = this.auth.register(username, password, email, role);

        if (result.success) {
            alert('Usuario creado correctamente');
            this.closeUserModal();
            this.loadUsers();
            this.loadDashboard();
        } else {
            alert(result.message);
        }
    }

    editUser(userId) {
        const user = this.auth.getUser(userId);
        if (user) {
            document.getElementById('modalTitle').textContent = `Editar: ${user.username}`;
            document.getElementById('modalUsername').value = user.username;
            document.getElementById('modalEmail').value = user.email;
            document.getElementById('modalPassword').value = '';
            document.getElementById('modalRole').value = user.role;
            document.getElementById('modalPassword').placeholder = 'Dejar en blanco para no cambiar';
            document.getElementById('userModal').classList.add('show');
            
            // Cambiar el comportamiento del formulario para editar
            const form = document.getElementById('userForm');
            form.onsubmit = (e) => this.handleEditUserSubmit(e, userId);
        }
    }

    handleEditUserSubmit(e, userId) {
        e.preventDefault();
        const email = document.getElementById('modalEmail').value;
        const role = document.getElementById('modalRole').value;
        const password = document.getElementById('modalPassword').value;

        const updates = { email, role };
        if (password) {
            updates.password = this.auth.hashPassword(password);
        }

        this.auth.updateUser(userId, updates);
        alert('Usuario actualizado');
        this.closeUserModal();
        this.loadUsers();
        this.loadDashboard();

        // Restaurar comportamiento normal
        const form = document.getElementById('userForm');
        form.onsubmit = (e) => this.handleUserFormSubmit(e);
    }

    deleteUserConfirm(userId) {
        if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
            this.auth.deleteUser(userId);
            alert('Usuario eliminado');
            this.loadUsers();
            this.loadDashboard();
        }
    }

    saveSettings() {
        const settings = {
            requireSSL: document.getElementById('requireSSL').checked,
            enable2FA: document.getElementById('enable2FA').checked,
            sessionTimeout: document.getElementById('sessionTimeout').value
        };
        localStorage.setItem('jr_settings', JSON.stringify(settings));
        alert('Configuración guardada');
    }

    backupData() {
        const backup = {
            users: this.auth.getAllUsers(),
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };

        const dataStr = JSON.stringify(backup, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `jr_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    logout() {
        if (confirm('¿Desea cerrar sesión?')) {
            this.auth.logout();
        }
    }
}

// Inicializar la aplicación admin
const adminApp = new AdminApp();