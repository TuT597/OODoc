function generateManualPage(manualID) {
  const manual = window.data.index[manualID];

  let content = `
  <div id="${manual.id}" class="docHead">
  <h1 class="docName">${manual.name}</h1>
  <h3 class="docTitle">${manual.title}</h3>
  </div>
  `;

  // loop through chapters in manual
  for (let chapter of manual.chapters) {
    content += generateBlock(getDocFrag(chapter));
  }

  updateRelations("manual", manual.id);
  return content;
}

function generateBlock(docFrag) {
  if (
    docFrag.name === "NAME" ||
    (!docFrag.intro && !docFrag.nest && !docFrag.subroutines)
  ) {
    return ``;
  }

  docFrag.type === "chapter"
    ? (content = `
      <div id="${docFrag.id}" class="docDiv can-fade">
      <banner class="docChapter">${docFrag.name}</banner>`)
    : (content = `
    <div id="${docFrag.id}" class="subDiv can-fade">
    <p class="docSection">${docFrag.name}</p>`);

  if (docFrag.intro) {
    content += `<div class="docText">${docFrag.intro}</div>`;
  }

  // check for nest
  if (docFrag.nest) {
    for (let section in docFrag.nest) {
      const frag = getDocFrag(docFrag.nest[section]);
      if (frag.level && frag.level > 2) {
        content += generateSubBlock(frag);
      } else {
        content += generateBlock(frag);
      }
    }
  }

  // check for subroutines
  if (docFrag.subroutines) {
    for (let subroutine in docFrag.subroutines) {
      content += generateSubBlock(getDocFrag(docFrag.subroutines[subroutine]));
    }
  }

  if (docFrag.type === "section") {
    content += `</div><hr class="MethodsDivider">`;
  } else {
    content += `</div>`;
  }
  return content;
}

function generateSubBlock(docFrag) {
  if (docFrag.level) {
    content = `<div id="${docFrag.id}" class="subDiv can-fade">`;
    if (docFrag.level === 3)
      content += `<p class="docSubSection">${docFrag.name}</p>`;
    else if (docFrag.level === 4)
      content += `<p class="docSubSubSection">${docFrag.name}</p>`;
    else content += `<p class="docSection">${docFrag.name}</p>`;
    content += `<div class="docSubroutine can-fade">
      <div class="docText">${docFrag.intro}</div>
    `;
  } else {
    content = `<div id="${docFrag.id}" class="docSubroutine can-fade">`;
    if (docFrag.call) {
      content += `<div class="docCall">${docFrag.call}</div>`;
    } else if (docFrag.name) {
      content += `<div class="docCall">${docFrag.name}</div>`;
    }
    if (docFrag.intro) {
      content += `<div class="subText">${docFrag.intro}</div>`;
    }
  }

  // check for options
  if (docFrag.options) {
    let optionsTable = `<div id="optionsTableDiv"><table class="optionsTable">
        <tr>
          <th>Option</th>
          <th>Default</th>
        </tr>`;
    let optionContent = ``;
    for (let i = 0; i < docFrag.options.length; i++) {
      for (let j = 0; j < docFrag.options[i].length; j++) {
        optionContent += generateOption(getDocFrag(docFrag.options[i][j]));
        optionsTable += generateOptionsTable(getDocFrag(docFrag.options[i][j]));
      }
    }
    optionsTable += `</table></div>`;
    content += optionsTable;
    content += optionContent;
  }

  // check for diagnostics
  if (docFrag.diagnostics) {
    content += `<div id="${docFrag.id}" class="docErrorsDiv">
                  <div class="docDiagLabel">
                    <p class="docErrors">Diagnostics (${docFrag.diagnostics.length})</p>
                    <button class="docDiagButton"><i class="fa-solid fa-chevron-left"></i></button>
                  </div>`;
    for (diagnostic in docFrag.diagnostics) {
      content += generateDiagnostic(
        getDocFrag(docFrag.diagnostics[diagnostic])
      );
    }
    content += `</div>`;
  }

  if (docFrag.nest) {
    for (let subsection in docFrag.nest) {
      content += generateSubBlock(getDocFrag(docFrag.nest[subsection]));
    }
  }

  if (docFrag.level) {
    content += `</div></div>`;
  } else {
    content += `</div>`;
  }
  return content;
}

// generate options
function generateOption(option) {
  let optionContent = ``;
  if (option.type === "option") {
    optionContent += `<div class="docOption can-fade"><p class="optionCall">${option.name} => ${option.params}</p>`;
    option.intro
      ? (optionContent += `<div class="subText">${option.intro}</div></div>`)
      : (optionContent += `</div>`);
    return optionContent;
  }
  return "";
}

// generate defaults
function generateOptionsTable(option) {
  if (option.type === "default") {
    return `
    <tr id="${option.id}">
      <td>${option.name}</td>
      <td>${option.value}</td>
    </tr>`;
  }
  return "";
}

// generate errors and faults
function generateDiagnostic(diagnostic) {
  let diagnosticContent = `<div id="${diagnostic.id}" class="docDiagnosticsDiv"><div class="docDiagnostic">${diagnostic.type}: ${diagnostic.name}</div>`;
  if (diagnostic.intro) {
    diagnosticContent += `<div class="subText">${diagnostic.intro}</div>`;
  }
  diagnosticContent += `</div>`;
  return diagnosticContent;
}
