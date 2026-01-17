import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Octo",
  icons: {
    icon: [
      {
        url: "/logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#c34373]  select-none`}
      >
        <div
          className="fixed  inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/bg.png')" }}
        />
        {children}
          <Toaster />
      </body>
    </html>
  );
}



