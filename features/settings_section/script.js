const path = require("path");
const fs = require("fs");

const PATH_TO_API_KEY_JSON = path.join(
  __dirname,
  "..",
  "..",
  "database",
  "api_key.json",
);

function save_api_key() {
  const apiInput = document.getElementById("apiInput");

  const api_key = apiInput.value;
  const api_key_string = JSON.stringify({ key: api_key });
  fs.writeFileSync(PATH_TO_API_KEY_JSON, api_key_string);
}
