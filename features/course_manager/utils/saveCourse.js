async function saveCourse(PATH_TO_NEW_COURSE) {
  const { ipcRenderer } = require("electron");
  const path = require("path");
  const fs = require("fs");

  const PATH_TO_USER_DATABASE = await ipcRenderer.invoke("get-user-data-path");
  const PATH_TO_COURSES_INFO_JSON = path.join(
    PATH_TO_USER_DATABASE,
    "courses_info.json",
  );

  if (!fs.existsSync(PATH_TO_COURSES_INFO_JSON)) {
    fs.writeFileSync(PATH_TO_COURSES_INFO_JSON, "{}");
  }

  const COURSES_INFO_JSON = JSON.parse(
    fs.readFileSync(PATH_TO_COURSES_INFO_JSON),
  );

  // get courseName
  const courseName = path.basename(PATH_TO_NEW_COURSE);

  if (COURSES_INFO_JSON[courseName] === undefined) {
    COURSES_INFO_JSON[courseName] = {
      path: PATH_TO_NEW_COURSE,
      videos: {},
      completedVideoCount: 0,
    };
  } else {
    return `Khóa học trùng tên với một khóa học đã được thêm vào :  ${courseName} `;
  }

  // save information
  fs.writeFileSync(
    PATH_TO_COURSES_INFO_JSON,
    JSON.stringify(COURSES_INFO_JSON),
  );

  return "thêm khóa học thành công";
}

module.exports = { saveCourse };
