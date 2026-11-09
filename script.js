document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll('nav button');
  const pages   = document.querySelectorAll('.page');

  // Función global para que los botones del HTML puedan usarla
  window.go = function(id) {
    pages.forEach(p => p.classList.toggle('active', p.id === id));
    buttons.forEach(b => b.classList.toggle('active', b.dataset.page === id));
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => window.go(btn.dataset.page));
  });
});
