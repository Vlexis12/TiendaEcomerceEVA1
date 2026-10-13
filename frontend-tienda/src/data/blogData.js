let blogs = [
  {
    id: 1,
    title: "La historia de las Nike Air Force 1",
    summary: "Conoce cómo este modelo clásico revolucionó el básquetbol y se convirtió en un ícono indiscutido de la moda urbana.",
    content: "Las Nike Air Force 1 nacieron en 1982 como zapatillas de básquetbol, siendo las primeras en incorporar la tecnología Nike Air. Con el paso de los años, trascendieron las canchas para convertirse en un elemento fundamental de la cultura urbana y el hip-hop. Hoy en día, las AF1 siguen siendo uno de los modelos más vendidos y versátiles, combinando literalmente con cualquier estilo. Su diseño atemporal, sus revestimientos con costuras duraderas y sus acabados impecables hacen que nunca pasen de moda.",
    image: "/img/zapatillas/af1.webp", // Usando las imágenes que ya tienes en tu carpeta public
    date: "2026-10-05"
  },
  {
    id: 2,
    title: "Jordan 1 Low: El par imprescindible de la temporada",
    summary: "Descubre por qué las Jordan 1 en su silueta de perfil bajo dominan las calles y combinan con todo.",
    content: "Las Air Jordan 1 Low ofrecen toda la historia y el legado del modelo original diseñado para Michael Jordan, pero en una silueta más relajada e ideal para el uso diario. Destacan por su extrema comodidad, la increíble variedad de paletas de colores (colorways) y la facilidad para combinarlas tanto con shorts en verano como con pantalones largos. Si estás buscando iniciar tu colección de zapatillas, este es definitivamente el par con el que debes empezar.",
    image: "/img/zapatillas/jordan1.webp",
    date: "2026-10-10"
  },
  {
    id: 3,
    title: "Guía para limpiar tus sneakers",
    summary: "Aprende los mejores trucos y consejos para mantener tus zapatillas favoritas como recién salidas de la caja.",
    content: "Mantener tus zapatillas limpias es clave para alargar su vida útil. Empieza por quitar los cordones y lavarlos por separado en agua tibia. Usa un cepillo de cerdas suaves para retirar el polvo superficial de la zapatilla. Luego, con una mezcla de agua y unas gotas de jabón neutro, frota suavemente las manchas. Utiliza un cepillo más duro únicamente para la suela. Por último, evita meterlas en la lavadora o secadora, ya que el calor excesivo puede derretir el pegamento y deformar los materiales.",
    image: "/img/zapatillas/book21.webp",
    date: "2026-10-12"
  }
];

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