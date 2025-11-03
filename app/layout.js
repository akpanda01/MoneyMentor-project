import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"]});
export const metadata = {
  title: "Money Mentor",
  description: "AI powered personal finance management system",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
      <body
        className={`${inter.className} `}
      >

        {/* Header */}
        <Header/>
        <main className="min-h-screen">{children}</main>

        <Toaster richColors/>
        {/* Footer */}
      <footer className="bg-blue-50 w-full h-20 flex items-center justify-center border-t mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-black">
            &copy; 2025 Money Mentor. All rights reserved.
          </p>
        </div>
      </footer>
      </body>
    </html>
    </ClerkProvider>
    
  );
}
