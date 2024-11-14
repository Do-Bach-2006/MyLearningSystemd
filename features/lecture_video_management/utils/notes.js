// const fs = require("fs");
// const markdownToDelta = require("markdown-to-quill-delta");
// const de
// console.log(PATH_TO_NOTES_DATABSE);
//
// function save_notes(videoName, deltaContent) {
//   const PATH_TO_VIDEO_NOTES = path.join(
//     PATH_TO_NOTES_DATABSE,
//     `${videoName}.md`,
//   );
//
//   let markdownContent = deltaToMarkdown(deltaContent);
//   fs.writeFileSync(PATH_TO_VIDEO_NOTES, markdownContent);
// }
// function get_notes(videoName) {
//   const PATH_TO_VIDEO_NOTES = path.join(
//     PATH_TO_NOTES_DATABSE,
//     `{videoName}.md`,
//   );
//
//   let markdownContent = "";
//   try {
//     markdownContent = fs.readFileSync(PATH_TO_VIDEO_NOTES, "utf-8");
//   } catch {
//     markdownContent = "";
//   }
//   let delta = markdownToDelta(markdownContent);
//   return delta;
// }
//
// module.exports = { save_notes, get_notes };

const fs = require("fs");
const path = require("path");
const { fromDelta, toDelta } = require("delta-markdown-for-quill");
const { deltaToMarkdown } = require("quill-delta-to-markdown");

const PATH_TO_NOTES_DATABSE = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "database",
  "notes",
);

console.log(PATH_TO_NOTES_DATABSE);

function getPathToVideoNote(videoName) {
  // cut off the .mp4
  let name = videoName.slice(0, -4);

  const PATH_TO_VIDEO_NOTES = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "database",
    "notes",
    `${name}.md`,
  );

  return PATH_TO_VIDEO_NOTES;
}

function save_notes(videoName, deltaContent) {
  const PATH_TO_VIDEO_NOTES = getPathToVideoNote(videoName);

  console.log(PATH_TO_VIDEO_NOTES);

  try {
    const markdownContent = deltaToMarkdown(deltaContent.ops);
    console.log(markdownContent);
    console.log(deltaContent);
    fs.writeFileSync(PATH_TO_VIDEO_NOTES, markdownContent);
    console.log("Notes saved successfully.");
  } catch (error) {
    console.error("Error saving notes:", error);
  }
}

function get_notes(videoName) {
  const PATH_TO_VIDEO_NOTES = getPathToVideoNote(videoName);
  try {
    const markdownContent = fs.readFileSync(PATH_TO_VIDEO_NOTES, "utf-8");
    return toDelta(markdownContent);
  } catch (error) {
    console.error("Error reading file:", error);
    return null;
  }
}

module.exports = { save_notes, get_notes };
