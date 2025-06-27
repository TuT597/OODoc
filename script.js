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
      console.log(mainSelection.textContent);

      //Swap between collapsed arrow and normal arrow on click
      if (mainSelection.querySelector(".navListIcon i")) {
        const icon = mainSelection.querySelector(".navListIcon i");
        if (icon) {
          icon.classList.toggle("fa-chevron-right");
          icon.classList.toggle("fa-chevron-down");
        }
      } else {
        const fileName = mainSelection.textContent.trim() + ".html";
        fetch("html files/" + fileName)
          .then((response) => response.text())
          .then((html) => {
            contentDiv.innerHTML = html;
          });
      }
    });
  });
});
