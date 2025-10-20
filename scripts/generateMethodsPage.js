function generateMethodsPage(indexLinks) {
  populateMethods();
  updateRelations("methods");
  constructNavigation();
}

function populateMethods(val) {
  let content = ``;
  // Create new array to alphabetically sort methods
  let sortedMethods = [];

  for (entry in indexLinks) {
    const manual = entry;
    const entryItems = indexLinks[entry][1];

    for (const entryItem in entryItems) {
      item = getDocFrag(entryItems[entryItem]);
      if (item.type && item.type.includes("method")) {
        if (val && !item.name.includes(val)) {
          continue;
        }
        item.manualName = manual;
        sortedMethods.push(item);
      }
    }
  }

  sortedMethods.sort((a, b) => {
    const nameA = a.name || "";
    const nameB = b.name || "";
    return nameA.localeCompare(nameB);
  });

  // Remove duplicates
  const seen = new Set();

  sortedMethods = sortedMethods.filter((method) => {
    const key = `${method.name}::${method.manualName}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i);
    let entryContent = `<div class="docHeadMethod" id="letter${letter}">
    <h1 class="docName">${letter}</h1>
    </div>
    <div class="subDiv methodPageSection">
    `;

    let counter = 0;
    for (const method of sortedMethods) {
      if (method.name[0]?.toUpperCase() === letter) {
        entryContent += `<label><a href="${method.id}">${method.name}</a> - ${method.manualName}</label>`;
        counter++;
      }
    }
    entryContent += `</div>`;

    if (counter > 0) {
      content += entryContent;
    }
  }

  contentDiv.innerHTML = content;
}
