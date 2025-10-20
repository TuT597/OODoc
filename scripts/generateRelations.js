function generateRelations() {
  let content = `
  <div class="settingsMenu">
  <label class="switch">
    <input type="checkbox" id="themeSwitch">
    <span class="slider round"></span>
  </label>
  </div>
  `;

  generalOptions.innerHTML = content;
  themeButton();
}

function themeButton() {
  document.getElementById("themeSwitch").addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    applyTheme(next);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function updateRelations(pageType) {
  if (pageOptions.style.display == "none") {
    pageOptions.style.display = "grid";
  }
  pageOptions.innerHTML = ``;
  switch (pageType) {
    case "manual":
      manualOptions();
      break;

    case "methods":
      methodOptions();
      break;

    case "details":
      detailsOptions();
      break;
  }
}

function introductionOptions() {}

function manualOptions() {
  // Delay the DOM queries until the next frame so the page switch can complete
  requestAnimationFrame(() => {
    // Grab all the main divs making up the manual
    const docDivs = contentDiv.querySelectorAll(".docDiv");
    let html = `
    <h3>Contents</h3>
    <ul id="indexList">`;
    // Loop through them and look for all the Chapters then put them in the list
    for (const docDiv of docDivs) {
      const docChapters = docDiv.querySelectorAll(".docChapter");
      for (const chapter of docChapters) {
        html += `<li><a href="#${docDiv.attributes[0].nodeValue}">${chapter.textContent}</a></li>`;
        // Grab all the sections inside the current main div and if they exist generate a second nested list for these
        const sections = docDiv.querySelectorAll(".docSection");
        if (sections.length) {
          html += `<ul id="indexSubList">`;
          for (const section of sections) {
            const subDiv = section.parentElement;
            html += `<li><a href="#${subDiv.attributes[0].nodeValue}">${section.textContent}</a></li>`;
          }
          html += `</ul>`;
        }
      }
    }
    html += `</ul>`;
    pageOptions.innerHTML = html;
  });
}

function methodOptions() {
  let html = `   
        <input type="text" id="methodsSearchBar" class="searchBar" placeholder="Search Methods..." />
  `;

  html += `<ul id="letterTabs">`;
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i);
    const separator = i < 25 ? " /" : "";
    html += `<li class="letterTabsItem"><a href="#letter${letter}">${letter}</a>${separator}</li>`;
  }
  html += `</ul>`;

  pageOptions.innerHTML = html;
  const methodsSearchBar = document.getElementById("methodsSearchBar");
  searchBar();
}

function searchBar() {
  methodsSearchBar.addEventListener("input", () => {
    let val = methodsSearchBar.value;
    if (!val) {
      populateMethods();
    }
    if (val.length > 2) {
      populateMethods(val);
    }
  });
}

function detailsOptions() {
  pageOptions.style.display = "none";
}

function diagnosticOptions() {}
