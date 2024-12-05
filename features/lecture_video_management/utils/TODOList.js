function newTODODiv() {
  const TODO = document.createElement("div");
  TODO.classList.add("TODO");

  const textArea = document.createElement("textarea");
  textArea.classList.add("TODOTextArea");
  textArea.placeholder = "Enter your TODO here...";

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("TODODeleteButton");
  deleteButton.textContent = "X";

  const markDoneInput = document.createElement("input");
  markDoneInput.type = "checkbox";
  markDoneInput.classList.add("TODOMarkDoneInput");

  // Add event listener to handle checkbox state change
  markDoneInput.addEventListener("change", () => {
    if (markDoneInput.checked) {
      textArea.classList.add("completed"); // add the style for completed task
    } else {
      textArea.classList.remove("completed"); // remove the completed style
    }
  });

  // Add event listener to handle delete button click
  deleteButton.addEventListener("click", () => {
    TODO.remove(); // Remove the TODO div
  });

  TODO.appendChild(textArea);
  TODO.appendChild(deleteButton);
  TODO.appendChild(markDoneInput);

  return TODO;
}

function createNewTODO() {
  const TODOBox = document.getElementById("TODOBox");
  TODOBox.appendChild(newTODODiv());
}
