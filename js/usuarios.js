let users = [
    { id: 1, name: 'John Doe', role: 'Administrador', email: 'johndoe@adminshop.cl' },
];


const tableBody = document.getElementById('usersTableBody');
const modal = document.getElementById('userModal');
const form = document.getElementById('userForm');
const userNameInput = document.getElementById('userName');
const userRoleSelect = document.getElementById('userRole');
const userEmailInput = document.getElementById('userEmail');
const emailHelp = document.getElementById('emailHelp');
const userIdInput = document.getElementById('userId');
const modalTitle = document.getElementById('modalTitle');

function renderTable() {
    tableBody.innerHTML = '';
    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="px-6 py-4 text-gray-800 dark:text-gray-200">${user.name}</td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'Administrador' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}">
                    ${user.role}
                </span>
            </td>
            <td class="px-6 py-4 text-gray-600 dark:text-gray-400">${user.email}</td>
            <td class="px-6 py-4 flex gap-2">
                <button onclick="editUser(${user.id})" class="text-blue-500 hover:text-blue-700 font-medium">Editar</button>
                <button onclick="deleteUser(${user.id})" class="text-red-500 hover:text-red-700 font-medium">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function updateEmailLogic() {
    const role = userRoleSelect.value;
    const name = userNameInput.value.trim().toLowerCase().replace(/\s+/g, '.');

    if (role === 'Administrador') {
        userEmailInput.value = name ? `${name}@adminshop.cl` : '@adminshop.cl';
        userEmailInput.readOnly = true;
        userEmailInput.classList.add('bg-gray-100', 'cursor-not-allowed');
        emailHelp.classList.remove('hidden');
    } else {
        if(userEmailInput.value.includes('@adminshop.cl')) userEmailInput.value = '';
        userEmailInput.readOnly = false;
        userEmailInput.classList.remove('bg-gray-100', 'cursor-not-allowed');
        emailHelp.classList.add('hidden');
    }
}


userNameInput.addEventListener('input', updateEmailLogic);
userRoleSelect.addEventListener('change', updateEmailLogic);


window.openModal = function(id = null) {
    modal.classList.remove('hidden');
    
    if (id) {
        const user = users.find(u => u.id === id);
        modalTitle.innerText = 'Editar Usuario';
        userIdInput.value = user.id;
        userNameInput.value = user.name;
        userRoleSelect.value = user.role;
        userEmailInput.value = user.email;
        updateEmailLogic();
    } else {
        modalTitle.innerText = 'Crear Usuario';
        form.reset();
        userIdInput.value = '';
        updateEmailLogic();
    }
}

window.closeModal = function() {
    modal.classList.add('hidden');
    form.reset();
    userIdInput.value = '';
}


window.editUser = function(id) {
    openModal(id);
}

window.deleteUser = function(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        users = users.filter(user => user.id !== id);
        renderTable();
    }
}


form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = userIdInput.value;
    const newUser = {
        id: id ? parseInt(id) : Date.now(), 
        name: userNameInput.value,
        role: userRoleSelect.value,
        email: userEmailInput.value
    };

    if (id) {
        const index = users.findIndex(u => u.id === parseInt(id));
        if (index !== -1) {
            users[index] = newUser;
        }
    } else {
        users.push(newUser);
    }

    closeModal();
    renderTable();
});


renderTable();