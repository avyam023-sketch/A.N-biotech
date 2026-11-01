# A N Biotech website

Static website for A N Biotech, Panchkula. The HTML files are generated, so edit the sources below rather than the HTML.

| To change | Edit |
| --- | --- |
| Products, prices, specifications | `data/products.js` |
| Company details, page text and layout | `build.js` |
| Styles | `css/site.css` |
| Scroll animations and page transitions | `js/motion.js` (GSAP and ScrollTrigger are in `js/vendor/`) |
| The 3D blood cells in the home page hero | `js/hero-model.js` |
| Photos | `assets/products/` (`<slug>-<n>.jpg` and a `<slug>-<n>-t.jpg` thumbnail) |

After editing, regenerate the pages:

```bash
npm run build
```

To preview at http://localhost:3000:

```bash
npm start
```

To publish, upload `index.html`, `products.html`, `enquiry.html` and the `products`, `assets`, `css` and `js` folders to any static host.
