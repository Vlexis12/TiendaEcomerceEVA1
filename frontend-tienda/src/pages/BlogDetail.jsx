import { useEffect, useState } from 'react';
import { blogService } from '../services/api';
import { imagePath } from '../services/image';
import { blogDate, readingTime } from '../services/blog';
import './Blogs.css';
export default function BlogDetail({ id }) {
 const [result, setResult] = useState(null), [message, setMessage] = useState(''), [progress, setProgress] = useState(0);
 useEffect(() => {
  let active = true;
  blogService.getById(id).then(blog => { if (active) setResult({ id, blog }); }).catch(error => { if (active) setResult({ id, error: error.message }); });
  return () => { active = false; };
 }, [id]);
 const current = result?.id === id ? result : null;
 const blog = current?.blog;
 const error = current?.error || '';
 useEffect(() => {
  const update = () => { const max = document.documentElement.scrollHeight - window.innerHeight; setProgress(max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 100); };
  update(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update);
  return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
 }, [blog]);
 const share = async () => { try { await navigator.clipboard.writeText(window.location.href); setMessage('Enlace copiado.'); } catch { setMessage('Puedes copiar la dirección desde la barra del navegador.'); } };
 return <section className="journal journal-detail"><div className="journal-progress" style={{ width: progress + '%' }} aria-hidden="true"/><a className="journal-back" href="/blog">← Todas las historias</a>
  {error ? <div className="journal-state" role="alert">{error}</div> : !blog ? <p className="journal-state" role="status">Cargando historia…</p> : <article>
   <header className="journal-article-header"><p className="journal-eyebrow">SNEAKERX / JOURNAL</p><h1>{blog.title}</h1><p className="journal-deck">{blog.summary}</p><div className="journal-article-meta"><span><time dateTime={blog.date}>{blogDate(blog.date)}</time> · {readingTime(blog.content)} min de lectura</span><button onClick={share}>Copiar enlace ↗</button></div><p className="journal-share-status" role="status">{message}</p></header>
   {blog.image && <div className="journal-cover"><img src={imagePath(blog.image)} alt={blog.title} onLoad={() => window.dispatchEvent(new Event('resize'))}/></div>}
   <div className="journal-body">{blog.content.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}<div className="journal-end"><span>FIN DE LA HISTORIA</span><a href="/blog">Descubre más historias →</a></div></div>
  </article>}
 </section>;
}
