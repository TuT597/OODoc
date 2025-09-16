document.addEventListener("DOMContentLoaded", async function () {
  // New versions can be found at: https://perl.overmeer.net/oodoc/doctree/
  window.data = await fetch("data/OODoc-3.05-website.json").then((response) =>
    response.json()
  );
  console.log(data);
  window.indexLinks = mapIndexLinks(data);

  const navListMainSelections = document.querySelectorAll(".mainSelection");
  const listDiv = document.getElementById("manualsListDiv");
  let activeItem;

  const navSearchBar = document.getElementById("navSearchBar");

  const contentDiv = document.getElementById("contentDiv");

  // Generate intro page.
  generateIntroductionPage();

  // Loop over all the main options in the navList and add click functions to them
  navListMainSelections.forEach(function (mainSelection) {
    mainSelection.addEventListener("click", function () {
      window[`generate${mainSelection.innerText}Page`]();
      contentDiv.scrollTop = 0;
      if (activeItem) {
        activeItem.classList.toggle("active");
        activeItem = null;
      }
    });
  });

  // Generate navigation items
  const sortedManuals = sortObjectByKey(data.manuals);
  for (let manual in sortedManuals) {
    generateSubitem(manual);
  }

  navSearchBar.addEventListener("input", () => {
    let val = navSearchBar.value;
    if (val) {
      listDiv.innerHTML = ``;
      generateSearchList(val);
    }
  });

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

  // #region subitem functions
  function generateSubitem(obj) {
    let navigationListElement = generateNavigationListElement();
    let navigationListElementText = generateNavigationListElementText(obj);

    // add click event to nav items to generate content on the page
    navigationListElement.addEventListener("click", () => {
      contentDiv.innerHTML = generateManualPage(sortedManuals[obj]);
      // Add functionality to the generated page
      constructNavigation();
      activateItem(navigationListElement);
    });

    // Add the generated nav item to the list
    listDiv.appendChild(navigationListElement);
    navigationListElement.appendChild(navigationListElementText);

    // Check if the text inside overflows the container
    if (isOverflown(navigationListElementText)) {
      handleNameOverflow(navigationListElement, navigationListElementText);
    }
  }

  function generateNavigationListElement() {
    let item = document.createElement("div");
    item.className = "navigationListElement";
    return item;
  }

  function generateNavigationListElementText(obj, type) {
    let item = document.createElement("span");
    item.className = "navigationListElementText";
    if (!type) {
      item.innerText = obj;
    } else {
      item.innerText = type + ": " + obj;
    }

    // Save the full name in case of overflow
    item.dataset.fullName = obj;
    return item;
  }

  // Check for overflow
  function isOverflown(element) {
    return element.scrollWidth > element.clientWidth;
  }

  function handleNameOverflow(
    navigationListElement,
    navigationListElementText
  ) {
    // Create new span element to hover over the element
    let navigationListElementTextFull = document.createElement("span");
    navigationListElementTextFull.className = "navigationListElementTextFull";
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
      updateFloater(navigationListElement, navigationListElementTextFull);
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
      updateFloater(navigationListElement, navigationListElementTextFull);
    });

    // Reduce name when no longer hovering
    navigationListElement.addEventListener("mouseleave", () => {
      navigationListElementText.innerText =
        navigationListElementText.dataset.shortName;

      navigationListElementTextFull.style.display = "none";
    });
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
  //#endregion subitem functions

  //#region search functions
  function generateSearchList(val) {
    let matchingObjects = [];
    for (let key in data.index) {
      let obj = data.index[key];
      if (obj.name && obj.name.includes(val)) {
        matchingObjects.push(obj);
      }
    }
    console.log(matchingObjects);

    // Sort by type then by name
    matchingObjects.sort((a, b) => {
      const typeA = a.type || "";
      const typeB = b.type || "";
      const typeCompare = typeA.localeCompare(typeB);
      if (typeCompare !== 0) return typeCompare;

      const nameA = a.name || "";
      const nameB = b.name || "";
      return nameA.localeCompare(nameB);
    });

    // Loop through the results and generate the navlist
    for (object of matchingObjects) {
      generateSearchItem(object);
    }
  }

  // Create search compatible items
  function generateSearchItem(obj) {
    let navigationListElement = generateNavigationListElement();
    let navigationListElementText = generateNavigationListElementText(
      obj.name,
      obj.type
    );

    // add click event to nav items to generate content on the page
    navigationListElement.addEventListener("click", () => {
      processLinkObj(obj);
    });

    // Add the generated nav item to the list
    listDiv.appendChild(navigationListElement);
    navigationListElement.appendChild(navigationListElementText);

    // Check if the text inside overflows the container
    if (isOverflown(navigationListElementText)) {
      handleNameOverflow(navigationListElement, navigationListElementText);
    }
  }
  //#endregion search functions
  //#endregion functions
});
