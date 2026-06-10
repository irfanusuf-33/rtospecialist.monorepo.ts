"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navigation from "@/components/common/Navigation";
import PageHeader from "@/components/common/nav/PageHeader";
import Footer from "@/components/common/Footer";

interface AppChromeProps {
  children: ReactNode;
}

export default function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const hideGlobalChrome = pathname === "/training-quiz";

  if (hideGlobalChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="sticky top-0 z-[1000]">
        <PageHeader />
        <Navigation />
      </div>
      {children}
      <Footer />
    </>
  );
}
