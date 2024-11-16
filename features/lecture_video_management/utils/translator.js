const translate = require("translate-google");
function translateText() {
  const translateInput = document.getElementById("translateInput");
  const originalString = translateInput.value ? translateInput.value : "";

  translate(originalString, { to: "vi" })
    .then((translatedString) => {
      const translateOutput = document.getElementById("translateOutput");
      translateOutput.value = translatedString;
    })
    .catch((error) => {
      console.error("there is problem translating the text", error);
    });
}
