// ===========================
// БУРГЕР-МЕНЮ
// ===========================
function initBurger() {
  const burger = document.querySelector('.header__burger');
  const mobileNav = document.querySelector('.nav--mobile');
  if (!burger || !mobileNav) return;

  burger.addEventListener('click', () => {
    burger.classList.toggle('is-open');
    mobileNav.classList.toggle('is-open');
  });

  // Закрываем при клике на ссылку
  mobileNav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('is-open');
      mobileNav.classList.remove('is-open');
    });
  });
}

// ===========================
// АКТИВНАЯ ССЫЛКА В НАВИГАЦИИ
// ===========================
function initActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('nav__link--active');
    }
  });
}

// ===========================
// ФИЛЬТРЫ НА СТРАНИЦЕ РЕЦЕПТОВ
// ===========================
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.recipe-card[data-category]');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ===========================
// ПОИСК НА СТРАНИЦЕ РЕЦЕПТОВ
// ===========================
function initSearch() {
  const searchInput = document.querySelector('.filters__search-input');
  const cards = document.querySelectorAll('.recipe-card');

  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();

    cards.forEach(card => {
      const title = card.querySelector('.recipe-card__title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.recipe-card__desc')?.textContent.toLowerCase() || '';
      const visible = title.includes(query) || desc.includes(query);
      card.style.display = visible ? '' : 'none';
    });
  });
}

// ===========================
// ВАЛИДАЦИЯ ФОРМЫ РЕГИСТРАЦИИ
// ===========================
function initRegistrationForm() {
  const form = document.querySelector('.registration-form');
  if (!form) return;

  function showError(inputEl, errorEl, message) {
    inputEl.classList.add('form__input--error');
    errorEl.textContent = message;
    errorEl.classList.add('is-visible');
  }

  function clearError(inputEl, errorEl) {
    inputEl.classList.remove('form__input--error');
    errorEl.classList.remove('is-visible');
  }

  const fields = {
    username: form.querySelector('#username'),
    email: form.querySelector('#email'),
    password: form.querySelector('#password'),
    password2: form.querySelector('#password2'),
    agree: form.querySelector('#agree'),
  };

  const errors = {
    username: form.querySelector('#username-error'),
    email: form.querySelector('#email-error'),
    password: form.querySelector('#password-error'),
    password2: form.querySelector('#password2-error'),
    agree: form.querySelector('#agree-error'),
  };

  // Live валидация
  fields.email?.addEventListener('input', () => {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (fields.email.value && !emailRe.test(fields.email.value)) {
      showError(fields.email, errors.email, 'Введите корректный email-адрес');
    } else {
      clearError(fields.email, errors.email);
    }
  });

  fields.password?.addEventListener('input', () => {
    if (fields.password.value && fields.password.value.length < 6) {
      showError(fields.password, errors.password, 'Пароль должен содержать не менее 6 символов');
    } else {
      clearError(fields.password, errors.password);
    }
  });

  fields.password2?.addEventListener('input', () => {
    if (fields.password2.value && fields.password2.value !== fields.password.value) {
      showError(fields.password2, errors.password2, 'Пароли не совпадают');
    } else {
      clearError(fields.password2, errors.password2);
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Имя
    if (!fields.username.value.trim()) {
      showError(fields.username, errors.username, 'Введите имя пользователя');
      valid = false;
    } else {
      clearError(fields.username, errors.username);
    }

    // Email
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fields.email.value.trim() || !emailRe.test(fields.email.value)) {
      showError(fields.email, errors.email, 'Введите корректный email-адрес');
      valid = false;
    } else {
      clearError(fields.email, errors.email);
    }

    // Пароль
    if (fields.password.value.length < 6) {
      showError(fields.password, errors.password, 'Пароль должен содержать не менее 6 символов');
      valid = false;
    } else {
      clearError(fields.password, errors.password);
    }

    // Подтверждение пароля
    if (fields.password2.value !== fields.password.value) {
      showError(fields.password2, errors.password2, 'Пароли не совпадают');
      valid = false;
    } else {
      clearError(fields.password2, errors.password2);
    }

    // Согласие
    if (!fields.agree.checked) {
      errors.agree.textContent = 'Необходимо принять условия обработки данных';
      errors.agree.classList.add('is-visible');
      valid = false;
    } else {
      errors.agree.classList.remove('is-visible');
    }

    if (valid) {
      // Сохраняем пользователя
      const user = {
        username: fields.username.value.trim(),
        email: fields.email.value.trim(),
      };
      localStorage.setItem('recipe_user', JSON.stringify(user));

      // Показываем уведомление
      showToast('Регистрация прошла успешно! Добро пожаловать.');
      setTimeout(() => {
        window.location.href = 'account.html';
      }, 1500);
    }
  });
}

// ===========================
// ЛИЧНЫЙ КАБИНЕТ
// ===========================
function initAccount() {
  const welcomeTitle = document.querySelector('.account-welcome__title');
  const sidebarName = document.querySelector('.account-sidebar__name');
  const sidebarEmail = document.querySelector('.account-sidebar__email');

  const user = JSON.parse(localStorage.getItem('recipe_user') || '{"username":"Гость","email":"guest@example.com"}');

  if (welcomeTitle) welcomeTitle.textContent = 'Добро пожаловать, ' + user.username + '!';
  if (sidebarName) sidebarName.textContent = user.username;
  if (sidebarEmail) sidebarEmail.textContent = user.email;

  // Кнопка выйти
  const logoutBtn = document.querySelector('.btn--logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('recipe_user');
      window.location.href = 'index.html';
    });
  }

  // Загрузка аватара
  const avatarInput = document.querySelector('#avatar-input');
  const avatarImg = document.querySelector('.account-sidebar__avatar');
  if (avatarInput && avatarImg) {
    avatarInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          avatarImg.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Вкладки
  const navLinks = document.querySelectorAll('.account-nav__link[data-tab]');
  const tabPanes = document.querySelectorAll('.account-tab');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = link.dataset.tab;
      navLinks.forEach(l => l.classList.remove('account-nav__link--active'));
      tabPanes.forEach(p => p.style.display = 'none');
      link.classList.add('account-nav__link--active');
      document.querySelector('.account-tab[data-tab="' + tab + '"]').style.display = '';
    });
  });
}

// ===========================
// УВЕДОМЛЕНИЯ (toast)
// ===========================
function showToast(message) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #1c1c1c;
    color: #fff;
    padding: 14px 24px;
    border-radius: 8px;
    font-family: 'Raleway', sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    z-index: 9999;
    border-left: 4px solid #c0392b;
    animation: slideInRight 0.3s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===========================
// FADE-IN ПРИ ПРОКРУТКЕ
// ===========================
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.recipe-card, .category-card, .review-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    observer.observe(el);
  });

  // Стиль для is-visible
  const style = document.createElement('style');
  style.textContent = '.is-visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);
}

// ===========================
// ПАГИНАЦИЯ
// ===========================
function initPagination() {
  const btns = document.querySelectorAll('.pagination__btn[data-page]');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// ===========================
// ИНИЦИАЛИЗАЦИЯ
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  initBurger();
  initActiveNav();
  initFilters();
  initSearch();
  initRegistrationForm();
  initAccount();
  initScrollAnimations();
  initPagination();
});
