function constructNavigation() {
  // Select all href links on the generated page and reset listeners
  let links1 = contentDiv.querySelectorAll("a[href]");
  let links2 = relationsDiv.querySelectorAll("a[href]");
  let hrefLinks = [...links1, ...links2];
  hrefLinks.forEach((link) => {
    link.replaceWith(link.cloneNode(true));
  });

  // Select new links
  let updatedLinks1 = contentDiv.querySelectorAll("a[href]");
  let updatedLinks2 = relationsDiv.querySelectorAll("a[href]");
  let updatedHrefLinks = [...updatedLinks1, ...updatedLinks2];

  updatedHrefLinks.forEach((link) => {
    link.addEventListener("click", handleLinkClick);
  });
}

// Add click functionality to them
function handleLinkClick(e) {
  e.preventDefault();
  const hrefValue = this.getAttribute("href");

  if (hrefValue.startsWith("#")) {
    const targetElem = contentDiv.querySelector(`${hrefValue}`);
    targetElem.classList.add("highlight");
    targetElem.scrollIntoView({ block: "center" });
    setTimeout(() => {
      targetElem.classList.remove("highlight");
    }, 1000);
    return;
  }

  if (hrefValue.startsWith("id")) {
    const linkID = hrefValue;
    const linkObj = getDocFrag(linkID);
    if (!linkObj) {
      console.log("ERROR: Can't find ID.");
      return;
    }
    // Make the link direct to the correct content and item
    processLinkObj(linkObj);
  } else if (hrefValue.startsWith("https")) {
    window.open(hrefValue, "_blank");
  }
}

function processLinkObj(linkObj) {
  // Check to see if link goes to a manual page
  if (!linkObj.type) {
    contentDiv.innerHTML = generateManualPage(linkObj.id);
    contentDiv.scrollTop = 0;
    activateNavList(linkObj.name);
    // Reload links for new page
    requestAnimationFrame(() => {
      attachDiagnosticButtons();
      constructNavigation();
    });
  } else {
    /* Look for the right manual page to load and generateManualPage with it, 
    then move to and highlight the right item you are linking to */
    for (item in indexLinks) {
      if (indexLinks[item][1].includes(linkObj.id)) {
        contentDiv.innerHTML = generateManualPage(indexLinks[item][0]);
        requestAnimationFrame(() => {
          constructNavigation();
        });

        const targetElem = contentDiv.querySelector(`#${linkObj.id}`);
        if (targetElem) {
          targetElem.classList.add("highlight");
          targetElem.scrollIntoView({ block: "center" });
          setTimeout(() => {
            targetElem.classList.remove("highlight");
          }, 1000);
        }

        attachDiagnosticButtons();
        break;
      }
    }
  }
}

function activateNavList(name) {
  const listDiv = document.getElementById("manualsListDivScroll");
  let navItems = listDiv.querySelectorAll(".navigationListElement");
  let targetItem = Array.from(navItems).find((item) => {
    let span = item.querySelector("span");
    return span && span.textContent === name;
  });
  window.activateNavElement(targetItem);
}

function attachDiagnosticButtons() {
  document.querySelectorAll(".manualDiagButton").forEach((btn) => {
    const errorDiv = btn.parentElement.parentElement;
    // check if diagnostics are currently displayed
    const displayed = checkDiagnosticsDisplayStatus(errorDiv);

    // set initial rotation
    btn.style.transform = displayed ? "rotate(-45deg)" : "rotate(0deg)";

    btn.addEventListener("click", () => {
      const subroutineID = errorDiv.id;

      // determine current state
      const currentlyDisplayed = Array.from(
        errorDiv.querySelectorAll(".manualDiagnosticsDiv")
      ).some((div) => div.classList.contains("diagnostics-visible"));

      btn.style.transform = currentlyDisplayed
        ? "rotate(0deg)"
        : "rotate(-45deg)";

      updateDiagDivs(currentlyDisplayed ? "false" : "true", subroutineID);
    });
  });
}

function checkDiagnosticsDisplayStatus(div) {
  // check if diagnostics are currently displayed
  const displayed = Array.from(
    div.querySelectorAll(".manualDiagnosticsDiv")
  ).some((div) => div.classList.contains("diagnostics-visible"));

  return displayed;
}
