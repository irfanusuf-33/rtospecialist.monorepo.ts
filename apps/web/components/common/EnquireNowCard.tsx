"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useGlobalToastStore } from "@/state/useGlobalToastStore";
import { usePageLoaderStore } from "@/state/usePageLoaderStore";
import URLUtils from "@/scripts/UrlUtils";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

type EnquireNowCardProps = {
  className?: string;
  title?: string;
  resourcePlaceholder?: string;
  commentsPlaceholder?: string;
  ctaLabel?: string;
  variant?: "default" | "compact";
  defaultResource?: string;
  contextLabel?: string;
};

type EnquiryFormState = {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  jobRole: string;
  sampleId: string;
  comments: string;
  marketingConsent: boolean;
};

type SampleDropdownOption = {
  _id: string;
  name: string;
  code: string;
};

const initialFormState: EnquiryFormState = {
  firstName: "",
  lastName: "",
  companyName: "",
  email: "",
  phone: "",
  jobRole: "",
  sampleId: "",
  comments: "",
  marketingConsent: false,
};

const samplePageSize = 20;

const jobRoleOptions = [
  "CEO / Owner",
  "Compliance Manager",
  "Head of Training",
  "Administration / Operations",
  "Marketing Manager",
  "Trainer / Assessor",
  "Student Services",
  "Other",
];

const getPaginationFromResponse = (data: Record<string, unknown>) => {
  const pagination = (data.pagination && typeof data.pagination === "object")
    ? data.pagination as Record<string, unknown>
    : null;
  const currentPage = Number(pagination?.currentPage || data.currentPage || 1);
  const directTotalPages = Number(data.totalPages || data.totalPage || data.pages || 0);

  if (directTotalPages > 0) {
    return { currentPage, totalPages: directTotalPages };
  }

  if (pagination) {
    const paginationTotalPages = Number(pagination.totalPages || pagination.totalPage || pagination.pages || 0);

    if (paginationTotalPages > 0) {
      return { currentPage, totalPages: paginationTotalPages };
    }
  }

  const totalItems = Number(
    data.totalItems ||
    data.totalCount ||
    data.total ||
    data.count ||
    pagination?.totalItems ||
    pagination?.totalCount ||
    pagination?.total ||
    0,
  );

  if (totalItems > 0) {
    return { currentPage, totalPages: Math.ceil(totalItems / samplePageSize) };
  }

  return { currentPage, totalPages: currentPage };
};

const extractSubcategoryCode = (value: string) => value.trim().split(/\s+/)[0] || "";

const normaliseSubcategories = (data: unknown) => {
  const rawSubcategories = Array.isArray(data)
    ? data
    : data && typeof data === "object"
      ? (
        (data as Record<string, unknown>).subcategories ||
        (data as Record<string, unknown>).data ||
        (data as Record<string, unknown>).items ||
        []
      )
      : [];

  if (!Array.isArray(rawSubcategories)) {
    return [];
  }

  return rawSubcategories.reduce<SampleDropdownOption[]>((items, item) => {
    if (!item || typeof item !== "object") {
      return items;
    }

    const subcategory = item as Record<string, unknown>;
    const id = typeof subcategory._id === "string" ? subcategory._id : "";
    const name = typeof subcategory.name === "string"
      ? subcategory.name.trim()
      : typeof subcategory.title === "string"
        ? subcategory.title.trim()
        : "";
    const isDisabled = Boolean(subcategory.disable);
    const code = typeof subcategory.code === "string" && subcategory.code.trim()
      ? subcategory.code.trim()
      : extractSubcategoryCode(name);

    if (!id || !name || !code || isDisabled) {
      return items;
    }

    items.push({ _id: id, name, code });
    return items;
  }, []);
};

export default function EnquireNowCard({
  className = "",
  title = "Enquire Now",
  resourcePlaceholder = "Select Sample*",
  commentsPlaceholder = "Additional Comments or Questions*",
  ctaLabel = "Send",
  variant = "default",
  defaultResource = "",
}: EnquireNowCardProps) {
  const [formData, setFormData] = useState<EnquiryFormState>({
    ...initialFormState,
    sampleId: defaultResource,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryFormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isJobRoleDropdownOpen, setIsJobRoleDropdownOpen] = useState(false);
  const [isSampleDropdownOpen, setIsSampleDropdownOpen] = useState(false);
  const [samplePage, setSamplePage] = useState(0);
  const [sampleTotalPages, setSampleTotalPages] = useState<number | null>(null);
  const [isSampleOptionsLoading, setIsSampleOptionsLoading] = useState(false);
  const [sampleOptions, setSampleOptions] = useState<SampleDropdownOption[]>([]);
  const jobRoleDropdownRef = useRef<HTMLDivElement | null>(null);
  const sampleDropdownRef = useRef<HTMLDivElement | null>(null);
  const sampleDropdownListRef = useRef<HTMLDivElement | null>(null);
  const loadingSamplePagesRef = useRef<Set<number>>(new Set());
  const setToastState = useGlobalToastStore((state) => state.setToastState);
  const setLoading = usePageLoaderStore((state) => state.setLoading);

  const hasMoreSampleOptions = sampleTotalPages === null || samplePage < sampleTotalPages;
  const selectedSample = sampleOptions.find((sample) => sample.code === formData.sampleId) || null;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!jobRoleDropdownRef.current?.contains(event.target as Node)) {
        setIsJobRoleDropdownOpen(false);
      }

      if (!sampleDropdownRef.current?.contains(event.target as Node)) {
        setIsSampleDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const fetchSampleOptionsPage = useCallback(async (page: number) => {
    if (isSampleOptionsLoading || loadingSamplePagesRef.current.has(page)) {
      return;
    }

    try {
      loadingSamplePagesRef.current.add(page);
      setIsSampleOptionsLoading(true);
      const res = await URLUtils.get("SubCategory-ShowAllSubCategory", {
        page,
        limit: samplePageSize,
      });

      if (res.status === 200) {
        const nextSubcategories = normaliseSubcategories(res.data);
        const pagination = getPaginationFromResponse(res.data as Record<string, unknown>);
        setSampleOptions((current) => {
          const seen = new Set(current.map((sample) => sample._id));
          const merged = [...current];

          nextSubcategories.forEach((sample) => {
            if (seen.has(sample._id)) {
              return;
            }

            seen.add(sample._id);
            merged.push(sample);
          });

          return merged;
        });
        setSamplePage(pagination.currentPage);
        setSampleTotalPages(pagination.totalPages);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { err?: string; e?: string; message?: string } } };
      setToastState({
        html: err.response?.data?.err || err.response?.data?.e || err.response?.data?.message || "Unable to load samples.",
        show: true,
      });
    } finally {
      loadingSamplePagesRef.current.delete(page);
      setIsSampleOptionsLoading(false);
    }
  }, [isSampleOptionsLoading, setToastState]);

  useEffect(() => {
    if (!isSampleDropdownOpen || sampleOptions.length > 0) {
      return;
    }

    void fetchSampleOptionsPage(1);
  }, [fetchSampleOptionsPage, isSampleDropdownOpen, sampleOptions.length]);

  const loadNextSampleOptionsPage = () => {
    if (isSampleOptionsLoading || !hasMoreSampleOptions) {
      return;
    }

    void fetchSampleOptionsPage(samplePage + 1);
  };

  const handleSampleDropdownScroll = () => {
    const container = sampleDropdownListRef.current;

    if (!container || !isSampleDropdownOpen || isSampleOptionsLoading || !hasMoreSampleOptions) {
      return;
    }

    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;

    if (distanceFromBottom <= 48) {
      loadNextSampleOptionsPage();
    }
  };

  const updateField = (field: keyof EnquiryFormState, value: string | boolean) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof EnquiryFormState, string>> = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneDigits = formData.phone.replace(/\D/g, "");

    if (!formData.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!formData.companyName.trim()) nextErrors.companyName = "Company/RTO name is required.";
    if (!formData.email.trim()) nextErrors.email = "Email is required.";
    else if (!emailPattern.test(formData.email)) nextErrors.email = "Enter a valid email address.";
    if (!formData.phone.trim()) nextErrors.phone = "Phone is required.";
    else if (phoneDigits.length < 8) nextErrors.phone = "Enter a valid phone number.";
    if (!formData.jobRole.trim()) nextErrors.jobRole = "Please select a job role.";
    if (!formData.sampleId.trim()) nextErrors.sampleId = "Please select a sample.";
    if (!formData.comments.trim()) nextErrors.comments = "Please add your enquiry.";

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

      await URLUtils.post("FreeSample-Request", {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        company: formData.companyName.trim(),
        rtoName: formData.companyName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        jobRole: formData.jobRole.trim(),
        comment: formData.comments.trim(),
        sampleId: formData.sampleId,
        marketingConsent: formData.marketingConsent,
      });

      setToastState({
        html: "Your enquiry has been sent. Our team will get back to you soon.",
        show: true,
      });
      setFormData({
        ...initialFormState,
        sampleId: defaultResource,
      });
      setErrors({});
    } catch (error: unknown) {
      const err = error as { response?: { data?: { err?: string; e?: string; message?: string } } };
      setToastState({
        html: err.response?.data?.err || err.response?.data?.e || err.response?.data?.message || "We could not send your enquiry. Please try again.",
        show: true,
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const compact = variant === "compact";
  const cardClassName = compact
    ? "overflow-hidden rounded-[6px] border border-[#d4b1b1] bg-[linear-gradient(180deg,#fff7f7_0%,#ffd6d6_100%)] p-0 shadow-[0_6px_14px_rgba(15,23,42,0.18)]"
    : "overflow-hidden rounded-2xl border border-[#e3bcbc] bg-[linear-gradient(180deg,#fff8f8_0%,#ffdede_100%)] p-4 shadow-[0_8px_20px_rgba(15,23,42,0.10)] dark:border-slate-800 dark:bg-slate-950";
  const headingClassName = compact
    ? "bg-[#1D2955] px-4 py-3 text-center text-[15px] font-semibold tracking-tight text-white"
    : "text-center text-[2rem] font-semibold tracking-tight text-slate-950 dark:text-white";
  const bodyClassName = compact ? "space-y-3 px-3.5 py-6" : "mt-6 space-y-3";
  const inputClassName = compact
    ? "min-h-9 w-full rounded-[5px] border border-[#b7b7b7] bg-white px-3 text-[12px] font-medium text-slate-900 outline-none placeholder:text-slate-500 focus:border-[#1D2955] focus:ring-1 focus:ring-[#1D2955]"
    : "min-h-12 w-full rounded-xl border border-[#d8c7c7] bg-white px-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-500 focus:border-[#1D2955] focus:ring-1 focus:ring-[#1D2955]";
  const textareaClassName = compact
    ? "min-h-[82px] w-full resize-none rounded-[5px] border border-[#b7b7b7] bg-white px-3 py-2.5 text-[12px] font-medium text-slate-900 outline-none placeholder:text-slate-500 focus:border-[#1D2955] focus:ring-1 focus:ring-[#1D2955]"
    : "min-h-24 w-full resize-none rounded-xl border border-[#d8c7c7] bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-500 focus:border-[#1D2955] focus:ring-1 focus:ring-[#1D2955]";
  const buttonClassName = compact
    ? "inline-flex min-h-11 w-[118px] items-center justify-center rounded-full bg-[#ff1010] px-4 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
    : "inline-flex min-h-12 w-full items-center justify-center rounded-full bg-red-500 px-4 text-base font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60";
  const errorClassName = compact ? "px-1 text-[10px] font-medium text-red-700" : "px-1 text-xs text-red-600";

  return (
    <section className={`${cardClassName} ${className}`.trim()} aria-label={title}>
      <h3 className={headingClassName}>{title}</h3>
      <form className={bodyClassName} onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="First name*"
            className={inputClassName}
            value={formData.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
          />
          {errors.firstName ? <p className={errorClassName}>{errors.firstName}</p> : null}
        </div>
        <div>
          <input
            type="text"
            placeholder="Last name*"
            className={inputClassName}
            value={formData.lastName}
            onChange={(event) => updateField("lastName", event.target.value)}
          />
          {errors.lastName ? <p className={errorClassName}>{errors.lastName}</p> : null}
        </div>
        <div>
          <input
            type="text"
            placeholder="Company/RTO name*"
            className={inputClassName}
            value={formData.companyName}
            onChange={(event) => updateField("companyName", event.target.value)}
          />
          {errors.companyName ? <p className={errorClassName}>{errors.companyName}</p> : null}
        </div>
        <div>
          <input
            type="email"
            placeholder="Your Email*"
            className={inputClassName}
            value={formData.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
          {errors.email ? <p className={errorClassName}>{errors.email}</p> : null}
        </div>
        <div>
          <input
            type="tel"
            placeholder="Phone*"
            className={inputClassName}
            value={formData.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
          {errors.phone ? <p className={errorClassName}>{errors.phone}</p> : null}
        </div>
        <div>
          <div className="relative" ref={jobRoleDropdownRef}>
            <button
              type="button"
              className={`${inputClassName} flex items-center justify-between text-left ${formData.jobRole ? "text-slate-700" : "text-slate-400"}`}
              onClick={() => setIsJobRoleDropdownOpen((current) => !current)}
              aria-haspopup="listbox"
              aria-expanded={isJobRoleDropdownOpen}
            >
              <span>{formData.jobRole || "Job Role*"}</span>
              <KeyboardArrowDownRoundedIcon
                className={`transition ${isJobRoleDropdownOpen ? "rotate-180" : ""}`}
                sx={{ fontSize: 20 }}
              />
            </button>

            {isJobRoleDropdownOpen && (
              <div className="absolute left-0 right-0 z-30 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                <ul className="max-h-52 overflow-y-auto py-1" role="listbox">
                  {jobRoleOptions.map((role) => (
                    <li key={role}>
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 focus:bg-slate-100 focus:outline-none"
                        onClick={() => {
                          updateField("jobRole", role);
                          setIsJobRoleDropdownOpen(false);
                        }}
                        role="option"
                        aria-selected={formData.jobRole === role}
                      >
                        {role}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {errors.jobRole ? <p className={errorClassName}>{errors.jobRole}</p> : null}
        </div>
        <div>
          <div className="relative" ref={sampleDropdownRef}>
            <button
              type="button"
              className={`${inputClassName} flex items-center justify-between text-left ${formData.sampleId ? "text-slate-700" : "text-slate-400"}`}
              onClick={() => setIsSampleDropdownOpen((current) => !current)}
              aria-haspopup="listbox"
              aria-expanded={isSampleDropdownOpen}
            >
              <span>{selectedSample?.name || resourcePlaceholder}</span>
              <KeyboardArrowDownRoundedIcon
                className={`transition ${isSampleDropdownOpen ? "rotate-180" : ""}`}
                sx={{ fontSize: 20 }}
              />
            </button>

            {isSampleDropdownOpen && (
              <div className="absolute left-0 right-0 z-30 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                <div
                  ref={sampleDropdownListRef}
                  className="max-h-52 overflow-y-auto"
                  onScroll={handleSampleDropdownScroll}
                >
                  <ul className="py-1" role="listbox">
                    {sampleOptions.map((sample) => (
                      <li key={sample._id}>
                        <button
                          type="button"
                          className="w-full px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 focus:bg-slate-100 focus:outline-none"
                          onClick={() => {
                            updateField("sampleId", sample.code);
                            setIsSampleDropdownOpen(false);
                          }}
                          role="option"
                          aria-selected={formData.sampleId === sample.code}
                        >
                          {sample.name}
                        </button>
                      </li>
                    ))}
                    {isSampleOptionsLoading ? (
                      <li className="px-3 py-2 text-sm text-slate-500">
                        Loading samples...
                      </li>
                    ) : null}
                    {!isSampleOptionsLoading && sampleOptions.length === 0 ? (
                      <li className="px-3 py-2 text-sm text-slate-500">
                        No samples available.
                      </li>
                    ) : null}
                    {hasMoreSampleOptions ? (
                      <li className="px-2 py-2">
                        <button
                          type="button"
                          className="w-full rounded-md px-3 py-2 text-left text-xs font-semibold text-[#0E74BC] transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-slate-400"
                          onClick={loadNextSampleOptionsPage}
                          disabled={isSampleOptionsLoading}
                        >
                          {isSampleOptionsLoading ? "Loading more..." : "Load more"}
                        </button>
                      </li>
                    ) : null}
                  </ul>
                </div>
              </div>
            )}
          </div>
          {errors.sampleId ? <p className={errorClassName}>{errors.sampleId}</p> : null}
        </div>
        <div>
          <textarea
            placeholder={commentsPlaceholder}
            className={textareaClassName}
            value={formData.comments}
            onChange={(event) => updateField("comments", event.target.value)}
          />
          {errors.comments ? <p className={errorClassName}>{errors.comments}</p> : null}
        </div>
        {compact ? (
          <div className="pt-2">
            <button type="submit" className={buttonClassName} disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : ctaLabel}
            </button>
          </div>
        ) : (
          <button type="submit" className={buttonClassName} disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : ctaLabel}
          </button>
        )}
      </form>
    </section>
  );
}
