"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MoveLeft, CalendarX, VideoOff, Clock, Search, Calendar } from "lucide-react";

export default function MeetingNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#c34373]/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 text-center max-w-2xl">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative inline-block mb-8"
        >
          <div className="relative z-10 p-4 rounded-3xl ">
            <CalendarX className="w-20 h-20 text-white" />
          </div>
          {[VideoOff, Clock, Search, Calendar].map((Icon, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -25, 0],
                x: [0, i % 2 === 0 ? 20 : -20, 0],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              className="absolute text-white"
              style={{
                top: `${(i < 2 ? -20 : 80)}%`,
                left: `${(i % 2 === 0 ? -20 : 90)}%`,
              }}
            >
              <Icon className="w-8 h-8" />
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-5xl md:text-7xl font-black text-white mb-2">
            Meeting Not Found
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-white/90">
            This link has expired or never existed.
          </h2>
          <p className="text-white/60 text-md max-w-md mx-auto">
            I searched everywhere, but this meeting is nowhere <br /> 
            ID may have been deleted or is incorrect
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button asChild variant={"custom"} size="lg" className="relative overflow-hidden px-8 md:px-10 py-4 md:py-6 text-lg md:text-xl font-bold rounded-2xl transition-all duration-300 ease-out bg-transparent backdrop-blur-md text-white hover:bg-white hover:text-[#c34373] hover:scale-105 active:scale-95">
            <Link href="/">
              <MoveLeft className="mr-2 w-5 h-5" />
            Home
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}