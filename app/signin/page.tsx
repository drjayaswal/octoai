"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/public/logo.png";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff, Mail, ArrowLeft, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { githubLogin } from "@/lib/services";

const signinSchema = z.object({
    email: z.string().min(1, "Required").email("Invalid email"),
    password: z.string().min(6, "Min 6 characters"),
});

const Signin = () => {
    const { data: _session, isPending } = authClient.useSession();
    const router = useRouter();
    const [mounted, setMounted] = useState(false); // Hydration Guard
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && _session) {
            router.push("/");
        }
    }, [mounted, _session, router]);

    const form = useForm<z.infer<typeof signinSchema>>({
        resolver: zodResolver(signinSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (values: z.infer<typeof signinSchema>) => {
        setLoading(true);
        const { error } = await authClient.signIn.email({
            email: values.email,
            password: values.password,
        });
        setLoading(false);
        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Signing In...");
            router.push("/");
        }
    };
    if (!mounted || isPending) return <Spinner />;
    if (_session) return null;

    return (
        <div className="min-h-screen flex items-center justify-center px-4 overflow-hidden">
            <div className={`relative rounded-[5rem] w-full max-w-[400px] md:max-w-[650px] min-h-[550px] flex flex-col md:flex-row overflow-hidden ${showForm ? "bg-transparent transition-colors duration-300" : "bg-white  shadow-xl"}`}>
                <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-center z-10">
                    <Image src={logo} alt="Logo" className="w-16 h-16 mb-6" />
                    <h2 className="text-2xl font-bold text-slate-900">Welcome to Octo</h2>
                    <p className="text-slate-500 mt-2 mb-8 text-sm">Access your dashboard and calendar</p>

                    <div className="w-full space-y-3 max-w-[280px]">
                        <Button
                            onClick={() => setShowForm(true)}
                            className="w-full py-6 rounded-3xl bg-[#c34373] hover:bg-[#c75b82] active:bg-[#c67593] transition-transform active:scale-95"
                        >
                            <Mail className="mr-2 h-4 w-4" /> Sign in with Email
                        </Button>
                        <Button variant="outline" className="w-full py-6 rounded-3xl border-0 hover:shadow-none shadow-none active:scale-95">
                            <Image src="https://www.svgrepo.com/show/475656/google-color.svg" height={20} width={20} className="mr-2" alt="G" />
                            Google
                        </Button>
                        <Button variant="outline" className="w-full py-6 rounded-3xl border-0 hover:shadow-none shadow-none active:scale-95" 
                        onClick={githubLogin}>
                            <svg
                                viewBox="0 0 24 24"
                                height={20}
                                width={20}
                                className="mr-2 fill-slate-900"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                            </svg>
                            GitHub
                        </Button>
                    </div>
                    <p className="text-xs text-slate-400 mt-6">
                        Create an account?{" "}
                        <span className="text-[#c34373] font-semibold cursor-pointer hover:underline" onClick={() => router.push('/signup')}>Sign Up</span>
                    </p>

                </div>

                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute inset-0 bg-[#c34373] w-max-3xl z-20 flex flex-col justify-center p-8 md:p-12 rounded-l-[5rem]"
                        >
                            <Button
                                onClick={() => setShowForm(false)}
                                className="absolute top-6 left-6 bg-transparent hover:bg-transparent text-white/70 hover:text-white flex items-center text-sm"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back
                            </Button>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-[400px] mx-auto w-full">
                                    <div className="mb-6">
                                        <h3 className="text-3xl font-bold text-white">Signin</h3>
                                        <p className="text-fuchsia-100 text-sm">Enter your account details</p>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Email"
                                                        autoComplete="off"
                                                        className="focus-visible:bg-white/10 placeholder:pl-1 shadow-none focus-visible:shadow-xl border-0 focus-visible:ring-0 text-white placeholder:text-white/70 rounded-2xl h-12 transition-colors duration-300"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-white animate-pulse text-xs ml-4" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="Password"
                                                            autoComplete="off"
                                                            className="focus-visible:bg-white/10 placeholder:pl-1 shadow-none focus-visible:shadow-xl border-0 focus-visible:ring-0 text-white placeholder:text-white/70 rounded-2xl h-12 transition-colors duration-300"
                                                        />
                                                    </FormControl>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-3 text-white/50"
                                                    >
                                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                                <FormMessage className="text-white animate-pulse text-xs ml-4" />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-white text-[#c34373] hover:bg-fuchsia-50 rounded-xl h-12 font-bold mt-4"
                                    >
                                        {loading ? <><Loader className="animate-spin" />Signing in...</> : "Sign In"}
                                    </Button>
                                </form>
                            </Form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Signin;