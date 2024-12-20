const sidebar = document.getElementById("sidebar");
const collapseBtn = document.getElementById("collapseBtn");

// function for making the sidebar collapsible
collapseBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
  collapseBtn.textContent = sidebar.classList.contains("collapsed")
    ? ""
    : " hide";
});

// function for making the tool tab collapsible
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

const htmlContent = document.querySelector(".html-content");
const resizeHandle = document.querySelector(".resize-handle");

let isResizing = false;

// Mouse down event to start resizing
resizeHandle.addEventListener("mousedown", (e) => {
  isResizing = true;
  document.body.style.cursor = "ew-resize";
  document.addEventListener("mousemove", resize);
  document.addEventListener("mouseup", stopResize);
});

function resize(e) {
  if (!isResizing) return;

  // Calculate the new width based on the container and mouse position
  const containerWidth = document.body.offsetWidth; // Total width of the window
  const minWidth = containerWidth * 0.2; // Minimum width is 20% of the window width
  const maxWidth = containerWidth * 0.6; // Maximum width is 50% of the window width
  const newWidth = containerWidth - e.clientX;

  // Enforce minimum and maximum width
  if (newWidth >= minWidth && newWidth <= maxWidth) {
    htmlContent.style.width = `${newWidth}px`;
  }
}

function stopResize() {
  isResizing = false;
  document.body.style.cursor = "default";
  document.removeEventListener("mousemove", resize);
  document.removeEventListener("mouseup", stopResize);
}
