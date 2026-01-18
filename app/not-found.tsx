"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MoveLeft, Ghost, Search, Glasses, Frown } from "lucide-react";

export default function NotFound() {
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
          <div className="relative z-10 p-2 rounded-full">
            <Frown className="w-20 h-20 text-white" />
          </div>
          
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                x: [0, i % 2 === 0 ? 15 : -15, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.4,
              }}
              className="absolute text-white/40"
              style={{
                top: `${Math.sin(i) * 100 + 50}%`,
                left: `${Math.cos(i) * 100 + 50}%`,
              }}
            >
              <Search className="w-6 h-6" />
            </motion.div>
          ))}
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-7xl md:text-9xl font-black text-white mb-4"
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Even with eight hands, I couldn't find this.
          </h2>
          <p className="text-white/60 text-lg max-w-md mx-auto">
            The meeting notes are missing, the agent is confused, and this URL 
            seems to have drifted into deep space.
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