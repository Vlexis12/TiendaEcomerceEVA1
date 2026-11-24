import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { authService } from '../services/api';
import { getSession } from '../data/users';

function EditarPerfil() {
    const session = getSession();
    const [form, setForm] = useState({ email: '', phone: '', address: '', comuna: '', password: '', imagenUrl: '', rut: '' });
const [rutLocked, setRutLocked] = useState(false);
const [needsCompletion, setNeedsCompletion] = useState(false);
    const [error, setError] = useState('');
    const [ok, setOk] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!localStorage.getItem('sneakerx_jwt')) { window.location.replace('/login'); return; }
        (async () => {
            try {
                const profile = await authService.getProfile();
                setForm({
                    email: profile.email || '',
                    phone: profile.phone || '',
                    address: profile.address || '',
                    comuna: profile.comuna || '',
                    password: '',
                    imagenUrl: profile.imagenUrl || '',
                    rut: profile.rut || '',
                });
                setRutLocked(!!profile.rut);
                setNeedsCompletion(!(profile.phone && profile.address && profile.comuna && profile.rut));
            } catch (e) {
                setError(e.message || 'No se pudo cargar el perfil.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const update = (e) => setForm((c) => ({ ...c, [e.target.name]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setOk('');
        if (needsCompletion) {
            if (!form.phone.trim() || !form.address.trim() || !form.comuna.trim() || !form.rut.trim()) {
                setError('Completa teléfono, dirección, comuna y RUT.');
                return;
            }
            if (!form.password.trim()) {
                setError('Debes crear una contraseña.');
                return;
            }
        }
        try {
            const payload = {
                phone: form.phone,
                address: form.address,
                comuna: form.comuna,
                rut: form.rut,
                imagenUrl: form.imagenUrl || null,
            };
            if (form.password.trim()) payload.password = form.password.trim();
            const updated = await authService.updateProfile(payload);
            const userData = {
                nombre: updated.username,
                email: updated.email,
                rol: updated.role === 'ADMIN' ? 'admin' : 'usuario',
            };
            localStorage.setItem('usuarioLogueado', JSON.stringify(userData));
            localStorage.setItem('sneakerx_user', JSON.stringify(updated));
            setOk('Perfil actualizado correctamente.');
            setTimeout(() => { window.location.href = '/'; }, 1200);
        } catch (err) {
            setError(err.message || 'No se pudo actualizar el perfil.');
        }
    };

    if (loading) return <div className="min-h-screen grid place-items-center text-slate-500">Cargando perfil...</div>;

    return (
        <div className="min-h-screen bg-[#f3f4f6] text-slate-900">
            <Navbar totalItems={0} activePath="/editar-perfil" />
            <main className="mx-auto max-w-2xl px-6 py-12">
                <h1 className="text-3xl font-bold tracking-tight">Editar perfil</h1>
                <p className="mt-2 text-slate-500">Actualiza tus datos y, si lo deseas, cambia tu contraseña.</p>
                {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">{error}</div>}
                {ok && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700" role="status">{ok}</div>}
                <form onSubmit={submit} className="mt-8 space-y-5">
                    <label className="block text-sm font-semibold text-slate-700">Correo electrónico<input type="email" name="email" value={form.email} readOnly disabled className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 font-normal text-slate-500 outline-none" /></label>
                    <label className="block text-sm font-semibold text-slate-700">RUT<input type="text" name="rut" value={form.rut} onChange={update} disabled={rutLocked} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-100 disabled:text-slate-500" placeholder={rutLocked ? '' : '12345678-9'} /></label>
                    <label className="block text-sm font-semibold text-slate-700">Teléfono<input type="text" name="phone" value={form.phone} onChange={update} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100" /></label>
                    <label className="block text-sm font-semibold text-slate-700">Dirección<input type="text" name="address" value={form.address} onChange={update} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100" /></label>
                    <label className="block text-sm font-semibold text-slate-700">Comuna<input type="text" name="comuna" value={form.comuna} onChange={update} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100" /></label>
                    <label className="block text-sm font-semibold text-slate-700">URL de foto de perfil<input type="url" name="imagenUrl" value={form.imagenUrl} onChange={update} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100" placeholder="https://..." /></label>
                    <label className="block text-sm font-semibold text-slate-700">Nueva contraseña (opcional)<input type="password" name="password" value={form.password} onChange={update} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100" placeholder="Dejar vacío para no cambiar" /></label>
                    <button type="submit" className="btn btn-dark w-100 py-3">Guardar cambios</button>
                </form>
            </main>
        </div>
    );
}

export default EditarPerfil;
