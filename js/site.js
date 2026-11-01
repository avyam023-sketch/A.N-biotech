(function () {
  var STORAGE_KEY = 'anbiotech-enquiry';
  var root = document.body.getAttribute('data-root') || '';
  var whatsapp = document.body.getAttribute('data-whatsapp');

  function readList() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveList(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      // Private browsing can block storage; the list then lasts only for this page.
    }
    updateCount(list);
  }

  function updateCount(list) {
    var total = list.reduce(function (sum, item) { return sum + item.qty; }, 0);
    document.querySelectorAll('[data-enquiry-count]').forEach(function (el) {
      el.textContent = total;
      el.hidden = total === 0;
    });
  }

  function markAdded(button) {
    button.textContent = 'Added to enquiry list';
    button.classList.add('is-added');
  }

  function initAddButtons() {
    var list = readList();
    document.querySelectorAll('[data-add]').forEach(function (button) {
      var slug = button.getAttribute('data-add');
      if (list.some(function (item) { return item.slug === slug; })) markAdded(button);

      button.addEventListener('click', function () {
        var current = readList();
        if (current.some(function (item) { return item.slug === slug; })) {
          window.location.href = root + 'enquiry.html';
          return;
        }
        current.push({
          slug: slug,
          name: button.getAttribute('data-name'),
          image: button.getAttribute('data-image'),
          qty: 1
        });
        saveList(current);
        markAdded(button);
      });
    });
  }

  function initCatalog() {
    var search = document.querySelector('[data-catalog-search]');
    if (!search) return;

    var groups = document.querySelectorAll('[data-group]');
    var filters = document.querySelectorAll('[data-filter]');
    var noResults = document.querySelector('[data-no-results]');
    var category = 'all';

    function apply() {
      var query = search.value.trim().toLowerCase();
      var visibleTotal = 0;

      groups.forEach(function (group) {
        var visible = 0;
        var inCategory = category === 'all' || group.getAttribute('data-group') === category;
        group.querySelectorAll('.card').forEach(function (card) {
          var match = inCategory && card.getAttribute('data-search').indexOf(query) !== -1;
          card.hidden = !match;
          if (match) visible++;
        });
        group.hidden = visible === 0;
        visibleTotal += visible;
      });

      noResults.hidden = visibleTotal !== 0;
      filters.forEach(function (filter) {
        filter.classList.toggle('is-active', filter.getAttribute('data-filter') === category);
      });
      document.dispatchEvent(new CustomEvent('catalog:change'));
    }

    function setCategoryFromHash() {
      var id = window.location.hash.slice(1);
      var known = Array.prototype.some.call(groups, function (g) { return g.getAttribute('data-group') === id; });
      category = known ? id : 'all';
      apply();
    }

    filters.forEach(function (filter) {
      filter.addEventListener('click', function (event) {
        event.preventDefault();
        var id = filter.getAttribute('data-filter');
        history.replaceState(null, '', id === 'all' ? window.location.pathname : '#' + id);
        category = id;
        apply();
      });
    });

    search.addEventListener('input', apply);
    window.addEventListener('hashchange', setCategoryFromHash);
    setCategoryFromHash();
  }

  function initGallery() {
    var main = document.querySelector('[data-gallery-main]');
    if (!main) return;
    var thumbs = document.querySelectorAll('[data-gallery-thumb]');

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function (event) {
        event.preventDefault();
        main.src = thumb.getAttribute('href');
        thumbs.forEach(function (t) { t.removeAttribute('aria-current'); });
        thumb.setAttribute('aria-current', 'true');
      });
    });
  }

  function initEnquiryPage() {
    var form = document.querySelector('[data-enquiry-form]');
    if (!form) return;

    var listEl = document.querySelector('[data-enquiry-list]');
    var emptyEl = document.querySelector('[data-enquiry-empty]');

    function render() {
      var list = readList();
      emptyEl.hidden = list.length > 0;
      listEl.innerHTML = '';

      list.forEach(function (item) {
        var li = document.createElement('li');
        li.className = 'enquiry-item';

        var img = document.createElement('img');
        img.src = root + item.image;
        img.alt = '';

        var name = document.createElement('a');
        name.className = 'enquiry-name';
        name.href = root + 'products/' + item.slug + '.html';
        name.textContent = item.name;

        var controls = document.createElement('div');
        controls.className = 'enquiry-controls';

        var label = document.createElement('label');
        label.textContent = 'Qty ';
        var qty = document.createElement('input');
        qty.type = 'number';
        qty.min = '1';
        qty.value = item.qty;
        qty.addEventListener('change', function () {
          var value = Math.max(1, parseInt(qty.value, 10) || 1);
          qty.value = value;
          var current = readList();
          current.forEach(function (i) { if (i.slug === item.slug) i.qty = value; });
          saveList(current);
        });
        label.appendChild(qty);

        var remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'link-button';
        remove.textContent = 'Remove';
        remove.addEventListener('click', function () {
          saveList(readList().filter(function (i) { return i.slug !== item.slug; }));
          render();
        });

        controls.appendChild(label);
        controls.appendChild(remove);
        li.appendChild(img);
        li.appendChild(name);
        li.appendChild(controls);
        listEl.appendChild(li);
      });
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var lines = ['Hello, I would like a quotation.', ''];

      var list = readList();
      if (list.length) {
        lines.push('Products:');
        list.forEach(function (item, index) {
          lines.push((index + 1) + '. ' + item.name + ' (Qty: ' + item.qty + ')');
        });
        lines.push('');
      }

      var message = data.get('message').trim();
      if (message) lines.push(message, '');

      lines.push('Name: ' + data.get('name').trim());
      var organisation = data.get('organisation').trim();
      if (organisation) lines.push('Hospital / laboratory: ' + organisation);
      lines.push('City: ' + data.get('city').trim());
      lines.push('Phone: ' + data.get('phone').trim());

      window.open('https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    });

    render();
  }

  function initHeader() {
    var header = document.querySelector('[data-header]');
    var hero = document.querySelector('[data-hero]');
    var links = document.querySelector('[data-nav-links]');
    var indicator = links.querySelector('.nav-indicator');
    var toggle = document.querySelector('[data-nav-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');

    // The underline slides between links and rests on the current page's link.
    function moveIndicator(link) {
      if (!link) {
        indicator.style.opacity = 0;
        return;
      }
      indicator.style.opacity = 1;
      indicator.style.width = link.offsetWidth + 'px';
      indicator.style.transform = 'translateX(' + link.offsetLeft + 'px)';
    }
    function restIndicator() {
      moveIndicator(links.querySelector('[aria-current]'));
    }
    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('mouseenter', function () { moveIndicator(link); });
      link.addEventListener('focus', function () { moveIndicator(link); });
    });
    links.addEventListener('mouseleave', restIndicator);
    links.addEventListener('focusout', restIndicator);
    window.addEventListener('resize', restIndicator);
    restIndicator();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(restIndicator);

    // On the home page the header stays see-through until the hero, pinned or not, has passed under it.
    if (hero) {
      var updateHeader = function () {
        var box = hero.parentElement.classList.contains('pin-spacer') ? hero.parentElement : hero;
        header.classList.toggle('is-solid', box.getBoundingClientRect().bottom <= header.offsetHeight);
        // Once the page has moved, hero text can pass underneath, so the header gets a dark backing.
        header.classList.toggle('is-scrolled', window.pageYOffset > 10);
      };
      window.addEventListener('scroll', updateHeader, { passive: true });
      window.addEventListener('resize', updateHeader);
      window.addEventListener('load', updateHeader);
      updateHeader();
    }

    function setMenu(open) {
      document.documentElement.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 821px)').addEventListener('change', function (event) {
      if (event.matches) setMenu(false);
    });
  }

  updateCount(readList());
  initHeader();
  initAddButtons();
  initCatalog();
  initGallery();
  initEnquiryPage();
})();
