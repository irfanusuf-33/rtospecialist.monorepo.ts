"use client"


import { useState } from "react";

const COOKIE_ACCEPTED_KEY = "cookies_accepted";

export default function CookiesAgreement () {
  const [rejected, setRejected] = useState(false);
  const [accepted, setAccepted] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.localStorage.getItem(COOKIE_ACCEPTED_KEY) === "true";
  });

  const handleAccept = () => {
    window.localStorage.setItem(COOKIE_ACCEPTED_KEY, "true");
    setAccepted(true);
  };

  const handleReject = () => {
    window.localStorage.setItem(COOKIE_ACCEPTED_KEY, "false");
    setRejected(true);
  };

  if (accepted || rejected) {
    return null;
  }

  return (
    <section
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(17,24,39,0.55)] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="w-full max-w-[420px] rounded-lg border border-[#fee2e2] bg-white shadow-[rgba(0,0,0,0.24)_0px_3px_8px]">
        <h2 id="cookie-consent-title" className="mb-3 border-b border-[#9ca3af] p-5 text-2xl font-semibold text-[#1D1D1D]">
          Cookie Preferences
        </h2>
        <p id="cookie-consent-description" className="px-5 text-sm text-[#374151]">
          Our site uses cookies to improve your experience. Please choose whether you want to accept cookies.
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-3 pb-5 pr-5">
          <button
            onClick={handleReject}
            className="min-w-[108px] rounded-full border border-[#d1d5db] bg-white px-[18px] py-[10px] text-sm font-medium text-[#111827] transition-all duration-[250ms] hover:border-[#9ca3af] hover:bg-[#f1f5f9]"
            type="button"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="min-w-[108px] rounded-full border border-transparent bg-gradient-to-b from-[#dc2626] to-[#b91c1c] px-[18px] py-[10px] text-sm font-medium text-white transition-all duration-[250ms] hover:from-[#b91c1c] hover:to-[#991b1b] hover:shadow-[4px_10px_30px_#fca5a5]"
            type="button"
          >
            Accept
          </button>
        </div>
      </div>
    </section>
  );
}
