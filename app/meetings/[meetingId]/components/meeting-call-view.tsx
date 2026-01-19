"use client";

import { useRouter } from "next/navigation";
import {
    useCall,
    useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import {
    Mic,
    VideoOff,
    MicOff,
    VideoIcon,
    Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const CustomCallControls = ({meetingId}:{meetingId: string}) => {
    const { useMicrophoneState, useCameraState } = useCallStateHooks();
    const { microphone, isMute: micMuted } = useMicrophoneState();
    const { camera, isMute: camMuted } = useCameraState();
    const call = useCall();
    const router = useRouter();

    const handleLeave = async () => {
        await call?.leave();
        toast.success("Meeting Ended")
        router.push(`/meetings/${meetingId}/review`);
    };

    return (
        <div className="absolute bottom-6 md:bottom-10 left-0 right-0 flex justify-center z-50 px-4">
            <div className="flex items-center gap-3 md:gap-4 bg-white/20 backdrop-blur-3xl p-2.5 md:p-3 px-5 md:px-6 rounded-[24px] md:rounded-[32px] shadow-2xl max-w-full">
                <Button
                    variant="outline"
                    size="icon"
                    className={`rounded-full scale-110 md:scale-130 border-0 backdrop-blur-md transition-all duration-300 ${micMuted
                            ? "bg-amber-500/70 text-white hover:bg-amber-500"
                            : "bg-white/10 text-white hover:bg-white hover:text-black"
                        }`}
                    onClick={() => microphone.toggle()}
                >
                    {micMuted ? <MicOff className="w-5 h-5 md:w-6 md:h-6" /> : <Mic className="w-5 h-5 md:w-6 md:h-6" />}
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className={`rounded-full scale-110 md:scale-130 border-0 backdrop-blur-md transition-all duration-300 ${camMuted
                            ? "bg-green-500/70 text-white hover:bg-green-500"
                            : "bg-white/10 text-white hover:bg-white hover:text-black"
                        }`}
                    onClick={() => camera.toggle()}
                >
                    {camMuted ? <VideoOff className="w-5 h-5 md:w-6 md:h-6" /> : <VideoIcon className="w-5 h-5 md:w-6 md:h-6" />}
                </Button>

                <div className="w-px h-6 md:h-8 bg-white mx-1 md:mx-2" />

                <button
                    onClick={handleLeave}
                    className="cursor-pointer w-12 h-12 md:w-14 md:h-14 rounded-4xl bg-red-600 text-white flex items-center justify-center hover:bg-red-600 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-500/20"
                    title="Leave Call"
                >
                    <Phone size={22} className="md:w-6 md:h-6" />
                </button>
            </div>
        </div>
    );
};