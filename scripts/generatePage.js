function generatePage(manual) {
  console.log(manual);
  let methodContent;
  let detailsContent;

  let content = `
    <div class="docHead">
      <h1 class="docName">${manual.name}</h1>
      <h3 class="docTitle">${manual.title}</h3>
    </div>
  `;

  for (let chapter of manual.chapters) {
    if (chapter.name === "METHODS") {
      methodContent += `
        <div class="docDiv">
          <banner class="docChapter">METHODS</banner>
      `;

      if (chapter.nest) {
        for (let method of chapter.nest) {
          methodContent += `
          <div class="docMethod">
            <h4 class="methodSection">${method.name}</h4>
          </div>
          `;
        }
      }
      methodContent += `</div>`;
      content += methodContent;
    } else if (chapter.name === "DETAILS") {
      detailsContent += `
        <div class="docDiv">
          <banner class="docChapter">DETAILS</banner>
      `;

      if (chapter.nest) {
      }

      detailsContent += `</div>`;
      content += detailsContent;
    } else {
      content += `
        <div class="docDiv">
          <banner class="docChapter">${chapter.name}</banner>
          <p class="docText">${chapter.description}</p>
        </div>
      `;
    }
  }

  return {
    content: content,
  };
}
