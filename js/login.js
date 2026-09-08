document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('login-email').value.trim();
            const passwordInput = document.getElementById('login-password').value.trim();

            loginError.classList.add('hidden');

            // 1. Obtener base de datos de usuarios del LocalStorage
            const defaultAdmin = {
                id: 1,
                name: 'Jhon Doe',
                role: 'Administrador',
                email: 'jhon.doe@adminshop.cl',
                password: 'admin123'
            };
            const storedUsers = JSON.parse(localStorage.getItem('store_users') || 'null');
            const users = Array.isArray(storedUsers) && storedUsers.length ? storedUsers : [defaultAdmin];
            if (!storedUsers?.length) {
                localStorage.setItem('store_users', JSON.stringify(users));
            }

            // 2. Buscar si existe coincidencia de correo y contraseña
            const userMatch = users.find(user => user.email === emailInput && user.password === passwordInput);

            if (userMatch) {
                const esAdmin = userMatch.role === 'Administrador';
                const userData = {
                    nombre: userMatch.name,
                    email: userMatch.email,
                    rol: esAdmin ? 'admin' : 'usuario'
                };
                
                localStorage.setItem('usuarioLogueado', JSON.stringify(userData));
                
                alert(`¡Bienvenido ${userData.nombre}!`);
                
                if (esAdmin) {
                    window.location.href = 'admin/home.html';
                } else {
                    window.location.href = 'index.html';
                }
                return;
            }

            loginError.classList.remove('hidden');
            loginError.innerText = 'Correo o contraseña incorrectos.';
        });
    }
});