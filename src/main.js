document.documentElement.classList.add('js');

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxClose = document.querySelector('.lightbox__close');
const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');

const closeMenu = () => {
  if (!menuToggle || !mainNav) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú');
  mainNav.hidden = true;
};

if (menuToggle && mainNav) {
  mainNav.hidden = true;

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
    mainNav.hidden = isOpen;
  });

  mainNav.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) closeMenu();
  });

  document.addEventListener('click', (event) => {
    if (
      menuToggle.getAttribute('aria-expanded') === 'true' &&
      event.target instanceof Node &&
      !mainNav.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });
}

if (lightbox && lightboxImage && lightboxClose instanceof HTMLButtonElement) {
  document.querySelectorAll('[data-lightbox]').forEach((button) => {
    button.addEventListener('click', () => {
      const source = button.getAttribute('data-lightbox');
      const image = button.querySelector('img');
      if (!source || !(image instanceof HTMLImageElement)) return;

      lightboxImage.src = source;
      lightboxImage.alt = image.alt;
      lightbox.showModal();
      lightboxClose.focus();
    });
  });

  lightboxClose.addEventListener('click', () => lightbox.close());

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  lightbox.addEventListener('close', () => {
    lightboxImage.removeAttribute('src');
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const revealElements = document.querySelectorAll('[data-reveal]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -36px 0px' },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

if (contactForm instanceof HTMLFormElement && formStatus) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);
    const name = String(formData.get('name') ?? '').trim();
    const phone = String(formData.get('phone') ?? '').trim();
    const interest = String(formData.get('interest') ?? '').trim();
    const message = String(formData.get('message') ?? '').trim();
    const lines = [
      `Hola, soy ${name}.`,
      `Mi teléfono es ${phone}.`,
      `Me interesa: ${interest}.`,
      message ? `Más detalles: ${message}` : '',
    ].filter(Boolean);
    const whatsappUrl = `https://wa.me/18295489049?text=${encodeURIComponent(lines.join('\n'))}`;

    const fallbackLink = document.createElement('a');
    fallbackLink.href = whatsappUrl;
    fallbackLink.target = '_blank';
    fallbackLink.rel = 'noopener noreferrer';
    fallbackLink.textContent = 'Abrir WhatsApp con el mensaje listo';

    formStatus.replaceChildren(
      document.createTextNode('Tu consulta está preparada. '),
      fallbackLink,
    );
    fallbackLink.click();
  });
}

const currentYear = document.querySelector('#current-year');
if (currentYear) currentYear.textContent = String(new Date().getFullYear());
