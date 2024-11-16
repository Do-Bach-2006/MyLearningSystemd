const fs = require("fs");
const path = require("path");

// this part of the code is for cross platform compatibility . We don't need it currently.
//
// global.convertPosixPathToWindowsPath = (path_name) => {
//   const LIST_OF_MOVES = path_name.split("/");
// };
//
// function get_courses_database() {
//   const STRING_FORMAT_PATH = "../../../database/courses";
//   const LIST_OF_MOVES = STRING_FORMAT_PATH.split("/");
//   return path.join(__dirname, ...LIST_OF_MOVES);
// }
//
// const PATH_TO_COURSES_DATABASE = get_courses_database();
//
//console.log(PATH_TO_COURSES_DATABASE);

const PATH_TO_COURSES_DATABASE = path.join(__dirname, "../database/courses/");
const PATH_TO_COURSES_JSON = path.join(__dirname, "../database/courses.json");
const courses = [];

fs.readdirSync(PATH_TO_COURSES_DATABASE).forEach((course_name) => {
  console.log(course_name);
  const isDirectory = (input_path) => {
    const stat = fs.statSync(input_path);
    return stat.isDirectory();
  };

  const course_path = path.join(PATH_TO_COURSES_DATABASE, course_name);
  if (isDirectory(course_path)) {
    courses.push({
      name: course_name,
      path: course_path,
    });
    console.log(course_path);
  }
});

fs.writeFileSync(PATH_TO_COURSES_JSON, JSON.stringify(courses));
//
// const process = require("process");
// console.log(process.cwd());
// console.log("greeting from get_course_directories.js");
