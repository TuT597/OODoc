document.addEventListener("DOMContentLoaded", async function () {
  window.data = await fetch("OODoc.json").then((response) => response.json());
  console.log(data);
  window.indexLinks = mapIndexLinks(data);
  console.log(window.indexLinks);

  const navListMainSelections = document.querySelectorAll(".mainSelection");
  let activeItem;

  const navSearchBar = document.getElementById("navSearchBar");

  const contentDiv = document.getElementById("contentDiv");

  // Select intro  and load its content when website is first loaded
  fetch("html files/introduction.html")
    .then((response) => response.text())
    .then((html) => {
      contentDiv.innerHTML = html;
    });

  // Loop over all the main options in the navList and add click functions to them
  navListMainSelections.forEach(function (mainSelection) {
    mainSelection.addEventListener("click", function () {
      const fileName = mainSelection.textContent.trim().toLowerCase();

      //#region dropdowns
      // Check if menu option has dropdown icon so we know items have to be added when clicked
      if (mainSelection.querySelector(".navListIcon i")) {
        const icon = mainSelection.querySelector(".navListIcon i");
        const listDiv = document.getElementById(fileName + "ListDiv");
        listDiv.style.display = "flex";
        let expanded = mainSelection.dataset.expanded === "true";

        if (icon) {
          icon.classList.toggle("fa-chevron-right");
          icon.classList.toggle("fa-chevron-down");
        }

        // Check to see what menu item is clicked and if its already open or not
        if (fileName === "manuals" && !expanded) {
          mainSelection.dataset.expanded = "true";

          //#region sub-item generation
          // Generate navigation items
          for (let manual in data.manuals) {
            let navigationListElement = document.createElement("div");
            navigationListElement.className = "navigationListElement";
            let navigationListElementText = document.createElement("span");
            navigationListElementText.className = "navigationListElementText";
            navigationListElementText.innerText =
              data.index[data.manuals[manual]].name;

            // Save the full name in case of overflow
            navigationListElementText.dataset.fullName =
              data.index[data.manuals[manual]].name;

            // add click event to nav items to generate content on the page
            navigationListElement.addEventListener("click", () => {
              contentDiv.innerHTML = generatePage(data.manuals[manual]);
              // Add functionality to the generated page
              constructNavigation();
              activateItem(navigationListElement);
            });

            listDiv.appendChild(navigationListElement);
            navigationListElement.appendChild(navigationListElementText);

            //#region long-name items
            // Check if the text inside overflows the container
            if (isOverflown(navigationListElementText)) {
              // Create new span element to hover over the element
              let navigationListElementTextFull =
                document.createElement("span");
              navigationListElementTextFull.className =
                "navigationListElementTextFull";
              navigationListElementTextFull.innerText =
                navigationListElementText.dataset.fullName;
              navigationListElementTextFull.style.display = "none";

              document
                .getElementById("navFloatLayer")
                .appendChild(navigationListElementTextFull);

              // Generate shortened name
              navigationListElementText.dataset.shortName = fixOverflownNavText(
                navigationListElementText
              );

              navigationListElementText.innerText =
                navigationListElementText.dataset.shortName;

              navigationListElement.addEventListener("click", () => {
                updateFloater(
                  navigationListElement,
                  navigationListElementTextFull
                );
              });

              // Reveal full name while hovering
              navigationListElement.addEventListener("mouseover", () => {
                navigationListElementText.innerText =
                  navigationListElementText.dataset.fullName;

                // Generate new floater displayer on top of nav item with full name
                const rect = navigationListElement.getBoundingClientRect();
                navigationListElementTextFull.style.top = `${rect.top}px`;
                navigationListElementTextFull.style.left = `${rect.left}px`;
                navigationListElementTextFull.style.display = "block";

                // Update the colors on the floater in case nav item is active
                updateFloater(
                  navigationListElement,
                  navigationListElementTextFull
                );
              });

              // Reduce name when no longer hovering
              navigationListElement.addEventListener("mouseleave", () => {
                navigationListElementText.innerText =
                  navigationListElementText.dataset.shortName;

                navigationListElementTextFull.style.display = "none";
              });
            }
            //#endregion long-name items
          }
          //#endregion sub-item generation
          // If already extended, collapse the navigation and clear the list
        } else if (fileName === "manuals" && expanded) {
          mainSelection.dataset.expanded = "false";
          listDiv.innerHTML = "";
          listDiv.style.display = "none";
        }
      }
      //#endregion dropdowns

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

  //#region Search bar
  navSearchBar.addEventListener("input", () => {
    if (navSearchBar.value) {
      for (let manual in data.manuals) {
        if (data.manuals[manual].name.includes(navSearchBar.value)) {
          console.log(data.manuals[manual].name);
        }
      }
    }
  });
  //#endregion Search bar

  //#region functions
  // Map out what index items are linked
  function mapIndexLinks(index) {
    let indexLinks = {};

    for (chapter in data.manuals) {
      let indexID = data.manuals[chapter];
      indexLinks[chapter] = [indexID, [...crawlIndex(indexID)]];
      indexLinks[chapter].sort();
    }

    return indexLinks;
  }

  // Crawl the index to get all id numbers attached to a manual
  function crawlIndex(indexID) {
    let indexArray = [];
    const indexObj = getDocFrag(indexID);

    // Loop through all the fields in the indexObject
    for (let field in indexObj) {
      // If the indexObject ID is found add it to the array
      if (field === "id") {
        indexArray.push(indexObj[field]);
      }

      // If a field that contains multiple items is found recursively call the method to crawl deeper
      if (Array.isArray(indexObj[field])) {
        for (let item of indexObj[field]) {
          // Check to see if item is another Array
          if (Array.isArray(item)) {
            for (let subItem of item) {
              indexArray.push(...crawlIndex(subItem));
            }
          } else {
            indexArray.push(...crawlIndex(item));
          }
        }
      }
    }

    return indexArray;
  }

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

  // Update colours on the floating mouseover element
  function updateFloater(element, floater) {
    if (element.classList.contains("active")) {
      floater.style.color = "var(--DARK)";
      floater.style.backgroundColor = "var(--TEXT)";
    } else {
      floater.style.color = "var(--TEXT)";
      floater.style.backgroundColor = "var(--DARKER)";
    }
  }
  //#endregion functions
});
