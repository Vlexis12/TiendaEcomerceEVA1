const products = [
    {
        title: "Nike Air Force 1",
        description: "El fulgor vive en el Nike Air Force 1 ’07, el modelo original de básquetbol que da un toque novedoso a las características más recordadas: revestimientos con costuras duraderas, acabados impecables y la cantidad perfecta de destellos para que brilles.",
        buttonText: "Compra con un 20% de descuento",
        images: [
            "img/zapatillas/af1.webp",
            "img/zapatillas/af12.webp",
            "img/zapatillas/af13.webp"
        ]
    },
    {
        title: "Jordan 1 Low",
        description: "Inspiradas en los originales que se lanzaron en 1985, las Air Jordan 1 Low ofrecen un estilo clásico impecable que se ve familiar, pero siempre viene renovado. Con un diseño icónico que combina a la perfección con cualquier look, estas zapatillas garantizan que siempre lucirás excelente.",
        buttonText: "Buy Now",
        images: [
            "img/zapatillas/jordan1.webp",
            "img/zapatillas/jordan3.webp",
            "img/zapatillas/jordan2.webp"
        ]
    },
    {
        title: "Book 2 \"Tigers\"",
        description: "Devin Booker representa The Mitten con orgullo. Esta edición especial del Book 2 rinde homenaje a su estado natal luciendo la icónica D en inglés antiguo que cualquier fanático del béisbol reconoce, simbolizando la fortaleza y dureza que encarna el 313.",
        buttonText: "Discover More",
         images: [
            "img/zapatillas/book21.webp",
            "img/zapatillas/book22.webp",
            "img/zapatillas/book23.webp"
        ]
    }
];
let currentProductIndex = 0;
let currentImageIndex = 0;
let productTimer;
let imageTimer;
const elTitle = document.getElementById('product-title');
const elDesc = document.getElementById('product-desc');
const elBtn = document.getElementById('product-btn');
const elImage = document.getElementById('product-image');
const elDots = document.getElementById('product-dots');
function loadProduct(index) {
    currentProductIndex = index;
    const prod = products[index];
    elTitle.style.opacity = 0;
    elDesc.style.opacity = 0;
    
    setTimeout(() => {
        elTitle.textContent = prod.title;
        elDesc.textContent = prod.description;
        elBtn.textContent = prod.buttonText; 
        
        elTitle.style.opacity = 1;
        elDesc.style.opacity = 1;
    }, 300);
    currentImageIndex = 0;
    loadImage();
    renderDots();
    clearInterval(imageTimer);
    imageTimer = setInterval(nextImage, 5000);
}
function loadImage() {
    const prod = products[currentProductIndex];
    
    elImage.style.opacity = 0;
    
    setTimeout(() => {
        elImage.src = prod.images[currentImageIndex];
        elImage.style.opacity = 1;
    }, 300); 
}
function renderDots() {
    elDots.innerHTML = '';
    products.forEach((_, idx) => {
        const dot = document.createElement('button');
        
        if (idx === currentProductIndex) {
            dot.className = "w-2 h-2 bg-blue-500 rounded-full focus:outline-none ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-50 transition-all duration-300";
        } else {
            dot.className = "w-2 h-2 bg-gray-300 rounded-full focus:outline-none hover:bg-blue-400 transition-all duration-300";
        }
        
        dot.onclick = () => {
            resetTimers();
            loadProduct(idx);
        };
        elDots.appendChild(dot);
    });
}
function nextImage() {
    const prod = products[currentProductIndex];
    currentImageIndex = (currentImageIndex + 1) % prod.images.length;
    loadImage();
}
function nextProduct() {
    const nextIndex = (currentProductIndex + 1) % products.length;
    loadProduct(nextIndex);
}
function resetTimers() {
    clearInterval(productTimer);
    productTimer = setInterval(nextProduct, 20000); 
}
loadProduct(0);
resetTimers();
