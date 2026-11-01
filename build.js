// Generates the site's HTML from data/products.js. Run with `npm run build`.
const fs = require('fs');
const path = require('path');
const { categories, products, listings } = require('./data/products');

const site = {
  name: 'A N Biotech',
  tagline: 'exploring the excellence',
  proprietor: 'Rohit Marwaha',
  address: ['Cabin No. F-3, SCO-270, Sector 14', 'Panchkula 134119, Haryana'],
  iec: 'ANYPM3939R',
  mobile: { label: '+91 98720 30862', tel: '+919872030862' },
  phones: [
    { label: '+91 80478 24098', tel: '+918047824098' },
    { label: '+91 80489 60076', tel: '+918048960076' }
  ],
  whatsapp: '919872030862',
  indiamart: 'https://www.indiamart.com/anbiotech/',
  trustseal: 'https://www.indiamart.com/anbiotech/trustseal/',
  maps: 'https://www.google.com/maps/search/?api=1&query=SCO-270%2C%20Sector%2014%2C%20Panchkula%20134119'
};

const brands = ['Horiba', 'Snibe', 'Mindray', 'Finecare', 'Labmate', 'Erba', 'Sensa Core', 'Diamond', 'URIT', 'Swarnraj', 'Nanofog'];
const featured = ['maglumi-800', 'yumizen-h500', 'labmate-biochemistry', 'st-200-pro', 'finecare-hba1c', 'icu-electric-bed', 'ot-table', 'led-ot-light'];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));
const inCategory = (id) => products.filter((p) => p.category === id);
const plural = (n) => `${n} product${n === 1 ? '' : 's'}`;
const whatsappLink = (text) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
const searchText = (p) => [p.name, p.brand, ...listings.filter((l) => l[2] === p.slug).map((l) => l[0])].join(' ').toLowerCase();
const hasServices = (p) => p.category !== 'reagents';
const generalMessage = 'Hello, I would like to enquire about your laboratory equipment.';

const markSvg = (cls) => `<svg class="${cls}" viewBox="0 0 230 212" aria-hidden="true"><path class="mark-dark" d="M28 96C24 124 62 158 112 160c44 2 88-10 102-34 2 12-14 32-44 40-62 16-146-14-142-70z"/><path class="mark-main" d="M28 96c28-22 78-30 128-14l10 24C118 88 70 86 28 96z"/><path class="mark-main" d="M104 4c44 12 88 50 92 100 3 40-16 78-44 104 15-30 22-66 12-100-9-32-30-72-60-104z"/><circle class="mark-main" cx="112" cy="50" r="23"/><circle class="mark-light" cx="112" cy="154" r="13"/></svg>`;

// Runs before first paint so animated content starts hidden. Without motion.js the page shows normally after the timeout.
const motionBootstrap = `(function(d){d.classList.add('js');if(!matchMedia('(prefers-reduced-motion: no-preference)').matches)return;d.classList.add('motion');try{if(sessionStorage.getItem('an-wipe')){sessionStorage.removeItem('an-wipe');d.classList.add('wipe-in')}}catch(e){}setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.remove('motion','wipe-in')},2500)})(document.documentElement)`;

function layout({ root = '', title, description, current, body, extraHead = '', extraScripts = '', message = generalMessage }) {
  const nav = [
    ['products.html', 'Products', 'products'],
    ['index.html#services', 'Services', 'services'],
    ['index.html#about', 'About', 'about'],
    ['index.html#contact', 'Contact', 'contact']
  ];
  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="icon" type="image/svg+xml" href="${root}assets/logo-mark.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Arvo:wght@700&text=ANBiotech%20&display=swap">
<link rel="stylesheet" href="${root}css/site.css">
<script>${motionBootstrap}</script>
${extraHead}</head>
<body data-root="${root}" data-whatsapp="${site.whatsapp}">
<div class="page-wipe" data-wipe aria-hidden="true"></div>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header ${current === 'home' ? 'over-hero' : 'is-solid'}" data-header>
  <div class="wrap header-row">
    <a class="brand" href="${root}index.html">
      ${markSvg('brand-mark')}
      <span class="brand-text">
        <span class="brand-name">${site.name}</span>
        <span class="brand-tag">${site.tagline}</span>
      </span>
    </a>
    <nav class="main-nav" aria-label="Main" data-nav-links>
      ${nav.map(([href, label, id]) => `<a href="${root}${href}"${current === id ? ' aria-current="page"' : ''}>${label}</a>`).join('\n      ')}
      <span class="nav-indicator" aria-hidden="true"></span>
    </nav>
    <div class="nav-actions">
      <a class="nav-phone" href="tel:${site.mobile.tel}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M6.6 3.5h2.7l1.4 4.4-2 1.6a13 13 0 0 0 6 6l1.6-2 4.4 1.4v2.7c0 1.2-1 2.2-2.2 2.1C10.300 19.100 4.900 13.700 4.500 5.700 4.400 4.500 5.400 3.500 6.600 3.500z"/></svg>
        ${site.mobile.label}
      </a>
      <a class="nav-enquiry" href="${root}enquiry.html"${current === 'enquiry' ? ' aria-current="page"' : ''}>Enquiry list <span class="count" data-enquiry-count hidden>0</span></a>
      <button type="button" class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu" data-nav-toggle>
        <span class="nav-toggle-bars" aria-hidden="true"><span></span><span></span></span>
        <span class="count" data-enquiry-count hidden>0</span>
      </button>
    </div>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" data-mobile-menu>
  <nav aria-label="Menu">
    ${nav.map(([href, label]) => `<a href="${root}${href}">${label}</a>`).join('\n    ')}
    <a href="${root}enquiry.html">Enquiry list <span class="count" data-enquiry-count hidden>0</span></a>
  </nav>
  <p class="mobile-menu-contact">
    <a href="tel:${site.mobile.tel}">${site.mobile.label}</a><br>
    ${site.address.join('<br>')}
  </p>
</div>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div>
      <p class="footer-name">${site.name}</p>
      <p>${site.address.join('<br>')}</p>
    </div>
    <div>
      <p class="footer-heading">Products</p>
      <ul>
        ${categories.map((c) => `<li><a href="${root}products.html#${c.id}">${esc(c.name)}</a></li>`).join('\n        ')}
      </ul>
    </div>
    <div>
      <p class="footer-heading">Contact</p>
      <ul>
        <li><a href="tel:${site.mobile.tel}">${site.mobile.label}</a></li>
        ${site.phones.map((p) => `<li><a href="tel:${p.tel}">${p.label}</a></li>`).join('\n        ')}
        <li><a href="https://wa.me/${site.whatsapp}">WhatsApp</a></li>
        <li><a href="${site.indiamart}" rel="noopener">IndiaMART profile</a></li>
      </ul>
    </div>
  </div>
  <div class="wrap footer-base">&copy; 2026 ${site.name}, Panchkula</div>
</footer>
<a class="wa-float" href="${whatsappLink(message)}" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp" title="Chat on WhatsApp">
  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
</a>
<script src="${root}js/vendor/gsap.min.js"></script>
<script src="${root}js/vendor/ScrollTrigger.min.js"></script>
<script src="${root}js/site.js"></script>
<script src="${root}js/motion.js"></script>
${extraScripts}</body>
</html>
`;
}

const priceHtml = (p) => (p.price
  ? `${p.price} <span class="per">per ${p.unit}</span>`
  : 'Price on request');

function addButton(p, root, cls = 'btn') {
  return `<button type="button" class="${cls}" data-add="${p.slug}" data-name="${esc(p.name)}" data-image="assets/products/${p.slug}-1-t.jpg">Add to enquiry list</button>`;
}

function card(p, root) {
  return `<article class="card" data-category="${p.category}" data-search="${esc(searchText(p))}">
  <a class="card-link" href="${root}products/${p.slug}.html">
    <span class="card-photo"><img src="${root}assets/products/${p.slug}-1-t.jpg" alt="" loading="lazy"></span>
    <span class="card-name">${esc(p.name)}</span>
  </a>
  <p class="card-price">${priceHtml(p)}</p>
  ${addButton(p, root, 'btn btn-small')}
</article>`;
}

function homePage() {
  const tiles = categories.map((c) => `<a class="tile" href="products.html#${c.id}">
    <span class="tile-photo"><img src="assets/products/${c.image}-t.jpg" alt="" loading="lazy"></span>
    <span class="tile-name">${esc(c.name)}</span>
    <span class="tile-count">${plural(inCategory(c.id).length)}</span>
  </a>`).join('\n  ');

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'AN Biotech',
    founder: site.proprietor,
    foundingDate: '2016',
    telephone: site.mobile.tel,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address[0],
      addressLocality: 'Panchkula',
      addressRegion: 'Haryana',
      postalCode: '134119',
      addressCountry: 'IN'
    }
  };

  return layout({
    title: 'A N Biotech | Laboratory analyzers and hospital equipment, Panchkula',
    description: `A N Biotech, Panchkula: hematology, biochemistry, immunoassay and electrolyte analyzers, reagents, hospital beds and operation theatre equipment, with installation, warranty and AMC. ${products.length} products with listed prices.`,
    current: 'home',
    extraHead: `<script type="application/ld+json">${JSON.stringify(ld)}</script>\n`,
    extraScripts: '<script src="js/hero-model.js"></script>\n',
    body: `<section class="hero" data-hero>
  <div class="hero-model" aria-hidden="true"><canvas data-hero-model></canvas></div>
  <div class="wrap hero-intro">
    <h1 class="hero-title">
      <span class="line"><span class="line-out"><span class="line-in">Laboratory analyzers</span></span></span>
      <span class="line"><span class="line-out"><span class="line-in">and hospital equipment,</span></span></span>
      <span class="line"><span class="line-out"><span class="line-in">supplied from Panchkula</span></span></span>
    </h1>
    <div class="hero-copy">
      <p class="hero-text" data-intro>Analyzers, reagents, hospital beds and operation theatre equipment for laboratories and hospitals, with installation, warranty and AMC.</p>
      <p class="actions" data-intro>
        <a class="btn btn-primary" href="products.html">View all ${products.length} products</a>
        <a class="btn" href="${whatsappLink(generalMessage)}">Enquire on WhatsApp</a>
      </p>
    </div>
  </div>
  <div class="hero-reel">
    <div class="wrap hero-reel-grid">
      <p class="hero-label">We supply</p>
      <ul class="hero-wheel">
        ${categories.map((c) => `<li><a href="products.html#${c.id}"><span>${esc(c.name)}</span><span class="hero-count">${inCategory(c.id).length}</span></a></li>`).join('\n        ')}
      </ul>
    </div>
  </div>
  <div class="hero-scale" aria-hidden="true"><span></span></div>
</section>

<section class="section">
  <div class="wrap">
    <h2>Browse by category</h2>
    <div class="tiles">
  ${tiles}
  <a class="tile tile-all" href="products.html">
    <span class="tile-name">All products</span>
    <span class="tile-count">${products.length} products with listed prices</span>
  </a>
    </div>
  </div>
</section>

<section class="section section-alt" data-rail>
  <div class="wrap">
    <div class="section-head">
      <h2>Selected products</h2>
      <a href="products.html">All products</a>
    </div>
    <div class="cards">
      ${featured.map((s) => card(bySlug[s], '')).join('\n      ')}
    </div>
    <div class="rail-progress" aria-hidden="true"><span></span></div>
  </div>
</section>

<section class="section" id="services">
  <div class="wrap">
    <h2>Installation, warranty and AMC</h2>
    <div class="services">
      <div class="service">
        <h3>Installation</h3>
        <p>We install the equipment we supply at your laboratory or hospital.</p>
      </div>
      <div class="service">
        <h3>Warranty</h3>
        <p>Our equipment is supplied with warranty. Your quotation states the terms for each product.</p>
      </div>
      <div class="service">
        <h3>Annual maintenance contract</h3>
        <p>AMC is available for the equipment we supply. Ask us for the terms for your machine.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-brands" data-marquee>
  <div class="wrap">
    <h2>Brands in our catalogue</h2>
    <ul class="brands">
      ${brands.map((b) => `<li>${b}</li>`).join('\n      ')}
    </ul>
  </div>
</section>

<section class="section section-alt" id="about">
  <div class="wrap about-grid">
    <div>
      <h2>About A N Biotech</h2>
      <p class="about-lead" data-words>A N Biotech was established in Panchkula, Haryana, in 2016. We are a wholesale trader and distributor of medical analyzers and hospital equipment, run by our proprietor, ${site.proprietor}.</p>
      <p>We hold an IndiaMART TrustSEAL certificate (No. 54362, valid until June 2028), which verifies our GST registration, bank account and business address.</p>
      <p><a href="${site.trustseal}" rel="noopener">View the TrustSEAL certificate</a><br><a href="${site.indiamart}testimonial.html" rel="noopener">Read buyer reviews on IndiaMART</a></p>
    </div>
    <table class="facts">
      <caption>Company details</caption>
      <tbody>
        <tr><th scope="row">Established</th><td>2016</td></tr>
        <tr><th scope="row">Proprietor</th><td>${site.proprietor}</td></tr>
        <tr><th scope="row">Business</th><td>Wholesale trader, distributor and retailer</td></tr>
        <tr><th scope="row">Services</th><td>Installation, warranty and AMC</td></tr>
        <tr><th scope="row">Legal status</th><td>Proprietorship</td></tr>
        <tr><th scope="row">Import Export Code</th><td>${site.iec}</td></tr>
        <tr><th scope="row">Payment</th><td>Cash, credit card, cheque, DD, bank transfer</td></tr>
        <tr><th scope="row">Shipment</th><td>By road</td></tr>
      </tbody>
    </table>
  </div>
</section>

<section class="section" id="contact">
  <div class="wrap contact-grid">
    <div>
      <h2>Contact</h2>
      <address>
        ${site.name}<br>
        ${site.address.join('<br>\n        ')}
      </address>
      <p><a href="${site.maps}" rel="noopener">Open in Google Maps</a></p>
    </div>
    <div>
      <h3>Call or message</h3>
      <p>
        ${site.proprietor}: <a href="tel:${site.mobile.tel}">${site.mobile.label}</a><br>
        Office: <a href="tel:${site.phones[0].tel}">${site.phones[0].label}</a>, <a href="tel:${site.phones[1].tel}">${site.phones[1].label}</a>
      </p>
      <p class="actions">
        <a class="btn btn-primary" href="enquiry.html">Send an enquiry</a>
        <a class="btn" href="https://wa.me/${site.whatsapp}">WhatsApp</a>
      </p>
    </div>
  </div>
</section>`
  });
}

function productsPage() {
  const sections = categories.map((c) => {
    const items = inCategory(c.id);
    return `<section class="catalog-group" id="${c.id}" data-group="${c.id}">
    <h2>${esc(c.name)} <span class="group-count">${items.length}</span></h2>
    ${c.note ? `<p class="group-note">${esc(c.note)}</p>` : ''}
    <div class="cards">
      ${items.map((p) => card(p, '')).join('\n      ')}
    </div>
  </section>`;
  }).join('\n  ');

  return layout({
    title: 'Products | A N Biotech, Panchkula',
    description: `${products.length} laboratory analyzers, reagents, hospital beds and operation theatre products from A N Biotech, Panchkula, with listed prices.`,
    current: 'products',
    body: `<div class="wrap page-head" data-intro>
  <h1>Products</h1>
  <p>Listed prices are per piece or unit. We confirm the current rate, taxes and freight on your quotation.</p>
</div>
<div class="wrap catalog-controls" data-intro>
  <label class="search">
    <span class="visually-hidden">Search products</span>
    <input type="search" placeholder="Search by name or brand" data-catalog-search>
  </label>
  <div class="filters" role="group" aria-label="Filter by category">
    <a href="#all" class="filter is-active" data-filter="all">All</a>
    ${categories.map((c) => `<a href="#${c.id}" class="filter" data-filter="${c.id}">${esc(c.name)}</a>`).join('\n    ')}
  </div>
</div>
<div class="wrap catalog">
  ${sections}
  <p class="no-results" data-no-results hidden>No products match your search. <a href="enquiry.html">Tell us what you need</a> and we will check for you.</p>
</div>`
  });
}

function productPage(p) {
  const category = categories.find((c) => c.id === p.category);
  const root = '../';
  const related = inCategory(p.category).filter((o) => o.slug !== p.slug).slice(0, 4);
  const photos = Array.from({ length: p.images }, (_, i) => i + 1);
  const message = `Hello, I would like a quotation for: ${p.name}`;

  return layout({
    root,
    title: `${p.name} | A N Biotech, Panchkula`,
    description: `${p.name}${p.price ? `, ${p.price} per ${p.unit}` : ''}. ${p.summary}`,
    current: 'products',
    message,
    body: `<div class="wrap">
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="${root}products.html">Products</a> /
    <a href="${root}products.html#${category.id}">${esc(category.name)}</a>
  </nav>
  <div class="product">
    <div class="gallery" data-intro>
      <div class="gallery-main"><img src="${root}assets/products/${p.slug}-1.jpg" alt="${esc(p.name)}" data-gallery-main></div>
      ${p.images > 1 ? `<div class="gallery-thumbs">
        ${photos.map((n) => `<a href="${root}assets/products/${p.slug}-${n}.jpg" data-gallery-thumb${n === 1 ? ' aria-current="true"' : ''}><img src="${root}assets/products/${p.slug}-${n}-t.jpg" alt="${esc(p.name)}, photo ${n}" loading="lazy"></a>`).join('\n        ')}
      </div>` : ''}
      ${p.photoNote ? `<p class="photo-note">${esc(p.photoNote)}</p>` : ''}
    </div>
    <div class="product-info" data-intro>
      <h1>${esc(p.name)}</h1>
      <p class="product-price">${priceHtml(p)}</p>
      <p class="price-note">${p.price ? 'Listed price. We confirm the current rate, taxes and freight on your quotation.' : 'Contact us for the current price.'}</p>
      <p>${esc(p.summary)}</p>
      <p class="actions">
        <a class="btn btn-primary" href="${whatsappLink(message)}">Enquire on WhatsApp</a>
        ${addButton(p, root)}
      </p>
      <p class="call-line">Or call ${site.proprietor}: <a href="tel:${site.mobile.tel}">${site.mobile.label}</a></p>
      ${hasServices(p) ? '<p class="service-line">Installation, warranty and AMC available. Your quotation states the terms.</p>' : ''}
    </div>
  </div>
  ${p.specs.length || p.features.length ? `<div class="product-details">
    ${p.specs.length ? `<section>
      <h2>Specifications</h2>
      <table class="facts">
        <tbody>
          ${p.specs.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('\n          ')}
        </tbody>
      </table>
    </section>` : ''}
    ${p.features.length ? `<section>
      <h2>Features</h2>
      <ul class="features">
        ${p.features.map((f) => `<li>${esc(f)}</li>`).join('\n        ')}
      </ul>
    </section>` : ''}
  </div>` : ''}
  ${related.length ? `<section class="related">
    <h2>Related products</h2>
    <div class="cards">
      ${related.map((o) => card(o, root)).join('\n      ')}
    </div>
  </section>` : ''}
</div>`
  });
}

function enquiryPage() {
  return layout({
    title: 'Enquiry list | A N Biotech, Panchkula',
    description: 'Send A N Biotech your product list and requirements for a quotation.',
    current: 'enquiry',
    body: `<div class="wrap page-head" data-intro>
  <h1>Enquiry list</h1>
  <p>Add the products you need and send us the list on WhatsApp. ${site.proprietor} will reply with a quotation.</p>
</div>
<div class="wrap enquiry">
  <section data-intro>
    <h2>Products</h2>
    <p class="enquiry-empty" data-enquiry-empty>No products added yet. <a href="products.html">Browse products</a>, or describe what you need in the form.</p>
    <ul class="enquiry-list" data-enquiry-list></ul>
  </section>
  <section data-intro>
    <h2>Your details</h2>
    <form class="form" data-enquiry-form>
      <label>Name <input type="text" name="name" required autocomplete="name"></label>
      <label>Hospital or laboratory <input type="text" name="organisation" autocomplete="organization"></label>
      <label>City <input type="text" name="city" required autocomplete="address-level2"></label>
      <label>Phone <input type="tel" name="phone" required autocomplete="tel"></label>
      <label>Requirements or questions <textarea name="message" rows="4"></textarea></label>
      <button type="submit" class="btn btn-primary">Send on WhatsApp</button>
      <p class="form-note">This opens WhatsApp with your message ready to send. Nothing is sent until you press send there.</p>
    </form>
  </section>
</div>`
  });
}

const write = (file, html) => {
  fs.mkdirSync(path.dirname(path.join(__dirname, file)), { recursive: true });
  fs.writeFileSync(path.join(__dirname, file), html);
};

for (const p of products) {
  for (let n = 1; n <= p.images; n++) {
    for (const suffix of ['', '-t']) {
      const img = `assets/products/${p.slug}-${n}${suffix}.jpg`;
      if (!fs.existsSync(path.join(__dirname, img))) throw new Error(`Missing image: ${img}`);
    }
  }
}

for (const [name, price, slug] of listings) {
  if (!bySlug[slug]) throw new Error(`Listing "${name}" points to unknown product: ${slug}`);
  if (bySlug[slug].price !== price) throw new Error(`Listing "${name}" is ${price} but ${slug} shows ${bySlug[slug].price}`);
}

fs.rmSync(path.join(__dirname, 'products'), { recursive: true, force: true });
write('index.html', homePage());
write('products.html', productsPage());
write('enquiry.html', enquiryPage());
products.forEach((p) => write(`products/${p.slug}.html`, productPage(p)));
console.log(`Built ${products.length} product pages.`);
