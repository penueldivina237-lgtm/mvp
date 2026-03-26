const TEMPLATES_URL = './templates.json';

const el = id => document.getElementById(id);
const q = sel => document.querySelector(sel);

let templates = [];

async function loadTemplates(){
  const res = await fetch(TEMPLATES_URL);
    templates = await res.json();
    // assign a guaranteed placeholder image (so something always shows),
    // then try to load a relevant Unsplash image and replace the placeholder on success.
    templates.forEach(t => {
      const placeholder = `https://placehold.co/600x400/111111/eeeeee?text=${encodeURIComponent(t.title)}`;
      t.imgUrl = placeholder;

      const unsplashUrl = makeImageUrl(t.imgQuery, t.id);
      const img = new Image();
      img.src = unsplashUrl;
      img.onload = () => {
        t.imgUrl = unsplashUrl;
        t._imgReady = true;
        try { render(templates); } catch (e) { /* ignore rendering errors */ }
      };
      img.onerror = () => {
        // keep placeholder (already set)
      };
    });
  populateCategories();
  render(templates);
}

// show loading indicator early so page isn't empty
try{ el('results').innerHTML = '<p class="muted">Loading templates…</p>'; }catch(e){}


function populateCategories(){
  const cats = Array.from(new Set(templates.map(t => t.category)));
  const sel = el('category');
  cats.forEach(c => {
    const o = document.createElement('option'); o.value = c; o.textContent = c; sel.appendChild(o);
  });
}

function formatPrice(n){ return `$${n.toFixed(2)}` }

function makeImageUrl(query, id){
  // Use picsum.photos seeded images for reliable, unique thumbnails.
  // Seed using query + id so each template gets a stable image.
  const seed = encodeURIComponent((query || 'website') + '-' + (id || '0'));
  return `https://picsum.photos/seed/${seed}/600/400`;
}

function render(list){
  const container = el('results');
  container.innerHTML = '';
  const tpl = q('#cardTpl').content;
  list.forEach(item => {
    const node = tpl.cloneNode(true);
    node.querySelector('.title').textContent = item.title;
    node.querySelector('.category').textContent = item.category;
    node.querySelector('.price').textContent = formatPrice(item.price);
    node.querySelector('.tags').textContent = item.tags.join(', ');
    const img = node.querySelector('.thumb');
    const placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#111"/><text x="50%" y="50%" fill="#ddd" font-size="20" font-family="Arial,Helvetica" text-anchor="middle" dominant-baseline="middle">No image</text></svg>`
    );

    img.src = item.imgUrl || makeImageUrl(item.imgQuery, item.id);
    img.onerror = () => { img.src = placeholder; };
    img.alt = item.title;

    const previewBtn = node.querySelector('.preview');
    previewBtn.addEventListener('click', ()=> openPreview(item));

    const buyBtn = node.querySelector('.buy');
    buyBtn.addEventListener('click', ()=> openPurchase(item));

    container.appendChild(node);
  });
}

function openPreview(item){
  // simple preview: open larger unsplash image in new tab
  window.open(makeImageUrl(item.imgQuery)+'&w=1200','_blank');
}

// Modal / purchase flow (front-end only)
const modal = el('modal');
const modalTitle = el('modalTitle');
const selectedTemplate = el('selectedTemplate');
const buyForm = el('buyForm');
let currentItem = null;

function openPurchase(item){
  currentItem = item;
  modal.setAttribute('aria-hidden','false');
  modalTitle.textContent = `Buy — ${item.title}`;
  selectedTemplate.innerHTML = `<strong>Template:</strong> ${item.title} • <strong>Price:</strong> ${formatPrice(item.price)}`;
}

function closeModal(){
  modal.setAttribute('aria-hidden','true');
  buyForm.reset();
  el('paymentResult').classList.add('hidden');
}

el('modalClose').addEventListener('click', closeModal);
el('modalCancel').addEventListener('click', closeModal);

buyForm.addEventListener('submit', e=>{
  e.preventDefault();
  const data = new FormData(buyForm);
  const name = data.get('name');
  const email = data.get('email');
  // Simulate checkout: show a fake payment confirmation and a download link placeholder
  const out = el('paymentResult');
  out.classList.remove('hidden');
  out.innerHTML = `
    <p>Thanks ${escapeHtml(name)} — a purchase request for <strong>${escapeHtml(currentItem.title)}</strong> was recorded.</p>
    <p>We would normally redirect to a payment provider here. For this demo, click the button below to simulate a completed purchase.</p>
    <p><button id="completePurchase" class="btn primary">Simulate payment complete</button></p>
  `;

  el('completePurchase')?.addEventListener('click', ()=>{
    out.innerHTML = `<p class="success">Payment simulated — purchase complete. Download link (placeholder): <a href="#">Download template</a></p>`;
    // optionally store a record in localStorage for later
    const purchases = JSON.parse(localStorage.getItem('purchases')||'[]');
    purchases.push({id:currentItem.id, title:currentItem.title, name, email, date:new Date().toISOString()});
    localStorage.setItem('purchases', JSON.stringify(purchases));
  });
});

function escapeHtml(s){ return (s+'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// Search / filter
const searchEl = el('search');
const catEl = el('category');
const sortEl = el('sort');
let debounceTimer = null;

function applyFilters(){
  const q = (searchEl.value||'').trim().toLowerCase();
  const cat = catEl.value;
  let out = templates.filter(t => {
    const matchQ = q === '' || (t.title + ' ' + t.tags.join(' ')).toLowerCase().includes(q);
    const matchCat = cat === 'all' || t.category === cat;
    return matchQ && matchCat;
  });

  if (sortEl.value === 'price-asc') out.sort((a,b)=>a.price-b.price);
  else if (sortEl.value === 'price-desc') out.sort((a,b)=>b.price-a.price);
  // else keep original order (popular)
  render(out);
}

searchEl.addEventListener('input', ()=>{
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(applyFilters, 220);
});
catEl.addEventListener('change', applyFilters);
sortEl.addEventListener('change', applyFilters);

// init
loadTemplates().catch(err=>{
  console.error(err);
  el('results').innerHTML = '<p class="error">Failed to load templates.json</p>';
});
