const USERS_KEY = 'store_users';
const SESSION_KEY = 'usuarioLogueado';

const defaultUsers = [
    { id: 1, name: 'Jhon Doe', role: 'Administrador', email: 'jhon.doe@adminshop.cl', password: 'admin123' },
];

export function getUsers() {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored === null) {
        saveUsers(defaultUsers);
        return [...defaultUsers];
    }

    const users = JSON.parse(stored);
    if (!Array.isArray(users)) {
        throw new Error('No se pudo leer la lista de usuarios guardada.');
    }
    if (users.length === 0) {
        saveUsers(defaultUsers);
        return [...defaultUsers];
    }
    return users;
}

export function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession() {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored === null) return null;

    const session = JSON.parse(stored);
    return session && typeof session === 'object' ? session : null;
}

export function findUserByEmail(users, email) {
    const normalizedEmail = email.trim().toLowerCase();
    return users.find((user) => user.email?.trim().toLowerCase() === normalizedEmail);
}

export function getCurrentUser() {
    const session = getSession();
    if (!session?.email) return null;
    return findUserByEmail(getUsers(), session.email) || null;
}

export function saveUserSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
        nombre: user.name,
        email: user.email,
        rol: user.role === 'Administrador' ? 'admin' : 'usuario',
    }));
}

export function createAdminEmail(name) {
    const normalizedName = name.trim().toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '.')
        .replace(/^\.|\.$/g, '');
    return normalizedName ? `${normalizedName}@adminshop.cl` : '';
}
