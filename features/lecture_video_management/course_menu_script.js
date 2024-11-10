//import { get_all_courses } from "./utils/get_course_directories.mjs";

//const courses = get_all_courses();

const path = require("path");
const fs = require("fs");

const courses_container = document.getElementById("courses-container");

function create_new_course_button(course_object) {
  //create the div
  const div = document.createElement("div");
  div.classList.add("course");

  //create the content
  const h4 = document.createElement("h4");
  h4.textContent = course_object.name;

  div.appendChild(h4);

  div.onclick = () => {
    console.log("clicked on", h4.textContent);

    const PATH_TO_SELECTED_COURSE_JSON = path.join(
      __dirname,
      "selected_course.json",
    );

    try {
      fs.writeFileSync(
        PATH_TO_SELECTED_COURSE_JSON,
        JSON.stringify([h4.textContent]),
      );
      console.log("File written successfully");
    } catch (error) {
      console.error("Error writing file:", error);
    }

    const link = document.getElementById("learning_space");
    link.click();
  };

  return div;
}

console.log(__dirname);

const PATH_TO_COURSES_JSON = path.join(
  __dirname,
  "../../database/courses.json",
);

const courses = JSON.parse(fs.readFileSync(PATH_TO_COURSES_JSON));

courses.forEach((course) => {
  courses_container.appendChild(create_new_course_button(course));
  console.log("i was here !");
});
