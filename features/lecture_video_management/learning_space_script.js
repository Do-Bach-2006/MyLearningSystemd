// JavaScript for collapse functionality
const path = require("path");
const { save_notes, get_notes } = require("./utils/notes.js");

const sidebar = document.getElementById("sidebar");
const collapseBtn = document.getElementById("collapseBtn");

// function for making the sidebar collapsible
collapseBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
  collapseBtn.textContent = sidebar.classList.contains("collapsed")
    ? "Show all"
    : "Hide all ";
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

// create the quill editor
const quill = new Quill("#editor", {
  theme: "snow",
});

let CURRENT_VIDEO_NAME = "?";

// create button to switch between courses
coursesInfo.forEach((courseInfo) => {
  if (courseInfo.name === selectedCourse[0]) {
    courseInfo.videos.sort((stringA, stringB) => {
      function getNumbers(inputString) {
        let result = [];

        let lastNumCharacters = [];

        const number = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

        for (let char of inputString) {
          if (number.includes(char)) {
            lastNumCharacters.push(char);
          } else if (lastNumCharacters.length > 0) {
            result.push(parseInt(lastNumCharacters.join("")));
            lastNumCharacters = [];
          }
        }

        return result;
      }
      const numbersA = getNumbers(stringA.name);
      const numbersB = getNumbers(stringB.name);

      for (let i = 0; i < Math.min(numbersA.length, numbersB.length); i++) {
        if (numbersA[i] > numbersB[i]) {
          console.log(`${numbersA[i]} > ${numbersB[i]} true`);
          return 1;
        } else if (numbersA[i] < numbersB[i]) {
          console.log(`${numbersA[i]} > ${numbersB[i]} false`);

          return -1;
        }
      }

      return numbersA.length - numbersB.length;
    });

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
        // TODO: set the role for AI for corresponding video
        //
        const initPrompt = `Imagine that you are a professional who is likely to answer everything the student ask. I'm a student with little or no knowledge , watching a video name ${video.name} , I want you to assist me learning it . Please respond in simple text format without any markdown decoration and in details way as you instruct me `;

        const respond = getAIRespond(initPrompt);

        console.log(initPrompt);
        console.log(respond);
      };
    });
  }
});

// function for save notes
function save_content() {
  console.log("button clicked");
  const editorContent = quill.getContents();

  save_notes(CURRENT_VIDEO_NAME, editorContent);
}

const saveButton = document.getElementById("saveNote");
saveButton.addEventListener("click", save_content);
