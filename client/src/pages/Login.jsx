import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import { SignIn } from "@clerk/clerk-react";

const Login = () => {
  return (
    <div
      className="relative min-h-screen flex flex-col md:flex-row bg-gradient-to-br
  from-[#0b0f3b] via-[#1a1f4d] to-[#3c1f7f] overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute w-[600px] h-[600px] bg-purple-600/20 rounded-full top-[-200px]
        left-[-100px] blur-3xl animate-pulse-slow"
        ></div>
        <div
          className="absolute w-[500px] h-[500px] bg-pink-500/20 rounded-full bottom-[-100px]
        right-[-100px] blur-3xl animate-pulse-slow"
        ></div>
        <img
          src={assets.bgImage}
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between lg:pl-40 p-6 md:p-10 z-10">
        <motion.img
          src={assets.logo}
          alt=""
          className="h-12 object-contain mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        />

        <div className="flex items-center gap-3 mb-6 max-md:mt-8">
          <img src={assets.group_users} className="h-8 md:h-10" alt="" />
          <div>
            <div className="flex gap-1">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-transparent fill-amber-400 drop-shadow-lg"
                  />
                ))}
            </div>
            <p className="text-gray-300 text-sm mt-1">
              17,000+ adventurers already inside
            </p>
          </div>
        </div>

        <div>
          <motion.h1
            className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-indigo-400
            via-purple-500 to-pink-500 bg-clip-text text-transparent
            drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            Enter a world where <br />
            connections sparkle <br />
            and conversations <br />
            shine
          </motion.h1>

          <motion.p
            className="text-gray-400 mt-4 md:mt-6 max-w-lg text-sm md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            Step through the portal of imagination, meet kindred spirits, and
            let your messages glow with life. <br />
            Every story, every whisper, every laugh becomes a spark in the
            digital sky.
          </motion.p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <SignIn
            appearance={{
              baseTheme: "dark",
              variables: {
                colorPrimary: "#a78bfa",
                colorText: "#e5e7eb",
                colorBackground: "transparent",
                colorInputBackground: "rgba(15, 23, 42, 0.6)",
                colorCardBackground: "rgba(24, 32, 52, 0.6)",
              },
              elements: {
                card: "rounded-3xl shadow-[0_0_25px_rgba(168,85,247,0.5)] border border-purple-500/20 backdrop-blur-xl",
                headerTitle:
                  "text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text",
                headerSubtitle: "text-gray-400",
                socialButtonsBlockButton:
                  "bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:opacity-95 transition",
                formFieldInput:
                  "bg-[#1f264f]/60 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500",
                formButtonPrimary:
                  "bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white font-medium rounded-xl hover:opacity-95 transition",
                footerActionLink: "text-purple-400 hover:text-pink-400",
                footer: "hidden",
              },
            }}
          />
        </motion.div>
      </div>

      {Array(15)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-50 animate-startTwinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
    </div>
  );
};
export default Login;
