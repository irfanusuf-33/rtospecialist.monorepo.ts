"use client";

import { useState } from "react";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useGlobalToastStore } from "@/state/useGlobalToastStore";
import { usePageLoaderStore } from "@/state/usePageLoaderStore";
import URLUtils from "@/scripts/UrlUtils";

type AppointmentFormState = {
  name: string;
  phoneNumber: string;
  email: string;
  companyName: string;
  inquiryType: string;
  message: string;
};

const inquiryOptions = [
  "Training Resources",
  "Professional Development",
  "Consulting",
  "Buy Sell Lease",
  "Membership",
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/p/RTO-Specialist-61571619574667/",
    icon: FacebookRoundedIcon,
    className: "bg-[#4267B2]",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/rto_specialist/",
    icon: InstagramIcon,
    className: "bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)]",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/rto-specialist/",
    icon: LinkedInIcon,
    className: "bg-[#0077B5]",
  },
];

const initialState: AppointmentFormState = {
  name: "",
  phoneNumber: "",
  email: "",
  companyName: "",
  inquiryType: "",
  message: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function BookAppointmentClient() {
  const [formData, setFormData] = useState<AppointmentFormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof AppointmentFormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setToastState = useGlobalToastStore((state) => state.setToastState);
  const setLoading = usePageLoaderStore((state) => state.setLoading);

  const updateField = (field: keyof AppointmentFormState, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof AppointmentFormState, string>> = {};
    const digits = formData.phoneNumber.replace(/\D/g, "");

    if (!formData.name.trim()) nextErrors.name = "Please enter your name.";
    if (!formData.phoneNumber.trim()) nextErrors.phoneNumber = "Please enter your phone number.";
    else if (digits.length < 8) nextErrors.phoneNumber = "Please enter a valid phone number.";
    if (!formData.email.trim()) nextErrors.email = "Please enter your email.";
    else if (!emailPattern.test(formData.email.trim())) nextErrors.email = "Please enter a valid email.";
    if (!formData.companyName.trim()) nextErrors.companyName = "Please enter your RTO name.";
    if (!formData.inquiryType.trim()) nextErrors.inquiryType = "Please select a type of inquiry.";
    if (!formData.message.trim()) nextErrors.message = "Please leave a comment.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setLoading(true);

      await URLUtils.post("ContactUs-email", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phoneNumber.trim(),
        rtoName: formData.companyName.trim(),
        enquiryType: formData.inquiryType.trim(),
        comment: formData.message.trim(),
      });

      setToastState({
        html: "We have received your request. Our team will get back to you soon!",
        show: true,
      });
      setFormData(initialState);
      setErrors({});
    } catch (error: unknown) {
      const err = error as { response?: { data?: { err?: string; e?: string; message?: string } } };
      setToastState({
        html: err.response?.data?.err || err.response?.data?.e || err.response?.data?.message || "Something went wrong. Please try again later.",
        show: true,
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-white px-4 py-6 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-6 lg:py-10">
      <div className="mx-auto max-w-[1040px]">
        <div className="text-center">
          <span className="inline-flex rounded-full bg-[#eef6ff] px-4 py-1 text-sm font-medium text-[#0E74BC] dark:bg-slate-800 dark:text-sky-300">
            Contact Us
          </span>
          <h1 className="mt-2 text-[2rem] font-bold tracking-tight text-[#111111] dark:text-white sm:text-[3rem]">
            Get In <span className="text-[#ff1010]">Touch</span> With Us
          </h1>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.85fr)] lg:items-start">
          <section className="rounded-[16px] border border-[#edf2fb] bg-white p-4 shadow-[0_12px_30px_rgba(14,116,188,0.08)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30 sm:p-5">
            <p className="mx-auto max-w-[360px] text-center text-[15px] leading-7 text-slate-500 dark:text-slate-300">
              Please fill in your details, and our team will get in touch with you regarding your query.
            </p>

            <form className="mt-4 space-y-3.5" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="min-h-11 w-full rounded-[9px] border border-[#d9dde5] bg-white px-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0E74BC] dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-400"
                />
                {errors.name ? <p className="px-1 pt-1 text-xs text-red-600">{errors.name}</p> : null}
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Phone no"
                  value={formData.phoneNumber}
                  onChange={(event) => updateField("phoneNumber", event.target.value)}
                  className="min-h-11 w-full rounded-[9px] border border-[#d9dde5] bg-white px-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0E74BC] dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-400"
                />
                {errors.phoneNumber ? <p className="px-1 pt-1 text-xs text-red-600">{errors.phoneNumber}</p> : null}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="min-h-11 w-full rounded-[9px] border border-[#d9dde5] bg-white px-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0E74BC] dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-400"
                />
                {errors.email ? <p className="px-1 pt-1 text-xs text-red-600">{errors.email}</p> : null}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="RTO Name"
                  value={formData.companyName}
                  onChange={(event) => updateField("companyName", event.target.value)}
                  className="min-h-11 w-full rounded-[9px] border border-[#d9dde5] bg-white px-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0E74BC] dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-400"
                />
                {errors.companyName ? <p className="px-1 pt-1 text-xs text-red-600">{errors.companyName}</p> : null}
              </div>

              <div>
                <select
                  value={formData.inquiryType}
                  onChange={(event) => updateField("inquiryType", event.target.value)}
                  className="min-h-11 w-full rounded-[9px] border border-[#d9dde5] bg-white px-4 text-[15px] text-slate-600 outline-none transition focus:border-[#0E74BC] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-sky-400"
                >
                  <option value="" disabled>
                    Type of inquiry
                  </option>
                  {inquiryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.inquiryType ? <p className="px-1 pt-1 text-xs text-red-600">{errors.inquiryType}</p> : null}
              </div>

              <div>
                <textarea
                  placeholder="Leave a comment"
                  value={formData.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  className="min-h-[106px] w-full resize-none rounded-[9px] border border-[#d9dde5] bg-white px-4 py-2.5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0E74BC] dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-400"
                />
                {errors.message ? <p className="px-1 pt-1 text-xs text-red-600">{errors.message}</p> : null}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#ff1010] px-6 text-[15px] font-semibold text-white transition hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E74BC] dark:focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Sending..." : "Send Your Request"}
              </button>
            </form>
          </section>

          <aside className="lg:pt-1">
            <div>
              <h2 className="text-[2rem] font-bold tracking-tight text-[#111111] dark:text-white">
                Our Details
              </h2>

              <div className="mt-6 space-y-5">
                <a
                  href="mailto:enquiries@rtospecialist.com.au"
                  className="flex items-center gap-4 text-[15px] text-[#0E74BC] transition hover:text-[#0b5f98] dark:text-sky-300 dark:hover:text-sky-200"
                >
                  <EmailOutlinedIcon className="shrink-0 !text-[26px]" />
                  <span className="break-all font-medium">enquiries@rtospecialist.com.au</span>
                </a>

                <a
                  href="tel:+610370739799"
                  className="flex items-center gap-4 text-[15px] text-slate-600 transition hover:text-[#0E74BC] dark:text-slate-300 dark:hover:text-sky-300"
                >
                  <PhoneOutlinedIcon className="shrink-0 !text-[26px] text-[#0E74BC] dark:text-sky-300" />
                  <span className="font-medium">+61 (03) 7073 9799</span>
                </a>

                <div className="flex items-center gap-4 text-[15px] text-slate-600 dark:text-slate-300">
                  <LocationOnOutlinedIcon className="shrink-0 self-start !text-[26px] text-[#0E74BC] dark:text-sky-300" />
                  <span className="font-medium">2/59-63 Mark St, North Melbourne VIC 3051</span>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-[2rem] font-bold tracking-tight text-[#111111] dark:text-white">
                  Stay Connected
                </h3>

                <div className="mt-5 flex items-center gap-3">
                  {socialLinks.map(({ href, label, icon: Icon, className }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:scale-[1.04] ${className}`}
                    >
                      <Icon sx={{ fontSize: 22 }} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
