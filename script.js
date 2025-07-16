document.addEventListener("DOMContentLoaded", async function () {
  const data = await fetch("a.json").then((response) => response.json());

  const navSection = document.getElementById("navSection");
  const navListMainSelections = document.querySelectorAll(".mainSelection");
  const navSearchBar = document.getElementById("navSearchBar");

  const contentDiv = document.getElementById("contentDiv");

  const relationsSection = document.getElementById("relationsSection");

  //Select intro  and load its content when website is first loaded
  fetch("html files/introduction.html")
    .then((response) => response.text())
    .then((html) => {
      contentDiv.innerHTML = html;
    });

  console.log(data);

  for (manual in data.manuals) {
    console.log(data.manuals[manual].name);
  }

  //Loop over all the main options in the navList and add click functions to them
  navListMainSelections.forEach(function (mainSelection) {
    mainSelection.addEventListener("click", function () {
      const fileName = mainSelection.textContent.trim().toLowerCase();

      //Check if menu option has dropdown icon so we know items have to be added when clicked
      if (mainSelection.querySelector(".navListIcon i")) {
        const icon = mainSelection.querySelector(".navListIcon i");
        const listDiv = document.getElementById(fileName + "ListDiv");
        let expanded = mainSelection.dataset.expanded === "true";

        if (icon) {
          icon.classList.toggle("fa-chevron-right");
          icon.classList.toggle("fa-chevron-down");
        }

        //Check to see what menu item is clicked and if its already open or not
        if (fileName === "packages" && !expanded) {
          mainSelection.dataset.expanded = "true";
          for (manual in data.manuals) {
            const navigationListElement = document.createElement("span");
            navigationListElement.className = "navigationListElement";
            navigationListElement.innerText = data.manuals[manual].name;

            listDiv.appendChild(navigationListElement);
          }
        } else if (fileName === "packages" && expanded) {
          mainSelection.dataset.expanded = "false";
          listDiv.innerHTML = "";
        }
      }

      //If menu option is not a drop down then open related file in content section
      else {
        fetch("html files/" + fileName + ".html")
          .then((response) => response.text())
          .then((html) => {
            contentDiv.innerHTML = html;
          });
      }
    });
  });
});
