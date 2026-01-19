"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import MeetingPage from "./components/view";
import { Loader } from "lucide-react";

export default function Page() {
    const { data: _session, isPending } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        // Only attempt redirect if we are no longer loading 
        // and we have confirmed there is no session.
        if (!isPending && !_session) {
            router.push("/signin");
        }
    }, [isPending, _session, router]); // React to changes in these values

    // 1. Show spinner while the auth request is in flight
    if (isPending) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4 text-white">
                <Loader className="w-8 h-8 animate-spin text-white" />
                <p className="font-medium">Securing your connection...</p>
            </div>
        );
    }

    // 2. If no session, return null (the useEffect will handle the redirect)
    // This prevents the AgentsPage from flickering or mounting without data
    if (!_session) {
        return null;
    }

    // 3. Only render the protected content if the session exists
    return <MeetingPage />;
}