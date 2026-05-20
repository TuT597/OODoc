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

  content += `</span></label></div>`;

  generalOptions.innerHTML = content;
  themeButton();
  addFooter();
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
    pageOptions.style.display = "flex";
  }
  pageOptions.innerHTML = ``;
  document.getElementById("preferencesDiv")?.remove();
  switch (pageType) {
    case "manual":
      manualOptions(parameter);
      localStorage.setItem("pageType", "manual");
      break;

    case "methods":
      methodOptions();
      localStorage.setItem("pageType", "methods");
      break;

    case "details":
      detailsOptions();
      localStorage.setItem("pageType", "details");
      break;

    case "diagnostics":
      diagnosticsOptions();
      localStorage.setItem("pageType", "diagnostics");
      break;
  }
}

function introductionOptions() {}

// #region Manual
function manualOptions(manualID) {
  const currentManual = getDocFrag(manualID);
  const manualName = currentManual.name;
  const manualDistribution = currentManual.distribution;
  const distributionVersion = currentManual.version;

  const enabledState = {
    diagnostics: localStorage.getItem("diagnosticsEnabled"),
    examples: localStorage.getItem("examplesEnabled"),
  };

  // Delay the DOM queries until the next frame so the page switch can complete
  requestAnimationFrame(() => {
    // Add section for user preferences in the general options
    if (localStorage.getItem("pageType") === "manual") {
      let expandToggles = `
            <label>
              <input type="checkbox" id="diagnosticsToggle" class="toggleButton" data-toggle-type="diagnostics" 
              ${enabledState["diagnostics"] === "true" ? "checked" : ""}>
                Show diagnostics
            </label>
            <label>
              <input type="checkbox" id="examplesToggle" class="toggleButton" data-toggle-type="examples" 
              ${enabledState["examples"] === "true" ? "checked" : ""}>
                Show examples
            </label>`;

      const temp = document.createElement("div");

      temp.innerHTML = expandToggles;
      temp.id = "preferencesDiv";
      generalOptions.insertBefore(temp, generalOptions.firstChild);
    }

    let html = `
    <div id="currentPageData">
      <span id="currentPageDisplay">
        <label id="currentPageManual">${manualName}</label>
        <label id="currentPageDistro">${manualDistribution} v${distributionVersion}</label>
      </span>`;

    // Generate an index tree for quick manual navigation
    const chapterDivs = contentDiv.querySelectorAll(".chapterDiv");
    html += `
    <div id="manualContentTree">
    <div id="indexListDiv">`;
    // Chapters
    for (const chapterDiv of chapterDivs) {
      const chapterHeaders = chapterDiv.querySelectorAll(".chapterHeader");
      for (const chapter of chapterHeaders) {
        html += `<div class="indexListChapter" list-displayed="false"><label class="indexListLabel"><a href="#${chapterDiv.attributes[0].nodeValue}">
        ${chapter.textContent}</a>`;

        // Sections
        const sections = chapterDiv.querySelectorAll(".sectionHeader");
        if (!sections.length) {
          html += `</label></div><hr class="indexDivider"/>`;
        } else {
          // Set up a key generator for button -> list linking
          const key = chapter.textContent.trim().replace(/\s+/g, "_");
          html += `
          <button id="${key}_btn" class="indexListButton" data-open="false" data-target="${key}_list"><i class="fa-solid fa-chevron-left"></i></button></label>
          <div id="${key}_list" class="indexListSections manualIndexList">`;
          for (const section of sections) {
            const sectionDiv = section.parentElement;
            html += `<div class="indexListSection"><label class="indexListLabel"><a href="#${sectionDiv.attributes[0].nodeValue}">
            ${section.textContent}</a>`;

            // SubSections
            const subSections =
              sectionDiv.querySelectorAll(".subsectionHeader");
            if (!subSections.length) {
              html += `</label></div>`;
            } else {
              const key = section.textContent.trim().replace(/\s+/g, "_");
              html += `
              </label>
              <div id="" class="indexListSubs manualIndexList">`;
              for (const subSection of subSections) {
                const subSectionDiv = subSection.parentElement;
                html += `<div class="indexListSub"><a href="#${subSectionDiv.attributes[0].nodeValue}">${subSection.textContent}</a></div>`;
              }
              html += `</div></div>`;
            }
          }
          html += `</div></div><hr class="indexDivider"/>`;
        }
      }
    }
    html += `</div></div>`;

    // Add section for methods
    const currentManual = Object.entries(indexLinks).find(
      ([key, valueArray]) =>
        valueArray[0] === document.querySelector(".docHead").id,
    );

    console.log(currentManual);

    let currentMethods = [];
    for (const id of currentManual[1][1]) {
      item = getDocFrag(id);
      if (item.type && item.type.includes("method")) {
        currentMethods.push(item);
      }
    }

    sortItems(currentMethods);

    html += `
    <div id="pageOptionsMethods">
      <div id="pageOptionsMethodsBar">
        <h3>Methods</h3>
      </div>
    <div id="pageOptionsMethodsList">`;

    for (const method of currentMethods) {
      html += `<label><a href="#${method.id}">${method.name}</a></label>`;
    }

    html += `</div></div></div>`;

    pageOptions.innerHTML = html;

    document.querySelectorAll(".indexListButton").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-target");
        const list = document.getElementById(target);

        if (list) {
          const chapter = btn.parentElement.parentElement;
          chapter.setAttribute(
            "list-displayed",
            chapter.getAttribute("list-displayed") === "false"
              ? "true"
              : "false",
          );
          const isOpen = btn.getAttribute("data-open") === "true";
          btn.setAttribute("data-open", !isOpen);
          list.style.height = isOpen ? "0px" : list.scrollHeight + "px";
        }
      });
    });

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
          }Div`,
        ))
    : (foldouts = document.querySelectorAll(
        `.manual${
          type.charAt(0).toUpperCase() + type.slice(1, type.length - 1)
        }Div`,
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
    <span id="currentPageDisplay">
        <label id="currentPageManual">Methods</label>
    </span>

    <div id="relationsSearch">
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

  let htmlLetterTabs = `<ul id="letterTabs" class="tabList">`;
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i);
    const separator = i < 25 ? " /" : "";
    htmlLetterTabs += `<li class="letterTabsItem"><a href="#${letter}">${letter}</a>${separator}</li>`;
  }
  htmlLetterTabs += `</ul>`;

  html += htmlLetterTabs;
  html += `</div>`;

  pageOptions.innerHTML = html;

  const methodsSwitch = document.getElementById("methodsSortingSwitch");
  methodsSwitch.addEventListener("change", () => {
    sortingFunctionality("Methods", methodsSwitch.checked, htmlLetterTabs);
  });
  searchBarFunctionality("Methods");
}
// #endregion Methods

// #region Details
function detailsOptions() {}
// #endregion Details

// #region Diagnostics
function diagnosticsOptions() {
  let html = `
    <span id="currentPageDisplay">
        <label id="currentPageManual">Diagnostics</label>
    </span>

    <div id="relationsSearch">
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

  const diagnosticTypes = getItemTypes(getData("", "diagnostics")).sort();
  let htmlTypeTabs = `<ul id="typeTabs" class="tabList">`;
  for (const type of diagnosticTypes) {
    htmlTypeTabs += `<li><a href="#${type}">${type.toUpperCase()}</a></li>`;
  }
  htmlTypeTabs += `</ul>`;

  html += htmlTypeTabs;
  html += `</div>`;

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
      populatePage("", sortMethod, type.toLowerCase());
    }
    if (val.length > 2) {
      populatePage(val, sortMethod, type.toLowerCase());
    }
  });
}

function sortingFunctionality(pageType, checked, html) {
  const relationsSearch = document.getElementById("relationsSearch");
  if (!checked) {
    populatePage("", "letter", pageType.toLowerCase());
    document
      .querySelectorAll("#methodsManualListDiv")
      .forEach((tab) => tab.remove());
    if (pageType === "Methods") {
      // create new lettertabs
      const temp = document.createElement("div");
      temp.innerHTML = html;
      const newLetterTabs = temp.firstElementChild;
      relationsSearch.appendChild(newLetterTabs);
    }

    if (pageType === "Diagnostics") {
      // create new type tabs
      const temp = document.createElement("div");
      temp.innerHTML = html;
      const newTypeTabs = temp.firstElementChild;
      relationsSearch.appendChild(newTypeTabs);
    }

    // Reattach navigation
    constructNavigation();
  }

  if (checked) {
    populatePage("", "manual", pageType.toLowerCase());
    if (pageType === "Methods") {
      document.querySelectorAll("#letterTabs").forEach((tab) => tab.remove());
    }

    if (pageType === "Diagnostics") {
      document.querySelectorAll("#typeTabs").forEach((tab) => tab.remove());
    }

    // Create the manual list
    const temp = document.createElement("div");
    let html = `<div id="methodsManualListDiv"><ul id="methodsManualList">`;

    const items = getData("", pageType.toLowerCase());
    const manuals = getUniqueManuals(items);
    for (const manual of manuals) {
      html += `<li class="methodsManualListItem"><a href="#${manual[1]}">${manual[0]}</a></li>`;
    }

    html += `</ul></div>`;

    temp.innerHTML = html;
    const manualList = temp.firstElementChild;
    relationsSearch.appendChild(manualList);

    constructNavigation();
  }
}

function addFooter() {
  const footer = document.createElement("div");
  footer.id = "websiteFooter";
  footer.innerHTML = `
      <p>Website by Tuyan Tatliparmak v1.2.0</p>
      <div id="footerButtons">
        <a class="footerButton" href="https://www.linkedin.com/in/tuyan/"><i class="fa-brands fa-linkedin"></i></a>
        <a class="footerButton" href="https://github.com/TuT597"><i class="fa-brands fa-square-github"></i></a>
      </div>
  `;

  relationsDiv.appendChild(footer);
}

// #endregion Utility
