async function deleteCourse(courseName) {
  const { ipcRenderer } = require("electron");
  const path = require("path");
  const fs = require("fs");

  const PATH_TO_USER_DATABASE = await ipcRenderer.invoke("get-user-data-path");
  const PATH_TO_COURSES_INFO_JSON = path.join(
    PATH_TO_USER_DATABASE,
    "courses_info.json",
  );

  if (!fs.existsSync(PATH_TO_COURSES_INFO_JSON)) {
    //empty object at inintialization
    fs.writeFileSync(PATH_TO_COURSES_INFO_JSON, "{}");
  }

  const coursesInfo = JSON.parse(fs.readFileSync(PATH_TO_COURSES_INFO_JSON));
  delete coursesInfo[courseName];

  // save to courses_info.json
  fs.writeFileSync(PATH_TO_COURSES_INFO_JSON, JSON.stringify(coursesInfo));
}

function confirmDelete(courseName) {
  try {
    if (
      !confirm(`are you sure you want to remove the course name ${courseName}?`)
    ) {
      return "aborted";
    }

    deleteCourse(courseName);
    window.location.reload(); // reload the page for better UI
    return "delete completed";
  } catch (error) {
    return "something went wrong. Code: " + error.toString();
  }
}

module.exports = { confirmDelete, deleteCourse };
