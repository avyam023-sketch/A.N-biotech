(function () {
  var html = document.documentElement;

  if (!window.gsap || !window.ScrollTrigger) {
    html.classList.remove('motion', 'wipe-in');
    return;
  }
  html.classList.add('motion-ready');

  // Visitors who ask for reduced motion get the plain page.
  if (!html.classList.contains('motion')) return;

  gsap.registerPlugin(ScrollTrigger);

  var wipe = document.querySelector('[data-wipe]');
  var isArriving = html.classList.contains('wipe-in');

  function one(selector) { return document.querySelector(selector); }
  function all(selector) { return gsap.utils.toArray(selector); }
  function isShown(el) { return !el.closest('[hidden]'); }

  // Page transitions

  function samePage(link) {
    var strip = function (path) { return path.replace(/index\.html$/, ''); };
    return strip(link.pathname) === strip(window.location.pathname) && link.search === window.location.search;
  }

  function scrollToSection(id, smooth) {
    var target = document.getElementById(id);
    if (!target) return;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.pageYOffset - 72,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a[href]');
    if (!link || event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (link.target || link.hasAttribute('download') || link.origin !== window.location.origin) return;

    if (samePage(link) && link.hash) {
      // The catalogue filters itself from the hash; only the home page scrolls to sections.
      if (!one('[data-hero]')) return;
      event.preventDefault();
      history.pushState(null, '', link.hash);
      scrollToSection(link.hash.slice(1), true);
      return;
    }

    event.preventDefault();

    function leave() {
      try { sessionStorage.setItem('an-wipe', '1'); } catch (e) {}
      window.location.href = link.href;
    }

    // Animation pauses in a background tab and crawls on a struggling device; the link must still open.
    var fallback = setTimeout(leave, 800);

    gsap.set(wipe, { transformOrigin: '50% 100%' });
    gsap.fromTo(wipe, { scaleY: 0 }, {
      scaleY: 1,
      duration: 0.42,
      ease: 'power3.inOut',
      onComplete: function () {
        clearTimeout(fallback);
        leave();
      }
    });
  });

  if (isArriving) {
    gsap.set(wipe, { transformOrigin: '50% 0%', scaleY: 1 });
    gsap.to(wipe, {
      scaleY: 0,
      duration: 0.6,
      ease: 'power3.inOut',
      onComplete: function () { html.classList.remove('wipe-in'); }
    });
  }

  // Coming back through the browser's cache restores the page as it was left: covered.
  window.addEventListener('pageshow', function (event) {
    if (!event.persisted) return;
    gsap.killTweensOf(wipe);
    gsap.set(wipe, { scaleY: 0 });
    html.classList.remove('wipe-in');
  });

  // Header slides away on the way down and returns on the way up

  var header = one('.site-header');
  var headerHidden = false;

  function setHeader(hidden) {
    if (hidden === headerHidden) return;
    headerHidden = hidden;
    gsap.to(header, { yPercent: hidden ? -100 : 0, duration: 0.35, ease: 'power2.out', overwrite: true });
  }

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: function (self) { setHeader(self.direction === 1 && self.scroll() > 240); }
  });
  header.addEventListener('focusin', function () { setHeader(false); });

  // Shared reveals

  function intro() {
    var delay = isArriving ? 0.25 : 0.05;
    var lines = all('.hero-title .line-in');

    if (one('[data-hero]') && window.pageYOffset < 50) {
      gsap.fromTo('.header-row > *', { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: delay + 0.3, clearProps: 'all' });
    }

    if (lines.length && window.pageYOffset < 50) {
      gsap.fromTo(lines, { yPercent: 115, autoAlpha: 1 }, { yPercent: 0, duration: 1.15, stagger: 0.1, ease: 'power4.out', delay: delay });
      delay += 0.55;
    } else if (lines.length) {
      gsap.set(lines, { autoAlpha: 1 });
    }

    gsap.fromTo(all('[data-intro]'), { autoAlpha: 0, y: 26 }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.85,
      stagger: 0.1,
      ease: 'power3.out',
      delay: delay,
      clearProps: 'transform'
    });
  }

  function batchReveal(elements, vars) {
    if (!elements.length) return [];
    gsap.set(elements, { opacity: 0, y: 34 });
    return ScrollTrigger.batch(elements, {
      start: 'top 90%',
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, Object.assign({}, vars));
      }
    });
  }

  var rise = { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', clearProps: 'transform' };

  function headings(selector) {
    all(selector).forEach(function (heading) {
      gsap.fromTo(heading, { clipPath: 'inset(0 0 100% 0)', y: 22 }, {
        clipPath: 'inset(0 0 -15% 0)',
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'clipPath,transform',
        scrollTrigger: { trigger: heading, start: 'top 92%', once: true }
      });
    });
  }

  // Home: hero

  function reportHeroProgress(self) {
    document.dispatchEvent(new CustomEvent('hero:progress', { detail: self.progress }));
  }

  function heroPinned() {
    var hero = one('[data-hero]');
    if (!hero) return;
    hero.classList.add('is-pinned');

    var wheel = hero.querySelector('.hero-wheel');
    var rows = gsap.utils.toArray(wheel.children);
    var dim = 0.16;

    function centre(i) {
      return hero.clientHeight / 2 - (rows[i].offsetTop + rows[i].offsetHeight / 2);
    }

    gsap.set(rows, { opacity: dim });

    var timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero,
        pin: true,
        start: 'top top',
        end: function () { return '+=' + window.innerHeight * 2.6; },
        scrub: 0.5,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: reportHeroProgress
      }
    });

    timeline
      .to('.hero-title .line-out', { yPercent: -115, duration: 0.8, stagger: 0.08, ease: 'power2.in' }, 0)
      .to('.hero-copy', { autoAlpha: 0, y: -40, duration: 0.6 }, 0)
      .fromTo('.hero-label', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 1.1)
      .fromTo(wheel, { y: function () { return hero.clientHeight; } }, { y: function () { return centre(0); }, duration: 1.1, ease: 'power2.out' }, 0.8)
      .to(rows[0], { opacity: 1, duration: 0.6 }, 1.1)
      .addLabel('row0', 1.9);

    rows.slice(1).forEach(function (row, index) {
      var at = 2.1 + index;
      timeline
        .to(wheel, { y: function () { return centre(index + 1); }, duration: 1, ease: 'power1.inOut' }, at)
        .to(rows[index], { opacity: dim, duration: 0.5 }, at)
        .to(row, { opacity: 1, duration: 0.5 }, at + 0.25)
        .addLabel('row' + (index + 1), at + 1);
    });

    timeline.to({}, { duration: 0.5 });
    timeline.fromTo('.hero-scale span', { y: 0 }, {
      y: function () { return hero.clientHeight - 2; },
      duration: timeline.duration()
    }, 0);

    // Keyboard focus on a row brings that row to the centre of the reel.
    function onFocus(event) {
      var index = rows.indexOf(event.target.closest('li'));
      if (index === -1) return;
      // Waits a tick, because the browser's own scroll to the focused link runs after this event.
      setTimeout(function () { window.scrollTo(0, timeline.scrollTrigger.labelToScroll('row' + index)); });
    }
    wheel.addEventListener('focusin', onFocus);

    return function () {
      wheel.removeEventListener('focusin', onFocus);
      hero.classList.remove('is-pinned');
    };
  }

  function heroStacked() {
    var hero = one('[data-hero]');
    if (!hero) return;

    gsap.to('.hero-title', {
      yPercent: -14,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, onUpdate: reportHeroProgress }
    });

    all('.hero-wheel li').forEach(function (row) {
      gsap.fromTo(row, { opacity: 0.22 }, {
        opacity: 1,
        ease: 'none',
        scrollTrigger: { trigger: row, start: 'top 92%', end: 'top 62%', scrub: true }
      });
    });
  }

  // Home: selected products travel sideways while the section is pinned

  function productRail() {
    var section = one('[data-rail]');
    if (!section) return;
    section.classList.add('is-rail');

    var track = section.querySelector('.cards');
    var frame = track.parentElement;

    function distance() {
      var left = frame.getBoundingClientRect().left + parseFloat(getComputedStyle(frame).paddingLeft);
      return Math.max(0, track.scrollWidth + left * 2 - window.innerWidth);
    }

    var timeline = gsap.timeline({
      defaults: { ease: 'none', duration: 1 },
      scrollTrigger: {
        trigger: section,
        pin: true,
        start: 'top top',
        end: function () { return '+=' + distance(); },
        scrub: 0.5,
        invalidateOnRefresh: true,
        anticipatePin: 1
      }
    });

    timeline
      .to(track, { x: function () { return -distance(); } }, 0)
      .fromTo(section.querySelector('.rail-progress span'), { scaleX: 0 }, { scaleX: 1 }, 0);

    gsap.fromTo(track.children, { opacity: 0, x: 70 }, {
      opacity: 1,
      x: 0,
      duration: 0.9,
      stagger: 0.07,
      ease: 'power3.out',
      clearProps: 'transform',
      scrollTrigger: { trigger: section, start: 'top 70%', once: true }
    });

    // Tabbing to a card out of view moves the page to where that card is on screen.
    function onFocus(event) {
      var card = event.target.closest('.card');
      if (!card) return;
      var st = timeline.scrollTrigger;
      var ratio = gsap.utils.clamp(0, 1, (card.offsetLeft - 40) / (distance() || 1));
      setTimeout(function () { window.scrollTo(0, st.start + ratio * (st.end - st.start)); });
    }
    track.addEventListener('focusin', onFocus);

    return function () {
      track.removeEventListener('focusin', onFocus);
      section.classList.remove('is-rail');
    };
  }

  function brandMarquee() {
    var section = one('[data-marquee]');
    if (!section) return;
    section.classList.add('is-marquee');

    var list = section.querySelector('.brands');
    gsap.to(list, {
      x: function () { return -Math.max(0, list.scrollWidth - window.innerWidth + 60); },
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 95%',
        end: 'bottom 5%',
        scrub: 0.5,
        invalidateOnRefresh: true
      }
    });

    return function () { section.classList.remove('is-marquee'); };
  }

  // Home: the About text darkens word by word as it scrolls through

  function wordScrub() {
    all('[data-words]').forEach(function (paragraph) {
      if (!paragraph.querySelector('.word')) {
        var words = paragraph.textContent.trim().split(/\s+/);
        paragraph.textContent = '';
        words.forEach(function (word, index) {
          var span = document.createElement('span');
          span.className = 'word';
          span.textContent = word;
          paragraph.appendChild(span);
          if (index < words.length - 1) paragraph.appendChild(document.createTextNode(' '));
        });
      }
      gsap.fromTo(paragraph.querySelectorAll('.word'), { opacity: 0.16 }, {
        opacity: 1,
        stagger: 0.05,
        ease: 'none',
        scrollTrigger: { trigger: paragraph, start: 'top 82%', end: 'bottom 48%', scrub: true }
      });
    });
  }

  function tiles() {
    var items = all('.tile');
    if (!items.length) return;
    gsap.set(items, { opacity: 0, y: 40 });
    gsap.set('.tile-photo', { clipPath: 'inset(0 0 100% 0)' });
    ScrollTrigger.batch(items, {
      start: 'top 88%',
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', clearProps: 'transform' });
        batch.forEach(function (tile, index) {
          var photo = tile.querySelector('.tile-photo');
          if (photo) gsap.to(photo, { clipPath: 'inset(0 0 0% 0)', duration: 1, delay: index * 0.08 + 0.1, ease: 'power3.inOut', clearProps: 'clipPath' });
        });
      }
    });
  }

  // Catalogue: scroll reveals until the visitor filters, then only newly shown cards fade in

  function catalogue() {
    if (!one('[data-catalog-search]')) return;

    var cards = all('.catalog .card');
    var triggers = batchReveal(cards.filter(isShown), rise);
    var shown = cards.filter(isShown);
    var firstChange = true;

    function onChange() {
      if (firstChange) {
        firstChange = false;
        triggers.forEach(function (trigger) { trigger.kill(); });
        gsap.killTweensOf(cards);
        gsap.set(cards, { clearProps: 'opacity,transform' });
      }
      var now = cards.filter(isShown);
      var added = now.filter(function (card) { return shown.indexOf(card) === -1; });
      shown = now;
      if (added.length) {
        gsap.fromTo(added.slice(0, 12), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.03, ease: 'power2.out', overwrite: true, clearProps: 'opacity,transform' });
      }
      ScrollTrigger.refresh();
    }

    document.addEventListener('catalog:change', onChange);
    return function () { document.removeEventListener('catalog:change', onChange); };
  }

  function homeAndProductReveals() {
    headings('.section h2, .related h2, .product-details h2');
    batchReveal(all('.related .card').concat(all('.service'), all('.facts'), all('.features li'), all('.contact-grid > div'), all('.about-grid p:not([data-words])')), {
      opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: 'power3.out', clearProps: 'transform'
    });
  }

  // Everything tied to layout is rebuilt when the window crosses the desktop breakpoint.
  var layouts = gsap.matchMedia();
  layouts.add({
    wide: '(min-width: 821px) and (min-height: 600px)',
    narrow: '(max-width: 820px), (max-height: 599px)'
  }, function (context) {
    var cleanups = [];
    function run(fn) { var cleanup = fn(); if (cleanup) cleanups.push(cleanup); }

    run(context.conditions.wide ? heroPinned : heroStacked);
    if (context.conditions.wide) {
      run(productRail);
    } else {
      batchReveal(all('[data-rail] .card'), rise);
    }
    run(brandMarquee);
    run(wordScrub);
    run(tiles);
    run(catalogue);
    run(homeAndProductReveals);

    return function () { cleanups.forEach(function (cleanup) { cleanup(); }); };
  });

  intro();

  // Small feedback touches

  gsap.fromTo('.wa-float', { scale: 0 }, { scale: 1, duration: 0.5, delay: 1, ease: 'back.out(2)', clearProps: 'transform' });

  document.addEventListener('click', function (event) {
    if (!event.target.closest || !event.target.closest('[data-add]')) return;
    gsap.fromTo('[data-enquiry-count]', { scale: 1.7 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' });
  });

  var galleryMain = one('[data-gallery-main]');
  if (galleryMain) {
    var swapping = false;
    all('[data-gallery-thumb]').forEach(function (thumb) {
      thumb.addEventListener('click', function () { swapping = true; });
    });
    galleryMain.addEventListener('load', function () {
      if (!swapping) return;
      swapping = false;
      gsap.fromTo(galleryMain, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' });
    });
  }

  // Layout shifts once fonts arrive, and a hash jump must land after the pinned sections add their height.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
  window.addEventListener('load', function () {
    ScrollTrigger.refresh();
    if (one('[data-hero]') && window.location.hash) {
      scrollToSection(window.location.hash.slice(1), false);
    }
  });
})();
