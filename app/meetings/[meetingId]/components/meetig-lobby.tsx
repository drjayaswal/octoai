"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Video, Calendar, Loader, Users, ShieldCheck, VideoOff, PhoneOff, Mic, MicOff } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

// Stream UI Components
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  SpeakerLayout,
  CallControls,
  VideoPreview,
  DeviceSettings,
  useCallStateHooks,
  StreamTheme
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import MeetingNotFound from "./meeting-not-found";
import { motion } from "framer-motion";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

const MeetingLobby = () => {

    
    return (
      <StreamVideo client={videoClient}>
        <StreamCall call={call}>
          {!isJoined ? (
            <div className="h-screen flex flex-col items-center justify-center p-6 text-white">
              <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
  
                <div className="space-y-6">
                  <div className="relative aspect-video rounded-4xl overflow-hidden bg-white/20 shadow-2xl">
                    <VideoPreview />
                  </div>
                </div>
  
                {/* Right Side: Meeting Info */}
                <div className="space-y-8">
                  <div>
                    <div className="inline-flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider mb-4 border border-[#c34373]/30">
                      <ShieldCheck className="w-5 h-5 text-white" />
                      Secured
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">
                      {meeting.name}
                    </h1>
                    <p className="text-gray-50 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Scheduled {formatDateTime(meeting.createdAt, "relative")}
                    </p>
                  </div>
  
                  <div className="space-y-6">
  
                    <Button onClick={async () => {
                      await call.join();
                      setIsJoined(true);
                    }} className="w-fit p-8 text-lg md:text-xl font-bold rounded-2xl transition-all duration-300 ease-out bg-transparent backdrop-blur-md text-white hover:bg-white hover:text-[#c34373] hover:scale-105 active:scale-95">
                                  <span className="relative z-10 flex items-center gap-3 md:gap-4">
                      <Video className="scale-140 fill-current" />
                      Start Meeting
                    </span>
                  </Button>
                </div>
              </div>
  
            </div>
            </div>
        ) : (
        /* --- ACTIVE MEETING VIEW (Glassmorphism Light Edition) --- */
        <div className="h-screen flex flex-col relative overflow-hidden">
          <main className="flex-1 relative px-6 pb-6">
            <div className="h-full w-full rounded-[48px] overflow-hidden border-[12px] border-white shadow-[0_32px_64px_-16px_rgba(195,67,115,0.15)] bg-white/40 backdrop-blur-sm relative">
  
              {/* Wrapping in a specific ID so we can target CSS 
           without breaking other parts of your app 
        */}
              <div id="creative-call-canvas" className="h-full w-full">
                <StreamTheme className="str-video__theme--light">
                  <SpeakerLayout />
                </StreamTheme>
              </div>
  
              {/* Custom Bottom Dock */}
              <div className="absolute bottom-10 left-0 right-0 flex justify-center z-50">
                <CustomCallControls />
              </div>
            </div>
          </main>
        </div>
          )}
      </StreamCall>
      </StreamVideo >
    );
}

export default MeetingLobby