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
    content += generateChapter(getDocFrag(chapter));
  }

  updateRelations("manual");
  return content;
}

// generate chapter
function generateChapter(chapter) {
  if (
    chapter.name === "NAME" ||
    (chapter.name !== "METHODS" && !chapter.intro)
  ) {
    return ``;
  }

  content = `
      <div id="${chapter.id}" class="docDiv can-fade">
      <banner class="docChapter">${chapter.name}</banner>`;

  if (chapter.intro) {
    content += `<div class=docText>${chapter.intro}</div>`;
  }

  // check for nest in case chapter has sections and loop through those
  if (chapter.nest) {
    for (let section in chapter.nest) {
      content += generateSection(getDocFrag(chapter.nest[section]));
    }
  }

  content += `</div>`;
  return content;
}

// generate sections
function generateSection(section) {
  content = `
    <div id="${section.id}" class="subDiv can-fade">
    <p class="docSection">${section.name}</p>`;
  if (section.intro) {
    content += `<div class="docText">${section.intro}</div>`;
  }

  // check for subroutines
  if (section.subroutines) {
    for (let subroutine in section.subroutines) {
      content += generateSubroutine(
        getDocFrag(section.subroutines[subroutine])
      );
    }
  }

  if (section.nest) {
    for (let subsection in section.nest) {
      content += generateSubroutine(getDocFrag(section.nest[subsection]));
    }
  }

  content += `</div>`;
  return content;
}

// generate subroutines
function generateSubroutine(subroutine) {
  content = `<div id="${subroutine.id}" class="docSubroutine can-fade">`;
  if (subroutine.call) {
    content += `<div class="docCall">${subroutine.call}</div>`;
  } else if (subroutine.name) {
    content += `<div class="docCall">${subroutine.name}</div>`;
  }
  if (subroutine.intro) {
    content += `<div class="subText">${subroutine.intro}</div>`;
  }

  // check for options
  if (subroutine.options) {
    let optionsTable = `<div id="optionsTableDiv"><table class="optionsTable">
        <tr>
          <th>Option</th>
          <th>Default</th>
        </tr>`;
    let optionContent = ``;
    for (let i = 0; i < subroutine.options.length; i++) {
      for (let j = 0; j < subroutine.options[i].length; j++) {
        optionContent += generateOption(getDocFrag(subroutine.options[i][j]));
        optionsTable += generateOptionsTable(
          getDocFrag(subroutine.options[i][j])
        );
      }
    }
    optionsTable += `</table></div>`;
    content += optionsTable;
    content += optionContent;
  }

  // check for diagnostics
  if (subroutine.diagnostics) {
    content += `<div class="docErrorsDiv"><p class="docErrors">Diagnostics</p>`;
    for (diagnostic in subroutine.diagnostics) {
      content += generateDiagnostic(
        getDocFrag(subroutine.diagnostics[diagnostic])
      );
    }
    content += `</div>`;
  }
  content += `</div>`;
  return content;
}

// generate options
function generateOption(option) {
  let optionContent = ``;
  if (option.type === "option") {
    optionContent += `<div id="${option.id}" class="docOption can-fade"><p class="docCall">${option.name} => ${option.params}</p>`;
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
  let diagnosticContent = `<div id="${diagnostic.id}" class="docDiagnosticsDiv can-fade"><div class="docDiagnostic">${diagnostic.type}: ${diagnostic.name}</div>`;
  if (diagnostic.intro) {
    diagnosticContent += `<div class="subText">${diagnostic.intro}</div>`;
  }
  diagnosticContent += `</div>`;
  return diagnosticContent;
}
