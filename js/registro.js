document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const regError = document.getElementById('regError');
    const regPhone = document.getElementById('regPhone');

    if (regPhone) {
        regPhone.type = 'text'; 
        regPhone.addEventListener('input', function (e) {
            let valor = e.target.value.replace(/\D/g, '').substring(0, 9); 
            
            if (valor.length > 5) {
                valor = valor.replace(/^(\d{1})(\d{4})(\d{1,4})/, '$1 $2 $3');
            } else if (valor.length > 1) {
                valor = valor.replace(/^(\d{1})(\d{1,4})/, '$1 $2');
            }
            e.target.value = valor;
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('regName').value.trim();
            const lastName = document.getElementById('regLastName').value.trim();
            const email = document.getElementById('regEmail').value.trim().toLowerCase(); 
            const password = document.getElementById('regPassword').value.trim();
            const confirmPassword = document.getElementById('regConfirmPassword').value.trim();
            
            const phoneVal = regPhone ? regPhone.value.replace(/\D/g, '') : '';

            regError.classList.add('hidden');

            const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
            const esDominioValido = dominiosPermitidos.some(dominio => email.endsWith(dominio));
            
            if (!esDominioValido) {
                regError.textContent = 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.';
                regError.classList.remove('hidden');
                return;
            }

            if (phoneVal.length > 0 && phoneVal.length < 9) {
                regError.textContent = 'El teléfono debe tener 9 dígitos (Ej: 9 1234 5678).';
                regError.classList.remove('hidden');
                return;
            }

            if (password.length < 6) {
                regError.textContent = 'La contraseña debe tener al menos 6 caracteres.';
                regError.classList.remove('hidden');
                return;
            }

            if (password !== confirmPassword) {
                regError.textContent = 'Las contraseñas no coinciden.';
                regError.classList.remove('hidden');
                return;
            }

            const STORAGE_KEY = 'store_users';
            const defaultUsers = [{ id: 1, name: 'Jhon Die', role: 'Administrador', email: 'jhon.die@adminshop.cl', password: 'admin123' }];
            
            let users = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (!Array.isArray(users) || users.length === 0) {
                users = [...defaultUsers];
            }

            const emailExists = users.some(user => user.email === email);
            if (emailExists) {
                regError.textContent = 'El correo electrónico ya se encuentra registrado.';
                regError.classList.remove('hidden');
                return;
            }

            const newUser = {
                id: Date.now(),
                name: `${name} ${lastName}`,
                role: 'Usuario',
                email: email,
                password: password,
                phone: regPhone ? regPhone.value : '' 
            };

            users.push(newUser);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

            const sessionData = {
                nombre: name,
                email: email,
                rol: 'usuario'
            };
            localStorage.setItem('usuarioLogueado', JSON.stringify(sessionData));

            alert('¡Cuenta creada exitosamente!');
            window.location.href = 'index.html';
        });
    }
});