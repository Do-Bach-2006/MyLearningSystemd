async function initialize() {
  const PATH_TO_USER_DATABASE = await ipcRenderer.invoke("get-user-data-path");

  const PATH_TO_SETTING_FOLDER = path.join(PATH_TO_USER_DATABASE, "settings");

  if (fs.existsSync(PATH_TO_SETTING_FOLDER) == false) {
    fs.mkdirSync(PATH_TO_SETTING_FOLDER);
  }

  const PATH_TO_API_KEY_JSON = path.join(
    PATH_TO_SETTING_FOLDER,
    "api_key.json",
  );

  if (fs.existsSync(PATH_TO_API_KEY_JSON) == false) {
    fs.writeFileSync(PATH_TO_API_KEY_JSON, JSON.stringify({ key: "" }));
  }

  const api_key_string = fs.readFileSync(PATH_TO_API_KEY_JSON, "utf-8");
  const api_key = JSON.parse(api_key_string).key;
  document.getElementById("apiInput").value = api_key;

  function saveApiKey() {
    const apiInput = document.getElementById("apiInput");

    const api_key = apiInput.value;
    const api_key_string = JSON.stringify({ key: api_key });
    fs.writeFileSync(PATH_TO_API_KEY_JSON, api_key_string);
  }

  document.getElementById("apiInput").addEventListener("input", saveApiKey);
}

initialize();
