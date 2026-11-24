import { useEffect, useState } from 'react';
import { getSession } from '../data/users';
import { authService, API_BASE } from '../services/api';
const Navbar = ({ totalItems = 0, activePath = '' }) => {
 const [session,setSession]=useState(()=>getSession());
 const [user,setUser]=useState(null),[photoBlobUrl,setPhotoBlobUrl]=useState(null),[imgError,setImgError]=useState(false);
 const [accountMenuOpen,setAccountMenuOpen]=useState(false),[mobileOpen,setMobileOpen]=useState(false);
 const [searchTerm,setSearchTerm]=useState(()=>new URLSearchParams(window.location.search).get('buscar') || '');
 useEffect(()=>{let active=true, photo; const refresh=()=>setSession(getSession()); window.addEventListener('storage',refresh);
  if(localStorage.getItem('sneakerx_jwt')) (async()=>{try{const profile=await authService.getProfile();if(!active)return;setUser(profile);if(profile?.id){const response=await fetch(API_BASE+'/user/usuarios/'+profile.id+'/foto',{headers:{Authorization:'Bearer '+localStorage.getItem('sneakerx_jwt')}});if(response.ok){const blob=await response.blob();if(active){photo=URL.createObjectURL(blob);setPhotoBlobUrl(photo);}}}}catch{if(active)setUser(null);}})();
  return()=>{active=false;window.removeEventListener('storage',refresh);if(photo)URL.revokeObjectURL(photo);};
 },[]);
 const navLinks=[{name:'Inicio',path:'/'},{name:'Zapatillas',path:'/productos'},{name:'Nosotros',path:'/nosotros'},{name:'Blog',path:'/blog'},{name:'Contacto',path:'/contacto'}];
 const cerrarSesion=()=>{for(const key of ['usuarioLogueado','sneakerx_jwt','sneakerx_userId','sneakerx_username','sneakerx_role','sneakerx_user'])localStorage.removeItem(key);setSession(null);setUser(null);setAccountMenuOpen(false);window.location.href='/';};
 const buscarProductos=event=>{event.preventDefault();const q=searchTerm.trim();window.location.href=q?'/productos?buscar='+encodeURIComponent(q):'/productos';};
    return (
      <header className="shop-header" onKeyDown={e => { if(e.key === 'Escape') { setMobileOpen(false); setAccountMenuOpen(false); } }}>
       <div className="shop-announcement">SNEAKERX <span>Una nueva forma de dar el siguiente paso.</span><a href="/blog">Explora el journal ↗</a></div>
       <div className="shop-nav">
        <a href="/" className="shop-logo" aria-label="SneakerX, inicio"><img src="/img/logosnk.png" alt="SneakerX"/></a>
        <nav className="shop-desktop-links" aria-label="Navegación principal">{navLinks.map(link => <a key={link.path} href={link.path} aria-current={activePath === link.path || (activePath.startsWith('/blog') && link.path === '/blog') ? 'page' : undefined}>{link.name === 'Home' ? 'Inicio' : link.name === 'Categorías' ? 'Zapatillas' : link.name}</a>)}</nav>
        <div className="shop-nav-actions"><a className="shop-bag" href="/carrito" aria-label={'Carrito, '+totalItems+' productos'}><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 8h14l1 13H4L5 8Z M8 8V6a4 4 0 0 1 8 0v2"/></svg><span>{totalItems}</span></a>
         {session ? <div className="shop-account"><button className="shop-account-button" onClick={() => setAccountMenuOpen(!accountMenuOpen)} aria-expanded={accountMenuOpen} aria-controls="shop-account-links">{photoBlobUrl && !imgError ? <img src={photoBlobUrl} alt="" onError={() => setImgError(true)}/> : <span className="shop-avatar">{session.nombre?.slice(0,1)}</span>}<span>Mi cuenta</span><span aria-hidden="true">⌄</span></button>{accountMenuOpen && <div className="shop-account-links" id="shop-account-links"><strong>{session.nombre}</strong><small>{session.email || user?.email}</small><a href="/cuenta">Mi cuenta</a><a href="/mis-compras">Mis compras</a><a href="/editar-perfil">Editar perfil</a>{['admin','vendedor'].includes(session.rol) && <a href="/admin">Panel de gestión</a>}<button onClick={cerrarSesion}>Cerrar sesión</button></div>}</div> : <a className="shop-login" href="/login">Ingresar ↗</a>}
         <button className="shop-menu-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-controls="shop-mobile-menu" aria-label={mobileOpen?'Cerrar menú':'Abrir menú'}>{mobileOpen?'✕':'☰'}</button>
        </div>
       </div>
       <div className="shop-search-row"><form onSubmit={buscarProductos} role="search"><label htmlFor="shop-search">Encuentra tu próximo par</label><div><input id="shop-search" type="search" placeholder="Buscar zapatillas…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/><button type="submit" aria-label="Buscar productos">Buscar ↗</button></div></form><span>Estilo propio. Cada día.</span></div>
       {mobileOpen && <nav id="shop-mobile-menu" className="shop-mobile-links" aria-label="Navegación móvil">{navLinks.map(link => <a key={link.path} href={link.path} aria-current={activePath===link.path?'page':undefined}>{link.name === 'Home' ? 'Inicio' : link.name === 'Categorías' ? 'Zapatillas' : link.name}<span>↗</span></a>)}</nav>}
      </header>
    );
};

export default Navbar;