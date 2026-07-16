/* =========================================================
   KALUZA — main.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('hidden'), 350);
  });
  // Fallback in case 'load' already fired or is slow to trigger
  setTimeout(() => loader && loader.classList.add('hidden'), 2500);

  /* ---------- AOS ---------- */
  if (window.AOS) {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 60 });
  }

  /* ---------- Navbar scroll state ---------- */
  const nav = document.querySelector('.navbar-kaluza');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll);

  /* ---------- Mobile menu toggle animation ---------- */
  const toggler = document.querySelector('.navbar-toggler');
  const navCollapse = document.getElementById('navbarKaluza');
  if (toggler && navCollapse) {
    navCollapse.addEventListener('show.bs.collapse', () => toggler.setAttribute('aria-expanded', 'true'));
    navCollapse.addEventListener('hide.bs.collapse', () => toggler.setAttribute('aria-expanded', 'false'));
    navCollapse.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (navCollapse.classList.contains('show')) {
          bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
        }
      });
    });
  }

  /* ---------- Active nav link ---------- */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-kaluza .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path) link.classList.add('active');
  });

  /* ---------- Back to top ---------- */
  const backBtn = document.querySelector('.back-to-top');
  if (backBtn) {
    window.addEventListener('scroll', () => {
      backBtn.classList.toggle('show', window.scrollY > 500);
    });
    backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Hero particles ---------- */
  const particleWrap = document.querySelector('.hero-particles');
  if (particleWrap) {
    const count = window.innerWidth < 768 ? 18 : 34;
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      const size = Math.random() * 3 + 1.5;
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.left = Math.random() * 100 + '%';
      s.style.bottom = -20 + 'px';
      s.style.animationDuration = (Math.random() * 10 + 10) + 's';
      s.style.animationDelay = (Math.random() * 10) + 's';
      if (Math.random() > 0.6) s.style.background = 'var(--cyan)';
      particleWrap.appendChild(s);
    }
  }

  /* ---------- GSAP hero entrance ---------- */
  if (window.gsap) {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero-eyebrow', { y: 18, opacity: 0, duration: .6 })
      .from('.hero h1', { y: 26, opacity: 0, duration: .8 }, '-=.35')
      .from('.hero .lead', { y: 20, opacity: 0, duration: .7 }, '-=.5')
      .from('.hero-actions .btn-kaluza-gold, .hero-actions .btn-kaluza-outline', { y: 16, opacity: 0, duration: .6, stagger: .12 }, '-=.45')
      .from('.hero-visual', { x: 30, opacity: 0, duration: .9 }, '-=.7');

    // Subtle parallax on hero visual with scroll
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
      window.addEventListener('scroll', () => {
        const y = Math.min(window.scrollY, 600);
        heroVisual.style.transform = `translateY(${y * 0.12}px)`;
      }, { passive: true });
    }
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.counter-num[data-count]');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => io.observe(c));
  }

  /* ---------- Swiper (testimonios / logos si existen) ---------- */
  if (window.Swiper && document.querySelector('.swiper-kaluza')) {
    new Swiper('.swiper-kaluza', {
      slidesPerView: 1.15,
      spaceBetween: 20,
      loop: true,
      autoplay: { delay: 3500, disableOnInteraction: false },
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 24 },
        992: { slidesPerView: 3, spaceBetween: 28 }
      }
    });
  }

  /* ---------- Generic form validation + fake submit ---------- */
  const setupForm = (formId, statusId) => {
    const form = document.getElementById(formId);
    const status = document.getElementById(statusId);
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      form.querySelectorAll('[required]').forEach(field => {
        field.classList.remove('is-invalid', 'is-valid');
        let ok = field.checkValidity();

        if (field.type === 'email' && field.value.trim()) {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        }
        if (field.type === 'tel' && field.value.trim()) {
          ok = /^[0-9+\s()-]{6,}$/.test(field.value.trim());
        }

        if (!ok) { field.classList.add('is-invalid'); valid = false; }
        else { field.classList.add('is-valid'); }
      });

      if (status) {
        status.classList.remove('success', 'error', 'show');
      }

      if (!valid) {
        if (status) {
          status.textContent = 'Por favor revisa los campos marcados antes de continuar.';
          status.classList.add('show', 'error');
        }
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Enviando...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        if (status) {
          status.textContent = '¡Gracias! Tu solicitud fue enviada correctamente. Nuestro equipo te contactará muy pronto.';
          status.classList.add('show', 'success');
        }
        form.reset();
        form.querySelectorAll('.is-valid').forEach(f => f.classList.remove('is-valid'));
      }, 1100);
    });
  };

  setupForm('formContactoRapido', 'statusContactoRapido');
  setupForm('formContacto', 'statusContacto');
  setupForm('formNewsletter', 'statusNewsletter');

  /* ---------- Newsletter (footer) simple validation ---------- */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const ok = input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      input.classList.toggle('is-invalid', !ok);
      if (ok) {
        input.value = '';
        input.placeholder = '¡Gracias por suscribirte!';
        input.classList.remove('is-invalid');
      }
    });
  });

  /* ---------- Product search + filter + pagination (Productos page) ---------- */
  const grid = document.getElementById('productGrid');
  if (grid) {
    const cards = Array.from(grid.querySelectorAll('.product-item'));
    const searchInput = document.getElementById('productSearch');
    const chips = document.querySelectorAll('.filter-chip');
    const marcaSelect = document.getElementById('filterMarca');
    const aplicacionSelect = document.getElementById('filterAplicacion');
    const emptyState = document.getElementById('emptyState');
    const pagination = document.getElementById('productPagination');
    const perPage = 6;
    let activeCategory = 'all';
    let searchTerm = '';
    let currentPage = 1;

    const applyFilters = () => {
      const marcaVal = marcaSelect ? marcaSelect.value : 'all';
      const aplicacionVal = aplicacionSelect ? aplicacionSelect.value : 'all';

      const filtered = cards.filter(card => {
        const cat = card.dataset.category;
        const marca = card.dataset.marca;
        const aplicacion = card.dataset.aplicacion;
        const name = card.dataset.name.toLowerCase();
        const matchCat = activeCategory === 'all' || cat === activeCategory;
        const matchMarca = !marcaVal || marcaVal === 'all' || marca === marcaVal;
        const matchAplicacion = !aplicacionVal || aplicacionVal === 'all' || aplicacion === aplicacionVal;
        const matchSearch = name.includes(searchTerm.toLowerCase());
        return matchCat && matchMarca && matchAplicacion && matchSearch;
      });

      cards.forEach(c => c.style.display = 'none');

      const totalPages = Math.max(Math.ceil(filtered.length / perPage), 1);
      if (currentPage > totalPages) currentPage = totalPages;

      const startIdx = (currentPage - 1) * perPage;
      const pageItems = filtered.slice(startIdx, startIdx + perPage);
      pageItems.forEach(c => c.style.display = '');

      emptyState.style.display = filtered.length === 0 ? 'block' : 'none';

      // Build pagination
      pagination.innerHTML = '';
      if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
          const li = document.createElement('li');
          li.className = 'page-item' + (i === currentPage ? ' active' : '');
          li.innerHTML = `<a class="page-link" href="#productGrid">${i}</a>`;
          li.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            applyFilters();
          });
          pagination.appendChild(li);
        }
      }
    };

    searchInput && searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      currentPage = 1;
      applyFilters();
    });

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeCategory = chip.dataset.filter;
        currentPage = 1;
        applyFilters();
      });
    });

    [marcaSelect, aplicacionSelect].forEach(sel => {
      sel && sel.addEventListener('change', () => { currentPage = 1; applyFilters(); });
    });

    applyFilters();
  }

});
