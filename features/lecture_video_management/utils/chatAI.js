const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");

const PATH_TO_API_KEY = path.join(
  __dirname,
  "..",
  ".. ",
  "..",
  "..",
  "settings",
  "api_key.json",
);

// WHY IT HAVE DIFFERENT PATH ?? I DON'T KNOW!
const PATH_TO_MODEL_SETTING = path.join(
  __dirname,
  "..",
  "..",
  "settings",
  "geimini_model.json",
);

const API_KEY_OBJECT = require(PATH_TO_API_KEY);

const selectedModel = require(PATH_TO_MODEL_SETTING);

console.log(selectedModel);

const genAI = new GoogleGenerativeAI(API_KEY_OBJECT.key);
const model = genAI.getGenerativeModel({ model: selectedModel.model });

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
