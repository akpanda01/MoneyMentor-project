import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";
import { checkUser } from "@/lib/checkUser";

const Header = async () =>  {
  await checkUser();
  return (
    <div className="fixed top-0 w-full bg-blue-50/80 backdrop-blur-md z-50 shadow-md">
      <nav className="container mx-auto flex items-center justify-between px-4 py-2">
        
        {/* Logo */}
        <Link href="/">
          <Image
            src={'/logo-mm1.png'}
            alt="MoneyMentor logo"
            height={50}
            width={250}
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline" className="text-white hover:text-blue-800 bg-blue-800 hover:border-blue-800"> Login </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href={"/dashboard"} className="text-blue-800 hover:text-black flex items-center gap-2">
              <Button variant="outline" className="flex items-center gap-2 border-blue-600 hover:border-blue-800">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>

            <Link href={"/transaction/create"} className="text-blue-800 hover:text-black flex items-center gap-2">
              <Button variant="outline" className="flex items-center gap-2 border-blue-600 hover:border-blue-800">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>

            <UserButton appearance={{
              elements:{
                avatarBox: "w-10 h-10",
              },
            }} />
          </SignedIn>
        </div>

      </nav>
    </div>
  );
};

export default Header;