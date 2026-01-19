"use client";

import { useState, useEffect } from "react";
import { Plus, MoreVertical, ArrowRight, Skull, Star, Dices, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDateTime } from "@/lib/utils";
import { AiAvatar } from "@/components/ui/ai-avatar";
import Link from "next/link";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { nameSuggestions } from "@/lib/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAgentSchema } from "../../app/agents/server/schema";
import { z } from "zod";
import { Spinner } from "@/components/ui/spinner";

export default function AgentsPage() {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [randomSuggestion, setRandomSuggestion] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        setRandomSuggestion(nameSuggestions[Math.floor(Math.random() * nameSuggestions.length)]);
    }, []);

    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({}));

    const form = useForm<z.infer<typeof createAgentSchema>>({
        resolver: zodResolver(createAgentSchema),
        defaultValues: {
            name: "",
            instructions: "",
        },
    });

    const createAgent = useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
                toast.success("Agent Created");
                handleClose();
            },
            onError: (error) => toast.error(error.message),
        })
    );

    const updateAgent = useMutation(
        trpc.agents.update.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
                toast.success("Agent Updated");
                handleClose();
            },
            onError: (error) => toast.error(error.message),
        })
    );

    const removeAgent = useMutation(
        trpc.agents.remove.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
                toast.success("Agent Deleted");
            },
            onError: (error) => toast.error(error.message),
        })
    );

    const handleClose = () => {
        setOpen(false);
        setEditingId(null);
        form.reset({ name: "", instructions: "" });
    };

    const onEdit = (agent: any) => {
        form.setValue("name", agent.name);
        form.setValue("instructions", agent.instructions);
        setEditingId(agent.id);
        setOpen(true);
    };

    const handleRandomize = () => {
        const randomName = nameSuggestions[Math.floor(Math.random() * nameSuggestions.length)];
        form.setValue("name", randomName);
        setRandomSuggestion(randomName);
    };

    const onSubmit = (values: z.infer<typeof createAgentSchema>) => {
        if (editingId) {
            updateAgent.mutate({ 
                id: editingId, 
                name: values.name, 
                instructions: values.instructions 
            });
        } else {
            createAgent.mutate(values);
        }
    };

    const currentNameInput = form.watch("name");

    if (!mounted) return null;

    return (
        /* UI FIX: Added flex flex-col and h-screen here to lock the outer height */
        <div className="max-w-4xl mx-auto lg:mt-0 md:mt-20 mt-22 pt-8 pb-4 border-dashed border-l-0 sm:border-l-8 border-[#c34373] px-6 sm:px-10 selection:bg-rose-100 bg-white h-screen flex flex-col overflow-hidden">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 shrink-0">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">AI Agents</h1>
                    <p className="text-slate-500 text-sm">Manage and deploy your custom AI personalities</p>
                </div>

                <Dialog open={open} onOpenChange={(v) => {
                    if (!v) handleClose();
                    else setOpen(true);
                }}>
                    <DialogTrigger asChild>
                        <Button 
                            onClick={() => {
                                setEditingId(null);
                                form.reset({ name: "", instructions: "" });
                            }}
                            className="rounded-2xl bg-[#c34373] hover:bg-[#cf698f] text-white gap-2 px-6 h-11 transition-all hover:shadow-lg"
                        >
                            <Plus className="w-4 h-4" />
                            Create
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[400px] rounded-[2.5rem] p-8 border-none shadow-2xl overflow-hidden">
                        <DialogHeader className="items-center text-center">
                            <div className="relative mb-4 group cursor-pointer" onClick={handleRandomize}>
                                <AiAvatar
                                    seed={currentNameInput || "default"}
                                    variant="botttsNeutral"
                                    classname="w-24 h-24 rounded-[2.5rem] transition-all group-hover:rotate-3 shadow-inner"
                                />
                                <div className="absolute -bottom-2 -right-2 bg-white/80 backdrop-blur-md p-2 rounded-xl shadow-md border border-white">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <DialogTitle className="text-center text-2xl font-bold text-slate-900">
                                    {editingId ? "Edit Agent" : (currentNameInput || randomSuggestion || "New Agent")}
                                </DialogTitle>
                                <DialogDescription className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                                    {editingId ? "Recalibrating Core" : "Personality Check"}
                                </DialogDescription>
                            </div>
                        </DialogHeader>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <div className="flex items-center justify-between px-1">
                                                <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Name</FormLabel>
                                                <button type="button" onClick={handleRandomize} className="cursor-pointer text-[10px] font-bold text-[#c34373] flex items-center gap-1 hover:opacity-70 transition-opacity outline-none">
                                                    <Dices className="w-3 h-3" /> Random
                                                </button>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="e.g. Nebula"
                                                    className="rounded-2xl bg-gray-50 border-0 focus-visible:shadow-md focus-visible:ring-0 h-12 placeholder:text-slate-300"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-[10px] px-1" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="instructions"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">Instructions</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="Describe how the agent behaves..."
                                                    className="rounded-[1.5rem] p-3 bg-gray-50 border-0 focus-visible:shadow-md focus-visible:ring-0 min-h-[100px] resize-none placeholder:text-slate-300"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-[10px] px-1" />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex flex-col gap-2 pt-2">
                                    <Button
                                        type="submit"
                                        disabled={createAgent.isPending || updateAgent.isPending}
                                        className="w-full rounded-2xl bg-[#c34373] hover:bg-[#cf698f] h-12 text-white font-bold transition-all shadow-md active:scale-95"
                                    >
                                        { (createAgent.isPending || updateAgent.isPending) ? <Spinner className="w-5 h-5 animate-spin" /> : editingId ? "Update Identity" : "Save Identity"}
                                    </Button>
                                    <Button type="button" variant="ghost" onClick={handleClose} className="text-slate-400 hover:text-slate-600 rounded-xl h-10">
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </header>

            {/* UI FIX: Added overflow-y-auto and flex-1 to the container below */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {data?.items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 opacity-50">
                        <Skull className="w-12 h-12 text-slate-200 mb-4" />
                        <p className="text-slate-500 font-medium">No agents found</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 pb-6">
                        {data?.items.map((agent) => (
                            <div
                                key={agent.id}
                                className="group flex items-center gap-4 p-3 rounded-[1.8rem] bg-white hover:shadow-sm transition-all duration-200"
                            >
                                <AiAvatar
                                    seed={agent.name}
                                    variant="botttsNeutral"
                                    classname="w-10 h-10 rounded-2xl shrink-0"
                                />

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-[#c34373] transition-colors">
                                            {agent.name}
                                        </h3>
                                        <span className="text-[9px] font-mono text-slate-300 uppercase hidden sm:inline">
                                            {agent.id}
                                        </span>
                                    </div>
                                    <p className="text-[12px] text-slate-400 line-clamp-1 italic truncate">
                                        {agent.instructions}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 shrink-0">
                                    <div className="hidden md:flex flex-col items-end">
                                        <span className="text-[8px] font-bold uppercase text-slate-300 tracking-tighter">Modified</span>
                                        <span className="text-[10px] font-medium text-slate-500 tabular-nums">
                                            {formatDateTime(agent.updatedAt, 'date')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Link href={`/agents/${agent.id}`}>
                                            <Button
                                                variant="ghost"
                                                className="h-8 px-3 hover:bg-rose-50 hover:text-[#c34373] rounded-lg text-slate-500 text-xs font-semibold group/btn"
                                            >
                                                View
                                                <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover/btn:translate-x-0.5 transition-transform" />
                                            </Button>
                                        </Link>
                                        
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 text-slate-300 hover:text-[#c34373] rounded-full">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[160px] shadow-xl border-slate-100">
                                                <DropdownMenuItem 
                                                    onClick={() => onEdit(agent)}
                                                    className="rounded-xl gap-2 cursor-pointer text-slate-600 focus:text-slate-700 focus:bg-gray-50"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={() => {
                                                        removeAgent.mutate({ id: agent.id })
                                                    }}
                                                    className="rounded-xl gap-2 cursor-pointer text-rose-500 focus:text-rose-600 focus:bg-rose-50"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5 text-rose-400" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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