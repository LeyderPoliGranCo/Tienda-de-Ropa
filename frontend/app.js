const app = (function () {
    const state = {
        currentView: 'catalog',
        products: []
    };

    const MOCK_PRODUCTS = [
        {
            id: 1,
            nombre: "Camiseta Básica de Algodón",
            precio: 35000,
            descripcion: "Camiseta 100% algodón, diseño minimalista y transpirable.",
            categoria: "Camisetas",
            url_imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 2,
            nombre: "Pantalón Denim Clásico",
            precio: 120000,
            descripcion: "Jeans de corte recto con lavado medio oscuro, alta durabilidad.",
            categoria: "Pantalones",
            url_imagen: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 3,
            nombre: "Chaqueta Cortavientos",
            precio: 180000,
            descripcion: "Chaqueta ligera e impermeable con capucha, ideal para exteriores.",
            categoria: "Chaquetas",
            url_imagen: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 4,
            nombre: "Zapatillas Urbanas Blancas",
            precio: 250000,
            descripcion: "Calzado cómodo y versátil, suela antideslizante para cualquier ocasión.",
            categoria: "Calzado",
            url_imagen: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80"
        }
    ];

    const UI = {
        views: {
            catalog: document.getElementById('catalog-view'),
            admin: document.getElementById('admin-view')
        },
        navBtns: {
            catalog: document.getElementById('nav-catalog'),
            admin: document.getElementById('nav-admin')
        },
        containers: {
            productGrid: document.getElementById('product-grid')
        }
    };

    function switchView(viewName) {
        if (!UI.views[viewName]) {
            return;
        }

        Object.keys(UI.views).forEach(key => {
            UI.views[key].classList.add('d-none');
            UI.navBtns[key].classList.remove('active', 'text-primary');
        });

        UI.views[viewName].classList.remove('d-none');
        UI.navBtns[viewName].classList.add('active', 'text-primary');

        state.currentView = viewName;
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    }

    function createProductCard(product) {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-md-4';
        
        col.innerHTML = `
            <div class="card h-100 shadow-sm border-0">
                <img src="${product.url_imagen}" class="card-img-top" alt="${product.nombre}" style="height: 250px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <span class="badge bg-secondary mb-2 align-self-start">${product.categoria}</span>
                    <h5 class="card-title fw-bold text-dark">${product.nombre}</h5>
                    <p class="card-text text-muted small flex-grow-1">${product.descripcion}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="fs-5 fw-bold text-primary">${formatCurrency(product.precio)}</span>
                        <button class="btn btn-dark fw-medium d-flex align-items-center gap-2" onclick="app.addToCart(${product.id})">
                            <i class="bi bi-plus-lg"></i>
                            Agregar
                        </button>
                    </div>
                </div>
            </div>
        `;
        return col;
    }

    function renderCatalog(products) {
        if (!UI.containers.productGrid) return;
        
        UI.containers.productGrid.innerHTML = '';
        
        products.forEach(product => {
            const card = createProductCard(product);
            UI.containers.productGrid.appendChild(card);
        });
    }

    async function fetchProducts() {
        try {
            return await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(MOCK_PRODUCTS);
                }, 300);
            });
        } catch (error) {
            return [];
        }
    }

    async function loadCatalog() {
        state.products = await fetchProducts();
        renderCatalog(state.products);
    }

    function addToCart(productId) {
    }

    function testRenderizacionCatalogo() {
        try {
            const originalHTML = UI.containers.productGrid ? UI.containers.productGrid.innerHTML : '';
            
            const testProducts = [
                {
                    id: 999,
                    nombre: "Test Product 1",
                    precio: 1000,
                    descripcion: "Test desc",
                    categoria: "Test",
                    url_imagen: "https://via.placeholder.com/150"
                },
                {
                    id: 1000,
                    nombre: "Test Product 2",
                    precio: 2000,
                    descripcion: "Test desc",
                    categoria: "Test",
                    url_imagen: "https://via.placeholder.com/150"
                }
            ];
            
            renderCatalog(testProducts);
            
            const cards = UI.containers.productGrid.querySelectorAll('.col-12.col-sm-6.col-md-4');
            console.assert(cards.length === 2);
            
            if (UI.containers.productGrid) {
                UI.containers.productGrid.innerHTML = originalHTML;
            }
        } catch (error) {
        }
    }

    function runTests() {
        try {
            console.assert(UI.views.catalog !== null);
            console.assert(UI.views.admin !== null);

            switchView('admin');
            console.assert(UI.views.catalog.classList.contains('d-none') === true);
            console.assert(UI.views.admin.classList.contains('d-none') === false);
            console.assert(state.currentView === 'admin');
            
            switchView('catalog');
            console.assert(UI.views.admin.classList.contains('d-none') === true);
            console.assert(UI.views.catalog.classList.contains('d-none') === false);
            console.assert(state.currentView === 'catalog');

            testRenderizacionCatalogo();
        } catch (error) {
        }
    }

    function init() {
        switchView('catalog');
        loadCatalog();
        runTests();
    }

    return {
        init,
        switchView,
        addToCart
    };

})();

document.addEventListener('DOMContentLoaded', app.init);
