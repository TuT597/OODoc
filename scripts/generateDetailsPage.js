function generateDetailsPage() {
  let html = `<div id="detailsListsDiv">`;

  for (entry in indexLinks) {
    const manual = entry;
    const entryItems = indexLinks[entry][1];

    for (const entryItem in entryItems) {
      item = getDocFrag(entryItems[entryItem]);
      if (item.name && item.name == "DETAILS") {
        item.manualName = manual;
        html += `
          <div>
          <h3>Details in <a href="${item.id}">${manual}</a></h3> 
          <ul class="detailsList">`;
        for (const frag of item.nest) {
          const currentFrag = getDocFrag(frag);
          html += `<li class="detailsListItem"><a href="${currentFrag.id}">${currentFrag.name}</a></li>`;
        }
        html += `</div></ul>`;
      }
    }
  }

  html += `</div>`;
  contentDiv.innerHTML = html;

  // Make it so you get 2 columns by dynamically culculating the required height
  const detailsDiv = document.getElementById("detailsListsDiv");
  const computedStyle = window.getComputedStyle(detailsDiv);
  detailsDiv.style.height = parseFloat(computedStyle.height) / 1.9 + "px";

  constructNavigation();
  updateRelations("details");
}
