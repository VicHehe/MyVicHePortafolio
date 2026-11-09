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

  // Icono por defecto en caso de que la imagen no cargue (un globo terráqueo)
  const defaultIcon = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23c084fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;

  async function loadData() {
    try {
      // 1. Cargar Socials
      const socRes = await fetch('Datos/socials.json');
      if(socRes.ok) {
        const socials = await socRes.json();
        const socContainer = document.getElementById('socials-container');
        socContainer.innerHTML = '';
        
        socials.forEach(s => {
          // Agregamos un onerror para que si la imagen falla, use el defaultIcon
          socContainer.innerHTML += `
            <a href="${s.url}" target="_blank">
              <img src="Datos/Imagenes/${s.icon}" 
                   onerror="this.onerror=null; this.src='${defaultIcon}'; console.warn('No se encontró la imagen: Datos/Imagenes/${s.icon}');"
                   style="width:24px; height:24px; object-fit:contain; margin-bottom: 2px;">
              ${s.name}
            </a>`;
        });
      } else {
        document.getElementById('socials-container').innerHTML = '<span class="empty-state">No hay enlaces.</span>';
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
        document.getElementById('projects-container').innerHTML = '<span class="empty-state">No hay proyectos publicados aún.</span>';
      }
    } catch(e) { console.log("No projects yet"); }

    try {
      // 3. Cargar Actualizaciones
      const updRes = await fetch('Datos/updates.json');
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
