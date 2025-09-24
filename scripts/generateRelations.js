function generateRelations(page) {
  let content = `
  <div class="settingsMenu">
  <label class="switch">
    <input type="checkbox" id="themeSwitch">
    <span class="slider round"></span>
  </label>
  </div>
  `;

  relationsDiv.innerHTML = content;
  settingsFunctionality();
}

function settingsFunctionality() {
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
