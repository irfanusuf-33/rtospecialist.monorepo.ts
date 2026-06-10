"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import URLUtils from "@/scripts/UrlUtils";

type GetFreeSampleForm = {
  name: string;
  email: string;
  phone: string;
  rtoName: string;
  enquiryType: string;
  comment: string;
};

type GetFreeSampleCardProps = {
  className?: string;
  title?: string;
  submitLabel?: string;
  onSubmit?: (payload: GetFreeSampleForm) => void | Promise<void>;
};

export default function GetFreeSampleCard({
  className = "",
  title = "CONTACT US",
  submitLabel = "Send",
  onSubmit,
}: GetFreeSampleCardProps) {
  const [isEnquiryDropdownOpen, setIsEnquiryDropdownOpen] = useState(false);
  const enquiryDropdownRef = useRef<HTMLDivElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<GetFreeSampleForm>({
    name: "",
    email: "",
    phone: "",
    rtoName: "",
    enquiryType: "",
    comment: "",
  });

  const enquiryOptions = [
    "Training Resources",
    "Professional Development",
    "Consulting",
    "Buy Sell Lease",
    "Membership",
  ];

  const selectedEnquiryLabel = useMemo(
    () => formData.enquiryType || "Type of enquiry",
    [formData.enquiryType]
  );

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!enquiryDropdownRef.current?.contains(event.target as Node)) {
        setIsEnquiryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const updateField = (field: keyof GetFreeSampleForm, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (onSubmit) {
      try {
        setIsSubmitting(true);
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await URLUtils.post("ContactUs-email", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        rtoName: formData.rtoName.trim(),
        enquiryType: formData.enquiryType.trim(),
        comment: formData.comment.trim(),
      });
      setSuccessMessage(response.data.message || "Sample request submitted successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        rtoName: "",
        enquiryType: "",
        comment: "",
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setErrorMessage(
        err.response?.data?.message || "Failed to send request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName =
    "h-9 w-full rounded-md border border-[#D9DEE8] bg-white px-3 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#0E74BC] focus:ring-2 focus:ring-[#0E74BC]/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500";
  const contactLinkClassName =
    "inline-flex items-center gap-2 text-[13px] font-semibold text-[#0E74BC] transition hover:text-[#0B5C95] dark:text-sky-300 dark:hover:text-sky-200";

  return (
    <section
      className={`${className}`}
      aria-label="Contact us"
    >
      <div
        className="rounded-[32px] border border-transparent shadow-[0_18px_48px_rgba(15,23,42,0.08)]"
        style={{
          background:
            "linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(92.15deg, #5B89FF 0.14%, #FF0909 99.83%) border-box",
        }}
      >
        <div className="rounded-[31px] bg-white px-3 py-5 dark:bg-slate-950 sm:px-4 lg:px-3">
          <h2 className="text-center text-[22px] font-extrabold tracking-tight text-slate-950 dark:text-white lg:text-[22px]">
            {title}
          </h2>

          {successMessage && (
            <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
              {errorMessage}
            </div>
          )}

          <form className="mt-5 grid gap-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
              <input
                type="text"
                className={inputClassName}
                placeholder="Name"
                value={formData.name}
                onChange={(event) => updateField("name", event.target.value)}
                aria-label="Name"
                required
              />
              <input
                type="tel"
                className={inputClassName}
                placeholder="Phone no"
                value={formData.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                aria-label="Phone number"
                required
              />
              <input
                type="email"
                className={inputClassName}
                placeholder="Your Email"
                value={formData.email}
                onChange={(event) => updateField("email", event.target.value)}
                aria-label="Your Email"
                required
              />
              <input
                type="text"
                className={inputClassName}
                placeholder="RTO Name"
                value={formData.rtoName}
                onChange={(event) => updateField("rtoName", event.target.value)}
                aria-label="RTO Name"
                required
              />

              <div className="relative" ref={enquiryDropdownRef}>
                <button
                  type="button"
                  className={`${inputClassName} flex items-center justify-between text-left`}
                  onClick={() => setIsEnquiryDropdownOpen((current) => !current)}
                  aria-haspopup="listbox"
                  aria-expanded={isEnquiryDropdownOpen}
                  aria-label="Type of enquiry"
                >
                  <span className={formData.enquiryType ? "" : "text-slate-400 dark:text-slate-500"}>{selectedEnquiryLabel}</span>
                  <KeyboardArrowDownRoundedIcon
                    className={`transition ${isEnquiryDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isEnquiryDropdownOpen && (
                  <div className="absolute left-0 right-0 z-30 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
                    <ul className="max-h-52 overflow-y-auto py-1" role="listbox" aria-label="Type of enquiry">
                      {enquiryOptions.map((type) => (
                        <li key={type}>
                          <button
                            type="button"
                            className="w-full px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 focus:bg-slate-100 focus:outline-none dark:text-slate-100 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
                            onClick={() => {
                              updateField("enquiryType", type);
                              setIsEnquiryDropdownOpen(false);
                            }}
                            role="option"
                            aria-selected={formData.enquiryType === type}
                          >
                            {type}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_272px]">
              <textarea
                className="h-12 w-full resize-none rounded-md border border-[#D9DEE8] bg-white px-4 py-[13px] text-[13px] leading-5 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#0E74BC] focus:ring-2 focus:ring-[#0E74BC]/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                placeholder="Leave a Comment"
                value={formData.comment}
                onChange={(event) => updateField("comment", event.target.value)}
                aria-label="Leave a Comment"
              />
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#FF1208] px-8 text-sm font-semibold text-white transition hover:bg-[#E20F06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E74BC] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : submitLabel}
              </button>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 pt-1 text-center sm:flex-row sm:flex-wrap sm:gap-9">
              <a href="tel:+610370739799" className={contactLinkClassName}>
                <LocalPhoneRoundedIcon sx={{ fontSize: 18 }} />
                <span>+61 (03) 7073 9799</span>
              </a>
              <a href="mailto:enquiries@rtospecialist.com.au" className={contactLinkClassName}>
                <EmailOutlinedIcon sx={{ fontSize: 18 }} />
                <span>enquiries@rtospecialist.com.au</span>
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
