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
    !docFrag ||
    docFrag.name === "NAME" ||
    (!docFrag.intro &&
      !docFrag.nest &&
      !docFrag.subroutines &&
      !docFrag.examples)
  ) {
    return ``;
  }

  let content = `
  <div id="${docFrag.id}" class="manualDiv ${docFrag.type}Div can-fade">
    <h class="manualHeader ${docFrag.type}Header">${docFrag.name}</h>
  `;

  content +=
    generateIntro(docFrag.intro, docFrag.type) +
    generateExamples(docFrag.examples, docFrag.id) +
    generateSubroutines(docFrag.subroutines);

  if (docFrag.nest) {
    for (const item of docFrag.nest || []) {
      content += generateBlock(getDocFrag(item));
    }
  }

  content += `</div>`;
  return content;
}

function generateIntro(intro, type) {
  if (!intro) return ``;

  return `
    <div class="manualText ${type}Text">
      ${intro}
    </div>
  `;
}

function generateExamples(examples, id) {
  //same structure as diags
  if (!examples) return ``;
  let fullContent = `
    <div id="${id}" class="manualExamplesDiv foldoutDiv">
      <div class="foldoutLabel">
        <p class="foldoutData">Examples (${examples.length})</p>
        <button class="manualExamplesButton foldoutButton"><i class="fa-solid fa-chevron-left"></i></button>
      </div>`;

  for (const example of examples) {
    const docFrag = getDocFrag(example);

    let content = `
    <div id="${docFrag.id}" class="manualExampleDiv">
      <div class="manualExample">Example: ${docFrag.name}</div>`;
    if (docFrag.intro) {
      content += `<div class="manualSubText">${docFrag.intro}</div>`;
    }
    content += `</div>`;

    fullContent += content;
  }

  fullContent += `</div>`;

  return fullContent;
}

function generateSubroutines(subroutines) {
  if (!subroutines) return ``;
  let fullContent = ``;
  for (const subroutine of subroutines) {
    const docFrag = getDocFrag(subroutine);

    let content = `<div id="${docFrag.id}" class="manualDiv ${docFrag.type}Div can-fade">`;
    if (docFrag.call) {
      content += `<div class="manualCall">${docFrag.call}</div>`;
    } else if (docFrag.name) {
      content += `<div class="manualCall">${docFrag.name}</div>`;
    }
    if (docFrag.intro) {
      content += `<div class="manualSubText">${docFrag.intro}</div>`;
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
          optionsTable += generateOptionsTable(
            getDocFrag(docFrag.options[i][j])
          );
        }
      }
      optionsTable += `</table></div>`;
      content += optionsTable;
      content += optionContent;
    }

    // check for diagnostics
    if (docFrag.diagnostics) {
      content += `<div id="${docFrag.id}" class="manualErrorsDiv foldoutDiv">
                  <div class="foldoutLabel">
                    <p class="foldoutData">Diagnostics (${docFrag.diagnostics.length})</p>
                    <button class="manualDiagButton foldoutButton"><i class="fa-solid fa-chevron-left"></i></button>
                  </div>`;
      for (diagnostic in docFrag.diagnostics) {
        content += generateDiagnostic(
          getDocFrag(docFrag.diagnostics[diagnostic])
        );
      }
      content += `</div>`;
    }

    content += `</div>`;

    fullContent += content;
  }
  return fullContent;
}

// generate options
function generateOption(option) {
  let optionContent = ``;
  if (option.type === "option") {
    optionContent += `<div class="manualOption can-fade"><p class="optionCall">${option.name} => ${option.params}</p>`;
    option.intro
      ? (optionContent += `<div class="optionText">${option.intro}</div></div>`)
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
  let diagnosticContent = `<div id="${diagnostic.id}" class="manualDiagnosticsDiv">
  <div class="manualDiagnostic">${diagnostic.type}: ${diagnostic.name}</div>`;
  if (diagnostic.intro) {
    diagnosticContent += `<div class="manualSubText">${diagnostic.intro}</div>`;
  }
  diagnosticContent += `</div>`;
  return diagnosticContent;
}
