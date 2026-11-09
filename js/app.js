/* Moorpankh storefront. Plain JS, no libraries. Layout language after colinguest.com. */
(function(){
const C=window.MP_CONFIG,P=window.MP_PRODUCTS,MEDIA=window.MP_MEDIA||{},COL=window.MP_COLLECTIONS||{best:[],new:[]};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const money=n=>C.currency+" "+n.toLocaleString("en-PK");
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const store={get(k,d){try{return JSON.parse(localStorage.getItem("mp_"+k))??d}catch(e){return d}},set(k,v){try{localStorage.setItem("mp_"+k,JSON.stringify(v))}catch(e){}}};
const byId=id=>P.find(p=>p.id===id);
const buyable=p=>p.price>0&&p.stock!==0;
const waLink=t=>`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(t)}`;
const priceTxt=p=>p.price?money(p.price):"Price on request";
const CATS=[["all","View All"],["best","Best Sellers"],["new","New Arrivals"],["sarees","Vintage Sarees"],["jewellery","Handmade Jewellery"]];
const inCat=(p,c)=>c==="all"||(c==="best"?COL.best.includes(p.id):c==="new"?COL.new.includes(p.id):p.cat===c);

/* ---------- media ---------- */
function media(p){const m=MEDIA[p.id]||{};const photos=[];for(let i=0;i<(m.photos||0);i++)photos.push(`images/products/${p.id}${i?"-"+(i+1):""}.jpg?v=pp`);return{cut:m.cut?m.cut+"?v=11":null,photos}}
const hasPic=p=>{const m=media(p);return !!(m.cut||m.photos.length)};
const MARK='<img src="images/peacock.png" alt="" aria-hidden="true">';
function thumbHTML(p){const m=media(p);return m.cut?`<img src="${m.cut}" alt="${esc(p.name)}">`:m.photos[0]?`<img class="cv" src="${m.photos[0]}" alt="${esc(p.name)}">`:MARK}

/* ---------- icons ---------- */
const I={
 search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
 user:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4.5-6 8-6s7 1.5 8 6"/></svg>',
 bm:'<svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4.5L6 21z"/></svg>',
 bag:'<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/></svg>',
 menu:'<svg viewBox="0 0 24 24"><path d="M3 9h18M3 15h12"/></svg>',
 x:'<svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg>',
 home:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/></svg>',
 film:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 3v18M17 3v18M3 8h4M3 12h4M3 16h4M17 8h4M17 12h4M17 16h4"/></svg>',
 grid:'<svg viewBox="0 0 24 24"><rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/></svg>',
 filt:'<svg viewBox="0 0 24 24"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg>',
 truck:'<svg viewBox="0 0 24 24"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg>',
 up:'<svg viewBox="0 0 24 24"><path d="m6 15 6-6 6 6"/></svg>',
 ig:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6"/></svg>',
 wa:'<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3z"/><path d="M9 8.5c0 3 3 6 6 6l1-1.4-2-1-1 .7c-1-.4-1.8-1.2-2.2-2.2l.7-1-1-2z"/></svg>',
 mail:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></svg>'
};
const WAFAB='<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.2 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.2.1.8-.1 1.3z"/></svg>';

/* ---------- state ---------- */
let cart=store.get("cart",[]),wish=store.get("wish",[]);
const saveCart=()=>{store.set("cart",cart);badges()};
function badges(){const n=cart.reduce((a,i)=>a+i.qty,0);$$("[data-cart-n]").forEach(b=>b.textContent="("+n+")");$$("[data-wish-dot]").forEach(d=>d.classList.toggle("on",wish.length>0))}
function toast(m){let t=$(".toast");if(!t){t=document.createElement("div");t.className="toast";t.setAttribute("role","status");document.body.appendChild(t)}t.textContent=m;t.classList.add("on");clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove("on"),2400)}
function addToCart(id,q=1,open=true){const p=byId(id);if(!p||!buyable(p)){toast("Ask us on WhatsApp for this piece");return false}
 const it=cart.find(i=>i.id===id),max=p.stock==null?99:p.stock;if(it)it.qty=Math.min(max,it.qty+q);else cart.push({id,qty:Math.min(max,q)});saveCart();if(open)openDrawer("cart");else toast("Added to bag");return true}
function toggleWish(id){wish=wish.includes(id)?wish.filter(w=>w!==id):[...wish,id];store.set("wish",wish);badges();$$(`[data-wish="${id}"]`).forEach(b=>b.classList.toggle("on",wish.includes(id)));toast(wish.includes(id)?"Saved":"Removed from saved")}
const lines=()=>cart.map(i=>({p:byId(i.id),qty:i.qty})).filter(x=>x.p);
const totals=()=>{const sub=lines().reduce((a,x)=>a+x.p.price*x.qty,0);const ship=sub?C.shippingFee:0;return{sub,ship,total:sub+ship}};

/* ---------- account (kept on this device only) ---------- */
async function hash(s){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
const users=()=>store.get("users",[]);const me=()=>{const e=store.get("session",null);return users().find(u=>u.email===e)||null};

/* ---------- product card ---------- */
function card(p){
 const m=media(p);let img;
 if(m.cut)img=`<img class="cut" src="${m.cut}" alt="${esc(p.name)}" loading="lazy">${m.photos[1]?`<img class="alt" src="${m.photos[1]}" alt="" loading="lazy">`:m.photos[0]?`<img class="alt" src="${m.photos[0]}" alt="" loading="lazy">`:""}`;
 else if(m.photos[0])img=`<img class="cover" src="${m.photos[0]}" alt="${esc(p.name)}" loading="lazy">${m.photos[1]?`<img class="alt" src="${m.photos[1]}" alt="" loading="lazy">`:""}`;
 else img=MARK;
 const tag=p.stock===0?"Sold out":"";
 return `<article class="pc"><a class="pc-img ${img===MARK?"empty":""}" href="product.html?id=${p.id}" aria-label="${esc(p.name)}">${tag?`<span class="pc-tag">${tag}</span>`:""}${img}</a>
 <button class="pc-bm ${wish.includes(p.id)?"on":""}" data-wish="${p.id}" aria-label="Save ${esc(p.name)}">${I.bm}</button>
 <div class="pc-meta"><div><a class="pc-n" href="product.html?id=${p.id}">${esc(p.name)}</a><div class="pc-p">${priceTxt(p)}</div></div><button class="pc-add" data-add="${p.id}" aria-label="${buyable(p)?"Add to bag":"View"}">+</button></div></article>`}

/* ---------- chrome ---------- */
const pg=document.body.dataset.page;
const NAV={home:"home",collections:"collections",sarees:"collections",jewellery:"collections",shop:"collections",product:"collections",about:"about"};
function chrome(){
 const on=k=>NAV[pg]===k?"on":"";
 return `<a class="skip" href="#app">Skip to content</a>
 <header class="hd" id="hd">
  <button class="hd-menu" id="menuBtn" aria-label="Open Menu">${I.menu}</button>
  <a class="hd-logo" href="index.html" aria-label="Moorpankh home"><img class="l-dark" src="images/logo.png" alt="Moorpankh"><img class="l-light" src="images/logo-light.png" alt=""></a>
  <nav class="hd-nav" aria-label="Main"><a href="index.html" class="${on("home")}">The Lookbook</a><a href="collections.html" class="${on("collections")}">Collections</a><a href="about.html" class="${on("about")}">About</a></nav>
  <div class="hd-ic"><button class="h-search" id="sBtn" aria-label="Search">${I.search}</button><a class="h-user" href="account.html" aria-label="Account">${I.user}</a><a href="wishlist.html" aria-label="Saved pieces">${I.bm}<i class="dot" data-wish-dot></i></a><button id="cBtn" aria-label="Open bag">${I.bag}<b data-cart-n>(0)</b></button></div>
 </header>
 <div class="scrim" id="scrim"></div>
 <aside class="drw left" id="dMenu" aria-label="Menu"><div class="drw-h" style="background:none;height:76px"><span class="up" style="color:var(--mute);font-size:9.5px">Index</span><button class="drw-x" data-close aria-label="Close Menu" style="margin-left:auto">${I.x}</button></div>
  <div class="drw-b" style="padding-top:6px"><ul>${[["View All","collections.html"],["Best Sellers","collections.html?cat=best"],["New Arrivals","collections.html?cat=new"],["Vintage Sarees","collections.html?cat=sarees"],["Handmade Jewellery","collections.html?cat=jewellery"],["Login / Account","account.html"],["About","about.html"]].map((m,i)=>`<li><a href="${m[1]}" style="display:flex;gap:16px;align-items:baseline;padding:11px 0;font:500 14px var(--sans);letter-spacing:.2em;text-transform:uppercase;color:#4d4943"><small style="font-size:8px;color:#b5b0a7;letter-spacing:.1em">0${i+1}</small>${m[0]}</a></li>`).join("")}</ul></div>
  <div class="drw-f" style="border:0"><div class="ft-soc"><a href="https://instagram.com/${C.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.ig}</a><a href="${waLink("Hello Moorpankh!")}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.wa}</a><a href="mailto:${C.email}" aria-label="Email">${I.mail}</a></div><small style="color:#b5b0a7;font-size:8px;letter-spacing:.2em;text-transform:uppercase">© ${new Date().getFullYear()} Moorpankh</small></div></aside>
 <aside class="drw" id="dCart" aria-label="Your cart"><div class="drw-h"><button class="drw-x" data-close aria-label="Close">${I.x}</button><h3>Your Cart</h3></div><div class="drw-b" id="cartBody"></div><div class="drw-f" id="cartFoot"></div></aside>
 <div class="srch" id="srch" role="dialog" aria-label="Search"><div class="srch-row"><div class="srch-in"><input id="sq" placeholder="Search here..." aria-label="Search" autocomplete="off">${I.search}</div><button class="drw-x" data-close aria-label="Close search">${I.x}</button></div><div id="sBody"></div></div>
 <nav class="mnav" aria-label="Quick"><a href="index.html" class="${pg==="home"?"on":""}" aria-label="Home">${I.home}</a><button id="sBtn2" aria-label="Search">${I.search}</button><a href="account.html" class="${pg==="account"?"on":""}" aria-label="Account">${I.user}</a><a href="collections.html" class="${NAV[pg]==="collections"?"on":""}" aria-label="Collections">${I.film}</a></nav>`}
function footer(){
 const fab=`<a class="wa-fab" href="${waLink("Hello Moorpankh! I would like some help.")}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${WAFAB}</a>`;
 if(pg==="home")return fab;
 return `<footer class="ft"><div class="ft-g"><div><h6>Inner Circle</h6><form class="ft-news" id="nf"><input type="email" required placeholder="Email" aria-label="Email"><button aria-label="Subscribe">→</button></form><h6>Customer Support</h6><div class="ft-soc"><a href="https://instagram.com/${C.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.ig}</a><a href="${waLink("Hello Moorpankh!")}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.wa}</a><a href="mailto:${C.email}" aria-label="Email">${I.mail}</a></div></div>
 <div><h6>Editorial</h6><ul><li><a href="index.html">The Lookbook</a></li><li><a href="about.html">About Us</a></li><li><a href="account.html">My Account</a></li><li><a href="account.html#orders">Order History</a></li></ul></div>
 <div><h6>Curations</h6><ul><li><a href="collections.html">All Products</a></li><li><a href="collections.html?cat=sarees">Vintage Sarees</a></li><li><a href="collections.html?cat=jewellery">Handmade Jewellery</a></li><li><a href="collections.html?cat=new">New Arrivals</a></li></ul></div>
 <div><h6>Assistance</h6><ul><li><a href="shipping.html">Shipping &amp; Returns</a></li><li><a href="faq.html">FAQs</a></li><li><a href="contact.html">Contact</a></li><li><a href="wishlist.html">Saved Pieces</a></li></ul></div></div>
 <img class="ft-mark" src="images/logo-light.png" alt=""><div class="ft-c">© ${new Date().getFullYear()} Moorpankh · ${C.city}</div></footer>
 <a class="wa-fab" href="${waLink("Hello Moorpankh! I would like some help.")}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${WAFAB}</a><button class="totop" id="toTop" aria-label="Back to top">${I.up}</button>`}

/* ---------- drawers ---------- */
function openDrawer(k){const map={cart:"#dCart",menu:"#dMenu",search:"#srch"};closeAll();if(k==="cart")renderCart();$(map[k]).classList.add("on");$("#scrim").classList.add("on");if(k==="search")setTimeout(()=>$("#sq").focus(),350)}
function closeAll(){$$(".drw.on,.srch.on,.scrim.on").forEach(e=>e.classList.remove("on"))}
function renderCart(){const L=lines();const b=$("#cartBody"),f=$("#cartFoot");
 b.innerHTML=L.length?L.map(({p,qty})=>{const m=media(p);return `<div class="ci"><a class="ci-i ${m.cut||m.photos[0]?"":"ph"}" href="product.html?id=${p.id}">${thumbHTML(p)}</a><div><a class="ci-n" href="product.html?id=${p.id}">${esc(p.name)}</a><div class="ci-p">${money(p.price)}</div><div class="qty"><button data-q="-" data-id="${p.id}" aria-label="Less">−</button><span>${qty}</span><button data-q="+" data-id="${p.id}" aria-label="More">+</button></div></div><div class="ci-r">${money(p.price*qty)}<button data-rm="${p.id}">Remove</button></div></div>`}).join(""):`<div class="cart-empty">${I.bag}Your bag is empty.</div>`;
 const t=totals();f.innerHTML=L.length?`<div class="tot"><span>Subtotal</span><span>${money(t.sub)}</span></div><small style="color:var(--mute);font-size:11px">Delivery: ${C.deliveryEstimate}. Cash on Delivery across Pakistan.</small><a class="btn pill" href="checkout.html">Checkout</a><a class="btn pill out" href="cart.html">View bag</a>`:`<a class="btn pill" href="collections.html">Continue shopping</a>`}

/* ---------- search ---------- */
const catThumb={best:"images/cut/red-arch.png",new:"images/cut/green-lamp.png",sarees:"images/cut/purple-brick.png",jewellery:"images/products/ethnic-bangles.jpg"};
function renderSearch(q){const body=$("#sBody");q=q.trim().toLowerCase();
 if(!q){body.innerHTML=`<h5>Collections</h5><div class="cc">${CATS.slice(1).map(c=>`<a href="collections.html?cat=${c[0]}"><div class="t"><img class="${c[0]==="jewellery"?"cv":""}" src="${catThumb[c[0]]}" alt=""></div><span>${c[1]}</span></a>`).join("")}</div>`;return}
 const r=P.filter(p=>(p.name+" "+p.sub+" "+p.cat+" "+p.desc).toLowerCase().includes(q));
 body.innerHTML=`<h5>${r.length} result${r.length===1?"":"s"}</h5>${r.length?`<div class="sres">${r.map(p=>card(p)).join("")}</div>`:`<p class="empty" style="padding:30px 0">Nothing found. Try “saree”, “banarsi” or “bangles”.</p>`}`}

/* ---------- pages ---------- */
const pages={};
const latest=()=>{const a=[...COL.new,...P.filter(hasPic).map(p=>p.id)];return [...new Set(a)].map(byId).filter(Boolean).slice(0,4)};
const lookbookItems=()=>P.filter(p=>media(p).cut&&(MEDIA[p.id]||{}).hero!==false);
pages.home=()=>{
 const L=lookbookItems();
 const lb=`<section class="lb" id="lb"><div class="lb-stage" id="lbStage">${L.map((p,i)=>`<button class="lb-m" data-i="${i}" aria-label="${esc(p.name)}"><img src="${media(p).cut}" alt="${esc(p.name)}"></button>`).join("")}<div class="lb-count" id="lbCount"></div><div class="lb-arrows"><button id="lbPrev" aria-label="Previous">‹</button><button id="lbNext" aria-label="Next">›</button></div><div class="lb-hint">Scroll</div></div>
  <aside class="lb-panel" aria-live="polite"><div class="lb-in" id="lbIn"></div></aside></section>`;
 const mh=`<section class="mh"><div class="mh-hero" id="mhHero">${["noor-e-afshan","rust-banarsi","green-chiffon-banarsi","maroon-formal","black-banarsi","azure-elegance"].map((id,i)=>`<img class="mh-s ${i?"":"on"}" src="images/products/${id}.jpg?v=pp" alt="${esc(byId(id).name)}" ${i?'loading="lazy"':""}>`).join("")}<a class="mh-cta glass" href="collections.html">Shop Now</a></div></section>`;
 return mh+lb};function initLookbook(){
 const L=lookbookItems(),stage=$("#lbStage");if(!stage||!L.length)return;
 let a=Math.min(3,L.length-1),busy=false,t0=0;const els=$$(".lb-m",stage);
 const S=[1,.69,.47,.34],X=[.70,.41,.22,.075],B=[78,175,236,290],O=[1,.97,.52,.2];
 const N=L.length,side=new Array(N).fill("");
 function layout(){const H=stage.clientHeight*.76,W=stage.clientWidth;
  els.forEach((el,i)=>{const d=((i-a)%N+N)%N;          // 0 = front, N-1..N-3 = the three on the left (wraps round)
   let k=d===0?0:(d>=N-3&&d<N)?N-d:null;
   const st=el.style;
   if(k!==null){st.height=(H*S[k])+"px";st.width=(H*S[k]*.72)+"px";st.left=(W*X[k])+"px";st.bottom=B[k]+"px";st.opacity=O[k];st.zIndex=10-k;st.pointerEvents=k?"auto":"none";st.filter=k>=2?"grayscale(.35)":"none";side[i]=""}
   else{const left=(N>=5&&d===N-4);const ns=left?"L":"R";
    if(side[i]&&side[i]!==ns){st.transition="none"}      // jump unseen across the screen (invisible) instead of flying over it
    if(left){st.height=(H*.25)+"px";st.width=(H*.14)+"px";st.left=(W*-.05)+"px";st.bottom=B[3]+"px";st.opacity=0;st.zIndex=1}
    else{st.height=(H*1.06)+"px";st.width=(H*1.06*.72)+"px";st.left=(W*.92)+"px";st.bottom=(B[0]-20)+"px";st.opacity=0;st.zIndex=11}
    st.pointerEvents="none";st.filter="none";side[i]=ns;
    if(st.transition==="none"){void el.offsetWidth;st.transition=""}}});
  $("#lbCount").textContent=String(a+1).padStart(2,"0")+" / "+String(N).padStart(2,"0")}
 function panel(first){const p=L[a],m=media(p),box=$("#lbIn");
  const fill=()=>{box.innerHTML=`<div class="lb-thumb ${m.cut?"":"ph"}">${thumbHTML(p)}</div><h2 class="lb-n">${esc(p.name)}</h2><p class="lb-d">${esc(p.desc)}</p><div class="lb-p">${priceTxt(p)}</div><a class="btn" href="product.html?id=${p.id}">Shop The Look</a>`;box.classList.remove("out")};
  if(first){fill();return}box.classList.add("out");setTimeout(fill,260)}
 function go(n){n=((n%N)+N)%N;if(busy||n===a)return;busy=true;a=n;layout();panel();setTimeout(()=>busy=false,650)}
 layout();panel(true);addEventListener("resize",layout);
 $("#lbPrev").onclick=()=>go(a-1);$("#lbNext").onclick=()=>go(a+1);
 els.forEach((el,i)=>el.addEventListener("click",()=>go(i)));
 let locked=false,lastT=0,acc=0,lastW=0;
 addEventListener("wheel",e=>{if(innerWidth<=900||scrollY>2||e.ctrlKey)return;
  const unit=e.deltaMode===1?16:e.deltaMode===2?innerHeight:1;
  const d=(Math.abs(e.deltaY)>=Math.abs(e.deltaX)?e.deltaY:e.deltaX)*unit;if(!d)return;
  e.preventDefault();                                    // home never scrolls the page itself
  const now=Date.now(),gap=now-lastW;lastW=now;
  const dir=d>0?1:-1;
  if(locked){ if(now-lastT>700&&gap>110)locked=false; else return }   // one glide = one step; unlock after a pause
  if(gap>220||Math.sign(acc)!==dir)acc=0;acc+=d;         // add up tiny trackpad deltas
  if(Math.abs(acc)<45)return;
  locked=true;lastT=now;acc=0;go(a+dir)},{passive:false});
 addEventListener("keydown",e=>{if(innerWidth<=900||scrollY>2||/INPUT|TEXTAREA/.test(document.activeElement.tagName))return;if(e.key==="ArrowRight"||e.key==="ArrowDown")go(a+1);if(e.key==="ArrowLeft"||e.key==="ArrowUp")go(a-1)});
 let sx=null;stage.addEventListener("touchstart",e=>sx=e.touches[0].clientX,{passive:true});stage.addEventListener("touchend",e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40)go(a+(dx<0?1:-1));sx=null});
}

pages.collections=()=>{
 const q=new URLSearchParams(location.search);let cat=q.get("cat")||({sarees:"sarees",jewellery:"jewellery"}[pg])||"all";if(!CATS.some(c=>c[0]===cat))cat="all";
 const st={cat,types:new Set(),avail:"",price:"",sort:"feat",dense:false};
 const types=[...new Set(P.map(p=>p.sub))];
 const prices=[["lt5","Under 5,000",p=>p.price>0&&p.price<5000],["mid","5,000 – 8,000",p=>p.price>=5000&&p.price<=8000],["gt8","Over 8,000",p=>p.price>8000]];
 const list=()=>{let l=P.filter(p=>inCat(p,st.cat));if(st.types.size)l=l.filter(p=>st.types.has(p.sub));
  if(st.avail==="in")l=l.filter(buyable);if(st.avail==="req")l=l.filter(p=>!p.price);
  const pr=prices.find(x=>x[0]===st.price);if(pr)l=l.filter(pr[2]);
  if(st.sort==="feat")l=[...l].sort((a,b)=>(hasPic(b)-hasPic(a))||(!!b.price-!!a.price));
  if(st.sort==="lo")l=[...l].sort((a,b)=>(a.price||1e9)-(b.price||1e9));if(st.sort==="hi")l=[...l].sort((a,b)=>b.price-a.price);if(st.sort==="az")l=[...l].sort((a,b)=>a.name.localeCompare(b.name));return l};
 const title=()=>({all:"All Products",best:"Best Sellers",new:"New Arrivals",sarees:"Vintage Sarees",jewellery:"Handmade Jewellery"}[st.cat]);
 const draw=()=>{const l=list();$("#cgrid").innerHTML=l.length?l.map(p=>card(p)).join(""):`<p class="empty" style="grid-column:1/-1">No pieces match these filters.</p>`;$("#cgrid").classList.toggle("d2",st.dense);$("#ctitle").textContent=title();$$(".pills .pill").forEach(b=>b.classList.toggle("on",b.dataset.c===st.cat));$("#fcount").textContent=l.length+" of "+P.length+" products";document.title=title()+" — Moorpankh"};
 const fdraw=()=>{$("#fbody").innerHTML=`<div class="fgrp"><h4>Type</h4><div class="chips">${types.map(t=>`<button class="chip ${st.types.has(t)?"on":""}" data-t="${esc(t)}">${esc(t)}<small>(${P.filter(p=>p.sub===t).length})</small></button>`).join("")}</div></div>
  <div class="fgrp"><h4>Availability</h4><div class="chips">${[["in","Ready to order"],["req","Price on request"]].map(a=>`<button class="chip ${st.avail===a[0]?"on":""}" data-a="${a[0]}">${a[1]}</button>`).join("")}</div></div>
  <div class="fgrp"><h4>Price</h4><div class="chips">${prices.map(a=>`<button class="chip ${st.price===a[0]?"on":""}" data-p="${a[0]}">${a[1]}</button>`).join("")}</div></div>
  <div class="fsort"><label for="fsort">Sort by:</label><select id="fsort">${[["feat","Featured"],["lo","Price: low to high"],["hi","Price: high to low"],["az","Name A–Z"]].map(s=>`<option value="${s[0]}" ${st.sort===s[0]?"selected":""}>${s[1]}</option>`).join("")}</select></div>`;
  draw()};
 setTimeout(()=>{
  $$(".pills .pill").forEach(b=>b.onclick=()=>{st.cat=b.dataset.c;history.replaceState(null,"","collections.html"+(st.cat==="all"?"":"?cat="+st.cat));draw();fdraw()});
  $("#fOpen").onclick=()=>{closeAll();fdraw();$("#dFilter").classList.add("on");$("#scrim").classList.add("on")};
  $("#fbody").onclick=e=>{const c=e.target.closest(".chip");if(!c)return;if(c.dataset.t!==undefined){const t=c.dataset.t;st.types.has(t)?st.types.delete(t):st.types.add(t)}if(c.dataset.a)st.avail=st.avail===c.dataset.a?"":c.dataset.a;if(c.dataset.p)st.price=st.price===c.dataset.p?"":c.dataset.p;fdraw()};
  $("#fbody").onchange=e=>{if(e.target.id==="fsort"){st.sort=e.target.value;fdraw()}};
  $("#fReset").onclick=()=>{st.types.clear();st.avail="";st.price="";st.sort="feat";fdraw()};$("#fApply").onclick=closeAll;
  $("#gBtn").onclick=()=>{st.dense=!st.dense;draw()};draw()});
 return `<div class="ph-top"><h1 id="ctitle"></h1><div class="ph-tools"><button class="gbtn" id="gBtn" aria-label="Change layout">${I.grid}</button><button class="fbtn" id="fOpen">${I.filt}Advance Filters</button></div></div>
 <div class="pills" role="tablist">${CATS.map(c=>`<button class="pill" data-c="${c[0]}">${c[1]}</button>`).join("")}</div>
 <section class="coll"><div class="grid" id="cgrid"></div></section>
 <aside class="drw" id="dFilter" aria-label="Filter"><div class="drw-h"><h3>Filter</h3><small id="fcount"></small><button class="drw-x" data-close aria-label="Close" style="margin-left:14px">${I.x}</button></div><div class="drw-b" id="fbody"></div><div class="drw-f two"><button class="btn pill out" id="fReset">Remove all</button><button class="btn pill" id="fApply">Apply</button></div></aside>`};
pages.sarees=pages.collections;pages.jewellery=pages.collections;pages.shop=pages.collections;

pages.product=()=>{
 const id=new URLSearchParams(location.search).get("id"),p=byId(id);
 if(!p)return `<div class="pg-wrap"><p class="pg-title">Piece not found</p><a class="link" href="collections.html">Back to collections</a></div>`;
 document.title=p.name+" — Moorpankh";const m=media(p);
 const imgs=[];if(m.cut)imgs.push({s:m.cut,c:""});else if(m.photos[0])imgs.push({s:m.photos[0],c:"cv"});
 (m.cut?m.photos:m.photos.slice(1)).forEach(s=>imgs.push({s,c:"cv"}));
 const gal=imgs.length?imgs.map((x,i)=>`<div class="pg" data-z="${x.s}">${i===0?`<button class="pg-bm ${wish.includes(p.id)?"on":""}" data-wish="${p.id}" aria-label="Save">${I.bm}</button>`:""}<img class="${x.c}" src="${x.s}" alt="${esc(p.name)}" ${i?'loading="lazy"':""}></div>`).join(""):`<div class="pg empty"><img src="images/peacock.png" alt=""></div>`;
 const rel=P.filter(x=>x.cat===p.cat&&x.id!==p.id).sort((a,b)=>hasPic(b)-hasPic(a)).slice(0,4);
 const msg=`Hello Moorpankh! I'd like to order / ask about: ${p.name}${p.price?" ("+money(p.price)+")":""}. ${location.href}`;
 setTimeout(()=>{
  let q=1;const set=()=>$("#q").textContent=q;
  if($("#qm")){$("#qm").onclick=()=>{q=Math.max(1,q-1);set()};$("#qp").onclick=()=>{q=Math.min(p.stock||99,q+1);set()};$("#add").onclick=()=>addToCart(p.id,q);$("#buy").onclick=()=>{if(addToCart(p.id,q,false))location.href="checkout.html"}}
  $("#dchk").onclick=()=>{const v=$("#dcity").value.trim();$("#dres").textContent=v?`Delivery to ${v}: ${C.deliveryEstimate}. Cash on Delivery available. Exact timing is confirmed on WhatsApp.`:"Please enter your city."};
  $("#dcity").onkeydown=e=>{if(e.key==="Enter")$("#dchk").click()};
  $$(".tabs-h button").forEach(b=>b.onclick=()=>{$$(".tabs-h button").forEach(x=>x.classList.toggle("on",x===b));$$(".tabs-b>div").forEach(d=>d.hidden=d.dataset.t!==b.dataset.t)});
  $$(".pg[data-z]").forEach(g=>g.onclick=e=>{if(e.target.closest("[data-wish]"))return;const l=$("#lbx");l.querySelector("img").src=g.dataset.z;l.classList.add("on")});
  $("#lbx").onclick=()=>$("#lbx").classList.remove("on")});
 return `<div class="pdp"><div class="pdp-gal">${gal}</div>
 <aside class="pi"><div class="pi-top"><div><h1>${esc(p.name)}</h1><div class="pi-p">${priceTxt(p)}</div></div><span class="pi-t">${esc(p.sub)}</span></div>
  <div class="pi-st">${p.stock===0?"Sold out":p.price?"Available":"Price on request"}</div>
  ${buyable(p)?`<div class="pi-q"><span>Quantity</span><div class="qty"><button id="qm" aria-label="Less">−</button><span id="q">1</span><button id="qp" aria-label="More">+</button></div></div><div class="pi-act"><button class="btn pill out" id="add">Add to bag</button><button class="btn pill" id="buy">Buy now</button></div>`:`<div class="pi-act" style="grid-template-columns:1fr"><a class="btn pill wa" href="${waLink(msg)}" target="_blank" rel="noopener">${p.stock===0?"Ask about restock":"Enquire on WhatsApp"}</a></div>`}
  <hr><div class="pi-dl">${I.truck}Check delivery details</div><div class="pi-chk"><input id="dcity" placeholder="Enter city" aria-label="City"><button class="btn" id="dchk">Check</button></div><div class="pi-res" id="dres"></div>
  <div class="tabs"><div class="tabs-h"><button class="on" data-t="d">Details &amp; description</button><button data-t="s">Shipping</button></div><div class="tabs-b"><div data-t="d"><h6>Details</h6><p>${esc(p.sub)} · ${p.cat==="jewellery"?"Handmade jewellery":p.cat==="sarees"?"Vintage saree":"Ready to wear"}</p><h6>Description</h6><p>${esc(p.desc)}</p><p style="margin-top:10px"><a class="link" href="${waLink(msg)}" target="_blank" rel="noopener">Order or ask on WhatsApp</a></p></div><div data-t="s" hidden><h6>Delivery</h6><p>Across Pakistan, estimated ${C.deliveryEstimate}. Cash on Delivery available.</p><h6>Exchanges &amp; returns</h6><p>See our <a class="link" href="shipping.html">shipping &amp; returns</a> page.</p></div></div></div></aside></div>
 ${rel.length?`<section class="sec"><div class="sec-h"><h2>You may also like</h2></div><div class="grid">${rel.map(x=>card(x)).join("")}</div></section>`:""}
 <div class="lbx" id="lbx"><img alt=""></div>`};

pages.wishlist=()=>{const l=wish.map(byId).filter(Boolean);return `<div class="ph-top"><h1>Saved Pieces</h1></div><section class="coll" style="padding-top:26px">${l.length?`<div class="grid">${l.map(p=>card(p)).join("")}</div>`:`<p class="empty">Nothing saved yet. <a class="link" href="collections.html" style="margin-left:8px">Browse collections</a></p>`}</section>`};

const sumHTML=()=>{const t=totals();return `<div class="sumrow"><span>Subtotal</span><span>${money(t.sub)}</span></div><div class="sumrow"><span>Delivery</span><span>${t.ship?money(t.ship):"Confirmed on WhatsApp"}</span></div><div class="sumrow t"><span>Total</span><span>${money(t.total)}</span></div>`};
pages.cart=()=>{setTimeout(()=>{const draw=()=>{const L=lines();$("#cl").innerHTML=L.length?L.map(({p,qty})=>`<div class="ci"><a class="ci-i ${media(p).cut||media(p).photos[0]?"":"ph"}" href="product.html?id=${p.id}">${thumbHTML(p)}</a><div><a class="ci-n" href="product.html?id=${p.id}">${esc(p.name)}</a><div class="ci-p">${money(p.price)}</div><div class="qty"><button data-q="-" data-id="${p.id}">−</button><span>${qty}</span><button data-q="+" data-id="${p.id}">+</button></div></div><div class="ci-r">${money(p.price*qty)}<button data-rm="${p.id}">Remove</button></div></div>`).join(""):`<div class="cart-empty">${I.bag}Your bag is empty.</div>`;$("#cs").innerHTML=sumHTML();$("#co").style.display=L.length?"":"none"};window.__cartDraw=draw;draw()});
 return `<div class="pg-wrap"><p class="pg-title">Your Bag</p><div class="two"><div id="cl"></div><aside class="card"><div id="cs"></div><a id="co" class="btn pill" style="width:100%;margin-top:18px" href="checkout.html">Checkout</a></aside></div></div>`};

pages.checkout=()=>{const u=me();
 setTimeout(()=>{const f=$("#cf");if(!f)return;$("#cks").innerHTML=lines().map(({p,qty})=>`<div class="sumrow"><span>${esc(p.name)} × ${qty}</span><span>${money(p.price*qty)}</span></div>`).join("")+sumHTML();
  f.onsubmit=e=>{e.preventDefault();const L=lines();if(!L.length)return toast("Your bag is empty");const d=Object.fromEntries(new FormData(f));const t=totals();
   const order={no:"MP"+Date.now().toString().slice(-7),date:new Date().toISOString(),email:(me()||{}).email||d.email||"",customer:d,items:L.map(x=>({id:x.p.id,name:x.p.name,price:x.p.price,qty:x.qty})),...t,status:"Pending confirmation"};
   const all=store.get("orders",[]);all.push(order);store.set("orders",all);
   const msg=`New Moorpankh order ${order.no}\n\n`+order.items.map(i=>`• ${i.name} × ${i.qty} — ${money(i.price*i.qty)}`).join("\n")+`\n\nTotal: ${money(t.total)}\nPayment: ${d.pay}\n\nName: ${d.name}\nPhone: ${d.phone}\nAddress: ${d.address}, ${d.city}${d.postal?" "+d.postal:""}\n${d.notes?"Notes: "+d.notes:""}`;
   cart=[];saveCart();$("#app").innerHTML=`<div class="pg-wrap" style="text-align:center;padding-top:90px"><p class="pg-title">Order received</p><h1 style="font:italic 600 clamp(2rem,5vw,3.6rem)/1.1 var(--serif);margin-bottom:18px">Thank you, ${esc(d.name.split(" ")[0])}.</h1><p style="max-width:52ch;margin:0 auto 26px;color:#5f5a52">Your order <b>${order.no}</b> is saved. <b>Tap the button below to send it to us on WhatsApp</b>; we confirm every order there${d.pay==="Cash on Delivery"?" and you pay on delivery":", along with payment details"}. Estimated delivery: ${C.deliveryEstimate}.</p><a class="btn pill wa" href="${waLink(msg)}" target="_blank" rel="noopener">Send order on WhatsApp</a><p style="margin-top:26px"><a class="link" href="collections.html">Continue shopping</a></p></div>`;scrollTo(0,0)}});
 return `<div class="pg-wrap"><p class="pg-title">Checkout</p>${lines().length?`<div class="two"><form id="cf" class="form card"><p class="up" style="color:var(--mute)">Delivery details</p>
  <div class="g2"><label class="f">Full name<input name="name" required autocomplete="name" value="${esc(u?u.name:"")}"></label><label class="f">Phone / WhatsApp<input name="phone" type="tel" required pattern="[0-9+ \\-]{10,15}" autocomplete="tel" placeholder="03XX XXXXXXX" value="${esc(u?u.phone||"":"")}"></label></div>
  <label class="f">Email (optional)<input name="email" type="email" autocomplete="email" value="${esc(u?u.email:"")}"></label>
  <label class="f">Street address<textarea name="address" rows="2" required autocomplete="street-address"></textarea></label>
  <div class="g2"><label class="f">City<input name="city" required autocomplete="address-level2"></label><label class="f">Postal code<input name="postal" autocomplete="postal-code"></label></div>
  <label class="f">Order notes<textarea name="notes" rows="2"></textarea></label>
  <p class="up" style="color:var(--mute);margin-top:6px">Payment</p>
  <label class="opt"><input type="radio" name="pay" value="Cash on Delivery" checked><span><b>Cash on Delivery</b><br>Available across Pakistan.</span></label>
  <label class="opt"><input type="radio" name="pay" value="Online transfer (JazzCash/Easypaisa/Bank)"><span><b>Online transfer</b><br>${esc(C.paymentNote)}</span></label>
  <button class="btn pill" style="height:48px">Place order</button><small style="color:var(--mute)">Your details stay on your device and are sent only to Moorpankh via WhatsApp.</small></form>
  <aside class="card"><p class="up" style="color:var(--mute);margin-bottom:10px">Your order</p><div id="cks"></div></aside></div>`:`<p class="empty">Your bag is empty. <a class="link" href="collections.html" style="margin-left:8px">Continue shopping</a></p>`}</div>`};

pages.account=()=>{
 const render=()=>{const u=me();const box=$("#acc");
  if(u){const mine=store.get("orders",[]).filter(o=>o.email===u.email);
   box.innerHTML=`<div class="two"><div class="card"><p class="up" style="color:var(--mute);margin-bottom:12px">Hello, ${esc(u.name.split(" ")[0])}</p><div class="sumrow"><span>Name</span><span>${esc(u.name)}</span></div><div class="sumrow"><span>Email</span><span>${esc(u.email)}</span></div><div class="sumrow"><span>Phone</span><span>${esc(u.phone||"—")}</span></div><p style="margin-top:20px"><button class="btn pill out" id="so">Sign out</button></p></div>
   <div class="card" id="orders"><p class="up" style="color:var(--mute);margin-bottom:6px">Order history</p>${mine.length?mine.slice().reverse().map(o=>`<div class="ordr"><div><b>${o.no}</b><br><small style="color:var(--mute)">${new Date(o.date).toLocaleDateString("en-GB")} · ${o.items.length} item${o.items.length>1?"s":""}</small></div><div style="text-align:right">${money(o.total)}<br><small style="color:var(--mute)">${esc(o.status)}</small></div></div>`).join(""):`<p style="color:var(--mute);padding:14px 0">No orders yet.</p>`}</div></div>`;
   $("#so").onclick=()=>{store.set("session",null);render();toast("Signed out")}}
  else{box.innerHTML=`<div class="two"><form class="card form" id="lf"><p class="up" style="color:var(--mute)">Sign in</p><label class="f">Email<input name="email" type="email" required autocomplete="email"></label><label class="f">Password<input name="pw" type="password" required autocomplete="current-password"></label><button class="btn pill">Sign in</button><small id="lerr" style="color:#a33"></small></form>
   <form class="card form" id="rf"><p class="up" style="color:var(--mute)">Create account</p><label class="f">Full name<input name="name" required autocomplete="name"></label><label class="f">Email<input name="email" type="email" required autocomplete="email"></label><label class="f">Phone<input name="phone" type="tel" autocomplete="tel"></label><label class="f">Password (6+ characters)<input name="pw" type="password" minlength="6" required autocomplete="new-password"></label><button class="btn pill out">Create account</button><small style="color:var(--mute)">Accounts are saved on this device only. There is no online account system yet.</small></form></div>`;
   $("#lf").onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));const u=users().find(x=>x.email===d.email.toLowerCase());if(u&&u.hash===await hash(u.salt+d.pw)){store.set("session",u.email);render();toast("Signed in")}else $("#lerr").textContent="Email or password is incorrect."};
   $("#rf").onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));const em=d.email.toLowerCase();if(users().some(x=>x.email===em)){toast("That email already has an account");return}const salt=crypto.getRandomValues(new Uint32Array(2)).join("-");const all=users();all.push({name:d.name,email:em,phone:d.phone,salt,hash:await hash(salt+d.pw)});store.set("users",all);store.set("session",em);render();toast("Account created")}}};
 setTimeout(()=>{render();if(location.hash==="#orders")setTimeout(()=>{const o=$("#orders");o&&o.scrollIntoView()},50)});
 return `<div class="pg-wrap"><p class="pg-title">My Account</p><div id="acc"></div></div>`};

pages.about=()=>`<section class="ab-hero"><img src="images/model-arch.jpg" alt="Two women in vintage sarees beneath a heritage archway"><div><h1>Moorpankh</h1><small>Scroll to explore</small></div></section>
 <section class="ab-body"><div><h2>Timeless, on purpose.</h2><p>Moorpankh is a ${esc(C.city.split(",")[0])} label for vintage sarees, traditional fashion and handmade vintage jewellery.</p><p>Moorpankh means peacock feather, a symbol of grace and heritage. Every piece is chosen for its craft, its character and its timelessness, and made to be worn for years.</p><p><a class="btn" href="collections.html">Explore Collections</a></p></div><div class="ab-img"><img src="images/about-1.webp" alt="Moorpankh, in a black-and-white checked saree" loading="lazy"></div></section>
 <section class="ab-wide"><div class="ab-img2"><img src="images/about-2.webp" alt="Moorpankh on stage" loading="lazy"></div></section>
 <section class="ab-pts"><div><b>Vintage Sarees</b><span>Banarsi, hand block printed, cotton and statement sarees.</span></div><div><b>Handmade Jewellery</b><span>Handcrafted vintage-inspired earrings, necklaces, bangles and accessories.</span></div><div><b>Across Pakistan</b><span>Cash on Delivery, estimated ${C.deliveryEstimate}. Order on WhatsApp anytime.</span></div></section>`;

pages.contact=()=>{setTimeout(()=>{const f=$("#ctf");if(f)f.onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(f));window.open(waLink(`Hello Moorpankh, I'm ${d.name} (${d.phone}).\n${d.msg}`),"_blank","noopener");toast("Opening WhatsApp…")}});
 return `<div class="pg-wrap"><p class="pg-title">Contact</p><div class="two"><form id="ctf" class="form card"><label class="f">Name<input name="name" required></label><label class="f">Phone<input name="phone" required></label><label class="f">Message<textarea name="msg" rows="5" required></textarea></label><button class="btn pill">Send via WhatsApp</button></form><div class="prose"><h2 style="margin-top:0">Reach us</h2><p>WhatsApp: <a class="link" href="${waLink("Hello Moorpankh!")}" target="_blank" rel="noopener">Chat now</a></p><p>Instagram: <a class="link" href="https://instagram.com/${C.instagram}" target="_blank" rel="noopener">@${C.instagram}</a></p><p>Email: ${esc(C.email)}</p><p>${esc(C.city)}</p></div></div></div>`};
pages.faq=()=>{const q=[["How long does delivery take?",`Estimated ${C.deliveryEstimate} across Pakistan.`],["Do you offer Cash on Delivery?","Yes, across Pakistan."],["Can I see more photos of a piece?","Message us on WhatsApp and we'll send more pictures."],["Some pieces say 'Price on request'. Why?","Those pieces have no listed price yet. Message us on WhatsApp for the price and availability."],["How do I pay online?",C.paymentNote]];
 return `<div class="pg-wrap"><p class="pg-title">FAQs</p><div class="faq" style="max-width:760px">${q.map(x=>`<details><summary>${x[0]}</summary><p>${x[1]}</p></details>`).join("")}</div></div>`};
pages.shipping=()=>`<div class="pg-wrap"><p class="pg-title">Shipping &amp; Returns</p><div class="prose"><h2>Delivery</h2><p>We ship across Pakistan from ${esc(C.city)}. Estimated delivery: ${C.deliveryEstimate}.</p><h2>Payment</h2><p>Cash on Delivery, or online transfer confirmed on WhatsApp.</p><h2>Exchanges &amp; returns</h2><p>Our exchange and return policy will be published here. Until then, message us on WhatsApp and we'll help.</p></div></div>`;

/* ---------- boot ---------- */
function boot(){
 document.body.insertAdjacentHTML("afterbegin",chrome());
 const app=$("#app");app.innerHTML=(pages[pg]||pages.home)();app.insertAdjacentHTML("afterend",footer());
 badges();
 const hd=$("#hd"),top=$("#toTop"),onS=()=>{hd.classList.toggle("solid",scrollY>40);top&&top.classList.toggle("on",scrollY>500)};onS();addEventListener("scroll",onS,{passive:true});
 if(top)top.onclick=()=>scrollTo({top:0,behavior:"smooth"});
 $("#scrim").onclick=closeAll;
 document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeAll();const l=$("#lbx");l&&l.classList.remove("on")}});
 document.addEventListener("click",e=>{
  const t=e.target;let b;
  if(t.closest("[data-close]"))return closeAll();
  if(b=t.closest("[data-add]")){e.preventDefault();const id=b.dataset.add,p=byId(id);if(buyable(p))addToCart(id,1);else location.href="product.html?id="+id;return}
  if(b=t.closest("[data-wish]")){e.preventDefault();e.stopPropagation();toggleWish(b.dataset.wish);return}
  if(b=t.closest("[data-q]")){const it=cart.find(i=>i.id===b.dataset.id),p=byId(b.dataset.id);if(it){it.qty=b.dataset.q==="+"?Math.min(p.stock||99,it.qty+1):Math.max(1,it.qty-1);saveCart();renderCart();window.__cartDraw&&window.__cartDraw()}return}
  if(b=t.closest("[data-rm]")){cart=cart.filter(i=>i.id!==b.dataset.rm);saveCart();renderCart();window.__cartDraw&&window.__cartDraw();return}
  if(t.closest("#cBtn"))return openDrawer("cart");
  if(t.closest("#sBtn")||t.closest("#sBtn2")){openDrawer("search");renderSearch($("#sq").value);return}
  if(t.closest("#menuBtn"))return openDrawer("menu");
  const a=t.closest("a[href]");if(a&&!a.target&&a.origin===location.origin&&!e.metaKey&&!e.ctrlKey&&a.pathname!==location.pathname){e.preventDefault();document.body.classList.add("leaving");setTimeout(()=>location.href=a.href,190)}
 });
 $("#sq").addEventListener("input",e=>renderSearch(e.target.value));
 const nf=$("#nf");if(nf)nf.onsubmit=e=>{e.preventDefault();const l=store.get("news",[]);l.push(nf.querySelector("input").value);store.set("news",l);nf.reset();toast("Thank you")};
 if(pg==="home")initLookbook();
 if(pg==="home"){const sl=[...document.querySelectorAll("#mhHero .mh-s")];if(sl.length>1&&!matchMedia("(prefers-reduced-motion:reduce)").matches){let k=0;setInterval(()=>{if(document.hidden||innerWidth>900)return;sl[k].classList.remove("on");k=(k+1)%sl.length;sl[k].classList.add("on")},4200)}}
 featherCursor();
 requestAnimationFrame(()=>requestAnimationFrame(()=>document.body.classList.add("ready")));
 addEventListener("pageshow",e=>{if(e.persisted){document.body.classList.remove("leaving");document.body.classList.add("ready")}});
}

/* peacock-feather pointer (desktop with a mouse only). The stem tip is the click point. */
function featherCursor(){
 if(!matchMedia("(hover:hover) and (pointer:fine)").matches||matchMedia("(prefers-reduced-motion:reduce)").matches)return;
 const W=32,H=68,TX=.19*W,TY=.99*H;   // tip position inside the image
 const c=document.createElement("div");c.id="cur";c.setAttribute("aria-hidden","true");c.innerHTML='<img src="images/feather.png?v=2" alt="">';document.body.appendChild(c);
 document.documentElement.classList.add("feather-cur");
 let x=-200,y=-200,tx=x,ty=y,rot=-8,trot=-8,sc=1,tsc=1,vis=false,lx=0;
 addEventListener("mousemove",e=>{tx=e.clientX;ty=e.clientY;trot=-8+Math.max(-26,Math.min(26,(e.clientX-lx)*1.3));lx=e.clientX;if(!vis){vis=true;x=tx;y=ty;c.style.opacity=1}},{passive:true});
 document.addEventListener("mouseleave",()=>{c.style.opacity=0;vis=false});
 document.addEventListener("mouseover",e=>{const t=e.target.closest("a,button,summary,.chip,.pill,.lb-m,.pg,[data-z]");tsc=t?1.35:1;const f=e.target.closest("input,textarea,select");document.documentElement.classList.toggle("native-cur",!!f)});
 document.addEventListener("mousedown",()=>tsc=.85);document.addEventListener("mouseup",()=>tsc=1.2);
 (function loop(){x+=(tx-x)*.35;y+=(ty-y)*.35;rot+=(trot-rot)*.12;trot+=(-8-trot)*.08;sc+=(tsc-sc)*.2;
  c.style.transform="translate("+(x-TX)+"px,"+(y-TY)+"px) rotate("+rot+"deg) scale("+sc+")";requestAnimationFrame(loop)})();
}
document.addEventListener("DOMContentLoaded",boot);
})();
