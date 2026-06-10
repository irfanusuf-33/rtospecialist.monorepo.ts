"use client";

import * as Dialog from "@radix-ui/react-dialog";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import freeSampleModalImage from "@/assets/freesamplemodalimage.svg";
import URLUtils from "@/scripts/UrlUtils";
import { useGlobalToastStore } from "@/state/useGlobalToastStore";
import { usePageLoaderStore } from "@/state/usePageLoaderStore";

type SampleFormState = {
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

type SampleSubcategory = {
  _id: string;
  name: string;
  code: string;
};

type BookFreeSampleModalProps = {
  children?: ReactNode;
  triggerClassName?: string;
  triggerLabel?: string;
  defaultResource?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const initialFormState: SampleFormState = {
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

const leftPanelHighlights = [
  {
    title: "Audit-Ready Resources",
    description: "Mapped to unit requirements and ASQA standards.",
    icon: DescriptionOutlinedIcon,
    className: "xl:absolute xl:left-0 xl:top-[5.875rem]",
  },
  {
    title: "Stay Compliant with Confidence",
    description: "Updated with the latest regulatory requirements.",
    icon: GppGoodOutlinedIcon,
    className: "xl:absolute xl:right-0 xl:top-[1.75rem]",
  },
  {
    title: "Save Time & Reduce Costs",
    description: "Built to minimise rework and hidden compliance costs.",
    icon: HeadsetMicOutlinedIcon,
    className: "xl:absolute xl:left-0 xl:bottom-[2.875rem]",
  },
  {
    title: "Trusted by RTOs Australia-Wide",
    description: "Supporting RTOs of all sizes and scopes across Australia.",
    icon: GroupsRoundedIcon,
    className: "xl:absolute xl:right-0 xl:bottom-[6.25rem]",
  },
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

  return rawSubcategories.reduce<SampleSubcategory[]>((items, item) => {
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
    const code = extractSubcategoryCode(name);

    if (!id || !name || !code || isDisabled) {
      return items;
    }

    items.push({ _id: id, name, code });
    return items;
  }, []);
};

export default function BookFreeSampleModal({
  children,
  triggerClassName = "",
  triggerLabel = "Book Free Sample",
  defaultResource = "",
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: BookFreeSampleModalProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [formData, setFormData] = useState<SampleFormState>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof SampleFormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSampleDropdownOpen, setIsSampleDropdownOpen] = useState(false);
  const [samplePage, setSamplePage] = useState(0);
  const [sampleTotalPages, setSampleTotalPages] = useState<number | null>(null);
  const [isSampleOptionsLoading, setIsSampleOptionsLoading] = useState(false);
  const [sampleOptions, setSampleOptions] = useState<SampleSubcategory[]>([]);
  const sampleDropdownRef = useRef<HTMLDivElement | null>(null);
  const sampleDropdownListRef = useRef<HTMLDivElement | null>(null);
  const loadingSamplePagesRef = useRef<Set<number>>(new Set());
  const setToastState = useGlobalToastStore((state) => state.setToastState);
  const setLoading = usePageLoaderStore((state) => state.setLoading);

  const hasMoreSampleOptions = sampleTotalPages === null || samplePage < sampleTotalPages;
  const open = controlledOpen ?? uncontrolledOpen;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!sampleDropdownRef.current?.contains(event.target as Node)) {
        setIsSampleDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!open || !defaultResource) {
      return;
    }

    const matchedSample = sampleOptions.find((sample) => (
      sample.code === defaultResource || sample.name === defaultResource
    ));

    if (!matchedSample) {
      return;
    }

    setFormData((current) => {
      if (current.sampleId) {
        return current;
      }

      return { ...current, sampleId: matchedSample.code };
    });
  }, [defaultResource, open, sampleOptions]);

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

  const updateField = <K extends keyof SampleFormState>(field: K, value: SampleFormState[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof SampleFormState, string>> = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneDigits = formData.phone.replace(/\D/g, "");

    if (!formData.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!formData.companyName.trim()) nextErrors.companyName = "Company is required.";
    if (!formData.email.trim()) nextErrors.email = "Email is required.";
    else if (!emailPattern.test(formData.email)) nextErrors.email = "Enter a valid email address.";
    if (!formData.phone.trim()) nextErrors.phone = "Phone is required.";
    else if (phoneDigits.length < 8) nextErrors.phone = "Enter a valid phone number.";
    if (!formData.jobRole.trim()) nextErrors.jobRole = "Job role is required.";
    if (!formData.sampleId.trim()) nextErrors.sampleId = "Please select a sample.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetModal = () => {
    setFormData(initialFormState);
    setErrors({});
    setShowThankYou(false);
    setIsSampleDropdownOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (controlledOnOpenChange) {
      controlledOnOpenChange(isOpen);
    } else {
      setUncontrolledOpen(isOpen);
    }

    if (!isOpen) {
      resetModal();
    }
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

      setShowThankYou(true);
      setFormData(initialFormState);
      setErrors({});
    } catch (error: unknown) {
      const err = error as { response?: { data?: { err?: string; e?: string; message?: string } } };
      setToastState({
        html: err.response?.data?.err || err.response?.data?.e || err.response?.data?.message || "Error sending sample",
        show: true,
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const inputClassName = "min-h-[48px] w-full rounded-[10px] border border-[#B8D7F1] bg-white px-3.5 text-[14px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0E74BC] focus:ring-2 focus:ring-[#0E74BC]/15 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-sky-400 dark:focus:ring-sky-400/15";
  const textareaClassName = "min-h-[84px] w-full resize-none rounded-[10px] border border-[#B8D7F1] bg-white px-3.5 py-3 text-[14px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0E74BC] focus:ring-2 focus:ring-[#0E74BC]/15 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-sky-400 dark:focus:ring-sky-400/15";
  const errorClassName = "mt-1 px-1 text-[11px] text-red-600 dark:text-red-400";

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        {children || (
          <button type="button" className={triggerClassName}>
            {triggerLabel}
          </button>
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[1100] bg-slate-950/55 backdrop-blur-sm dark:bg-black/70" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[1101] max-h-[calc(100vh-1rem)] w-[min(1080px,calc(100vw-1rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[24px] bg-white shadow-[0_28px_80px_rgba(15,23,42,0.28)] outline-none dark:bg-slate-950 dark:text-white sm:max-h-[calc(100vh-2rem)] sm:w-[min(1080px,calc(100vw-2rem))]">
          <Dialog.Title className="sr-only">
            {showThankYou ? "Your sample pack is on its way" : "Request your free sample pack"}
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            {showThankYou ? "Confirmation after requesting a free sample pack." : "Fill in your details to request a free sample pack."}
          </Dialog.Description>

          <Dialog.Close className="absolute right-3 top-3 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E74BC] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white dark:focus-visible:outline-sky-400" aria-label="Close sample modal">
            <CloseRoundedIcon className="!text-[2rem]" />
          </Dialog.Close>

          {showThankYou ? (
            <div className="mx-auto max-w-5xl px-4 py-5 sm:px-8 sm:py-7">
              <div className="mx-auto max-w-2xl">
                <div className="grid gap-4 sm:grid-cols-[96px_minmax(0,1fr)] sm:items-start">
                  <div className="relative mx-auto grid h-[80px] w-[80px] place-items-center rounded-full border border-[#66A9E3] bg-white text-[#0E74BC] dark:border-sky-400/70 dark:bg-slate-950 dark:text-sky-300">
                    <CheckRoundedIcon className="!text-[2.7rem]" />
                    <span className="absolute -left-3 top-1 text-[10px] text-[#66A9E3] dark:text-sky-300">✦</span>
                    <span className="absolute -left-1 -top-3 text-[9px] text-[#66A9E3] dark:text-sky-300">✦</span>
                    <span className="absolute left-5 -top-4 text-[10px] text-[#66A9E3] dark:text-sky-300">✦</span>
                    <span className="absolute right-2 -top-2 text-[8px] text-[#66A9E3] dark:text-sky-300">✦</span>
                    <span className="absolute -right-3 top-2 text-[10px] text-[#66A9E3] dark:text-sky-300">✦</span>
                    <span className="absolute -left-4 bottom-4 text-[9px] text-[#66A9E3] dark:text-sky-300">✦</span>
                  </div>

                  <div className="text-center sm:text-left">
                    <h2 className="text-[1.7rem] font-extrabold leading-[1.12] tracking-[-0.03em] text-slate-950 dark:text-white sm:text-[2.1rem]">
                      <span className="block">Your Sample Pack</span>
                      <span className="block text-[#FF1208] dark:text-[#FF5A4E]">Is On Its Way</span>
                    </h2>
                    <p className="mt-2 max-w-md text-[0.98rem] leading-7 text-slate-500 dark:text-slate-300">
                      Check your inbox in the next few minutes. You&apos;ll get a real preview of how our resources are structured for compliance.
                    </p>
                  </div>
                </div>

                <div className="my-6 h-px bg-slate-200 dark:bg-slate-800" />

                <div>
                  <h3 className="text-[1rem] font-extrabold leading-6 text-slate-950 dark:text-white">
                    But here&apos;s what most RTOs realise after reviewing the sample...
                  </h3>
                  <div className="mt-3 space-y-3">
                    {[
                      { icon: DescriptionOutlinedIcon, text: "The sample is just a small part of the full system" },
                      { icon: GppGoodOutlinedIcon, text: "Real compliance confidence comes from structure + updates + consistency" },
                      { icon: GroupsRoundedIcon, text: "That&apos;s exactly what our membership is designed for" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.text} className="flex items-center gap-3 text-[0.98rem] font-medium leading-6 text-slate-800 dark:text-slate-200">
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-50 text-[#0E74BC] dark:bg-sky-950/70 dark:text-sky-300">
                            <Icon className="!text-[16px]" />
                          </span>
                          <span>{item.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="my-6 h-px bg-slate-200 dark:bg-slate-800" />

                <div className="text-center">
                  <h3 className="text-[1.05rem] font-extrabold leading-6 text-[#FF1208] dark:text-[#FF5A4E]">
                    But here&apos;s what most RTOs realise after reviewing the sample...
                  </h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {[
                      { icon: LocalOfferOutlinedIcon, text: "Save on every unit purchase" },
                      { icon: SyncRoundedIcon, text: "Stay aligned with ongoing regulatory changes" },
                      { icon: HeadsetMicOutlinedIcon, text: "Access structured tools, updates, and support" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.text} className="flex items-center gap-3 rounded-[10px] border border-[#B9D7F1] bg-[#EEF5FF] px-4 py-3 text-left dark:border-slate-700 dark:bg-slate-900/60">
                          <span className="text-slate-950 dark:text-slate-100">
                            <Icon className="!text-[1.2rem]" />
                          </span>
                          <span className="text-[0.95rem] font-medium leading-6 text-slate-900 dark:text-slate-100">{item.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  <Link
                    href="/membership-plans"
                    onClick={() => handleOpenChange(false)}
                    className="mt-5 inline-flex min-h-[54px] w-full items-center justify-center rounded-full bg-[#0E74BC] px-5 text-[1rem] font-bold text-white transition hover:bg-[#0b5f98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E74BC] dark:bg-sky-500 dark:hover:bg-sky-400 dark:focus-visible:outline-sky-400"
                  >
                    Explore Membership Options
                  </Link>

                  <Dialog.Close className="mt-3 inline-flex min-h-[54px] w-full items-center justify-center rounded-full border border-[#0E74BC] bg-white px-5 text-[1rem] font-bold text-[#0E74BC] transition hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E74BC] dark:border-sky-400 dark:bg-slate-950 dark:text-sky-300 dark:hover:bg-slate-900 dark:focus-visible:outline-sky-400">
                    Continue exploring resources
                  </Dialog.Close>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid xl:grid-cols-[minmax(0,1.18fr)_minmax(0,0.88fr)]">
              <div className="overflow-hidden bg-[#F5FAFF] px-4 py-6 dark:bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)] sm:px-6 lg:px-7 lg:pb-0 lg:pt-7">
                <div className="max-w-[580px]">
                  <h2 className="max-w-[480px] text-[1.55rem] font-extrabold leading-[1.12] tracking-[-0.03em] text-slate-950 dark:text-white sm:text-[2rem]">
                    Get a Free Audit-Ready
                    <span className="mt-1 block text-[#FF1208] dark:text-[#FF5A4E]">Sample Pack</span>
                  </h2>
                  <p className="mt-3 max-w-[450px] text-[0.88rem] leading-6 text-slate-600 dark:text-slate-300 sm:text-[0.92rem]">
                    See how our resources are structured for compliance, validation and audit success.
                  </p>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:relative xl:min-h-[30rem] xl:grid-cols-1">
                  {leftPanelHighlights.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className={`relative z-10 rounded-[12px] border border-[#BCD9F3] bg-[#EEF5FF] p-2.5 shadow-[0_10px_28px_rgba(14,116,188,0.08)] dark:border-slate-700 dark:bg-slate-900/85 dark:shadow-none md:max-w-[17rem] xl:w-[12.9rem] ${item.className}`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="mt-0.5 text-[#0E74BC] dark:text-sky-300">
                            <Icon className="!text-[1.05rem]" />
                          </span>
                          <div>
                            <p className="text-[0.88rem] font-semibold leading-5 text-slate-950 dark:text-white">{item.title}</p>
                            <p className="mt-1 text-[12px] leading-5 text-slate-600 dark:text-slate-300">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="order-first mx-auto flex w-full justify-center md:order-none xl:absolute xl:inset-x-0 xl:bottom-0 xl:top-[0.5rem] xl:z-0 xl:items-end">
                    <Image
                      src={freeSampleModalImage}
                      alt="Free sample pack preview"
                      width={375}
                      height={580}
                      priority
                      className="h-auto w-full max-w-[210px] object-contain sm:max-w-[235px] lg:max-w-[250px] xl:max-w-[280px]"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-[#CFE7FA] px-4 py-4 text-[#163D67] dark:bg-slate-900 dark:text-slate-200">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/70 text-[#0E74BC] dark:bg-slate-800 dark:text-sky-300">
                    <WorkspacePremiumRoundedIcon className="!text-[1.9rem]" />
                  </span>
                  <p className="text-[0.88rem] font-medium leading-6">
                    Members save on every unit and get ongoing compliance support.
                    <span className="block font-extrabold text-[#0E74BC] dark:text-sky-300">More value. Less stress. Better compliance outcomes.</span>
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 px-4 py-6 dark:border-slate-800 dark:bg-slate-950 sm:px-6 lg:px-7 lg:py-7 xl:border-l xl:border-t-0">
                <div className="max-w-[420px]">
                  <h3 className="pr-10 text-[1.55rem] font-extrabold leading-tight tracking-[-0.03em] text-slate-950 dark:text-white sm:text-[1.75rem]">
                    Request Your Free Sample Pack
                  </h3>
                  <p className="mt-2 text-[0.92rem] leading-6 text-slate-500 dark:text-slate-300">
                    Fill in your details and we&apos;ll send your sample pack straight to your inbox.
                  </p>
                </div>

                <form className="mt-6 space-y-3.5" onSubmit={handleSubmit}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <input
                        className={inputClassName}
                        value={formData.firstName}
                        onChange={(event) => updateField("firstName", event.target.value)}
                        placeholder="First Name *"
                      />
                      {errors.firstName ? <p className={errorClassName}>{errors.firstName}</p> : null}
                    </div>
                    <div>
                      <input
                        className={inputClassName}
                        value={formData.lastName}
                        onChange={(event) => updateField("lastName", event.target.value)}
                        placeholder="Last Name *"
                      />
                      {errors.lastName ? <p className={errorClassName}>{errors.lastName}</p> : null}
                    </div>
                  </div>

                  <div>
                    <input
                      className={inputClassName}
                      value={formData.companyName}
                      onChange={(event) => updateField("companyName", event.target.value)}
                      placeholder="Company *"
                    />
                    {errors.companyName ? <p className={errorClassName}>{errors.companyName}</p> : null}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <input
                        className={inputClassName}
                        value={formData.jobRole}
                        onChange={(event) => updateField("jobRole", event.target.value)}
                        placeholder="Job Role *"
                      />
                      {errors.jobRole ? <p className={errorClassName}>{errors.jobRole}</p> : null}
                    </div>
                    <div>
                      <input
                        type="tel"
                        className={inputClassName}
                        value={formData.phone}
                        onChange={(event) => updateField("phone", event.target.value)}
                        placeholder="Phone *"
                      />
                      {errors.phone ? <p className={errorClassName}>{errors.phone}</p> : null}
                    </div>
                  </div>

                  <div>
                    <input
                      type="email"
                      className={inputClassName}
                      value={formData.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="Email Address *"
                    />
                    {errors.email ? <p className={errorClassName}>{errors.email}</p> : null}
                  </div>

                  <div>
                    <div className="relative" ref={sampleDropdownRef}>
                      <button
                        type="button"
                        className={`${inputClassName} flex items-center justify-between text-left ${formData.sampleId ? "text-slate-800 dark:text-slate-100" : "text-slate-400 dark:text-slate-400"}`}
                        onClick={() => setIsSampleDropdownOpen((current) => !current)}
                        aria-haspopup="listbox"
                        aria-expanded={isSampleDropdownOpen}
                      >
                        <span>{formData.sampleId || "Select Sample *"}</span>
                        <KeyboardArrowDownRoundedIcon className={`transition ${isSampleDropdownOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isSampleDropdownOpen ? (
                        <div className="absolute left-0 right-0 z-20 mt-1 overflow-hidden rounded-[14px] border border-[#B8D7F1] bg-white shadow-xl dark:border-slate-600 dark:bg-slate-900">
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
                                    className="w-full px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-blue-50 dark:text-slate-200 dark:hover:bg-slate-800"
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
                                <li className="px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400">
                                  Loading samples...
                                </li>
                              ) : null}
                              {!isSampleOptionsLoading && sampleOptions.length === 0 ? (
                                <li className="px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400">
                                  No samples available.
                                </li>
                              ) : null}
                              {hasMoreSampleOptions ? (
                                <li className="px-2 py-2">
                                  <button
                                    type="button"
                                    className="w-full rounded-md px-3 py-2 text-left text-xs font-semibold text-[#0E74BC] transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-slate-400 dark:text-sky-300 dark:hover:bg-slate-800 dark:disabled:text-slate-500"
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
                      ) : null}
                    </div>
                    {errors.sampleId ? <p className={errorClassName}>{errors.sampleId}</p> : null}
                  </div>

                  <div>
                    <textarea
                      className={textareaClassName}
                      value={formData.comments}
                      onChange={(event) => updateField("comments", event.target.value)}
                      placeholder="Comments"
                    />
                  </div>

                  <label className="flex items-start gap-3 text-[0.9rem] leading-6 text-slate-500 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={formData.marketingConsent}
                      onChange={(event) => updateField("marketingConsent", event.target.checked)}
                      className="mt-1 h-5 w-5 rounded border border-[#7EB5E2] text-[#0E74BC] focus:ring-[#0E74BC] dark:border-slate-500 dark:bg-slate-900 dark:text-sky-400 dark:focus:ring-sky-400"
                    />
                    <span>Yes, I&apos;d like to receive updates, special offers and other information from RTO Specialists.</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-[50px] w-full items-center justify-center rounded-full bg-[#0E74BC] px-6 text-[15px] font-bold text-white transition hover:bg-[#0b5f98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E74BC] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-500 dark:hover:bg-sky-400 dark:focus-visible:outline-sky-400"
                  >
                    {isSubmitting ? "Sending..." : "Send Me My Free Sample Pack"}
                  </button>

                  <div className="flex items-start gap-3 rounded-[12px] bg-[#EEF5FB] px-4 py-3 text-[0.88rem] leading-6 text-[#1F568A] dark:bg-slate-900 dark:text-slate-300">
                    <span className="mt-0.5 text-[#0E74BC] dark:text-sky-300">
                      <LockOutlinedIcon />
                    </span>
                    <p>We respect your privacy. Your information is safe with us and will never be shared.</p>
                  </div>
                </form>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
