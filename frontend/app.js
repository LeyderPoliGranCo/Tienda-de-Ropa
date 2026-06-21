const app = (function () {
    const state = {
        currentView: 'catalog',
        products: [],
        cart: JSON.parse(localStorage.getItem('cart')) || []
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
            productGrid: document.getElementById('product-grid'),
            cartItems: document.getElementById('cart-items'),
            adminTableBody: document.getElementById('admin-table-body')
        },
        elements: {
            cartCount: document.getElementById('cart-count'),
            cartTotal: document.getElementById('cart-total')
        },
        forms: {
            productForm: document.getElementById('admin-product-form'),
            id: document.getElementById('product-id'),
            name: document.getElementById('product-name'),
            price: document.getElementById('product-price'),
            category: document.getElementById('product-category'),
            url: document.getElementById('product-url'),
            desc: document.getElementById('product-desc')
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

    function renderCatalog() {
        if (!UI.containers.productGrid) return;
        UI.containers.productGrid.innerHTML = '';
        state.products.forEach(product => {
            const card = createProductCard(product);
            UI.containers.productGrid.appendChild(card);
        });
    }

    function renderAdminTable() {
        if (!UI.containers.adminTableBody) return;
        UI.containers.adminTableBody.innerHTML = '';
        
        state.products.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="px-4 py-3">
                    <img src="${product.url_imagen}" alt="${product.nombre}" class="rounded shadow-sm" style="width: 50px; height: 50px; object-fit: cover;">
                </td>
                <td class="py-3 fw-medium text-dark">${product.nombre}</td>
                <td class="py-3"><span class="badge bg-secondary">${product.categoria}</span></td>
                <td class="py-3 fw-bold">${formatCurrency(product.precio)}</td>
                <td class="px-4 py-3 text-end">
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-warning" onclick="app.editProduct(${product.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="app.deleteProduct(${product.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            UI.containers.adminTableBody.appendChild(tr);
        });
    }

    function saveProductLogic(productData) {
        if (productData.id) {
            const index = state.products.findIndex(p => p.id === parseInt(productData.id));
            if (index !== -1) {
                state.products[index] = { ...state.products[index], ...productData, id: parseInt(productData.id) };
            }
        } else {
            const newId = state.products.length > 0 ? Math.max(...state.products.map(p => p.id)) + 1 : 1;
            state.products.push({ ...productData, id: newId });
        }
        renderCatalog();
        renderAdminTable();
    }

    function handleProductSubmit(event) {
        event.preventDefault();
        
        const urlValue = UI.forms.url.value.trim();
        try {
            new URL(urlValue);
        } catch (_) {
            alert('URL de imagen inválida');
            return;
        }

        const productData = {
            id: UI.forms.id.value ? parseInt(UI.forms.id.value) : null,
            nombre: UI.forms.name.value.trim(),
            precio: parseInt(UI.forms.price.value),
            categoria: UI.forms.category.value,
            url_imagen: urlValue,
            descripcion: UI.forms.desc.value.trim()
        };

        saveProductLogic(productData);

        const collapseEl = document.getElementById('admin-form-collapse');
        if (collapseEl) {
            const bsCollapse = bootstrap.Collapse.getInstance(collapseEl) || new bootstrap.Collapse(collapseEl);
            bsCollapse.hide();
        }
        UI.forms.productForm.reset();
        UI.forms.id.value = '';
    }

    function editProduct(productId) {
        const product = state.products.find(p => p.id === productId);
        if (!product) return;

        UI.forms.id.value = product.id;
        UI.forms.name.value = product.nombre;
        UI.forms.price.value = product.precio;
        UI.forms.category.value = product.categoria;
        UI.forms.url.value = product.url_imagen;
        UI.forms.desc.value = product.descripcion;

        const collapseEl = document.getElementById('admin-form-collapse');
        if (collapseEl) {
            const bsCollapse = bootstrap.Collapse.getInstance(collapseEl) || new bootstrap.Collapse(collapseEl, {toggle: false});
            bsCollapse.show();
        }
    }

    function deleteProduct(productId) {
        if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
        state.products = state.products.filter(p => p.id !== productId);
        
        const itemInCart = state.cart.find(c => c.id === productId);
        if (itemInCart) {
            state.cart = state.cart.filter(c => c.id !== productId);
            saveCart();
        }

        renderCatalog();
        renderAdminTable();
    }

    function resetAdminForm() {
        if (UI.forms.productForm) {
            UI.forms.productForm.reset();
            UI.forms.id.value = '';
        }
    }

    async function fetchProducts() {
        try {
            return await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(MOCK_PRODUCTS);
                }, 300);
            });
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async function loadCatalog() {
        state.products = await fetchProducts();
        renderCatalog();
        renderAdminTable();
    }

    function updateCartUI() {
        if (!UI.elements.cartCount || !UI.elements.cartTotal || !UI.containers.cartItems) return;

        const totalItems = state.cart.reduce((sum, item) => sum + item.cantidad, 0);
        const totalPrice = state.cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

        if (totalItems > 0) {
            UI.elements.cartCount.textContent = totalItems;
            UI.elements.cartCount.classList.remove('d-none');
        } else {
            UI.elements.cartCount.classList.add('d-none');
        }

        UI.elements.cartTotal.textContent = formatCurrency(totalPrice);

        if (state.cart.length === 0) {
            UI.containers.cartItems.innerHTML = `
                <div class="h-100 d-flex flex-column justify-content-center align-items-center text-muted w-100">
                    <i class="bi bi-cart-x fs-1 mb-3 text-secondary opacity-50"></i>
                    <p class="fst-italic text-center">Tu carrito está vacío.</p>
                </div>
            `;
            return;
        }

        UI.containers.cartItems.innerHTML = '<ul class="list-group list-group-flush w-100"></ul>';
        const list = UI.containers.cartItems.querySelector('ul');

        state.cart.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item bg-transparent d-flex justify-content-between align-items-center px-0 py-3';
            li.innerHTML = `
                <div>
                    <h6 class="mb-1 text-dark fw-bold">${item.nombre}</h6>
                    <small class="text-muted fw-medium">${item.cantidad} x ${formatCurrency(item.precio)}</small>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <span class="fw-bold text-primary">${formatCurrency(item.precio * item.cantidad)}</span>
                    <button class="btn btn-sm btn-outline-danger border-0" onclick="app.removeFromCart(${item.id})">
                        <i class="bi bi-trash fs-5"></i>
                    </button>
                </div>
            `;
            list.appendChild(li);
        });
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(state.cart));
        updateCartUI();
    }

    function addToCart(productId) {
        const product = state.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = state.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.cantidad += 1;
        } else {
            state.cart.push({
                id: product.id,
                nombre: product.nombre,
                precio: product.precio,
                cantidad: 1
            });
        }
        saveCart();
    }

    function removeFromCart(productId) {
        const existingItem = state.cart.find(item => item.id === productId);
        if (!existingItem) return;

        if (existingItem.cantidad > 1) {
            existingItem.cantidad -= 1;
        } else {
            state.cart = state.cart.filter(item => item.id !== productId);
        }
        saveCart();
    }

    function processPayment() {
        if (state.cart.length === 0) return;
        alert('¡Compra realizada con éxito! Gracias por preferir Tienda MVP.');
        state.cart = [];
        saveCart();
        
        const offcanvasEl = document.getElementById('cart-modal');
        if (offcanvasEl) {
            const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl) || new bootstrap.Offcanvas(offcanvasEl);
            offcanvasInstance.hide();
        }
    }

    function testFormularioInventario() {
        try {
            const initialLength = state.products.length;
            
            const dummyProduct = {
                id: null,
                nombre: "Producto Test CRUD",
                precio: 99000,
                categoria: "Camisetas",
                url_imagen: "https://via.placeholder.com/150",
                descripcion: "Test desc"
            };

            saveProductLogic(dummyProduct);
            
            console.assert(state.products.length === initialLength + 1);
            
            const createdProduct = state.products.find(p => p.nombre === "Producto Test CRUD");
            console.assert(createdProduct !== undefined);
            
            state.products = state.products.filter(p => p.id !== createdProduct.id);
            renderCatalog();
            renderAdminTable();
        } catch (error) {
            console.error(error);
        }
    }

    function testRenderizacionCatalogo() {
        try {
            const originalHTML = UI.containers.productGrid ? UI.containers.productGrid.innerHTML : '';
            const testProducts = [
                { id: 999, nombre: "Test 1", precio: 1000, descripcion: "T", categoria: "C", url_imagen: "" },
                { id: 1000, nombre: "Test 2", precio: 2000, descripcion: "T", categoria: "C", url_imagen: "" }
            ];
            
            if (UI.containers.productGrid) {
                UI.containers.productGrid.innerHTML = '';
                testProducts.forEach(product => {
                    const card = createProductCard(product);
                    UI.containers.productGrid.appendChild(card);
                });
            }
            
            const cards = UI.containers.productGrid.querySelectorAll('.col-12.col-sm-6.col-md-4');
            console.assert(cards.length === 2);
            
            if (UI.containers.productGrid) {
                UI.containers.productGrid.innerHTML = originalHTML;
            }
        } catch (error) {
            console.error(error);
        }
    }

    function testLogicaCarrito() {
        try {
            const tempCartState = JSON.stringify(state.cart);
            state.cart = [];
            
            const dummyProduct = {
                id: 888,
                nombre: "Mock Shirt",
                precio: 50000,
                descripcion: "Mock desc",
                categoria: "Mock",
                url_imagen: ""
            };
            state.products.push(dummyProduct);
            
            addToCart(888);
            addToCart(888);
            
            console.assert(state.cart.length === 1);
            console.assert(state.cart[0].cantidad === 2);
            
            const savedCart = JSON.parse(localStorage.getItem('cart'));
            console.assert(savedCart !== null);
            console.assert(savedCart.length === 1);
            console.assert(savedCart[0].cantidad === 2);
            
            state.products = state.products.filter(p => p.id !== 888);
            
            state.cart = JSON.parse(tempCartState);
            if (state.cart.length > 0) {
                localStorage.setItem('cart', tempCartState);
            } else {
                localStorage.removeItem('cart');
            }
            updateCartUI();
        } catch (error) {
            console.error(error);
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
            testLogicaCarrito();
            testFormularioInventario();
        } catch (error) {
            console.error(error);
        }
    }

    async function init() {
        switchView('catalog');
        updateCartUI();
        await loadCatalog();
        runTests();
    }

    return {
        init,
        switchView,
        addToCart,
        removeFromCart,
        processPayment,
        resetAdminForm,
        handleProductSubmit,
        editProduct,
        deleteProduct
    };

})();

document.addEventListener('DOMContentLoaded', app.init);
