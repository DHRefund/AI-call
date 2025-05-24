"use server";

import { generateText, generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";
import { getRandomInterviewCover } from "@/lib/utils";

// export async function getLessonPracticeByUserId(userId: string) {
//   const lessonPractice = await db.collection("lessonpratice").where("userId", "==", userId).get();
//   return lessonPractice.docs.map((doc) => doc.data());
// }
export async function getLessonPracticeByUserId(userId: string): Promise<Interview[] | null> {
  const interviews = await db
    .collection("lessonpratice")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getAdminLessonPractice(params: GetAdminLessonParams): Promise<Interview[] | null> {
  console.log("pa>>>>", params);

  // const { userId = "admin", limit = 20 } = params;
  const limit = 20;

  const interviews = await db
    .collection("lessonpratice")
    .orderBy("createdAt", "desc")
    .where("userId", "==", "admin")
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
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

export async function getLessonById(id: string): Promise<Lesson | null> {
  const interview = await db.collection("lessonpratice").doc(id).get();
  // console.log(interview.data());

  return interview.data() as Lesson | null;
}

export async function getLessonByAdmin(id: string): Promise<Lesson | null> {
  const interview = await db.collection("lessonpratice").doc(id).get();
  // console.log(interview.data());
  return interview.data() as Lesson | null;
}

export async function createLessonFeedback(params: {
  lessonId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}) {
  const { lessonId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map((sentence: { role: string; content: string }) => `- ${sentence.role}: ${sentence.content}\n`)
      .join("");

    // Prompt đánh giá buổi học ngôn ngữ
    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema, // Có thể tạo schema riêng nếu muốn
      prompt: `
        You are an AI language tutor analyzing a language practice session. Your task is to evaluate the learner based on structured categories. Be thorough and detailed in your analysis. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the learner from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Pronunciation**: Clarity and accuracy of pronunciation.
        - **Vocabulary**: Range and appropriateness of vocabulary used.
        - **Grammar**: Correctness and complexity of grammar.
        - **Fluency & Responsiveness**: Ability to respond naturally and maintain conversation flow.
        - **Confidence & Engagement**: Willingness to speak, confidence, and engagement in the session.
        `,
      system:
        "You are a professional language tutor analyzing a language practice session. Your task is to evaluate the learner based on structured categories.",
    });

    const feedback = {
      lessonId: lessonId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("lessonfeedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("lessonfeedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving lesson feedback:", error);
    return { success: false };
  }
}

// Lấy feedback theo lessonId và userId
export async function getFeedbackByLessonId(params: { lessonId: string; userId: string }): Promise<any | null> {
  const { lessonId, userId } = params;

  const querySnapshot = await db
    .collection("lessonfeedback")
    .where("lessonId", "==", lessonId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() };
}
