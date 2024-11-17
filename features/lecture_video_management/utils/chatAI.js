const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");

const PATH_TO_API_KEY = path.join(
  __dirname,
  ".. ",
  "..",
  "..",
  "..",
  "database",
  "api_key.json",
);

const API_KEY_OBJECT = require(PATH_TO_API_KEY);

const genAI = new GoogleGenerativeAI(API_KEY_OBJECT.key);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
  const newAnswer = document.createElement("div");
  newAnswer.classList.add("message");
  newAnswer.textContent = await getAIRespond(prompt);
  outputElement.appendChild(newAnswer);
}
