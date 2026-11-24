import { useEffect, useMemo, useState } from 'react';
import BlogCard from '../components/BlogCard';
import { blogService } from '../services/api';
import './Blogs.css';
const EMPTY_BLOGS = [];
const normalize = (text) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
export default function Blogs() {
 const [result, setResult] = useState(null);
 const [query, setQuery] = useState('');
 const [order, setOrder] = useState('recent');
 const [attempt, setAttempt] = useState(0);
 useEffect(() => {
  let active = true;
  blogService.getAll().then(blogs => { if (active) setResult({ attempt, blogs }); }).catch(error => { if (active) setResult({ attempt, error: error.message }); });
  return () => { active = false; };
 }, [attempt]);
 const current = result?.attempt === attempt ? result : null;
 const blogs = current?.blogs ?? EMPTY_BLOGS;
 const error = current?.error || '';
 const loading = !current;
 const filtered = useMemo(() => blogs.filter(blog => normalize(blog.title + ' ' + blog.summary).includes(normalize(query.trim()))).sort((a,b) => order === 'recent' ? b.id-a.id : a.id-b.id), [blogs, query, order]);
 const showFeature = !query.trim() && order === 'recent';
 const stories = showFeature ? filtered.slice(1) : filtered;
 return <section className="journal">
  <header className="journal-header"><div><p className="journal-eyebrow">SNEAKERX / JOURNAL</p><h1>Más que<br/><span>zapatillas.</span></h1></div><p className="journal-intro">Ideas para vestir a tu manera.<br/>Historias, detalles y cultura sneaker.</p></header>
  {loading ? <div className="journal-state" role="status">Cargando historias…</div> : error ? <div className="journal-state" role="alert"><p>{error}</p><button onClick={() => setAttempt(attempt + 1)}>Volver a intentar</button></div> : <>
   {showFeature && filtered[0] && <BlogCard blog={filtered[0]} featured />}
   <section className="journal-library" aria-labelledby="stories-heading">
    <div className="journal-toolbar"><h2 id="stories-heading">Explora el journal <span>{blogs.length.toString().padStart(2, '0')}</span></h2><div className="journal-controls"><label className="journal-search"><span aria-hidden="true">⌕</span><input type="search" aria-label="Buscar historias" placeholder="Buscar una historia…" value={query} onChange={e => setQuery(e.target.value)} /></label><select aria-label="Orden de las publicaciones" value={order} onChange={e => setOrder(e.target.value)}><option value="recent">Más recientes</option><option value="oldest">Más antiguas</option></select></div></div>
    <p className="journal-result" role="status">{query.trim() ? filtered.length + ' resultados para “' + query + '”' : 'Una nueva perspectiva en cada historia.'}</p>
    {!filtered.length && <div className="journal-state"><h3>{blogs.length ? 'No encontramos esa historia.' : 'Las próximas historias empiezan aquí.'}</h3><p>{blogs.length ? 'Prueba con otra palabra o vuelve a explorar todas las publicaciones.' : 'Vuelve pronto para descubrir nuevas publicaciones.'}</p>{query && <button onClick={() => setQuery('')}>Ver todas las historias</button>}</div>}
    <div className="journal-grid">{stories.map(blog => <BlogCard key={blog.id} blog={blog} />)}</div>
   </section>
  </>}
  <footer className="journal-footer"><strong>SNEAKERX JOURNAL</strong><span>Tu estilo. Tu próxima historia.</span><a href="/productos">Explorar zapatillas ↗</a></footer>
 </section>;
}
