import { useEffect, useRef, useState } from 'react';
const items = [
 { key:'dashboard', label:'Resumen', href:'/admin', group:'TIENDA' },
 { key:'products', label:'Productos', href:'/admin/productos', group:'TIENDA' },
 { key:'purchases', label:'Ventas y boletas', href:'/admin/compras', group:'TIENDA' },
 { key:'users', label:'Clientes y equipo', href:'/admin/usuarios', group:'GESTIÓN' },
 { key:'blogs', label:'Blog', href:'/admin/blogs', group:'GESTIÓN', admin:true },
 { key:'contact', label:'Atención al cliente', href:'/admin/contacto', group:'GESTIÓN', admin:true },
];
export function AdminIcon({ name }) {
 const paths = { dashboard:'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z', products:'m12 3 9 5-9 5-9-5 9-5z M3 8v9l9 5 9-5V8 M12 13v9 M7 5l9 5', purchases:'M6 3h12v18l-3-2-3 2-3-2-3 2V3z M9 7h6 M9 11h6 M9 15h3', users:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M16 4a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-4 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0', blogs:'M4 4h16v16H4z M8 8h8 M8 12h8 M8 16h4', contact:'M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 1 1 17-5 M8 10h8 M8 14h4', menu:'M4 6h16 M4 12h16 M4 18h16', close:'m6 6 12 12 M6 18 18 6', store:'M3 10h18l-2-7H5l-2 7z M5 10v11h14V10 M9 21v-7h6v7', logout:'M9 3H4v18h5 M9 12h12 M17 8l4 4-4 4', collapse:'M4 3h16v18H4z M9 3v18 M16 8l-3 4 3 4' };
 return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.dashboard}/></svg>;
}
export default function AdminShell({ page, session, isSeller, children }) {
 const [mobile, setMobile] = useState(() => window.matchMedia?.('(max-width: 900px)').matches ?? false);
 const [open,setOpen] = useState(false), [compact,setCompact] = useState(() => localStorage.getItem('admin_sidebar_compact') === 'true');
 const toggleRef = useRef(null), sidebarRef = useRef(null), closeRef = useRef(null);
 const close = () => { setOpen(false); toggleRef.current?.focus(); };
 useEffect(() => { const media = window.matchMedia?.('(max-width: 900px)'); if(!media) return; const update = () => { setMobile(media.matches); setOpen(false); }; media.addEventListener('change',update); return () => media.removeEventListener('change',update); },[]);
 useEffect(() => { if(!mobile || !open) return; const overflow=document.body.style.overflow; document.body.style.overflow='hidden'; closeRef.current?.focus(); return () => { document.body.style.overflow=overflow; }; },[mobile,open]);
 const toggle = () => { if(mobile) setOpen(!open); else setCompact(current => { localStorage.setItem('admin_sidebar_compact',String(!current)); return !current; }); };
 const trap = event => { if(!mobile || !open) return; if(event.key === 'Escape') { event.preventDefault(); close(); } if(event.key === 'Tab') { const nodes=[...sidebarRef.current.querySelectorAll('a[href],button')].filter(el => !el.disabled && el.getClientRects().length); const first=nodes[0], last=nodes[nodes.length-1]; if(event.shiftKey && document.activeElement===first) { event.preventDefault(); last?.focus(); } else if(!event.shiftKey && document.activeElement===last) { event.preventDefault(); first?.focus(); } } };
 const links=items.filter(item => !item.admin || !isSeller).map(item => item.key==='users' && isSeller ? {...item,label:'Clientes'} : item);
 const current=links.find(item => item.key===page);
 const logout=()=>{ for(const key of ['usuarioLogueado','sneakerx_jwt','sneakerx_userId','sneakerx_username','sneakerx_role','sneakerx_user']) localStorage.removeItem(key); window.location.assign('/login'); };
 return <div data-admin-panel className={'commerce-admin'+(compact?' is-compact':'')+(open?' is-menu-open':'')}>
  <a className="admin-skip" href="#admin-workspace">Saltar al contenido</a>
  {mobile && open && <button className="admin-scrim" onClick={close} aria-label="Cerrar navegación" tabIndex={-1}/>}
  <aside id="admin-navigation" ref={sidebarRef} className="commerce-sidebar" role={mobile && open?'dialog':undefined} aria-modal={mobile && open?true:undefined} aria-label="Navegación de administración" inert={mobile && !open ? true : undefined} onKeyDown={trap}>
   <div className="admin-brand-row"><a href="/admin" className="admin-brand" aria-label="SneakerX, resumen de la tienda"><img src="/img/logosnk.png" alt="SneakerX"/></a>{mobile && <button ref={closeRef} onClick={close} className="admin-icon-button" aria-label="Cerrar menú"><AdminIcon name="close"/></button>}</div>
   <div className="admin-workspace-label"><span className="admin-store-mark"><AdminIcon name="store"/></span><div><strong>SneakerX Store</strong><small>Espacio de trabajo</small></div></div>
   <nav aria-label="Navegación del panel">{['TIENDA','GESTIÓN'].map(group=><div className="admin-nav-group" key={group}><p>{group}</p>{links.filter(item=>item.group===group).map(item=><a key={item.key} href={item.href} title={item.label} aria-label={item.label} aria-current={page===item.key?'page':undefined} className={'admin-nav-item'+(page===item.key?' is-active':'')}><AdminIcon name={item.key}/><span>{item.label}</span></a>)}</div>)}</nav>
   <div className="admin-sidebar-bottom"><a href="/" className="admin-nav-item" title="Ver tienda" aria-label="Ver tienda"><AdminIcon name="store"/><span>Ver tienda <b>↗</b></span></a><button className="admin-nav-item" onClick={logout} title="Cerrar sesión" aria-label="Cerrar sesión"><AdminIcon name="logout"/><span>Cerrar sesión</span></button><div className="admin-profile"><span className="admin-avatar">{session.nombre?.slice(0,2).toUpperCase()}</span><div><strong>{session.nombre}</strong><small>{isSeller?'Vendedor':'Administrador'}</small></div></div></div>
  </aside>
  <div className="commerce-workspace" inert={mobile && open ? true : undefined}><header className="commerce-topbar"><div><button ref={toggleRef} className="admin-icon-button" onClick={toggle} aria-label={mobile?'Abrir menú':compact?'Expandir barra lateral':'Contraer barra lateral'} aria-expanded={mobile?open:!compact} aria-controls="admin-navigation"><AdminIcon name={mobile?'menu':'collapse'}/></button><span className="admin-breadcrumb">Administración <span>/</span> <strong>{current?.label || 'Resumen'}</strong></span></div><div><span className="admin-role-tag">{isSeller?'Vendedor':'Administrador'}</span><a href="/" className="admin-top-store">Ver tienda ↗</a></div></header>
  <main id="admin-workspace" tabIndex={-1} className="admin-content">{children}</main><footer className="admin-workspace-footer"><span>SneakerX · Gestión de tienda</span><span>Hecho para seguir creciendo.</span></footer></div>
 </div>;
}
