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
    var toggle = document.getElementById('lang-toggle');
    if (!toggle) {
      return;
    }

    var item = toggle.closest('li');
    var siteNav = document.getElementById('site-nav');
    if (!item || !siteNav) {
      return;
    }

    var visibleLinks = siteNav.querySelector('.visible-links');
    var hiddenLinks = siteNav.querySelector('.hidden-links');

    // Keep the language item in the visible nav list.
    if (hiddenLinks && hiddenLinks.contains(item) && visibleLinks) {
      visibleLinks.appendChild(item);
    }

    item.classList.add('persist');
    item.classList.remove('hidden');
    toggle.classList.remove('hidden');

    item.style.display = '';
    item.style.visibility = '';
    toggle.style.display = 'inline-block';
    toggle.style.visibility = 'visible';
    toggle.style.opacity = '1';
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
    document.querySelectorAll('[data-lang]').forEach(function (el) {
      el.style.display = el.getAttribute('data-lang') === lang ? '' : 'none';
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
    }

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

    ensureToggleVisible();
    window.addEventListener('resize', ensureToggleVisible);

    applyLanguage(getInitialLanguage());
  });
})();
