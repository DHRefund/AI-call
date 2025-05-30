import LessonCard from "@/components/LessonCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getAdminLessonPractice, getLessonPracticeByUserId } from "@/lib/actions/lesson.action";
import { redirect } from "next/navigation";
import Link from "next/link";

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  const [userLessonPractice, allLessonPractice] = await Promise.all([
    getLessonPracticeByUserId(user.id),
    getAdminLessonPractice(),
  ]);

  return (
    <>
      <section className="flex flex-col gap-6 mt-8">
        <div className="flex items-center gap-4 justify-between">
          <h2>Your Lesson</h2>
          <Link href="/lesson/generate">
            <button className="btn-primary px-4 py-2 rounded-md font-semibold">
              + Create your own lesson with more languages
            </button>
          </Link>
        </div>
        <div className="interviews-section">
          {userLessonPractice && userLessonPractice.length > 0 ? (
            userLessonPractice.map((lessonPractice, index) => (
              <LessonCard
                key={lessonPractice.id}
                userId={user.id}
                lessonId={userLessonPractice[index].id}
                topic={lessonPractice.topic}
                type="notType"
                language={lessonPractice?.language}
                level={lessonPractice.level}
                createdAt={lessonPractice.createdAt}
              />
            ))
          ) : (
            <p>You haven&apos;t taken any lessons yet, let&apos;s create one for own your practice</p>
          )}
        </div>
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Take Lesson</h2>
        <div className="interviews-section">
          {allLessonPractice && allLessonPractice.length > 0 ? (
            allLessonPractice.map((lessonPractice) => (
              <LessonCard
                key={lessonPractice.id}
                userId={user.id}
                lessonId={lessonPractice.id}
                topic={lessonPractice.topic}
                type="notType"
                level={lessonPractice.level}
                createdAt={lessonPractice.createdAt}
              />
            ))
          ) : (
            <p>There are no lessons available</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Page;
