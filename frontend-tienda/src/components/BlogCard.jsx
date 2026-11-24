import { imagePath } from '../services/image';
import { blogDate, readingTime } from '../services/blog';
export default function BlogCard({ blog, featured = false }) {
 return <article className={featured ? 'journal-feature' : 'journal-card'}>
  <a className="journal-story" href={'/blog/' + blog.id}>
   <div className="journal-image">{blog.image && <img src={imagePath(blog.image)} alt={blog.title} loading={featured ? 'eager' : 'lazy'} />}
    <span className="journal-arrow" aria-hidden="true">↗</span>
   </div>
   <div className="journal-card-copy">
    <div className="journal-meta"><span>{featured ? 'EN PORTADA' : 'SNEAKER CULTURE'}</span><span>{readingTime(blog.content)} min de lectura</span></div>
    <h2>{blog.title}</h2><p>{blog.summary}</p>
    <div className="journal-card-foot"><time dateTime={blog.date}>{blogDate(blog.date)}</time><span>Leer historia <span aria-hidden="true">→</span></span></div>
   </div>
  </a>
 </article>;
}
