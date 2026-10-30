"use client";

import { useEffect } from "react";

/**
 * Pelindung defensif untuk Node.prototype.removeChild dan Node.prototype.insertBefore.
 * Mencegah crash fatal React 19 / Next.js ("NotFoundError: Failed to execute 'removeChild' on 'Node'")
 * yang sering dipicu oleh Google Translate, ekstensi browser, atau mutasi DOM eksternal.
 * 
 * ATURAN BAKU: Bebas emotikon Unicode di seluruh kode dan komentar.
 */
export default function DomDefensiveGuard() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof Node === "undefined" || !Node.prototype) {
      return;
    }

    const originalRemoveChild = Node.prototype.removeChild;
    const originalInsertBefore = Node.prototype.insertBefore;

    // Patch defensif removeChild
    Node.prototype.removeChild = function <T extends Node>(child: T): T {
      if (!child || child.parentNode !== this) {
        if (typeof console !== "undefined" && console.warn) {
          console.warn(
            "[DomDefensiveGuard] Mencegah crash removeChild: Simpul target bukan anak dari kontainer ini.",
            child
          );
        }
        return child;
      }
      return originalRemoveChild.call(this, child) as T;
    };

    // Patch defensif insertBefore
    Node.prototype.insertBefore = function <T extends Node>(
      newNode: T,
      referenceNode: Node | null
    ): T {
      if (referenceNode && referenceNode.parentNode !== this) {
        if (typeof console !== "undefined" && console.warn) {
          console.warn(
            "[DomDefensiveGuard] Mencegah crash insertBefore: Simpul acuan bukan anak dari kontainer ini.",
            referenceNode
          );
        }
        return newNode;
      }
      return originalInsertBefore.call(this, newNode, referenceNode) as T;
    };
  }, []);

  return null;
}

