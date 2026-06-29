/* Metin2 Sefiri - Main JS
   Render + etkile\u015fim mant\u0131\u011f\u0131 */

(function () {
  'use strict';

  // ====== Toast ======
  const toastEl = document.getElementById('toast');
  let toastTimer = null;
  function showToast(title, body) {
    toastEl.innerHTML =
      (title ? '<div class="toast-title">' + escapeHtml(title) + '</div>' : '') +
      '<div class="toast-body">' + escapeHtml(body || '') + '</div>';
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3500);
  }

  function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ====== Mobile menu ======
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');
  mobileToggle && mobileToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    const open = mainNav.classList.contains('open');
    mobileToggle.innerHTML = open
      ? '<i class="bi bi-x-lg"></i>'
      : '<i class="bi bi-list"></i>';
  });

  // ====== Search bar toggle ======
  const searchBtn = document.getElementById('searchBtn');
  const searchBar = document.getElementById('searchBar');
  searchBtn && searchBtn.addEventListener('click', () => {
    searchBar.classList.toggle('open');
    if (searchBar.classList.contains('open')) {
      const input = searchBar.querySelector('input');
      input && input.focus();
    }
  });

  // ====== Sidebar toggle ======
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');
  sidebarToggle && sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });

  // ====== Year ======
  const yearEl = document.getElementById('yearNow');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ====== Render VIP topics ======
  function renderVipSection() {
    const vipHtml = window.vipTopics
      .map(
        (t) => `
      <div class="subforum">
        <div class="subforum-icon" style="background: linear-gradient(135deg, #5a1418, #2a0a0d); color: #f0c87a;">
          <i class="bi bi-pin-angle-fill"></i>
        </div>
        <div class="subforum-info">
          <a href="#" class="subforum-name">${escapeHtml(t.title)}</a>
          <div class="subforum-desc">
            ${escapeHtml(t.author)}${t.verified ? ' <i class="bi bi-patch-check-fill verified"></i>' : ''}
          </div>
        </div>
        <div class="count-box">
          <div class="count-label">Cevaplar</div>
          <div class="count-value">${t.replies}</div>
        </div>
        <div class="last-post">
          ${t.lastReply ? `
            <div class="last-post-avatar">${escapeHtml(t.lastReply.initial || '?')}</div>
            <div class="last-post-text">
              <a href="#" class="last-post-title">${escapeHtml(t.lastReply.text)}</a>
              <div class="last-post-user"><i class="bi bi-chat-dots"></i>${escapeHtml(t.lastReply.user)}</div>
            </div>
          ` : `
            <div class="last-post-text">
              <span class="last-post-user">G\u00f6sterim: ${t.views}</span>
            </div>
          `}
        </div>
      </div>
    `
      )
      .join('');

    return `
      <section class="category" data-id="vip">
        <button class="category-header" type="button">
          <div class="category-icon"><i class="bi bi-pin-angle-fill"></i></div>
          <div class="category-title">V\u0130P Konu Alan\u0131</div>
          <i class="bi bi-chevron-up category-toggle"></i>
        </button>
        <div class="category-body">
          <div class="category-desc">Buradaki konulara yorum yap\u0131lamaz. L\u00fctfen reklam i\u00e7in ileti\u015fime ge\u00e7in.</div>
          ${vipHtml}
        </div>
      </section>
    `;
  }

  // ====== Render forum categories ======
  function renderCategory(cat) {
    const subHtml = cat.subForums
      .map(
        (sf) => `
      <div class="subforum">
        <div class="subforum-icon"><i class="bi bi-chat-square-text"></i></div>
        <div class="subforum-info">
          <a href="#" class="subforum-name">${escapeHtml(sf.name)}</a>
          ${sf.description ? `<div class="subforum-desc">${escapeHtml(sf.description)}</div>` : ''}
        </div>
        <div class="count-box">
          <div class="count-label">Konular</div>
          <div class="count-value">${sf.topics}</div>
        </div>
        <div class="last-post">
          <div class="last-post-avatar">${escapeHtml((sf.lastPost && sf.lastPost.initial) || '?')}</div>
          <div class="last-post-text">
            ${sf.lastPost && sf.lastPost.isNew ? '<span class="badge-new">Yeni</span>' : ''}
            <a href="#" class="last-post-title" title="${escapeHtml(sf.lastPost ? sf.lastPost.title : '')}">${escapeHtml(sf.lastPost ? sf.lastPost.title : '')}</a>
            <div class="last-post-user">
              <i class="bi bi-chat-dots"></i>${escapeHtml(sf.lastPost ? sf.lastPost.user : '')}
              ${sf.lastPost && sf.lastPost.verified ? '<i class="bi bi-patch-check-fill verified"></i>' : ''}
            </div>
          </div>
        </div>
      </div>
    `
      )
      .join('');

    return `
      <section class="category" data-id="${cat.id}">
        <button class="category-header" type="button">
          <div class="category-icon"><i class="bi ${cat.icon}"></i></div>
          <div class="category-title">${escapeHtml(cat.title)}</div>
          <i class="bi bi-chevron-up category-toggle"></i>
        </button>
        <div class="category-body">
          ${cat.description ? `<div class="category-desc">${escapeHtml(cat.description)}</div>` : ''}
          ${subHtml}
        </div>
      </section>
    `;
  }

  function renderForum() {
    const container = document.getElementById('forumContent');
    if (!container) return;
    const html = [renderVipSection()]
      .concat((window.forumData || []).map(renderCategory))
      .join('');
    container.innerHTML = html;

    // Toggle handlers
    container.querySelectorAll('.category-header').forEach((btn) => {
      btn.addEventListener('click', () => {
        btn.closest('.category').classList.toggle('collapsed');
      });
    });

    // Link click handlers (mock interaction)
    container.querySelectorAll('a[href="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const txt = (link.textContent || '').trim().slice(0, 60);
        showToast('Bilgi', 'L\u00fctfen \u00fcye giri\u015fi yap\u0131n\u0131z. ' + (txt ? '(\u201c' + txt + '\u201d)' : ''));
      });
    });
  }

  renderForum();

  // ====== Login form ======
  const loginForm = document.getElementById('loginForm');
  loginForm && loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(loginForm);
    const username = (fd.get('username') || '').toString().trim();
    const password = (fd.get('password') || '').toString();
    const remember = !!fd.get('remember');
    if (!username || !password) {
      showToast('Hata', 'L\u00fctfen kullan\u0131c\u0131 ad\u0131 ve \u015fifre giriniz.');
      return;
    }
    if (remember) {
      try { localStorage.setItem('m2sef_user', JSON.stringify({ username })); } catch (_) {}
    }
    showToast('Giri\u015f ba\u015far\u0131l\u0131', 'Ho\u015fgeldin, ' + username + '!');
    loginForm.reset();
  });

  // ====== Register button ======
  const registerBtn = document.getElementById('registerBtn');
  registerBtn && registerBtn.addEventListener('click', () => {
    showToast('\u00dcye Ol', 'Kay\u0131t formu yak\u0131nda eklenecek. (Demo)');
  });

  // ====== Other nav clicks ======
  document.querySelectorAll('.main-nav .nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (link.getAttribute('href') === '#') {
        e.preventDefault();
        document.querySelectorAll('.main-nav .nav-link').forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
        showToast(link.textContent.trim(), 'Sayfa demo i\u00e7in haz\u0131rlan\u0131yor.');
      }
    });
  });

  // ====== Restore remembered user ======
  try {
    const saved = JSON.parse(localStorage.getItem('m2sef_user') || 'null');
    if (saved && saved.username) {
      const userInput = loginForm && loginForm.querySelector('input[name="username"]');
      if (userInput) userInput.value = saved.username;
    }
  } catch (_) {}
})();
