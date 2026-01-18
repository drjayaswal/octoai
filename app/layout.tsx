import "./globals.css";
import type { Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/client";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import MinimalNav from "@/components/ui/navbar";

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
    <TRPCReactProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#c34373]  select-none`} suppressHydrationWarning suppressContentEditableWarning
      >
        <div
          className="fixed  inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/bg.png')" }}
        />
        <MinimalNav/>
        {children}
          <Toaster />
      </body>
    </html>
    </TRPCReactProvider>
  );
}



