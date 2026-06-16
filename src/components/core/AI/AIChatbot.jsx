import React, { useState } from "react";
import { apiConnector } from "../../../services/apiConnector";
import { useSelector } from "react-redux";
import { AiOutlineMessage, AiOutlineClose, AiOutlineSend } from "react-icons/ai";

const AIChatbot = ({ courseId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I am your AI Teaching Assistant. How can I help you with this course?", sender: "ai" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
        const response = await apiConnector(
            "POST",
            "/api/v1/ai/chat",
            { message: userMessage.text, courseId },
            { Authorization: `Bearer ${token}` }
        );
        
        if (response?.data?.success) {
            setMessages((prev) => [...prev, { text: response.data.data, sender: "ai" }]);
        } else {
            setMessages((prev) => [...prev, { text: "Sorry, I am having trouble connecting.", sender: "ai" }]);
        }
    } catch (error) {
        console.error("Chat API Error:", error);
        setMessages((prev) => [...prev, { text: "Error connecting to server.", sender: "ai" }]);
    }
    
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-[350px] h-[450px] bg-richblack-800 border border-richblack-700 rounded-lg shadow-2xl flex flex-col overflow-hidden animate-float glassmorphism-dark">
          {/* Header */}
          <div className="bg-richblack-700 p-4 flex justify-between items-center border-b border-richblack-600">
            <h3 className="font-bold text-white flex items-center gap-2">
              <AiOutlineMessage className="text-yellow-50" />
              AI Assistant
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-richblack-300 hover:text-white transition-colors">
              <AiOutlineClose size={20} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 scrollbar-hide">
            {messages.map((msg, idx) => (
              <div key={idx} className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.sender === "user" ? "bg-yellow-50 text-richblack-900 self-end rounded-br-none" : "bg-richblack-700 text-white self-start rounded-bl-none border border-richblack-600"}`}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="bg-richblack-700 text-white self-start p-3 rounded-lg rounded-bl-none text-sm border border-richblack-600 w-16 flex justify-center">
                <span className="animate-pulse">...</span>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-richblack-700 bg-richblack-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask a question..."
              className="flex-1 bg-richblack-700 text-white rounded-md px-3 py-2 text-sm outline-none border border-richblack-600 focus:border-yellow-50 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-yellow-50 text-richblack-900 p-2 rounded-md hover:bg-yellow-100 transition-colors disabled:opacity-50"
            >
              <AiOutlineSend size={20} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-yellow-50 text-richblack-900 p-4 rounded-full shadow-[0_0_15px_rgba(255,214,10,0.4)] hover:shadow-[0_0_25px_rgba(255,214,10,0.6)] transition-all hover:-translate-y-1"
        >
          <AiOutlineMessage size={28} />
        </button>
      )}
    </div>
  );
};

export default AIChatbot;
