function generateDiagnosticsPage() {
  populateDiagnostics();
  updateRelations("diagnostics");
  constructNavigation();
}

function populateDiagnostics(val) {
  let content = ``;
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
          sortedDiagnostics.push(diagnostic);
        }
      }
    }
  }

  sortedDiagnostics.sort((a, b) => {
    const nameA = a.name || "";
    const nameB = b.name || "";
    return nameA.localeCompare(nameB);
  });

  // Remove duplicates
  const seen = new Set();

  sortedDiagnostics = sortedDiagnostics.filter((diagnostic) => {
    const key = `${diagnostic.name}::${diagnostic.manualName}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Fish out all different types
  let diagnosticTypes = [];
  for (const diagnostic of sortedDiagnostics) {
    if (!diagnosticTypes.includes(diagnostic.type)) {
      diagnosticTypes.push(diagnostic.type);
    }
  }

  for (const type of diagnosticTypes) {
    let entryContent = `<div class="docHeadMethod" id="type${type}}">
    <h1 class="docName">${type.toUpperCase()}</h1>
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

  contentDiv.innerHTML = content;
}
