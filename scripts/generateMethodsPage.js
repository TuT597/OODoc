function generateMethodsPage() {
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
      let entryContent = `<div class="docHeadMethod">
    <h1 id="letter${letter}" class="docName can-fade">${letter}</h1>
    </div>
    <div class="subDiv methodPageSection">
    `;

      let counter = 0;
      for (const method of sortedMethods) {
        if (method.name[0]?.toUpperCase() === letter) {
          entryContent += `<label class="methodPageLabel"><a href="${method.id}">${method.name}</a> - ${method.manualName}</label>`;
          counter++;
        }
      }
      entryContent += `</div>`;

      if (counter > 0) {
        content += entryContent;
      }
    }
  } else if (sortMethod === "manual") {
    let manuals = getUniqueManuals(sortedMethods);

    for (const manual of manuals) {
      content += `<div class="docHeadMethod">
        <h1 id="${manual}" class="docName can-fade">${manual}</h1>
        </div>
        <div class="subDiv methodPageSection">
      `;

      for (const method of sortedMethods) {
        if (method.manualName === manual) {
          content += `<label class="methodPageLabel"><a href="${method.id}">${method.name}</a> - ${method.manualName}</label>`;
        }
      }
      content += `</div>`;
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

function getUniqueManuals() {
  const sortedMethods = getSortedMethods();
  let manuals = [];
  for (const method of sortedMethods) {
    if (!manuals.includes(method.manualName) && method.manualName) {
      manuals.push(method.manualName);
    }
  }
  return manuals.sort();
}
