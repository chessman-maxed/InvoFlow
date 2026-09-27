import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "InvoFlow — Intelligent Conversational Invoicing Workspace",
  description: "AI-powered conversational invoice generator for freelancers and small businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("dark", "antialiased", plusJakarta.variable, inter.variable, jetbrainsMono.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-screen bg-[#0e0e10] text-[#f3f4f6]">
        {children}
      </body>
    </html>
  );
}
