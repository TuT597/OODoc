document.addEventListener("DOMContentLoaded", function () {
  const navSection = document.getElementById("navSection");
  const navListMainSelections = document.querySelectorAll(".mainSelection");
  const navSearchBar = document.getElementById("navSearchBar");

  const contentDiv = document.getElementById("contentDiv");

  const relationsSection = document.getElementById("relationsSection");

  //Select intro  and load its content when website is first loaded
  fetch("html files/introduction.html")
    .then((response) => response.text())
    .then((html) => {
      contentDiv.innerHTML = html;
    });

  //Loop over all the main options in the navList and add click functions to them
  navListMainSelections.forEach(function (mainSelection) {
    mainSelection.addEventListener("click", function () {
      const fileName = mainSelection.textContent.trim().toLowerCase();

      //Check if menu option is a drop-down if so swap arrow icon
      if (mainSelection.querySelector(".navListIcon i")) {
        const icon = mainSelection.querySelector(".navListIcon i");

        if (icon) {
          icon.classList.toggle("fa-chevron-right");
          icon.classList.toggle("fa-chevron-down");
        }

        // Fetch the list of files in the subdirectory and put them in an array
        fetch("html files/docs/" + fileName + "/")
          .then((response) => response.text())
          .then((html) => {
            // Parse the directory listing (assuming it's an HTML page)
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;
            const links = tempDiv.querySelectorAll("a");
            const files = [];
            links.forEach((link) => {
              const href = link.getAttribute("href");
              // Filter out parent directory links and directories
              if (href && href !== "../" && href.endsWith(".html")) {
                // Get the last part of the href (filename), remove .html extension if present
                let file = href.split("/").pop();
                file = file.replace(".html", "");
                files.push(file);
              }
            });
            console.log(files);
            //Loop throug the generated file array to generate menu listings for all the files
            files.forEach((file) => {
              const navigationListElement = document.createElement("span");
              navigationListElement.className = "navigationListElement";
              navigationListElement.innerText = file;

              document
                .getElementById(fileName + "ListDiv")
                .appendChild(navigationListElement);
            });
          });
      }
      //If menu option is not a drop down then open related file in content section
      else {
        fetch("html files/" + fileName + ".html")
          .then((response) => response.text())
          .then((html) => {
            contentDiv.innerHTML = html;
          });
      }
    });
  });
});
