import AgentFreetalk from "@/components/AgentFreetalk";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { language: string } }) => {
  const { language } = params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  // Placeholder data - replace with actual lesson/questions logic if needed
  // const placeholderLesson = {
  //   id: "freetalk-" + language, // Unique ID
  //   topic: "Free Talk in " + language.toUpperCase(), // Topic based on language
  //   level: "Any Level", // Or determine level if needed
  //   goal: "Practice speaking freely", // Goal
  //   language: language, // Use the language from params
  //   questions: [], // No specific questions for freetalk
  //   userId: user.id,
  //   finalized: true,
  //   coverImage: "/covers/default.png", // Default cover
  //   createdAt: new Date().toISOString(),
  // };

  // Note: For actual freetalk, you might not need predefined questions.
  // The AI assistant config will handle the conversation flow.

  return (
    <div className="py-8 min-w-full mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Free Talk</h1>
      <AgentFreetalk userName={user.name} userId={user.id} language={language} />
    </div>
  );
};

export default Page;
