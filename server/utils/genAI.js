const dotenv = require("dotenv");
dotenv.config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-001",
  generationConfig: {
    temperature: 0.4,
    top_p: 0.9,
    responseMimeType: "application/json",
  },
});

module.exports = model;
