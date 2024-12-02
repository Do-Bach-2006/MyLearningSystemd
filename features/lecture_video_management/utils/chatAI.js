const {
  GoogleGenerativeAI,
  DynamicRetrievalMode,
} = require("@google/generative-ai");
const path = require("path");
const fs = require("fs");
const { ipcRenderer } = require("electron");

async function initAI() {
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

  const PATH_TO_MODEL_SETTING = path.join(
    PATH_TO_SETTING_FOLDER,
    "geimini_model.json",
  );

  if (fs.existsSync(PATH_TO_MODEL_SETTING) == false) {
    fs.writeFileSync(
      PATH_TO_MODEL_SETTING,
      JSON.stringify({ model: "gemini-1.5-flash" }),
    );
  }

  console.log(PATH_TO_API_KEY_JSON);
  console.log(PATH_TO_MODEL_SETTING);

  const API_KEY_OBJECT = require(PATH_TO_API_KEY_JSON);
  console.log(API_KEY_OBJECT);

  const selectedModel = require(PATH_TO_MODEL_SETTING);
  console.log(selectedModel);

  const genAI = new GoogleGenerativeAI(API_KEY_OBJECT.key);

  const model = genAI.getGenerativeModel({ model: selectedModel.model });
  // const model = genAI.getGenerativeModel(
  //   {
  //     model: selectedModel.model,
  //     tools: [
  //       {
  //         googleSearchRetrieval: {
  //           dynamicRetrievalConfig: {
  //             mode: DynamicRetrievalMode.MODE_DYNAMIC,
  //             dynamicThreshold: 0.65,
  //           },
  //         },
  //       },
  //     ],
  //   },
  //   { apiVersion: "v1beta" },
  // );
  //
  async function getAIRespond(prompt) {
    const result = await model.generateContent(prompt);

    return result.response.text();
  }

  async function generateAnswer() {
    const outputElement = document.getElementById("messageArea");
    const inputElement = document.getElementById("chatAIuserInput");

    const prompt = inputElement.value;
    inputElement.value = ""; // clear out the message as we send the prompt

    // create a ask message
    const newMessage = document.createElement("div");
    newMessage.classList.add("message");
    newMessage.classList.add("user");
    newMessage.textContent = prompt;
    outputElement.appendChild(newMessage);

    // create a response message
    const newAnswerContainer = document.createElement("div");
    newAnswerContainer.classList.add("message");

    const newAnswer = document.createElement("md-block");
    newAnswer.classList.add("message");
    newAnswer.textContent = await getAIRespond(prompt);

    newAnswerContainer.appendChild(newAnswer);

    outputElement.appendChild(newAnswerContainer);

    // outputElement.appendChild(newAnswer);
  }

  const sendButton = document.getElementById("sendButton");
  sendButton.addEventListener("click", generateAnswer);
}

initAI();
