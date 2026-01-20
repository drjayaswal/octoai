"use client";

import { useState, useEffect } from "react";
import { Plus, ArrowRight, Calendar, Trash2, Video, Tag, Loader, Clock, CheckCircle, XCircle, ArrowUpFromDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDateTime } from "@/lib/utils";
import { AiAvatar } from "@/components/ui/ai-avatar";
import Link from "next/link";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { meetingFormSchema } from "@/app/meetings/schema";
import { useRouter } from "next/navigation";


export default function MeetingsPage() {
  const trpc = useTRPC();
  const router = useRouter()
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);


  const { data: agentsData } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({ all: true })
  );
  const { data: meetingsData, refetch } = useSuspenseQuery(
    trpc.meetings.getAll.queryOptions()
  );

  useEffect(() => {
    window.addEventListener("focus", () => refetch());
    return () => window.removeEventListener("focus", () => refetch());
  }, [refetch]);


  const form = useForm<z.infer<typeof meetingFormSchema>>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues: {
      name: "",
      agentId: "",
    },
  });

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.meetings.getAll.queryOptions());
        toast.success("Meeting Scheduled");
        handleClose();
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.meetings.getAll.queryOptions());
        toast.success("Meeting Updated");
        handleClose();
      },
      onError: (error) => toast.error(error.message),
    })
  );
  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    form.reset({ name: "", agentId: "" });
  };
  const onSubmit = (values: z.infer<typeof meetingFormSchema>) => {
    if (editingId) {
      updateMeeting.mutate({
        id: editingId,
        name: values.name,
        agentId: values.agentId, // Sent to backend for update
      } as any);
    } else {
      createMeeting.mutate(values);
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto lg:mt-0 md:mt-20 mt-22 pt-8 pb-4 border-dashed border-l-0 sm:border-l-8 border-[#c34373] px-6 sm:px-10 selection:bg-rose-200 selection:text-rose-900 bg-white h-screen flex flex-col overflow-hidden">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 shrink-0">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">Meetings</h1>
          <p className="text-slate-500 text-sm">Organize and review your AI-powered sessions</p>
        </div>

        <Dialog open={open} onOpenChange={(v) => {
          if (!v) {
            handleClose();
          } else {
            if (!editingId) form.reset({ name: "", agentId: "" });
            setOpen(true);
          }
        }}>
          <div className="flex gap-2 items-center">
            <DialogTrigger asChild>
              <Button
                className="rounded-2xl bg-[#c34373] hover:bg-[#cf698f] text-white gap-2 px-6 h-11 transition-all hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Create
              </Button>
            </DialogTrigger>
            <Button
              onClick={() => {
                router.push("/agents")
              }}
              className="rounded-2xl bg-[#c34373] hover:bg-[#cf698f] text-white gap-2 px-6 h-11 transition-all hover:shadow-lg"
            >
              <ArrowUpFromDot className="w-4 h-4" />
              Agents
            </Button>
          </div>
          <DialogContent className="sm:max-w-[400px] rounded-[2.5rem] p-8 border-none shadow-2xl overflow-hidden">
            <DialogHeader className="items-center text-center">
              <div className="bg-rose-50 p-4 rounded-[2rem] mb-2">
                <Video className="w-10 h-10 text-[#c34373]" />
              </div>
              <DialogTitle className="text-2xl font-bold text-slate-900">
                {editingId ? "Edit Meeting" : "New Meeting"}
              </DialogTitle>
              <DialogDescription className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                Set your session parameters
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Meeting Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Project Sync" className="rounded-2xl focus-visible:ring-0 bg-gray-50 border-0 h-12" />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agentId"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Assign Agent</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        key={editingId || "new"}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-2xl bg-gray-50 border-0 h-12 focus:ring-0">
                            <SelectValue placeholder="Select an agent" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-slate-100">
                          {agentsData?.items.map((agent) => (
                            <SelectItem key={agent.id} value={agent.id} className="rounded-xl">
                              <div className="flex items-center gap-2">
                                <AiAvatar seed={agent.name} variant="botttsNeutral" classname="w-5 h-5 rounded-md" />
                                {agent.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    type="submit"
                    disabled={createMeeting.isPending || updateMeeting.isPending}
                    className="w-full rounded-2xl bg-[#c34373] hover:bg-[#cf698f] h-12 text-white font-bold transition-all"
                  >
                    {(createMeeting.isPending || updateMeeting.isPending) ? <Loader className="w-5 h-5 animate-spin" /> : editingId ? "Update Meeting" : "Create Meeting"}
                  </Button>
                  <Button type="button" variant="ghost" onClick={handleClose} className="text-slate-400 rounded-xl h-10">Cancel</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </header>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {meetingsData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 opacity-50">
            <Calendar className="w-12 h-12 text-slate-200 mb-4" />
            <p className="text-slate-500 font-medium">No meetings scheduled</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pb-6">
            {meetingsData.map((m) => (
              <div key={m.id} className="group flex items-center gap-4 p-4 rounded-[1.8rem] bg-white hover:shadow-sm transition-all duration-200">
                <AiAvatar
                  seed={m.agentName || "default"}
                  variant="botttsNeutral"
                  classname="w-10 h-10 rounded-[2.5rem] transition-all group-hover:rotate-3 shadow-inner"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-[#c34373] transition-colors">
                      {m.name}
                    </h3>
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${statusStyles[m.status.toLowerCase()] || statusStyles.default}`}>
                      {statusIcons[m.status.toLowerCase()] || <Clock className="w-3 h-3" />}
                      {m.status}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-0.5">
                    <Tag className="w-3 h-3 text-slate-300" />
                    <p className="text-[11px] text-slate-400 font-medium italic">
                      with {m.agentName || "Unknown Agent"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="hidden md:flex items-center gap-6">

                    <div className="flex flex-col items-end">
                      <span className="text-[8px] font-black uppercase text-slate-300 tracking-widest">Created</span>
                      <span className="text-[10px] font-semibold text-slate-500 tabular-nums">
                        {formatDateTime(m.createdAt, 'date')}
                      </span>
                    </div>

                    {m.endedAt && (
                      <>
                        <div className="h-6 w-px bg-slate-100" />

                        <div className="flex flex-col items-end">
                          <span className="text-[8px] font-black uppercase text-slate-300 tracking-widest">Completed</span>
                          <span className="text-[10px] font-semibold text-slate-500 tabular-nums">
                            {formatDateTime(m.endedAt, 'date')}
                          </span>
                        </div>
                      </>
                    )}
                  </div>


                  <div className="flex items-center gap-1">
                    {m.status.toLowerCase() === "upcoming" && (
                      <>
                        <Link href={`/meetings/${m.id}`}>
                          <Button
                            variant="ghost"
                            className="h-8 px-3 hover:bg-rose-50 hover:text-[#c34373] rounded-lg text-slate-500 text-xs font-semibold group/btn"
                          >
                            Lobby
                            <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover/btn:translate-x-0.5 transition-transform" />
                          </Button>
                        </Link>

                        <Button
                          onClick={() => {
                            updateMeeting.mutate({
                              id: m.id,
                              status: "cancelled"
                            } as any);
                          }}
                          className="rounded-4xl py-1 gap-2 cursor-pointer hover:bg-rose-50 bg-white text-rose-500 focus:text-rose-600 focus:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const statusIcons: Record<string, React.ReactNode> = {
  active: <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />,
  completed: <CheckCircle className="w-3 h-3" />,
  upcoming: <Clock className="w-3 h-3" />,
  cancelled: <XCircle className="w-3 h-3" />,
  processing: <Loader className="w-3 h-3 animate-spin" />,
};
const statusStyles: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-600 border-emerald-400",
  completed: "bg-blue-50 text-blue-600 border-blue-400",
  upcoming: "bg-amber-50 text-amber-600 border-amber-400",
  cancelled: "bg-rose-50 text-rose-600 border-rose-400",
  processing: "bg-indigo-100 text-indigo-500 border-indigo-400"
};