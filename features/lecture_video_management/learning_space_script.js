// JavaScript for collapse functionality
const path = require("path");
const fs = require("fs");
const { save_notes, get_notes } = require("./utils/notes.js");

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

// create the quill editor
const quill = new Quill("#editor", {
  theme: "snow",
});

let CURRENT_VIDEO_NAME = "?";
let selectedVideo = null;

// create button to switch between courses
coursesInfo.forEach((courseInfo) => {
  if (courseInfo.name === selectedCourse[0]) {
    courseInfo.videos.sort((stringA, stringB) => {
      // this is a sort function to sort videos by number in it's description

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

      // add function when user click on the video tag

      videoLink.onclick = function () {
        // TODO: highlight the loaded videos when user selected it !
        //videoLink.classList.add("selected");

        // load the video
        const videoPlayer = document.getElementById("mainVideo");
        videoPlayer.src = video.pathToVideoURL;
        videoPlayer.currentTime = video.lastViewTime;

        // load the note for the video
        const editorContent = get_notes(video.name);

        CURRENT_VIDEO_NAME = video.name;

        if (editorContent) {
          quill.setContents(editorContent);
        } else {
          // set empty contents as there is no note for the video yet
          quill.setContents([]);
          console.error("Failed to load notes.");
        }

        // create the corresponding prompt for the video
        const initPrompt = `Imagine that you are a professional who is likely to answer everything the student ask. I'm a student with little or no knowledge , watching a video name ${video.name} , I want you to assist me learning it . Please respond in simple text format without any markdown decoration and in details way as you instruct me `;
        const respond = getAIRespond(initPrompt);

        console.log(initPrompt);
        console.log(respond);

        // mark the video is selected for later saving
        selectedVideo = video;
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

// TODO: the save note button should be triggered when saving too ! and when the user click to return back , the autoSave should be called too !
// TODO: put these auto save in another file , then we pass the argument into it !
function extractTimer() {
  const videoPlayer = document.getElementById("mainVideo");
  const currentTime = videoPlayer.currentTime;

  return currentTime;
}

function autoSaveTimer() {
  if (selectedVideo === null) {
    console.log("no video saved");
    return;
  }

  selectedVideo.lastViewTime = extractTimer();
  console.log("auto save timer called");
  console.log(coursesInfo);
  fs.writeFileSync(
    PATH_TO_COURSES_INFO_JSON,
    JSON.stringify(coursesInfo, null, 4),
  );
}

setInterval(autoSaveTimer, 10000);
