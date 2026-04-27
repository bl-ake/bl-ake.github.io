(function () {
  var navTranslations = {
    en: {
      '/publications/': 'Publications',
      '/cv/': 'CV',
      '/teaching/': 'Teaching',
    },
    zh: {
      '/publications/': '论文',
      '/cv/': '简历',
      '/teaching/': '教学',
    },
  };

  var pageTitleTranslations = {
    en: {
      '/publications/': 'Publications',
      '/cv/': 'CV',
      '/teaching/': 'Teaching',
    },
    zh: {
      '/publications/': '论文',
      '/cv/': '简历',
      '/teaching/': '教学',
    },
  };

  var activeLanguage = null;

  function getStoredContrast() {
    try {
      return localStorage.getItem('contrast') === 'high';
    } catch (e) {
      return false;
    }
  }

  function setStoredContrast(isHighContrast) {
    try {
      if (isHighContrast) {
        localStorage.setItem('contrast', 'high');
      } else {
        localStorage.removeItem('contrast');
      }
    } catch (e) {
      // Some browser privacy settings block localStorage; contrast selection still works for this page load.
    }
  }

  function normalizeLanguage(lang) {
    if (!lang) {
      return null;
    }

    var normalized = lang.toLowerCase();
    if (normalized.indexOf('zh') === 0) {
      return 'zh';
    }

    if (normalized.indexOf('en') === 0) {
      return 'en';
    }

    return null;
  }

  function getStoredLanguage() {
    try {
      return normalizeLanguage(localStorage.getItem('lang'));
    } catch (e) {
      return null;
    }
  }

  function setStoredLanguage(lang) {
    try {
      localStorage.setItem('lang', lang);
    } catch (e) {
      // Some browser privacy settings block localStorage; language selection still works for this page load.
    }
  }

  function getBrowserLanguage() {
    var languages = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || navigator.browserLanguage];

    for (var i = 0; i < languages.length; i += 1) {
      var lang = normalizeLanguage(languages[i]);
      if (lang) {
        return lang;
      }
    }

    return 'en';
  }

  function getInitialLanguage() {
    return getStoredLanguage() || getBrowserLanguage();
  }

  function ensureToggleVisible() {
    var langToggle = document.getElementById('lang-toggle');
    var contrastToggle = document.getElementById('contrast-toggle');
    if (!langToggle) {
      return;
    }

    var item = langToggle.closest('li');
    var siteNav = document.getElementById('site-nav');
    if (!item || !siteNav) {
      return;
    }

    var visibleLinks = siteNav.querySelector('.visible-links');
    var hiddenLinks = siteNav.querySelector('.hidden-links');

    // Keep the language and contrast controls in the visible nav list.
    if (hiddenLinks && hiddenLinks.contains(item) && visibleLinks) {
      visibleLinks.appendChild(item);
    }

    item.classList.add('persist');
    item.classList.add('tail');
    item.classList.remove('hidden');
    langToggle.classList.remove('hidden');
    if (contrastToggle) {
      contrastToggle.classList.remove('hidden');
    }

    item.style.display = '';
    item.style.visibility = '';
    langToggle.style.display = 'inline-block';
    langToggle.style.visibility = 'visible';
    langToggle.style.opacity = '1';
    if (contrastToggle) {
      contrastToggle.style.display = 'inline-block';
      contrastToggle.style.visibility = 'visible';
    }
  }

  function applyContrast(isHighContrast, options) {
    var toggle = document.getElementById('contrast-toggle');
    var labelMap = activeLanguage === 'zh'
      ? {
        increase: '增加对比度',
        standard: '使用标准对比度',
      }
      : {
        increase: 'Increase contrast',
        standard: 'Use standard contrast',
      };

    if (isHighContrast) {
      document.documentElement.setAttribute('data-contrast', 'high');
    } else {
      document.documentElement.removeAttribute('data-contrast');
    }

    if (toggle) {
      toggle.setAttribute('aria-pressed', isHighContrast ? 'true' : 'false');
      toggle.setAttribute('aria-label', isHighContrast ? labelMap.standard : labelMap.increase);
    }

    if (options && options.persist) {
      setStoredContrast(isHighContrast);
    }
  }

  function updateNavigationMenuState() {
    var menuToggle = document.querySelector('#site-nav > button');
    var hiddenLinks = document.getElementById('site-nav-hidden-links');
    if (!menuToggle || !hiddenLinks) {
      return;
    }

    menuToggle.setAttribute('aria-expanded', hiddenLinks.classList.contains('hidden') ? 'false' : 'true');
  }

  function updateAuthorLinksState() {
    var authorToggle = document.querySelector('.author__urls-wrapper button');
    var authorLinks = document.getElementById('author-links');
    if (!authorToggle || !authorLinks) {
      return;
    }

    authorToggle.setAttribute('aria-expanded', authorLinks.offsetParent === null ? 'false' : 'true');
  }

  function applyLanguage(lang, options) {
    lang = normalizeLanguage(lang) || 'en';
    activeLanguage = lang;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    // Translate nav links that have a data-nav-url attribute
    document.querySelectorAll('a[data-nav-url]').forEach(function (link) {
      var key = link.getAttribute('data-nav-url');
      var map = navTranslations[lang];
      if (map && map[key]) {
        link.textContent = map[key];
      }
    });

    // Show/hide elements tagged with data-lang="en" or data-lang="zh"
    // while keeping their language metadata explicit for screen readers.
    document.querySelectorAll('[data-lang]').forEach(function (el) {
      var elementLang = el.getAttribute('data-lang');
      var isActiveLanguage = elementLang === lang;

      el.hidden = !isActiveLanguage;
      el.setAttribute('aria-hidden', isActiveLanguage ? 'false' : 'true');
      el.setAttribute('lang', elementLang === 'zh' ? 'zh-CN' : 'en');
    });

    // Translate archive page titles.
    var pageTitle = document.querySelector('.page__title');
    var path = window.location.pathname;
    var titleMap = pageTitleTranslations[lang];
    if (pageTitle && titleMap && titleMap[path]) {
      pageTitle.textContent = titleMap[path];
    }

    // Keep a stable bilingual label for the toggle button
    var toggle = document.getElementById('lang-toggle');
    if (toggle) {
      toggle.textContent = 'EN / 中文';
      toggle.setAttribute('aria-label', lang === 'en' ? 'Switch language to Chinese' : 'Switch language to English');
    }

    applyContrast(document.documentElement.getAttribute('data-contrast') === 'high');

    ensureToggleVisible();

    if (options && options.persist) {
      setStoredLanguage(lang);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('lang-toggle');
    if (toggle) {
      if (window.jQuery) {
        try {
          window.jQuery(toggle).off('click');
          window.jQuery(toggle).off('mousedown');
          window.jQuery(toggle).off('touchstart');
        } catch (e) {
          // ignore
        }
      }

      // Prevent greedy-nav from treating this as the hamburger button.
      // Do it in capture phase so we win even if greedy-nav bound directly to #lang-toggle.
      toggle.addEventListener('click', function (e) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
          if (typeof e.stopImmediatePropagation === 'function') {
            e.stopImmediatePropagation();
          }
        }

        var current = activeLanguage || getInitialLanguage();
        applyLanguage(current === 'en' ? 'zh' : 'en', { persist: true });
      }, true);
    }

    var contrastToggle = document.getElementById('contrast-toggle');
    if (contrastToggle) {
      contrastToggle.addEventListener('click', function (e) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
          if (typeof e.stopImmediatePropagation === 'function') {
            e.stopImmediatePropagation();
          }
        }

        applyContrast(document.documentElement.getAttribute('data-contrast') !== 'high', { persist: true });
      }, true);
    }

    var menuToggle = document.querySelector('#site-nav > button');
    if (menuToggle) {
      menuToggle.addEventListener('click', function () {
        window.setTimeout(updateNavigationMenuState, 0);
      });
      updateNavigationMenuState();
    }

    var authorToggle = document.querySelector('.author__urls-wrapper button');
    if (authorToggle) {
      authorToggle.addEventListener('click', function () {
        window.setTimeout(updateAuthorLinksState, 0);
      });
      updateAuthorLinksState();
    }

    ensureToggleVisible();
    window.addEventListener('resize', ensureToggleVisible);

    applyContrast(getStoredContrast());
    applyLanguage(getInitialLanguage());
  });
})();
