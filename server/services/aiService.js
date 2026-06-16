const { GoogleGenAI } = require("@google/genai");
const Groq = require("groq-sdk");
require("dotenv").config();

let ai = null;
let groqAi = null;

try {
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here") {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
} catch (e) {
    console.error("Failed to initialize Google Gen AI:", e);
}

try {
    if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== "your_groq_api_key_here") {
        groqAi = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }
} catch (e) {
    console.error("Failed to initialize Groq SDK:", e);
}

exports.summarizeCourse = async (description, whatYouWillLearn) => {
    if (!ai && !groqAi) {
        return "AI feature is currently disabled. Please add GEMINI_API_KEY or GROQ_API_KEY to .env";
    }
    const prompt = `Summarize the following course details in a professional, concise, and engaging way (max 3 sentences).\n\nDescription: ${description}\n\nWhat you will learn: ${whatYouWillLearn}`;
    
    // Try Gemini First
    if (ai) {
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            return response.text;
        } catch (error) {
            console.error("AI Summarize Error (Gemini):", error.message);
            // Fallthrough to Groq if Gemini fails
        }
    }

    // Fallback to Groq
    if (groqAi) {
        try {
            const chatCompletion = await groqAi.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama3-8b-8192',
            });
            return chatCompletion.choices[0]?.message?.content || "";
        } catch (error) {
            console.error("AI Summarize Error (Groq):", error.message);
        }
    }

    return "Failed to generate summary.";
};

exports.chatWithAssistant = async (message, courseContext) => {
    if (!ai && !groqAi) {
        return "AI feature is currently disabled. Please add GEMINI_API_KEY or GROQ_API_KEY to .env";
    }
    const prompt = `You are a helpful teaching assistant for a course. Use the following context to answer the student's question.\n\nContext:\n${courseContext}\n\nStudent Question: ${message}\n\nAnswer concisely and politely.`;
    
    // Try Gemini First
    if (ai) {
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            return response.text;
        } catch (error) {
            console.error("AI Chat Error (Gemini):", error.message);
            // Fallthrough to Groq if Gemini fails
        }
    }

    // Fallback to Groq
    if (groqAi) {
        try {
            const chatCompletion = await groqAi.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama3-8b-8192',
            });
            return chatCompletion.choices[0]?.message?.content || "";
        } catch (error) {
            console.error("AI Chat Error (Groq):", error.message);
        }
    }

    return "Sorry, I am having trouble connecting to the brain right now.";
};
