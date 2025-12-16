let usedDiagnosticManuals = [];


function generateDiagnosticsPage() {
  populateDiagnostics();
  updateRelations("diagnostics");
  constructNavigation();
}

function populateDiagnostics(val, sortMethod) {
  let content = ``;
  let sortedDiagnostics = getSortedDiagnostics(val);
  sortMethods(sortedDiagnostics);
  
  // Remove duplicates
  const seen = new Set();

  sortedDiagnostics = sortedDiagnostics.filter((diagnostic) => {
    const key = `${diagnostic.name}::${diagnostic.manualName}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Fish out all different types
  const diagnosticTypes = getDiagnosticTypes(sortedDiagnostics).sort();

  if (sortMethod === "letter" || !sortMethod) {
    for (const type of diagnosticTypes) {
      let entryContent = `
      <div class="docHeadMethod">
      <h1 id="${type}" class="docName can-fade">${type.toUpperCase()}</h1>
      </div>
      <div class="subDiv diagnosticsPageSection">
    `;

      let counter = 0;
      for (const diagnostic of sortedDiagnostics) {
        if (diagnostic.type === type) {
          entryContent += `<p>${diagnostic.type.toUpperCase()}: ${
            diagnostic.name
          } - <a href="${diagnostic.id}">${
            diagnostic.methodName
          }()</a> in <a href="${diagnostic.manualID}">${
            diagnostic.manualName
          }</a></p>`;
          counter++;
        }
      }
      entryContent += `</div>`;

      if (counter > 0) {
        content += entryContent;
      }
    }
  }
  // Instead of sorting by type we group them by manual instead
  else if (sortMethod === "manual") {
    const manuals = getUniqueManuals(sortedDiagnostics);
    for (const manual of manuals) {
      let entryContent = `
      <div class="docHeadMethod">
        <h1 id="${manual[1]}" class="docName can-fade">${manual[0]}</h1>
      </div>
      <div class="subDiv methodPageSection">
      `;

      let counter = 0;
      for (const diagnostic of sortedDiagnostics) {
        if (diagnostic.manualName === manual[0]) {
          entryContent += `<label class="methodPageLabel">${diagnostic.type} - <a href="${diagnostic.id}">${diagnostic.name}</a></label>`;
          counter++;
        }
      }
      entryContent += `</div>`;
      if (counter > 0) {
        content += entryContent;
        usedDiagnosticManuals.push(manual);
      }
    }
  }

  contentDiv.innerHTML = content;
}

function getSortedDiagnostics(val) {
  // Create new array to alphabetically sort diagnostics
  let sortedDiagnostics = [];

  for (entry in indexLinks) {
    const manual = entry;
    const manualID = indexLinks[entry][0];
    const entryItems = indexLinks[entry][1];

    for (const entryItem in entryItems) {
      item = getDocFrag(entryItems[entryItem]);
      if (item.diagnostics) {
        for (const diag in item.diagnostics) {
          diagnostic = getDocFrag(item.diagnostics[diag]);
          if (val && !diagnostic.name.includes(val)) {
            continue;
          }
          diagnostic.manualName = manual;
          diagnostic.manualID = manualID;
          diagnostic.methodName = item.name;

          // filter out all inherited/extended items
          if (!diagnostic.extends) {
            sortedDiagnostics.push(diagnostic);
          }
        }
      }
    }
  }
  return sortedDiagnostics;
}

function getDiagnosticTypes(items) {
  let diagnosticTypes = [];
  for (const diagnostic of items) {
    if (!diagnosticTypes.includes(diagnostic.type)) {
      diagnosticTypes.push(diagnostic.type);
    }
  }
  return diagnosticTypes;
}
