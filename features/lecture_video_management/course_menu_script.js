const path = require("path");
const fs = require("fs");
const { ipcRenderer } = require("electron");

function createFrontendButton(displayContent) {
  //create the div
  const div = document.createElement("div");
  div.classList.add("course");

  //create the content
  const h4 = document.createElement("h4");
  h4.textContent = displayContent;
  div.appendChild(h4);

  console.log("created", h4.textContent);

  return div;
}

function createNewCourseButton(courseName, PATH_TO_SELECTED_COURSE_JSON) {
  const div = createFrontendButton(courseName);

  // add function when user click on the course
  div.onclick = () => {
    // save the selected course
    try {
      fs.writeFileSync(
        PATH_TO_SELECTED_COURSE_JSON,
        JSON.stringify([courseName]),
      );
      console.log("File written successfully");
    } catch (error) {
      console.error("Error writing file:", error);
    }

    // move to next page
    window.location.href = "./learning_space.html";
  };

  return div;
}

async function initCall() {
  const PATH_TO_USER_DATABASE = await ipcRenderer.invoke("get-user-data-path");
  const PATH_TO_TEMPT_DATABASE = await ipcRenderer.invoke("get-temp-dir");

  console.log(PATH_TO_USER_DATABASE);
  console.log(PATH_TO_TEMPT_DATABASE);

  const PATH_TO_COURSES_INFO_JSON = path.join(
    PATH_TO_USER_DATABASE,
    "courses_info.json",
  );
  const PATH_TO_SELECTED_COURSE_JSON = path.join(
    PATH_TO_TEMPT_DATABASE,
    "selected_course.json",
  );

  const coursesInfo = JSON.parse(fs.readFileSync(PATH_TO_COURSES_INFO_JSON));

  const courses_container = document.getElementById("courses-container");

  // key is the courseName : courseObject
  for (const [courseName, courseObject] of Object.entries(coursesInfo)) {
    const div = createNewCourseButton(courseName, PATH_TO_SELECTED_COURSE_JSON);
    courses_container.appendChild(div);
  }
}

initCall();
