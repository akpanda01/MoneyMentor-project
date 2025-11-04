"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";
import Link from "next/link";

const AuthButtons = () => {
  return (
    <div className="flex items-center gap-4">
      <SignedOut>
        <SignInButton forceRedirectUrl="/dashboard">
          <Button variant="outline" className="text-white hover:text-blue-800 bg-blue-800 hover:border-blue-800">
            Login
          </Button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        {/* 2. Using the 'asChild' prop for cleaner HTML (best practice) */}
        <Button asChild className="bg-blue-900 hover:bg-blue-600">
          <Link href={"/dashboard"} className="flex items-center gap-2">
            <LayoutDashboard size={18} />
            <span className="hidden md:inline">Dashboard</span>
          </Link>
        </Button>

        {/* 2. Using 'asChild' here as well */}
        <Button asChild variant="outline" className="text-blue-800 hover:bg-blue-600 hover:text-white">
          <Link href={"/transaction/create"} className="flex items-center gap-2">
            <PenBox size={18} />
            <span className="hidden md:inline">Add Transaction</span>
          </Link>
        </Button>

        <UserButton appearance={{
          elements:{
            avatarBox: "w-10 h-10",
          },
        }} />
      </SignedIn>
    </div>
  );
};

export default AuthButtons;