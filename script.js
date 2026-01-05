// Simple product data + rendering + cart for Vishal Mega Mart

const products = [
  { id: 1, name: "Everyday Rice 5kg", price: 249, category: "Grocery", img: "https://picsum.photos/seed/rice/400/300", featured: true },
  { id: 2, name: "Smart LED TV 43\"", price: 17999, category: "Electronics", img: "https://picsum.photos/seed/tv/400/300", featured: true },
  { id: 3, name: "Men's Casual Shirt", price: 799, category: "Fashion", img: "https://picsum.photos/seed/shirt/400/300", featured: false },
  { id: 4, name: "Floor Cleaner 2L", price: 189, category: "Home", img: "https://picsum.photos/seed/cleaner/400/300", featured: false },
  { id: 5, name: "Washing Machine 6kg", price: 12499, category: "Electronics", img: "https://picsum.photos/seed/wm/400/300", featured: true },
  { id: 6, name: "Fresh Atta 10kg", price: 479, category: "Grocery", img: "https://picsum.photos/seed/atta/400/300", featured: false },
  { id: 7, name: "Women's Kurti", price: 899, category: "Fashion", img: "https://picsum.photos/seed/kurti/400/300", featured: false },
  { id: 8, name: "Non-stick Kadhai", price: 1299, category: "Home", img: "https://picsum.photos/seed/kadhai/400/300", featured: false }
];

// Simple cart structure: { productId: qty }
const cart = {
  items: JSON.parse(localStorage.getItem('vmm_cart') || '{}'),
  add(id){ this.items[id] = (this.items[id] || 0) + 1; this.sync(); },
  remove(id){ delete this.items[id]; this.sync(); },
  update(id, qty){ if(qty<=0) this.remove(id); else this.items[id] = qty; this.sync(); },
  clear(){ this.items = {}; this.sync(); },
  sync(){ localStorage.setItem('vmm_cart', JSON.stringify(this.items)); renderCart(); updateCartCount(); }
};

function $(sel){ return document.querySelector(sel) }
function $all(sel){ return document.querySelectorAll(sel) }

function renderCategories(){
  const catSet = new Set(products.map(p=>p.category));
  const container = $('#categories-list');
  const filter = $('#filter-category');
  container.innerHTML = '';
  filter.innerHTML = '<option value="all">All categories</option>';
  catSet.forEach(cat=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="https://picsum.photos/seed/${encodeURIComponent(cat)}/600/360" alt="${cat}">
      <h4>${cat}</h4>
      <p class="meta">Popular deals in ${cat}</p>
      <div style="margin-top:auto"><button class="btn" data-cat="${cat}">Explore</button></div>
    `;
    container.appendChild(card);

    const opt = document.createElement('option');
    opt.value = cat; opt.textContent = cat;
    filter.appendChild(opt);
  });

  container.addEventListener('click', e=>{
    const btn = e.target.closest('button[data-cat]');
    if(btn) {
      const cat = btn.dataset.cat;
      $('#filter-category').value = cat;
      renderProducts(cat);
      window.location.hash = 'products';
    }
  });

  filter.addEventListener('change', ()=> renderProducts(filter.value));
}

function createProductCard(p){
  const div = document.createElement('div');
  div.className = 'card';
  div.innerHTML = `
    <img src="${p.img}" alt="${p.name}" loading="lazy">
    <h4>${p.name}</h4>
    <div class="meta">${p.category}</div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:.5rem">
      <div><span class="price">₹${p.price}</span></div>
      <div style="display:flex;gap:.5rem">
        <button class="btn add-to-cart" data-id="${p.id}">Add</button>
        <button class="btn-outline details" data-id="${p.id}">Details</button>
      </div>
    </div>
  `;
  return div;
}

function renderProducts(filter='all'){
  const container = $('#products-list');
  const featured = $('#featured-list');
  container.innerHTML = '';
  featured.innerHTML = '';
  const list = products.filter(p => filter === 'all' ? true : p.category === filter);
  list.forEach(p => container.appendChild(createProductCard(p)));
  products.filter(p=>p.featured).slice(0,4).forEach(p => featured.appendChild(createProductCard(p)));
}

function updateCartCount(){
  const count = Object.values(cart.items).reduce((s,n)=>s+n,0);
  $('#cart-count').textContent = count;
}

function renderCart(){
  const itemsDiv = $('#cart-items');
  itemsDiv.innerHTML = '';
  const keys = Object.keys(cart.items);
  if(keys.length === 0){
    itemsDiv.innerHTML = '<p style="color:#475569">Your cart is empty.</p>';
    $('#cart-total').textContent = '0';
    return;
  }
  let total = 0;
  keys.forEach(id=>{
    const qty = cart.items[id];
    const p = products.find(x=>x.id==id);
    if(!p) return;
    total += p.price * qty;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div style="flex:1">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <strong>${p.name}</strong>
          <div>₹${p.price}</div>
        </div>
        <div style="display:flex;gap:.5rem;align-items:center;margin-top:.35rem">
          <input type="number" min="0" value="${qty}" data-id="${id}" class="cart-qty" style="width:72px;padding:.25rem;border:1px solid #e2e8f0;border-radius:6px">
          <button class="btn-outline remove" data-id="${id}">Remove</button>
        </div>
      </div>
    `;
    itemsDiv.appendChild(row);
  });
  $('#cart-total').textContent = total;
}

// Event delegation for product actions & cart interactions
document.addEventListener('click
