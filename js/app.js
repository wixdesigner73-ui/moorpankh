(function(){
const C = window.MP_CONFIG, P = window.MP_PRODUCTS;
const $ = (s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const money = n => C.currency+" "+n.toLocaleString("en-PK");
const esc = s => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const store = {
  get(k,d){try{return JSON.parse(localStorage.getItem("mp_"+k))??d}catch(e){return d}},
  set(k,v){try{localStorage.setItem("mp_"+k,JSON.stringify(v))}catch(e){}}
};
const byId = id => P.find(p=>p.id===id);
const buyable = p => p.price>0 && p.stock!==0;
const stockText = p => p.stock===0?"Sold out": p.price===0?"Price on request": p.stock==null?"Available": (p.stock<=3?`Only ${p.stock} left`:"In stock");
const waLink = t => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(t)}`;

/* ---------- state ---------- */
let cart = store.get("cart",[]), wish = store.get("wish",[]);
const saveCart=()=>{store.set("cart",cart);updateBadges()};
function addToCart(id,q=1){
  const p=byId(id); if(!p||!buyable(p)) return toast("This piece is available on request via WhatsApp");
  const it=cart.find(i=>i.id===id); const max=p.stock==null?99:p.stock;
  if(it) it.qty=Math.min(max,it.qty+q); else cart.push({id,qty:Math.min(max,q)});
  saveCart(); toast(p.name+" added to your bag");
}
function toggleWish(id){wish=wish.includes(id)?wish.filter(w=>w!==id):[...wish,id];store.set("wish",wish);updateBadges();$$(`.heart[data-id="${id}"]`).forEach(h=>h.classList.toggle("on",wish.includes(id)))}
function updateBadges(){
  const n=cart.reduce((a,i)=>a+i.qty,0);
  $$("[data-badge=cart]").forEach(b=>{b.textContent=n;b.dataset.n=n});
  $$("[data-badge=wish]").forEach(b=>{b.textContent=wish.length;b.dataset.n=wish.length});
}
function toast(m){let t=$(".toast");if(!t){t=document.createElement("div");t.className="toast";t.setAttribute("role","status");document.body.appendChild(t)}
  t.textContent=m;t.classList.add("show");clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove("show"),2600)}

/* ---------- reusable bits ---------- */
const ph = (p,i=0,cls="")=>{
  const src=`images/products/${p.id}${i?"-"+(i+1):""}.jpg`;
  return `<div class="ph ${cls}" style="--c1:${p.c1};--c2:${p.c2}"><span>${esc(p.name)}</span><img src="${src}" alt="${esc(p.name)}" loading="lazy" onerror="this.remove()"></div>`;
};
const slot = (name,label,c1="#8d9b5a",c2="#e4e8c4",cls="")=>`<div class="ph ${cls}" style="--c1:${c1};--c2:${c2}"><span>${label}</span><img src="images/${name}" alt="${esc(label)}" onerror="this.remove()"></div>`;
const heartSvg='<svg viewBox="0 0 24 24"><path d="M12 21s-7-4.6-9.3-9A5.4 5.4 0 0 1 12 6a5.4 5.4 0 0 1 9.3 6c-2.3 4.400-9.300 9-9.300 9z"/></svg>';
const card = p => `<a class="card-p rv" href="product.html?id=${p.id}" aria-label="${esc(p.name)}">
  <button class="heart ${wish.includes(p.id)?"on":""}" data-id="${p.id}" aria-label="Wishlist" onclick="event.preventDefault();event.stopPropagation();MP.wish('${p.id}')">${heartSvg}</button>
  ${p.stock===0?'<span class="tag">Sold out</span>':p.price===0?'<span class="tag">On request</span>':""}
  ${ph(p)}<div class="meta"><div><h3>${esc(p.name)}</h3><div class="sub">${esc(p.sub)}</div></div><div class="price">${p.price?money(p.price):"On request"}</div></div></a>`;

const ic={
  search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.500-3.500"/></svg>',
  user:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.500 4.500-6 8-6s7 1.500 8 6"/></svg>',
  heart:heartSvg,
  bag:'<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  menu:'<svg viewBox="0 0 24 24"><path d="M4 8h16M4 16h16"/></svg>'
};

function header(){
  const pg=document.body.dataset.page;
  const on=(...k)=>k.includes(pg)?"on":"";
  return `<a class="skip" href="#app">Skip to content</a>
  <header class="site" id="hdr">
    <a class="logo" href="index.html" aria-label="Moorpankh home"><img src="images/logo.png" alt="" onerror="this.remove()">Moorpankh</a>
    <nav class="main" id="nav" aria-label="Main">
      <a href="shop.html" class="${on('shop')}">Shop</a><a href="sarees.html" class="${on('sarees')}">Vintage Sarees</a>
      <a href="jewellery.html" class="${on('jewellery')}">Jewellery</a><a href="collections.html" class="${on('collections')}">Collections</a>
      <a href="story.html" class="${on('story','journal')}">Our Story</a><a href="contact.html" class="${on('contact')}">Contact</a></nav>
    <div class="icons">
      <button class="ibtn" id="sbtn" aria-label="Search">${ic.search}</button>
      <a class="ibtn hide-m" href="contact.html" aria-label="Account / contact">${ic.user}</a>
      <a class="ibtn hide-m" href="wishlist.html" aria-label="Wishlist">${ic.heart}<i class="badge" data-badge="wish"></i></a>
      <a class="ibtn" href="cart.html" aria-label="Shopping bag">${ic.bag}<i class="badge" data-badge="cart"></i></a>
      <button class="ibtn burger" id="bg" aria-label="Menu">${ic.menu}</button>
    </div></header>
  <div id="search" role="dialog" aria-label="Search"><button class="btn ghost x" id="sx">Close</button><input id="sq" placeholder="Search the collection…" aria-label="Search"><div class="res" id="sr"></div></div>`;
}
function footer(){
  return `<footer class="site"><div class="cols">
   <div><a class="logo" href="index.html">Moorpankh</a><p style="max-width:34ch;margin-top:14px">Vintage sarees and handmade jewellery — heritage, craftsmanship and timeless elegance from ${C.city}.</p></div>
   <div><h4>Shop</h4><ul><li><a href="shop.html">All pieces</a></li><li><a href="sarees.html">Vintage sarees</a></li><li><a href="shop.html?cat=suits">Ready to wear</a></li><li><a href="jewellery.html">Jewellery</a></li><li><a href="collections.html">Collections</a></li></ul></div>
   <div><h4>Support</h4><ul><li><a href="shipping.html">Shipping &amp; returns</a></li><li><a href="faq.html">FAQs</a></li><li><a href="contact.html">Contact</a></li><li><a href="journal.html">Journal</a></li><li><a href="story.html">Our story</a></li></ul></div>
   <div><h4>Connect</h4><ul><li><a href="https://instagram.com/${C.instagram}" target="_blank" rel="noopener">Instagram @${C.instagram}</a></li><li><a href="${waLink('Hello Moorpankh!')}" target="_blank" rel="noopener">WhatsApp</a></li><li>${C.email}</li></ul></div>
  </div><div class="copy"><span>© ${new Date().getFullYear()} Moorpankh. All rights reserved.</span><span>Delivery across Pakistan · ${C.deliveryEstimate}</span></div></footer>
  <a class="wa-float" href="${waLink('Hello Moorpankh! I would like some help.')}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.600 15L2 22l5.200-1.400A10 10 0 1 0 12 2zm5.200 14.100c-.2.600-1.300 1.200-1.800 1.200-.5.100-1 .2-3.300-.7-2.800-1.200-4.600-4-4.700-4.200-.1-.2-1.100-1.500-1.100-2.800s.7-2 1-2.300c.2-.3.500-.3.700-.3h.5c.2 0 .4 0 .6.500l.9 2.100c.1.200.1.400 0 .5l-.4.600c-.1.200-.3.300-.1.600.2.300.8 1.300 1.700 2.100 1.200 1 2.100 1.300 2.400 1.500.3.100.4.100.6-.1l.8-1c.2-.3.400-.2.600-.1l2 1c.3.100.5.200.5.300.1.200.1.800-.1 1.300z"/></svg></a>`;
}

/* ---------- pages ---------- */
const pages = {};

pages.home = () => {
  const best=P.filter(p=>p.price).sort((a,b)=>b.price-a.price).slice(0,6);
  const I=(f,alt,extra="")=>`<img src="images/${f}.jpg" alt="${alt}" ${extra}>`;
  const gal=[["hero-1","The Saffron Edit","Silk"],["model-tree","Garden Hours","Cotton"],["model-red","Red Letter","Formal"],["model-plants","Courtyard Bloom","Banarsi"],["model-palace","The Palace Edit","Statement"],["hero-4","Magenta Weave","Silk"],["model-green","Monsoon Green","Cotton"]];
  return `
  <section class="hero" id="hero" aria-label="Moorpankh campaign">
    <div class="h-bg"></div>
    <svg class="doodle" style="left:22%;top:12%;width:100px" viewBox="0 0 100 60"><path d="M2 42C18 2 32 52 50 22s30 14 48-6"/></svg>
    <svg class="doodle" style="right:26%;bottom:16%;width:70px" viewBox="0 0 60 60"><path d="M30 4v52M4 30h52M12 12l36 36M48 12 12 48"/></svg>
    <h1 class="h-title" aria-label="Elegance Beyond Time"><span class="ln"><i>Elegance</i></span><span class="ln"><i><em>Beyond</em> Time.</i></span></h1>
    <div class="h-arch" id="harch"><canvas id="heroGL" aria-hidden="true"></canvas>${I("hero-1","Model wearing a yellow vintage saree","class=\"h-fb\"")}</div>
    <div class="h-title front" aria-hidden="true"><span class="ln"><i>Elegance</i></span><span class="ln"><i><em>Beyond</em> Time.</i></span></div>
    <figure class="h-side l">${I("model-tree","Saree portrait")}</figure>
    <figure class="h-side r">${I("model-green","Saree portrait")}</figure>
    <div class="h-copy"><p class="eyebrow" style="margin-bottom:14px">Vintage sarees · Handmade jewellery</p><p>Discover timeless vintage sarees and handcrafted treasures, where heritage meets the art of modern elegance.</p><a class="link" href="sarees.html">New arrivals</a></div>
    <div class="h-count" aria-hidden="true"><b id="hc">01</b><span>/ 04</span></div>
    <div class="h-cta"><a class="btn mag" href="sarees.html">Discover the Collection</a><a class="btn ghost mag" href="jewellery.html" style="color:var(--olive-d)">Explore Vintage Jewellery</a></div>
  </section>
  <div class="marquee" aria-hidden="true"><div>${"Vintage Sarees<span>✦</span><em>Handmade Jewellery</em><span>✦</span>Banarsi<span>✦</span><em>Hand Block Print</em><span>✦</span>Lahore<span>✦</span>".repeat(8)}</div></div>

  <section class="wrap intro"><div class="stk"><div class="pic big rv">${I("model-palace","Model in a vintage saree before a palace garden","data-par")}</div><div class="pic small rv">${I("model-green","Portrait","data-par")}</div></div>
    <div><p class="eyebrow">The World of Moorpankh</p><h2 class="h2 split-line" style="margin:18px 0 26px">Heritage, worn beautifully.</h2>
    <p class="lead rv">Moorpankh brings together vintage-inspired sarees, traditional silhouettes and handmade jewellery — pieces chosen for their craft, their character and their timelessness. Based in ${C.city}, delivering across Pakistan.</p>
    <div class="stats rv"><div><b>${P.length}</b><small>Pieces</small></div><div><b>${C.deliveryEstimate.split(" ")[0]}</b><small>Working days delivery</small></div><div><b>COD</b><small>Across Pakistan</small></div></div>
    <p style="margin-top:36px" class="rv"><a class="btn mag" href="story.html">Our story</a></p></div></section>

  <section class="pin" id="pin" aria-label="Editorial"><div class="pin-img" data-i="0">${I("model-arch","Two women in sarees beneath a heritage archway")}</div><div class="pin-img" data-i="1">${I("hero-3","Woman in a red banarsi saree")}</div><div class="pin-img" data-i="2">${I("hero-2","Woman in a grey silk saree with jewellery")}</div>
    <div class="pin-txt"><p class="eyebrow" style="color:var(--gold-l);margin-bottom:18px">Editorial</p><div class="pin-word"><i>Heritage</i><i>Craft</i><i>Grace</i></div><p class="pin-sub" id="psub">Silhouettes drawn from the arcades and courtyards of the subcontinent.</p></div>
    <div class="pin-n"><b id="pn">01</b>/ 03</div></section>

  <section class="hscroll" id="hs"><div class="hs-pin"><div class="hs-title"><div><p class="eyebrow">Featured · Vintage Sarees</p><h2 class="h2">The Saree Edit</h2></div><a class="link" href="sarees.html">Shop sarees</a></div>
    <div class="hs-track" id="hst">${gal.map((g,i)=>`<a class="hs-i" href="sarees.html"><span class="no">0${i+1}</span><figure><div class="pic">${I(g[0],g[1],"data-par")}</div><figcaption>${g[1]}<small>${g[2]}</small></figcaption></figure></a>`).join("")}</div></div></section>

  <section class="heri" id="heri"><div class="pic">${I("heritage-2","Red sandstone arcade","data-par")}</div><div class="heri-in"><div><p class="eyebrow" style="color:var(--gold-l)">Lahore · Heritage</p><h2 class="split-line" style="margin-top:14px">Rooted in heritage.</h2><p>Inspired by the arches, courtyards and palaces where these textiles were once worn.</p></div></div></section>

  <section class="jew" id="jew"><canvas id="jGL" aria-hidden="true"></canvas><div class="wrap"><p class="eyebrow">Handmade · Collectible</p><h2 class="h2 split-line" style="margin-top:14px;max-width:12ch">Jewellery with a past.</h2>
    <div class="j-grid"><div><p class="lead" style="margin-bottom:34px">Statement necklaces, bangles and accessories, handcrafted in vintage spirit.</p>
      <ul class="j-list">${[["Necklaces","jewel-1"],["Earrings","jewel-2"],["Bangles","jewel-7"],["Hair accessories","jewel-4"]].map((j,i)=>`<li><a href="jewellery.html" data-follow="images/${j[1]}.jpg">${j[0]}<small>0${i+1}</small></a></li>`).join("")}</ul>
      <p style="margin-top:36px"><a class="btn mag" style="background:var(--gold);color:var(--ink)" href="jewellery.html">Shop jewellery</a></p></div>
      <div class="j-stage"><div class="pic a rv">${I("jewel-1","Model wearing a kundan necklace","data-par")}</div><div class="pic b rv">${I("jewel-3","Bride adorned in gold jewellery","data-par")}</div><div class="pic c rv">${I("jewel-6","Gold necklace on a display bust","data-par")}</div></div></div></div></section>

  <section class="craft"><div style="display:grid;grid-template-rows:1.3fr 1fr"><div class="pic">${I("jewel-7","Close-up of gold chain over embroidered red silk","data-par")}</div><div class="pic">${I("fabric-2","Pink silk close-up","data-par")}</div></div>
    <div class="txt"><p class="eyebrow">The art of handcrafted elegance</p><h2 class="h2 split-line">Made by hand. Worn for years.</h2>
    <ol><li class="rv"><b>Hand block printed</b><span>Pieces like Lavender Dream and Azure Elegance carry the mark of the artisan's hand.</span></li><li class="rv"><b>Banarsi &amp; zari</b><span>Formal banarsi in chiffon, and cotton zari checks, woven for occasions that matter.</span></li><li class="rv"><b>Art you can wear</b><span>Our Frida Kahlo sarees turn digital print into wearable portraiture.</span></li></ol></div></section>

  <section class="wrap"><div class="head-row"><div><p class="eyebrow">Shop by</p><h2 class="h2">Collections</h2></div><a class="link" href="collections.html">All collections</a></div>
    <div class="cols3"><a href="sarees.html" class="rv"><div class="pic">${I("hero-1","Sarees","data-par")}</div><h3>Vintage Sarees</h3></a><a href="shop.html?cat=suits" class="rv"><div class="pic">${I("model-tree","Ready to wear","data-par")}</div><h3>Ready to Wear</h3></a><a href="jewellery.html" class="rv"><div class="pic">${I("jewel-3","Jewellery","data-par")}</div><h3>Handmade Jewellery</h3></a></div></section>

  <section class="wrap"><div class="head-row"><div><p class="eyebrow">From the catalogue</p><h2 class="h2">Featured Pieces</h2></div></div>
    <div class="rows">${best.map((p,i)=>`<a class="row" href="product.html?id=${p.id}" data-fp="${p.id}"><span class="n">0${i+1}</span><div><h3>${esc(p.name)}</h3><small>${esc(p.sub)}</small></div><span class="pr">${money(p.price)}</span><span class="ar">→</span></a>`).join("")}</div></section>

  <section style="padding-top:0"><div class="ig">${["hero-2","jewel-2","model-green","heritage-1","hero-4","jewel-4"].map(f=>`<a href="https://instagram.com/${C.instagram}" target="_blank" rel="noopener" aria-label="Moorpankh on Instagram"><div class="pic">${I(f,"Moorpankh on Instagram","loading=\"lazy\"")}</div></a>`).join("")}</div>
    <p style="text-align:center;margin-top:24px"><a class="link" href="https://instagram.com/${C.instagram}" target="_blank" rel="noopener">@${C.instagram} on Instagram</a></p></section>

  <section class="news"><div class="pic">${I("heritage-3","Mysore Palace lit at night","data-par")}</div><div class="in"><p class="eyebrow">Newsletter</p><h2 class="h2 split-line" style="margin-top:12px">First to see what's new.</h2>
    <form id="nf"><input type="email" required placeholder="Your email" aria-label="Email"><button class="btn">Subscribe</button></form></div></section>`;
};

const COLLECTIONS = {
  banarsi:{title:"Banarsi & Formal",c1:"#5a1020",c2:"#c9a24b",test:p=>p.sub==="Banarsi"||p.sub==="Semi Formal",text:"Heavy chiffon and formal banarsi sarees for weddings and occasions."},
  blockprint:{title:"Hand Block Printed",c1:"#4c3a86",c2:"#cfe6fb",test:p=>p.sub==="Hand Block Printed",text:"Lavender Dream, Azure Elegance — printed by hand."},
  frida:{title:"Frida Kahlo Edit",c1:"#2f3b2a",c2:"#c8402a",test:p=>/frida|viva/i.test(p.name),text:"Art-inspired digital print sarees."},
  cotton:{title:"Cotton, Lawn & Summer",c1:"#e9a817",c2:"#f3efe6",test:p=>["Cotton","Lawn","Summer","Daily Wear"].includes(p.sub),text:"Light, breathable pieces for everyday elegance."},
  rtw:{title:"Ready to Wear",c1:"#6a3d33",c2:"#e8c9ce",test:p=>p.cat==="suits",text:"Co-ords, kaftans and 2-piece sets."}
};

pages.shop = (cat0) => {
  const q=new URLSearchParams(location.search); let cat=cat0||q.get("cat")||"all";
  const title={all:"Shop All",sarees:"Vintage Sarees",suits:"Ready to Wear",jewellery:"Handmade Jewellery"}[cat]||"Shop";
  const tabs=cat0?"":["all","sarees","suits","jewellery"].map(c=>`<button class="chip ${c===cat?"on":""}" data-cat="${c}">${{all:"All",sarees:"Sarees",suits:"Ready to wear",jewellery:"Jewellery"}[c]}</button>`).join("");
  setTimeout(()=>{
    const st={cat,sort:"feat",avail:false};
    const draw=()=>{
      let l=P.filter(p=>(st.cat==="all"||p.cat===st.cat)&&(!st.avail||buyable(p)));
      if(st.sort==="lo")l.sort((a,b)=>(a.price||1e9)-(b.price||1e9)); if(st.sort==="hi")l.sort((a,b)=>b.price-a.price);
      if(st.sort==="az")l.sort((a,b)=>a.name.localeCompare(b.name));
      $("#pg").innerHTML=l.length?l.map(card).join(""):'<p class="empty">Nothing here yet.</p>'; $("#cnt").textContent=l.length+" pieces"; reveal();
    };
    $$(".chip[data-cat]").forEach(b=>b.onclick=()=>{st.cat=b.dataset.cat;$$(".chip[data-cat]").forEach(x=>x.classList.toggle("on",x===b));draw()});
    $("#sort").onchange=e=>{st.sort=e.target.value;draw()}; $("#av").onchange=e=>{st.avail=e.target.checked;draw()}; draw();
  });
  return `<section class="wrap page-top"><p class="eyebrow">Moorpankh</p><h1 class="display" style="font-size:clamp(3rem,9vw,8rem)">${title}</h1></section>
  <section class="wrap" style="padding-top:20px"><div class="toolbar">${tabs}<label style="display:flex;flex-direction:row;align-items:center;gap:8px;text-transform:none;letter-spacing:0;font-size:.9rem"><input type="checkbox" id="av" style="width:auto"> Priced &amp; orderable only</label><span id="cnt" class="eyebrow"></span>
    <select id="sort" aria-label="Sort"><option value="feat">Featured</option><option value="lo">Price: low to high</option><option value="hi">Price: high to low</option><option value="az">Name A–Z</option></select></div><div class="grid" id="pg"></div></section>`;
};

pages.collections = () => `<section class="wrap page-top"><p class="eyebrow">Curated</p><h1 class="display" style="font-size:clamp(3rem,9vw,8rem)">Exclusive Collections</h1></section>
 ${Object.entries(COLLECTIONS).map(([k,c])=>{const l=P.filter(c.test);return `<section class="wrap" id="${k}" style="padding-block:50px"><div class="head-row"><div><h2 class="h2">${c.title}</h2><p class="lead" style="margin-top:10px">${c.text}</p></div></div><div class="grid">${l.map(card).join("")}</div></section>`}).join("")}`;

pages.product = () => {
  const id=new URLSearchParams(location.search).get("id"); const p=byId(id);
  if(!p) return `<section class="wrap page-top"><h1 class="h2">Piece not found</h1><p><a class="link" href="shop.html">Back to shop</a></p></section>`;
  document.title=p.name+" — Moorpankh";
  const rel=P.filter(x=>x.cat===p.cat&&x.id!==p.id).slice(0,4);
  setTimeout(()=>{
    let q=1; const set=()=>$("#q").textContent=q;
    $("#qm").onclick=()=>{q=Math.max(1,q-1);set()}; $("#qp").onclick=()=>{q=Math.min(p.stock||99,q+1);set()};
    const ab=$("#add"); if(ab){ab.onclick=()=>addToCart(p.id,q); $("#buy").onclick=()=>{addToCart(p.id,q);location.href="checkout.html"}}
    $("#wl").onclick=()=>{toggleWish(p.id);$("#wl").textContent=wish.includes(p.id)?"♥ In wishlist":"♡ Wishlist"};
    const z=$(".zoom"); z.onclick=()=>z.classList.toggle("z");
    z.onmousemove=e=>{if(!z.classList.contains("z"))return;const r=z.getBoundingClientRect();z.firstElementChild.style.transformOrigin=`${(e.clientX-r.left)/r.width*100}% ${(e.clientY-r.top)/r.height*100}%`};
    $$(".thumbs .ph").forEach((t,i)=>t.onclick=()=>{$$(".thumbs .ph").forEach(x=>x.classList.toggle("on",x===t));z.innerHTML=ph(p,i);gsapIn(z)});
  });
  const orderMsg=`Hello Moorpankh! I'd like to order / enquire about: ${p.name}${p.price?" ("+money(p.price)+")":""}. ${location.href}`;
  return `<section class="wrap pdp"><div class="gal"><div class="thumbs">${[0,1,2].map(i=>ph(p,i,i?"":"on")).join("")}</div><div class="zoom" aria-label="Zoom image">${ph(p,0)}</div></div>
   <div><p class="eyebrow">${esc(p.sub)} · ${{sarees:"Vintage Saree",suits:"Ready to wear",jewellery:"Jewellery"}[p.cat]}</p><h1>${esc(p.name)}</h1>
   <div class="pr">${p.price?money(p.price):"Price on request"}</div><span class="stock ${p.stock===0?"out":""}">${stockText(p)}</span>
   <p class="lead">${esc(p.desc)}</p>
   ${buyable(p)?`<div style="margin-top:24px"><div class="qty"><button id="qm" aria-label="Less">−</button><span id="q">1</span><button id="qp" aria-label="More">+</button></div></div>
   <div class="act"><button class="btn mag" id="add">Add to bag</button><button class="btn ghost mag" id="buy">Buy now</button></div>`:
   `<div class="act"><a class="btn wa mag" href="${waLink(orderMsg)}" target="_blank" rel="noopener">${p.stock===0?"Ask about restock":"Enquire on WhatsApp"}</a></div>`}
   <div class="act" style="margin-top:0"><button class="link" id="wl">${wish.includes(p.id)?"♥ In wishlist":"♡ Wishlist"}</button><a class="link" href="${waLink(orderMsg)}" target="_blank" rel="noopener">Order via WhatsApp</a></div>
   <div class="facts"><details open><summary>Details</summary><p>${esc(p.desc)} Sizes and variations are confirmed on WhatsApp.</p></details>
   <details><summary>Delivery</summary><p>Cash on Delivery across Pakistan. Estimated ${C.deliveryEstimate}.</p></details>
   <details><summary>Care &amp; returns</summary><p>See our <a class="link" href="shipping.html">shipping &amp; returns</a> policy.</p></details></div></div></section>
   <section class="wrap"><div class="head-row"><h2 class="h2">You may also love</h2></div><div class="grid">${rel.map(card).join("")}</div></section>`;
};

const lineItems = () => cart.map(i=>({p:byId(i.id),qty:i.qty})).filter(x=>x.p);
const totals = () => {const sub=lineItems().reduce((a,x)=>a+x.p.price*x.qty,0);return {sub,ship:sub?C.shippingFee:0,total:sub?sub+C.shippingFee:0}};
const sumHtml = () => {const t=totals();return `<div class="r"><span>Subtotal</span><span>${money(t.sub)}</span></div>${t.ship?`<div class="r"><span>Delivery</span><span>${money(t.ship)}</span></div>`:`<div class="r"><span>Delivery</span><span>Confirmed on WhatsApp</span></div>`}<div class="r t"><span>Total</span><span>${money(t.total)}</span></div>`};

pages.cart = () => {
  const draw=()=>{
    const l=lineItems(); const box=$("#cl"); if(!box)return;
    box.innerHTML=l.length?l.map(({p,qty})=>`<div class="cart-row">${ph(p)}<div><h3>${esc(p.name)}</h3><div class="sub">${money(p.price)}</div></div>
      <div class="qty"><button data-a="m" data-id="${p.id}" aria-label="Less">−</button><span>${qty}</span><button data-a="p" data-id="${p.id}" aria-label="More">+</button></div>
      <div><div class="price">${money(p.price*qty)}</div><button class="link" data-a="r" data-id="${p.id}">Remove</button></div></div>`).join(""):`<p class="empty">Your bag is empty. <a class="link" href="shop.html">Continue shopping</a></p>`;
    $("#cs").innerHTML=sumHtml(); $("#co").style.display=l.length?"":"none";
  };
  setTimeout(()=>{draw();$("#cl").onclick=e=>{const b=e.target.closest("[data-a]");if(!b)return;const it=cart.find(i=>i.id===b.dataset.id),p=byId(b.dataset.id);
    if(b.dataset.a==="p")it.qty=Math.min(p.stock||99,it.qty+1);if(b.dataset.a==="m")it.qty=Math.max(1,it.qty-1);if(b.dataset.a==="r")cart=cart.filter(i=>i!==it);saveCart();draw()}});
  return `<section class="wrap page-top"><h1 class="display" style="font-size:clamp(3rem,9vw,8rem)">Your Bag</h1></section>
  <section class="wrap" style="padding-top:20px"><div class="two"><div id="cl"></div><aside class="sum"><h3 style="font-size:1.8rem;margin-bottom:10px">Summary</h3><div id="cs"></div><a id="co" class="btn mag" style="width:100%;justify-content:center;margin-top:20px" href="checkout.html">Checkout</a></aside></div></section>`;
};

pages.wishlist = () => { const l=wish.map(byId).filter(Boolean);
  return `<section class="wrap page-top"><h1 class="display" style="font-size:clamp(3rem,9vw,8rem)">Wishlist</h1></section><section class="wrap" style="padding-top:20px">${l.length?`<div class="grid">${l.map(card).join("")}</div>`:`<p class="empty">Nothing saved yet. <a class="link" href="shop.html">Explore the collection</a></p>`}</section>`};

pages.checkout = () => {
  setTimeout(()=>{
    const f=$("#cf"); if(!f)return;
    f.onsubmit=e=>{e.preventDefault(); const l=lineItems(); if(!l.length)return toast("Your bag is empty");
      const d=Object.fromEntries(new FormData(f)); const t=totals();
      const order={no:"MP"+Date.now().toString().slice(-7),date:new Date().toISOString(),customer:d,items:l.map(x=>({id:x.p.id,name:x.p.name,price:x.p.price,qty:x.qty})),...t,status:"Pending confirmation"};
      const all=store.get("orders",[]);all.push(order);store.set("orders",all);
      const msg=`New Moorpankh order ${order.no}\n\n`+order.items.map(i=>`• ${i.name} × ${i.qty} — ${money(i.price*i.qty)}`).join("\n")+`\n\nTotal: ${money(t.total)}\nPayment: ${d.pay}\n\nName: ${d.name}\nPhone: ${d.phone}\nAddress: ${d.address}, ${d.city}${d.postal?" "+d.postal:""}\n${d.notes?"Notes: "+d.notes:""}`;
      cart=[];saveCart();
      $("#app").innerHTML=`<section class="wrap page-top" style="min-height:70vh"><p class="eyebrow">Order received</p><h1 class="display" style="font-size:clamp(3rem,8vw,7rem)">Thank you, ${esc(d.name.split(" ")[0])}.</h1>
      <p class="lead" style="margin:20px 0">Your order <b>${order.no}</b> is saved. <b>Please tap the button below to send it to us on WhatsApp</b> — we confirm every order there${d.pay==="Cash on Delivery"?" and you pay on delivery":", along with payment details"}. Estimated delivery: ${C.deliveryEstimate}.</p>
      <p><a class="btn wa mag" href="${waLink(msg)}" target="_blank" rel="noopener">Send order on WhatsApp</a></p>
      <p style="margin-top:24px"><a class="link" href="shop.html">Continue shopping</a></p></section>`;window.scrollTo(0,0)};
    $("#cks").innerHTML=lineItems().map(({p,qty})=>`<div class="r"><span>${esc(p.name)} × ${qty}</span><span>${money(p.price*qty)}</span></div>`).join("")+sumHtml();
  });
  return `<section class="wrap page-top"><h1 class="display" style="font-size:clamp(3rem,9vw,8rem)">Checkout</h1></section>
  <section class="wrap" style="padding-top:20px">${lineItems().length?`<div class="two"><form id="cf" class="form" autocomplete="on"><h3 style="font-size:1.8rem">Delivery details</h3>
   <div class="g2"><label>Full name<input name="name" required autocomplete="name"></label><label>Phone / WhatsApp<input name="phone" type="tel" required pattern="[0-9+ \\-]{10,15}" autocomplete="tel" placeholder="03XX XXXXXXX"></label></div>
   <label>Email (optional)<input name="email" type="email" autocomplete="email"></label>
   <label>Street address<textarea name="address" rows="2" required autocomplete="street-address"></textarea></label>
   <div class="g2"><label>City<input name="city" required autocomplete="address-level2"></label><label>Postal code<input name="postal" autocomplete="postal-code"></label></div>
   <label>Order notes<textarea name="notes" rows="2"></textarea></label>
   <h3 style="font-size:1.8rem;margin-top:10px">Payment</h3><div class="pay">
    <label><input type="radio" name="pay" value="Cash on Delivery" checked><span><b>Cash on Delivery</b><br>Available across Pakistan.</span></label>
    <label><input type="radio" name="pay" value="Online transfer (JazzCash/Easypaisa/Bank)"><span><b>Online transfer</b><br>${C.paymentNote}</span></label></div>
   <button class="btn mag" style="justify-content:center">Place order</button><small style="color:var(--muted)">Your details are kept on your device and sent only to Moorpankh via WhatsApp.</small></form>
   <aside class="sum"><h3 style="font-size:1.8rem;margin-bottom:10px">Your order</h3><div id="cks"></div></aside></div>`:`<p class="empty">Your bag is empty. <a class="link" href="shop.html">Continue shopping</a></p>`}</section>`;
};

pages.story = () => `<section class="page-top"><p class="eyebrow">Our Story</p><h1 class="display">Timeless, on purpose.</h1></section>
 <section class="wrap intro-s"><div class="photo-pair"><div class="pic rv"><img src="images/model-red.jpg" alt="Woman in a red saree and veil" data-par></div><div class="pic rv" style="margin-top:60px"><img src="images/jewel-2.jpg" alt="Woman in a pink saree and gold jewellery" data-par></div></div>
 <div class="prose"><p class="lead">Moorpankh is a Lahore-based label for vintage sarees, traditional fashion and handmade jewellery.</p><h2>Why the peacock</h2><p>Moorpankh means peacock feather — a symbol of grace and heritage. <em>[Replace with your own founding story.]</em></p><h2>What we believe</h2><p>Wear sustainability. Wear heritage. Pieces made to be kept, not discarded.</p><p><a class="btn mag" href="shop.html">Explore the collection</a></p></div></section>`;

pages.journal = () => `<section class="page-top"><p class="eyebrow">Journal</p><h1 class="display">Editorial</h1></section>
 <section class="wrap"><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(320px,1fr))">${[["How to drape a banarsi saree","Styling","hero-3"],["Hand block printing: a closer look","Craft","fabric-2"],["Mixing vintage jewellery with a plain saree","Jewellery","jewel-1"]].map(a=>`<article class="card-p rv"><div class="pic" style="aspect-ratio:3/4"><img src="images/${a[2]}.jpg" alt="${a[0]}" loading="lazy"></div><div class="meta"><h3>${a[0]}</h3></div><p class="sub">${a[1]} · article coming soon</p></article>`).join("")}</div></section>`;

pages.contact = () => {
  setTimeout(()=>{const f=$("#ctf");if(f)f.onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(f));window.open(waLink(`Hello Moorpankh, I'm ${d.name} (${d.phone}).\n${d.msg}`),"_blank","noopener");toast("Opening WhatsApp…")}});
  return `<section class="wrap page-top"><p class="eyebrow">Contact</p><h1 class="display">Say hello.</h1></section>
  <section class="wrap" style="padding-top:20px"><div class="two"><form id="ctf" class="form"><label>Name<input name="name" required></label><label>Phone<input name="phone" required></label><label>Message<textarea name="msg" rows="5" required></textarea></label><button class="btn mag" style="justify-content:center">Send via WhatsApp</button></form>
  <div class="prose"><h2 style="margin-top:0">Reach us</h2><p>WhatsApp: <a class="link" href="${waLink("Hello Moorpankh!")}" target="_blank" rel="noopener">Chat now</a></p><p>Instagram: <a class="link" href="https://instagram.com/${C.instagram}" target="_blank" rel="noopener">@${C.instagram}</a></p><p>Email: ${C.email}</p><p>${C.city}</p></div></div></section>`;
};

pages.faq = () => { const q=[["How long does delivery take?",`Estimated ${C.deliveryEstimate} across Pakistan.`],["Do you offer Cash on Delivery?","Yes, across Pakistan."],["Can I see more photos of a piece?","Message us on WhatsApp and we'll send more pictures."],["Some pieces say 'Price on request'. Why?","Those pieces have no listed price yet — message us on WhatsApp for the price and availability."],["Are sarees stitched?","Sarees are unstitched unless stated; ask us about blouse options."],["How do I pay online?",C.paymentNote]];
  return `<section class="wrap page-top"><p class="eyebrow">Help</p><h1 class="display">FAQs</h1></section><section class="wrap" style="padding-top:20px"><div class="prose facts">${q.map(x=>`<details><summary>${x[0]}</summary><p>${x[1]}</p></details>`).join("")}</div></section>`};

pages.shipping = () => `<section class="wrap page-top"><p class="eyebrow">Policies</p><h1 class="display" style="font-size:clamp(3rem,8vw,7rem)">Shipping &amp; Returns</h1></section>
 <section class="wrap" style="padding-top:20px"><div class="prose"><h2>Delivery</h2><p>We ship across Pakistan from ${C.city}. Estimated delivery: ${C.deliveryEstimate}.</p><h2>Payment</h2><p>Cash on Delivery, or online transfer confirmed on WhatsApp.</p><h2>Exchanges &amp; returns</h2><p><em>[Add your exchange/return policy here — this has not been supplied yet, so none is stated.]</em></p></div></section>`;

/* ---------- animation ---------- */
const hasG = ()=>!!(window.gsap&&window.ScrollTrigger);
function gsapIn(el){ if(window.gsap) gsap.from(el,{opacity:0,duration:.5}); }
function reveal(){
  if(!hasG()){$$(".rv").forEach(el=>el.style.cssText="opacity:1;transform:none");return}
  const els=$$(".rv:not(.rb)"); if(!els.length)return; els.forEach(e=>e.classList.add("rb"));
  ScrollTrigger.batch(els,{start:"top 94%",once:true,onEnter:b=>gsap.to(b,{opacity:1,y:0,duration:1.1,stagger:.1,ease:"power3.out",overwrite:true})});
}
function splitWords(el){
  if(el.dataset.sp) return; el.dataset.sp=1;
  el.innerHTML=el.textContent.trim().split(/\s+/).map(w=>`<span class="w"><i>${w}</i></span>`).join(" ");
}
function homeHero(startDelay){
  const urls=["hero-1","hero-3","hero-2","hero-4"].map(n=>`images/${n}.jpg`);
  const cnt=$("#hc"); let gl=null, timer;
  const fb=$(".h-fb");
  const upd=i=>{ if(cnt) cnt.textContent="0"+(i+1) };
  if(window.MP_GL&&MP_GL.ok()){
    gl=MP_GL.hero($("#heroGL"),urls,upd);
    if(gl) fb.style.visibility="hidden";
  }
  if(!gl){ // fallback: CSS cross-fade between the same photographs
    const arch=$("#harch"); const imgs=[fb]; urls.slice(1).forEach(u=>{const im=fb.cloneNode();im.src=u;im.style.opacity=0;arch.appendChild(im);imgs.push(im)}); let c=0;
    gl={next(){const n=(c+1)%imgs.length;gsap.to(imgs[c],{opacity:0,duration:1.2});gsap.to(imgs[n],{opacity:1,duration:1.2});c=n;upd(n)}};
  }
  const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
  if(!reduce) setTimeout(()=>{ timer=setInterval(()=>{ if(!document.hidden) gl.next() },5200) },startDelay*1000+1500);
  $("#harch").addEventListener("click",()=>gl.next());
  // intro timeline
  const tl=gsap.timeline({delay:startDelay});
  tl.fromTo(".hero .h-title .ln i",{yPercent:115},{yPercent:0,duration:1.5,ease:"expo.out",stagger:.12},0)
    .fromTo("#harch",{clipPath:"inset(100% 0% 0% 0%)"},{clipPath:"inset(0% 0% 0% 0%)",duration:1.7,ease:"expo.inOut"},0.1)
    .fromTo(".h-side",{opacity:0,y:60},{opacity:1,y:0,duration:1.2,stagger:.15,ease:"power3.out"},0.9)
    .fromTo(".h-copy,.h-count,.h-cta,.doodle",{opacity:0,y:30},{opacity:1,y:0,duration:1,stagger:.08,ease:"power3.out"},1.2);
  // scroll drift
  gsap.to(".h-title .ln:nth-child(1)",{xPercent:-8,ease:"none",scrollTrigger:{trigger:"#hero",start:"top top",end:"bottom top",scrub:true}});
  gsap.to(".h-title .ln:nth-child(2)",{xPercent:8,ease:"none",scrollTrigger:{trigger:"#hero",start:"top top",end:"bottom top",scrub:true}});
  gsap.to("#harch",{yPercent:12,scale:1.04,ease:"none",scrollTrigger:{trigger:"#hero",start:"top top",end:"bottom top",scrub:true}});
  gsap.to(".h-side img",{yPercent:-10,ease:"none",scrollTrigger:{trigger:"#hero",start:"top top",end:"bottom top",scrub:true}});
}
function pinned(){
  const pin=$("#pin"); if(!pin) return;
  const imgs=$$(".pin-img",pin), words=$$(".pin-word i",pin), subs=["Silhouettes drawn from the arcades and courtyards of the subcontinent.","Zari, banarsi and hand block prints — slow work, made to be kept.","The quiet confidence of a saree worn well."];
  gsap.set(imgs.slice(1),{clipPath:"inset(100% 0% 0% 0%)"}); gsap.set(words.slice(1),{yPercent:105});
  const tl=gsap.timeline({scrollTrigger:{trigger:pin,start:"top top",end:"+=320%",pin:true,scrub:.7,anticipatePin:1,onUpdate:s=>{const i=Math.min(2,Math.round(s.progress*2));$("#pn").textContent="0"+(i+1);$("#psub").textContent=subs[i]}}});
  [1,2].forEach(i=>{ const t=(i-1)*1.2;
    tl.to(words[i-1],{yPercent:-105,duration:.6,ease:"power2.in"},t+.6)
      .to(imgs[i],{clipPath:"inset(0% 0% 0% 0%)",duration:1,ease:"power2.inOut"},t+.4)
      .fromTo(imgs[i].querySelector("img"),{scale:1.25},{scale:1,duration:1.2,ease:"none"},t+.4)
      .to(words[i],{yPercent:0,duration:.6,ease:"power2.out"},t+.9); });
  tl.to({},{duration:.5});
}
function hgallery(){
  const hs=$("#hs"); if(!hs) return;
  if(innerWidth>1000){ const tr=$("#hst"), dist=()=>tr.scrollWidth-innerWidth+60;
    gsap.to(tr,{x:()=>-dist(),ease:"none",scrollTrigger:{trigger:hs,start:"top top",end:()=>"+="+dist(),pin:".hs-pin",scrub:.6,invalidateOnRefresh:true,anticipatePin:1}});
    $$(".hs-i .pic img",hs).forEach(im=>gsap.fromTo(im,{xPercent:-8},{xPercent:8,ease:"none",scrollTrigger:{trigger:hs,start:"top top",end:()=>"+="+dist(),scrub:true}}));
  } else { $("#hst").style.cssText="overflow-x:auto;width:auto;padding-bottom:20px"; $(".hs-pin").style.height="auto"; hs.style.padding="60px 0" }
}
function followHover(sel,build){
  const f=document.createElement("div"); f.className="follow"; document.body.appendChild(f);
  const qx=gsap.quickTo(f,"left",{duration:.5,ease:"power3"}),qy=gsap.quickTo(f,"top",{duration:.5,ease:"power3"});
  $$(sel).forEach(a=>{
    a.addEventListener("mouseenter",()=>{f.innerHTML=build(a);gsap.to(f,{opacity:1,scale:1,duration:.5,ease:"power3.out"})});
    a.addEventListener("mouseleave",()=>gsap.to(f,{opacity:0,scale:.8,duration:.4}));
    a.addEventListener("mousemove",e=>{qx(e.clientX+40);qy(e.clientY)});
  });
}
function MP_start(pg){
  const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches||location.search.includes("nomotion");
  const pre=document.createElement("div");
  const wantPre=pg==="home"&&!reduce&&!location.search.includes("nopre")&&!sessionStorage.getItem("mp_pre");
  if(!hasG()||reduce){
    $$(".rv").forEach(e=>e.style.cssText="opacity:1;transform:none");
    if(pg==="home"&&window.MP_GL){ try{ homeHeroStatic() }catch(e){} }
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  // smooth scrolling
  if(window.Lenis&&innerWidth>1000){ const l=new Lenis({lerp:.09}); l.on("scroll",ScrollTrigger.update); gsap.ticker.add(t=>l.raf(t*1000)); gsap.ticker.lagSmoothing(0); }
  let delay=.15;
  if(wantPre){
    try{sessionStorage.setItem("mp_pre","1")}catch(e){}
    pre.id="pre"; pre.innerHTML='<div><div class="w">'+"Moorpankh".split("").map(c=>`<i>${c}</i>`).join("")+'</div><small>Elegance beyond time</small></div>'; document.body.appendChild(pre);
    gsap.set("#pre .w i",{yPercent:110});
    const t=gsap.timeline({onComplete:()=>pre.remove()});
    t.to("#pre .w i",{yPercent:0,duration:1,ease:"expo.out",stagger:.05}).to("#pre small",{opacity:.8,duration:.6},"<.4")
     .to(pre,{clipPath:"inset(0 0 100% 0)",duration:1.1,ease:"expo.inOut"},"+=.5");
    delay=2.7; setTimeout(()=>pre.remove(),6000);
  }
  reveal();
  $$(".split-line").forEach(el=>{splitWords(el);gsap.from($$(".w i",el),{yPercent:115,duration:1.2,ease:"expo.out",stagger:.07,scrollTrigger:{trigger:el,start:"top 88%",once:true}})});
  $$("img[data-par]").forEach(im=>{ const box=im.closest(".pic")||im.parentElement; if(box.closest(".hs-i")) return;
    gsap.fromTo(im,{yPercent:-9,scale:1.18},{yPercent:9,scale:1.18,ease:"none",scrollTrigger:{trigger:box,start:"top bottom",end:"bottom top",scrub:true}}) });
  if(pg==="home"){
    homeHero(delay); pinned(); hgallery();
    const jc=$("#jGL"); if(jc&&window.MP_GL) MP_GL.jewel(jc,$("#jew"));
    if(matchMedia("(hover:hover) and (pointer:fine)").matches){
      followHover("[data-follow]",a=>`<img src="${a.dataset.follow}" alt="">`);
      followHover("[data-fp]",a=>{const p=byId(a.dataset.fp);return ph(p)});
    }
  }
  window.addEventListener("load",()=>ScrollTrigger.refresh());
  pointer();
}
function homeHeroStatic(){ const c=$("#heroGL"); if(c&&MP_GL.ok()){ const g=MP_GL.hero(c,["images/hero-1.jpg","images/hero-3.jpg"]); if(g) $(".h-fb").style.visibility="hidden"; } }
function pointer(){
  if(!matchMedia("(hover:hover) and (pointer:fine)").matches||!window.gsap)return;
  const c=document.createElement("div");c.id="cur";document.body.appendChild(c);
  const x=gsap.quickTo(c,"left",{duration:.25}),y=gsap.quickTo(c,"top",{duration:.25});
  addEventListener("mousemove",e=>{x(e.clientX);y(e.clientY)});
  document.addEventListener("mouseover",e=>{const t=e.target.closest(".card-p,.zoom,.hs-i,.h-arch,.cols3 a,.ig a");c.classList.toggle("big",!!t);c.textContent=t?(t.matches(".h-arch")?"Next":"View"):""});
  $$(".mag").forEach(b=>{const mx=gsap.quickTo(b,"x",{duration:.4,ease:"power3"}),my=gsap.quickTo(b,"y",{duration:.4,ease:"power3"});
    b.addEventListener("mousemove",e=>{const r=b.getBoundingClientRect();mx((e.clientX-r.left-r.width/2)*.25);my((e.clientY-r.top-r.height/2)*.35)});
    b.addEventListener("mouseleave",()=>{mx(0);my(0)})});
}

/* ---------- boot ---------- */
function boot(){
  const pg=document.body.dataset.page;
  const html=pg==="sarees"?pages.shop("sarees"):pg==="jewellery"?pages.shop("jewellery"):(pages[pg]||pages.home)();
  document.body.insertAdjacentHTML("afterbegin",header());
  const app=$("#app"); app.innerHTML=html; app.insertAdjacentHTML("afterend",footer());
  updateBadges();
  const hdr=$("#hdr"), onS=()=>hdr.classList.toggle("solid",scrollY>40||pg!=="home"); onS(); addEventListener("scroll",onS,{passive:true});
  $("#bg").onclick=()=>$("#nav").classList.toggle("open");
  const s=$("#search"),sq=$("#sq"),sr=$("#sr");
  $("#sbtn").onclick=()=>{s.classList.add("open");sq.focus()}; $("#sx").onclick=()=>s.classList.remove("open");
  addEventListener("keydown",e=>{if(e.key==="Escape")s.classList.remove("open")});
  sq.oninput=()=>{const v=sq.value.trim().toLowerCase();sr.innerHTML=v?P.filter(p=>(p.name+p.sub+p.cat+p.desc).toLowerCase().includes(v)).map(card).join("")||"<p>No results.</p>":"";$$(".rv",sr).forEach(e=>e.style.cssText="opacity:1;transform:none")};
  const nf=$("#nf"); if(nf) nf.onsubmit=e=>{e.preventDefault();const em=nf.querySelector("input").value;const l=store.get("news",[]);l.push(em);store.set("news",l);nf.reset();toast("Thank you — we'll be in touch")};
  MP_start(pg);
}
window.MP={add:addToCart,wish:toggleWish};
document.addEventListener("DOMContentLoaded",boot);
})();
