const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

let ai = null;
try {
    if (process.env.GEMINI_API_KEY) {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
} catch (e) {
    console.error("Failed to initialize Google Gen AI:", e);
}

exports.summarizeCourse = async (description, whatYouWillLearn) => {
    if (!ai) {
        return "AI feature is currently disabled. Please add GEMINI_API_KEY to .env";
    }
    const prompt = `Summarize the following course details in a professional, concise, and engaging way (max 3 sentences).\n\nDescription: ${description}\n\nWhat you will learn: ${whatYouWillLearn}`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("AI Summarize Error:", error);
        return "Failed to generate summary.";
    }
};

exports.chatWithAssistant = async (message, courseContext) => {
    if (!ai) {
        return "AI feature is currently disabled. Please add GEMINI_API_KEY to .env";
    }
    const prompt = `You are a helpful teaching assistant for a course. Use the following context to answer the student's question.\n\nContext:\n${courseContext}\n\nStudent Question: ${message}\n\nAnswer concisely and politely.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("AI Chat Error:", error);
        return "Sorry, I am having trouble connecting to the brain right now.";
    }
};
