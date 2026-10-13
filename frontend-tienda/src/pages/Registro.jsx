import { useState } from 'react';
import Navbar from '../components/Navbar';

function Registro({ totalItems = 0 }) {
    const [form, setForm] = useState({ name: '', lastName: '', phone: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');

    const actualizar = (event) => setForm({ ...form, [event.target.name]: event.target.value });

    const registrar = (event) => {
        event.preventDefault();
        const email = form.email.trim().toLowerCase();
        const phone = form.phone.replace(/\D/g, '');
        const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
        if (!dominiosPermitidos.some((dominio) => email.endsWith(dominio))) return setError('Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.');
        if (phone.length > 0 && phone.length < 9) return setError('El teléfono debe tener 9 dígitos (Ej: 9 1234 5678).');
        if (form.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
        if (form.password !== form.confirmPassword) return setError('Las contraseñas no coinciden.');

        const stored = JSON.parse(localStorage.getItem('store_users') || '[]');
        const users = Array.isArray(stored) && stored.length ? stored : [{ id: 1, name: 'Jhon Die', role: 'Administrador', email: 'jhon.die@adminshop.cl', password: 'admin123' }];
        if (users.some((user) => user.email === email)) return setError('El correo electrónico ya se encuentra registrado.');

        users.push({ id: Date.now(), name: `${form.name.trim()} ${form.lastName.trim()}`, role: 'Usuario', email, password: form.password, phone: form.phone });
        localStorage.setItem('store_users', JSON.stringify(users));
        localStorage.setItem('usuarioLogueado', JSON.stringify({ nombre: form.name.trim(), email, rol: 'usuario' }));
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-[#f3f4f6] text-slate-900 antialiased">
            <Navbar totalItems={totalItems} activePath="/registro" />
            <main className="mx-auto grid min-h-[calc(100vh-86px)] max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-[.85fr_1.15fr] lg:px-8">
                <div className="hidden min-h-[620px] rounded-3xl bg-cover bg-center lg:block" style={{ backgroundImage: "url('/img/fondo_registro_2.png')" }} />
                <section className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Únete a SneakerX</p><h1 className="mt-3 text-4xl font-bold tracking-tight">Crea tu cuenta.</h1><p className="mt-3 text-slate-500">Guarda tus favoritos y descubre nuevas formas de moverte.</p>
                    {error && <div className="mt-6 text-sm font-semibold text-red-500" role="alert">{error}</div>}
                    <form onSubmit={registrar} className="mt-8 grid gap-5 sm:grid-cols-2">
                        <Field label="Nombre" name="name" placeholder="Jhon" value={form.name} onChange={actualizar} required /><Field label="Apellido" name="lastName" placeholder="Die" value={form.lastName} onChange={actualizar} required /><Field label="Teléfono" name="phone" placeholder="+56 9 1234 5678" value={form.phone} onChange={actualizar} /><Field label="Correo electrónico" name="email" type="email" placeholder="nombre@dominio.com" value={form.email} onChange={actualizar} required /><Field label="Contraseña" name="password" type="password" placeholder="Crea una contraseña" value={form.password} onChange={actualizar} required /><Field label="Confirmar contraseña" name="confirmPassword" type="password" placeholder="Repite tu contraseña" value={form.confirmPassword} onChange={actualizar} required />
                        <button type="submit" className="mt-2 flex items-center justify-center rounded-xl bg-[#111827] px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-700 sm:col-span-2">Crear mi cuenta <span className="ml-2">→</span></button>
                    </form>
                </section>
            </main>
        </div>
    );
}

function Field({ label, name, type = 'text', ...props }) {
    return <label className="text-sm font-semibold text-slate-700">{label}<input type={type} name={name} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100" {...props} /></label>;
}

function Brand() {
    return <a href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#111827] text-lg font-black text-white">S</span><span><strong className="block text-lg tracking-tight">SneakerX</strong><small className="block text-[10px] font-semibold tracking-[0.22em] text-slate-400">Movimiento Diferente</small></span></a>;
}

export default Registro;
