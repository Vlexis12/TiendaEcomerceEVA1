
const BlogCard = ({ blog }) => {
  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card h-100 shadow-sm">
        <img src={blog.image} className="card-img-top" alt={blog.title} />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{blog.title}</h5>
          <p className="card-text text-muted"><small>{blog.date}</small></p>
          <p className="card-text">{blog.summary}</p>
          {}
          <a href={`/blog/${blog.id}`} className="btn btn-primary mt-auto">
            Leer más
          </a>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;    