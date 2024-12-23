const fs = require("fs");
const path = require("path");
const { ipcRenderer } = require("electron");

async function initialize() {
  let PATH_TO_USER_DATABASE = "";

  // Get user data path asynchronously
  PATH_TO_USER_DATABASE = await ipcRenderer.invoke("get-user-data-path");
  console.log("User Data Path:", PATH_TO_USER_DATABASE); // This will now be correct

  const PATH_TO_COURSES_DATABASE = path.join(PATH_TO_USER_DATABASE, "courses");
  const PATH_TO_COURSES_INFO_JSON = path.join(
    PATH_TO_USER_DATABASE,
    "courses_info.json",
  );

  /*
   * coursesInfo be like :
   * {
   *    courseName : {
   *      coursePath : string
   *      videos :
   *      {
   *          name : {
   *              path : string,
   *              lastViewTime : number
   *              progress : number
   *          }
   *      }
   *    }
   * }
   */

  function getCoursesInfo() {
    let coursesInfo = {};
    if (fs.existsSync(PATH_TO_COURSES_INFO_JSON)) {
      // read the data if file exists
      coursesInfo = JSON.parse(fs.readFileSync(PATH_TO_COURSES_INFO_JSON));
    }
    console.log(coursesInfo);

    return coursesInfo;
  }

  function isDirectory(inputPath) {
    const stat = fs.statSync(inputPath);
    return stat.isDirectory();
  }

  function saveCourseInfo(coursesInfo) {
    fs.writeFileSync(PATH_TO_COURSES_INFO_JSON, JSON.stringify(coursesInfo));
  }

  function syncCourses(coursesInfo) {
    function recurGetVideos(
      pathToCourse,
      childDirectories,
      courseInfo,
      courseName,
    ) {
      const VIDEO_EXTENSIONS = [".mkv", ".mp4"];

      const generateVideoName = (courseName, childDirectories, videoName) => {
        // we add middleName based on ancestor directories to distinguish between the video names
        const middleName = childDirectories.join("_");

        return middleName !== ""
          ? courseName + "<sep>" + middleName + "<sep>" + videoName
          : courseName + "<sep>" + videoName;
      };

      fs.readdirSync(pathToCourse).forEach((file) => {
        const PATH_TO_FILE = path.join(pathToCourse, file);

        if (isDirectory(PATH_TO_FILE)) {
          // we recur here, the PATH_TO_FILE is already added up to that specific file
          // childDirectories is used for a distinct video name!
          childDirectories.push(file);
          recurGetVideos(
            PATH_TO_FILE,
            childDirectories,
            courseInfo,
            courseName,
          );
          childDirectories.pop();
        } else if (VIDEO_EXTENSIONS.includes(path.extname(PATH_TO_FILE))) {
          // if this is a video, we compare with the information we have in the courseInfo
          const videoName = generateVideoName(
            courseName,
            childDirectories,
            file,
          );

          // if this is a new video, we add it
          if (courseInfo.videos[videoName] === undefined) {
            courseInfo.videos[videoName] = {
              path: PATH_TO_FILE,
              lastViewTime: 0,
              progress: 0,
            };
          }
        }
      });
    }

    Object.getOwnPropertyNames(coursesInfo).forEach((courseName) => {
      // TODO: travel to the path here !
      console.log(courseName);

      courseObject = coursesInfo[courseName];
      // the coursePath is already set so we don't have to worry about it.
      recurGetVideos(courseObject.path, [], courseObject, courseName);
    });

    // fs.readdirSync(PATH_TO_COURSES_DATABASE).forEach((courseName) => {
    //   const COURSE_PATH = path.join(PATH_TO_COURSES_DATABASE, courseName);
    //
    //   let courseInfo = coursesInfo[courseName];
    //
    //   if (courseInfo === undefined) {
    //     courseInfo = {
    //       path: COURSE_PATH,
    //       videos: {},
    //     };
    //     coursesInfo[courseName] = courseInfo;
    //   }
    //
    //   // for each course, we loop through its children to gather all the videos
    //   if (isDirectory(COURSE_PATH)) {
    //     recurGetVideos(COURSE_PATH, [], courseInfo, courseName);
    //   }
    // });
  }

  function cleanUpCourseInfo(coursesInfo) {
    // if the path to the course is not exists, we remove it from coursesInfo

    Object.getOwnPropertyNames(coursesInfo).forEach((courseName) => {
      if (coursesInfo[courseName].path === undefined) {
        delete coursesInfo[courseName];
      }

      if (isDirectory(coursesInfo[courseName].path) === false) {
        delete coursesInfo[courseName];
      }
    });
  }

  console.log(PATH_TO_COURSES_DATABASE);
  // create database if not exist
  if (!fs.existsSync(PATH_TO_COURSES_DATABASE)) {
    fs.mkdirSync(PATH_TO_COURSES_DATABASE);
    console.log("new directory created!");
  }

  const coursesInfo = getCoursesInfo();
  cleanUpCourseInfo(coursesInfo);
  syncCourses(coursesInfo);
  saveCourseInfo(coursesInfo);

  console.log("yay");
}

// Call initialize function to start everything
initialize();
