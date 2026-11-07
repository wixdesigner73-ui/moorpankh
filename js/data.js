/* ============================================================
   MOORPANKH — STORE CONFIG + PRODUCT CATALOGUE
   Edit this file to add / edit / remove products.
   - price: 0  => "Price on request" (cannot be added to cart; order via WhatsApp)
   - stock: number of units available (set 0 for sold out). Not in your catalogue, so
            default is null = "Available — confirm on WhatsApp". Set a number to enforce limits.
   - Product photos: put files in  images/products/<id>.jpg  (extra angles: <id>-2.jpg, <id>-3.jpg)
   - Logo: images/logo.png     Hero/editorial photos: images/hero-1.jpg, hero-2.jpg, editorial-1.jpg ...
   ============================================================ */
window.MP_CONFIG = {
  brand: "Moorpankh",
  city: "Lahore, Pakistan",
  whatsapp: "920000000000",          // <-- REPLACE with your number, country code first, no + (e.g. 923001234567)
  instagram: "moorpankhpk",
  email: "hello@moorpankh.com",      // <-- replace
  currency: "PKR",
  deliveryEstimate: "3–5 working days",
  shippingFee: 0,                    // flat delivery fee in PKR; 0 = not charged
  paymentNote: "Bank transfer / JazzCash / Easypaisa details are shared on WhatsApp after you place the order."
};

window.MP_PRODUCTS = [
  // ---------- SAREES ----------
  { id:"frida-chiffon", name:"Frida Kahlo Chiffon Saree", cat:"sarees", sub:"Statement", price:12500, c1:"#2f3b2a", c2:"#b5763a",
    desc:"Frida Kahlo inspired digital print on chiffon." },
  { id:"lavender-dream", name:"Lavender Dream", cat:"sarees", sub:"Hand Block Printed", price:9500, c1:"#b9a6d8", c2:"#4c3a86",
    desc:"Moorpankh: Lavender Dream — hand block printed saree." },
  { id:"viva-la-vida", name:"Viva La Vida", cat:"sarees", sub:"Statement", price:12500, c1:"#c8402a", c2:"#f1e6d2",
    desc:"Our Frida Kahlo saree — Viva La Vida." },
  { id:"azure-elegance", name:"Azure Elegance", cat:"sarees", sub:"Hand Block Printed", price:9500, c1:"#2f8fe0", c2:"#cfe6fb",
    desc:"Chiffon hand block printed saree in azure." },
  { id:"noor-e-afshan", name:"Noor e Afshan", cat:"sarees", sub:"Semi Formal", price:7500, c1:"#efe8d6", c2:"#c9a24b",
    desc:"Semi formal saree — Noor e Afshan." },
  { id:"white-plum-cotton", name:"White & Plum Cotton Zari Checkered", cat:"sarees", sub:"Cotton", price:6999, c1:"#f3efe6", c2:"#6a2a6f",
    desc:"White and plum cotton saree with zari checks." },
  { id:"lawn-checkered-saree", name:"Lawn Checkered Saree (Unstitched)", cat:"sarees", sub:"Lawn", price:6500, c1:"#e8b4b8", c2:"#a8323e",
    desc:"A playful lawn checkered saree. Unstitched." },
  { id:"mango-cotton", name:"Mango Season Cotton Saree", cat:"sarees", sub:"Cotton", price:7999, c1:"#e9a817", c2:"#b8321f",
    desc:"Celebrate mango season in style with this cotton saree." },
  { id:"black-banarsi", name:"Formal Black Banarsi Saree", cat:"sarees", sub:"Banarsi", price:8900, c1:"#16151a", c2:"#b8934a",
    desc:"Elegance never goes out of style — formal black banarsi saree." },
  { id:"rust-banarsi", name:"Rust Vibes Banarsi Saree", cat:"sarees", sub:"Banarsi", price:9500, c1:"#b3541e", c2:"#e8d3a9",
    desc:"Rust Vibes — grace meets timeless style in a banarsi saree." },
  { id:"green-chiffon-banarsi", name:"Bottle Green Chiffon Banarsi Saree", cat:"sarees", sub:"Banarsi", price:0, c1:"#0f4a36", c2:"#c9a24b",
    desc:"Bottle green chiffon banarsi saree." },
  { id:"mauve-banarsi", name:"Mauve Formal Banarsi Saree", cat:"sarees", sub:"Banarsi", price:0, c1:"#b79aa8", c2:"#d9c28a",
    desc:"Mauve colour banarsi chiffon saree." },
  { id:"maroon-formal", name:"Heavy Formal Maroon Saree", cat:"sarees", sub:"Banarsi", price:0, c1:"#5a1020", c2:"#c9a24b",
    desc:"Heavy formal maroon chiffon banarsi saree." },

  // ---------- READY TO WEAR ----------
  { id:"chocolate-2pc", name:"Chocolate Brown Crepe Malai Co-Ord", cat:"suits", sub:"2 Piece", price:5999, c1:"#6a3d33", c2:"#c8a58f",
    desc:"Chocolate brown crepe malai co-ord set." },
  { id:"pink-kaftan", name:"Pink Raw Silk Embroidered Kaftan", cat:"suits", sub:"Kaftan", price:5999, c1:"#a76b78", c2:"#e8c9ce",
    desc:"Pink raw silk embroidered kaftan." },
  { id:"mustard-daily", name:"Effortlessly Chic in Mustard", cat:"suits", sub:"Daily Wear", price:3499, c1:"#d9a41a", c2:"#f2dc8a",
    desc:"Mustard daily wear." },
  { id:"sky-tie-dye", name:"Sky Blue Tie & Dye Ripple Cotton", cat:"suits", sub:"2 Piece", price:3499, c1:"#7ba7d6", c2:"#dcebf7",
    desc:"Sky blue tie & dye ripple cotton 2pc." },
  { id:"black-cotton-shirt", name:"Black Cotton Shirt", cat:"suits", sub:"Summer", price:1799, c1:"#1c1c1f", c2:"#6b6b70",
    desc:"Summer vibes — stay effortlessly cool in black cotton." },
  { id:"lawn-checkered-2pc", name:"Checkered Lawn 2PC Farshi Set", cat:"suits", sub:"Lawn", price:0, c1:"#b98b6e", c2:"#f0e2d0",
    desc:"Checkered lawn 2PC set — farshi shalwar and kurta." },
  { id:"lawn-farshi", name:"Lawn Farshi Suit", cat:"suits", sub:"Lawn", price:0, c1:"#6a2230", c2:"#d9b88a",
    desc:"A timeless blend of elegance and comfort." },
  { id:"arabic-lawn", name:"Printed Arabic Lawn 2PC", cat:"suits", sub:"Lawn", price:0, c1:"#b9bfc9", c2:"#e8e9ee",
    desc:"Printed Arabic lawn shirt & trouser." },

  // ---------- JEWELLERY & ACCESSORIES ----------
  { id:"raja-rani-necklace", name:"Raja Rani Necklace", cat:"jewellery", sub:"Neckpiece", price:3999, c1:"#8a3a22", c2:"#d4a954",
    desc:"Raja Rani — a statement necklace." },
  { id:"hair-accessory", name:"Bohemian Hair Accessory", cat:"jewellery", sub:"Accessory", price:1999, c1:"#b88a4a", c2:"#e9d9b8",
    desc:"Wrap your hair in effortless bohemian style." },
  { id:"ethnic-bangles", name:"Handmade Ethnic Bangles", cat:"jewellery", sub:"Bangles", price:0, c1:"#c0392b", c2:"#e9b84a",
    desc:"Wear sustainability. Wear Moorpankh." }
];
