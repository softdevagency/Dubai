
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

  window.cart = JSON.parse(localStorage.getItem('cart')) || [];

  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartTotal = document.getElementById('cartTotal');
  const buyMP = document.getElementById('buyMercadoPago');
  const buyWA = document.getElementById('buyWhatsApp');
  const installments = document.getElementById('installmentsSelector');
  const cartCounter = document.getElementById('cartCounter');
  const cartCounterMobile = document.getElementById('cartCounterMobile');

  function promptContactInfo(callback) {
    // Crear modal
    const modal = document.createElement('div');
    modal.innerHTML = `
      <style>
        @keyframes pulse-warning {
          0% { box-shadow: 0 0 0px rgba(220,53,69,0.7); }
          50% { box-shadow: 0 0 20px rgba(220,53,69,0.7); }
          100% { box-shadow: 0 0 0px rgba(220,53,69,0.7); }
        }
      </style>
      <div id="contactModal" style="
            position:fixed; top:0; left:0; width:100%; height:100%;
            background:rgba(0,0,0,0.8); display:flex;
            align-items:center; justify-content:center; z-index:10000;">
        <div style="
            background:#fff; padding:25px; max-width:420px; width:90%;
            border:3px solid #dc3545; border-radius:8px;
            animation:pulse-warning 1.5s infinite;">
          <h4 style="color:#dc3545; margin-bottom:15px; display:flex; align-items:center; gap:8px;">
            <i class="fas fa-exclamation-triangle"></i> ¡IMPORTANTE!
          </h4>
          <p style="font-weight:bold; margin-bottom:20px;">
            Para poder procesar tu pedido, <span style="color:#dc3545;">es OBLIGATORIO</span> que proporciones un número de WhatsApp y correo válidos.
          </p>
          <input type="tel" class="form-control mb-2" id="mpPhone" placeholder="WhatsApp (10+ dígitos)" />
          <input type="email" class="form-control mb-3" id="mpEmail" placeholder="Correo electrónico" />
          <div style="text-align:right;">
            <button id="cancelMP" class="btn btn-outline-secondary me-2">Cancelar</button>
            <button id="confirmMP" class="btn btn-danger">Continuar</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Handlers
    document.getElementById('cancelMP').onclick = () => modal.remove();
    document.getElementById('confirmMP').onclick = () => {
      const phone = document.getElementById('mpPhone').value.trim();
      const email = document.getElementById('mpEmail').value.trim();
      if (!/^[0-9]{10,15}$/.test(phone) || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        alert('¡Atención! Verifica que número y correo sean válidos.');
        return;
      }
      modal.remove();
      callback({ phone, email });
    };
  }

  function renderCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0, count = 0;
    if (!window.cart.length) {
      cartItemsContainer.innerHTML = '<p class="text-muted">Tu carrito está vacío</p>';
      cartTotal.textContent = '$0.00';
      buyMP.disabled = true; buyWA.disabled = true; installments.disabled = true;
      cartCounter.textContent = cartCounterMobile.textContent = '0';
      localStorage.setItem('cart', JSON.stringify(window.cart));
      return;
    }
    window.cart.forEach((item, idx) => {
      const subtotal = item.price * item.quantity;
      total += subtotal; count += item.quantity;
      const div = document.createElement('div'); div.className = 'cart-item';
      div.innerHTML = `
        <div class="d-flex align-items-center gap-3">
          <img src="${item.image}" alt="${item.name}"><div>
            <h6 class="mb-1"><span style="color:#007bff">${idx+1}.</span> ${item.name}</h6>
            <small>$${item.price.toFixed(2)} x ${item.quantity}</small>
          </div>
        </div>
        <div class="d-flex align-items-center gap-2">
          <span class="fw-bold">$${subtotal.toFixed(2)}</span>
          <button class="btn btn-sm btn-outline-danger remove-item">&times;</button>
        </div>
      `;
      div.querySelector('.remove-item').onclick = () => {
        window.cart.splice(idx,1);
        renderCart();
      };
      cartItemsContainer.appendChild(div);
    });
    if (total >= 2000) {
      const info = document.createElement('div');
      info.className = 'text-success mt-3 fw-bold';
      info.textContent = '¡Felicidades! Envío gratis.';
      cartItemsContainer.appendChild(info);
    }
    cartTotal.textContent = '$'+total.toFixed(2);
    cartCounter.textContent = cartCounterMobile.textContent = count;
    buyMP.disabled = buyWA.disabled = false; installments.disabled = false;
    localStorage.setItem('cart', JSON.stringify(window.cart));
  }

  document.querySelectorAll('.add-to-cart').forEach(btn => 
    btn.addEventListener('click', () => {
      const { name, price, image } = btn.dataset;
      const existing = window.cart.find(p => p.name === name);
      if (existing) existing.quantity++;
      else window.cart.push({ name, price: parseFloat(price), image, quantity: 1 });
      btn.textContent='✓ Agregado';
      btn.classList.replace('btn-outline-primary','btn-success');
      setTimeout(() => {
        btn.textContent='Agregar';
        btn.classList.replace('btn-success','btn-outline-primary');
      },1000);
      renderCart();
    })
  );

  buyMP?.addEventListener('click', () => {
    if (!window.cart.length) { alert('Carrito vacío'); return; }
    promptContactInfo(({phone,email}) => {
      const items = window.cart.map(({name,quantity,price}) => ({
        title: name,
        quantity,
        unit_price: price,
        currency_id: 'MXN'
      }));
      fetch('https://sweet-glitter-5e0c.softdevagency.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items,
          payer: { phone: { number: phone }, email },
          payment_methods: { installments: parseInt(installments.value || '1') },
          back_urls: {
            success: 'https://www.fragantedubai.com/success.html',
            failure: 'https://www.fragantedubai.com/failure.html',
            pending: 'https://www.fragantedubai.com/pending.html'
          },
          auto_return: 'approved'
        })
      })
      .then(r => r.json())
      .then(data => {
        if (data.init_point) window.location.href = data.init_point;
        else alert('Error generando link de pago');
      })
      .catch(() => alert('Error de conexión'));
    });
  });

  // Búsqueda y filtros
  document.getElementById('searchInput')?.addEventListener('input', filterProducts);
  document.getElementById('categoryFilter')?.addEventListener('change', filterProducts);
  function filterProducts() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const cat = document.getElementById('categoryFilter').value;
    allProducts.forEach(p => {
      const n = p.querySelector('.card-title').textContent.toLowerCase();
      const d = p.querySelector('.card-text').textContent.toLowerCase();
      p.style.display = (n.includes(term)||d.includes(term))&&(cat==='all'||p.dataset.category===cat)?'block':'none';
    });
  }

  // Paginación
  const pagination = document.createElement('div');
  pagination.className = 'd-flex justify-content-center mt-4 gap-2';
  const pages = Math.ceil(allProducts.length/productsPerPage);
  for(let i=1;i<=pages;i++){
    const b = document.createElement('button');
    b.className='btn btn-outline-secondary'; b.textContent = i;
    b.onclick = ()=>{ allProducts.forEach((e,j)=>
      e.style.display=j>=(i-1)*productsPerPage&&j<i*productsPerPage?'block':'none'
    ); };
    pagination.appendChild(b);
  }
  document.getElementById('productsContainer').parentNode.appendChild(pagination);

  // Inicialización
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
