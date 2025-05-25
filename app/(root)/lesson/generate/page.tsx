import CreateLessonForm from "@/components/CreateLessonForm";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }
  return (
    <div className="py-8 max-w-xl mx-auto">
      <CreateLessonForm userId={user.id} />
    </div>
  );
};

export default Page;
