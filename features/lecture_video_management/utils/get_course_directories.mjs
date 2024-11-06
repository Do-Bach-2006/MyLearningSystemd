import fs from "fs";
import path from "path";

const __dirname = import.meta.dirname;

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

export function get_all_courses() {
  /**
   * @returns {Array} an array of course objects
   *                  {
   *                    name : {string} name of the course
   *                    path : {string} path to the course
   *                  }
   **/

  const PATH_TO_COURSES_DATABASE = path.join(
    __dirname,
    "../../../database/courses/",
  );
  const courses = [];

  fs.readdirSync(PATH_TO_COURSES_DATABASE).forEach((course_name) => {
    const isDirectory = (input_path) => {
      const ext = path.extname(input_path);
      return ext === "";
    };

    const course_path = path.join(PATH_TO_COURSES_DATABASE, course_name);
    if (isDirectory(course_path)) {
      courses.push({
        name: course_name,
        path: course_path,
      });
      //console.log(course_path);
    }
  });

  return courses;
}
