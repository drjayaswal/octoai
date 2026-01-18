"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { images } from "@/lib/constants";
import { authClient } from "@/lib/auth-client";
import { Video } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const HomePage = () => {
  const { data: _session, isPending } = authClient.useSession();
  const router = useRouter();
  if (isPending) return <Spinner />

  return (
    <div className="min-h-screen w-full flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 md:px-8 py-8 md:py-12 items-center">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 lg:mt-0 md:mt-20 mt-25 md:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start"
        >

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white leading-[0.95] tracking-tighter">
            <span className="text-5xl sm:text-7xl text-transparent bg-clip-text bg-linear-to-r from-white to-white/20">meet</span> Smarter <br />
            Manage <span className="text-5xl sm:text-7xl text-transparent bg-clip-text bg-linear-to-l from-white to-white/20">more</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-lg leading-relaxed font-light">
            Octo deploys specialized AI agents to every meeting summarizing,
            tracking action items, and syncing data in real-time
            <br className="hidden sm:block" />
            Octo -
            <span className="font-semibold text-white italic"> like my eight hands for every task</span>
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4 w-full sm:w-auto">
            <Button className="relative overflow-hidden px-8 md:px-10 py-6 md:py-7 text-lg md:text-xl font-bold rounded-2xl transition-all duration-300 ease-out bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-[#c34373] hover:scale-105 active:scale-95">
              <span className="relative z-10 flex items-center gap-3 md:gap-4">
                Start A Meet Now
                <Video className="w-5 h-5 md:w-6 md:h-6 fill-current" />
              </span>
            </Button>

            {!_session && (
              <Button
                onClick={() => router.push("/signup")}
                variant={"custom"}
                className="bg-transparent hover:bg-white/20 text-white px-8 md:px-10 py-6 md:py-7 rounded-2xl text-lg md:text-xl font-semibold backdrop-blur-md"
              >
                Registration
              </Button>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-3 gap-2 sm:gap-4 h-[400px] sm:h-[500px] md:h-[600px] w-full"
        >
          <div className="flex flex-col gap-2 sm:gap-4 mt-8 sm:mt-12">
            <PillImage data={images[0]} height="h-2/3" />
            <PillImage data={images[3]} height="h-1/3" />
          </div>
          <div className="flex flex-col gap-2 sm:gap-4">
            <PillImage data={images[1]} height="h-1/2" />
            <PillImage data={images[4]} height="h-1/2" />
          </div>
          <div className="flex flex-col gap-2 sm:gap-4 mt-12 sm:mt-20">
            <PillImage data={images[2]} height="h-2/3" />
            <PillImage data={images[5]} height="h-1/3" />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

const PillImage = ({ data, height }: { data: any; height: string }) => (
  <div className={`relative w-full ${height} rounded-full overflow-hidden border-2 md:border-4 border-white shadow-2xl`}>
    <div className={`absolute inset-0 ${data.color} opacity-40`} />
    <Image
      src={data.src}
      alt="User"
      fill
      sizes="(max-width: 768px) 33vw, 20vw"
      className="object-cover hover:scale-110 grayscale hover:grayscale-0 transition-all duration-500"
    />
  </div>
);

export default HomePage;