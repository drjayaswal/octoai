"use client";

import { useState } from "react";
import { User as UserIcon, Camera, Save, CheckCircle2, Loader, Pen, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { formatDateTime, parseUserAgent } from "@/lib/utils";

export default function SettingsPage() {
    const { data: session, isPending } = authClient.useSession();
    const [saving, setSaving] = useState(false);

    if (isPending) return (
        <div className="h-[60vh] flex items-center justify-center">
            <Spinner />
        </div>
    );

    const user = session?.user;
    const deviceName = parseUserAgent(session?.session.userAgent || "Nil");

    return (
        <div className="max-w-2xl mx-auto mt-20 p-10 selection:bg-rose-100 bg-white min-h-[600px] flex flex-col justify-between rounded-r-[3re]">
            <div>
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-300">
                    <div className="">
                        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">Settings</h1>
                        <p className="text-slate-500 text-sm">Manage your identity and AI preferences.</p>
                    </div>
                    {user?.emailVerified && (
                        <div className="inline-flex items-center w-fit gap-1.5 px-3 py-1 text-indigo-500 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-50 sm:bg-transparent">
                            <CheckCircle2 className="w-4 h-4 fill-indigo-500 text-white" /> Verified
                        </div>
                    )}
                </header>

                <div className="space-y-8">
                    <section className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 group">
                        <div className="relative">
                            <div className="w-20 h-20 flex items-center justify-center overflow-hidden transition-all border border-slate-100 rounded-full">
                                {user?.image ? (
                                    <Image src={user.image} alt={user.name || "User"} fill className="object-cover hover:scale-105 rounded-full duration-200 transition-all" />
                                ) : (
                                    <UserIcon className="w-8 h-8 text-slate-300" />
                                )}
                            </div>
                            <button className="cursor-pointer absolute -bottom-1 -right-1 p-2 bg-white rounded-xl shadow-md border border-slate-100 hover:scale-105 transition-transform text-slate-600" onClick={() => toast.info("Coming soon")}>
                                <Camera className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xl font-semibold text-slate-900">{user?.name}</p>
                            <p className="text-xs font-mono uppercase text-slate-400 break-all">{user?.id.slice(0, 12).concat("XXXXXXXX")}</p>
                        </div>
                    </section>

                    <div className="grid gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] flex items-center gap-1 font-bold uppercase text-slate-400 ml-1 tracking-widest">
                                <Pen className="w-3 h-3" /> Username
                            </label>
                            <Input
                                placeholder="Enter New Username"
                                className="h-12 rounded-2xl placeholder:text-slate-300 focus-visible:ring-0 border-0 bg-slate-50/30 focus-visible:shadow-md focus:bg-white shadow-none transition-all focus:ring-0 focus:border-slate-900"
                                defaultValue={user?.name || ""}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] flex items-center gap-1 font-bold uppercase text-slate-400 ml-1 tracking-widest">
                                <CheckCircle2 className="w-3 h-3 text-slate-400" /> Email Address
                            </label>
                            <Input
                                disabled
                                className="h-11 rounded-xl border-none bg-slate-50/50 text-slate-400 italic cursor-not-allowed"
                                defaultValue={user?.email || ""}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] flex items-center gap-1 font-bold uppercase text-slate-400 ml-1 tracking-widest">
                                <Laptop className="w-3 h-3" /> Device Information
                            </label>
                            <Input
                                disabled
                                className="h-11 rounded-xl border-none bg-slate-50/50 text-slate-400 italic font-medium cursor-not-allowed truncate"
                                value={deviceName}
                            />
                        </div>
                    </div>
                </div>

                <div className="group my-8 flex items-center justify-start p-1 rounded-2xl bg-white transition-all cursor-default">
                    <Button
                        disabled={saving}
                        onClick={() => {
                            setSaving(true);
                            setTimeout(() => {
                                setSaving(false)
                                toast.success("Account Updated")
                            }, 2000);
                        }}
                        className={`w-full sm:w-auto hover:bg-emerald-500 sm:bg-white text-white bg-emerald-500 sm:text-emerald-500 rounded-3xl px-8 h-12 font-semibold transition-all hover:text-white disabled:opacity-70 ${!saving && "hover:shadow-md"}`}
                    >
                        {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save
                    </Button>
                </div>
            </div>

            <footer className="border-t p-4 py-8 border-slate-100 pt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Member Since</p>
                    <p className="text-xs text-slate-600 font-semibold">{formatDateTime(user?.createdAt, 'date')}</p>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6">
                    <div className="text-left sm:text-right space-y-1">
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Active Since</p>
                        <div className="flex items-center sm:justify-end gap-2">
                            <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-amber-500" />
                            <p className="text-xs text-slate-500 font-medium tabular-nums">{formatDateTime(session?.session?.updatedAt, 'time')}</p>
                        </div>
                    </div>
                    <div className="w-px h-6 bg-slate-100 hidden sm:block" />
                    <div className="text-right space-y-1">
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Updated</p>
                            <p className="text-xs text-slate-500 font-medium tabular-nums">
                                {formatDateTime(new Date(), 'date') === formatDateTime(user?.updatedAt, 'date')
                                    ? formatDateTime(user?.updatedAt, 'time')
                                    : formatDateTime(user?.updatedAt, 'date')
                                }
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}