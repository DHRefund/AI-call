import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

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
            Hello, I&apos;m Friday, one of Ironman&apos;s assistants. You must know who he is, right? I&apos;m here to
            help you with many things across various fields — whether it&apos;s studying, entertainment, or practicing
            languages like English, Japanese, and more. Feel free to ask me anything, and I&apos;ll do my best to assist
            you!
          </h2>

          {/* <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button> */}
        </div>

        <Image src="/new/babyironman.png" alt="robo-dude" width={400} height={400} className="max-sm:hidden" />
      </section>

      <section className="card-cta">
        <Button asChild className="btn-primary max-sm:w-full">
          <Link href="/interview"> Interview</Link>
        </Button>
        <Button asChild className="btn-primary max-sm:w-full">
          <Link href="/lesson"> Lesson</Link>
        </Button>
      </section>
    </>
  );
}

export default Home;
