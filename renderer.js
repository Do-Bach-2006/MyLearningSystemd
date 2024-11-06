/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".button-54");

  console.log("it was here !");

  button.addEventListener("click", () => {
    // Send a message to load the lecture video management page
    ipcRenderer.send(
      "load-page",
      "./feature/lecture_video_management/index.html",
    );
  });
});

// document.addEventListener("DOMContentLoaded", () => {
//   const mainContent = document.getElementById("main-content");
//   const dynamicContent = document.getElementById("dynamic-content");
//   const button = document.querySelector(".button-54");
//
//   button.addEventListener("click", async () => {
//     try {
//       // Hide the main content
//       mainContent.style.display = "none";
//
//       // Fetch the content of the external HTML file
//       const response = await fetch(
//         "./feature/lecture_video_management/index.html",
//       );
//       if (!response.ok) throw new Error("Failed to load content");
//
//       // Get the HTML as text
//       const html = await response.text();
//
//       // Inject the HTML into the dynamic content div
//       dynamicContent.innerHTML = html;
//
//       // Show the dynamic content
//       dynamicContent.style.display = "block";
//     } catch (error) {
//       console.error("Error loading page:", error);
//       mainContent.style.display = "block"; // Show main content if there was an error
//     }
//   });
// });
