async function deleteCourse(coursePath) {
  const fs = require("fs");

  if (!fs.existsSync(coursePath)) {
    return "Course does not exist";
  } else {
    fs.rmSync(coursePath, { recursive: true, force: true });
    return "Course deleted";
  }
}

function confirmDelete(coursePath) {
  try {
    if (
      !confirm(
        `are you sure you want to delete ${coursePath}? The course directory will be deleted permanently.`,
      )
    ) {
      return "aborted";
    }

    deleteCourse(coursePath);
    window.location.reload(); // reload the page for better UI
    return "delete completed";
  } catch (error) {
    return "something went wrong. Code: " + error.toString();
  }
}

module.exports = { confirmDelete };
