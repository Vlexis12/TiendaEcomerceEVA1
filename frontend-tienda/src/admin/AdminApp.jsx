import { useEffect, useMemo, useState } from 'react';
import { formatCLP, getProducts, saveProducts } from '../data/db';
import { getPurchases } from '../data/purchases';
import './AdminApp.css';
import {
    createAdminEmail,
    findUserByEmail,
    getCurrentUser,
    getSession,
    getUsers,
    saveUsers,
} from '../data/users';

const adminPaths = {
    dashboard: '/admin',
    users: '/admin/usuarios',
    products: '/admin/productos',
    purchases: '/admin/compras',
};

const inputClass = 'w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100';
const buttonClass = 'rounded-xl bg-[#111827] px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 active:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2';

function AdminApp() {
    const [session, setSession] = useState(() => getSession());
    const activeUser = getCurrentUser();
    const activeUserRole = activeUser?.role;
    const pathname = window.location.pathname;

    useEffect(() => {
        if (!session) {
            window.location.replace('/login');
        } else if (!activeUserRole) {
            localStorage.removeItem('usuarioLogueado');
            window.location.replace('/login');
        } else if (activeUserRole !== 'Administrador') {
            window.location.replace('/');
        }
    }, [activeUserRole, session]);

    if (!session || !activeUser || activeUserRole !== 'Administrador') return null;

    const currentPage = pathname === '/admin/usuarios'
        ? 'users'
        : pathname === '/admin/productos'
            ? 'products'
            : pathname === '/admin/compras'
                ? 'purchases'
            : 'dashboard';

    return (
        <AdminShell page={currentPage} session={session}>
            {currentPage === 'users' && <UsersPage session={session} setSession={setSession} />}
            {currentPage === 'products' && <ProductsPage />}
            {currentPage === 'purchases' && <PurchasesPage />}
            {currentPage === 'dashboard' && <DashboardPage session={session} />}
        </AdminShell>
    );
}

function AdminShell({ page, session, children }) {
    const logout = () => {
        localStorage.removeItem('usuarioLogueado');
        window.location.assign('/login');
    };

    const links = [
        { key: 'dashboard', label: 'Dashboard', icon: '▦', href: adminPaths.dashboard },
        { key: 'users', label: 'Usuarios', icon: '♙', href: adminPaths.users },
        { key: 'products', label: 'Productos', icon: '◇', href: adminPaths.products },
        { key: 'purchases', label: 'Compras', icon: '▤', href: adminPaths.purchases },
    ];

    return (
        <div data-admin-panel className="flex min-h-screen flex-col bg-[#f3f4f6] text-slate-900 antialiased lg:flex-row">
            <aside className="flex w-full flex-col bg-[#111827] px-5 py-6 text-white lg:min-h-screen lg:w-72">
                <a href={adminPaths.dashboard} className="flex items-center gap-3 px-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-lg font-black text-[#111827]">S</span>
                    <span><strong className="block text-lg tracking-tight">SneakerX</strong><small className="text-xs text-slate-400">ADMINISTRADOR</small></span>
                </a>
                <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-full bg-white font-bold text-[#111827]">{initials(session.nombre)}</div>
                        <div><p className="font-semibold">{session.nombre}</p><p className="text-xs text-slate-400">Administrador</p></div>
                    </div>
                    <p className="mt-3 truncate text-xs text-slate-400">{session.email}</p>
                </div>
                <nav className="mt-8 space-y-2" aria-label="Navegación del administrador">
                    {links.map((link) => (
                        <a key={link.key} href={link.href} aria-current={page === link.key ? 'page' : undefined} className={`admin-sidebar-link flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${page === link.key ? 'admin-sidebar-link-active bg-white font-semibold' : 'font-medium hover:bg-white/10'}`}>
                            <span aria-hidden="true">{link.icon}</span>{link.label}
                        </a>
                    ))}
                </nav>
                <div className="mt-auto hidden pt-8 lg:block">
                    <a href="/" className="admin-sidebar-link flex items-center gap-3 px-4 py-3 text-sm transition">← Volver a la tienda</a>
                    <button type="button" onClick={logout} className="w-full px-4 py-3 text-left text-sm text-slate-400 transition hover:text-white active:bg-white/10 active:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">Cerrar sesión</button>
                </div>
                <div className="mt-4 flex gap-4 lg:hidden">
                    <a href="/" className="admin-sidebar-link text-sm">← Volver a la tienda</a>
                    <button type="button" onClick={logout} className="text-sm text-slate-400 hover:text-white active:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">Cerrar sesión</button>
                </div>
            </aside>
            <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
        </div>
    );
}

function PageHeader({ section, title, description, action }) {
    return (
        <header className="border-b border-slate-200 bg-white px-6 py-6 lg:px-10">
            <p className="text-sm font-medium text-slate-500">Panel de control / {section}</p>
            <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div><h1 className="text-3xl font-bold tracking-tight">{title}</h1><p className="mt-2 text-sm text-slate-500">{description}</p></div>
                {action}
            </div>
        </header>
    );
}

function DashboardPage({ session }) {
    const products = getProducts();
    const admins = getUsers().filter((user) => user.role === 'Administrador').length;
    const firstName = session.nombre.split(' ')[0];
    const greeting = new Date().getHours() < 12 ? 'Buenos días' : new Date().getHours() < 20 ? 'Buenas tardes' : 'Buenas noches';

    return (
        <>
            <PageHeader section="Resumen" title={`${greeting}, ${firstName}`} description="Resumen de la actividad de tu tienda." action={<a href="/" target="_blank" rel="noreferrer" className={`admin-dark-action ${buttonClass}`}>Ver tienda</a>} />
            <div className="px-6 py-8 lg:px-10">
                <section className="grid gap-4 sm:grid-cols-3" aria-label="Indicadores del negocio">
                    <Metric title="Productos publicados" value={products.length} detail="Catálogo sincronizado" />
                    <Metric title="Administradores" value={admins} detail="Perfiles con acceso" />
                    <article className="rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm"><p className="text-sm text-slate-400">Estado de la tienda</p><p className="mt-3 text-3xl font-bold">Activa</p><p className="mt-2 text-xs text-slate-400">Lista para recibir visitas</p></article>
                </section>
                <section className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-slate-500">Operación diaria</p><h2 className="mt-1 text-xl font-bold">Todo bajo control</h2></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">En línea</span></div>
                        <div className="mt-8 grid gap-4 sm:grid-cols-2">
                            <QuickLink href={adminPaths.products} icon="◇" title="Gestionar productos" description="Crea, edita o retira zapatillas del catálogo." />
                            <QuickLink href={adminPaths.users} icon="♙" title="Gestionar usuarios" description="Administra los accesos del equipo." />
                        </div>
                    </div>
                    <div className="rounded-2xl bg-[#111827] p-6 text-white shadow-sm"><p className="text-sm text-slate-400">Acceso actual</p><h2 className="mt-2 break-all text-xl font-bold">{session.email}</h2><p className="mt-3 text-sm leading-6 text-slate-400">Tu cuenta tiene permisos para administrar el inventario y el equipo de SneakerX.</p><a href={adminPaths.users} className="admin-light-action mt-8 inline-flex rounded-xl bg-white px-4 py-3 text-sm font-semibold transition hover:bg-slate-200">Revisar usuarios →</a></div>
                </section>
            </div>
        </>
    );
}

function Metric({ title, value, detail }) {
    return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{title}</p><p className="mt-3 text-3xl font-bold">{value}</p><p className="mt-2 text-xs text-slate-500">{detail}</p></article>;
}

function QuickLink({ href, icon, title, description }) {
    return <a href={href} className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-400 hover:bg-slate-50"><span className="text-2xl">{icon}</span><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-1 text-sm text-slate-500">{description}</p></a>;
}

function PurchasesPage() {
    const [purchases] = useState(() => getPurchases());
    const [selectedPurchase, setSelectedPurchase] = useState(null);

    return (
        <>
            <PageHeader section="Ventas" title="Historial de compras" description="Compras realizadas por clientes, con su boleta y detalle." />
            <div className="px-6 py-8 lg:px-10">
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-5"><h2 className="font-bold">Compras registradas</h2><p className="mt-1 text-sm text-slate-500">{purchases.length} boleta{purchases.length === 1 ? '' : 's'} guardada{purchases.length === 1 ? '' : 's'} en este navegador.</p></div>
                    <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Boleta</th><th className="px-5 py-4">Fecha</th><th className="px-5 py-4">Comprador</th><th className="px-5 py-4">Productos</th><th className="px-5 py-4">Total</th><th className="px-5 py-4 text-right">Detalle</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                            {purchases.length === 0
                                ? <tr><td colSpan="6" className="px-5 py-12 text-center text-sm text-slate-500">Aún no hay compras registradas.</td></tr>
                                : purchases.map((purchase) => <tr key={purchase.receiptNumber} className="hover:bg-slate-50"><td className="px-5 py-4 text-sm font-semibold">{purchase.receiptNumber}</td><td className="px-5 py-4 text-sm text-slate-500">{formatPurchaseDate(purchase.purchasedAt)}</td><td className="px-5 py-4"><p className="font-semibold">{purchase.buyer.name}</p><p className="text-sm text-slate-500">{purchase.buyer.email}</p></td><td className="px-5 py-4 text-sm">{purchase.items.reduce((sum, item) => sum + item.quantity, 0)}</td><td className="px-5 py-4 font-semibold">{formatCLP(purchase.total)}</td><td className="px-5 py-4 text-right"><button type="button" onClick={() => setSelectedPurchase(purchase)} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 active:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">Ver boleta</button></td></tr>)}
                        </tbody>
                    </table></div>
                </section>
            </div>
            {selectedPurchase && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 px-4 py-8" role="dialog" aria-modal="true" aria-labelledby="purchase-receipt-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedPurchase(null); }}>
                <article className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
                    <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-slate-500">Comprobante de compra</p><h2 id="purchase-receipt-title" className="mt-1 text-2xl font-bold">{selectedPurchase.receiptNumber}</h2></div><button type="button" onClick={() => setSelectedPurchase(null)} aria-label="Cerrar boleta" className="text-2xl leading-none text-slate-400 hover:text-slate-900">×</button></div>
                    <p className="mt-2 text-sm text-slate-500">{formatPurchaseDate(selectedPurchase.purchasedAt)}</p>
                    <div className="mt-6 grid gap-2 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2"><p><b>Comprador:</b> {selectedPurchase.buyer.name}</p><p><b>Correo:</b> {selectedPurchase.buyer.email}</p><p><b>Entrega:</b> {selectedPurchase.delivery.address}</p><p><b>Teléfono:</b> {selectedPurchase.delivery.phone}</p><p><b>Pago:</b> {selectedPurchase.paymentMethod}</p></div>
                    <h3 className="mt-6 font-bold">Detalle de productos</h3>
                    <ul className="mt-3 divide-y divide-slate-100">{selectedPurchase.items.map((item, index) => <li key={`${item.id}-${item.size}-${index}`} className="flex justify-between gap-4 py-3 text-sm"><span>{item.name} · Talla {item.size} × {item.quantity}</span><span className="font-semibold">{formatCLP(item.price * item.quantity)}</span></li>)}</ul>
                    <dl className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm"><div className="flex justify-between"><dt>Subtotal</dt><dd>{formatCLP(selectedPurchase.subtotal)}</dd></div><div className="flex justify-between"><dt>IVA</dt><dd>{formatCLP(selectedPurchase.tax)}</dd></div><div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold"><dt>Total</dt><dd>{formatCLP(selectedPurchase.total)}</dd></div></dl>
                </article>
            </div>}
        </>
    );
}

function formatPurchaseDate(value) {
    return new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function ProductsPage() {
    const [products, setProducts] = useState(() => getProducts());
    const [form, setForm] = useState({ id: '', name: '', price: '', image: '' });
    const [error, setError] = useState('');
    const editing = Boolean(form.id);

    const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    const resetForm = () => {
        setForm({ id: '', name: '', price: '', image: '' });
        setError('');
    };
    const submitProduct = (event) => {
        event.preventDefault();
        const name = form.name.trim();
        const price = Number(form.price);
        const image = form.image.trim();
        if (!/zapatilla|nike|air|jordan|runner|sneaker|sport|street|basket|court|force/i.test(name)) {
            setError('Solo puedes ingresar zapatillas. Incluye una marca o modelo de zapatilla en el nombre.');
            return;
        }
        if (!Number.isFinite(price) || price <= 0) {
            setError('Ingresa un precio válido para la zapatilla.');
            return;
        }

        const updated = editing
            ? products.map((product) => product.id === Number(form.id) ? { ...product, name, price, image } : product)
            : [...products, { id: Date.now(), name, price, image }];
        saveProducts(updated);
        setProducts(updated);
        resetForm();
    };
    const editProduct = (product) => {
        setForm({ id: String(product.id), name: product.name, price: String(product.price), image: product.image });
        setError('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const deleteProduct = (id) => {
        if (!window.confirm('¿Eliminar esta zapatilla del catálogo?')) return;
        const updated = products.filter((product) => product.id !== id);
        saveProducts(updated);
        setProducts(updated);
        if (Number(form.id) === id) resetForm();
    };

    return (
        <>
            <PageHeader section="Catálogo" title="Productos" description="Mantén actualizado el catálogo de zapatillas de SneakerX." action={<a href="/" target="_blank" rel="noreferrer" className={`admin-dark-action ${buttonClass}`}>Ver tienda</a>} />
            <div className="px-6 py-8 lg:px-10">
                <section className="mb-6 grid gap-4 sm:grid-cols-3">
                    <InfoCard title="Catálogo" value="Inventario activo" detail="Sincronizado con la tienda" />
                    <InfoCard title="Acciones disponibles" value="Crear · Editar · Eliminar" detail="Cambios guardados localmente" />
                    <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm"><p className="text-sm text-slate-400">Estado</p><p className="mt-2 text-xl font-bold">Tienda activa</p><p className="mt-1 text-xs text-slate-400">Lista para publicar novedades</p></div>
                </section>
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-6 flex items-start gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-xl text-slate-800">{editing ? '✎' : '+'}</span><div><h2 className="text-xl font-bold">{editing ? 'Editar zapatilla' : 'Agregar Nueva Zapatilla'}</h2><p className="mt-1 text-sm text-slate-500">Añade zapatillas deportivas al catálogo.</p></div></div>
                    {error && <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">{error}</p>}
                    <form onSubmit={submitProduct} className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                        <label className="text-sm font-semibold text-slate-700">Nombre de la zapatilla<input name="name" value={form.name} onChange={updateField} required className={`${inputClass} mt-2 font-normal`} placeholder="Ej. Nike Air Max 90" /></label>
                        <label className="text-sm font-semibold text-slate-700">Precio (CLP)<input name="price" type="number" min="1" step="1" value={form.price} onChange={updateField} required className={`${inputClass} mt-2 font-normal`} placeholder="119990" /></label>
                        <label className="text-sm font-semibold text-slate-700">Imagen de la zapatilla<input name="image" type="url" value={form.image} onChange={updateField} required className={`${inputClass} mt-2 font-normal`} placeholder="URL de imagen del modelo" /></label>
                        <div className="flex items-end gap-2"><button type="submit" className={`${buttonClass} w-full`}>{editing ? 'Actualizar' : 'Guardar'}</button>{editing && <button type="button" onClick={resetForm} className="w-1/3 rounded-xl bg-slate-200 px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-300 active:bg-slate-300 active:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2">Cancelar</button>}</div>
                    </form>
                </section>
                <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-2 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold">Catálogo publicado</h2><p className="mt-1 text-sm text-slate-500">Administra los productos visibles para tus clientes.</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Actualización instantánea</span></div>
                    <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Imagen</th><th className="px-5 py-4">Producto</th><th className="px-5 py-4">Precio</th><th className="px-5 py-4 text-right">Acciones</th></tr></thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {products.length === 0 ? <tr><td colSpan="4" className="px-5 py-12 text-center text-sm text-slate-500">No hay zapatillas registradas.</td></tr> : products.map((product) => <tr key={product.id} className="transition hover:bg-slate-50"><td className="px-5 py-4"><img src={adminImagePath(product.image)} className="h-14 w-14 rounded-xl object-cover" alt={product.name} /></td><td className="px-5 py-4 font-semibold">{product.name}</td><td className="px-5 py-4">{formatCLP(product.price)}</td><td className="px-5 py-4 text-right"><button type="button" onClick={() => editProduct(product)} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 active:bg-slate-100 active:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">Editar</button><button type="button" onClick={() => deleteProduct(product.id)} className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 active:bg-red-50 active:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">Eliminar</button></td></tr>)}
                        </tbody>
                    </table></div>
                </section>
            </div>
        </>
    );
}

function InfoCard({ title, value, detail }) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{title}</p><p className="mt-2 text-xl font-bold">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>;
}

function adminImagePath(image = '') {
    if (/^(https?:|data:|blob:|\/)/i.test(image)) return image;
    return `/${image}`;
}

function UsersPage({ session, setSession }) {
    const [users, setUsers] = useState(() => getUsers());
    const [query, setQuery] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ name: '', role: 'Administrador', password: '' });
    const [error, setError] = useState('');
    const currentEmail = session.email.trim().toLowerCase();
    const adminsCount = users.filter((user) => user.role === 'Administrador').length;
    const visibleUsers = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        return users.filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(normalizedQuery));
    }, [query, users]);
    const generatedEmail = createAdminEmail(form.name);

    const openCreate = () => {
        setEditingId(null);
        setForm({ name: '', role: 'Administrador', password: '' });
        setError('');
        setModalOpen(true);
    };
    const openEdit = (user) => {
        setEditingId(user.id);
        setForm({ name: user.name, role: user.role, password: user.password });
        setError('');
        setModalOpen(true);
    };
    const closeModal = () => setModalOpen(false);
    const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    const submitUser = (event) => {
        event.preventDefault();
        const name = form.name.trim();
        const email = createAdminEmail(name);
        const duplicate = findUserByEmail(users.filter((user) => user.id !== editingId), email);
        if (duplicate) {
            setError('Ya existe una cuenta con el correo generado para ese nombre.');
            return;
        }
        if (editingId && users.find((user) => user.id === editingId)?.role === 'Administrador' && form.role !== 'Administrador' && adminsCount <= 1) {
            setError('Debe existir al menos un administrador activo.');
            return;
        }

        const user = {
            id: editingId ?? Date.now(),
            name,
            role: form.role,
            email,
            password: form.password.trim(),
        };
        const updated = editingId
            ? users.map((item) => item.id === editingId ? user : item)
            : [...users, user];
        saveUsers(updated);
        setUsers(updated);

        if (currentEmail === String(editingId ? users.find((item) => item.id === editingId)?.email : '').trim().toLowerCase()) {
            const nextSession = { ...session, nombre: user.name, email: user.email, rol: user.role === 'Administrador' ? 'admin' : 'usuario' };
            localStorage.setItem('usuarioLogueado', JSON.stringify(nextSession));
            setSession(nextSession);
        }
        closeModal();
    };
    const deleteUser = (user) => {
        if (user.role === 'Administrador' && adminsCount <= 1) {
            window.alert('Debe existir al menos un administrador activo.');
            return;
        }
        if (!window.confirm(`¿Eliminar el acceso de ${user.name}?`)) return;
        const updated = users.filter((item) => item.id !== user.id);
        saveUsers(updated);
        setUsers(updated);
        if (user.email.trim().toLowerCase() === currentEmail) {
            localStorage.removeItem('usuarioLogueado');
            window.location.assign('/login');
        }
    };

    return (
        <>
            <PageHeader section="Equipo" title="Usuarios" description="Gestiona quién puede administrar SneakerX." action={<button type="button" onClick={openCreate} className={buttonClass}><span className="mr-2 text-lg leading-none">+</span>Nuevo usuario</button>} />
            <div className="px-6 py-8 lg:px-10">
                <section className="mb-6 grid gap-4 sm:grid-cols-2"><Metric title="Usuarios registrados" value={users.length} detail={`${adminsCount} administradores con acceso`} /><InfoCard title="Dominio de acceso" value="@adminshop.cl" detail="Correo generado según el nombre" /></section>
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold">Equipo administrador</h2><p className="mt-1 text-sm text-slate-500">Cada cuenta recibe un correo de acceso único.</p></div><label><span className="sr-only">Buscar usuario</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar usuario..." className={`${inputClass} py-2.5 text-sm sm:w-64`} /></label></div>
                    <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Usuario</th><th className="px-5 py-4">Rol</th><th className="px-5 py-4">Correo de acceso</th><th className="px-5 py-4 text-right">Acciones</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                            {visibleUsers.length === 0 ? <tr><td colSpan="4" className="px-5 py-12 text-center text-sm text-slate-500">No encontramos usuarios con esa búsqueda.</td></tr> : visibleUsers.map((user) => <tr key={user.id} className="transition hover:bg-slate-50"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-lime-100 text-xs font-bold text-lime-800">{initials(user.name)}</span><span className="font-semibold text-slate-800">{user.name}</span></div></td><td className="px-5 py-4"><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{user.role}</span></td><td className="px-5 py-4 text-sm text-slate-500">{user.email}</td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => openEdit(user)} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 active:bg-slate-100 active:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">Editar</button><button type="button" onClick={() => deleteUser(user)} className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 active:bg-red-50 active:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">Eliminar</button></div></td></tr>)}
                        </tbody>
                    </table></div>
                </section>
            </div>
            {modalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4" role="dialog" aria-modal="true" aria-labelledby="admin-user-modal-title" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
                <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                    <div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">Perfil de acceso</p><h2 id="admin-user-modal-title" className="mt-1 text-2xl font-bold">{editingId ? 'Editar usuario' : 'Crear usuario'}</h2></div><button type="button" onClick={closeModal} className="text-2xl leading-none text-slate-400 transition hover:text-slate-900 active:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500" aria-label="Cerrar">×</button></div>
                    {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">{error}</p>}
                    <form onSubmit={submitUser} className="mt-6 space-y-5">
                        <label className="block text-sm font-semibold text-slate-700">Nombre completo<input name="name" value={form.name} onChange={updateField} required className={`${inputClass} mt-2`} placeholder="Ej. Alexis Rozas" /></label>
                        <label className="block text-sm font-semibold text-slate-700">Rol<select name="role" value={form.role} onChange={updateField} disabled={!editingId} className={`${inputClass} mt-2 bg-white disabled:cursor-not-allowed disabled:bg-slate-100`}><option value="Administrador">Administrador</option><option value="Usuario">Usuario</option></select></label>
                        <label className="block text-sm font-semibold text-slate-700">Contraseña<input name="password" type="password" value={form.password} onChange={updateField} required className={`${inputClass} mt-2`} placeholder="••••••••" /></label>
                        <label className="block text-sm font-semibold text-slate-700">Correo generado<input type="email" readOnly value={generatedEmail} className={`${inputClass} mt-2 cursor-not-allowed bg-slate-50 text-slate-600`} /><span className="mt-2 block text-xs font-normal text-slate-500">Se actualiza automáticamente según el nombre.</span></label>
                        <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={closeModal} className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 active:bg-slate-100 active:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">Cancelar</button><button type="submit" className={buttonClass}>Guardar usuario</button></div>
                    </form>
                </div>
            </div>}
        </>
    );
}

function initials(name = '') {
    return name.split(' ').filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase();
}

export default AdminApp;
