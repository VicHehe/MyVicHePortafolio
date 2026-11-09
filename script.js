document.addEventListener("DOMContentLoaded", () => {
  // --- Lógica de navegación (sin cambios) ---
  const buttons = document.querySelectorAll('nav button');
  const pages   = document.querySelectorAll('.page');

  window.go = function(id) {
    pages.forEach(p => p.classList.toggle('active', p.id === id));
    buttons.forEach(btn => btn.classList.toggle('active', btn.dataset.page === id));
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => window.go(btn.dataset.page));
  });

  // --- Diccionario de Iconos SVG ---
  const icons = {
    github: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`,
    itch: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h4m-2-2v4m6-1h.01M18 12h.01M18 8H6a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4v-4a4 4 0 0 0-4-4z"></path></svg>`,
    youtube: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`,
    twitter: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg>`,
    email: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
    web: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`
  };

  // --- Cargar Datos ---
  async function loadData() {
    try {
      // 1. Cargar Socials
      const socRes = await fetch('Datos/socials.json');
      if(socRes.ok) {
        const socials = await socRes.json();
        const socContainer = document.getElementById('socials-container');
        socContainer.innerHTML = '';
        socials.forEach(s => {
          const svg = icons[s.icon] || icons.web;
          socContainer.innerHTML += `
            <a href="${s.url}" target="_blank">
              ${svg} ${s.name}
            </a>`;
        });
      } else {
        document.getElementById('socials-container').innerHTML = '<span style="color:var(--text-dim);font-size:12px;">No hay enlaces.</span>';
      }
    } catch(e) { console.log("No socials yet"); }

    try {
      // 2. Cargar Proyectos
      const projRes = await fetch('Datos/projects.json');
      if(projRes.ok) {
        const projects = await projRes.json();
        const projContainer = document.getElementById('projects-container');
        projContainer.innerHTML = '';
        projects.forEach(p => {
          projContainer.innerHTML += `
            <article class="project-card">
              <div class="project-thumb">
                <span class="type-badge">${p.type}</span>
                ${p.image ? `<img src="Datos/Imagenes/${p.image}" style="width:100%;height:100%;object-fit:cover;">` : '[miniatura]'}
              </div>
              <div class="project-body">
                <h3>${p.title}</h3>
                <p>${p.description}</p>
                <div class="project-links">
                  ${p.link ? `<a href="${p.link}" target="_blank">Ver →</a>` : ''}
                </div>
              </div>
            </article>`;
        });
      } else {
        document.getElementById('projects-container').innerHTML = '<p style="color:var(--text-dim); font-size:12px;">No hay proyectos publicados aún.</p>';
      }
    } catch(e) { console.log("No projects yet"); }

    try {
      // 3. Cargar Actualizaciones (y cargar las 3 primeras en el Lobby)
      const updRes = await fetch('Datos/updates.json');
      if(updRes.ok) {
        const updates = await updRes.json();
        const updContainer = document.getElementById('updates-container');
        const miniFeed = document.getElementById('mini-feed-container');
        
        updContainer.innerHTML = '';
        miniFeed.innerHTML = '';
        
        updates.forEach((u, index) => {
          // Timeline principal
          updContainer.innerHTML += `
            <div class="update-item">
              <div class="update-date">${u.date}</div>
              <div class="update-card">
                <h3>${u.title}</h3>
                <p>${u.description}</p>
                ${u.link ? `<a href="${u.link}" class="link" target="_blank">Ver más →</a>` : ''}
              </div>
            </div>`;

          // Mini feed en el Lobby (solo las 3 primeras)
          if (index < 3) {
            miniFeed.innerHTML += `
              <div class="mini-item">
                <span><span class="tag">${u.tag || 'Info'}</span> &nbsp;${u.title}</span>
                <span style="color:var(--text-dim); font-size:11px; white-space:nowrap;">${u.date}</span>
              </div>`;
          }
        });
      } else {
        document.getElementById('updates-container').innerHTML = '<p style="color:var(--text-dim); font-size:12px;">No hay actualizaciones publicadas aún.</p>';
        document.getElementById('mini-feed-container').innerHTML = '<p style="color:var(--text-dim); font-size:12px;">No hay novedades.</p>';
      }
    } catch(e) { console.log("No updates yet"); }
  }

  loadData();
});
