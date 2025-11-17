function constructNavigation() {
  // Select all href links on the generated page
  let hrefLinks = contentDiv.querySelectorAll("a[href]");

  // Add click functionality to them
  hrefLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const hrefValue = link.getAttribute("href");
      e.preventDefault();
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
    });
  });
}

function processLinkObj(linkObj) {
  // Check to see if link goes to a manual page
  if (!linkObj.type) {
    contentDiv.innerHTML = generateManualPage(linkObj.id);
    contentDiv.scrollTop = 0;
    attachDiagnosticButtons();
    // Reload links for new page
    constructNavigation();
  } else {
    /* Look for the right manual page to load and generateManualPage with it, 
    then move to and highlight the right item we are linking to */
    for (item in indexLinks) {
      if (indexLinks[item][1].includes(linkObj.id)) {
        contentDiv.innerHTML = generateManualPage(indexLinks[item][0]);
        attachDiagnosticButtons();
        constructNavigation();

        const targetElem = contentDiv.querySelector(`#${linkObj.id}`);
        if (targetElem) {
          targetElem.classList.add("highlight");
          targetElem.scrollIntoView({ block: "center" });
          setTimeout(() => {
            targetElem.classList.remove("highlight");
          }, 1000);
        }

        break;
      }
    }
  }
}

function attachDiagnosticButtons() {
  const buttons = document.querySelectorAll(".docDiagButton");
  const checked = document.getElementById("diagnosticsToggle").checked;

  buttons.forEach((btn) => {
    let angle;
    checked ? (angle = 45) : (angle = 0);

    btn.addEventListener("click", () => {
      angle = angle === 0 ? -45 : 0;
      btn.style.transform = `rotate(${angle}deg)`;

      const subroutineDiv = btn.closest(".docErrorsDiv");
      const subroutineID = subroutineDiv.id;

      updateDiagDivs(checked.toString(), subroutineID);
    });
  });
}
