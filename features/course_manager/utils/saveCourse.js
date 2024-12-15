async function getCoursesDatabase() {
  const { ipcRenderer } = require("electron");
  const path = require("path");
  const fs = require("fs");
  const PATH_TO_USER_DATABASE = await ipcRenderer.invoke("get-user-data-path");
  const PATH_TO_COURSES = path.join(PATH_TO_USER_DATABASE, "courses");

  if (!fs.existsSync(PATH_TO_COURSES)) {
    fs.mkdirSync(PATH_TO_COURSES);
  }

  return PATH_TO_COURSES;
}

async function saveCourse(PATH_TO_NEW_COURSE) {
  const fs = require("fs-extra");
  const path = require("path");

  const PATH_TO_COURSES = await getCoursesDatabase();

  // Get the course name from the path
  const courseName = path.basename(PATH_TO_NEW_COURSE);

  // Determine the destination path
  const destinationPath = path.join(PATH_TO_COURSES, courseName);

  try {
    // Check if the course already exists
    if (fs.pathExistsSync(destinationPath)) {
      console.log("Course existed");
      return "Course existed";
    }

    // Attempt to move the course
    await fs.move(PATH_TO_NEW_COURSE, destinationPath, { overwrite: false });
    console.log("Course added");
    window.location.reload(); // reload the page for better UI
    return "Course added";
  } catch (error) {
    console.error("Course cannot be added:", error.message);
    return "Course cannot be added";
  }
}

module.exports = { saveCourse };
