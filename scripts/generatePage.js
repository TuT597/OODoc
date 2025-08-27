function generatePage(manualID) {
  console.log(manualID);
  const index = window.data.index;
  const manual = window.data.index[manualID];
  console.log(manual);

  let content = `
  <div class="docHead">
  <h1 class="docName">${manual.name}</h1>
  <h3 class="docTitle">${manual.title}</h3>
  </div>
  `;

  for (let chapter of manual.chapters) {
    if (index[chapter].path === "NAME") {
      // placeholder
    } else if (index[chapter].path === "METHODS") {
      let methodContent = `
        <div class="docDiv">
          <banner class="docChapter">METHODS</banner>
      `;

      if (index[chapter].nest) {
        for (let method of index[chapter].nest) {
          methodContent += `
          <div class="docMethod">
              <h4 class="methodSection">${index[method].name}</h4>
          `;
          if (index[method].subroutines) {
            for (let subroutine of index[method].subroutines) {
              methodContent += `<p class="docText">${index[subroutine].name}</p><br>`;

              if (index[subroutine].options) {
                for (let option of index[subroutine].options) {
                  methodContent += `
                  <p class="docText>${index[option[0]].name} => ${
                    index[option[0]].params
                  }</p><br>
                  ${index[option[0]].intro}`;
                }
              }

              if (index[subroutine].diagnostic) {
                
              }
            }
          }
          methodContent += `</div>`;
        }
      }
      methodContent += `</div>`;
      content += methodContent;
    } else {
      content += `
        <div class="docDiv">
          <banner class="docChapter">${index[chapter].name}</banner>
          <p class="docText">${index[chapter].intro}</p>
        </div>
      `;
    }
  }

  return {
    content: content,
  };
}
