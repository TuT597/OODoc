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
  pageOptions.innerHTML = ``;
  switch (pageType) {
    case "manual":
      manualOptions();
      break;

    case "methods":
      methodOptions();
      break;
  }
}

function introductionOptions() {}

function manualOptions() {
  let html = `
  
  `;
  pageOptions.innerHTML = html;
}

function methodOptions() {
  let html = `
    <div class="settingsMenu">
      
        <input type="text" id="methodsSearchBar" class="searchBar" placeholder="Search Methods..." />
     
    </div>
  `;

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

function detailOptions() {}

function diagnosticOptions() {}
