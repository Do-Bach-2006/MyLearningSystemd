async function modelInitiallize() {
  const PATH_TO_USER_DATABASE = await ipcRenderer.invoke("get-user-data-path");
  const PATH_TO_SETTING_FOLDER = path.join(PATH_TO_USER_DATABASE, "settings");

  if (fs.existsSync(PATH_TO_SETTING_FOLDER) == false) {
    fs.mkdirSync(PATH_TO_SETTING_FOLDER);
  }

  const PATH_TO_MODEL_SETTING = path.join(
    PATH_TO_SETTING_FOLDER,
    "geimini_model.json",
  );

  if (fs.existsSync(PATH_TO_MODEL_SETTING) == false) {
    fs.writeFileSync(
      PATH_TO_MODEL_SETTING,
      JSON.stringify({ model: "gemini-1.5-flash" }), // DEFAULT IS ALWAYS GEMINI 1.5 FLASH
    );
  }

  let SELECTED_MODEL = JSON.stringify(fs.readFileSync(PATH_TO_MODEL_SETTING));

  const modelSelect = document.getElementById("modelSelect");

  modelSelect.value = SELECTED_MODEL.model;

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
}

modelInitiallize();
