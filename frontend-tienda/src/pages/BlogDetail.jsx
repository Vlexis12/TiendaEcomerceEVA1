import React, { useState, useEffect } from 'react';
import { getBlogById } from '../data/blogData';

// Recibe "id" como propiedad desde App.jsx
const BlogDetail = ({ id }) => { 
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const data = getBlogById(id);
    setBlog(data);
  }, [id]);

  if (!blog) {
    return <div className="container mt-5"><h2>Blog no encontrado</h2></div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <a href="/blog" className="btn btn-outline-secondary mb-3">&larr; Volver al Blog</a>
          <img src={blog.image} className="img-fluid rounded mb-4 w-100" alt={blog.title} />
          <h1 className="mb-3">{blog.title}</h1>
          <p className="text-muted">Publicado el: {blog.date}</p>
          <hr />
          <div className="content mt-4">
            <p>{blog.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;