import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { createChatSession, sendMessage } from "../../services/api";
import type { ChatMessage, ChatSession, ApplicantData } from "../../types";

interface ChatInterfaceProps {
  sessionId?: string;
  applicantData?: ApplicantData;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  sessionId,
  applicantData,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeSession();
  }, []);

  useEffect(() => {
    // Add welcome message if applicant data is available
    if (applicantData && session) {
      const welcomeMessage: ChatMessage = {
        id: `welcome-${Date.now()}`,
        content: `Hello ${applicantData.name}! I'm your university chatbot assistant. I have your contact information (${applicantData.email}) and I'm here to help you with any questions about our university programs, admissions, or student life. How can I assist you today?`,
        timestamp: new Date().toISOString(),
        sender: "bot",
      };
      setMessages([welcomeMessage]);
    }
  }, [applicantData, session]);

  const initializeSession = async () => {
    try {
      if (sessionId) {
        // Use provided session ID
        setSession({
          session_id: sessionId,
          created_at: new Date().toISOString(),
        });
      } else {
        // Create new session
        const newSession = await createChatSession();
        setSession(newSession);
      }
    } catch (err) {
      setError("Failed to initialize chat session. Please try again.");
      console.error("Failed to create session:", err);
    }
  };

  const handleSendMessage = async (messageContent: string) => {
    if (!session) {
      setError("No active session. Please refresh the page.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessage(session.session_id, messageContent);

      // Create user and bot messages from the response
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: messageContent,
        timestamp: new Date().toISOString(),
        sender: "user",
      };

      const botMessage: ChatMessage = {
        id: response.message_id,
        content: response.response,
        timestamp: new Date().toISOString(),
        sender: "bot",
      };

      setMessages((prev) => [...prev, userMessage, botMessage]);
    } catch (err) {
      setError("Failed to send message. Please try again.");
      console.error("Failed to send message:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    if (!session) {
      initializeSession();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {error && (
        <div className="bg-red-50 border-b border-red-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-sm text-red-800">{error}</span>
            </div>
            <button
              onClick={handleRetry}
              className="text-sm text-red-600 hover:text-red-500 font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={isLoading || !session}
      />
    </div>
  );
};

export default ChatInterface;
