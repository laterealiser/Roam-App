import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roam | Find Your People, Wherever You Roam",
  description: "Roam connects you with people from your hometown who are living nearby — anonymously, until you're ready to say hello. Join 500+ travelers finding home abroad.",
  keywords: ["find people", "hometown", "expats", "students abroad", "anonymous chat", "networking", "relocation"],
  openGraph: {
    title: "Roam | Find Your People, Wherever You Roam",
    description: "Moved to a new city? Find people from your hometown living nearby. Chat anonymously, then reveal when you're ready.",
    siteName: "Roam",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roam | Find Your People, Wherever You Roam",
    description: "Moved to a new city? Find people from your hometown living nearby. Chat anonymously, then reveal when you're ready.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col bg-slate-950`}
      >
        <Navbar />
        <main className="flex-1 flex flex-col pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
