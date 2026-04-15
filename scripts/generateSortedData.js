function generateMethodsPage() {
  populatePage("", "", "methods");
  updateRelations("methods");
  constructNavigation();
}

function generateDiagnosticsPage() {
  populatePage("", "", "diagnostics");
  updateRelations("diagnostics");
  constructNavigation();
}

function populatePage(val, sortMethod, pageType) {
  let content = ``;
  let pageItems = getData(val, pageType);

  content += generateContent(pageItems, sortMethod, pageType);
  contentDiv.innerHTML = content;
}

function getData(val, pageType) {
  let pageItems = [];

  for (entry in indexLinks) {
    const manual = entry;
    const manualID = indexLinks[entry][0];
    const entryItems = indexLinks[entry][1];

    for (const entryItem in entryItems) {
      item = getDocFrag(entryItems[entryItem]);
      if (pageType === "methods") {
        if (item.type && item.type.includes("method")) {
          if (val && !item.name.includes(val)) {
            continue;
          }
          pageItems.push(labelItem(item));
        }
      }

      if (pageType === "diagnostics") {
        if (item.diagnostics) {
          for (const diag in item.diagnostics) {
            let diagnostic = getDocFrag(item.diagnostics[diag]);
            if ((val && !diagnostic.name.includes(val)) || diagnostic.extends) {
              continue;
            }
            pageItems.push(labelItem(diagnostic, true));
          }
        }
      }
    }

    function labelItem(item, isDiag) {
      item.manualName = manual;
      item.manualID = manualID;
      isDiag ? (item.methodName = item.name) : (item.methodName = "");

      return item;
    }
  }
  pageItems = removeDuplicates(pageItems);
  sortItems(pageItems);
  return pageItems;
}

function removeDuplicates(input) {
  const seen = new Set();

  return input.filter((item) => {
    const key = `${item.name}::${item.manualName}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sortItems(input) {
  input.sort((a, b) => {
    const nameA = a.name || "";
    const nameB = b.name || "";
    return nameA.localeCompare(nameB);
  });
}

function getItemTypes(input) {
  let types = [];
  for (const item of input) {
    if (item.type && !types.includes(item.type)) {
      types.push(item.type);
    }
  }
  return types;
}

function getUniqueManuals(input) {
  let manuals = [];
  for (const item of input) {
    if (
      !manuals.some((manual) => manual[0] === item.manualName) &&
      item.manualName
    ) {
      manuals.push([item.manualName, item.manualID]);
    }
  }
  return manuals.sort();
}

function generateContent(pageItems, sortMethod, pageType) {
  let content = ``;
  if (sortMethod === "letter" || !sortMethod) {
    if (pageType === "methods") {
      for (let i = 0; i < 26; i++) {
        const letter = String.fromCharCode(65 + i);
        let entryContent = generateHeader(letter, sortMethod);

        let hasEntry = false;
        for (const item of pageItems) {
          if (item.name[0]?.toUpperCase() === letter) {
            entryContent += generateLabel(item, sortMethod, pageType);
            hasEntry = true;
          }
        }
        entryContent += `</div></div>`;
        if (hasEntry) content += entryContent;
      }
    } else if (pageType === "diagnostics") {
      for (const type of getItemTypes(pageItems).sort()) {
        let entryContent = generateHeader(type, sortMethod);

        let hasContent = false;
        for (const item of pageItems) {
          if (item.type === type) {
            entryContent += generateLabel(item, sortMethod, pageType);
            hasContent = true;
          }
        }
        entryContent += `</div></div>`;
        if (hasContent) content += entryContent;
      }
    }
  } else if (sortMethod === "manual") {
    const manuals = getUniqueManuals(pageItems);

    for (const manual of manuals) {
      let entryContent = generateHeader(manual, sortMethod);

      let hasContent = false;
      for (const item of pageItems) {
        if (item.manualName === manual[0]) {
          entryContent += generateLabel(item, sortMethod, pageType);
          hasContent = true;
        }
      }
      entryContent += `</div></div>`;
      if (hasContent) content += entryContent;
    }
  }
  return content;
}

function generateHeader(input, sortMethod) {
  return `
    <div id="${sortMethod === "manual" ? input[1] : input}" class="sectionContainer can-fade">
    <div class="docHeadMethod">
      <h1 class="docName can-fade">${sortMethod === "manual" ? input[0] : input.toUpperCase()}</h1>
    </div>
      <div class="subDiv pageSection methodPageSection can-fade">
  `;
}

function generateLabel(input, sortMethod, pageType) {
  if (pageType === "methods") {
    return `
      <label class="methodPageLabel">
        <a href="${input.id}">${input.name}</a> 
        - ${input.manualName}
      </label>
    `;
  } else if (pageType === "diagnostics") {
    if (sortMethod === "letter") {
      return `
        <label class="methodPageLabel">
          ${input.type}: ${input.name} - <a href="${input.id}">${input.methodName}()</a> in
          <a href="${input.manualID}">${input.manualName}</a>
        </label>
      `;
    } else {
      return `
        <label class="methodPageLabel">
          ${input.type} - <a href="${input.id}">${input.name}</a>
        </label>
      `;
    }
  }
}