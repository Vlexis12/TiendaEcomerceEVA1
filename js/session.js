document.addEventListener('DOMContentLoaded', () => {
    const session = JSON.parse(localStorage.getItem('usuarioLogueado') || 'null');
    const accountLinks = document.querySelectorAll('[data-session-account]');
    const logoutButtons = document.querySelectorAll('[data-session-logout]');

    accountLinks.forEach(link => {
        if (session) {
            link.textContent = session.nombre;
            link.href = session.rol === 'admin' ? 'admin/home.html' : 'index.html';
            link.classList.remove('hidden');
        } else {
            link.textContent = 'Ingresar';
            link.href = 'login.html';
            link.classList.remove('hidden');
        }
    });

    logoutButtons.forEach(button => {
        button.classList.toggle('hidden', !session);
        button.addEventListener('click', () => {
            localStorage.removeItem('usuarioLogueado');
            window.location.href = 'index.html';
        });
    });
});
