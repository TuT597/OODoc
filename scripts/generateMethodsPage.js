/* function generateMethodsPage() {
  populateMethods();
  updateRelations("methods");
  constructNavigation();
}

function populateMethods(val, sortMethod) {
  let content = ``;
  // Create new array to alphabetically sort methods
  let sortedMethods = getSortedMethods(val);

  if (sortMethod === "letter" || !sortMethod) {
    for (let i = 0; i < 26; i++) {
      const letter = String.fromCharCode(65 + i);
      let entryContent = `
        <div id="letter${letter}" class="sectionContainer can-fade">
        <div class="docHeadMethod">
          <h1 class="docName can-fade">${letter}</h1>
        </div>
          <div class="subDiv pageSection methodPageSection can-fade">
      `;

      let counter = 0;
      for (const method of sortedMethods) {
        if (method.name[0]?.toUpperCase() === letter) {
          entryContent += `<label class="methodPageLabel"><a href="${method.id}">
          ${method.name}</a> - ${method.manualName}</label>`;
          counter++;
        }
      }
      entryContent += `</div></div>`;

      if (counter > 0) {
        content += entryContent;
      }
    }
  }
  // Instead of sorting methods by alphebet we group them by manual instead
  else if (sortMethod === "manual") {
    let manuals = getUniqueManuals(sortedMethods);

    for (const manual of manuals) {
      content += `
      <div id="${manual[1]}" class="sectionContainer can-fade">
      <div class="docHeadMethod">
        <h1 class="docName can-fade">${manual[0]}</h1>
        </div>
        <div class="subDiv pageSection methodPageSection can-fade">
      `;

      for (const method of sortedMethods) {
        if (method.manualName === manual[0]) {
          content += `<label class="methodPageLabel"><a href="${method.id}">
          ${method.name}</a> - ${method.manualName}</label>`;
        }
      }
      content += `</div></div>`;
    }
  }

  contentDiv.innerHTML = content;
}

function sortMethods(methods) {
  methods.sort((a, b) => {
    const nameA = a.name || "";
    const nameB = b.name || "";
    return nameA.localeCompare(nameB);
  });
}

function getSortedMethods(val) {
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
        item.manualID = indexLinks[entry][0];
        sortedMethods.push(item);
      }
    }
  }

  sortMethods(sortedMethods);

  // Remove duplicates
  const seen = new Set();

  sortedMethods = sortedMethods.filter((method) => {
    const key = `${method.name}::${method.manualName}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return sortedMethods;
}

function getUniqueManuals(items) {
  let manuals = [];
  for (const item of items) {
    if (
      !manuals.some((manual) => manual[0] === item.manualName) &&
      item.manualName
    ) {
      manuals.push([item.manualName, item.manualID]);
    }
  }
  return manuals.sort();
} 
  
*/