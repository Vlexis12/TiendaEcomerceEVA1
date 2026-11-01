import { useEffect, useRef, useState } from 'react';
import { contactService } from '../services/api';

const PILL = { borderRadius: '9999px' };
const CIRCLE = { borderRadius: '50%' };

const QUICK_REPLIES = ['Productos', 'Tallas', 'Envíos', 'Pagos', 'Devoluciones', 'Hablar con agente'];

/* ---------- Iconos ---------- */
const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);
const CloseIcon = ({ className = 'h-5 w-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`block ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
);
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="block h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6" />
    </svg>
);

/* ---------- Piezas de UI ---------- */
function Bubble({ m }) {
    if (m.sender === 'SYSTEM') {
        return (
            <div className="flex justify-center">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500" style={PILL}>{m.content}</span>
            </div>
        );
    }
    const mine = m.sender === 'USER';
    return (
        <div className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
            {!mine && <span className="mb-1 ml-3 text-[11px] font-medium text-slate-400">{m.senderName}</span>}
            <div
                className={`max-w-[82%] whitespace-pre-wrap break-words px-4 py-2.5 text-[13.5px] leading-relaxed ${
                    mine
                        ? 'rounded-[20px] rounded-br-md bg-slate-900 text-white'
                        : 'rounded-[20px] rounded-bl-md bg-slate-100 text-slate-800'
                }`}
            >
                {m.content}
            </div>
        </div>
    );
}

function TypingDots() {
    return (
        <div className="flex items-start">
            <div className="flex items-center gap-1 rounded-[20px] rounded-bl-md bg-slate-100 px-4 py-3">
                {[0, 1, 2].map((i) => (
                    <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${i * 120}ms`, borderRadius: '50%' }} />
                ))}
            </div>
        </div>
    );
}

function Composer({ value, onChange, onSubmit, placeholder }) {
    const empty = !value.trim();
    return (
        <form onSubmit={onSubmit} className="px-4 pb-4 pt-2">
            <div className="flex items-center gap-2 rounded-full bg-slate-100 py-1.5 pl-5 pr-1.5 transition focus-within:bg-white focus-within:ring-1 focus-within:ring-slate-300" style={PILL}>
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent text-[13.5px] text-slate-800 outline-none placeholder:text-slate-400"
                />
                <button
                    type="submit"
                    disabled={empty}
                    aria-label="Enviar mensaje"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white transition hover:bg-slate-700 disabled:cursor-default disabled:opacity-30" style={CIRCLE}
                >
                    <SendIcon />
                </button>
            </div>
        </form>
    );
}

const inputClass =
    'w-full rounded-2xl border border-transparent bg-slate-100 px-4 py-3 text-[13.5px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white';

/* ---------- Componente principal ---------- */
export default function ChatWidget() {
    const [open, setOpen] = useState(false);
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
    const [thinking, setThinking] = useState(false);
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
            } catch {}
        }
        const saved = localStorage.getItem('sneakerx_chat_ticket');
        if (saved) {
            try {
                const t = JSON.parse(saved);
                setTicket(t);
                setHumanMode(true);
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
                setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
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
        return () => {
            mounted = false;
            try { ws.close(); } catch {}
        };
    }, [ticket, humanMode]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, open, thinking, needsAgent]);

    useEffect(() => {
        if (ticket?.status === 'CERRADO') {
            const timer = setTimeout(() => {
                localStorage.removeItem('sneakerx_chat_ticket');
                setTicket(null);
                setMessages([]);
                setHumanMode(false);
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
                setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
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
            setThinking(true);
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
            } finally {
                setThinking(false);
            }
        }
    };

    const isClosed = ticket?.status === 'CERRADO';

    const requestAgent = () => {
        if (loggedIn) escalate();
        else setCollectingContact(true);
    };

    const MessageArea = ({ children }) => (
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {children}
            <div ref={bottomRef} />
        </div>
    );

    return (
        <>
            {/* Botón flotante */}
            <button
                onClick={() => setOpen((o) => !o)}
                style={{ position: 'fixed', bottom: '64px', right: '24px', zIndex: 9999, borderRadius: '50%' }}
                className="relative flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-[0_10px_30px_-8px_rgba(15,23,42,0.5)] transition duration-200 hover:scale-105 hover:bg-slate-800 active:scale-95"
                aria-label={open ? 'Cerrar chat de soporte' : 'Abrir chat de soporte'}
                aria-expanded={open}
            >
                <span className={`absolute inset-0 flex items-center justify-center transition duration-200 ${open ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}><ChatIcon /></span>
                <span className={`absolute inset-0 flex items-center justify-center transition duration-200 ${open ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'}`}><CloseIcon className="h-6 w-6" /></span>
            </button>

            {/* Panel */}
            <div
                role="dialog"
                aria-label="Chat de soporte"
                aria-hidden={!open}
                style={{
                    position: 'fixed',
                    bottom: '132px',
                    right: '24px',
                    zIndex: 9999,
                    width: '380px',
                    height: '560px',
                    maxWidth: 'calc(100vw - 32px)',
                    maxHeight: 'calc(100vh - 156px)',
                }}
                className={`flex origin-bottom-right flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_24px_70px_-20px_rgba(15,23,42,0.35)] ring-1 ring-slate-200/70 transition duration-200 ${
                    open ? 'visible translate-y-0 scale-100 opacity-100' : 'invisible pointer-events-none translate-y-3 scale-95 opacity-0'
                }`}
            >
                {/* Encabezado */}
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-200 bg-slate-50 text-[14px] font-bold text-slate-700" style={CIRCLE}>
                            S
                        </div>
                        <div>
                            <p className="text-[14px] font-semibold tracking-tight text-slate-900">Asistente SneakerX</p>
                            <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-slate-500">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" style={CIRCLE} />
                                {humanMode ? 'Soporte en línea' : 'IA · Soporte'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Cerrar"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" style={CIRCLE}
                    >
                        <CloseIcon className="h-4 w-4" />
                    </button>
                </div>

                {/* Contenido */}
                {humanMode && isClosed ? (
                    <>
                        <MessageArea>
                            {messages.map((m) => <Bubble key={m.id} m={m} />)}
                        </MessageArea>
                        <p className="border-t border-slate-100 px-5 py-4 text-center text-[12px] text-slate-400">
                            Conversación finalizada · volviendo al asistente en 10 s
                        </p>
                    </>
                ) : humanMode ? (
                    <>
                        <MessageArea>
                            {messages.map((m) => <Bubble key={m.id} m={m} />)}
                        </MessageArea>
                        <Composer value={text} onChange={setText} onSubmit={send} placeholder="Escribe un mensaje…" />
                    </>
                ) : collectingContact ? (
                    <form
                        onSubmit={(e) => { e.preventDefault(); escalate(); }}
                        className="flex flex-1 flex-col justify-center gap-3 px-6"
                    >
                        <div className="mb-1 text-center">
                            <p className="text-[15px] font-semibold tracking-tight text-slate-900">Hablemos con un agente</p>
                            <p className="mt-1 text-[12.5px] text-slate-500">Déjanos tus datos para conectarte.</p>
                        </div>
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" required autoComplete="name" className={inputClass} />
                        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Tu correo" type="email" required autoComplete="email" className={inputClass} />
                        <div className="mt-1 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setCollectingContact(false)}
                                className="flex-1 rounded-lg bg-slate-100 px-4 py-2.5 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-200" style={PILL}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 rounded-lg bg-slate-900 px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50" style={PILL}
                            >
                                {loading ? 'Conectando…' : 'Conectar'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <MessageArea>
                            {messages.length === 0 && (
                                <div className="flex h-full min-h-[200px] flex-col items-center justify-center px-6 text-center">
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500" style={CIRCLE}>
                                        <ChatIcon />
                                    </div>
                                    <p className="text-[15px] font-semibold tracking-tight text-slate-900">¡Hola! ¿En qué te ayudo?</p>
                                    <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500">
                                        Pregúntame sobre productos, tallas, envíos o pagos.
                                    </p>
                                </div>
                            )}
                            {messages.map((m) => <Bubble key={m.id} m={m} />)}
                            {thinking && <TypingDots />}
                            {needsAgent && (
                                <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                                    <p className="text-[12.5px] text-slate-600">¿Prefieres hablar con una persona?</p>
                                    <button
                                        onClick={requestAgent}
                                        disabled={loading}
                                        className="inline-flex h-8 shrink-0 items-center rounded-lg bg-slate-900 px-3.5 text-[12px] leading-none font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50" style={PILL}
                                    >
                                        {loading ? 'Conectando…' : 'Hablar con agente'}
                                    </button>
                                </div>
                            )}
                        </MessageArea>
                        <div className="flex flex-wrap justify-center gap-1.5 px-4 pb-2 pt-1">
                            {QUICK_REPLIES.map((q) => (
                                <button
                                    key={q}
                                    onClick={() => send(null, q === 'Hablar con agente' ? 'Quiero hablar con un agente' : q)}
                                    className="inline-flex h-6 shrink-0 items-center rounded-lg border border-slate-200 px-2.5 text-[10px] leading-none font-medium text-slate-600 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white" style={PILL}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                        <Composer value={text} onChange={setText} onSubmit={send} placeholder="Escribe tu pregunta…" />
                    </>
                )}
            </div>
        </>
    );
}
