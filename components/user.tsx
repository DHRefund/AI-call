"use client";

import { User as UserType } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/actions/auth.action";
import Image from "next/image";
interface UserProps {
  user: UserType;
}

export default function User({ user }: UserProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {/* <Image src={user.profileURL || "/new/ironman.jpg"} alt={user.name} width={32} height={32} /> */}
          <span>Hello, </span>
          <span className="font-bold">{user.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={signOut}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
