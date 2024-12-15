"use strict";
// JavaScript for collapse functionality
const path = require("path");
const fs = require("fs");
const { save_notes, get_notes } = require("./utils/notes.js");
const { ipcRenderer } = require("electron");
const { setInterval } = require("timers");

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
    if (lastVideoTag != null) lastVideoTag.classList.remove("selected-course");
    newVideoTag.classList.add("selected-course");
    return newVideoTag;
  }

  const videoButtons = [];
  // function to create the video button
  // we have to put it here inoreder to use global variable
  function createVideoButton(videoName, videoObject) {
    // create video tag
    const videoLink = document.createElement("div");
    videoLink.classList.add("video-tag");
    // the video is considered completed when user watch 90% of the video
    if (videoObject.progress >= 90) videoLink.classList.add("completed-course");

    const title = document.createElement("h5");
    title.textContent = videoName;
    videoLink.appendChild(title);

    // add function when user click on the video tag
    videoLink.onclick = async function () {
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
    const videoButton = await createVideoButton(videoName, videoObject);
    sidebar.appendChild(videoButton);
    videoButtons.push(videoButton);
  }

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

  function extractTotalTimer() {
    const videoPlayer = document.getElementById("mainVideo");
    const totalTime = videoPlayer.duration;

    return totalTime == NaN ? 0 : totalTime;
  }

  function getProgress(videoDuration, currentPlayTime) {
    /* return false if user has not beeen watch about 90% of the video, return true otherwise
     * */

    return (currentPlayTime / videoDuration) * 100;
  }

  function autoSaveTimer() {
    if (selectedVideo === null) {
      console.log("no video saved");

      return;
    }

    console.log(selectedVideo);

    const currentPlayTime = extractTimer();
    const videoDuration = extractTotalTimer();

    selectedVideo.lastViewTime = currentPlayTime;

    // we alway keep track of the highest progress!
    selectedVideo.progress = Math.max(
      getProgress(videoDuration, currentPlayTime),
      selectedVideo.progress,
    );

    console.log(selectedVideo.progress);

    fs.writeFileSync(
      PATH_TO_COURSES_INFO_JSON,
      JSON.stringify(coursesInfo, null, 4),
    );
  }

  // auto save time every 4 seconds
  setInterval(autoSaveTimer, 4000);

  function playNextVideo() {
    /*
     *  this function will find the next video to play inorder:
     *      incomplete video ( 1 )
     *      next video in the list (2)
     *      first video in the list (3)
     * */

    // have sort the order of the videoObject so the corresspoding button will
    // have the same index as the videoObject
    let index = 0;
    let lastVideoName = "";
    let nextVideoTag = undefined;

    for (const [videoName, videoObject] of Object.entries(
      courseObject.videos,
    )) {
      // this code is checking if the current video is the last video , if it is , we memory
      // it and play it in case there is no nearest incomplete video found
      //console.log(CURRENT_VIDEO_NAME, " ", lastVideoName);

      if (CURRENT_VIDEO_NAME == lastVideoName) {
        nextVideoTag = videoButtons[index];
      }
      lastVideoName = videoName;

      // load the video ;
      if (videoObject.progress < 90) {
        console.log(videoName + " " + videoObject.progress);
        videoButtons[index].click(); // trigger the next video button
        return "play nearest";
      }

      index += 1;
    }

    // if we can't find the nearest incomplete video , we should process to the next video in the order
    if (nextVideoTag) {
      nextVideoTag.click();

      return "play next";
    }

    // if there is no next video , we should process to the first video
    videoButtons[0].click();
    return "play first";
  }

  function addEventListenerToVideoPlayerWhenFinishVideo() {
    const videoPlayer = document.getElementById("mainVideo");
    const refeshAndPlayNext = async () => {
      const returnPhrase = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(playNextVideo());
        }, 1000);
      });

      console.log(returnPhrase);
      if (returnPhrase == "play nearest") {
        window.location.reload(); // we reload as the UI updated
      }
    };
    videoPlayer.addEventListener("ended", refeshAndPlayNext);
  }

  // we load the nearest incomplete video when first load the page
  playNextVideo();

  addEventListenerToVideoPlayerWhenFinishVideo();
}

initialize();
