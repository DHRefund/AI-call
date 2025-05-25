"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer, lessonInterviewer } from "@/constants";
import { createLessonFeedback } from "@/lib/actions/lesson.action";
import {
  vietNamLessonInterviewer,
  englishLessonInterviewer,
  japaneseLessonInterviewer,
} from "@/constants/lessonByLanguage";
import Transcript from "@/components/Transcript";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface AgentLessonProps {
  userName: string;
  userId: string;
  language: string;
  lessonId: string;
  feedbackId: string;
  questions: string[];
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const AgentLesson = ({ userName, userId, language, lessonId, feedbackId, questions }: AgentLessonProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
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
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createLessonFeedback({
        lessonId: lessonId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/lesson/${lessonId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      handleGenerateFeedback(messages);
    }
  }, [messages, callStatus, feedbackId, lessonId, router, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    let formattedQuestions = "";
    if (questions) {
      formattedQuestions = questions.map((question) => `- ${question}`).join("\n");
    }

    let selectedAssistant;
    switch (language) {
      case "Tiếng Việt":
        selectedAssistant = vietNamLessonInterviewer;
        break;
      case "English":
        selectedAssistant = englishLessonInterviewer;
        break;
      case "Japanese":
        selectedAssistant = japaneseLessonInterviewer;
        break;
      default:
        // Fallback to a default assistant or handle the error
        console.error(`Assistant not found for language: ${language}`);
        // You might want to set an error state or redirect here
        setCallStatus(CallStatus.INACTIVE); // Reset status if assistant not found
        return; // Stop the function execution
    }

    await vapi.start(selectedAssistant, {
      variableValues: {
        questions: formattedQuestions,
      },
    });
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <>
      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image src="/ai-avatar.png" alt="profile-image" width={65} height={54} className="object-cover" />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Assistant</h3>
          <div className="w-full flex justify-center m-2">
            {callStatus !== "ACTIVE" ? (
              <button className="relative btn-call" onClick={() => handleCall()}>
                <span
                  className={cn(
                    "absolute animate-ping rounded-full opacity-75",
                    callStatus !== "CONNECTING" && "hidden"
                  )}
                />

                <span className="relative">
                  {callStatus === "INACTIVE" || callStatus === "FINISHED" ? "Call" : ". . ."}
                </span>
              </button>
            ) : (
              <button className="btn-disconnect" onClick={() => handleDisconnect()}>
                End
              </button>
            )}
          </div>
        </div>

        <Transcript messages={messages} callStatus={callStatus} />
      </div>
    </>
  );
};

export default AgentLesson;
