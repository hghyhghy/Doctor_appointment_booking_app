'use client';
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { TiPlus } from "react-icons/ti";
import { FiSend } from "react-icons/fi";


export default function AI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string  }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
   // Load messages from localStorage when the component mounts
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatHistory")
    if(savedMessages){
      setMessages(JSON.parse(savedMessages))
    }
    
  }, [])

    // Save messages to localStorage whenever they change
    useEffect(() => {
      if(messages.length > 0){
        localStorage.setItem('chatHistory', JSON.stringify(messages))
      }
    }, [messages])
    
  

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input, time: new Date().toLocaleTimeString() };
    setInput("");
    setLoading(true);
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post(
        "http://localhost:3001/ai-integration/health-advice",
        { query: input }
      );
      const aiMessage = {
        role: "assistant",
        content: response.data || "No valid Response From AI",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.log(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I am not able to respond at the moment" },
      ]);
    }

    setLoading(false);
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end">
      {/* Toggle Chatbot Button */}
      <button
        className="bg-white border border-b-blue-950 text-black p-3 rounded shadow-lg items-center justify-center flex"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`text-3xl transform transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}><TiPlus /></span>
      </button>

      {/* Chatbot UI */}
      {isOpen && (
        <div className="w-[25rem] bg-white shadow-lg rounded-lg p-4 mt-2 h-[38rem] flex flex-col">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto mb-2 max-h-[30rem] pr-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 my-1 rounded-lg ${
                  msg.role === "user"
                    ? " text-right text-black"
                    : "bg-gray-100 text-left text-blue-950 p-5 border border-blue-950 mt-2"
                }`}
                style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
              >
                {msg.content} <span className="text-xs text-gray-400">{msg.time}</span>
              </div>
            ))}
            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Input & Send Button */}
          <div className="flex gap-2 w-full">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2  rounded-lg text-black w-[18rem] border border-blue-950"
              placeholder="Ask something..."
            />
            <button
              className="bg-blue-500 text-white p-2 rounded-lg"
              onClick={sendMessage}
              disabled={loading}
            >
              {loading ? "..." : <FiSend />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
