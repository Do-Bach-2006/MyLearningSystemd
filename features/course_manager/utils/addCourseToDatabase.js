function initSelectDirectoryButton() {
  const { ipcRenderer } = require("electron");

  const selectDirectoryButton = document.getElementById(
    "selectDirectoryButton",
  );
  const selectedPathDisplay = document.getElementById("selectedPath");

  // this path is for the index.html since we call this script in the index.html
  const { saveCourse } = require("./utils/saveCourse.js");

  selectDirectoryButton.addEventListener("click", async () => {
    const selectedPath = await ipcRenderer.invoke("select-directory");
    console.log(selectedPath);

    if (selectedPath == undefined) {
      return 0;
    }

    // AFTER WE SELECT A PATH , WE WILL HAVE TO CHECK IF THE COURSE NAME IS ALREADY EXIST
    alert(await saveCourse(selectedPath));

    // reload as we add new course
    window.location.reload();
  });
}

initSelectDirectoryButton();
