"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

// Định nghĩa trạng thái cuộc gọi (CallStatus)
enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

// Props cho component
interface TranscriptCardProps {
  messages: Array<{
    role: string;
    content: string;
  }>;
  callStatus: CallStatus;
}

const TranscriptCard: React.FC<TranscriptCardProps> = ({ messages, callStatus }) => {
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="card-border">
      <div className="card-content">
        {/* Transcript display */}
        {messages.length > 0 ? (
          <div
            className="transcript flex-col-reverse overflow-y-auto max-h-96 h-96 transition-all duration-300 p-2 ease-in-out scroll-smooth scrollbar-hide"
            ref={transcriptRef}
          >
            {messages.map((message, index) => (
              <p
                key={index}
                className={cn(
                  "flex w-full",
                  message.role === "assistant" ? "justify-start text-left" : "justify-end text-right"
                )}
              >
                <div className={cn("rounded-2xl px-4 py-2 max-w-[70%] shadow break-words border-1")}>
                  {message.content}
                </div>
              </p>
            ))}
          </div>
        ) : (
          callStatus === CallStatus.INACTIVE && (
            <p className="text-center text-gray-500 dark:text-gray-400">Click 'Start ' to begin!</p>
          )
        )}
      </div>
    </div>
  );
};

export default TranscriptCard;
export { CallStatus };
