"use client"

import { Home, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const MeetingReviewModal = () => {
  const router = useRouter()
  
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center backdrop-blur-2xl bg-white/4 p-4 md:p-6 animate-in fade-in duration-500 overflow-y-auto">
      <div className="bg-white border border-slate-100 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-12 max-w-md w-full shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] text-center space-y-6 md:space-y-8 animate-in zoom-in-95 duration-300 my-auto">
        
        <div className="space-y-4">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#c34373]/10 rounded-full flex items-center justify-center mx-auto">
            <Video className="text-[#c34373] w-8 h-8 md:w-10 md:h-10" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Meeting Finished
            </h2>
            <p className="text-sm md:text-base text-slate-500 font-medium px-2 md:px-4">
              You have successfully ended the meeting
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:gap-4">
          <Button 
            onClick={() => router.push('/meetings')}
            className="w-full py-7 md:py-8 rounded-2xl md:rounded-3xl bg-[#c34373] hover:bg-[#a53660] text-white font-bold flex items-center justify-center gap-3 transition-all text-base md:text-lg shadow-xl shadow-[#c34373]/20 hover:scale-[1.02] active:scale-95 border-0"
          >
            <Video className="w-5 h-5 md:w-6 md:h-6" />
            Go to Meetings
          </Button>
          
          <Button 
            onClick={() => router.push('/')}
            className="w-full py-7 md:py-8 rounded-2xl md:rounded-3xl bg-transparent hover:bg-transparent text-slate-600 font-bold flex items-center justify-center gap-3 transition-all text-base md:text-lg hover:scale-[1.02] active:scale-95 border-0 shadow-none"
          >
            <Home className="w-5 h-5 md:w-6 md:h-6" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MeetingReviewModal;