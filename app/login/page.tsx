"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff, Mail, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const signinSchema = z.object({
    email: z.string().min(1, "Required").email("Invalid email"),
    password: z.string().min(6, "Min 6 characters"),
});

const Signin = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const form = useForm<z.infer<typeof signinSchema>>({
        resolver: zodResolver(signinSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (values: z.infer<typeof signinSchema>) => {
        setLoading(true);
        const { error } = await authClient.signIn.email({
            email: values.email,
            password: values.password,
            callbackURL: "/dashboard",
        });
        setLoading(false);
        if (error) toast.error(error.message);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 overflow-hidden">
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/bg.png')" }}
            />
            <div className="relative rounded-[5rem] shadow-xl w-full max-w-[400px] md:max-w-[650px] min-h-[550px] flex flex-col md:flex-row overflow-hidden">

                <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white z-10">
                    <img src="/logo.png" alt="Logo" className="w-16 h-16 mb-6 invert" />
                    <h2 className="text-2xl font-bold text-slate-900">Welcome to Octo</h2>
                    <p className="text-slate-500 mt-2 mb-8 text-sm">Access your dashboard and calendar</p>

                    <div className="w-full space-y-3 max-w-[280px]">
                        <Button
                            onClick={() => setShowForm(true)}
                            className="w-full py-6 rounded-3xl bg-[#c34373] hover:bg-[#c75a82] active:bg-[#ca7695] transition-transform active:scale-95"
                        >
                            <Mail className="mr-2 h-4 w-4" /> Sign in with Email
                        </Button>
                        <Button variant="outline" className="w-full py-5 px-10 rounded-2xl hover:bg-white border-0 shadow-none active:scale-95 hover:shadow-md">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 48 48"
                                className="w-10 h-10"
                            >
                                <g>
                                    <path
                                        fill="#4285F4"
                                        d="M43.611 20.083H42V20H24v8h11.303C33.973 32.084 29.373 35 24 35c-6.065 0-11-4.935-11-11s4.935-11 11-11c2.507 0 4.81.86 6.646 2.285l6.366-6.366C33.527 6.163 28.973 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20c11.045 0 19.799-8.955 19.799-20 0-1.341-.138-2.651-.388-3.917z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M6.306 14.691l6.571 4.819C14.655 16.104 19.001 13 24 13c2.507 0 4.81.86 6.646 2.285l6.366-6.366C33.527 6.163 28.973 4 24 4c-7.732 0-14.41 4.388-17.694 10.691z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M24 44c5.311 0 10.13-1.822 13.857-4.949l-6.418-5.263C29.373 35 24 35 18.697 32.084l-6.571 5.081C9.59 39.612 16.268 44 24 44z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M43.611 20.083H42V20H24v8h11.303c-1.94 4.084-6.54 7-11.303 7-2.507 0-4.81-.86-6.646-2.285l-6.366 6.366C14.473 41.837 19.027 44 24 44c7.732 0 14.41-4.388 17.694-10.691z"
                                    />
                                </g>
                            </svg>
                            Google
                        </Button>
                    </div>
                </div>

                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute inset-0 md:inset-y-0 md:right-0 md:left-auto md:w-4/5 bg-[#c34373] z-20 flex flex-col justify-center p-8 md:p-12"
                        >
                            <button
                                onClick={() => setShowForm(false)}
                                className="absolute top-6 left-6 text-white/70 hover:text-white flex items-center text-sm font-semibold cursor-pointer transition-colors"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back
                            </button>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold text-white">Login</h3>
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
                                                        className="bg-white/10 border-0 text-white placeholder:text-white/50 rounded-xl h-12"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-fuchsia-200 text-xs" />
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
                                                            className="bg-white/10 border-0 text-white placeholder:text-white/50 rounded-xl h-12"
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
                                                <FormMessage className="text-fuchsia-200 text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-white text-[#c34373] hover:bg-fuchsia-50 rounded-xl h-12 font-bold mt-4"
                                    >
                                        {loading ? "Verifying..." : "Sign In"}
                                    </Button>

                                    <p className="text-center text-xs text-fuchsia-200 mt-4">
                                        Don't have an account?{" "}
                                        <span
                                            className="underline cursor-pointer text-white"
                                            onClick={() => router.push("/signup")}
                                        >
                                            Sign up
                                        </span>
                                    </p>
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