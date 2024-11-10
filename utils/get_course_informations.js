"use strict";

const path = require("path");
const fs = require("fs");

const PATH_TO_COURSES_DATABASE = path.join(__dirname, "../database/courses/");
const PATH_TO_COURSES_JSON = path.join(__dirname, "../database/courses.json");
const PATH_TO_COURSES_INFO_JSON = path.join(
  __dirname,
  "../database/courses_info.json",
);

const courses = JSON.parse(fs.readFileSync(PATH_TO_COURSES_JSON));

function getCourseInfo() {
  let coursesInfo = [];
  if (fs.existsSync(PATH_TO_COURSES_INFO_JSON)) {
    // check for the courseInfo.json

    coursesInfo = JSON.parse(fs.readFileSync(PATH_TO_COURSES_INFO_JSON));
  } else {
    fs.writeFileSync(PATH_TO_COURSES_INFO_JSON, "[]"); // we write [] be cause it hold an array
  }
  return coursesInfo;
}

const coursesInfo = getCourseInfo();

let courseNames = new Set();

/*
 * the infoObject will have
 * { name: "" , {video1 , path , pathToNote , lastViewTime } , {video2 , path , pathToNote , lastViewTime} ... }
 * TODO: add note feature
 *
 * */
// convert information to name for better searching
coursesInfo.forEach((infoObject) => {
  courseNames.add(infoObject.name);
});

let course_and_videos = [];

function recurGetVideos(pathToCourse, videos) {
  function isDirectory(pathToCheck) {
    return path.extname(pathToCheck) === "";
  }

  const videoFileExtensions = [".mkv", ".mp4"];

  fs.readdirSync(pathToCourse).forEach((file) => {
    // const middleDirectories = path.join(...childDirectories);
    // console.log(middleDirectories);
    const PATH_TO_FILE = path.join(pathToCourse, file);

    if (isDirectory(PATH_TO_FILE)) {
      // we recur here , the PATH_TO_FILE is already add up to that specific file
      recurGetVideos(PATH_TO_FILE, videos);
    } else if (videoFileExtensions.includes(path.extname(PATH_TO_FILE))) {
      videos.push({
        name: file,
        pathToVideoURL: PATH_TO_FILE,
        lastViewTime: 0,
      });
    }
  });
}

courses.forEach((course) => {
  // get information about newly added course
  if (!courseNames.has(course.name)) {
    let videos = [];
    recurGetVideos(course.path, videos);

    coursesInfo.push({
      name: course.name,
      path: course.path,
      videos: videos,
    });
  }
});

console.log("whoo hoow");
fs.writeFileSync(PATH_TO_COURSES_INFO_JSON, JSON.stringify(coursesInfo));

// const process = require("process");
//
// console.log(process.cwd());
// console.log("greeting from get_course_informations");
