/* main.js — interactions, smooth scroll, form handling, accessibility */

document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu toggle
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('nav-menu');
  toggle.addEventListener('click', function () {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Smooth scroll for nav links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // close mobile menu
        if (menu.classList.contains('open')) {
          menu.classList.remove('open');
          toggle.setAttribute('aria-expanded','false');
        }
      }
    });
  });

  // Active section highlighting
  const sections = document.querySelectorAll('main section[id]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const navLink = document.querySelector(`.nav-menu a[href="#${id}"]`);
      if (entry.isIntersecting) {
        navLink && navLink.classList.add('active');
      } else {
        navLink && navLink.classList.remove('active');
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });
  sections.forEach(s => observer.observe(s));

  // Year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Contact form submission (Formspree) — Ajax
  const form = document.getElementById('contact-form');
  const note = document.getElementById('form-note');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const action = form.getAttribute('action');
    const data = new FormData(form);
    note.textContent = 'Sending message...';
    fetch(action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    }).then(response => {
      if (response.ok) {
        form.reset();
        note.textContent = 'Thanks — your message has been sent!';
      } else {
        response.json().then(data => {
          note.textContent = data?.error || 'Oops — unable to send. Try again later.';
        });
      }
    }).catch(() => {
      note.textContent = 'Network error. Please try again later.';
    });
  });

  // keyboard accessibility for hamburger
  toggle.addEventListener('keyup', (e) => { if (e.key === 'Enter') toggle.click(); });
});

// ===== Dark Mode Toggle =====
document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  // Save preference in localStorage
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

// Load theme preference on page load
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }
});




// Skills Tab Switching
document.querySelectorAll('.tab-btn').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(button.dataset.tab).classList.add('active');
  });
});
