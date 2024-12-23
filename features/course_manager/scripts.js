function createNewCourseDiv(courseName, pathToCourse) {
  const newDiv = document.createElement("div");
  newDiv.className = "course-div";

  const heading = document.createElement("h1");
  heading.textContent = courseName;
  newDiv.appendChild(heading);

  // styling the delete button
  const deleteButton = document.createElement("h2");
  // we add a span here to style the button fit with h2
  let deleteIconSpan = document.createElement("span");
  deleteIconSpan.textContent = "󰬟";
  deleteButton.appendChild(deleteIconSpan);
  deleteButton.className = "delete-button";

  const { confirmDelete } = require("./utils/deleteCourse.js");
  deleteButton.addEventListener("click", async () => {
    alert(await confirmDelete(courseName));
  });

  newDiv.appendChild(deleteButton);

  // styling the erase button
  const eraseButton = document.createElement("h2");
  // we add a span here to style the button fit with h2
  let eraseIconSpan = document.createElement("span");
  eraseIconSpan.textContent = "";
  eraseButton.appendChild(eraseIconSpan);
  eraseButton.className = "erase-button";

  const { saveCourse } = require("./utils/saveCourse.js");
  const { deleteCourse } = require("./utils/deleteCourse.js");
  eraseButton.addEventListener("click", async () => {
    // we erase all the memory by remove the course and add it again
    deleteCourse(courseName);
    saveCourse(pathToCourse);
    console.log("course erased");
  });

  newDiv.appendChild(eraseButton);

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
