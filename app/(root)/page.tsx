import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import FreeTalkDropdown from "@/components/FreetalkDropdown";

import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId, getLatestInterviews } from "@/lib/actions/general.action";

async function Home() {
  const user = await getCurrentUser();
  console.log("user home page", user);

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>
            Hello! I'm an AI assistant. I know a lot and am here to help you with learning or expanding knowledge. I'll
            do my best to assist you.
          </h2>
        </div>

        <Image
          src="/new/babyironman.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden transition-transform duration-1500 ease-out transform-gpu animate-spin-scaled-up"
        />
      </section>

      <section className="flex flex-wrap justify-center gap-8 py-12">
        <Button
          asChild
          className="max-sm:w-full animate-slide-in-right rounded-full px-8 py-4 text-lg font-bold bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg transition-all duration-300"
          style={{ animationDelay: "200ms" }}
        >
          <Link href="/lesson">Lesson</Link>
        </Button>
        {/* <Button
          asChild
          className="max-sm:w-full animate-slide-in-right rounded-full px-8 py-4 text-lg font-bold bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-lg transition-all duration-300"
          style={{ animationDelay: "0ms" }}
        >
          <Link href="/interview">Interview</Link>
        </Button> */}

        <FreeTalkDropdown className="animate-slide-in-right" style={{ animationDelay: "400ms" }} />

        <Button
          asChild
          className="max-sm:w-full animate-slide-in-right rounded-full px-8 py-4 text-lg font-bold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg transition-all duration-300"
          style={{ animationDelay: "600ms" }}
        >
          <Link href="#">And More</Link>
        </Button>
      </section>
    </>
  );
}

export default Home;
