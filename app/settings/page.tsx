"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import SettingsPage from "./components/view";

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
            <div className="flex h-screen w-full items-center justify-center">
                <Spinner />
            </div>
        );
    }

    // 2. If no session, return null (the useEffect will handle the redirect)
    // This prevents the AgentsPage from flickering or mounting without data
    if (!_session) {
        return null;
    }

    // 3. Only render the protected content if the session exists
    return <SettingsPage />;
}