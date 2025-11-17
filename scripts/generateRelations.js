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

    case "diagnostics":
      diagnosticsOptions();
      break;
  }
}

function introductionOptions() {}

function manualOptions() {
  const diagnosticsEnabled = localStorage.getItem(
    "diagnosticsEnabled".toString()
  );
  console.log(diagnosticsEnabled);
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

    // Add section for user preferences
    html += `<div class="pageOptionsPreferences">
              <h3>Preferences:</h3>
              <label>
                Show diagnostics: 
                <input type="checkbox" id="diagnosticsToggle" ${
                  diagnosticsEnabled === "true" ? "checked" : ""
                }>
              </label>
            </div>`;
    pageOptions.innerHTML = html;
    // Add events to the check boxes and check what settings should be applied
    diagnosticsToggle(diagnosticsEnabled);
    updateDiagDivs(diagnosticsEnabled);
  });
}

// Add listener to checkbox and update variable in localStorage
function diagnosticsToggle(enabled) {
  const checkbox = document.getElementById("diagnosticsToggle");

  checkbox.addEventListener("change", (e) => {
    const show = e.target.checked;
    updateDiagDivs(show.toString());
    localStorage.setItem("diagnosticsEnabled", show.toString());
  });
}

// Collapse or expand diagnostics divs depending on user preference
function updateDiagDivs(enabled, id) {
  console.log(enabled);
  let diagnostics;
  id ? diagnostics = document.getElementById(id) : diagnostics = document.querySelectorAll(".docDiagnosticsDiv");

  diagnostics.forEach((div) => {
    if (enabled === "true") {
      // expand the diagnostics box
      div.classList.add("diagnostics-visible");
      div.style.maxHeight = div.scrollHeight + "px";

      // When the transitioned is finished we remove maxHeight
      div.addEventListener("transitionend", function handler() {
        div.style.maxHeight = "none";
        div.removeEventListener("transitionend", handler);
      });
    } else {
      // collapse the diagnostics box
      if (div.style.maxHeight === "none") {
        div.style.maxHeight = div.scrollHeight + "px";
        div.offsetHeight;
      }

      div.style.maxHeight = "0px";
      div.classList.remove("diagnostics-visible");
    }
  });
}

function methodOptions() {
  let html = `   
    <input type="text" id="searchBar" class="searchBar" placeholder="Search Methods..." />
  `;

  html += `<ul id="letterTabs">`;
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i);
    const separator = i < 25 ? " /" : "";
    html += `<li class="letterTabsItem"><a href="#letter${letter}">${letter}</a>${separator}</li>`;
  }
  html += `</ul>`;

  pageOptions.innerHTML = html;
  const searchBar = document.getElementById("searchBar");
  searchBarFunctionality("Methods");
}

function detailsOptions() {
  pageOptions.style.display = "none";
}

function diagnosticsOptions() {
  pageOptions.innerHTML = `   
    <input type="text" id="searchBar" class="searchBar" placeholder="Search Diagnostics..." />
  `;
  const searchBar = document.getElementById("searchBar");
  searchBarFunctionality("Diagnostics");
}

function searchBarFunctionality(type) {
  searchBar.addEventListener("input", () => {
    let val = searchBar.value;
    if (!val) {
      window[`populate${type}`]();
    }
    if (val.length > 2) {
      window[`populate${type}`](val);
    }
  });
}
