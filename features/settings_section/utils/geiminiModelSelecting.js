const modelSelect = document.getElementById("modelSelect");

console.log(modelSelect);

let PATH_TO_MODEL_SETTING = path.join(
  __dirname,
  "..",
  "..",
  "settings",
  "geimini_model.json",
);

// DEFAULT IS ALWAYS GEMINI 1.5 FLASH
let SELECTED_MODEL = { model: "gemini-1.5-flash" };

// Update the variable whenever the selection changes
modelSelect.addEventListener("change", () => {
  SELECTED_MODEL = { model: modelSelect.value };
  console.log(SELECTED_MODEL);
  fs.writeFileSync(PATH_TO_MODEL_SETTING, JSON.stringify(SELECTED_MODEL));
});

console.log(PATH_TO_MODEL_SETTING);

// set the selected value to selected model
SELECTED_MODEL = require(PATH_TO_MODEL_SETTING).model;
modelSelect.value = SELECTED_MODEL;
