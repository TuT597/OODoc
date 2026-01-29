function generateDetailsPage() {
  let html = `<div id="detailsListDiv">`;

  for (entry in indexLinks) {
    const manual = entry;
    const entryItems = indexLinks[entry][1];

    for (const entryItem in entryItems) {
      item = getDocFrag(entryItems[entryItem]);
      if (item.nest && item.name && item.name === "DETAILS") {
        item.manualName = manual;
        html += `
          <div class="detailDiv">
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

  constructNavigation();
  updateRelations("details");
}
