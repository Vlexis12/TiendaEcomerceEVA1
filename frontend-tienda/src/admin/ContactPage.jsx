import { useEffect, useRef, useState } from 'react';
import { contactService } from '../services/api';

export default function ContactPage() {
    const [tab, setTab] = useState('requests');
    const [contacts, setContacts] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [msgText, setMsgText] = useState('');
    const [page, setPage] = useState(0);
    const pageSize = 5;
    const currentList = tab === 'requests' ? contacts : tickets;
    const totalPages = Math.max(1, Math.ceil(currentList.length / pageSize));
    const pageItems = currentList.slice(page * pageSize, page * pageSize + pageSize);
    const wsRef = useRef(null);

    const load = async () => {
        setLoading(true);
        try {
            const [c, t] = await Promise.all([contactService.listContacts(), contactService.listTickets()]);
            setContacts(c);
            setTickets(t);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);
    useEffect(() => { setPage(0); }, [tab]);

    useEffect(() => {
        if (!selectedTicket) return;
        let mounted = true;
        (async () => {
            const msgs = await contactService.getMessages(selectedTicket.id);
            if (mounted) setMessages(msgs);
        })();
        if (wsRef.current) { try { wsRef.current.close(); } catch {} }
        const ws = new WebSocket(`ws://localhost:8084/ws/chat?ticketId=${selectedTicket.id}`);
        wsRef.current = ws;
        ws.onmessage = (ev) => {
            try {
                const m = JSON.parse(ev.data);
                setMessages((prev) => prev.some((x) => x.id === m.id) ? prev : [...prev, m]);
            } catch {}
        };
        return () => { try { ws.close(); } catch {} };
    }, [selectedTicket]);

    const send = async (e) => {
        e.preventDefault();
        if (!msgText.trim() || !selectedTicket) return;
        const text = msgText.trim();
        setMsgText('');
        try {
            const m = await contactService.sendMessage(selectedTicket.id, { sender: 'ADMIN', senderName: 'Soporte', content: text });
            setMessages((prev) => prev.some((x) => x.id === m.id) ? prev : [...prev, m]);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <div className="px-6 py-8 lg:px-10">
                <h1 className="text-2xl font-bold mb-2">Contacto</h1>
                <p className="text-slate-500 mb-6">Solicitudes de contacto y tickets de soporte en línea.</p>
                <div className="mb-6 flex gap-2">
                    <button onClick={() => setTab('requests')} className={`rounded-xl px-4 py-2 text-sm font-semibold ${tab === 'requests' ? 'bg-[#111827] text-white' : 'bg-slate-100 text-slate-700'}`}>Solicitudes</button>
                    <button onClick={() => setTab('tickets')} className={`rounded-xl px-4 py-2 text-sm font-semibold ${tab === 'tickets' ? 'bg-[#111827] text-white' : 'bg-slate-100 text-slate-700'}`}>Tickets</button>
                </div>
                {loading ? <p className="text-slate-500">Cargando...</p> : tab === 'requests' ? (
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[720px] text-left">
                                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                                    <tr><th className="px-5 py-4">Fecha</th><th className="px-5 py-4">Nombre</th><th className="px-5 py-4">Correo</th><th className="px-5 py-4">Asunto</th><th className="px-5 py-4">Mensaje</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {contacts.length === 0 ? <tr><td colSpan="5" className="px-5 py-12 text-center text-sm text-slate-500">Sin solicitudes.</td></tr> : pageItems.map((c) => (
                                        <tr key={c.id} className="hover:bg-slate-50">
                                            <td className="px-5 py-4 text-sm text-slate-500">{c.createdAt ? new Date(c.createdAt).toLocaleString('es-CL') : ''}</td>
                                            <td className="px-5 py-4 font-semibold">{c.nombre}</td>
                                            <td className="px-5 py-4 text-sm">{c.email}</td>
                                            <td className="px-5 py-4 text-sm">{c.asunto}</td>
                                            <td className="px-5 py-4 text-sm">{c.mensaje}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {currentList.length > pageSize && (
                            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
                                <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-40">← Anterior</button>
                                <span className="text-sm text-slate-500">Página {page + 1} de {totalPages}</span>
                                <button type="button" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-40">Siguiente →</button>
                            </div>
                        )}
                    </section>
                ) : (
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px] text-left">
                                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                                    <tr><th className="px-5 py-4">Fecha</th><th className="px-5 py-4">Usuario</th><th className="px-5 py-4">Asunto</th><th className="px-5 py-4">Estado</th><th className="px-5 py-4 text-right">Chat</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {tickets.length === 0 ? <tr><td colSpan="5" className="px-5 py-12 text-center text-sm text-slate-500">Sin tickets.</td></tr> : pageItems.map((t) => (
                                        <tr key={t.id} className="hover:bg-slate-50">
                                            <td className="px-5 py-4 text-sm text-slate-500">{t.createdAt ? new Date(t.createdAt).toLocaleString('es-CL') : ''}</td>
                                            <td className="px-5 py-4"><p className="font-semibold">{t.userName}</p><p className="text-sm text-slate-500">{t.userEmail}</p></td>
                                            <td className="px-5 py-4 text-sm">{t.subject}</td>
                                            <td className="px-5 py-4 text-sm">{t.status}</td>
                                            <td className="px-5 py-4 text-right"><button onClick={() => setSelectedTicket(t)} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Abrir chat</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {currentList.length > pageSize && (
                            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
                                <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-40">← Anterior</button>
                                <span className="text-sm text-slate-500">Página {page + 1} de {totalPages}</span>
                                <button type="button" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-40">Siguiente →</button>
                            </div>
                        )}
                    </section>
                )}
            </div>

            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 px-4 py-8" role="dialog" aria-modal="true">
                    <article className="flex h-[80vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 p-5">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Ticket #{selectedTicket.id}</p>
                                <h2 className="text-xl font-bold">{selectedTicket.subject}</h2>
                                <p className="text-xs text-slate-500">Estado: {selectedTicket.status}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {selectedTicket.status !== 'CERRADO' && (
                                    <button onClick={async () => {
                                        try {
                                            const updated = await contactService.closeTicket(selectedTicket.id);
                                            setSelectedTicket(updated);
                                            setTickets((prev) => prev.map((t) => t.id === updated.id ? updated : t));
                                        } catch (e) { console.error(e); }
                                    }} className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-200">Cerrar ticket</button>
                                )}
                                <button onClick={() => setSelectedTicket(null)} className="text-2xl leading-none text-slate-400 hover:text-slate-900">×</button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-5 space-y-3">
                            {messages.map((m) => (
                                <div key={m.id} className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.sender === 'ADMIN' ? 'ml-auto bg-[#111827] text-white' : 'bg-slate-100 text-slate-900'}`}>
                                    <p className="text-xs opacity-70">{m.senderName}</p>
                                    <p>{m.content}</p>
                                </div>
                            ))}
                        </div>
                        {selectedTicket.status === 'CERRADO' ? (
                            <div className="border-t border-slate-200 p-4 text-center text-sm text-slate-500">Ticket cerrado. Solo lectura.</div>
                        ) : (
                            <form onSubmit={send} className="flex gap-2 border-t border-slate-200 p-4">
                                <input value={msgText} onChange={(e) => setMsgText(e.target.value)} placeholder="Escribe un mensaje..." className="flex-1 rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-slate-500" />
                                <button type="submit" className="rounded-xl bg-[#111827] px-4 py-2 text-sm font-semibold text-white">Enviar</button>
                            </form>
                        )}
                    </article>
                </div>
            )}
        </>
    );
}
