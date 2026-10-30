"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function ModalPortal({
  children,
  targetId,
}: {
  children: React.ReactNode;
  targetId?: string;
}) {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;

    let el: HTMLElement | null = null;
    if (targetId) {
      el = document.getElementById(targetId);
    }
    if (!el) {
      el =
        document.getElementById("portal-root") ||
        document.getElementById("app-wrapper") ||
        document.body;
    }
    setTargetElement(el);
  }, [targetId]);

  if (!targetElement) return null;

  return createPortal(children, targetElement);
}
