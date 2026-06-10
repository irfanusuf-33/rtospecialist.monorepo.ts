"use client";

import { useEffect } from "react";
import { useGlobalToastStore } from "@/state/useGlobalToastStore";

export default function GlobalToast() {
  const toast = useGlobalToastStore((state) => state.toastState);
  const setToastState = useGlobalToastStore((state) => state.setToastState);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToastState({ html: "", show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, setToastState]);

  if (!toast.show) return null;

  return (
    <>
      {/* mobile */}
      <div className="toast-mobile fixed left-1/2 z-[999999] flex min-w-[310px] -translate-x-1/2 items-center justify-center rounded px-6 py-3 text-xs text-white opacity-0 [background-color:rgba(0,0,0,0.87)] dark:[background-color:rgba(255,255,255,0.12)] dark:text-slate-100 md:hidden">
        {toast.html}
      </div>
      {/* desktop */}
      <div className="toast-desktop fixed left-1/2 z-[999999] hidden -translate-x-1/2 items-center justify-center rounded px-[50px] py-3 text-xs text-white opacity-0 [background-color:rgba(0,0,0,0.87)] dark:[background-color:rgba(255,255,255,0.12)] dark:text-slate-100 md:flex">
        {toast.html}
      </div>
    </>
  );
}
