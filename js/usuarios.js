const STORAGE_KEY = 'store_users';
const defaultUsers = [{ id: 1, name: 'Alexis Rozas', role: 'Administrador', email: 'alexis.rozas@adminshop.cl' }];
let users = loadUsers();

const tableBody = document.getElementById('usersTableBody');
const modal = document.getElementById('userModal');
const form = document.getElementById('userForm');
const userNameInput = document.getElementById('userName');
const userRoleSelect = document.getElementById('userRole');
const userEmailInput = document.getElementById('userEmail');
const userIdInput = document.getElementById('userId');
const modalTitle = document.getElementById('modalTitle');
const searchInput = document.getElementById('searchUsers');
const totalUsers = document.getElementById('totalUsers');

function loadUsers() {
    const storedUsers = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (Array.isArray(storedUsers) && storedUsers.length) return storedUsers;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
    return [...defaultUsers];
}

function saveUsers() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function createEmail(name) {
    const normalizedName = name.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '');
    return normalizedName ? `${normalizedName}@adminshop.cl` : '';
}

function initials(name) {
    return name.split(' ').filter(Boolean).slice(0, 2).map(word => word[0]).join('').toUpperCase();
}

function renderTable() {
    const query = searchInput.value.trim().toLowerCase();
    const visibleUsers = users.filter(user => `${user.name} ${user.email}`.toLowerCase().includes(query));
    tableBody.innerHTML = '';
    totalUsers.textContent = users.length;

    if (!visibleUsers.length) {
        tableBody.innerHTML = '<tr><td colspan="4" class="px-5 py-12 text-center text-sm text-slate-500">No encontramos usuarios con esa búsqueda.</td></tr>';
        return;
    }

    visibleUsers.forEach(user => {
        const row = document.createElement('tr');
        row.className = 'transition hover:bg-slate-50';
        row.innerHTML = `<td class="px-5 py-4"><div class="flex items-center gap-3"><span class="grid h-10 w-10 place-items-center rounded-full bg-lime-100 text-xs font-bold text-lime-800">${initials(user.name)}</span><span class="font-semibold text-slate-800">${user.name}</span></div></td><td class="px-5 py-4"><span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">${user.role}</span></td><td class="px-5 py-4 text-sm text-slate-500">${user.email}</td><td class="px-5 py-4"><div class="flex justify-end gap-2"><button type="button" onclick="editUser(${user.id})" class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">Editar</button><button type="button" onclick="deleteUser(${user.id})" class="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50">Eliminar</button></div></td>`;
        tableBody.appendChild(row);
    });
}

function updateEmail() {
    userEmailInput.value = createEmail(userNameInput.value);
}

window.openModal = function (id = null) {
    form.reset();
    userIdInput.value = '';
    if (id !== null) {
        const user = users.find(item => item.id === id);
        if (!user) return;
        modalTitle.textContent = 'Editar usuario';
        userIdInput.value = user.id;
        userNameInput.value = user.name;
        userRoleSelect.value = user.role;
        userEmailInput.value = user.email;
    } else {
        modalTitle.textContent = 'Crear usuario';
        updateEmail();
    }
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    userNameInput.focus();
};

window.closeModal = function () {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
};

window.editUser = id => openModal(id);
window.deleteUser = function (id) {
    if (users.length === 1) {
        alert('Debe existir al menos un administrador activo.');
        return;
    }
    const user = users.find(item => item.id === id);
    if (!user || !confirm(`¿Eliminar el acceso de ${user.name}?`)) return;
    users = users.filter(item => item.id !== id);
    saveUsers();
    renderTable();
};

userNameInput.addEventListener('input', updateEmail);
searchInput.addEventListener('input', renderTable);
form.addEventListener('submit', event => {
    event.preventDefault();
    const id = Number(userIdInput.value);
    const user = { id: id || Date.now(), name: userNameInput.value.trim(), role: userRoleSelect.value, email: createEmail(userNameInput.value) };
    if (id) users = users.map(item => item.id === id ? user : item);
    else users.push(user);
    saveUsers();
    closeModal();
    renderTable();
});

renderTable();
