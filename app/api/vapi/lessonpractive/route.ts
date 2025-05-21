import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { v4 as uuidv4 } from "uuid";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  const { topic, level, goal, userid } = await request.json();
  console.log("topic", topic, "level", level, "goal", goal, "userid", userid);

  try {
    const { text: questions } = await generateText({
      // model: google("gemini-2.0-pro-exp-02-05"),
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a talk about ${topic}.
        The level of the talk is ${level}.
        The goal of the talk is ${goal}.
        Please prepare 10 questions related to the topic, suitable for the user's level and learning goals.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

    const lessonPractice = {
      id: uuidv4(), // Generate a unique ID
      topic: topic,
      level: level,
      goal: goal,
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("lessonpratice").add(lessonPractice);

    return Response.json({ success: true, lessonPractice }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
