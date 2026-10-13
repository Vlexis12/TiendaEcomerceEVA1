import { useState } from 'react';
import { formatCLP } from '../data/db';
import Navbar from '../components/Navbar';

const imagePath = (image) => image.startsWith('/') ? image : `/${image}`;

function Pago({ carrito, onPagoCompletado }) {
    const [form, setForm] = useState({ nombre: '', apellido: '', rut: '', telefono: '', direccion: '', observaciones: '', metodoPago: '', tarjeta: '', vencimiento: '', cvv: '' });
    const [error, setError] = useState('');
    const [comprobante, setComprobante] = useState(null);
    const subtotal = carrito.reduce((sum, item) => sum + Number(item.price) * item.cantidad, 0);
    const iva = subtotal * 0.19;

    const actualizar = (event) => {
        const { name, value } = event.target;
        let nuevoValor = value;
        if (name === 'tarjeta') nuevoValor = value.replace(/\D/g, '').match(/.{1,4}/g)?.join(' ').slice(0, 19) || '';
        if (name === 'vencimiento') {
            const digits = value.replace(/\D/g, '').slice(0, 4);
            nuevoValor = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
        }
        if (name === 'cvv') nuevoValor = value.replace(/\D/g, '').slice(0, 3);
        if (name === 'telefono') nuevoValor = value.replace(/\D/g, '').slice(0, 9);
        if (name === 'rut') {
            const digits = value.replace(/[^0-9kK]/g, '').toUpperCase().slice(0, 9);
            nuevoValor = digits.length > 1 ? `${digits.slice(0, -1)}-${digits.slice(-1)}` : digits;
        }
        setForm((current) => ({ ...current, [name]: nuevoValor }));
    };

    const pagar = (event) => {
        event.preventDefault();
        if (!form.metodoPago) {
            setError('Por favor, selecciona un método de pago válido.');
            return;
        }
        if (!carrito.length) {
            setError('Tu carrito está vacío.');
            return;
        }
        setError('');
        setComprobante({ ...form, total: subtotal + iva });
        onPagoCompletado();
    };

    return (
        <div className="min-h-screen bg-[#f3f4f6] text-slate-900 antialiased">
            <Navbar totalItems={carrito.reduce((sum, item) => sum + item.cantidad, 0)} activePath="/pago" />
            <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
                <div className="mb-10"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Compra segura</p><h1 className="mt-2 text-4xl font-bold tracking-tight">Finaliza tu pedido</h1><p className="mt-3 text-slate-500">Completa tus datos para preparar la entrega.</p></div>
                <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        {error && <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">{error}</div>}
                        <form onSubmit={pagar} className="space-y-6">
                            <div><h2 className="text-lg font-bold">Datos de entrega</h2><p className="mt-1 text-sm text-slate-500">Usaremos esta información para contactarte.</p></div>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Nombre" name="nombre" value={form.nombre} onChange={actualizar} required />
                                <Field label="Apellido" name="apellido" value={form.apellido} onChange={actualizar} required />
                                <Field label="RUT" name="rut" value={form.rut} onChange={actualizar} placeholder="12345678-9" required />
                                <Field label="Teléfono" name="telefono" value={form.telefono} onChange={actualizar} placeholder="9 1234 5678" required />
                            </div>
                            <Field label="Dirección de envío" name="direccion" value={form.direccion} onChange={actualizar} placeholder="Calle y número" />
                            <label className="block text-sm font-semibold text-slate-700">Observaciones<textarea name="observaciones" value={form.observaciones} onChange={actualizar} className="mt-2 h-24 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-slate-500" placeholder="Comentarios de entrega..." /></label>
                            <label className="block text-sm font-semibold text-slate-700">Método de pago<select name="metodoPago" value={form.metodoPago} onChange={actualizar} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none focus:border-slate-500"><option value="">Escoge un método de pago...</option><option value="Débito">Débito</option><option value="Crédito">Crédito</option></select></label>
                            <div className="border-t border-slate-200 pt-6"><h2 className="text-lg font-bold">Datos de tarjeta</h2><div className="mt-4 grid gap-5 sm:grid-cols-2">                            <Field label="Número de tarjeta" name="tarjeta" value={form.tarjeta} onChange={actualizar} placeholder="1234 5678 9012 3456" wrapperClassName="sm:col-span-2" required /><Field label="Vencimiento" name="vencimiento" value={form.vencimiento} onChange={actualizar} placeholder="MM/AA" required /><Field label="CVV" name="cvv" value={form.cvv} onChange={actualizar} required /></div></div>
                            <button type="submit" className="w-full rounded-xl bg-[#111827] px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-700">Pagar ahora</button>
                        </form>
                    </section>
                    <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><h2 className="text-lg font-bold">Resumen de compra</h2><ul className="mt-6 max-h-[350px] space-y-3 overflow-y-auto">{carrito.length ? carrito.map((item) => <li key={`${item.id}-${item.size}`} className="flex items-center justify-between gap-4 border-b border-slate-200 py-3"><div className="flex items-center gap-3"><img src={imagePath(item.image)} alt={item.name} className="h-12 w-12 rounded-xl object-cover" /><div><h3 className="text-sm font-bold">{item.name}</h3><small className="text-xs text-slate-500">Talla {item.size} · Cantidad: {item.cantidad}</small></div></div><span className="text-sm font-bold">{formatCLP(item.price * item.cantidad)}</span></li>) : <li className="py-4 text-center text-sm text-slate-400">Tu carrito está vacío.</li>}</ul><dl className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm"><Summary label="Subtotal" value={subtotal} /><Summary label="IVA (19%)" value={iva} /><div className="flex justify-between border-t border-slate-200 pt-4 text-lg font-bold"><dt>Total</dt><dd>{formatCLP(subtotal + iva)}</dd></div></dl></aside>
                </div>
            </main>
            {comprobante && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4"><div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">✓</div><h2 className="mt-4 text-center text-2xl font-bold">¡Compra finalizada!</h2><p className="mt-2 text-center text-sm text-slate-500">Tu pedido ha sido procesado exitosamente.</p><div className="mt-6 space-y-2 rounded-xl bg-slate-50 p-4 text-sm"><p><b>Nombre:</b> {comprobante.nombre} {comprobante.apellido}</p><p><b>RUT:</b> {comprobante.rut}</p><p><b>Teléfono:</b> {comprobante.telefono}</p><p><b>Dirección:</b> {comprobante.direccion || 'Retiro en tienda'}</p><p className="border-t pt-2 font-bold">Total pagado: {formatCLP(comprobante.total)}</p></div><button type="button" onClick={() => { setComprobante(null); window.location.href = '/'; }} className="mt-6 w-full rounded-xl bg-[#111827] px-6 py-3 text-sm font-semibold text-white">Volver al inicio</button></div></div>}
        </div>
    );
}

function Field({ label, name, wrapperClassName = '', ...props }) {
    return <label className={`block text-sm font-semibold text-slate-700 ${wrapperClassName}`}>{label}<input name={name} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100" {...props} /></label>;
}

function Summary({ label, value }) {
    return <div className="flex justify-between text-slate-500"><dt>{label}</dt><dd className="font-semibold text-slate-900">{formatCLP(value)}</dd></div>;
}

export default Pago;
