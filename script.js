(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Target WhatsApp number for wishing box
  var WHATSAPP_NUMBER = '919562327585';

  // Target event date: Thursday, November 05, 2026 at 6:30 PM (Qatar Time AST UTC+3)
  var TARGET_DATE = new Date('2026-11-05T18:30:00+03:00').getTime();

  // ============================================================
  // 1. GATE / CURTAIN OPENING INTERACTION
  // ============================================================
  var html = document.documentElement;
  html.classList.add('locked');
  var gate = document.getElementById('gate');
  var enterBtn = document.getElementById('enterBtn');

  function openGate() {
    if (!gate || gate.classList.contains('opening')) return;
    gate.classList.add('opening');
    startAmbience();
    petalBurst();
    setTimeout(function () {
      gate.classList.add('hidden');
      html.classList.remove('locked');
      window.scrollTo(0, 0);
    }, 1400);
  }

  if (enterBtn) {
    enterBtn.addEventListener('click', openGate);
  }

  // ============================================================
  // 2. SCROLL REVEAL (INTERSECTION OBSERVER)
  // ============================================================
  var revealEls = document.querySelectorAll('.reveal');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach(function (el) { io.observe(el); });

  // ============================================================
  // 3. BACKGROUND MUSIC & EQUALIZER BARS
  // ============================================================
  var musicBtn = document.getElementById('music-toggle');
  var song = document.getElementById('wedding-song');
  var playing = false;

  function playSong() {
    if (!song || playing) return;
    song.volume = 0.55;
    song.play().then(function () {
      playing = true;
      if (musicBtn) musicBtn.classList.remove('muted');
    }).catch(function (err) {
      console.warn('Playback blocked', err);
    });
  }

  function pauseSong() {
    if (!song || !playing) return;
    song.pause();
    playing = false;
    if (musicBtn) musicBtn.classList.add('muted');
  }

  function startAmbience() {
    playSong();
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', function () {
      if (playing) { pauseSong(); } else { playSong(); }
    });
  }

  // ============================================================
  // 4. TAP TO REVEAL COMMUNION PHOTO CARD
  // ============================================================
  var couplePhoto = document.getElementById('couplePhotoCard');
  if (couplePhoto) {
    couplePhoto.addEventListener('click', function () {
      couplePhoto.classList.add('revealed');
    });
  }

  // ============================================================
  // 5. PARALLAX SCROLLING
  // ============================================================
  if (!reducedMotion) {
    var parallaxLayers = document.querySelectorAll('.parallax-layer');
    var pTicking = false;
    function updateParallax() {
      parallaxLayers.forEach(function (el) {
        var section = el.closest('section');
        if (!section) return;
        var rect = section.getBoundingClientRect();
        var factor = parseFloat(el.getAttribute('data-parallax')) || 0.15;
        var offset = rect.top * factor;
        el.style.transform = 'translateY(' + (-offset) + 'px)';
      });
      pTicking = false;
    }
    window.addEventListener('scroll', function () {
      if (!pTicking) { requestAnimationFrame(updateParallax); pTicking = true; }
    }, { passive: true });
    updateParallax();
  }

  // ============================================================
  // 6. PETAL BURST ANIMATION (ON ENTERING GATE)
  // ============================================================
  function petalBurst() {
    if (reducedMotion) return;
    var container = document.createElement('div');
    container.className = 'petal-burst';
    document.body.appendChild(container);
    // Olive green, sage, and ivory petals
    var colors = ['#ffffff', '#EDF3E8', '#D4E3C7', '#B7CBA8', '#8EA873'];
    var count = 18;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('div');
      p.className = 'petal';
      var size = 10 + Math.random() * 10;
      var drift = (Math.random() * 80 - 40);
      p.style.left = (Math.random() * 100) + 'vw';
      p.style.width = size + 'px';
      p.style.height = (size * 0.78) + 'px';
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = (Math.random() * 0.7) + 's';
      p.style.animationDuration = (3.6 + Math.random() * 2.2) + 's';
      p.style.setProperty('--drift', drift + 'px');
      container.appendChild(p);
    }
    setTimeout(function () { container.remove(); }, 6500);
  }

  // ============================================================
  // 7. 3D CARD TILT ON MOUSEMOVE (DESKTOP)
  // ============================================================
  if (!reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.event-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 4.5;
        var rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 4.5;
        card.style.transform = 'perspective(900px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
      });
    });
  }

  // ============================================================
  // 8. 3D COUNTDOWN TIMER WITH FLIP ANIMATION
  // ============================================================
  (function initCountdown() {
    var elDays  = document.getElementById('cd-days');
    var elHours = document.getElementById('cd-hours');
    var elMins  = document.getElementById('cd-mins');
    var elSecs  = document.getElementById('cd-secs');
    var elGrid  = document.getElementById('countdown-grid');
    var elDone  = document.getElementById('countdown-done');

    function pad(n) { return n < 10 ? '0' + n : '' + n; }

    function flipTo(el, newVal) {
      if (!el) return;
      var oldVal = el.textContent;
      if (oldVal === newVal) return;
      el.classList.add('flip-out');
      setTimeout(function () {
        el.classList.remove('flip-out');
        el.classList.add('flip-in');
        el.textContent = newVal;
        void el.offsetWidth;
        el.classList.add('active');
        setTimeout(function () {
          el.classList.remove('flip-in', 'active');
        }, 260);
      }, 180);
    }

    function tick() {
      var now = Date.now();
      var diff = TARGET_DATE - now;
      if (diff <= 0) {
        if (elGrid) elGrid.style.display = 'none';
        if (elDone) elDone.style.display = 'block';
        return;
      }
      var days  = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var mins  = Math.floor((diff % 3600000) / 60000);
      var secs  = Math.floor((diff % 60000) / 1000);

      flipTo(elDays,  pad(days));
      flipTo(elHours, pad(hours));
      flipTo(elMins,  pad(mins));
      flipTo(elSecs,  pad(secs));
    }
    tick();
    setInterval(tick, 1000);
  })();

  // ============================================================
  // 9. MASONRY GALLERY & LIGHTBOX (JOBIN-MARIYA SIGNATURE)
  // ============================================================
  var COMMUNION_PHOTOS = [
  {
    "id": 1,
    "src": "photos/_zac7461.jpg",
    "w": 1200,
    "h": 1803,
    "orient": "portrait",
    "caption": "Alayna Ann Sony \u2014 Holy Communion (1)"
  },
  {
    "id": 2,
    "src": "photos/_zac7463.jpg",
    "w": 1200,
    "h": 1803,
    "orient": "portrait",
    "caption": "Alayna Ann Sony \u2014 Holy Communion (2)"
  },
  {
    "id": 3,
    "src": "photos/_zac7464.jpg",
    "w": 1200,
    "h": 1803,
    "orient": "portrait",
    "caption": "Alayna Ann Sony \u2014 Holy Communion (3)"
  },
  {
    "id": 4,
    "src": "photos/_zac7465.jpg",
    "w": 1200,
    "h": 1803,
    "orient": "portrait",
    "caption": "Alayna Ann Sony \u2014 Holy Communion (4)"
  },
  {
    "id": 5,
    "src": "photos/_zac7467.jpg",
    "w": 1200,
    "h": 1803,
    "orient": "portrait",
    "caption": "Alayna Ann Sony \u2014 Holy Communion (5)"
  },
  {
    "id": 6,
    "src": "photos/_zac7468.jpg",
    "w": 1200,
    "h": 1803,
    "orient": "portrait",
    "caption": "Alayna Ann Sony \u2014 Holy Communion (6)"
  },
  {
    "id": 7,
    "src": "photos/_zac7473.jpg",
    "w": 1200,
    "h": 1803,
    "orient": "portrait",
    "caption": "Alayna Ann Sony \u2014 Holy Communion (7)"
  },
  {
    "id": 8,
    "src": "photos/_zac7474.jpg",
    "w": 1200,
    "h": 1803,
    "orient": "portrait",
    "caption": "Alayna Ann Sony \u2014 Holy Communion (8)"
  },
  {
    "id": 9,
    "src": "photos/_zac7475.jpg",
    "w": 1200,
    "h": 1802,
    "orient": "portrait",
    "caption": "Alayna Ann Sony \u2014 Holy Communion (9)"
  },
  {
    "id": 10,
    "src": "photos/_zac7477.jpg",
    "w": 1200,
    "h": 1803,
    "orient": "portrait",
    "caption": "Alayna Ann Sony \u2014 Holy Communion (10)"
  },
  {
    "id": 11,
    "src": "photos/_zac7478.jpg",
    "w": 1200,
    "h": 1803,
    "orient": "portrait",
    "caption": "Alayna Ann Sony \u2014 Holy Communion (11)"
  },
  {
    "id": 12,
    "src": "photos/_zac7479.jpg",
    "w": 1200,
    "h": 1803,
    "orient": "portrait",
    "caption": "Alayna Ann Sony \u2014 Holy Communion (12)"
  },
  {
    "id": 13,
    "src": "photos/_zac7480.jpg",
    "w": 1200,
    "h": 1803,
    "orient": "portrait",
    "caption": "Alayna Ann Sony \u2014 Holy Communion (13)"
  },
  {
    "id": 14,
    "src": "photos/_zac7481.jpg",
    "w": 1200,
    "h": 1805,
    "orient": "portrait",
    "caption": "Alayna Ann Sony \u2014 Holy Communion (14)"
  }
];

  var currentFilter = 'all';
  var isExpanded = false;
  var INITIAL_LIMIT = 4;

  var galleryGrid = document.getElementById('communionGalleryGrid');
  var galleryToggleBtn = document.getElementById('galleryToggleBtn');
  var galleryToggleText = document.getElementById('galleryToggleText');
  var filterTabs = document.querySelectorAll('.filter-tab');

  // Lightbox Elements
  var lb = document.getElementById('lightbox');
  var lbImg = lb ? lb.querySelector('img') : null;
  var lbCloseBtn = lb ? lb.querySelector('.lb-close') : null;
  var lbPrevBtn = lb ? lb.querySelector('.lb-prev') : null;
  var lbNextBtn = lb ? lb.querySelector('.lb-next') : null;
  var lbCounter = document.getElementById('lbCounter');
  var lbDownloadBtn = document.getElementById('lbDownloadBtn');

  var activeGalleryList = COMMUNION_PHOTOS.slice();
  var activePhotoIndex = 0;

  function getFilteredPhotos() {
    if (currentFilter === 'all') return COMMUNION_PHOTOS;
    return COMMUNION_PHOTOS.filter(function (p) { return p.orient === currentFilter; });
  }

  function renderGallery() {
    if (!galleryGrid) return;
    var filtered = getFilteredPhotos();
    activeGalleryList = filtered;

    var displayCount = isExpanded ? filtered.length : Math.min(INITIAL_LIMIT, filtered.length);
    var itemsToRender = filtered.slice(0, displayCount);

    galleryGrid.innerHTML = itemsToRender.map(function (p, idx) {
      return '<figure class="reveal" data-index="' + idx + '">' +
        '<img src="' + p.src + '" alt="' + p.caption + '" loading="lazy">' +
      '</figure>';
    }).join('');

    // Re-observe revealed figures for smooth scroll animation
    galleryGrid.querySelectorAll('figure.reveal').forEach(function (el) {
      io.observe(el);
      el.addEventListener('click', function () {
        var idx = parseInt(el.getAttribute('data-index'), 10);
        openLightbox(idx);
      });
    });

    if (galleryToggleBtn && galleryToggleText) {
      if (filtered.length <= INITIAL_LIMIT) {
        galleryToggleBtn.style.display = 'none';
      } else {
        galleryToggleBtn.style.display = 'inline-flex';
        galleryToggleText.textContent = isExpanded ? 'Show Fewer Photos' : 'View All Photos';
      }
    }
  }

  filterTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      filterTabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      currentFilter = tab.getAttribute('data-filter');
      isExpanded = false;
      renderGallery();
    });
  });

  if (galleryToggleBtn) {
    galleryToggleBtn.addEventListener('click', function () {
      isExpanded = !isExpanded;
      renderGallery();
      if (!isExpanded && galleryGrid) {
        galleryGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Lightbox functions
  function showPhotoAtIndex(index) {
    if (!activeGalleryList.length || !lbImg) return;
    if (index < 0) index = activeGalleryList.length - 1;
    if (index >= activeGalleryList.length) index = 0;

    activePhotoIndex = index;
    var photo = activeGalleryList[index];

    lbImg.src = photo.src;
    lbImg.alt = photo.caption || 'Alayna Ann Sony Holy Communion';

    if (lbCounter) {
      lbCounter.textContent = (index + 1) + ' / ' + activeGalleryList.length;
    }
    if (lbDownloadBtn) {
      lbDownloadBtn.href = photo.src;
      lbDownloadBtn.setAttribute('download', 'Alayna-Ann-Sony-' + (photo.id || index + 1) + '.jpg');
    }
  }

  function openLightbox(index, customList) {
    if (!lb) return;
    if (customList && customList.length) {
      activeGalleryList = customList;
    }
    showPhotoAtIndex(index);
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    if (!lb) return;
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
  }

  if (lbCloseBtn) lbCloseBtn.addEventListener('click', closeLightbox);
  if (lbPrevBtn) lbPrevBtn.addEventListener('click', function (e) { e.stopPropagation(); showPhotoAtIndex(activePhotoIndex - 1); });
  if (lbNextBtn) lbNextBtn.addEventListener('click', function (e) { e.stopPropagation(); showPhotoAtIndex(activePhotoIndex + 1); });

  if (lb) {
    lb.addEventListener('click', function (e) {
      if (e.target === lb) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!lb || !lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPhotoAtIndex(activePhotoIndex - 1);
    if (e.key === 'ArrowRight') showPhotoAtIndex(activePhotoIndex + 1);
  });

  // Mobile Touch Swipe for Lightbox
  var touchStartX = 0;
  var touchEndX = 0;
  if (lb) {
    lb.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lb.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 45) {
        if (diff > 0) {
          showPhotoAtIndex(activePhotoIndex + 1);
        } else {
          showPhotoAtIndex(activePhotoIndex - 1);
        }
      }
    }, { passive: true });
  }

  // Zoom button for official invitation card
  document.querySelectorAll('[data-zoom]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var src = btn.getAttribute('data-zoom');
      activeGalleryList = [{ id: 'card', src: src, caption: 'Official Holy Communion Invitation Card' }];
      activePhotoIndex = 0;
      openLightbox(0);
    });
  });

  renderGallery();

    // ============================================================
  // 9B. CHERISHED MEMORIES GALLERY (THROUGH THE YEARS)
  // ============================================================
  var MEMORIES_PHOTOS = [
  {
    "id": 1,
    "src": "memories/mem_01.jpg",
    "w": 576,
    "h": 1024,
    "orient": "portrait",
    "caption": "Alayna \u2014 Cherished Memories (1)"
  },
  {
    "id": 2,
    "src": "memories/mem_02.jpg",
    "w": 1024,
    "h": 768,
    "orient": "landscape",
    "caption": "Alayna \u2014 Cherished Memories (2)"
  },
  {
    "id": 3,
    "src": "memories/mem_03.jpg",
    "w": 1024,
    "h": 768,
    "orient": "landscape",
    "caption": "Alayna \u2014 Cherished Memories (3)"
  },
  {
    "id": 4,
    "src": "memories/mem_04.jpg",
    "w": 768,
    "h": 1024,
    "orient": "portrait",
    "caption": "Alayna \u2014 Cherished Memories (4)"
  },
  {
    "id": 5,
    "src": "memories/mem_05.jpg",
    "w": 768,
    "h": 1024,
    "orient": "portrait",
    "caption": "Alayna \u2014 Cherished Memories (5)"
  },
  {
    "id": 6,
    "src": "memories/mem_06.jpg",
    "w": 768,
    "h": 1024,
    "orient": "portrait",
    "caption": "Alayna \u2014 Cherished Memories (6)"
  },
  {
    "id": 7,
    "src": "memories/mem_07.jpg",
    "w": 764,
    "h": 1024,
    "orient": "portrait",
    "caption": "Alayna \u2014 Cherished Memories (7)"
  },
  {
    "id": 8,
    "src": "memories/mem_08.jpg",
    "w": 560,
    "h": 960,
    "orient": "portrait",
    "caption": "Alayna \u2014 Cherished Memories (8)"
  },
  {
    "id": 9,
    "src": "memories/mem_09.jpg",
    "w": 720,
    "h": 960,
    "orient": "portrait",
    "caption": "Alayna \u2014 Cherished Memories (9)"
  },
  {
    "id": 10,
    "src": "memories/mem_10.jpg",
    "w": 768,
    "h": 1024,
    "orient": "portrait",
    "caption": "Alayna \u2014 Cherished Memories (10)"
  },
  {
    "id": 11,
    "src": "memories/mem_11.jpg",
    "w": 768,
    "h": 1024,
    "orient": "portrait",
    "caption": "Alayna \u2014 Cherished Memories (11)"
  },
  {
    "id": 12,
    "src": "memories/mem_12.jpg",
    "w": 768,
    "h": 1024,
    "orient": "portrait",
    "caption": "Alayna \u2014 Cherished Memories (12)"
  },
  {
    "id": 13,
    "src": "memories/mem_13.jpg",
    "w": 683,
    "h": 1024,
    "orient": "portrait",
    "caption": "Alayna \u2014 Cherished Memories (13)"
  },
  {
    "id": 14,
    "src": "memories/mem_14.jpg",
    "w": 681,
    "h": 1024,
    "orient": "portrait",
    "caption": "Alayna \u2014 Cherished Memories (14)"
  },
  {
    "id": 15,
    "src": "memories/mem_15.jpg",
    "w": 1024,
    "h": 942,
    "orient": "landscape",
    "caption": "Alayna \u2014 Cherished Memories (15)"
  },
  {
    "id": 16,
    "src": "memories/mem_16.jpg",
    "w": 687,
    "h": 1024,
    "orient": "portrait",
    "caption": "Alayna \u2014 Cherished Memories (16)"
  },
  {
    "id": 17,
    "src": "memories/mem_17.jpg",
    "w": 768,
    "h": 1024,
    "orient": "portrait",
    "caption": "Alayna \u2014 Cherished Memories (17)"
  },
  {
    "id": 18,
    "src": "memories/mem_18.jpg",
    "w": 692,
    "h": 960,
    "orient": "portrait",
    "caption": "Alayna \u2014 Cherished Memories (18)"
  },
  {
    "id": 19,
    "src": "memories/mem_19.jpg",
    "w": 768,
    "h": 1024,
    "orient": "portrait",
    "caption": "Alayna \u2014 Cherished Memories (19)"
  },
  {
    "id": 20,
    "src": "memories/mem_20.jpg",
    "w": 768,
    "h": 1024,
    "orient": "portrait",
    "caption": "Alayna \u2014 Cherished Memories (20)"
  },
  {
    "id": 21,
    "src": "memories/mem_21.jpg",
    "w": 1024,
    "h": 1020,
    "orient": "landscape",
    "caption": "Alayna \u2014 Cherished Memories (21)"
  },
  {
    "id": 22,
    "src": "memories/mem_22.jpg",
    "w": 1024,
    "h": 759,
    "orient": "landscape",
    "caption": "Alayna \u2014 Cherished Memories (22)"
  },
  {
    "id": 23,
    "src": "memories/mem_23.jpg",
    "w": 1024,
    "h": 768,
    "orient": "landscape",
    "caption": "Alayna \u2014 Cherished Memories (23)"
  },
  {
    "id": 24,
    "src": "memories/mem_24.jpg",
    "w": 819,
    "h": 1024,
    "orient": "portrait",
    "caption": "Alayna \u2014 Cherished Memories (24)"
  },
  {
    "id": 25,
    "src": "memories/mem_25.jpg",
    "w": 411,
    "h": 733,
    "orient": "portrait",
    "caption": "Alayna \u2014 Cherished Memories (25)"
  },
  {
    "id": 26,
    "src": "memories/mem_26.jpg",
    "w": 770,
    "h": 1024,
    "orient": "portrait",
    "caption": "Alayna \u2014 Cherished Memories (26)"
  },
  {
    "id": 27,
    "src": "memories/mem_27.jpg",
    "w": 768,
    "h": 1024,
    "orient": "portrait",
    "caption": "Alayna \u2014 Cherished Memories (27)"
  },
  {
    "id": 28,
    "src": "memories/mem_28.jpg",
    "w": 768,
    "h": 1024,
    "orient": "portrait",
    "caption": "Alayna \u2014 Cherished Memories (28)"
  },
  {
    "id": 29,
    "src": "memories/mem_29.jpg",
    "w": 768,
    "h": 1024,
    "orient": "portrait",
    "caption": "Alayna \u2014 Cherished Memories (29)"
  }
];

  var memoriesGrid = document.getElementById('memoriesGrid');
  var memoriesToggleBtn = document.getElementById('memoriesToggleBtn');
  var memoriesToggleText = document.getElementById('memoriesToggleText');
  var memoriesExpanded = false;
  var MEMORIES_INITIAL_LIMIT = 4;

  function renderMemories() {
    if (!memoriesGrid) return;
    var count = memoriesExpanded ? MEMORIES_PHOTOS.length : Math.min(MEMORIES_INITIAL_LIMIT, MEMORIES_PHOTOS.length);
    var items = MEMORIES_PHOTOS.slice(0, count);

    memoriesGrid.innerHTML = items.map(function (p, idx) {
      return '<figure class="reveal" data-mem-idx="' + idx + '">' +
        '<img src="' + p.src + '" alt="' + p.caption + '" loading="lazy">' +
      '</figure>';
    }).join('');

    memoriesGrid.querySelectorAll('figure.reveal').forEach(function (el) {
      io.observe(el);
      el.addEventListener('click', function () {
        var idx = parseInt(el.getAttribute('data-mem-idx'), 10);
        openLightbox(idx, MEMORIES_PHOTOS);
      });
    });

    if (memoriesToggleBtn && memoriesToggleText) {
      if (MEMORIES_PHOTOS.length <= MEMORIES_INITIAL_LIMIT) {
        memoriesToggleBtn.style.display = 'none';
      } else {
        memoriesToggleBtn.style.display = 'inline-flex';
        memoriesToggleText.textContent = memoriesExpanded ? 'Show Fewer Photos' : 'View All Photos';
      }
    }
  }

  if (memoriesToggleBtn) {
    memoriesToggleBtn.addEventListener('click', function () {
      memoriesExpanded = !memoriesExpanded;
      renderMemories();
      if (!memoriesExpanded && memoriesGrid) {
        memoriesGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  renderMemories();

  // ============================================================
  // 10. UNIFIED RSVP & BLESSINGS (ON-SITE ONLY, NO WHATSAPP)
  // ============================================================
  var btnYes = document.getElementById('btnYes');
  var btnNo = document.getElementById('btnNo');
  var attendanceInput = document.getElementById('attendanceInput');
  var guestsFieldWrap = document.getElementById('guestsFieldWrap');
  var rsvpForm = document.getElementById('rsvpForm');
  var rsvpSuccess = document.getElementById('rsvpSuccess');
  var rsvpEditBtn = document.getElementById('rsvpEditBtn');
  var rsvpSuccessMsg = document.getElementById('rsvpSuccessMsg');

  // Ensure success message is hidden on load
  if (rsvpSuccess) {
    rsvpSuccess.classList.remove('is-visible');
    rsvpSuccess.style.display = 'none';
    rsvpSuccess.setAttribute('hidden', '');
  }

  function setAttendance(value) {
    if (attendanceInput) attendanceInput.value = value;
    if (value === 'yes') {
      if (btnYes) { btnYes.classList.add('active'); btnYes.setAttribute('aria-pressed', 'true'); }
      if (btnNo)  { btnNo.classList.remove('active'); btnNo.setAttribute('aria-pressed', 'false'); }
      if (guestsFieldWrap) guestsFieldWrap.style.display = 'flex';
    } else {
      if (btnNo)  { btnNo.classList.add('active'); btnNo.setAttribute('aria-pressed', 'true'); }
      if (btnYes) { btnYes.classList.remove('active'); btnYes.setAttribute('aria-pressed', 'false'); }
      if (guestsFieldWrap) guestsFieldWrap.style.display = 'none';
    }
  }

  if (btnYes) btnYes.addEventListener('click', function () { setAttendance('yes'); });
  if (btnNo)  btnNo.addEventListener('click',  function () { setAttendance('no'); });

  function getStoredResponses() {
    try {
      return JSON.parse(localStorage.getItem('alayna_communion_responses') || '[]');
    } catch (_) {
      return [];
    }
  }

  function saveResponses(list) {
    try {
      localStorage.setItem('alayna_communion_responses', JSON.stringify(list));
    } catch (_) { }
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameField = document.getElementById('rsvpName');
      var name = nameField.value.trim();
      if (!name) {
        nameField.focus();
        nameField.style.borderColor = 'var(--blue-deep)';
        setTimeout(function () { nameField.style.borderColor = ''; }, 2000);
        return;
      }

      var attendance = attendanceInput ? attendanceInput.value : 'yes';
      var mobileEl = document.getElementById('rsvpMobile');
      var mobile = mobileEl ? mobileEl.value.trim() : '';
      var guests = attendance === 'yes' ? (parseInt(document.getElementById('rsvpGuests').value, 10) || 1) : 0;
      var message = document.getElementById('rsvpMessage').value.trim();

      var newResponse = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        name: name,
        mobile: mobile,
        attendance: attendance,
        guests: guests,
        message: message
      };

      var list = getStoredResponses();
      list.unshift(newResponse);
      saveResponses(list);

      if (rsvpSuccessMsg) {
        if (attendance === 'yes') {
          rsvpSuccessMsg.textContent = "Thank you, " + name + "! Your response for " + guests + " guest(s) and your heartfelt blessing for Alayna have been recorded with joy. We look forward to celebrating with you!";
        } else {
          rsvpSuccessMsg.textContent = "Thank you, " + name + ". Your message and blessing for Alayna have been received with love. We truly appreciate your prayers.";
        }
      }

      if (rsvpForm) {
        rsvpForm.classList.add('is-hidden');
        rsvpForm.style.display = 'none';
        rsvpForm.setAttribute('hidden', '');
      }
      if (rsvpSuccess) {
        rsvpSuccess.classList.add('is-visible');
        rsvpSuccess.style.display = 'flex';
        rsvpSuccess.removeAttribute('hidden');
      }

      if (ownerDashboard && !ownerDashboard.hidden) {
        renderOwnerDashboard();
      }
    });
  }

  if (rsvpEditBtn) {
    rsvpEditBtn.addEventListener('click', function () {
      if (rsvpSuccess) {
        rsvpSuccess.classList.remove('is-visible');
        rsvpSuccess.style.display = 'none';
        rsvpSuccess.setAttribute('hidden', '');
      }
      if (rsvpForm) {
        rsvpForm.classList.remove('is-hidden');
        rsvpForm.style.display = 'flex';
        rsvpForm.removeAttribute('hidden');
        var nameInput = document.getElementById('rsvpName');
        var msgInput = document.getElementById('rsvpMessage');
        if (nameInput) nameInput.value = '';
        if (msgInput) msgInput.value = '';
      }
    });
  }

  // ============================================================
  // 12. OWNER VIEW WITH PIN "1234" & RESPONSES DASHBOARD
  // ============================================================
  var ownerLockBtn = document.getElementById('ownerLockBtn');
  var ownerPinBox = document.getElementById('ownerPinBox');
  var pinForm = document.getElementById('pinForm');
  var pinInput = document.getElementById('pinInput');
  var pinError = document.getElementById('pinError');
  var pinCloseBtn = document.getElementById('pinCloseBtn');
  var ownerDashboard = document.getElementById('ownerDashboard');
  var lockDashboardBtn = document.getElementById('lockDashboardBtn');
  var exportCsvBtn = document.getElementById('exportCsvBtn');

  var statTotalResponses = document.getElementById('statTotalResponses');
  var statAttendingGuests = document.getElementById('statAttendingGuests');
  var statDeclined = document.getElementById('statDeclined');
  var submissionsList = document.getElementById('submissionsList');

  function isOwnerAuthenticated() {
    try {
      return sessionStorage.getItem('owner_authenticated') === 'true';
    } catch (_) {
      return false;
    }
  }

  function unlockOwnerView() {
    try {
      sessionStorage.setItem('owner_authenticated', 'true');
    } catch (_) { }
    if (ownerPinBox) ownerPinBox.hidden = true;
    if (ownerDashboard) {
      ownerDashboard.hidden = false;
      renderOwnerDashboard();
    }
    if (ownerLockBtn) ownerLockBtn.setAttribute('aria-expanded', 'true');
  }

  function lockOwnerView() {
    try {
      sessionStorage.removeItem('owner_authenticated');
    } catch (_) { }
    if (ownerPinBox) ownerPinBox.hidden = true;
    if (ownerDashboard) ownerDashboard.hidden = true;
    if (pinInput) pinInput.value = '';
    if (pinError) pinError.hidden = true;
    if (ownerLockBtn) ownerLockBtn.setAttribute('aria-expanded', 'false');
  }

  if (ownerLockBtn) {
    ownerLockBtn.addEventListener('click', function () {
      if (isOwnerAuthenticated()) {
        if (ownerDashboard.hidden) {
          ownerDashboard.hidden = false;
          renderOwnerDashboard();
        } else {
          ownerDashboard.hidden = true;
        }
      } else {
        if (ownerPinBox.hidden) {
          ownerPinBox.hidden = false;
          if (pinError) pinError.hidden = true;
          if (pinInput) { pinInput.value = ''; pinInput.focus(); }
        } else {
          ownerPinBox.hidden = true;
        }
      }
    });
  }

  if (pinCloseBtn) {
    pinCloseBtn.addEventListener('click', function () {
      if (ownerPinBox) ownerPinBox.hidden = true;
    });
  }

  if (pinForm) {
    pinForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var enteredPin = pinInput ? pinInput.value.trim() : '';
      if (enteredPin === '1234') {
        unlockOwnerView();
      } else {
        if (pinError) pinError.hidden = false;
        if (pinInput) {
          pinInput.style.borderColor = '#c0392b';
          pinInput.focus();
          setTimeout(function () { pinInput.style.borderColor = ''; }, 2000);
        }
      }
    });
  }

  if (lockDashboardBtn) {
    lockDashboardBtn.addEventListener('click', lockOwnerView);
  }

  function renderOwnerDashboard() {
    if (!submissionsList) return;
    var list = getStoredResponses();

    var totalCount = list.length;
    var attendingCount = 0;
    var declinedCount = 0;

    list.forEach(function (r) {
      if (r.attendance === 'yes') {
        attendingCount += (parseInt(r.guests, 10) || 1);
      } else {
        declinedCount += 1;
      }
    });

    if (statTotalResponses) statTotalResponses.textContent = totalCount;
    if (statAttendingGuests) statAttendingGuests.textContent = attendingCount;
    if (statDeclined) statDeclined.textContent = declinedCount;

    if (list.length === 0) {
      submissionsList.innerHTML = '<div class="empty-submissions">No blessings recorded yet. Guest messages will appear here as soon as they submit! Guest responses will appear here as soon as they submit!</div>';
      return;
    }

    submissionsList.innerHTML = list.map(function (item) {
      var isAttending = item.attendance === 'yes';
      var badgeClass = isAttending ? 'attending' : 'declined';
      var badgeText = isAttending ? ('✓ Attending (' + (item.guests || 1) + ')') : '✕ Declined';
      var dateFormatted = item.timestamp ? new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
      var phoneHtml = item.mobile ? ('<span>📞 <a href="tel:' + item.mobile + '">' + item.mobile + '</a></span>') : '';
      var messageHtml = item.message ? ('<div class="sub-message">&ldquo;' + item.message + '&rdquo;</div>') : '';

      return '<div class="submission-item" data-id="' + item.id + '">' +
        '<div class="sub-header">' +
          '<span class="sub-name">' + item.name + '</span>' +
          '<span class="sub-badge ' + badgeClass + '">' + badgeText + '</span>' +
        '</div>' +
        '<div class="sub-meta">' +
          phoneHtml +
          (dateFormatted ? ('<span>🕒 ' + dateFormatted + '</span>') : '') +
        '</div>' +
        messageHtml +
        '<div class="sub-footer">' +
          '<span>Entry #' + item.id + '</span>' +
          '<button class="sub-delete-btn" type="button" data-del="' + item.id + '">Remove</button>' +
        '</div>' +
      '</div>';
    }).join('');

    submissionsList.querySelectorAll('[data-del]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var id = parseInt(btn.getAttribute('data-del'), 10);
        if (confirm('Are you sure you want to remove this entry?')) {
          var updated = getStoredResponses().filter(function (x) { return x.id !== id; });
          saveResponses(updated);
          renderOwnerDashboard();
        }
      });
    });
  }

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', function () {
      var list = getStoredResponses();
      if (!list.length) {
        alert('No responses to export yet.');
        return;
      }

      var headers = ['ID', 'Date', 'Full Name', 'Attendance', 'Guests', 'Mobile', 'Blessing/Message'];
      var rows = list.map(function (r) {
        return [
          r.id,
          r.timestamp ? '"' + new Date(r.timestamp).toLocaleString() + '"' : '""',
          '"' + (r.name || '').replace(/"/g, '""') + '"',
          r.attendance === 'yes' ? '"Attending"' : '"Declined"',
          r.attendance === 'yes' ? (r.guests || 1) : 0,
          '"' + (r.mobile || '') + '"',
          '"' + (r.message || '').replace(/"/g, '""') + '"'
        ].join(',');
      });

      var csvContent = [headers.join(',')].concat(rows).join('\r\n');
      var dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
      var link = document.createElement('a');
      link.href = dataUri;
      link.setAttribute('download', 'Alayna-Holy-Communion-Blessings.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

})();
