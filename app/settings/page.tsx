"use client";

import { useState } from "react";
import { User as UserIcon, Bot, Shield, Trash2, Camera, Save, Loader2, CheckCircle2, ChevronRight, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function SettingsPage() {
    const { data: session, isPending } = authClient.useSession();
    const [saving, setSaving] = useState(false);

    if (isPending) return (
        <div className="h-[60vh] flex items-center justify-center">
            <Spinner />
        </div>
    );

    const user = session?.user;

    return (
        <div className="max-w-2xl mx-auto py-16 px-6 selection:bg-rose-100 bg-white">
            {/* Header */}
            <header className="flex items-center justify-between gap-4 mb-12">
                <div className="space-y-1">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Settings</h1>
                    <p className="text-slate-500 text-sm">Manage your identity and AI preferences.</p>
                </div>
                {user?.emailVerified && (
                    <div className="inline-flex items-center gap-1 px-3 text-indigo-500 text-[11px] font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-5 fill-indigo-500 h-5 text-white" /> Verified
                    </div>
                )}
            </header>

            <div className="space-y-16">
                {/* --- PROFILE SECTION --- */}
                <section className="space-y-8">
                    <div className="flex items-center gap-6 group">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 overflow-hidden shadow-sm transition-all group-hover:border-slate-300">
                                {user?.image ? (
                                    <Image src={user.image} alt={user.name} fill className="rounded-full object-cover" />
                                ) : (
                                    <UserIcon className="w-8 h-8 text-slate-300" />
                                )}
                            </div>
                            <button className="cursor-pointer absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-sm hover:scale-110 transition-transform text-slate-600" onClick={()=>{
                                toast.info("feature coming soon...")
                            }}>
                                <Camera className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xl font-semibold text-slate-900">{user?.name}</p>
                            <p className="text-xs font-mono uppercase text-slate-400">{user?.id.slice(0, 12)}</p>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 ml-1">Display Name</label>
                            <Input
                                placeholder="Your Name"
                                className="h-12 rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white transition-all focus:ring-0 focus:border-slate-900"
                                defaultValue={user?.name}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase text-slate-400 ml-1">Email Address</label>
                            <Input
                                disabled
                                className="h-12 rounded-xl bg-gray-100 border-0 text-slate-400 italic cursor-not-allowed"
                                defaultValue={user?.email}
                            />
                        </div>
                    </div>
                </section>

                <hr className="border-slate-300" />

                {/* --- SECURITY & DANGER ZONE --- */}
                <section className="space-y-4">
                    <div className="group flex items-center justify-between p-5 rounded-2xl bg-white transition-all cursor-default">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <div className="flex gap-2 items-center">
                                <p className="text-sm font-semibold">Active Session</p>
                                <p className="text-[11px] text-slate-400 font-mono tracking-tight">{session?.session.ipAddress || '127.0.0.1'}</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-300 uppercase">Current Device</span>
                    </div>
                </section>
            </div>

            {/* Floating Action Bar */}
            <div className="sticky bottom-5 flex justify-end">
                <Button
                    disabled={saving}
                    onClick={() => {
                        setSaving(true);
                        setTimeout(() => {
                            setSaving(false)
                            toast.success("Account Updated")
                        }, 2000);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-3xl px-8 h-12 font-semibold shadow-xl transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-70"
                >
                    {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                </Button>
            </div>
        </div>
    );
}