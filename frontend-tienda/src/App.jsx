import { useEffect, useState } from 'react';
import { getProducts, getCart, saveCart } from './data/db';
import { Producto } from './components/Producto';
import Productos from './pages/Productos';
import Carrito from './pages/Carrito';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import Cuenta from './pages/Cuenta';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Pago from './pages/Pago';
import Navbar from './components/Navbar';
import './App.css'; // Mantenemos tu archivo CSS por si tienes algo ahí

const destacados = [
    { title: 'Nike Air Force 1', description: 'El clásico que siempre encuentra una nueva forma de destacar.', buttonText: 'Compra con un 20% de descuento', images: ['/img/zapatillas/af1.webp', '/img/zapatillas/af12.webp', '/img/zapatillas/af13.webp'] },
    { title: 'Jordan 1 Low', description: 'Un estilo clásico impecable que combina con cualquier look.', buttonText: 'Compra ahora', images: ['/img/zapatillas/jordan1.webp', '/img/zapatillas/jordan3.webp', '/img/zapatillas/jordan2.webp'] },
    { title: 'Book 2 Tigers', description: 'Diseñadas para quienes convierten el movimiento en juego.', buttonText: 'Descubre más', images: ['/img/zapatillas/book21.webp', '/img/zapatillas/book22.webp', '/img/zapatillas/book23.webp'] },
];

function App() {
    const [productos] = useState(() => getProducts());
    const [carrito, setCarrito] = useState(() => getCart());
    const [destacado, setDestacado] = useState(0);
    const [imagenDestacada, setImagenDestacada] = useState(0);

    useEffect(() => {
        const productTimer = window.setInterval(() => setDestacado((current) => (current + 1) % destacados.length), 20000);
        return () => window.clearInterval(productTimer);
    }, []);

    useEffect(() => {
        const imageTimer = window.setInterval(() => setImagenDestacada((current) => (current + 1) % destacados[destacado].images.length), 5000);
        return () => window.clearInterval(imageTimer);
    }, [destacado]);

    const agregarAlCarrito = (producto, talla = 'Unica') => {
        const nuevoCarrito = [...carrito];
        const existente = nuevoCarrito.find(item => item.id === producto.id && item.size === talla);
        
        if (existente) {
            existente.cantidad += 1;
        } else {
            nuevoCarrito.push({ ...producto, size: talla, cantidad: 1 });
        }
        
        setCarrito(nuevoCarrito);
        saveCart(nuevoCarrito);
    };

    const cambiarCantidad = (id, size, cantidad) => {
        const nuevaCantidad = Math.max(0, Number(cantidad));
        const nuevoCarrito = nuevaCantidad === 0
            ? carrito.filter((item) => !(item.id === id && item.size === size))
            : carrito.map((item) => (
                item.id === id && item.size === size
                    ? { ...item, cantidad: nuevaCantidad }
                    : item
            ));

        setCarrito(nuevoCarrito);
        saveCart(nuevoCarrito);
    };

    const eliminarDelCarrito = (id, size) => cambiarCantidad(id, size, 0);

    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

    if (window.location.pathname === '/productos') {
        return (
            <Productos
                productos={productos}
                carrito={carrito}
                onAgregarCarrito={agregarAlCarrito}
                onCambiarCantidad={cambiarCantidad}
                onEliminarProducto={eliminarDelCarrito}
            />
        );
    }

    if (window.location.pathname === '/carrito') {
        return (
            <Carrito
                carrito={carrito}
                onCambiarCantidad={cambiarCantidad}
                onEliminarProducto={eliminarDelCarrito}
            />
        );
    }

    if (window.location.pathname === '/nosotros') {
        return <Nosotros totalItems={totalItems} />;
    }

    if (window.location.pathname === '/contacto') {
        return <Contacto totalItems={totalItems} />;
    }

    if (window.location.pathname === '/cuenta') {
        return <Cuenta totalItems={totalItems} />;
    }

    if (window.location.pathname === '/login') {
        return <Login totalItems={totalItems} />;
    }

    if (window.location.pathname === '/registro') {
        return <Registro totalItems={totalItems} />;
    }

    if (window.location.pathname === '/pago') {
        return <Pago carrito={carrito} onPagoCompletado={() => { setCarrito([]); saveCart([]); }} />;
    }

    const coleccion = destacados[destacado];
    return (
        <div className="bg-[#f3f4f6] text-slate-900 antialiased min-h-screen">
            <Navbar totalItems={totalItems} activePath="/" />

            {/* Contenido Principal */}
            <main>
                {/* Sección Hero (Imagen destacada) */}
                <section className="px-3 py-3 sm:py-4 lg:px-4 lg:py-5" aria-label="Colección destacada">
                    <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="relative h-[245px] sm:h-[275px] lg:h-[300px]">
                        <img
                            src={coleccion.images[imagenDestacada]}
                            alt={coleccion.title}
                            className="absolute right-0 top-0 z-10 h-full w-[52%] object-contain object-center mix-blend-multiply sm:w-[55%] lg:w-[57%]"
                        />
                        
                        <div className="relative z-20 mx-auto flex h-full max-w-[96rem] items-center px-6 sm:px-10 lg:px-14">
                            <div className="max-w-lg text-slate-900">
                                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500 sm:text-xs">Nueva selección / 2026</p>
                                <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{coleccion.title}</h1>
                                <p className="mt-3 max-w-lg text-xs leading-6 text-slate-600 sm:text-sm">{coleccion.description}</p>
                                <div className="mt-4 flex flex-wrap items-center gap-3">
                                    <a href="/productos" className="inline-flex items-center rounded-xl bg-[#111827] px-5 py-3 text-xs font-bold text-white no-underline shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-700 sm:text-sm">{coleccion.buttonText}<span className="ml-2 text-base" aria-hidden="true">→</span></a>
                                    <div className="flex items-center gap-3" aria-label="Cambiar colección">
                                        {destacados.map((item, index) => <button key={item.title} type="button" onClick={() => setDestacado(index)} aria-label={`Mostrar ${item.title}`} className={`h-2 w-2 rounded-full transition ${index === destacado ? 'bg-[#111827] ring-2 ring-[#111827] ring-offset-2 ring-offset-white' : 'bg-slate-300 hover:bg-slate-700'}`} />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </section>

                {/* Sección Más Vendidas */}
                <section className="mx-auto max-w-[96rem] px-4 py-7 lg:px-6 lg:py-9" aria-labelledby="bestsellers-title">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Lo que todos están usando</p>
                            <h2 id="bestsellers-title" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Más vendidas</h2>
                        </div>
                        <a href="/productos" className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 no-underline shadow-sm transition hover:border-slate-900 hover:text-slate-900">Ver todo el catálogo <span className="ml-2" aria-hidden="true">→</span></a>
                    </div>
                    
                    {/* Aquí renderizamos los primeros 4 productos usando tu base de datos simulada */}
                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {productos.slice(0, 4).map(producto => (
                            <Producto 
                                key={producto.id} 
                                producto={producto} 
                                onAgregarCarrito={agregarAlCarrito} 
                            />
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-[#111827] px-6 py-8 text-slate-400 lg:px-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 SneakerX. Hecho para moverte.</p>
                    <div className="flex gap-5">
                        <a href="/nosotros" className="no-underline transition hover:text-white">Nosotros</a>
                        <a href="/productos" className="no-underline transition hover:text-white">Catálogo</a>
                        <a href="/cuenta" className="no-underline transition hover:text-white">Ingresar</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;