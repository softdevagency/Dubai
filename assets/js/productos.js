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
            const checkoutButton = document.getElementById('checkoutButton');
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
                if (cart.length === 0) return;
                
                // Crear mensaje para WhatsApp
                let message = `¡Hola Fragante Dubai! Quiero realizar el siguiente pedido:\n\n`;
                
                let total = 0;
                cart.forEach((item, index) => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;
                    
                    message += `${index + 1}. ${item.name} - $${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}\n`;
                });
                
                message += `\n*Total:* $${total.toFixed(2)}\n\n`;
                message += `Por favor, contáctenme para confirmar disponibilidad y forma de pago.`;
                
                // Codificar mensaje para URL
                const encodedMessage = encodeURIComponent(message);
                const whatsappUrl = `https://wa.me/529626923964?text=${encodedMessage}`;
                
                // Abrir WhatsApp
                window.open(whatsappUrl, '_blank');
                
                // Opcional: Vaciar carrito después de enviar
                // cart = [];
                // saveCart();
                // updateCart();
                // toggleCart();
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
    

document.addEventListener('DOMContentLoaded', () => {
  const allProducts = [...document.querySelectorAll('#productsContainer > div')];
  let currentPage = 1;
  const productsPerPage = 10;
  window.cart = []; // Carrito global

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

  function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    allProducts.forEach(product => {
      const name = product.querySelector('.card-title').textContent.toLowerCase();
      const description = product.querySelector('.card-text').textContent.toLowerCase();
      const matchesSearch = name.includes(searchTerm) || description.includes(searchTerm);
      const matchesCategory = category === 'all' || product.dataset.category === category;
      product.style.display = (matchesSearch && matchesCategory) ? 'block' : 'none';
    });
  }

  function renderCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let count = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="text-muted">Tu carrito está vacío</p>';
      cartTotal.textContent = '$0.00';
      buyMP.disabled = true;
      buyWA.disabled = true;
      installments.disabled = true;
      cartCounter.textContent = "0";
      cartCounterMobile.textContent = "0";
      return;
    }

    cart.forEach((item, index) => {
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
        cart = cart.filter(p => p.name !== item.name);
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
  }

  function addToCart(button) {
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);
    const image = button.dataset.image;
    const existing = cart.find(p => p.name === name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name, price, image, quantity: 1 });
    }
    renderCart();
  }

  document.getElementById('searchInput').addEventListener('input', filterProducts);
  document.getElementById('categoryFilter').addEventListener('change', filterProducts);

  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => addToCart(button));
  });

  document.getElementById('buyMercadoPago').addEventListener('click', () => {
    if (cart.length === 0) return;
    const months = document.getElementById('installmentsSelector').value;
    if (months === '1') {
      alert('Compra con Mercado Pago en un solo pago (de contado).');
    } else {
      alert('Compra con Mercado Pago a ' + months + ' meses sin intereses.');
    }
  });

  document.getElementById('buyWhatsApp').addEventListener('click', () => {
    if (cart.length === 0) return;
    let message = "¡Hola! Me gustaría comprar los siguientes perfumes:\n\n";
    let total = 0;
    cart.forEach((item, index) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      message += `${index + 1}. ${item.name} - $${item.price.toFixed(2)} x ${item.quantity} = $${subtotal.toFixed(2)}\n`;
    });
    if (total >= 2000) {
      message += `\n*¡Felicidades! Esta compra califica para envío gratis.*`;
    }
    message += `\n\nTotal: $${total.toFixed(2)}\n¿Podrían ayudarme a finalizar la compra?`;
    const url = `https://wa.me/529626923964?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  });

  createPaginationControls();
  paginateProducts();
  renderCart();
});