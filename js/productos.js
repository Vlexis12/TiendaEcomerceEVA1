 function getProducts() {
            let products = localStorage.getItem('store_products');
            if (!products) {
                products = [
                    { id: 1, name: 'Zapatillas Deportivas', price: 59.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
                    { id: 2, name: 'Reloj Inteligente', price: 129.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
                    { id: 3, name: 'Mochila Urbana', price: 45.00, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' }
                ];
                localStorage.setItem('store_products', JSON.stringify(products));
            }
            return JSON.parse(products);
        }

        function saveProducts(products) {
            localStorage.setItem('store_products', JSON.stringify(products));
        }

        function renderTable() {
            const products = getProducts();
            const tbody = document.getElementById('product-table-body');
            tbody.innerHTML = '';

            if (products.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-gray-500">No hay productos registrados.</td></tr>`;
                return;
            }

            products.forEach(p => {
                tbody.innerHTML += `
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td class="p-4"><img src="${p.image}" class="w-12 h-12 object-cover rounded-md" alt="${p.name}"></td>
                        <td class="p-4 font-medium">${p.name}</td>
                        <td class="p-4">$${Number(p.price).toFixed(2)}</td>
                        <td class="p-4 text-center space-x-2">
                            <button onclick="editProduct(${p.id})" class="px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 text-sm">Editar</button>
                            <button onclick="deleteProduct(${p.id})" class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        }

        // Crear o Actualizar Producto
        document.getElementById('product-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const id = document.getElementById('product-id').value;
            const name = document.getElementById('name').value;
            const price = parseFloat(document.getElementById('price').value);
            const image = document.getElementById('image').value;

            let products = getProducts();

            if (id) {
                // Editar
                products = products.map(p => p.id == id ? { id: Number(id), name, price, image } : p);
            } else {
                // Crear nuevo
                const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
                products.push({ id: newId, name, price, image });
            }

            saveProducts(products);
            renderTable();
            resetForm();
        });

        function editProduct(id) {
            const products = getProducts();
            const p = products.find(prod => prod.id == id);
            if (p) {
                document.getElementById('product-id').value = p.id;
                document.getElementById('name').value = p.name;
                document.getElementById('price').value = p.price;
                document.getElementById('image').value = p.image;
                document.getElementById('form-title').innerText = 'Editar Producto';
                document.getElementById('btn-save').innerText = 'Actualizar';
                document.getElementById('btn-cancel').classList.remove('hidden');
            }
        }

        function deleteProduct(id) {
            if (confirm('¿Estás seguro de eliminar este producto? Se borrará automáticamente del catálogo de la tienda.')) {
                let products = getProducts();
                products = products.filter(p => p.id !== id);
                saveProducts(products);
                renderTable();
            }
        }

        function resetForm() {
            document.getElementById('product-form').reset();
            document.getElementById('product-id').value = '';
            document.getElementById('form-title').innerText = 'Agregar Nuevo Producto';
            document.getElementById('btn-save').innerText = 'Guardar';
            document.getElementById('btn-cancel').classList.add('hidden');
        }

        renderTable();