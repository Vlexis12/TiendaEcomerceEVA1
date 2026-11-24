import { useEffect, useRef, useState } from 'react';
import { blogService } from '../services/api';
import { imagePath } from '../services/image';
import { blogDate, readingTime } from '../services/blog';
import './BlogsPage.css';
const empty = { title: '', summary: '', image: '', content: '' };
const normalize = text => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
export default function BlogsPage() {
 const [blogs, setBlogs] = useState([]), [form, setForm] = useState(empty), [editing, setEditing] = useState(null);
 const [error, setError] = useState(''), [notice, setNotice] = useState(''), [busy, setBusy] = useState(false), [loading, setLoading] = useState(true);
 const [query, setQuery] = useState(''), [order, setOrder] = useState('recent'), [editorOpen, setEditorOpen] = useState(false), [imageError, setImageError] = useState(false);
 const editorRef = useRef(null), newButtonRef = useRef(null);
 const load = async () => { setLoading(true); setError(''); try { setBlogs(await blogService.getAll()); } catch(e) { setError(e.message); } finally { setLoading(false); } };
 useEffect(() => { let active = true; blogService.getAll().then(data => { if(active) setBlogs(data); }).catch(e => { if(active) setError(e.message); }).finally(() => { if(active) setLoading(false); }); return () => { active = false; }; }, []);
 useEffect(() => { if(editorOpen) editorRef.current?.focus(); }, [editorOpen, editing]);
 const open = (blog = null) => { setEditing(blog); setForm(blog ? { title: blog.title, summary: blog.summary, image: blog.image, content: blog.content } : empty); setError(''); setNotice(''); setImageError(false); setEditorOpen(true); };
 const close = () => { const initial = editing || empty; const dirty = Object.keys(empty).some(key => form[key] !== initial[key]); if(dirty && !window.confirm('¿Descartar los cambios sin guardar?')) return; setEditorOpen(false); setError(''); newButtonRef.current?.focus(); };
 const save = async event => {
  event.preventDefault(); const data = Object.fromEntries(Object.entries(form).map(([key,value]) => [key,value.trim()]));
  if(Object.values(data).some(value => !value)) { setError('Completa todos los campos antes de publicar.'); return; }
  setBusy(true); setError(''); setNotice('');
  try { const saved = editing ? await blogService.update(editing.id,data) : await blogService.create(data); setBlogs(current => editing ? current.map(blog => blog.id === editing.id ? saved : blog) : [saved,...current]); setNotice(editing ? 'Cambios publicados correctamente.' : 'Tu nueva historia ya está publicada.'); setEditorOpen(false); newButtonRef.current?.focus(); } catch(e) { setError(e.message); } finally { setBusy(false); }
 };
 const remove = async blog => { if(!window.confirm('¿Eliminar “' + blog.title + '”? Esta acción no se puede deshacer.')) return; setBusy(true); setError(''); setNotice(''); try { await blogService.remove(blog.id); setBlogs(current => current.filter(item => item.id !== blog.id)); setNotice('Publicación eliminada.'); } catch(e) { setError(e.message); } finally { setBusy(false); } };
 const change = event => { const { name,value } = event.target; setForm(current => ({...current,[name]:value})); if(name === 'image') setImageError(false); };
 const visible = blogs.filter(blog => normalize(blog.title + ' ' + blog.summary).includes(normalize(query.trim()))).sort((a,b) => order === 'recent' ? b.id-a.id : a.id-b.id);
 return <section className="blog-manager">
  <header className="bm-header"><div><p className="bm-eyebrow">CONTENIDO / JOURNAL</p><h1>Historias que conectan.</h1><p>Un espacio para crear, editar y compartir tu cultura sneaker.</p></div><div className="bm-header-actions"><a href="/blog" className="bm-button bm-secondary">Ver blog ↗</a>{!editorOpen && <button ref={newButtonRef} className="bm-button bm-primary" onClick={() => open()}>＋ Nueva publicación</button>}</div></header>
  {notice && <p role="status" className="bm-notice">✓ {notice}</p>}
  {error && <p role="alert" className="bm-error">{error}{!editorOpen && <button onClick={load} disabled={busy}>Reintentar</button>}</p>}
  {editorOpen ? <form onSubmit={save} className="bm-editor">
   <div className="bm-editor-heading"><div><p className="bm-eyebrow">{editing ? 'EDITAR HISTORIA' : 'UNA NUEVA IDEA'}</p><h2 ref={editorRef} tabIndex={-1}>{editing ? 'Dale una nueva mirada.' : '¿Qué quieres contar?'}</h2></div><button type="button" className="bm-button bm-secondary" disabled={busy} onClick={close}>← Volver al listado</button></div>
   <div className="bm-editor-grid"><fieldset disabled={busy} className="bm-fields">
    <label>Título <span>{form.title.length}/255</span><input name="title" value={form.title} onChange={change} required maxLength={255} placeholder="Una historia empieza con un buen título" /></label>
    <label>Resumen <span>{form.summary.length}/1000</span><textarea name="summary" value={form.summary} onChange={change} required maxLength={1000} rows={3} placeholder="Una breve invitación a seguir leyendo…" /></label>
    <label>Imagen de portada<input name="image" value={form.image} onChange={change} required maxLength={2000} placeholder="https://… o /img/…"/><small>Usa una URL directa de imagen o una ruta local.</small></label>
    <label>Tu historia<textarea name="content" value={form.content} onChange={change} required maxLength={50000} rows={14} placeholder="Escribe aquí. Separa los párrafos con una línea en blanco."/><small>{form.content.trim() ? form.content.trim().split(/\s+/).length : 0} palabras · {readingTime(form.content)} min de lectura · {form.content.length}/50000 caracteres</small></label>
   </fieldset><aside className="bm-preview"><p className="bm-eyebrow">VISTA PREVIA DE LA TARJETA</p><div className="bm-preview-card"><div className="bm-preview-image">{form.image.trim() && !imageError ? <img src={imagePath(form.image)} alt="Vista previa de la portada" onError={() => setImageError(true)} /> : <span>{imageError ? 'No se pudo cargar la imagen. Revisa la URL.' : 'Tu portada aparecerá aquí'}</span>}</div><div className="bm-preview-copy"><span className="bm-eyebrow">SNEAKERX JOURNAL</span><h3>{form.title || 'El título de tu próxima historia'}</h3><p>{form.summary || 'Tu resumen despertará la curiosidad de quienes visiten el blog.'}</p><span className="bm-preview-read">Leer historia →</span></div></div><p className="bm-preview-tip">Al guardar, la publicación estará disponible en el blog público.</p></aside></div>
   <footer className="bm-savebar"><span>{editing ? 'Estás editando una publicación existente.' : 'Lista para encontrar a sus lectores.'}</span><div><button type="button" className="bm-button bm-secondary" onClick={close} disabled={busy}>Cancelar</button><button className="bm-button bm-primary" disabled={busy}>{busy ? 'Guardando…' : editing ? 'Guardar cambios' : 'Publicar historia ↗'}</button></div></footer>
  </form> : <>
   <div className="bm-overview"><div><strong>{String(blogs.length).padStart(2,'0')}</strong><span>Historias publicadas</span></div><p>Cada publicación es una nueva forma<br/>de inspirar a tu comunidad.</p><span className="bm-live"><i/> BLOG EN LÍNEA</span></div>
   <div className="bm-toolbar"><h2>Tus publicaciones</h2><div><input type="search" aria-label="Buscar publicaciones" placeholder="Buscar por título o resumen…" value={query} onChange={e => setQuery(e.target.value)}/><select aria-label="Ordenar publicaciones" value={order} onChange={e => setOrder(e.target.value)}><option value="recent">Más recientes</option><option value="oldest">Más antiguas</option></select></div></div>
   {loading ? <div className="bm-empty" role="status">Cargando tu contenido…</div> : <><p className="bm-count" role="status">{visible.length} {visible.length === 1 ? 'publicación' : 'publicaciones'}{query ? ' encontradas' : ' en tu journal'}</p><div className="bm-grid">{visible.map(blog => <article key={blog.id} className="bm-card"><a className="bm-card-image" href={'/blog/'+blog.id} aria-label={'Ver '+blog.title}><img src={imagePath(blog.image)} alt={blog.title} loading="lazy"/><span>Ver historia ↗</span></a><div className="bm-card-body"><div className="bm-card-meta"><span>PUBLICADO</span><time dateTime={blog.date}>{blogDate(blog.date)}</time></div><h3>{blog.title}</h3><p>{blog.summary}</p><footer><button className="bm-edit" onClick={() => open(blog)} disabled={busy} aria-label={'Editar '+blog.title}>Editar historia ↗</button><button className="bm-delete" onClick={() => remove(blog)} disabled={busy} aria-label={'Eliminar '+blog.title}>Eliminar</button></footer></div></article>)}</div>{!visible.length && <div className="bm-empty"><h3>{query ? 'No encontramos esa historia.' : 'Tu primera historia empieza aquí.'}</h3><p>{query ? 'Intenta buscar con otra palabra.' : 'Comparte ideas y dale vida al blog de tu tienda.'}</p><button className="bm-button bm-primary" onClick={() => query ? setQuery('') : open()}>{query ? 'Limpiar búsqueda' : 'Crear publicación'}</button></div>}</>}
  </>}
 </section>;
}
