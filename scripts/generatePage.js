function generatePage(manual) {
  console.log(manual);
  let methodContent;
  let detailsContent;

  let content = `
    <h1 class="docName">${manual.name}</h1>
    <h3 class="docTitle">${manual.title}</h3>
  `;

  for (let chapter of manual.chapters) {
    if (chapter.name === "METHODS") {
      methodContent += `<banner class="docChapter">METHODS</banner>`;
      if (chapter.nest) {
        for (let method of chapter.nest) {
          methodContent += `
      <h4 class="methodSection">${method.name}</h4>
      `;
        }
      }
    } else if (chapter.name === "DETAILS") {
      detailsContent += `<banner class="docChapter">DETAILS</banner>`;
      if (chapter.nest) {
      }
    } else {
      content += `
    <banner class="docChapter">${chapter.name}</banner>
    <p class="docText">${chapter.description}</p>
    `;
    }
  }

  content += methodContent;

  return {
    content: content,
  };
}
