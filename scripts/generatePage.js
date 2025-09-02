function generatePage(manualID) {
  const manual = window.data.index[manualID];

  let content = `
  <div class="docHead">
  <h1 class="docName">${manual.name}</h1>
  <h3 class="docTitle">${manual.title}</h3>
  </div>
  `;

  // loop through chapters in manual
  for (let chapter of manual.chapters) {
    content += generateChapter(getObjectByID(chapter));
  }

  return content;
}

function getObjectByID(id) {
  return window.data.index[id];
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
      <div class="docDiv">
      <banner class="docChapter">${chapter.name}</banner>`;
  content += chapter.intro || "";

  // check for nest in case chapter has sections and loop through those
  if (chapter.nest) {
    for (let section in chapter.nest) {
      content += generateSection(getObjectByID(chapter.nest[section]));
    }
  }

  content += `</div>`;
  return content;
}

// go through the same process for sections
function generateSection(section) {
  content = `
    <div class="docDiv">
    <h4 class="docSection">${section.name}</h4>`;

  // check for subroutines
  if (section.subroutines) {
    for (let subroutine in section.subroutines) {
      content += generateSubroutine(
        getObjectByID(section.subroutines[subroutine])
      );
    }
  }

  content += `</div>`;
  return content;
}

// and for subroutines
function generateSubroutine(subroutine) {
  content = `<div class="docSubroutine">`;
  content += subroutine.call;

  // check for options
  if (subroutine.options) {
    for (let i = 0; i < subroutine.options.length; i++) {
      for (let j = 0; j < subroutine.options[i].length; j++) {
        generateOption(getObjectByID(subroutine.options[i][j]));
      }
    }
  }

  // check for diagnostics

  content += `</div>`;
  return content;
}

// and for options
function generateOption(option) {
  if (option.type === "option") {
    content += `<p>${option.name} => ${option.params}</p>`;
    content += `<p>${option.intro || ""}</p><br>`;
  } else {
    content += `<p>${option.name} => ${option.value}</p>`;
    content += `<p>${option.intro || ""}</p>`;
  }
  return content;
}
