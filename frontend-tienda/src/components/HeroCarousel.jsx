import { useEffect, useState } from 'react';
import { productService } from '../services/api';
import { imagePath } from '../services/image';
export default function HeroCarousel() {
 const [items,setItems] = useState([]), [index,setIndex] = useState(0);
 useEffect(() => { let active=true; productService.getAll({size:1000}).then(data => { if(active) setItems((Array.isArray(data)?data:[]).filter(p=>p.enCarrusel && (p.imagenUrl || p.image))); }).catch(()=>{}); return()=>{active=false;}; },[]);
 const item=items[index];
 if (!item) return null;
 return <section className="shop-hero" aria-label="Colección destacada"><div className="shop-hero-copy"><p className="shop-eyebrow">SNEAKERX / SELECCIÓN ESENCIAL</p><h1>Muévete<br/>a tu <em>manera.</em></h1><p>Encuentra ese par que habla de ti. Nuevas perspectivas, siluetas con carácter y estilo para todos tus días.</p><a href="/productos" className="shop-primary">Explorar zapatillas <span>↗</span></a><span className="shop-hero-note">MENOS REGLAS. MÁS PERSONALIDAD.</span></div><div className="shop-hero-visual"><span className="shop-hero-label">LA SELECCIÓN</span><img src={item ? imagePath(item.imagenUrl || item.image) : '/img/zapatillas/af1.webp'} alt={item?.nombre || item?.name || 'Zapatillas Nike Air Force 1'}/><div className="shop-hero-caption"><div><small>EN EL FOCO</small><strong>{item?.nombre || item?.name || 'Un clásico para cada día'}</strong></div>{items.length>1 && <div className="shop-carousel-controls"><button aria-label="Anterior" onClick={()=>setIndex((index-1+items.length)%items.length)}>←</button><span>{String(index+1).padStart(2,'0')} / {String(items.length).padStart(2,'0')}</span><button aria-label="Siguiente" onClick={()=>setIndex((index+1)%items.length)}>→</button></div>}</div></div></section>;
}
