// JavaScript for collapse functionality
const path = require("path");
const { save_notes, get_notes } = require("./utils/notes.js");

const sidebar = document.getElementById("sidebar");
const collapseBtn = document.getElementById("collapseBtn");

collapseBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
  collapseBtn.textContent = sidebar.classList.contains("collapsed")
    ? "Expand"
    : "Collapse";
});

// JavaScript for collapsible functionality
document.querySelectorAll(".collapsible").forEach((button) => {
  button.addEventListener("click", () => {
    const content = button.nextElementSibling;
    // Toggle display of content
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
});

const PATH_TO_SELECTED_COURSE_JSON = path.join(
  __dirname,
  "selected_course.json",
);

const PATH_TO_COURSES_INFO_JSON = path.join(
  __dirname,
  "../../database/courses_info.json",
);

const selectedCourse = require(PATH_TO_SELECTED_COURSE_JSON);
const coursesInfo = require(PATH_TO_COURSES_INFO_JSON);
console.log(selectedCourse.toString());
console.log(coursesInfo);

const quill = new Quill("#editor", {
  theme: "snow",
});

let CURRENT_VIDEO_NAME = "?";

coursesInfo.forEach((courseInfo) => {
  if (courseInfo.name === selectedCourse[0]) {
    courseInfo.videos.forEach((video) => {
      // create video tag
      const videoLink = document.createElement("div");
      videoLink.classList.add("video-tag");
      const title = document.createElement("h5");
      title.textContent = video.name;
      videoLink.appendChild(title);
      sidebar.appendChild(videoLink);

      // add function when we click on the video tag

      videoLink.onclick = function () {
        const videoPlayer = document.getElementById("main_video");
        videoPlayer.src = video.pathToVideoURL;

        const editorContent = get_notes(video.name);

        CURRENT_VIDEO_NAME = video.name;

        if (editorContent) {
          quill.setContents(editorContent);
        } else {
          console.error("Failed to load notes.");
        }
      };
    });
  }
});

function save_content() {
  console.log("button clicked");
  const editorContent = quill.getContents();

  save_notes(CURRENT_VIDEO_NAME, editorContent);
}

const saveButton = document.getElementById("saveNote");
saveButton.addEventListener("click", save_content);
