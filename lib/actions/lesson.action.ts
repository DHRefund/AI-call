"use server";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";
import { getRandomInterviewCover } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

export async function getLessonPracticeByUserId(userId: string) {
  const lessonPractice = await db.collection("lessonpratice").where("userId", "==", userId).get();
  return lessonPractice.docs.map((doc) => doc.data());
}

export async function getAdminLessonPractice() {
  const lessonPractice = await db
    .collection("lessonpratice")
    .where("userId", "==", "admin")
    .orderBy("createdAt", "desc")
    .limit(10)
    .get();
  return lessonPractice.docs.map((doc) => doc.data());
}

type CreateLessonPracticeInput = {
  topic: string;
  level: string;
  goal: string;
  userId: string;
  language: string;
};

export async function createLessonPractice({ topic, level, goal, userId, language }: CreateLessonPracticeInput) {
  console.log("topic", topic, "language", language);

  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a talk about ${topic} with ${language}.
          The level of the talk is ${level}.
          The goal of the talk is ${goal}.
          Please prepare 10 questions related to the topic, suitable for the user's level and learning goals.
          The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
          Return the questions formatted like this:
          ["Question 1", "Question 2", "Question 3"]
          Thank you! <3
        `,
    });
    console.log(questions);

    const lessonPractice = {
      id: uuidv4(),
      topic,
      level,
      goal,
      language,
      questions: JSON.parse(questions),
      userId: userId,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("lessonpratice").add(lessonPractice);

    return { success: true, lessonPractice };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error: String(error) };
  }
}
