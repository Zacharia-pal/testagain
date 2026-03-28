/* ========== Mobile Menu Toggle ========== */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var hamburger = document.querySelector('.hamburger');
    var mobileNav = document.querySelector('.mobile-nav');
    var overlay = document.querySelector('.mobile-overlay');

    if (!hamburger || !mobileNav) return;

    function toggleMenu() {
      var isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      if (overlay) overlay.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    // Close menu when a link is clicked
    var links = mobileNav.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', closeMenu);
    }
  });
})();

/* ========== Scroll Reveal (IntersectionObserver) ========== */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      reveals.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: show all immediately
      reveals.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  });
})();

/* ========== FAQ Filter ========== */
function filterFAQ() {
  var input = document.getElementById('faqInput');
  if (!input) return;
  var filter = input.value.toLowerCase();
  var list = document.getElementById('faqList');
  if (!list) return;
  var items = list.getElementsByClassName('faq-item');
  for (var i = 0; i < items.length; i++) {
    var text = items[i].textContent || items[i].innerText;
    items[i].style.display = text.toLowerCase().indexOf(filter) > -1 ? '' : 'none';
  }
}

/* ========== Dark Mode ========== */
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  var isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark ? 'true' : 'false');
  updateDarkModeIcon(isDark);
}

function updateDarkModeIcon(isDark) {
  var icons = document.querySelectorAll('.dark-mode-icon');
  for (var i = 0; i < icons.length; i++) {
    icons[i].innerHTML = isDark ? '&#9788;' : '&#9789;';
  }
}

function loadDarkMode() {
  var isDark = localStorage.getItem('darkMode') === 'true';
  if (isDark) {
    document.body.classList.add('dark-mode');
  }
  updateDarkModeIcon(isDark);
}

/* ========== Language Switching ========== */
function setLanguage(lang) {
  localStorage.setItem('language', lang);
  applyLanguage(lang);
}

function applyLanguage(lang) {
  if (typeof translations === 'undefined') return;
  var elements = document.querySelectorAll('[data-i18n]');
  for (var i = 0; i < elements.length; i++) {
    var key = elements[i].getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      elements[i].textContent = translations[lang][key];
    }
  }
  // Handle placeholder translations
  var placeholders = document.querySelectorAll('[data-i18n-placeholder]');
  for (var j = 0; j < placeholders.length; j++) {
    var pKey = placeholders[j].getAttribute('data-i18n-placeholder');
    if (translations[lang] && translations[lang][pKey]) {
      placeholders[j].placeholder = translations[lang][pKey];
    }
  }
  // Highlight active language flag
  var allFlags = document.querySelectorAll('.language-flags img, .mobile-flags img');
  for (var k = 0; k < allFlags.length; k++) {
    allFlags[k].style.opacity = '0.5';
  }
  var flagMap = { en: 'English', nl: 'Nederlands', fr: 'Francais' };
  var activeName = flagMap[lang] || '';
  for (var m = 0; m < allFlags.length; m++) {
    if (allFlags[m].alt === activeName) {
      allFlags[m].style.opacity = '1';
    }
  }
}

function loadLanguage() {
  var lang = localStorage.getItem('language') || 'en';
  applyLanguage(lang);
}

/* ========== Init Dark Mode & Language on Load ========== */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    loadDarkMode();
    loadLanguage();
  });
})();
