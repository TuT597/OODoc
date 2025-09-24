function generateMethodsPage(indexLinks) {
  let content = ``;

  for (entry in indexLinks) {
    let entryContent = `<div id="${indexLinks[entry].id}" class="docHeadMethod">
    <h1 class="docName">${entry}</h1>
    </div>
    <div class="subDiv methodPageSection">
    `;

    let counter = 0;
    const entryItems = indexLinks[entry][1];
    for (item in entryItems) {
      item = getDocFrag(entryItems[item]);
      if (item.type && (item.type === "i_method" || item.type === "c_method")) {
        entryContent += `<a href="${item.id}">${item.name}</a>`;
        counter++;
      }
    }
    entryContent += `</div>`;

    if (counter > 0) {
      content += entryContent;
    }
  }

  contentDiv.innerHTML = content;
  constructNavigation();
}
