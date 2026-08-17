/* =========================================================
   MAISON ÉCLAT — store.js
   Product catalogue + cart / wishlist engine (localStorage)
   ========================================================= */

const PRODUCTS = [
  { id: "me-01", name: "Éclat Trench, Ivory",        cat: "Outerwear", price: 328, oldPrice: null, tag: "New",       img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=80&auto=format&fit=crop", sizes:["XS","S","M","L"], desc: "A double-breasted trench cut from brushed cotton twill, finished by hand at our Paris atelier with horn buttons and a fluted waist belt." },
  { id: "me-02", name: "Solene Wrap Dress",          cat: "Dresses",   price: 245, oldPrice: 290,  tag: "Bestseller", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=80&auto=format&fit=crop", sizes:["XS","S","M","L"], desc: "Bias-cut silk crepe that falls in a single unbroken line, wrapped and tied at the waist. Made to travel from atelier fitting to evening table." },
  { id: "me-03", name: "Argent Knit Jumper",         cat: "Knitwear",  price: 168, oldPrice: null, tag: null,        img: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=900&q=80&auto=format&fit=crop", sizes:["S","M","L","XL"], desc: "Hand-loomed merino in a soft silver-grey, ribbed at the cuff and hem. A quiet staple built for a decade of winters." },
  { id: "me-04", name: "Noir Tailored Blazer",       cat: "Outerwear", price: 298, oldPrice: null, tag: "Limited",   img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=80&auto=format&fit=crop", sizes:["XS","S","M","L","XL"], desc: "A single-breasted blazer with a hand-stitched lapel roll, cut close through the waist and finished with mother-of-pearl buttons." },
  { id: "me-05", name: "Rosalie Silk Blouse",        cat: "Tops",      price: 142, oldPrice: null, tag: "New",       img: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=900&q=80&auto=format&fit=crop", sizes:["XS","S","M","L"], desc: "Mulberry silk with a soft pussy-bow collar, cut for movement and finished with a French seam throughout." },
  { id: "me-06", name: "Vendôme Pleated Trouser",    cat: "Bottoms",   price: 186, oldPrice: null, tag: null,        img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=900&q=80&auto=format&fit=crop", sizes:["XS","S","M","L"], desc: "A wide, fluid trouser in Italian wool with a front pleat and a fall that skims rather than clings." },
  { id: "me-07", name: "Cuir Structured Tote",       cat: "Accessories", price: 214, oldPrice: 260, tag: "Bestseller", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=80&auto=format&fit=crop", sizes:["One Size"], desc: "Vegetable-tanned leather, hand-stitched along every edge, with a saddle handle worn soft over years of use." },
  { id: "me-08", name: "Étoile Gold Hoop Set",       cat: "Accessories", price: 68,  oldPrice: null, tag: null,      img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=80&auto=format&fit=crop", sizes:["One Size"], desc: "Three hoops in graduated sizes, gold-vermeil over sterling silver, cast by hand in small batches." },
  { id: "me-09", name: "Belle Fluted Midi Skirt",    cat: "Bottoms",   price: 176, oldPrice: null, tag: "New",       img: "https://images.unsplash.com/photo-1583496661160-fb5886a13d74?w=900&q=80&auto=format&fit=crop", sizes:["XS","S","M","L"], desc: "A fluted midi in satin-back crepe, weighted at the hem so it moves with every step rather than against it." },
  { id: "me-10", name: "Ivoire Cashmere Scarf",      cat: "Accessories", price: 96, oldPrice: null, tag: "Limited", img: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=900&q=80&auto=format&fit=crop", sizes:["One Size"], desc: "Pure cashmere, hand-fringed at both ends, woven in a small mill we've worked with since our first collection." },
  { id: "me-11", name: "Marguerite Knit Cardigan",   cat: "Knitwear",  price: 189, oldPrice: null, tag: null,        img: "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=900&q=80&auto=format&fit=crop", sizes:["XS","S","M","L"], desc: "An oversized cardigan in brushed alpaca wool, finished with horn buttons and patch pockets." },
  { id: "me-12", name: "Château Denim Jacket",       cat: "Outerwear", price: 212, oldPrice: 248,  tag: "Bestseller", img: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=900&q=80&auto=format&fit=crop", sizes:["XS","S","M","L","XL"], desc: "Rigid selvedge denim, stone-washed once and finished with contrast gold stitching along every seam." }
];

const CART_KEY = "maisonEclatCart";
const WISH_KEY = "maisonEclatWishlist";

/* ---------- storage helpers ---------- */
function getCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; }catch(e){ return []; } }
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); renderCartCount(); }
function getWishlist(){ try{ return JSON.parse(localStorage.getItem(WISH_KEY)) || []; }catch(e){ return []; } }
function saveWishlist(list){ localStorage.setItem(WISH_KEY, JSON.stringify(list)); }

function findProduct(id){ return PRODUCTS.find(p => p.id === id); }
function formatPrice(n){ return "$" + n.toFixed(2); }

/* ---------- cart operations ---------- */
function addToCart(id, size, qty){
  qty = qty || 1;
  size = size || (findProduct(id)?.sizes?.[0] ?? "One Size");
  const cart = getCart();
  const existing = cart.find(l => l.id === id && l.size === size);
  if(existing){ existing.qty += qty; } else { cart.push({ id, size, qty }); }
  saveCart(cart);
  const p = findProduct(id);
  showToast(`${p ? p.name : "Item"} added to your bag`);
  openCartDrawer();
}
function removeLine(index){ const cart = getCart(); cart.splice(index,1); saveCart(cart); renderCartDrawer(); renderCartPage(); }
function setLineQty(index, qty){
  const cart = getCart();
  if(!cart[index]) return;
  cart[index].qty = Math.max(1, qty);
  saveCart(cart); renderCartDrawer(); renderCartPage();
}
function cartLinesWithData(){
  return getCart().map((line, i) => ({ ...line, index: i, product: findProduct(line.id) })).filter(l => l.product);
}
function cartCount(){ return getCart().reduce((sum,l) => sum + l.qty, 0); }
function cartSubtotal(){ return cartLinesWithData().reduce((sum,l) => sum + l.product.price * l.qty, 0); }

/* ---------- wishlist ---------- */
function toggleWishlist(id){
  let list = getWishlist();
  if(list.includes(id)){ list = list.filter(x => x !== id); }
  else{ list.push(id); showToast("Saved to your wishlist"); }
  saveWishlist(list);
  document.querySelectorAll(`.wishlist-btn[data-id="${id}"]`).forEach(btn=>{
    btn.classList.toggle("active", list.includes(id));
  });
}

/* ---------- rendering: nav badge ---------- */
function renderCartCount(){
  const n = cartCount();
  document.querySelectorAll(".cart-count").forEach(el => { el.textContent = n; el.style.display = n > 0 ? "flex" : "none"; });
}

/* ---------- mini cart drawer ---------- */
function renderCartDrawer(){
  const body = document.getElementById("cartDrawerBody");
  const foot = document.getElementById("cartDrawerFoot");
  if(!body) return;
  const lines = cartLinesWithData();
  if(lines.length === 0){
    body.innerHTML = `<div class="empty-state"><i class="fa fa-shopping-bag"></i><p>Your bag is empty.<br>Discover something hand-finished.</p></div>`;
    if(foot) foot.style.display = "none";
    return;
  }
  if(foot) foot.style.display = "block";
  body.innerHTML = lines.map(l => `
    <div class="cart-line">
      <img src="${l.product.img}" alt="${l.product.name}">
      <div class="info">
        <h6>${l.product.name}</h6>
        <div class="meta">Size ${l.size}</div>
        <div class="qty-stepper">
          <button onclick="setLineQty(${l.index}, ${l.qty - 1})">−</button>
          <span>${l.qty}</span>
          <button onclick="setLineQty(${l.index}, ${l.qty + 1})">+</button>
        </div>
        <a class="remove-line" onclick="removeLine(${l.index})">Remove</a>
      </div>
      <div style="font-weight:700;">${formatPrice(l.product.price * l.qty)}</div>
    </div>
  `).join("");
  if(foot) foot.innerHTML = `
    <div class="summary-row"><span>Subtotal</span><strong>${formatPrice(cartSubtotal())}</strong></div>
    <p style="font-size:11px;color:var(--taupe);margin:6px 0 16px;">Shipping and taxes calculated at checkout.</p>
    <a href="checkout.html" class="btn btn-gold btn-block">Checkout</a>
    <a href="cart.html" class="btn btn-outline btn-block" style="margin-top:10px;">View Bag</a>
  `;
}
function openCartDrawer(){
  document.getElementById("cartOverlay")?.classList.add("open");
  document.getElementById("cartDrawer")?.classList.add("open");
  renderCartDrawer();
}
function closeCartDrawer(){
  document.getElementById("cartOverlay")?.classList.remove("open");
  document.getElementById("cartDrawer")?.classList.remove("open");
}

/* ---------- toast ---------- */
let toastTimer;
function showToast(msg){
  const box = document.getElementById("toastBox");
  if(!box) return;
  box.innerHTML = `<i class="fa fa-check-circle"></i> ${msg}`;
  box.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => box.classList.remove("show"), 2600);
}

/* ---------- product card markup ---------- */
function productCardHTML(p){
  const wished = getWishlist().includes(p.id);
  return `
  <div class="product-card reveal" data-cat="${p.cat}" data-price="${p.price}" data-name="${p.name.toLowerCase()}">
    <div class="product-media">
      <a href="product.html?id=${p.id}">
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
        <img src="${p.img}" alt="${p.name}" loading="lazy">
      </a>
      <button class="wishlist-btn ${wished ? "active" : ""}" data-id="${p.id}" onclick="toggleWishlist('${p.id}')" aria-label="Save to wishlist">
        <i class="fa fa-heart"></i>
      </button>
      <div class="quick-add">
        <button class="btn btn-primary btn-sm btn-block" onclick="addToCart('${p.id}', '${p.sizes[0]}', 1)">Quick Add</button>
      </div>
    </div>
    <div class="product-info">
      <div class="cat">${p.cat}</div>
      <a href="product.html?id=${p.id}"><h4>${p.name}</h4></a>
      <div class="price">${p.oldPrice ? `<span class="strike">${formatPrice(p.oldPrice)}</span>` : ""}${formatPrice(p.price)}</div>
    </div>
  </div>`;
}

/* ---------- products.html grid ---------- */
function initProductGrid(){
  const grid = document.getElementById("productGrid");
  if(!grid) return;
  const urlCat = new URLSearchParams(location.search).get("cat");
  let activeCat = urlCat || "All";
  let sortMode = "featured";

  function paint(){
    let list = [...PRODUCTS];
    if(activeCat !== "All") list = list.filter(p => p.cat === activeCat);
    if(sortMode === "low") list.sort((a,b)=>a.price-b.price);
    if(sortMode === "high") list.sort((a,b)=>b.price-a.price);
    if(sortMode === "new") list = list.filter(p=>p.tag==="New").concat(list.filter(p=>p.tag!=="New"));
    grid.innerHTML = list.length ? list.map(productCardHTML).join("") : `<p style="grid-column:1/-1;text-align:center;color:var(--taupe);padding:60px 0;">No pieces match this filter yet.</p>`;
    document.getElementById("resultCount") && (document.getElementById("resultCount").textContent = `${list.length} piece${list.length===1?"":"s"}`);
    revealOnScroll();
  }
  document.querySelectorAll(".filter-pills button").forEach(btn=>{
    if(btn.dataset.cat === activeCat) btn.classList.add("active");
    btn.addEventListener("click", ()=>{
      document.querySelectorAll(".filter-pills button").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      activeCat = btn.dataset.cat;
      paint();
    });
  });
  const sortSelect = document.getElementById("sortSelect");
  if(sortSelect) sortSelect.addEventListener("change", e => { sortMode = e.target.value; paint(); });
  paint();
}

/* ---------- product.html detail ---------- */
function initProductDetail(){
  const wrap = document.getElementById("productDetail");
  if(!wrap) return;
  const id = new URLSearchParams(location.search).get("id") || PRODUCTS[0].id;
  const p = findProduct(id) || PRODUCTS[0];
  let selectedSize = p.sizes[0];
  let qty = 1;

  wrap.innerHTML = `
    <div class="pd-media">
      <div class="frame stitch-border" style="padding:14px;">
        <img src="${p.img}" alt="${p.name}" style="width:100%;height:600px;object-fit:cover;">
      </div>
    </div>
    <div class="pd-info">
      <div class="cat" style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--taupe);margin-bottom:10px;">${p.cat}</div>
      <h1 style="font-size:38px;font-style:italic;">${p.name}</h1>
      <div class="price" style="font-size:22px;color:var(--wine);font-weight:700;margin-bottom:18px;">
        ${p.oldPrice ? `<span class="strike">${formatPrice(p.oldPrice)}</span>` : ""}${formatPrice(p.price)}
      </div>
      <p style="color:var(--ink-soft);line-height:1.8;max-width:520px;">${p.desc}</p>
      <div class="badge-soft" style="margin:18px 0;">Hand-Finished Atelier Piece</div>

      <div style="margin:20px 0;">
        <label style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;display:block;margin-bottom:10px;">Size</label>
        <div id="sizeOptions" style="display:flex;gap:10px;flex-wrap:wrap;"></div>
      </div>

      <div style="display:flex;gap:16px;align-items:center;margin:26px 0;">
        <div class="qty-stepper" style="border:1px solid var(--line);">
          <button id="pdMinus" style="width:38px;height:38px;">−</button>
          <span id="pdQty" style="width:38px;">1</span>
          <button id="pdPlus" style="width:38px;height:38px;">+</button>
        </div>
        <button id="pdAddCart" class="btn btn-gold" style="flex:1;">Add to Bag</button>
      </div>
      <button id="pdWishlist" class="btn btn-outline btn-block"><i class="fa fa-heart"></i>&nbsp; Save to Wishlist</button>

      <div class="stitch-rule" style="margin:34px 0;"></div>
      <div class="faq">
        <details><summary>Fabric &amp; Care</summary><p>Finished by hand in small ateliers; follow the interior label for cleaning to preserve construction and colour.</p></details>
        <details><summary>Shipping &amp; Returns</summary><p>Complimentary worldwide shipping on orders over $150. Returns accepted within 30 days, unworn and tagged.</p></details>
      </div>
    </div>
  `;

  const sizeBox = document.getElementById("sizeOptions");
  sizeBox.innerHTML = p.sizes.map(s => `<button class="btn btn-outline btn-sm size-opt" data-size="${s}">${s}</button>`).join("");
  function paintSizes(){
    sizeBox.querySelectorAll(".size-opt").forEach(b=>{
      b.classList.toggle("btn-primary", b.dataset.size === selectedSize);
      b.classList.toggle("btn-outline", b.dataset.size !== selectedSize);
    });
  }
  paintSizes();
  sizeBox.querySelectorAll(".size-opt").forEach(b => b.addEventListener("click", ()=>{ selectedSize = b.dataset.size; paintSizes(); }));

  document.getElementById("pdMinus").addEventListener("click", ()=>{ qty = Math.max(1, qty-1); document.getElementById("pdQty").textContent = qty; });
  document.getElementById("pdPlus").addEventListener("click", ()=>{ qty += 1; document.getElementById("pdQty").textContent = qty; });
  document.getElementById("pdAddCart").addEventListener("click", ()=> addToCart(p.id, selectedSize, qty));
  const wb = document.getElementById("pdWishlist");
  if(getWishlist().includes(p.id)) wb.classList.add("btn-primary");
  wb.addEventListener("click", ()=>{ toggleWishlist(p.id); wb.classList.toggle("btn-primary"); });

  // related products
  const related = document.getElementById("relatedGrid");
  if(related){
    const rel = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0,4);
    related.innerHTML = (rel.length ? rel : PRODUCTS.filter(x=>x.id!==p.id).slice(0,4)).map(productCardHTML).join("");
  }
}

/* ---------- cart.html page ---------- */
function renderCartPage(){
  const table = document.getElementById("cartTableBody");
  if(!table) return;
  const lines = cartLinesWithData();
  const emptyEl = document.getElementById("cartEmpty");
  const contentEl = document.getElementById("cartContent");
  if(lines.length === 0){
    if(emptyEl) emptyEl.style.display = "block";
    if(contentEl) contentEl.style.display = "none";
    return;
  }
  if(emptyEl) emptyEl.style.display = "none";
  if(contentEl) contentEl.style.display = "grid";

  table.innerHTML = lines.map(l => `
    <tr>
      <td>
        <div class="cart-row-media">
          <img src="${l.product.img}" alt="${l.product.name}">
          <div>
            <h6 style="font-family:var(--font-display);font-size:18px;font-style:italic;margin:0 0 4px;">${l.product.name}</h6>
            <div style="font-size:12px;color:var(--taupe);text-transform:uppercase;">Size ${l.size}</div>
            <a class="remove-line" onclick="removeLine(${l.index})">Remove</a>
          </div>
        </div>
      </td>
      <td>${formatPrice(l.product.price)}</td>
      <td>
        <div class="qty-stepper">
          <button onclick="setLineQty(${l.index}, ${l.qty - 1})">−</button>
          <span>${l.qty}</span>
          <button onclick="setLineQty(${l.index}, ${l.qty + 1})">+</button>
        </div>
      </td>
      <td style="font-weight:700;">${formatPrice(l.product.price * l.qty)}</td>
    </tr>
  `).join("");

  const subtotal = cartSubtotal();
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 12;
  const total = subtotal + shipping;
  const sub = document.getElementById("sumSubtotal");
  const ship = document.getElementById("sumShipping");
  const tot = document.getElementById("sumTotal");
  if(sub) sub.textContent = formatPrice(subtotal);
  if(ship) ship.textContent = shipping === 0 ? "Complimentary" : formatPrice(shipping);
  if(tot) tot.textContent = formatPrice(total);
}

/* ---------- checkout.html page ---------- */
function renderCheckoutSummary(){
  const box = document.getElementById("checkoutSummaryLines");
  if(!box) return;
  const lines = cartLinesWithData();
  if(lines.length === 0){
    box.innerHTML = `<p style="color:var(--taupe);">Your bag is empty — <a href="products.html" style="text-decoration:underline;">browse the collection</a>.</p>`;
  } else {
    box.innerHTML = lines.map(l => `
      <div style="display:flex;gap:14px;align-items:center;padding:12px 0;border-bottom:1px solid var(--line);">
        <img src="${l.product.img}" style="width:56px;height:70px;object-fit:cover;" alt="${l.product.name}">
        <div style="flex:1;">
          <div style="font-family:var(--font-display);font-style:italic;font-size:15px;">${l.product.name}</div>
          <div style="font-size:11px;color:var(--taupe);text-transform:uppercase;">Size ${l.size} · Qty ${l.qty}</div>
        </div>
        <div style="font-weight:700;font-size:14px;">${formatPrice(l.product.price * l.qty)}</div>
      </div>
    `).join("");
  }
  const subtotal = cartSubtotal();
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 12;
  const total = subtotal + shipping;
  document.getElementById("coSubtotal") && (document.getElementById("coSubtotal").textContent = formatPrice(subtotal));
  document.getElementById("coShipping") && (document.getElementById("coShipping").textContent = shipping === 0 ? "Complimentary" : formatPrice(shipping));
  document.getElementById("coTotal") && (document.getElementById("coTotal").textContent = formatPrice(total));

  const placeBtn = document.getElementById("placeOrderBtn");
  if(placeBtn) placeBtn.disabled = lines.length === 0;
}

function placeOrder(e){
  e.preventDefault();
  if(cartLinesWithData().length === 0) return;
  document.getElementById("checkoutForm").style.display = "none";
  document.getElementById("checkoutSidebar").style.display = "none";
  document.getElementById("orderConfirm").style.display = "block";
  document.getElementById("orderNumber").textContent = "ME-" + Math.floor(100000 + Math.random()*899999);
  localStorage.removeItem(CART_KEY);
  renderCartCount();
  window.scrollTo({top:0, behavior:"smooth"});
}

/* ---------- nav / interactions ---------- */
function initNav(){
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  toggle?.addEventListener("click", ()=> links.classList.toggle("open"));

  const searchToggle = document.getElementById("searchToggle");
  const searchPanel = document.getElementById("searchPanel");
  searchToggle?.addEventListener("click", ()=> searchPanel.classList.toggle("open"));
  document.getElementById("searchForm")?.addEventListener("submit", (e)=>{
    e.preventDefault();
    const q = document.getElementById("searchInput").value.trim();
    if(q) window.location.href = "products.html?search=" + encodeURIComponent(q);
  });

  document.getElementById("cartToggle")?.addEventListener("click", (e)=>{ e.preventDefault(); openCartDrawer(); });
  document.getElementById("cartOverlay")?.addEventListener("click", closeCartDrawer);
  document.getElementById("cartDrawerClose")?.addEventListener("click", closeCartDrawer);

  // mark active nav link
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(a=>{
    if(a.getAttribute("href") === path) a.classList.add("active");
  });
}

function revealOnScroll(){
  const els = document.querySelectorAll(".reveal:not(.in)");
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en => { if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
}

function initHeaderScroll(){
  const header = document.querySelector(".site-header");
  if(!header) return;
  window.addEventListener("scroll", ()=>{
    header.style.boxShadow = window.scrollY > 10 ? "0 6px 20px -12px rgba(27,26,23,.3)" : "none";
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  renderCartCount();
  initNav();
  initHeaderScroll();
  renderCartDrawer();
  initProductGrid();
  initProductDetail();
  renderCartPage();
  renderCheckoutSummary();
  revealOnScroll();

  // preloader fade
  const pre = document.getElementById("preloader");
  if(pre){ window.addEventListener("load", ()=> setTimeout(()=> pre.classList.add("done"), 250)); }

  // wishlist search field on wishlist buttons refresh already handled by class toggle
  document.getElementById("checkoutForm")?.addEventListener("submit", placeOrder);
});
