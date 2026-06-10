"use client";

import { useEffect, useRef, useState } from "react";
import BookFreeSampleModal from "../common/BookFreeSampleModal";
import { useAccountsStore } from "@/state/useAccountsStore";

const REGISTER_POPUP_DELAY = 15000;

export default function HomeRegisterPopup() {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasOpenedRef = useRef(false);
  const customer = useAccountsStore((state) => state.customer);
  const isAuthenticated = Boolean(customer?.isAuthenticated);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (typeof window === "undefined" || isAuthenticated) {
      return;
    }

    const openPopup = () => {
      if (hasOpenedRef.current) {
        return;
      }

      hasOpenedRef.current = true;
      clearTimer();
      setOpen(true);
    };

    timerRef.current = setTimeout(openPopup, REGISTER_POPUP_DELAY);

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight <= 0) {
        return;
      }

      const progress = window.scrollY / scrollHeight;

      if (progress >= 0.4) {
        openPopup();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimer();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <BookFreeSampleModal open={open} onOpenChange={setOpen}>
      <button type="button" className="hidden" aria-hidden="true" tabIndex={-1}>
        Open free sample modal
      </button>
    </BookFreeSampleModal>
  );
}
