import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated, getCurrentUser } from "@/lib/actions/auth.action";
import { User as UserType } from "@/lib/actions/auth.action";
import User from "@/components/user";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  const user = await getCurrentUser();

  return (
    <div className="root-layout">
      <div className="flex justify-between items-center">
        <nav>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/new/ironman.jpg" alt="MockMate Logo" width={38} height={32} />
            <h2 className="text-primary-100">Friday by Ironman</h2>
          </Link>
        </nav>
        <User user={user as UserType} />
      </div>

      {children}
    </div>
  );
};

export default Layout;
