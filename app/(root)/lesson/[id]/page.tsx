import Image from "next/image";
import { redirect } from "next/navigation";

import AgentLesson from "@/components/AgentLesson";
import { getRandomInterviewCover } from "@/lib/utils";

import { getLessonById, getLessonByAdmin } from "@/lib/actions/lesson.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import DisplayTechIcons from "@/components/DisplayTechIcons";

const LessonDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();

  //   Lấy interview theo id
  const lesson = await getLessonById(id);

  //   Nếu vẫn không có, redirect về trang chủ
  if (!lesson) {
    redirect("/");
  }

  return (
    <>
      <div className="flex flex-row gap-4 justify-center min-w-full items-center border border-dark-200 rounded-lg p-4">
        <div className="flex flex-row gap-4 items-center justify-center  max-sm:flex-col">
          <div className="flex flex-col gap-4 items-center justify-center">
            <h3 className="capitalize">Topic: {lesson.topic}</h3>
            <h3 className="capitalize">Goal: {lesson.goal}</h3>
          </div>
          <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit"> {lesson.level}</p>
        </div>
      </div>

      <AgentLesson
        userName={user!.name}
        userId={user?.id}
        language={lesson.language}
        lessonId={lesson.id}
        questions={lesson.questions}
        feedbackId={lesson.feedbackId}
      />
    </>
  );
};

export default LessonDetails;
