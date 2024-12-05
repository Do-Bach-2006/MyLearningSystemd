const sidebar = document.getElementById("sidebar");
const collapseBtn = document.getElementById("collapseBtn");

// function for making the sidebar collapsible
collapseBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
  collapseBtn.textContent = sidebar.classList.contains("collapsed") ? "󰞘" : "󰞗";
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
