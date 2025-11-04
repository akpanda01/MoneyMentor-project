import { checkUser } from "@/lib/checkUser";
import Image from "next/image";
import Link from "next/link";
import AuthButtons from "./auth-buttons"; 

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
        <AuthButtons />

      </nav>
    </div>
  );
};

export default Header;