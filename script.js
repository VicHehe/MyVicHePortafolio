document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll('nav button');
  const pages   = document.querySelectorAll('.page');

  window.go = function(id) {
    pages.forEach(p => p.classList.toggle('active', p.id === id));
    buttons.forEach(b => b.classList.toggle('active', b.dataset.page === id));
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => window.go(btn.dataset.page));
  });

  // 🔑 Sube este número SOLO cuando cambies datos o imágenes.
  //    Así el navegador cachea todo y la web vuela.
  const CACHE_VERSION = '1.0.0';
  const v = `?v=${CACHE_VERSION}`;
  const fetchOpts = { cache: 'default' }; // deja que el navegador cachee

  const fallbackIcon = "https://api.iconify.design/lucide:globe.svg?color=%23c084fc";

  async function loadSocials() {
    try {
      const res = await fetch(`Datos/socials.json${v}`, fetchOpts);
      if (!res.ok) throw new Error();
      const socials = await res.json();

      // ✅ Una sola asignación de innerHTML (no += en bucle)
      document.getElementById('socials-container').innerHTML = socials.map(s => `
        <a href="${s.url}" target="_blank" rel="noopener">
          <img src="Datos/Imagenes/${s.icon}${v}"
               loading="lazy" decoding="async" width="24" height="24" alt="${s.name}"
               onerror="this.onerror=null;this.src='${fallbackIcon}';">
          ${s.name}
        </a>`).join('');
    } catch(e) {
      document.getElementById('socials-container').innerHTML =
        '<span class="empty-state">No hay enlaces.</span>';
    }
  }

  async function loadProjects() {
    try {
      const res = await fetch(`Datos/projects.json${v}`, fetchOpts);
      if (!res.ok) throw new Error();
      const projects = await res.json();

      document.getElementById('projects-container').innerHTML = projects.map(p => `
        <article class="project-card">
          <div class="project-thumb">
            <span class="type-badge">${p.type}</span>
            ${p.image
              ? `<img src="Datos/Imagenes/${p.image}${v}" loading="lazy" decoding="async" alt="${p.title}" onerror="this.style.display='none'">`
              : '<span style="font-size:30px;opacity:0.5;">🎮</span>'}
          </div>
          <div class="project-body">
            <h3 class="project-title">${p.title}</h3>
            <p class="project-desc">${p.description}</p>
            <div class="project-footer">
              ${p.link
                ? `<a href="${p.link}" target="_blank" rel="noopener" class="btn-project">Ver Proyecto <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>`
                : '<span style="color:var(--text-dim);font-size:12px;">Sin enlace</span>'}
            </div>
          </div>
        </article>`).join('');
    } catch(e) {
      document.getElementById('projects-container').innerHTML =
        '<span class="empty-state">No hay proyectos publicados aún.</span>';
    }
  }

  async function loadUpdates() {
    try {
      const res = await fetch(`Datos/updates.json${v}`, fetchOpts);
      if (!res.ok) throw new Error();
      const updates = await res.json();

      document.getElementById('updates-container').innerHTML = updates.map(u => `
        <div class="update-item">
          <div class="update-date">${u.date}</div>
          <div class="update-card">
            <h3>${u.title}</h3>
            <p>${u.description}</p>
            ${u.link ? `<a href="${u.link}" class="link" target="_blank" rel="noopener">Ver más →</a>` : ''}
          </div>
        </div>`).join('');

      document.getElementById('mini-feed-container').innerHTML = updates.slice(0, 3).map(u => `
        <div class="mini-item">
          <span><span class="tag">${u.tag || 'Info'}</span> &nbsp;${u.title}</span>
          <span style="color:var(--text-dim);font-size:11px;white-space:nowrap;">${u.date}</span>
        </div>`).join('');
    } catch(e) {
      document.getElementById('updates-container').innerHTML =
        '<span class="empty-state">No hay actualizaciones publicadas aún.</span>';
      document.getElementById('mini-feed-container').innerHTML =
        '<span class="empty-state">No hay novedades.</span>';
    }
  }

  // ⚡ Carga en PARALELO (antes era secuencial → 3x más lento)
  loadSocials();
  loadProjects();
  loadUpdates();
});
