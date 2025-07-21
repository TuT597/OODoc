document.addEventListener("DOMContentLoaded", async function () {
  const data = await fetch("a.json").then((response) => response.json());

  const navSection = document.getElementById("navSection");
  const navListMainSelections = document.querySelectorAll(".mainSelection");
  const navSearchBar = document.getElementById("navSearchBar");
  let activeItem;

  const contentDiv = document.getElementById("contentDiv");

  const relationsSection = document.getElementById("relationsSection");

  // Select intro  and load its content when website is first loaded
  fetch("html files/introduction.html")
    .then((response) => response.text())
    .then((html) => {
      contentDiv.innerHTML = html;
    });

  //console.log(data);

  // Loop over all the main options in the navList and add click functions to them
  navListMainSelections.forEach(function (mainSelection) {
    mainSelection.addEventListener("click", function () {
      const fileName = mainSelection.textContent.trim().toLowerCase();

      // Check if menu option has dropdown icon so we know items have to be added when clicked
      if (mainSelection.querySelector(".navListIcon i")) {
        const icon = mainSelection.querySelector(".navListIcon i");
        const listDiv = document.getElementById(fileName + "ListDiv");
        let expanded = mainSelection.dataset.expanded === "true";

        if (icon) {
          icon.classList.toggle("fa-chevron-right");
          icon.classList.toggle("fa-chevron-down");
        }

        // Check to see what menu item is clicked and if its already open or not
        if (fileName === "packages" && !expanded) {
          mainSelection.dataset.expanded = "true";

          // Generate navigation items
          for (let manual in data.manuals) {
            let navigationListElement = document.createElement("span");
            navigationListElement.className = "navigationListElement";
            navigationListElement.innerText = data.manuals[manual].name;

            // Save the full name in case of overflow
            navigationListElement.dataset.fullName = data.manuals[manual].name;

            navigationListElement.addEventListener("click", () => {
              contentDiv.innerHTML = generatePage(data.manuals[manual]).content;
              activateItem(navigationListElement);
            });

            listDiv.appendChild(navigationListElement);

            // Check if the text inside overflows the container
            if (isOverflown(navigationListElement)) {
              // Generate shortened name
              navigationListElement.dataset.shortName = fixOverflownNavText(
                navigationListElement
              );

              navigationListElement.innerText =
                navigationListElement.dataset.shortName;

              // Reveal full name while hovering
              navigationListElement.addEventListener("mouseover", () => {
                navigationListElement.innerText =
                  navigationListElement.dataset.fullName;
              });

              // Reduce name when no longer hovering
              navigationListElement.addEventListener("mouseleave", () => {
                navigationListElement.innerText =
                  navigationListElement.dataset.shortName;
              });
            }
          }
          // If already extended, collapse the navigation and clear the list
        } else if (fileName === "packages" && expanded) {
          mainSelection.dataset.expanded = "false";
          listDiv.innerHTML = "";
        }
      }

      // If menu option is not a drop down then open related file in content section
      else {
        fetch("html files/" + fileName + ".html")
          .then((response) => response.text())
          .then((html) => {
            contentDiv.innerHTML = html;
          });
      }
    });
  });

  // Check for overflow
  function isOverflown(element) {
    return element.scrollWidth > element.clientWidth;
  }

  // Change innertext to fit in element
  function fixOverflownNavText(element) {
    while (isOverflown(element)) {
      element.innerText = element.innerText.slice(0, -1);
    }

    return (element.innerText = element.innerText.slice(0, -2).concat("..."));
  }

  // Add or remove active class from nav items for styling purposes
  function activateItem(element) {
    activeItem
      ? activeItem.classList.toggle("active")
      : element.classList.toggle("active");
    if (activeItem) element.classList.toggle("active");
    activeItem = element;
  }
});
