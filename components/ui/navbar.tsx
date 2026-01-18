"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Power } from "lucide-react";
import Link from "next/link";
import { Button } from "./button";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const menuItems = [
  { name: "Meetings", href: "/meetings" },
  { name: "Agents", href: "/agents" },
  { name: "Upgrade", href: "/upgrade" },
  { name: "Settings", href: "/settings" },
];

export default function MinimalNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: _session, isPending } = authClient.useSession();
  const logout = async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logging out...");
            setTimeout(() => {
              setIsOpen((prev)=>!prev)
              redirect("/signin")
            }, 1000);
          },
          onError: (error) => {
            console.log(error);
            toast.success("Can't Log out");
          }
        }
      });
  }
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute right-6 top-6 cursor-pointer z-70 p-3 rounded-full backdrop-blur-md bg-white/40 transition-all group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <X className="w-6 h-6 text-[#c34373]" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
            >
              <Menu className="w-6 h-6 text-[#c34373]" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.90 }}
              animate={{ opacity: 1, scale: 0.90 }}
              exit={{ opacity: 0, scale: 0.90 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-[95%] h-[95%] bg-black/40 backdrop-blur-2xl rounded-[3rem] shadow-2xl pointer-events-auto flex flex-col items-center justify-center relative overflow-hidden"
            >
              <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#c34373]/20 blur-[120px]" />
              {_session &&
                <Button onClick={logout} className="absolute top-7 right-7 rounded-4xl bg-transparent hover:bg-white/10 text-white active:text-red-600 scale-200"><Power /></Button>
              }
              <ul className="flex flex-col items-center gap-6 justify-center mx-auto z-10">
                {menuItems.map((item, idx) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                    className="group"
                  >
                    <Link
                      href={item.href}
                      className="text-4xl md:text-6xl font-black text-white/50 hover:text-white transition-colors flex items-center gap-4"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="text-sm font-mono text-[#c34373]">0{idx + 1}</span>
                      {item.name}
                      <ArrowRight className="w-8 h-8 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-white" />
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-12 flex gap-8 text-white/40 text-xs font-bold uppercase tracking-[0.2em]"
              >
                <Link href="https://github.com/drjayaswal" className="hover:text-white">Github</Link>
                <Link href="https://linkedin.com/in/drjayaswal" className="hover:text-white">LinkedIn</Link>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}