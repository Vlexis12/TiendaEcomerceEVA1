import { useEffect, useRef, useState } from 'react';
import { contactService } from '../services/api';

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [started, setStarted] = useState(true);
    const [humanMode, setHumanMode] = useState(false);
    const [ticket, setTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [needsAgent, setNeedsAgent] = useState(false);
    const [collectingContact, setCollectingContact] = useState(false);
    const [loading, setLoading] = useState(false);
    const wsRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        const s = localStorage.getItem('usuarioLogueado');
        if (s) {
            try {
                const u = JSON.parse(s);
                setName(u.nombre || '');
                setEmail(u.email || '');
                setLoggedIn(true);
                setStarted(true);
            } catch {}
        }
        const saved = localStorage.getItem('sneakerx_chat_ticket');
        if (saved) {
            try {
                const t = JSON.parse(saved);
                setTicket(t);
                setHumanMode(true);
                setStarted(true);
            } catch {}
        }
    }, []);

    useEffect(() => {
        if (!ticket || !humanMode) return;
        let mounted = true;
        (async () => {
            const msgs = await contactService.getMessages(ticket.id);
            if (mounted) setMessages(msgs);
        })();
        const ws = new WebSocket(`ws://localhost:8084/ws/chat?ticketId=${ticket.id}`);
        wsRef.current = ws;
        ws.onmessage = (ev) => {
            try {
                const m = JSON.parse(ev.data);
                setMessages((prev) => prev.some((x) => x.id === m.id) ? prev : [...prev, m]);
                if (m.sender === 'SYSTEM') {
                    setTicket((t) => {
                        if (!t) return t;
                        const updated = { ...t, status: 'CERRADO' };
                        localStorage.setItem('sneakerx_chat_ticket', JSON.stringify(updated));
                        return updated;
                    });
                }
            } catch {}
        };
        return () => { try { ws.close(); } catch {} };
    }, [ticket, humanMode]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, open]);

    useEffect(() => {
        if (ticket?.status === 'CERRADO') {
            const timer = setTimeout(() => {
                localStorage.removeItem('sneakerx_chat_ticket');
                setTicket(null);
                setMessages([]);
                setHumanMode(false);
                setStarted(true);
                setText('');
                setNeedsAgent(false);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [ticket?.status]);

    const escalate = async () => {
        const n = name.trim() || 'Cliente';
        const e = email.trim() || 'anonimo@sneakerx.cl';
        setName(n);
        setEmail(e);
        setLoading(true);
        try {
            const t = await contactService.createTicket({ userEmail: e, userName: n, subject: 'Soporte en línea' });
            setTicket(t);
            setHumanMode(true);
            setNeedsAgent(false);
            localStorage.setItem('sneakerx_chat_ticket', JSON.stringify(t));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const send = async (ev, override) => {
        if (ev) ev.preventDefault();
        const content = (override || text).trim();
        if (!content) return;
        setText('');
        if (humanMode && ticket) {
            if (ticket.status === 'CERRADO') return;
            try {
                const m = await contactService.sendMessage(ticket.id, { sender: 'USER', senderName: name || 'Cliente', content });
                setMessages((prev) => prev.some((x) => x.id === m.id) ? prev : [...prev, m]);
            } catch (err) {
                console.error(err);
                if (String(err?.message || err).includes('409')) {
                    setTicket((t) => (t ? { ...t, status: 'CERRADO' } : t));
                }
            }
        } else {
            const userMsg = { id: Date.now(), sender: 'USER', senderName: name || 'Cliente', content };
            setMessages((prev) => [...prev, userMsg]);
            const lower = content.toLowerCase();
            if (lower.includes('agente') || lower.includes('administrador') || lower.includes('soporte') || lower.includes('humano')) {
                setNeedsAgent(true);
                return;
            }
            try {
                const history = messages.map((m) => `${m.sender === 'USER' ? 'Usuario' : 'Asistente'}: ${m.content}`).join('\n');
                const res = await contactService.chatIA({ message: content, history });
                const reply = res?.reply || '';
                const clean = reply.replace('[ESCALAR]', '').trim();
                const aiMsg = { id: Date.now() + 1, sender: 'IA', senderName: 'Asistente SneakerX', content: clean || '¿Puedo ayudarte con algo más?' };
                setMessages((prev) => [...prev, aiMsg]);
                if (reply.includes('[ESCALAR]')) setNeedsAgent(true);
            } catch (err) {
                console.error(err);
                setMessages((prev) => [...prev, { id: Date.now() + 2, sender: 'IA', senderName: 'Asistente', content: 'Ocurrió un error. Puedes hablar con un agente.' }]);
                setNeedsAgent(true);
            }
        }
    };

    const isClosed = ticket?.status === 'CERRADO';

    const requestAgent = () => {
        if (loggedIn) {
            escalate();
        } else {
            setCollectingContact(true);
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen((o) => !o)}
                style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white shadow-2xl transition hover:scale-110"
                aria-label="Chat de soporte"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </button>

            {open && (
                <div style={{ position: 'fixed', bottom: '96px', right: '24px', zIndex: 9999 }} className="flex h-[520px] w-[360px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
                    <div className="flex items-center justify-between bg-gradient-to-r from-indigo-500 to-pink-500 px-4 py-3 text-white">
                        <div>
                            <p className="font-bold">Asistente SneakerX</p>
                            <p className="text-xs opacity-90">{humanMode ? 'Soporte en línea' : 'IA + Soporte'}</p>
                        </div>
                        <button onClick={() => setOpen(false)} className="text-xl leading-none">×</button>
                    </div>

                    {humanMode && isClosed ? (
                        <>
                            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50">
                                {messages.map((m) => (
                                    <div key={m.id} className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.sender === 'USER' ? 'ml-auto bg-indigo-500 text-white' : m.sender === 'SYSTEM' ? 'mx-auto bg-amber-100 text-amber-900' : 'bg-white text-slate-900 shadow'}`}>
                                        <p className="text-xs opacity-70">{m.senderName}</p>
                                        <p>{m.content}</p>
                                    </div>
                                ))}
                                <div ref={bottomRef} />
                            </div>
                            <div className="border-t border-slate-200 p-3 text-center">
                                <p className="mb-2 text-sm text-slate-500">Ticket cerrado. Volviendo en 10 segundos...</p>
                            </div>
                        </>
                    ) : humanMode ? (
                        <>
                            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50">
                                {messages.map((m) => (
                                    <div key={m.id} className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.sender === 'USER' ? 'ml-auto bg-indigo-500 text-white' : m.sender === 'SYSTEM' ? 'mx-auto bg-amber-100 text-amber-900' : 'bg-white text-slate-900 shadow'}`}>
                                        <p className="text-xs opacity-70">{m.senderName}</p>
                                        <p>{m.content}</p>
                                    </div>
                                ))}
                                <div ref={bottomRef} />
                            </div>
                            <form onSubmit={send} className="flex gap-2 border-t border-slate-200 p-3">
                                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribe..." className="flex-1 rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-indigo-500" />
                                <button type="submit" className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white">➤</button>
                            </form>
                        </>
                    ) : collectingContact ? (
                        <form onSubmit={(e) => { e.preventDefault(); escalate(); }} className="flex flex-1 flex-col gap-3 p-4">
                            <p className="text-sm text-slate-600">Para conectarte con un agente, ingresa tus datos.</p>
                            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" required className="rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-indigo-500" />
                            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Tu correo" type="email" required className="rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-indigo-500" />
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setCollectingContact(false)} className="flex-1 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Cancelar</button>
                                <button type="submit" disabled={loading} className="flex-1 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                                    {loading ? 'Conectando...' : 'Conectar'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50">
                                {messages.length === 0 && (
                                    <div className="rounded-2xl bg-white p-3 text-sm text-slate-600 shadow">
                                        ¡Hola! Soy el asistente de SneakerX. Pregúntame sobre productos, tallas, envíos o pagos.
                                    </div>
                                )}
                                {messages.map((m) => (
                                    <div key={m.id} className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.sender === 'USER' ? 'ml-auto bg-indigo-500 text-white' : 'bg-white text-slate-900 shadow'}`}>
                                        <p className="text-xs opacity-70">{m.senderName}</p>
                                        <p>{m.content}</p>
                                    </div>
                                ))}
                                {needsAgent && (
                                    <div className="rounded-2xl bg-amber-50 p-3 text-sm text-amber-900">
                                        ¿Quieres hablar con un agente humano?
                                        <button onClick={requestAgent} disabled={loading} className="ml-2 rounded-lg bg-amber-500 px-3 py-1 text-xs font-semibold text-white disabled:opacity-50">
                                            {loading ? 'Conectando...' : 'Hablar con agente'}
                                        </button>
                                    </div>
                                )}
                                <div ref={bottomRef} />
                            </div>
                            <div className="flex flex-wrap gap-2 border-t border-slate-100 p-2">
                                {['Productos', 'Tallas', 'Envíos', 'Pagos', 'Devoluciones', 'Hablar con agente'].map((q) => (
                                    <button key={q} onClick={() => send(null, q === 'Hablar con agente' ? 'Quiero hablar con un agente' : q)} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-indigo-100 hover:text-indigo-700">
                                        {q}
                                    </button>
                                ))}
                            </div>
                            <form onSubmit={send} className="flex gap-2 border-t border-slate-200 p-3">
                                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribe tu pregunta..." className="flex-1 rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-indigo-500" />
                                <button type="submit" className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white">➤</button>
                            </form>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
