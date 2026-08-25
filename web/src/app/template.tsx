"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className="flex flex-col flex-1 w-full min-h-screen"
    >
      {children}
    </motion.div>
  );
}
