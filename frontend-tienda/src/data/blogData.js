let blogs = [];

// Operaciones CRUD
export const getBlogs = () => {
  return blogs;
};

export const getBlogById = (id) => {
  return blogs.find(blog => blog.id === parseInt(id));
};

export const createBlog = (newBlog) => {
  newBlog.id = blogs.length ? blogs[blogs.length - 1].id + 1 : 1;
  blogs.push(newBlog);
  return newBlog;
};

export const updateBlog = (id, updatedData) => {
  const index = blogs.findIndex(blog => blog.id === parseInt(id));
  if (index !== -1) {
    blogs[index] = { ...blogs[index], ...updatedData };
    return blogs[index];
  }
  return null;
};

export const deleteBlog = (id) => {
  blogs = blogs.filter(blog => blog.id !== parseInt(id));
  return true;
};