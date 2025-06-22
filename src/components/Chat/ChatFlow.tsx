import { useState } from "react";
import ApplicantForm from "./ApplicantForm";
import ChatInterface from "./ChatInterface";
import type { ApplicantData } from "../../types";

const ChatFlow: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [applicantData, setApplicantData] = useState<ApplicantData | null>(
    null
  );

  const handleApplicantSuccess = (
    newSessionId: string,
    data: ApplicantData
  ) => {
    setSessionId(newSessionId);
    setApplicantData(data);
  };

  // Show form if no session ID, otherwise show chat
  if (!sessionId || !applicantData) {
    return <ApplicantForm onSuccess={handleApplicantSuccess} />;
  }

  return <ChatInterface sessionId={sessionId} applicantData={applicantData} />;
};

export default ChatFlow;
