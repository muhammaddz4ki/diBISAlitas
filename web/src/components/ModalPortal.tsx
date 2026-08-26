"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function ModalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const appWrapper = document.getElementById("app-wrapper");
  if (!appWrapper) return null;

  return createPortal(children, appWrapper);
}
