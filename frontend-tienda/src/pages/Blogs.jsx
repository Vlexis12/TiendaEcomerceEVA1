import React, { useState, useEffect } from 'react';
import BlogCard from '../components/BlogCard';
import { getBlogs } from '../data/blogData';

const Blogs = () => {
  const [blogList, setBlogList] = useState([]);

  // Cargar datos al montar el componente
  useEffect(() => {
    const data = getBlogs();
    setBlogList(data);
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Nuestro Blog</h1>
      <div className="row">
        {blogList.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default Blogs;