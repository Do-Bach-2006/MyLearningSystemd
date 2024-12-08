"use strict";
// JavaScript for collapse functionality
const path = require("path");
const fs = require("fs");
const { save_notes, get_notes } = require("./utils/notes.js");
const { ipcRenderer } = require("electron");

function sortFunction(stringA, stringB) {
  /* this is a sort function to sort videos by number in it's description
   *
   *
   * @param {string} stringA
   * @param {string} stringB
   *
   * return -1 , 1 or 0 based on the calculated order of stringA and stringB
   * */

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
  const numbersA = getNumbers(stringA);
  const numbersB = getNumbers(stringB);

  for (let i = 0; i < Math.min(numbersA.length, numbersB.length); i++) {
    if (numbersA[i] > numbersB[i]) {
      return 1;
    } else if (numbersA[i] < numbersB[i]) {
      return -1;
    }
  }

  return numbersA.length - numbersB.length;
}
let CURRENT_VIDEO_NAME = "?";
let selectedVideo = null;
let selectedVideoTag = null;

async function initialize() {
  const PATH_TO_USER_DATABASE = await ipcRenderer.invoke("get-user-data-path");
  const PATH_TO_TEMPT_DATABASE = await ipcRenderer.invoke("get-temp-dir");

  const PATH_TO_COURSES_INFO_JSON = path.join(
    PATH_TO_USER_DATABASE,
    "courses_info.json",
  );
  const PATH_TO_SELECTED_COURSE_JSON = path.join(
    PATH_TO_TEMPT_DATABASE,
    "selected_course.json",
  );

  // create the quill editor
  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    ["link", "image", "video", "formula"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"], // remove formatting button
  ];

  const quill = new Quill("#editor", {
    theme: "snow",
  });

  function quillSetContent(editorContent) {
    if (editorContent) {
      quill.setContents(editorContent);
    } else {
      // set empty contents as there is no note for the video yet
      quill.setContents([]);
      console.error("Failed to load notes.");
    }
  }

  const coursesInfo = JSON.parse(fs.readFileSync(PATH_TO_COURSES_INFO_JSON));
  const selectedCourse = JSON.parse(
    fs.readFileSync(PATH_TO_SELECTED_COURSE_JSON),
  );

  const courseObject = coursesInfo[selectedCourse[0]];
  // courseObject.videos.sort(sortFunction);
  courseObject.videos = Object.fromEntries(
    Object.entries(courseObject.videos).sort(([key1], [key2]) =>
      sortFunction(key1, key2),
    ),
  );

  function toggleSelectedVideo(lastVideoTag, newVideoTag) {
    if (lastVideoTag != null) lastVideoTag.classList.remove("selected");
    newVideoTag.classList.add("selected");
    return newVideoTag;
  }

  // function to create the video button
  // we have to put it here inoreder to use global variable
  function createVideoButton(videoName, videoObject) {
    // create video tag
    const videoLink = document.createElement("div");
    videoLink.classList.add("video-tag");
    const title = document.createElement("h5");
    title.textContent = videoName;
    videoLink.appendChild(title);

    // add function when user click on the video tag
    videoLink.onclick = async function () {
      // TODO: highlight the loaded videos when user selected it !
      //videoLink.classList.add("selected");

      // load the video
      const videoPlayer = document.getElementById("mainVideo");
      videoPlayer.src = videoObject.path;
      videoPlayer.currentTime = videoObject.lastViewTime;
      console.log(videoObject.lastViewTime);

      // load the note for the video
      quillSetContent(await get_notes(videoName));

      CURRENT_VIDEO_NAME = videoName;

      // mark the selected video for later saving view progress
      selectedVideo = videoObject;

      // toggle the video selected
      selectedVideoTag = toggleSelectedVideo(selectedVideoTag, videoLink);
    };

    return videoLink;
  }

  for (const [videoName, videoObject] of Object.entries(courseObject.videos)) {
    const sidebar = document.getElementById("sidebar");
    sidebar.appendChild(await createVideoButton(videoName, videoObject));
  }

  // Assuming `quill` and `CURRENT_VIDEO_NAME` are already defined

  // function for save notes
  function saveContent() {
    const editorContent = quill.getContents();

    save_notes(CURRENT_VIDEO_NAME, editorContent);
  }

  // we have to assign the event . I don't know why when remove this , the script break . So don't touch it !
  const saveButton = document.getElementById("saveNoteButton");
  saveButton.addEventListener("click", saveContent);

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

    console.log(selectedVideo);

    selectedVideo.lastViewTime = extractTimer();

    fs.writeFileSync(
      PATH_TO_COURSES_INFO_JSON,
      JSON.stringify(coursesInfo, null, 4),
    );
  }

  // auto save time every 10 seconds
  setInterval(autoSaveTimer, 10000);
}
// TODO : save the current selected div button for styling purpose
// create buttons to switch between courses

initialize();
console.log("ligamball");
