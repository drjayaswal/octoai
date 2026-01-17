"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Video, Keyboard, Plus, ArrowRight, Monitor, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import logo from "@/public/logo.png";

const HomePage = () => {
  const [meetingCode, setMeetingCode] = useState("");

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-[#c34373] selection:text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Image src={logo} alt="Logo" className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight">Octo</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-slate-900 transition-colors">Solutions</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Pricing</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Resources</a>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-sm font-medium">Sign In</Button>
          <Button className="bg-[#c34373] hover:bg-[#a63962] rounded-full px-6 text-sm">
            Try for free
          </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Video calls for <br />
              <span className="text-[#c34373]">minimalists.</span>
            </h1>
            <p className="text-xl text-slate-500 mb-10 max-w-lg leading-relaxed">
              No clutter, no distractions. Just crystal clear video and seamless 
              collaboration for modern teams.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
              <Button className="w-full sm:w-auto bg-[#c34373] hover:bg-[#a63962] h-14 px-8 rounded-2xl text-lg font-medium shadow-lg shadow-[#c34373]/20">
                <Plus className="mr-2 h-5 w-5" /> New Meeting
              </Button>
              
              <div className="relative w-full sm:w-64 group">
                <Keyboard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#c34373] transition-colors" />
                <Input 
                  placeholder="Enter a code or link"
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                  className="h-14 pl-12 pr-4 rounded-2xl border-slate-200 focus-visible:ring-[#c34373] bg-white transition-all shadow-sm"
                />
              </div>
              
              {meetingCode && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[#c34373] font-semibold text-sm hover:underline"
                >
                  Join
                </motion.button>
              )}
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-slate-200">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500 font-medium">
                Joined by <span className="text-slate-900 font-bold">10k+</span> teams worldwide
              </p>
            </div>
          </motion.div>

          {/* Right Column: Visual Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-video bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 p-4">
              <div className="w-full h-full bg-slate-50 rounded-[1.8rem] relative overflow-hidden group">
                {/* Simulated UI elements inside the "Meeting Preview" */}
                <div className="absolute top-4 left-4 flex gap-2">
                   <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-white text-[10px] font-medium">
                    00:42:15
                   </div>
                </div>
                
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer hover:bg-slate-50">
                    <Video className="h-4 w-4 text-slate-600" />
                   </div>
                   <div className="w-12 h-12 rounded-full bg-[#ef4444] shadow-lg flex items-center justify-center cursor-pointer hover:bg-red-600">
                    <Monitor className="h-5 w-5 text-white" />
                   </div>
                   <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer hover:bg-slate-50">
                    <Plus className="h-4 w-4 text-slate-600 rotate-45" />
                   </div>
                </div>

                {/* Video Placeholder */}
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-[#c34373]/10 flex items-center justify-center animate-pulse">
                        <Image src={logo} alt="Logo" className="w-10 h-10 opacity-40" />
                    </div>
                </div>
              </div>
            </div>

            {/* Floaties */}
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-3 animate-bounce">
              <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-bold">Low Latency</span>
            </div>
          </motion.div>
        </div>

        {/* Feature Section */}
        <section className="mt-40 grid md:grid-cols-3 gap-12">
            {[
                { icon: Monitor, title: "4K Screen Share", desc: "Share your work in stunning detail with minimal lag." },
                { icon: Shield, title: "End-to-End Encryption", desc: "Your conversations stay private with enterprise-grade security." },
                { icon: Zap, title: "Instant Join", desc: "No downloads required. Join directly from your browser." }
            ].map((feature, idx) => (
                <div key={idx} className="group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-6 group-hover:bg-[#c34373]/10 transition-colors">
                        <feature.icon className="h-6 w-6 text-slate-600 group-hover:text-[#c34373] transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
            ))}
        </section>
      </main>
    </div>
  );
};

export default HomePage;