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

  const fallbackIcon = "https://api.iconify.design/lucide:globe.svg?color=%23c084fc";

  async function loadData() {
    const noCache = `?v=${new Date().getTime()}`;

    try {
      // 1. Cargar Socials
      const socRes = await fetch('Datos/socials.json' + noCache);
      if(socRes.ok) {
        const socials = await socRes.json();
        const socContainer = document.getElementById('socials-container');
        socContainer.innerHTML = '';
        
        socials.forEach(s => {
          socContainer.innerHTML += `
            <a href="${s.url}" target="_blank">
              <img src="Datos/Imagenes/${s.icon}${noCache}" 
                   onerror="this.onerror=null; this.src='${fallbackIcon}';"
                   style="width:24px; height:24px; object-fit:contain; margin-bottom: 4px;">
              ${s.name}
            </a>`;
        });
      } else {
        document.getElementById('socials-container').innerHTML = '<span class="empty-state">No hay enlaces.</span>';
      }
    } catch(e) { console.log("No socials yet"); }

    try {
      // 2. Cargar Proyectos (NUEVO DISEÑO TIPO POST)
      const projRes = await fetch('Datos/projects.json' + noCache);
      if(projRes.ok) {
        const projects = await projRes.json();
        const projContainer = document.getElementById('projects-container');
        projContainer.innerHTML = '';
        projects.forEach(p => {
          projContainer.innerHTML += `
            <article class="project-card">
              <div class="project-thumb">
                <span class="type-badge">${p.type}</span>
                ${p.image ? `<img src="Datos/Imagenes/${p.image}${noCache}" onerror="this.style.display='none'">` : '<span style="font-size:30px; opacity:0.5;">🎮</span>'}
              </div>
              <div class="project-body">
                <h3 class="project-title">${p.title}</h3>
                <p class="project-desc">${p.description}</p>
                <div class="project-footer">
                  ${p.link ? `<a href="${p.link}" target="_blank" class="btn-project">Ver Proyecto <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>` : '<span style="color:var(--text-dim); font-size:12px;">Sin enlace</span>'}
                </div>
              </div>
            </article>`;
        });
      } else {
        document.getElementById('projects-container').innerHTML = '<span class="empty-state">No hay proyectos publicados aún.</span>';
      }
    } catch(e) { console.log("No projects yet"); }

    try {
      // 3. Cargar Actualizaciones
      const updRes = await fetch('Datos/updates.json' + noCache);
      if(updRes.ok) {
        const updates = await updRes.json();
        const updContainer = document.getElementById('updates-container');
        const miniFeed = document.getElementById('mini-feed-container');
        
        updContainer.innerHTML = '';
        miniFeed.innerHTML = '';
        
        updates.forEach((u, index) => {
          updContainer.innerHTML += `
            <div class="update-item">
              <div class="update-date">${u.date}</div>
              <div class="update-card">
                <h3>${u.title}</h3>
                <p>${u.description}</p>
                ${u.link ? `<a href="${u.link}" class="link" target="_blank">Ver más →</a>` : ''}
              </div>
            </div>`;

          if (index < 3) {
            miniFeed.innerHTML += `
              <div class="mini-item">
                <span><span class="tag">${u.tag || 'Info'}</span> &nbsp;${u.title}</span>
                <span style="color:var(--text-dim); font-size:11px; white-space:nowrap;">${u.date}</span>
              </div>`;
          }
        });
      } else {
        document.getElementById('updates-container').innerHTML = '<span class="empty-state">No hay actualizaciones publicadas aún.</span>';
        document.getElementById('mini-feed-container').innerHTML = '<span class="empty-state">No hay novedades.</span>';
      }
    } catch(e) { console.log("No updates yet"); }
  }

  loadData();
});
