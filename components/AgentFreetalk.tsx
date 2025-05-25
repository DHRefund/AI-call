"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation"; // Not used anymore after removing redirect

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
// import { createLessonFeedback } from "@/lib/actions/lesson.action"; // Not used for freetalk feedback
import {
  vietNamFreeTalkAssistant,
  englishFreeTalkAssistant,
  japaneseFreeTalkAssistant,
} from "@/constants/lessonByLanguage";
import { languages } from "@/constants";
import Transcript from "@/components/Transcript";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface AgentFreetalkProps {
  userName: string;
  userId: string; // Kept for potential future use (e.g., saving transcript)
  language: string;
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const AgentFreetalk = ({ userName, userId, language }: AgentFreetalkProps) => {
  // const router = useRouter(); // Not used anymore
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]); // Used for transcript display
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const saveFreetalkTranscript = async (messages: SavedMessage[]) => {
      console.log("Freetalk session finished. Transcript not currently saved.");
    };

    if (callStatus === CallStatus.FINISHED) {
      console.log("Freetalk session finished.");
      saveFreetalkTranscript(messages); // Call the placeholder save function
    }
  }, [messages, callStatus]); // userId, language not strictly needed here for placeholder

  // Vapi event listeners
  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    // Refined type for message based on common use cases like transcript
    const onMessage = (message: { type: string; transcriptType?: string; role: string; transcript: string }) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role as "user" | "system" | "assistant", content: message.transcript }; // Cast role for SavedMessage type
        setMessages((prev) => [...prev, newMessage]);
      }
      // Handle other message types for freetalk if needed
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
      setCallStatus(CallStatus.INACTIVE); // Reset status on error
      // Show user an error message
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on(
      "message",
      onMessage as (message: any) => void // Cast to any for Vapi SDK message type flexibility
    );
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage as (message: any) => void);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);
  let selectedAssistant;
  let selectedLanguage;
  switch (language) {
    case "vi":
      selectedLanguage = "Tiếng Việt";
      selectedAssistant = vietNamFreeTalkAssistant;
      break;
    case "English":
    case "en":
      selectedLanguage = "English";
      selectedAssistant = englishFreeTalkAssistant;
      break;
    case "Japanese":
    case "ja":
      selectedLanguage = "日本語";
      selectedAssistant = japaneseFreeTalkAssistant;
      break;
    default:
      console.error(`Freetalk assistant not found for language: ${language}`);
      setCallStatus(CallStatus.INACTIVE); // Reset status if assistant not found
      return; // Stop the function execution
  }

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    // Use 'any[]' to bypass potential strict type issues with the SDK definition for these arrays
    // Explicitly list message types expected by the client/server based on Vapi docs
    // const clientMessagesConfig: Array<"transcript" | "status-update" | "speech-update" | "error"> = [
    //   "transcript",
    //   "status-update",
    //   "speech-update",
    //   "error",
    // ];
    // const serverMessagesConfig: Array<"status-update" | "speech-update" | "error"> = [
    //   "status-update",
    //   "speech-update",
    //   "error",
    // ];

    try {
      await vapi.start(selectedAssistant, {
        variableValues: { language: selectedLanguage, userName: userName }, // Pass language and user name to assistant prompt
      });
    } catch (error) {
      console.error("Error starting Vapi call:", error);
      setCallStatus(CallStatus.INACTIVE); // Reset status on error
      // Show user an error message
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <>
      <div className="call-view">
        {/* AI Assistant Card */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image src="/ai-avatar.png" alt="profile-image" width={65} height={54} className="object-cover" />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Freetalk ({selectedLanguage})</h3>
          <div className="w-full flex justify-center m-2">
            {callStatus !== CallStatus.ACTIVE ? (
              <button
                className="relative btn-call"
                onClick={handleCall}
                disabled={callStatus === CallStatus.CONNECTING || callStatus === CallStatus.FINISHED}
              >
                <span
                  className={cn(
                    "absolute animate-ping rounded-full opacity-75",
                    callStatus !== CallStatus.CONNECTING && "hidden"
                  )}
                />
                <span className="relative">
                  {callStatus === CallStatus.INACTIVE
                    ? "Start Freetalk"
                    : callStatus === CallStatus.CONNECTING
                    ? "Connecting..."
                    : "Freetalk Ended"}
                </span>
              </button>
            ) : (
              <button className="btn-disconnect" onClick={handleDisconnect}>
                End Freetalk
              </button>
            )}
          </div>
        </div>

        {/* User Profile Card */}
        <Transcript messages={messages} callStatus={callStatus} />
      </div>
    </>
  );
};

export default AgentFreetalk;
