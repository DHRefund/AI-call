"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { interviewCovers as heroCovers } from "@/constants";
import { createLessonPractice } from "@/lib/actions/lesson.action";

//
// import { lessonPhrases } from "@/lib/lessonphrases";

const languages = [
  { code: "English", label: "English" },
  { code: "Japanese", label: "日本語 (Japanese)" },
  { code: "Tiếng Việt", label: "Tiếng Việt" },
  { code: "Français", label: "Français" },
  { code: "Chinese", label: "Chinese" },
  // Thêm các ngôn ngữ khác nếu muốn
];

const levels = ["Beginner", "Intermediate", "Advanced"];
// const types = ["Behavioral", "Technical", "Mixed"];
type CreateLessonCardProps = {
  userId: string;
};

const CreateLessonCard = ({ userId }: CreateLessonCardProps) => {
  const [topic, setTopic] = useState("");
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState(levels[0]);
  // const [type, setType] = useState(types[0]);
  const [language, setLanguage] = useState(languages[0].code);
  const [cover, setCover] = useState(heroCovers[Math.floor(Math.random() * heroCovers.length)]);
  const [creating, setCreating] = useState(false);

  const handleRandomCover = () => {
    setCover(heroCovers[Math.floor(Math.random() * heroCovers.length)]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const result = await createLessonPractice({ topic, level, goal, userId, language });
    if (result.success) {
      alert("Lesson created!");
      setCreating(false);
    } else {
      alert("Error: " + result.error);
      setCreating(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white/90 dark:bg-neutral-900 shadow-xl px-6 py-8 w-full max-w-md mx-auto flex flex-col gap-6"
    >
      <div className="flex flex-col items-center gap-2 relative">
        {/* Badge */}
        <div
          className={cn(
            "absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold",
            level === "Beginner"
              ? "bg-indigo-400 text-white"
              : level === "Intermediate"
              ? "bg-indigo-600 text-white"
              : "bg-indigo-800 text-white"
          )}
        >
          {level}
        </div>
        {/* Cover Image */}
        <Image
          src={`/covers${cover}`}
          alt="cover-image"
          width={96}
          height={96}
          className="rounded-full object-cover border-4 border-white dark:border-neutral-800 shadow-md mb-2 next-image-fix"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-0 mb-2 text-xs px-3 py-1 rounded-full"
          onClick={handleRandomCover}
        >
          Random Cover
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <Label htmlFor="topic" className="mb-1 font-semibold text-sm">
            Topic
          </Label>
          <Input
            id="topic"
            placeholder="e.g. Daily Conversation"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="goal" className="mb-1 font-semibold text-sm">
            Goal
          </Label>
          <Input
            id="goal"
            placeholder="e.g.Get more information"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="mt-1 text-muted-foreground"
          />
        </div>
        <div>
          <Label htmlFor="level" className="mb-1 font-semibold text-sm">
            Level
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" className="w-full justify-between">
                {level}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {levels.map((l) => (
                <DropdownMenuItem key={l} onSelect={() => setLevel(l)}>
                  {l}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* <div>
          <Label htmlFor="type" className="mb-1 font-semibold text-sm">
            Type
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" className="w-full justify-between">
                {type}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {types.map((t) => (
                <DropdownMenuItem key={t} onSelect={() => setType(t)}>
                  {t}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div> */}
        <div>
          <Label htmlFor="language" className="mb-1 font-semibold text-sm">
            Language
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" className="w-full justify-between">
                {languages.find((l) => l.code === language)?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {languages.map((lang) => (
                <DropdownMenuItem key={lang.code} onSelect={() => setLanguage(lang.code)}>
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Button
        className="w-full mt-2 rounded-full font-bold text-base py-3 bg-indigo-500 hover:bg-indigo-600 text-white transition"
        type="submit"
        disabled={creating}
      >
        {creating ? "Creating..." : "Go get them !!!"}
        {/* lessonPhrases[Math.floor(Math.random() * lessonPhrases.length)] */}
      </Button>
    </form>
  );
};

export default CreateLessonCard;
