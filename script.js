document.addEventListener('DOMContentLoaded', function () {
  // year
  document.getElementById('ano').textContent = new Date().getFullYear();

  // project modal
  const projectButtons = document.querySelectorAll('.project-open');
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalTech = document.getElementById('modalTech');
  const modalDesc = document.getElementById('modalDesc');
  const modalRepo = document.getElementById('modalRepo');
  const modalClose = modal.querySelectorAll('.modal-close, #modalCloseBtn');

  projectButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      if (!card) return;
      const title = card.dataset.title || card.querySelector('h4').textContent;
      const tech = card.dataset.tech || '';
      const desc = card.dataset.desc || card.querySelector('.muted').textContent || '';

      modalTitle.textContent = title;
      modalTech.textContent = tech;
      modalDesc.textContent = desc;
      modalRepo.href = '#'; // update if you have repo link
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  modalClose.forEach(btn => btn.addEventListener('click', () => {
    modal.setAttribute('aria-hidden', 'true');
  }));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.setAttribute('aria-hidden', 'true');
  });

  // smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // contact form -> mailto
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();
    const subject = encodeURIComponent(`Contato pelo portfólio: ${nome}`);
    const body = encodeURIComponent(`Nome: ${nome}\nEmail: ${email}\n\n${mensagem}`);
    window.location.href = `mailto:seu.email@exemplo.com?subject=${subject}&body=${body}`;
  });

  // mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  menuToggle.addEventListener('click', () => {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    nav.style.flexDirection = 'column';
    nav.style.position = 'absolute';
    nav.style.right = '20px';
    nav.style.top = '64px';
    nav.style.background = 'rgba(13,21,34,0.95)';
    nav.style.padding = '12px';
    nav.style.borderRadius = '8px';
    nav.style.boxShadow = '0 8px 24px rgba(0,0,0,0.6)';
  });

  // Avatar initials fallback
  const avatar = document.getElementById('avatar');
  if (avatar) {
    const img = avatar.querySelector('img');
    const initials = avatar.querySelector('.initials');
    if (img && img.complete && img.naturalWidth === 0) {
      img.style.display = 'none';
      initials.style.display = 'flex';
    }
    if (!img) initials.style.display = 'flex';
  }

  // Tentar carregar foto de perfil real (nomes comuns).
  // Como usar: copie sua imagem para a pasta do projeto (recomendo `assets/`) com um dos nomes abaixo.
  function tryLoadProfileImages() {
    const candidates = [
      'foto.jpg','foto.png','foto.webp',
      'assets/foto.jpg','assets/foto.png','assets/foto.webp',
      'assets/profile.jpg','assets/profile.png','assets/profile.webp',
      'assets/avatar.jpg','assets/avatar.png','assets/avatar.webp',
      'assets/Screenshot_1.png','assets/Screenshot_1.jpg'
    ];

    const headerImg = document.querySelector('.avatar img');
    const largeImg = document.querySelector('.avatar-large img');
    const targets = [headerImg, largeImg].filter(Boolean);
    if (!targets.length) return;

    (function tryNext(i){
      if (i >= candidates.length) return;
      const candidate = candidates[i];
      const tester = new Image();
      tester.onload = function() {
        targets.forEach(img => {
          img.src = candidate;
          img.style.display = 'block';
        });
      };
      tester.onerror = function() { tryNext(i+1); };
      tester.src = candidate;
    })(0);
  }

  tryLoadProfileImages();

  // Substituir thumbnails SVG por fotos reais se existirem
  // Para usar, coloque arquivos com os nomes:
  // assets/agendamento.webp|.jpg|.png  e assets/prunmo.webp|.jpg|.png
  function tryReplaceProjectImages() {
    const imgs = document.querySelectorAll('.project-thumb img[data-base]');
    if (!imgs.length) return;
    const exts = ['.webp', '.jpg', '.jpeg', '.png'];
    imgs.forEach(img => {
      const base = img.dataset.base;
      if (!base) return;
      // try each extension in order until one loads
      (function tryNext(i){
        if (i >= exts.length) return; // none found
        const candidate = base + exts[i];
        const tester = new Image();
        tester.onload = function() { img.src = candidate; };
        tester.onerror = function() { tryNext(i+1); };
        // start load
        tester.src = candidate;
      })(0);
    });
  }

  tryReplaceProjectImages();
});
