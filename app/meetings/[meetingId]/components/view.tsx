"use client";

import {
  CallControls, // Pre-built bar with share/record/leave
  CallParticipantsList, // Sidebar for people
  PaginatedGridLayout, // Good alternative to SpeakerLayout
  RecordCallButton, // Specific button for recording
  ScreenShareButton, // Specific button for sharing
} from "@stream-io/video-react-sdk";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { authClient } from "@/lib/auth-client";
import { formatDateTime } from "@/lib/utils";
import {
  StreamVideoClient,
  StreamCall,
  StreamVideo,
  VideoPreview,
  useCall,
  useCallStateHooks,
  CallingState,
  SpeakerLayout,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import {
  Video as VideoIcon,
  Mic,
  VideoOff,
  MicOff,
  Loader,
  Lock,
  Timer,
  Phone,
  MonitorUp,
  Circle,
  Paperclip,
  Copy,
  CopyCheck,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MeetingData } from "@/app/meetings/types";
import MeetingNotFound from "@/components/sub-components/MeetingNotFound";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

const MeetingPage = () => {
  const trpc = useTRPC();
  const { meetingId } = useParams();
  const [call, setCall] = useState<any>(null);
  const { data: _session, isPending: sessionLoading } = authClient.useSession();
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(
    null,
  );
  const {
    data: meeting,
    isLoading: meetingLoading,
    error: meetingError,
  } = useQuery(
    trpc.meetings.getOne.queryOptions(
      { id: meetingId as string },
      { retry: false },
    ),
  );

  const generateToken = useMutation(
    trpc.meetings.generateToken.mutationOptions(),
  );

  useEffect(() => {
    if (!meeting || !_session?.user) return;
    let client: StreamVideoClient;

    const initVideo = async () => {
      try {
        const token = await generateToken.mutateAsync();
        client = new StreamVideoClient({
          apiKey,
          user: {
            id: _session.user.id,
            name: _session.user.name ?? "Anonymous",
          },
          token,
        });
        const callInstance = client.call("default", meeting.id);
        await callInstance.getOrCreate();
        setVideoClient(client);
        setCall(callInstance);
      } catch (err) {
        console.error("Failed to initialize video", err);
      }
    };

    initVideo();
    return () => {
      if (client) client.disconnectUser();
    };
  }, [meeting?.id, _session?.user.id]);

  if (meetingLoading || sessionLoading || !videoClient || !call || !meeting) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 text-white px-6 text-center">
        <Loader className="w-8 h-8 animate-spin text-white" />
        <p className="font-medium">Securing your connection...</p>
      </div>
    );
  }

  if (meetingError) return <MeetingNotFound />;

  return (
    <StreamVideo client={videoClient}>
      <StreamCall call={call}>
        <MeetingView meeting={meeting} />
      </StreamCall>
    </StreamVideo>
  );
};

const MeetingView = ({ meeting }: { meeting: MeetingData }) => {
  const call = useCall();
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { useCallCreatedBy } = useCallStateHooks();
  const callCreatedBy = useCallCreatedBy();
  const { data: _session } = authClient.useSession();
  const { useIsCallRecordingInProgress, useScreenShareState } =
    useCallStateHooks();
  const { screenShare } = useScreenShareState();
  const isRecording = useIsCallRecordingInProgress();
  const [isJoining, setIsJoining] = useState(false);
  const {
    useParticipantCount,
    useCallCallingState,
    useMicrophoneState,
    useCameraState,
  } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const { camera, isEnabled: isCamEnabled } = useCameraState();
  const { microphone, isMute: isMicMuted } = useMicrophoneState();
  const isCamOff = !isCamEnabled;
  const isScreenSharing = screenShare.enabled;
  const isOwner = _session?.user?.id === callCreatedBy?.id;
  const updateStatus = useMutation(trpc.meetings.update.mutationOptions());
  const [isPending, setIsPending] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const updateMeetingStatus = (newStatus: MeetingData["status"]) => {
    if (meeting.status === newStatus) return;

    updateStatus.mutate(
      {
        id: meeting.id,
        status: newStatus,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({ id: meeting.id }),
          );
        },
      },
    );
  };

  useEffect(() => {
    if (!call) return;

    const syncStatus = async () => {
      if (
        callingState === CallingState.JOINED &&
        meeting.status === "upcoming"
      ) {
        updateMeetingStatus("active");
      }
      if (callingState === CallingState.LEFT) {
        updateMeetingStatus("completed");
      }
    };

    syncStatus();
  }, [callingState, meeting.status]);

  useEffect(() => {
    if (!call) return;

    const handleParticipantLeft = () => {
      if (participantCount <= 1 && meeting.status === "active") {
        handleLeave();
      }
    };

    call.on("call.session_participant_left", handleParticipantLeft);
    return () => {
      call.off("call.session_participant_left", handleParticipantLeft);
    };
  }, [call, participantCount]);

  const toggleMic = async () => {
    await call?.microphone.toggle();
  };

  const toggleRecording = async () => {
    if (!call || !isOwner || isPending) return;

    setIsPending(true);

    try {
      const recordingInProgress = call.state.recording;

      if (recordingInProgress) {
        await call.stopRecording();
        toast.success("Recording stopped.");
      } else {
        await call.startRecording();
        toast.info("Recording started...");
      }
    } catch (error: any) {
      console.error("Recording error:", error);
      toast.error(error.message || "Failed to toggle recording.");
    } finally {
      setTimeout(() => setIsPending(false), 2000);
    }
  };

  const toggleCam = async () => {
    await call?.camera.toggle();
  };

  const handleJoin = async () => {
    if (isJoining) return;

    if (meeting.status === "completed" || meeting.endedAt) {
      toast.error("This meeting has already ended.");
      router.push("/meetings");
      return;
    }

    if (meeting.status === "cancelled") {
      toast.error("This meeting has been cancelled.");
      router.push("/meetings");
      return;
    }

    setIsJoining(true);
    try {
      await call?.join();
      if (meeting.status === "upcoming") {
        updateMeetingStatus("active");
      }
    } catch (e) {
      console.error("Join error:", e);
      setIsJoining(false);
    }
  };

  const handleLeave = async () => {
    await call?.leave();
    updateMeetingStatus("completed");
    toast.success("Meeting Ended");
    router.push(`/meetings/${meeting.id}/review`);
  };

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 lg:p-10 text-white overflow-x-hidden">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-15 lg:gap-0 items-center">
          <div className="order-1 space-y-6 min-w-fit max-w-2xl mx-auto">
            <div className="relative aspect-video rounded-[4rem] overflow-hidden shadow-2xl">
              {isCamOff ? (
                <div className="w-full h-full flex items-center justify-center bg-white/10" />
              ) : (
                <div className="relative h-full w-full overflow-hidden rounded-lg">
                  <div className="absolute inset-0 blur-xs scale-105 pointer-events-none">
                    <VideoPreview />
                  </div>
                </div>
              )}

              <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 flex gap-6 md:gap-8">
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-full scale-110 md:scale-130 border-0 backdrop-blur-md transition-colors ${isMicMuted ? "bg-amber-500/70 text-white hover:bg-amber-500" : "bg-white/10 hover:bg-white hover:text-black"}`}
                  onClick={toggleMic}
                >
                  {isMicMuted ? (
                    <MicOff className="w-6 h-6 md:w-8 md:h-8" />
                  ) : (
                    <Mic className="w-6 h-6 md:w-8 md:h-8" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-full scale-110 md:scale-130 border-0 backdrop-blur-md transition-colors ${isCamOff ? "bg-green-500/70 text-white hover:bg-green-500" : "bg-white/10 hover:bg-white hover:text-black"}`}
                  onClick={toggleCam}
                >
                  {isCamOff ? (
                    <VideoOff className="w-6 h-6 md:w-8 md:h-8" />
                  ) : (
                    <VideoIcon className="w-6 h-6 md:w-8 md:h-8" />
                  )}
                </Button>
              </div>
            </div>
            <p className="text-center text-xs md:text-sm text-white/40 italic">
              check your camera and microphone permissions
            </p>
            <div className="flex gap-2 items-center">
              <Button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  } catch (err) {
                    console.error("Failed to copy!", err);
                  }
                }}
                variant={"default"}
                className="inline-flex items-center gap-2 rounded-full hover:bg-indigo-600 bg-indigo-600/80 hover:shadow-xl hover:scale-105 duration-200 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md transition-all"
              >
                {isCopied ? (
                  <div className="flex items-center gap-2">
                    <CopyCheck className="w-3 h-3" />
                    <span>Copied!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Copy className="w-3 h-3" />
                    <span>Copy Link</span>
                  </div>
                )}
              </Button>

              <Button
                onClick={() => toast.info("feature coming soon...")}
                variant={"default"}
                className="inline-flex items-center gap-2 rounded-full hover:bg-green-600 bg-green-600/80 hover:shadow-xl hover:scale-105 duration-200 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md transition-all"
              >
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-3 h-3" />
                    <span>Whatsapp</span>
                  </div>
              </Button>
            </div>
          </div>
          <div className="order-2 space-y-6 md:space-y-8 text-center lg:text-left">
            <div>
              <div className="flex gap-2 items-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
                  Secured <Lock className="w-3 h-3" /> Encrypted
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-3 tracking-tight leading-tight wrap-break-words">
                {meeting.name}
              </h1>
              <p className="text-white/50 flex items-center justify-center lg:justify-start gap-2 text-sm md:text-base">
                <Timer className="w-4 h-4" />
                {formatDateTime(meeting.createdAt, "relative")}
              </p>
            </div>
            <div className="flex flex-col items-center lg:items-start gap-4">
              <Button
                onClick={handleJoin}
                disabled={isJoining}
                className="w-full sm:w-fit px-8 py-7 md:px-10 md:py-8 text-lg md:text-xl font-bold rounded-2xl md:rounded-full transition-all bg-white/30 hover:bg-white hover:text-[#c34373] text-white active:scale-95 disabled:opacity-50"
              >
                {isJoining ? (
                  <div className="flex items-center gap-3">
                    <Loader className="w-5 h-5 animate-spin" />
                    Joining...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <VideoIcon className="w-6 h-6 fill-current" />
                    Join Now
                  </div>
                )}
              </Button>

              <p className="text-xs text-white/50">
                {participantCount} others in this call
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (call) {
    return (
      <div className="h-dvh sm:mt-0 mt-22 w-full relative overflow-hidden flex flex-col">
        <div className="absolute top-4 left-4 md:bottom-6 md:left-6 md:top-auto z-50">
          <div className="bg-white/20 text-white px-4 py-1.5 font-bold backdrop-blur-xl rounded-2xl text-sm md:text-base flex items-center gap-2 shadow-sm">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            {participantCount < 2 ? "Alone" : participantCount + " People"}
          </div>
        </div>
        <div className="flex-1 w-full relative bg-black/10 mx-auto my-22 backdrop-blur-md">
          <SpeakerLayout participantsBarPosition="top" />
        </div>
        <div className="relative pb-safe mb-4 md:mb-0">
          <div className="absolute bottom-6 md:bottom-10 left-0 right-0 flex justify-center z-50 px-4">
            <div className="flex items-center gap-3 md:gap-4 bg-white/20 backdrop-blur-3xl p-2.5 md:p-3 px-5 md:px-6 rounded-[24px] md:rounded-[32px] shadow-2xl max-w-full">
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full scale-110 md:scale-130 border-0 backdrop-blur-md transition-all duration-300 ${
                  isMicMuted
                    ? "bg-amber-500/70 text-white hover:bg-amber-500"
                    : "bg-white/10 text-white hover:bg-white hover:text-black"
                }`}
                onClick={() => microphone.toggle()}
              >
                {isMicMuted ? (
                  <MicOff className="w-5 h-5 md:w-6 md:h-6" />
                ) : (
                  <Mic className="w-5 h-5 md:w-6 md:h-6" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full scale-110 md:scale-130 border-0 backdrop-blur-md transition-all duration-300 ${
                  isCamOff
                    ? "bg-green-500/70 text-white hover:bg-green-500"
                    : "bg-white/10 text-white hover:bg-white hover:text-black"
                }`}
                onClick={() => camera.toggle()}
              >
                {isCamOff ? (
                  <VideoOff className="w-5 h-5 md:w-6 md:h-6" />
                ) : (
                  <VideoIcon className="w-5 h-5 md:w-6 md:h-6" />
                )}
              </Button>
              {isOwner && (
                <Button
                  variant="outline"
                  size="icon"
                  disabled={isPending}
                  className={`rounded-full transition-all duration-300 ${
                    isRecording
                      ? "bg-red-500 text-white hover:bg-red-600 border-transparent shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                      : "bg-white/10 hover:bg-white/20 border-white/50"
                  } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={toggleRecording}
                >
                  <Circle
                    className={`w-5 h-5 text-red-600 border-0 outline-0 ring-0 ${isRecording ? "fill-white" : "fill-red-600"}`}
                  />
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full scale-110 md:scale-130 border-0 backdrop-blur-md transition-all duration-300 ${
                  isScreenSharing
                    ? "bg-blue-500/80 text-white hover:bg-blue-600"
                    : "bg-white/10 text-white hover:bg-white hover:text-black"
                }`}
                onClick={() => call?.screenShare.toggle()}
              >
                <MonitorUp className="w-5 h-5 md:w-6 md:h-6" />
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
        </div>
      </div>
    );
  }
};

export default MeetingPage;
