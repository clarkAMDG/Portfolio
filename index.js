const container = document.querySelector(".container");

function renderNavbar({ logo, links }) {
  document.querySelector("#navbar").innerHTML = `
    <nav class="navbar__container" aria-label="Main navigation">
      <a href="${logo.link}" class="navbar__logo">
        <i class="${logo.icon}" aria-hidden="true"></i> ${logo.text}
      </a>
      <ul class="navbar__menu" id="navigation-links">
        ${links.map(({ text, url }) => `
          <li class="navbar__item"><a class="navbar__links" href="${url}">${text}</a></li>
        `).join("")}
      </ul>
      <button type="button" id="mobile-menu" class="navbar__toggle"
        aria-label="Toggle navigation" aria-expanded="false" aria-controls="navigation-links">
        <span class="bar"></span><span class="bar"></span><span class="bar"></span>
      </button>
    </nav>`;

  const toggle = document.querySelector("#mobile-menu");
  const linksMenu = document.querySelector("#navigation-links");
  toggle.addEventListener("click", () => {
    const expanded = linksMenu.classList.toggle("active");
    toggle.classList.toggle("is-active", expanded);
    toggle.setAttribute("aria-expanded", String(expanded));
  });
}

function renderList(items) {
  return items.map(({ title, detail, note }) => `
    <div class="news-item">
      <strong>${title}</strong>
      <p>${detail}</p>
      ${note ? `<p>${note}</p>` : ""}
    </div>`).join("");
}

function renderProjectItem(project) {
  return `
    <a class="project-item" href="index.html?project=${project.id}">
      <h3>${project.title}</h3>
      <p class="details-text">View project</p>
      <p class="project-desc">${project.shortDescription}</p>
    </a>`;
}

function renderHome({ about, projects, highlights }) {
  return `
    <section class="about" id="about">
      <div class="bio">
        <div class="top-row">
          <div class="bio-header">
            <h1>${about.name}</h1>
            <h2>${about.title}</h2>
          </div>
          <div class="contact-info">
            <p><a href="mailto:${about.email}">${about.email}</a> <i class="fas fa-envelope" aria-hidden="true"></i></p>
            <p><a href="${about.linkedin}">LinkedIn</a> <i class="fab fa-linkedin" aria-hidden="true"></i></p>
          </div>
        </div>
        <div class="bio-details"><p>${about.bio}</p></div>
      </div>
    </section>
    <div class="projects-news-container">
      <section class="projects-box">
        <h2>Featured Projects</h2>
        <div class="projects-grid">${projects.slice(0, 3).map(renderProjectItem).join("")}</div>
      </section>
      <section class="news-box" id="news">
        <h2>Education & Credentials</h2>
        ${renderList(highlights)}
      </section>
    </div>`;
}

function renderSection(title, cards) {
  return `
    <section class="services">
      <h1>${title}</h1>
      <div class="services__container">${cards}</div>
    </section>`;
}

function renderExperience({ experience, activities }) {
  return renderSection("Experience", experience.map((job) => `
    <article class="services__card">
      <h2>${job.organization}</h2>
      <p><strong>${job.title}</strong><br />${job.dates}</p>
      ${job.details.map((detail) => `<p>${detail}</p>`).join("")}
    </article>`).join("")) + `
    <section class="extra-content">
      <h2>Leadership & Activities</h2>
      ${renderList(activities)}
    </section>`;
}

function renderProjects(projects) {
  return renderSection("Projects", projects.map((project) => `
    <article class="services__card">
      <h2><a class="project-back-link" href="index.html?project=${project.id}">${project.title}</a></h2>
      <p>${project.shortDescription}</p>
    </article>`).join(""));
}

function renderProject(project) {
  return `
    <section class="project-detail">
      <div class="project-content">
        <h1>${project.title}</h1>
        <p>${project.fullDescription}</p>
        <p class="project-technologies">${project.technologies}</p>
        <div class="project-actions">
          <a class="project-back-link" href="index.html?page=projects">All projects</a>
          ${project.link ? `<a class="project-report-link" href="${project.link}">Open CyberSlayers</a>` : ""}
        </div>
      </div>
    </section>`;
}

function renderReadingList({ recent, favorites }) {
  const renderBooks = (books) => books.map(({ title, author, category }) => `
    <article class="services__card">
      <h2>${title}</h2>
      <p>${author}<br />${category}</p>
    </article>`).join("");
  return renderSection("Recent Reads", renderBooks(recent))
    + renderSection("Favorites", renderBooks(favorites));
}

async function loadPortfolio() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    renderNavbar(data.navbar);

    const params = new URLSearchParams(window.location.search);
    const project = data.projects.find(({ id }) => id === params.get("project"));
    const page = params.get("page");
    const pages = {
      experience: () => renderExperience(data),
      projects: () => renderProjects(data.projects),
      publications: () => `<section class="extra-content"><h1>Publications</h1>${renderList(data.publications)}</section>`,
      "reading-list": () => renderReadingList(data.readingList),
    };

    if (project) {
      container.innerHTML = renderProject(project);
    } else {
      container.innerHTML = Object.hasOwn(pages, page) ? pages[page]() : renderHome(data);
    }
    if (window.location.hash === "#about" || window.location.hash === "#news") {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
    }
  } catch (error) {
    console.error("Error loading portfolio", error);
    container.textContent = "The portfolio could not load. Please refresh the page.";
  }
}

loadPortfolio();
