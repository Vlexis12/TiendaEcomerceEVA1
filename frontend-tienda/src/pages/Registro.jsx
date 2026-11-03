import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { authService } from '../services/api';

function Registro({ totalItems = 0 }) {
    const [form, setForm] = useState({ username: '', name: '', lastName: '', phone: '', email: '', password: '', confirmPassword: '', rut: '', address: '', comuna: '' });
    const [googlePicture, setGooglePicture] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'TU_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
        const decodeCredential = (credential) => {
            try {
                const payload = credential.split('.')[1];
                const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
                return JSON.parse(json);
            } catch { return null; }
        };
        const init = () => {
            if (!window.google || window.__gsi_initialized) return;
            window.__gsi_initialized = true;
            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: (response) => {
                    const profile = decodeCredential(response.credential);
                    if (profile) {
                        const givenName = profile.given_name || '';
                        const familyName = profile.family_name || '';
                        const fullName = (profile.name || '').trim();
                        const parts = fullName.split(/\s+/);
                        setForm((prev) => ({
                            ...prev,
                            email: profile.email || prev.email,
                            name: givenName || parts[0] || prev.name,
                            lastName: familyName || parts.slice(1).join(' ') || prev.lastName,
                            username: (profile.email ? profile.email.split('@')[0] : prev.username),
                        }));
                        if (profile.picture) setGooglePicture(profile.picture);
                    } else {
                        setError('No se pudo leer los datos de Google.');
                    }
                },
            });
            const btn = document.getElementById('google-btn-registro');
            if (btn) window.google.accounts.id.renderButton(btn, { theme: 'outline', size: 'large', width: 320 });
        };
        if (!window.google) {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = init;
            document.head.appendChild(script);
        } else {
            init();
        }
    }, []);

    const formatearRut = (valor) => {
        const limpio = valor.replace(/[^0-9kK]/g, '').toUpperCase();
        if (limpio.length === 0) return '';
        if (limpio.length === 1) return limpio;
        const dv = limpio.slice(-1);
        const cuerpo = limpio.slice(0, -1);
        let formateado = '';
        let i = cuerpo.length;
        let grupo = '';
        while (i > 0) {
            const chunk = cuerpo.slice(Math.max(0, i - 3), i);
            formateado = (formateado ? chunk + '.' + formateado : chunk);
            i -= 3;
        }
        return `${formateado}-${dv}`;
    };

    const formatearTelefono = (valor) => {
        const limpio = valor.replace(/\D/g, '');
        if (limpio.length === 0) return '';
        let numero = limpio;
        if (numero.startsWith('569')) numero = numero.slice(3);
        else if (numero.startsWith('56')) numero = numero.slice(2);
        if (numero.length === 8 && !numero.startsWith('9')) numero = '9' + numero;
        numero = numero.slice(0, 9);
        const cuerpo = numero.startsWith('9') ? numero.slice(1) : numero; // 8 dígitos
        const g1 = cuerpo.slice(0, 4);
        const g2 = cuerpo.slice(4, 8);
        let res = '+569';
        if (g1) res += ' ' + g1;
        if (g2) res += ' ' + g2;
        return res.trim();
    };

    const validarRut = (rut) => {
        const limpio = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
        if (!/^[0-9]+[0-9K]$/.test(limpio)) return false;
        const cuerpo = limpio.slice(0, -1);
        const dv = limpio.slice(-1);
        let suma = 0;
        let mult = 2;
        for (let i = cuerpo.length - 1; i >= 0; i--) {
            suma += parseInt(cuerpo[i], 10) * mult;
            mult = mult === 7 ? 2 : mult + 1;
        }
        const resto = 11 - (suma % 11);
        const dvCalc = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
        return dv === dvCalc;
    };

    const actualizar = (event) => {
        const { name, value } = event.target;
        if (name === 'rut') {
            setForm({ ...form, rut: formatearRut(value) });
            return;
        }
        if (name === 'phone') {
            setForm({ ...form, phone: formatearTelefono(value) });
            return;
        }
        setForm({ ...form, [name]: value });
    };

    const registrar = async (event) => {
        event.preventDefault();
        const email = form.email.trim().toLowerCase();
        const phone = form.phone.replace(/\D/g, '');
        const dominiosPermitidos = ['@gmail.com', '@duocuc.cl', '@adminshop.cl', '@profesor.duoc.cl'];
        if (!dominiosPermitidos.some((dominio) => email.endsWith(dominio))) return setError('Solo se permiten correos @gmail.com, @duocuc.cl, @adminshop.cl o @profesor.duoc.cl.');
        if (phone.length > 0 && phone.length < 9) return setError('El teléfono debe tener 9 dígitos (Ej: 9 1234 5678).');
        if (form.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
        if (form.password !== form.confirmPassword) return setError('Las contraseñas no coinciden.');
        if (!form.username.trim()) return setError('El nombre de usuario es obligatorio.');
        if (!form.name.trim() || !form.lastName.trim()) return setError('Nombre y apellido son obligatorios.');
        if (!form.rut.trim()) return setError('El RUT es obligatorio.');
        if (!validarRut(form.rut)) return setError('El RUT no es válido.');
        if (phone.length === 0) return setError('El teléfono es obligatorio.');
        if (!form.address.trim()) return setError('La dirección es obligatoria.');
        if (!form.comuna.trim()) return setError('La comuna es obligatoria.');

        try {
            const username = form.username.trim();
            const data = await authService.register({
                username,
                password: form.password,
                email,
                phone: form.phone,
                rut: form.rut,
                address: form.address,
                comuna: form.comuna,
                imagenUrl: googlePicture || undefined,
            });
            const usuario = data?.usuario || data?.user || {};
            const userData = {
                nombre: usuario.username || username,
                email: usuario.email || email,
                rol: (usuario.role || 'USER') === 'ADMIN' ? 'admin' : 'usuario',
            };
            localStorage.setItem('usuarioLogueado', JSON.stringify(userData));
            if (data?.token) localStorage.setItem('sneakerx_jwt', data.token);
            if (usuario?.id) localStorage.setItem('sneakerx_userId', String(usuario.id));
            window.location.href = '/';
        } catch (registrationError) {
            setError(registrationError.message || 'No se pudo registrar. Inténtalo nuevamente.');
        }
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
                        <Field label="Nombre de usuario" name="username" placeholder="mi_usuario" value={form.username} onChange={actualizar} required /><Field label="Nombre" name="name" placeholder="Jhon" value={form.name} onChange={actualizar} required /><Field label="Apellido" name="lastName" placeholder="Die" value={form.lastName} onChange={actualizar} required /><Field label="Teléfono" name="phone" placeholder="+56 9 1234 5678" value={form.phone} onChange={actualizar} required /><Field label="RUT" name="rut" placeholder="12345678-9" value={form.rut} onChange={actualizar} required /><Field label="Dirección" name="address" placeholder="Calle 123" value={form.address} onChange={actualizar} required /><Field label="Comuna" name="comuna" placeholder="Santiago" value={form.comuna} onChange={actualizar} required /><Field label="Correo electrónico" name="email" type="email" placeholder="nombre@dominio.com" value={form.email} onChange={actualizar} required /><Field label="Contraseña" name="password" type="password" placeholder="Crea una contraseña" value={form.password} onChange={actualizar} required /><Field label="Confirmar contraseña" name="confirmPassword" type="password" placeholder="Repite tu contraseña" value={form.confirmPassword} onChange={actualizar} required />
                        <div id="google-btn-registro" className="mt-2 flex justify-center sm:col-span-2"></div><button type="submit" className="btn btn-dark mt-2 w-100 py-3 sm:col-span-2">Crear mi cuenta <span className="ml-2">→</span></button>
                    </form>
                </section>
            </main>
        </div>
    );
}

function Field({ label, name, type = 'text', ...props }) {
    return <label className="text-sm font-semibold text-slate-700">{label}<input type={type} name={name} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100" {...props} /></label>;
}

export default Registro;
