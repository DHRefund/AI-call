"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createLessonPractice } from "@/lib/actions/lesson.action";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
  topic: z.string().min(1, { message: "Topic is required." }),
  goal: z.string().min(1, { message: "Goal is required." }),
  level: z.string().min(1, { message: "Level is required." }),
  language: z.string().min(1, { message: "Language is required." }),
});

const levels = ["Beginner", "Intermediate", "Advanced"];
const languages = [
  { code: "English", label: "English" },
  { code: "Japanese", label: "日本語 (Japanese)" },
  { code: "Tiếng Việt", label: "Tiếng Việt" },
  { code: "Français", label: "Français" },
  { code: "Chinese", label: "Chinese" },
];

type CreateLessonFormProps = { userId: string };

const CreateLessonForm = ({ userId }: CreateLessonFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      goal: "",
      level: levels[0],
      language: languages[0].code,
    },
  });
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await createLessonPractice({
      topic: values.topic,
      level: values.level,
      goal: values.goal,
      userId,
      language: values.language,
    });
    if (result.success) {
      router.push("/lesson");
      setErrorMessage("");
    } else {
      setErrorMessage(result.error || "Unknown error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-2xl bg-white/20 dark:bg-neutral-900/60 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl px-16 py-12 flex flex-col gap-8"
        style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)" }}
      >
        <h2 className="text-3xl font-extrabold text-center mb-4 text-white drop-shadow-lg tracking-wide">
          ✨ Create a new lesson
        </h2>
        <div className="flex flex-col gap-3">
          <label htmlFor="topic" className="font-bold text-lg text-white flex items-center gap-2">
            📝 Topic
          </label>
          <Input
            id="topic"
            placeholder="e.g. Daily Conversation"
            {...form.register("topic")}
            className="rounded-2xl px-5 py-3 text-base bg-white/80 dark:bg-neutral-800 border border-white/30 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
          />
          {form.formState.errors.topic && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.topic.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="goal" className="font-bold text-lg text-white flex items-center gap-2">
            🎯 Goal
          </label>
          <Input
            id="goal"
            placeholder="e.g. Practice speaking about travel"
            {...form.register("goal")}
            className="rounded-2xl px-5 py-3 text-base bg-white/80 dark:bg-neutral-800 border border-white/30 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
          />
          {form.formState.errors.goal && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.goal.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="level" className="font-bold text-lg text-white flex items-center gap-2">
            📈 Level
          </label>
          <select
            id="level"
            {...form.register("level")}
            className="rounded-2xl px-5 py-3 text-base bg-white/80 dark:bg-neutral-800 border border-white/30 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
          >
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          {form.formState.errors.level && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.level.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="language" className="font-bold text-lg text-white flex items-center gap-2">
            🌐 Language
          </label>
          <select
            id="language"
            {...form.register("language")}
            className="rounded-2xl px-5 py-3 text-base bg-white/80 dark:bg-neutral-800 border border-white/30 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
          {form.formState.errors.language && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.language.message}</p>
          )}
        </div>
        {errorMessage && <div className="text-red-400 text-base mb-2 text-center font-semibold">{errorMessage}</div>}
        <Button
          type="submit"
          className="w-full py-4 rounded-2xl font-extrabold text-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-105 hover:from-indigo-600 hover:to-pink-600 text-white shadow-2xl mt-2 transition-all duration-200"
        >
          🚀 Create Lesson
        </Button>
      </form>
    </div>
  );
};

export default CreateLessonForm;
