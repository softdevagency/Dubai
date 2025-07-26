
            document.addEventListener('DOMContentLoaded', function() {
    // Variables del carrito
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartButton = document.getElementById('cartButton');
    const cartButtonMobile = document.getElementById('cartButtonMobile');
    const closeCart = document.getElementById('closeCart');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutButton = document.getElementById('buyWhatsApp');  // ← ID corregido aquí
    const cartCounter = document.getElementById('cartCounter');
    const cartCounterMobile = document.getElementById('cartCounterMobile');
    
            
            // Botones para abrir/cerrar carrito
            cartButton.addEventListener('click', toggleCart);
            cartButtonMobile.addEventListener('click', toggleCart);
            closeCart.addEventListener('click', toggleCart);
            cartOverlay.addEventListener('click', toggleCart);
            
            // Botón de finalizar compra
            checkoutButton.addEventListener('click', checkout);
            
            // Agregar productos al carrito
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', addToCart);
            });
            
            // Filtros de búsqueda
            document.getElementById('searchInput').addEventListener('input', filterProducts);
            document.getElementById('categoryFilter').addEventListener('change', filterProducts);
            
            // Actualizar carrito al cargar la página
            updateCart();
            
            // Funciones
            function toggleCart() {
                cartSidebar.classList.toggle('open');
                cartOverlay.classList.toggle('open');
            }
            

            function addToCart(e) {
                const button = e.target;
                const product = {
                    id: button.dataset.id,
                    name: button.dataset.name,
                    price: parseFloat(button.dataset.price),
                    image: button.dataset.image,
                    quantity: 1
                };
                
                // Verificar si el producto ya está en el carrito
                const existingItem = cart.find(item => item.id === product.id);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push(product);
                }
                
                // Guardar en localStorage y actualizar
                saveCart();
                updateCart();
                
                // Feedback visual
                button.textContent = '✓ Agregado';
                button.classList.remove('btn-outline-primary');
                button.classList.add('btn-success');
                
                setTimeout(() => {
                    button.textContent = 'Agregar';
                    button.classList.remove('btn-success');
                    button.classList.add('btn-outline-primary');
                }, 1000);
            }
            
            function updateCart() {
                // Actualizar contador
                const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
                cartCounter.textContent = itemCount;
                cartCounterMobile.textContent = itemCount;
                
                // Actualizar lista de productos
                if (cart.length === 0) {
                    cartItemsContainer.innerHTML = '<p class="text-muted">Tu carrito está vacío</p>';
                    cartTotal.textContent = '$0.00';
                    checkoutButton.disabled = true;
                    return;
                }
                
                checkoutButton.disabled = false;
                
                let itemsHTML = '';
                let total = 0;
                
                cart.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;
                    
                    itemsHTML += `
                        <div class="cart-item" data-id="${item.id}">
                            <div class="d-flex align-items-center gap-3">
                                <img src="${item.image}" alt="${item.name}">
                                <div>
                                    <h6 class="mb-1">${item.name}</h6>
                                    <small>$${item.price.toFixed(2)} x ${item.quantity}</small>
                                </div>
                            </div>
                            <div class="d-flex align-items-center gap-2">
                                <span class="fw-bold">$${itemTotal.toFixed(2)}</span>
                                <button class="btn btn-sm btn-outline-danger remove-item">&times;</button>
                            </div>
                        </div>
                    `;
                });
                
                cartItemsContainer.innerHTML = itemsHTML;
                cartTotal.textContent = `$${total.toFixed(2)}`;
                
                // Agregar eventos a los botones de eliminar
                document.querySelectorAll('.remove-item').forEach(button => {
                    button.addEventListener('click', function() {
                        const itemId = this.closest('.cart-item').dataset.id;
                        removeFromCart(itemId);
                    });
                });
            }
            
            function removeFromCart(productId) {
                cart = cart.filter(item => item.id !== productId);
                saveCart();
                updateCart();
            }
            
            function saveCart() {
                localStorage.setItem('cart', JSON.stringify(cart));
            }
            
function checkout() {
    // Usar siempre el carrito en memoria (window.cart), no el de localStorage
    const activeCart = window.cart || [];
    if (activeCart.length === 0) return;

    // Crear mensaje para WhatsApp
    let message = `¡Hola Fragante Dubai! Quiero realizar el siguiente pedido:\n\n`;

    let subtotal = 0;
    activeCart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        message += `${index + 1}. ${item.name} - $${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}\n`;
    });

    const descuento = subtotal * 0.15;
    const totalConDescuento = subtotal - descuento;

    message += `\n*Subtotal:* $${subtotal.toFixed(2)}`;
    message += `\n*Descuento 15%:* -$${descuento.toFixed(2)}`;
    message += `\n*Total con descuento:* $${totalConDescuento.toFixed(2)}\n\n`;
    message += `Por favor, contáctenme para confirmar disponibilidad y forma de pago.`;

    // Abrir WhatsApp
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/529626923964?text=${encoded}`, '_blank');

    // Vaciar carrito en memoria y refrescar UI
    window.cart = [];
    renderCart();
}

            
            function filterProducts() {
                const searchTerm = document.getElementById('searchInput').value.toLowerCase();
                const category = document.getElementById('categoryFilter').value;
                
                document.querySelectorAll('#productsContainer .col-md-6').forEach(product => {
                    const name = product.querySelector('.card-title').textContent.toLowerCase();
                    const description = product.querySelector('.card-text:not(.text-muted)').textContent.toLowerCase();
                    const productCategory = product.dataset.category;
                    
                    const matchesSearch = name.includes(searchTerm) || description.includes(searchTerm);
                    const matchesCategory = category === 'all' || productCategory === category;
                    
                    if (matchesSearch && matchesCategory) {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                });
            }
        });
    

// Script unificado y corregido para carrito + botón Mercado Pago

// Esperar al DOM
window.addEventListener('DOMContentLoaded', () => {
  const allProducts = [...document.querySelectorAll('#productsContainer > div')];
  const productsPerPage = 10;
  let currentPage = 1;
  
  window.cart = JSON.parse(localStorage.getItem('cart')) || [];

  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartTotal = document.getElementById('cartTotal');
  const buyMP = document.getElementById('buyMercadoPago');
  const buyWA = document.getElementById('buyWhatsApp');
  const installments = document.getElementById('installmentsSelector');
  const cartCounter = document.getElementById('cartCounter');
  const cartCounterMobile = document.getElementById('cartCounterMobile');

  function paginateProducts(page = 1) {
    currentPage = page;
    allProducts.forEach((el, i) => {
      el.style.display = (i >= (page - 1) * productsPerPage && i < page * productsPerPage) ? 'block' : 'none';
    });
  }

  function createPaginationControls() {
    const container = document.querySelector('#productsContainer');
    const pages = Math.ceil(allProducts.length / productsPerPage);
    const pagination = document.createElement('div');
    pagination.className = 'd-flex justify-content-center mt-4 gap-2 flex-wrap';
    for (let i = 1; i <= pages; i++) {
      const btn = document.createElement('button');
      btn.className = 'btn btn-outline-secondary';
      btn.textContent = i;
      btn.onclick = () => paginateProducts(i);
      pagination.appendChild(btn);
    }
    container.parentNode.appendChild(pagination);
  }

  function renderCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let count = 0;

    if (window.cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="text-muted">Tu carrito está vacío</p>';
      cartTotal.textContent = '$0.00';
      buyMP.disabled = true;
      buyWA.disabled = true;
      installments.disabled = true;
      cartCounter.textContent = "0";
      cartCounterMobile.textContent = "0";
      localStorage.setItem('cart', JSON.stringify(window.cart));
      return;
    }

    window.cart.forEach((item, index) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      count += item.quantity;
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div class="d-flex align-items-center gap-3">
          <img src="${item.image}" alt="${item.name}">
          <div>
            <h6 class="mb-1"><span style='color:#007bff'>${index + 1}.</span> ${item.name}</h6>
            <small>$${item.price.toFixed(2)} x ${item.quantity}</small>
          </div>
        </div>
        <div class="d-flex align-items-center gap-2">
          <span class="fw-bold">$${subtotal.toFixed(2)}</span>
          <button class="btn btn-sm btn-outline-danger remove-item">&times;</button>
        </div>
      `;
      div.querySelector('.remove-item').onclick = () => {
        window.cart.splice(index, 1);
        renderCart();
      };
      cartItemsContainer.appendChild(div);
    });

    if (total >= 2000) {
      const envioDiv = document.createElement('div');
      envioDiv.className = 'text-success mt-3 fw-bold';
      envioDiv.textContent = '¡Felicidades! Envío gratis en esta compra.';
      cartItemsContainer.appendChild(envioDiv);
    }

    cartTotal.textContent = '$' + total.toFixed(2);
    cartCounter.textContent = count.toString();
    cartCounterMobile.textContent = count.toString();
    buyMP.disabled = false;
    buyWA.disabled = false;
    installments.disabled = false;
    localStorage.setItem('cart', JSON.stringify(window.cart));
  }

  function addToCart(button) {
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);
    const image = button.dataset.image;
    const existing = window.cart.find(p => p.name === name);
    if (existing) {
      existing.quantity += 1;
    } else {
      window.cart.push({ name, price, image, quantity: 1 });
    }
    button.textContent = '✓ Agregado';
    button.classList.remove('btn-outline-primary');
    button.classList.add('btn-success');
    setTimeout(() => {
      button.textContent = 'Agregar';
      button.classList.remove('btn-success');
      button.classList.add('btn-outline-primary');
    }, 1000);
    renderCart();
  }

  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => addToCart(button));
  });

  buyMP?.addEventListener('click', () => {
    if (!window.cart.length) return alert('Tu carrito está vacío');

    let items = window.cart.map(item => ({
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: "MXN"
    }));

    fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: "Bearer APP_USR-4844991177063586-072501-45c4905e271e7fab316fb1a2920f3805-128349064",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items,
        payment_methods: {
          installments: parseInt(installments?.value || '1')
        },
        back_urls: {
          success: "https://www.fragantedubai.com/success.html",
          failure: "https://www.fragantedubai.com/failure.html",
          pending: "https://www.fragantedubai.com/pending.html"
        },
        auto_return: "approved"
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        console.error("Respuesta de MP sin init_point:", data);
        alert("No se pudo generar el link de pago.");
      }
    })
    .catch(err => {
      console.error("Error creando preferencia:", err);
      alert("Hubo un error al conectar con Mercado Pago");
    });
  });

  // Filtros y paginación
  document.getElementById('searchInput')?.addEventListener('input', filterProducts);
  document.getElementById('categoryFilter')?.addEventListener('change', filterProducts);
  function filterProducts() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase();
    const category = document.getElementById('categoryFilter')?.value;
    allProducts.forEach(product => {
      const name = product.querySelector('.card-title').textContent.toLowerCase();
      const description = product.querySelector('.card-text').textContent.toLowerCase();
      const matchesSearch = name.includes(searchTerm) || description.includes(searchTerm);
      const matchesCategory = category === 'all' || product.dataset.category === category;
      product.style.display = (matchesSearch && matchesCategory) ? 'block' : 'none';
    });
  }

  // Inicializaciones
  createPaginationControls();
  paginateProducts();
  renderCart();
});



function changeQuantity(index, delta) {
  if (cart[index]) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    updateCartSidebar();
    saveCartToLocalStorage(); // si usas persistencia
  }
}
