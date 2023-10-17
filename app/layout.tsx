import "./globals.css";
import Footer from "@/components/footer";
import Session from "@/contexts/session-provider";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "minimal",
  description: "Minimal Todo App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Session>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster />
          </div>
        </Session>
      </body>
    </html>
  );
}
