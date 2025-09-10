function constructNavigation() {
  // Select all href links on the generated page
  let hrefLinks = contentDiv.querySelectorAll("a[href]");

  // Add click functionality to them
  hrefLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const linkID = link.getAttribute("href");
      const linkObj = getDocFrag(linkID);

      // Make the link direct to the correct content and item
      processLinkObj(linkObj);
    });
  });
}

function processLinkObj(linkObj) {
  if (!linkObj.type) {
    contentDiv.innerHTML = generatePage(linkObj.id);
    // Add functionality to the generated page
    constructNavigation();
  } else {
    for (item in indexLinks) {
      if (indexLinks[item][1].includes(linkObj.id)) {
        contentDiv.innerHTML = generatePage(indexLinks[item][0]);
        constructNavigation();

        const targetElem = contentDiv.querySelector(`#${linkObj.id}`);
        if (targetElem) {
          targetElem.style.background = "yellow";
          targetElem.scrollIntoView({ block: "center" });
        }

        break;
      }
    }
  }
}
