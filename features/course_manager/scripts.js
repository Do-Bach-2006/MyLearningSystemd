function createNewCourseDiv(courseName, pathToCourse) {
  const newDiv = document.createElement("div");
  newDiv.className = "course-div";

  const heading = document.createElement("h1");
  heading.textContent = courseName;
  newDiv.appendChild(heading);

  const deleteButton = document.createElement("h2");
  // we add a span here to style the button fit with h2
  const iconSpan = document.createElement("span");
  iconSpan.textContent = "";
  deleteButton.appendChild(iconSpan);
  deleteButton.className = "delete-button";

  //TODO: the button function goes here !

  const { confirmDelete } = require("./utils/deleteCourse.js");
  deleteButton.addEventListener("click", async () => {
    alert(await confirmDelete(pathToCourse));
  });

  newDiv.appendChild(deleteButton);

  return newDiv;
}

async function init() {
  // essential modules
  const fs = require("fs");
  const path = require("path");
  const { ipcRenderer } = require("electron");

  const PATH_TO_USER_DATABASE = await ipcRenderer.invoke("get-user-data-path");
  const PATH_TO_COURSES_INFO_JSON = path.join(
    PATH_TO_USER_DATABASE,
    "courses_info.json",
  );

  const coursesInfo = JSON.parse(fs.readFileSync(PATH_TO_COURSES_INFO_JSON));
  console.log(coursesInfo);
  const courses_container = document.getElementById("coursesContainer");
  // key is the courseName : courseObject
  for (const [courseName, courseObject] of Object.entries(coursesInfo)) {
    const div = createNewCourseDiv(courseName, courseObject.path);
    courses_container.appendChild(div);
  }
}

init();
