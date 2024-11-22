const PATH_TO_API_KEY_JSON = path.join(
  __dirname,
  "..",
  "..",
  "settings",
  "api_key.json",
);

function saveApiKey() {
  const apiInput = document.getElementById("apiInput");

  const api_key = apiInput.value;
  const api_key_string = JSON.stringify({ key: api_key });
  fs.writeFileSync(PATH_TO_API_KEY_JSON, api_key_string);
}
