function generateRelations() {
  let content = `
  <div class="settingsMenu">
  <label class="switch">
    <input type="checkbox" id="themeSwitch"`;

  localStorage.getItem("theme") === "light"
    ? (content += `checked>
    <span class="slider round">
    <i id="themeIcon" class="fa-solid fa-sun"></i>`)
    : (content += `>
    <span class="slider round">
    <i id="themeIcon" class="fa-solid fa-moon"></i>`);

  content += `</span>
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

    const icon = document.getElementById("themeIcon");
    if (icon.classList.contains("fa-sun")) {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
    } else {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    }
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function updateRelations(pageType, parameter) {
  if (pageOptions.style.display == "none") {
    pageOptions.style.display = "grid";
  }
  pageOptions.innerHTML = ``;
  switch (pageType) {
    case "manual":
      manualOptions(parameter);
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

// #region Manual
function manualOptions(manualID) {
  const currentManual = getDocFrag(manualID);
  const manualName = currentManual.name;
  const manualDistribution = currentManual.distribution;

  const enabledState = {
    diagnostics: localStorage.getItem("diagnosticsEnabled"),
    examples: localStorage.getItem("examplesEnabled"),
  };

  // Delay the DOM queries until the next frame so the page switch can complete
  requestAnimationFrame(() => {
    // Add section for user preferences
    let html = `
    <div class="pageOptionsPreferences">
      <span id="currentPageDisplay">
        <h4>Current manual:</h4>
        <label id="currentPageManual">${manualName}</label>
        <label id="currentPageDistro">${manualDistribution}</label>
      </span>
      <div id="preferencesDiv">
        <h3>Preferences:</h3>
        <label>
        <input type="checkbox" id="diagnosticsToggle" class="toggleButton" data-toggle-type="diagnostics" ${
          enabledState["diagnostics"] === "true" ? "checked" : ""
        }>
          Show diagnostics
        </label>
        <label>
        <input type="checkbox" id="examplesToggle" class="toggleButton" data-toggle-type="examples" ${
          enabledState["examples"] === "true" ? "checked" : ""
        }>
          Show examples
        </label>
      </div>
    </div>`;

    // Grab all the main divs making up the manual
    const chapterDivs = contentDiv.querySelectorAll(".chapterDiv");
    html += `
    <div id="manualContentTree">
    <h3>Contents:</h3>
    <ul id="indexList">`;
    // Loop through them and look for all the Chapters then put them in the list
    for (const chapterDiv of chapterDivs) {
      const chapterHeaders = chapterDiv.querySelectorAll(".chapterHeader");
      for (const chapter of chapterHeaders) {
        html += `<li><a class="jump" href="${chapterDiv.attributes[0].nodeValue}">${chapter.textContent}</a></li>`;
        // Grab all the sections inside the current main div and if they exist generate a second nested list for these
        const sections = chapterDiv.querySelectorAll(".sectionHeader");
        if (sections.length) {
          html += `<ul id="indexSubList">`;
          for (const section of sections) {
            const sectionDiv = section.parentElement;
            html += `<li><a href="${sectionDiv.attributes[0].nodeValue}">${section.textContent}</a></li>`;
          }
          html += `</ul>`;
        }
      }
    }
    html += `</ul></div>`;

    // Add section for methods
    const currentManual = Object.entries(indexLinks).find(
      ([key, valueArray]) =>
        valueArray[0] === document.querySelector(".docHead").id
    );

    let currentMethods = [];
    for (const id of currentManual[1][1]) {
      item = getDocFrag(id);
      if (item.type && item.type.includes("method")) {
        currentMethods.push(item);
      }
    }

    sortMethods(currentMethods);

    html += `
    <div id="pageOptionsMethods">
      <h3>Methods:</h3>
      <div id="pageOptionsMethodsList">`;

    for (const method of currentMethods) {
      html += `<label><a href="#${method.id}">${method.name}</a></label>`;
    }

    html += `</div></div>`;

    pageOptions.innerHTML = html;

    foldoutFunctionality();
    constructNavigation();
  });
}

// No longer need to hard code the function calls. If you add more toggles in the future they will be automatically made functional.
function foldoutFunctionality() {
  const togglesDiv = document.getElementById("preferencesDiv");
  const toggleButtons = togglesDiv.querySelectorAll(".toggleButton");

  toggleButtons.forEach((btn) => {
    const type = `${btn.getAttribute("data-toggle-type")}`;
    foldoutToggle(type);
    updateFoldouts(localStorage.getItem(`${type}Enabled`), "", type);
    attachFoldoutButtons(type);
  });
}

function foldoutToggle(type) {
  const checkbox = document.getElementById(`${type}Toggle`);

  checkbox.addEventListener("change", (e) => {
    const show = e.target.checked;
    updateFoldouts(show.toString(), "", type);
    localStorage.setItem(`${type}Enabled`, show.toString());

    document.querySelectorAll(`.${type}Button`).forEach((btn) => {
      const foldoutDiv = btn.parentElement.parentElement;
      const displayed = checkFoldoutStatus(foldoutDiv, type);

      if (displayed && show) {
        btn.style.transform = "rotate(-45deg)";
      } else if (!displayed && !show) {
        btn.style.transform = "rotate(0deg)";
      }
    });
  });
}

// Collapse or expand diagnostics divs depending on user preference
function updateFoldouts(enabled, id, type) {
  let foldouts = [];
  id
    ? (foldouts = document
        .getElementById(id)
        .querySelectorAll(
          `.manual${
            type.charAt(0).toUpperCase() + type.slice(1, type.length - 1)
          }Div`
        ))
    : (foldouts = document.querySelectorAll(
        `.manual${
          type.charAt(0).toUpperCase() + type.slice(1, type.length - 1)
        }Div`
      ));

  foldouts.forEach((div) => {
    if (enabled === "true") {
      // expand the diagnostics box
      if (!div.classList.contains("visible")) {
        div.classList.add("visible");
        div.style.maxHeight = div.scrollHeight + "px";
      }
    } else {
      // collapse the diagnostics box
      if (div.style.maxHeight === "none") {
        div.style.maxHeight = div.scrollHeight + "px";
        div.offsetHeight;
      }

      div.style.maxHeight = "0px";
      div.classList.remove("visible");
    }
  });
}
// #endregion Manual

// #region Methods
function methodOptions() {
  let html = `
    <h2>Diagnostics</h2>
    <input type="text" id="searchBar" class="searchBar" placeholder="Search Methods..." />
    <label class="methodsSwitch">
      <input id="methodsSortingSwitch" type="checkbox">
      <span class="methodsSlider"></span>
      <span id="methodSliderText">
        <span>By Letter</span>
        <span>By Manual</span>
      </span>
    </label>
  `;

  let htmlLetterTabs = `<ul id="letterTabs">`;
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i);
    const separator = i < 25 ? " /" : "";
    htmlLetterTabs += `<li class="letterTabsItem"><a href="#letter${letter}">${letter}</a>${separator}</li>`;
  }
  htmlLetterTabs += `</ul>`;

  html += htmlLetterTabs;

  pageOptions.innerHTML = html;

  const methodsSwitch = document.getElementById("methodsSortingSwitch");
  methodsSwitch.addEventListener("change", () => {
    sortingFunctionality("Methods", methodsSwitch.checked, htmlLetterTabs);
  });
  searchBarFunctionality("Methods");
}
// #endregion Methods

// #region Details
function detailsOptions() {
  pageOptions.style.display = "none";
}
// #endregion Details

// #region Diagnostics
function diagnosticsOptions() {
  let html = `
    <h2>Diagnostics</h2>
    <input type="text" id="searchBar" class="searchBar" placeholder="Search Diagnostics..." />
    <label class="methodsSwitch">
      <input id="methodsSortingSwitch" type="checkbox">
      <span class="methodsSlider"></span>
      <span id="methodSliderText">
        <span>By Type</span>
        <span>By Manual</span>
      </span>
    </label>
  `;

  const diagnosticTypes = getDiagnosticTypes(getSortedDiagnostics()).sort();
  let htmlTypeTabs = `<ul id="typeTabs">`;
  for (const type of diagnosticTypes) {
    htmlTypeTabs += `<li><a href="#${type}">${type.toUpperCase()}</a></li>`;
  }
  htmlTypeTabs += `</ul>`;

  html += htmlTypeTabs;

  pageOptions.innerHTML = html;

  const methodsSwitch = document.getElementById("methodsSortingSwitch");
  methodsSwitch.addEventListener("change", () => {
    sortingFunctionality("Diagnostics", methodsSwitch.checked, htmlTypeTabs);
  });
  searchBarFunctionality("Diagnostics");
}
// #endregion Diagnostics

// #region Utility
function searchBarFunctionality(type) {
  const methodSwitch = document.getElementById("methodsSortingSwitch");
  const searchBar = document.getElementById("searchBar");
  searchBar.addEventListener("input", () => {
    let sortMethod = methodSwitch.checked ? "manual" : "letter";
    let val = searchBar.value;
    if (!val) {
      window[`populate${type}`]("", sortMethod);
    }
    if (val.length > 2) {
      window[`populate${type}`](val, sortMethod);
    }
  });
}

function sortingFunctionality(pageType, checked, html) {
  if (!checked) {
    window[`populate${pageType}`]("", "letter");
    document
      .querySelectorAll("#methodsManualListDiv")
      .forEach((tab) => tab.remove());

    if (pageType === "Methods") {
      // create new lettertabs
      const temp = document.createElement("div");
      temp.innerHTML = html;
      const newLetterTabs = temp.firstElementChild;
      pageOptions.appendChild(newLetterTabs);
    }

    if (pageType === "Diagnostics") {
      // create new type tabs
      const temp = document.createElement("div");
      temp.innerHTML = html;
      const newTypeTabs = temp.firstElementChild;
      pageOptions.appendChild(newTypeTabs);
    }

    // Reattach navigation
    constructNavigation();
  }

  if (checked) {
    window[`populate${pageType}`]("", "manual");
    if (pageType === "Methods") {
      document.querySelectorAll("#letterTabs").forEach((tab) => tab.remove());
    }

    if (pageType === "Details") {
      // remove type tabs here
    }

    // Create the manual list
    const temp = document.createElement("div");
    let html = `<div id="methodsManualListDiv"><ul id="methodsManualList">`;

    const items = window[`getSorted${pageType}`]();
    const manuals = getUniqueManuals(items);
    for (const manual of manuals) {
      html += `<li class="methodsManualListItem"><a href="#${manual[1]}">${manual[0]}</a></li>`;
    }

    html += `</ul></div>`;

    temp.innerHTML = html;
    const manualList = temp.firstElementChild;
    pageOptions.appendChild(manualList);

    constructNavigation();
  }
}

// #endregion Utility
