"use client";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import pdHeroImage from "@/assets/pdImg.svg";
import EnquireNowCard from "@/components/common/EnquireNowCard";
import TrainingModal from "@/components/courses/TrainingModal";
import type { Course } from "@/components/courses/Course";
import URLUtils from "@/scripts/UrlUtils";
import { getPdevCartCount, getRemainingPdevCredits } from "@/scripts/pdevCredits";
import { useAccountsStore } from "@/state/useAccountsStore";
import { useCartStore } from "@/state/useCartStore";
import { useGuestCartStore } from "@/state/useGuestCartStore";
import { useCourseFileIdStore } from "@/state/useCourseFileIdStore";
import { useCourseTrainingFileStore } from "@/state/useCourseTrainingFileStore";
import { useGlobalToastStore } from "@/state/useGlobalToastStore";
import { useModalStore } from "@/state/useModalStore";
import { usePageLoaderStore } from "@/state/usePageLoaderStore";

const formatPrice = (value?: number | string) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : 55;
};

const toPdfBlob = (file: Blob) => {
  if (file.type === "application/pdf") {
    return file;
  }

  return new Blob([file], { type: "application/pdf" });
};

const buildList = (items?: string[]) => (Array.isArray(items) ? items.filter(Boolean) : []);

const DetailList = ({ items }: { items: string[] }) => (
  <ul className="mt-4 space-y-3">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-slate-700">
        <CheckCircleRoundedIcon className="mt-0.5 !text-[18px] !text-[#4bbf63]" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const pushPdevEvent = (eventName: "view_item" | "add_to_cart", course: Course) => {
  if (typeof window === "undefined") {
    return;
  }

  const analyticsWindow = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
  };

  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.dataLayer.push({
    event: eventName,
    ecommerce: {
      items: [
        {
          item_id: course.fileId || course._id,
          item_name: course.name,
          item_category: course.parent?._id || "parent",
          item_type: "pdev_courses",
          price: formatPrice(course.salePrice),
        },
      ],
    },
  });
};

export default function TrainingDetailPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = typeof params?.courseId === "string" ? params.courseId : "";
  const router = useRouter();
  const customer = useAccountsStore((state) => state.customer);
  const setCustomer = useAccountsStore((state) => state.setCustomer);
  const setLoading = usePageLoaderStore((state) => state.setLoading);
  const setToastState = useGlobalToastStore((state) => state.setToastState);
  const setGeneralSuccessModal = useModalStore((state) => state.setGeneralSuccessModal);
  const cartItems = useCartStore((state) => state.items);
  const addToCartStore = useCartStore((state) => state.addToCart);
  const guestCartProducts = useGuestCartStore((state) => state.products);
  const addGuestProduct = useGuestCartStore((state) => state.addProduct);
  const setFileId = useCourseFileIdStore((state) => state.setFileId);
  const setTrainingFileBlob = useCourseTrainingFileStore((state) => state.setTrainingFileBlob);
  const [course, setCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [trainingFile, setTrainingFile] = useState("");
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const usedPdevCreditsInCart = useMemo(
    () => getPdevCartCount(cartItems, guestCartProducts),
    [cartItems, guestCartProducts]
  );
  const remainingPdevCredits = useMemo(
    () => getRemainingPdevCredits(customer.certCredits, usedPdevCreditsInCart),
    [customer.certCredits, usedPdevCreditsInCart]
  );
  const showFreePdevPricing = customer.accountType === "GENERAL" && remainingPdevCredits > 0;
  useEffect(() => {
    const getCourses = async () => {
      if (!courseId) {
        setCourse(null);
        setIsLoadingCourse(false);
        return;
      }

      try {
        setIsLoadingCourse(true);
        setLoading(true);
        const res = await URLUtils.get("General-GetAllCoursesNames", { page: 1, limit: 500 });

        if (res.status === 200 && Array.isArray(res.data.courses)) {
          const allCourses = res.data.courses as Course[];
          setCourses(allCourses);

          const matchedCourse = allCourses.find(
            (item) => item._id === courseId || item.fileId === decodeURIComponent(courseId)
          );

          if (matchedCourse) {
            setCourse(matchedCourse);
          } else {
            setCourse(null);
            setToastState({ html: "Course not found.", show: true });
          }
          return;
        }

        setCourses([]);
        setCourse(null);
        setToastState({ html: "Course Not Available!", show: true });
      } catch (err: unknown) {
        const error = err as { message?: string };
        setCourses([]);
        setCourse(null);
        setToastState({ html: error.message || "some error occured!", show: true });
      } finally {
        setIsLoadingCourse(false);
        setLoading(false);
      }
    };

    void getCourses();
  }, [courseId, setLoading, setToastState]);

  useEffect(() => {
    return () => {
      if (trainingFile) {
        URL.revokeObjectURL(trainingFile);
      }
    };
  }, [trainingFile]);

  const relatedCourses = useMemo(() => {
    if (!course) {
      return [];
    }

    return courses
      .filter((item) => item._id !== course._id && item.parent?._id === course.parent?._id)
      .slice(0, 5);
  }, [course, courses]);

  const isInCart = course
    ? cartItems.some((item) => item.id === course._id) || guestCartProducts.some((item) => item.productId === course._id)
    : false;

  useEffect(() => {
    if (!course) {
      return;
    }

    pushPdevEvent("view_item", course);
  }, [course]);

  const handleAddToCart = async () => {
    if (!course?._id) {
      return;
    }

    pushPdevEvent("add_to_cart", course);

    if (!customer.isAuthenticated) {
      addGuestProduct({
        productId: course._id,
        salePrice: formatPrice(course.salePrice),
        price: formatPrice(course.salePrice),
        name: course.name,
        productCode: course.fileId || course._id,
        type: "pdev_product",
      });
      setToastState({ html: "Product added successfully", show: true });
      return;
    }

    setLoading(true);
    try {
      const res = await URLUtils.post("Cart-AddProduct", { pid: course._id, type: "pdev_product" });
      if (res.status === 200) {
        addToCartStore({ id: course._id, type: "pdev_product" });
        setToastState({ html: "Product added successfully", show: true });
      }
    } catch (e: unknown) {
      const err = e as { response?: { data?: { err?: string } } };
      setToastState({ html: err.response?.data?.err || "some error occured!", show: true });
    } finally {
      setLoading(false);
    }
  };

  const getTrainingFile = async (selectedFileId: string, openModal = true) => {
    try {
      setLoading(true);
      const res = await URLUtils.post(
        "General-GetTrainingFile",
        { file: selectedFileId, accountType: customer.accountType },
        { responseType: "blob" }
      );

      if (res.status === 200) {
        const normalizedPdfBlob = toPdfBlob(res.data as Blob);
        const dec = res.headers["credit-dec"];
        if (dec === "true") {
          setCustomer((prevCustomer) => ({
            ...prevCustomer,
            certCredits: Math.max((Number(prevCustomer.certCredits) || 0) - 1, 0),
          }));
        }

        if (trainingFile) {
          URL.revokeObjectURL(trainingFile);
        }

        setTrainingFileBlob(normalizedPdfBlob);

        if (openModal) {
          const pdfUrl = URL.createObjectURL(normalizedPdfBlob);
          setTrainingFile(pdfUrl);
          setShowTrainingModal(true);
        }
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: Blob | { err?: string } } };

      if (err.response?.data instanceof Blob && customer.accountType === "GENERAL") {
        setGeneralSuccessModal({
          show: true,
          heading: "Insufficient credits!",
          content:
            "You don't have enough credits to start training. You can either buy credits and start training using your general account or buy membership to add professional development users.",
          link: "/professional-development-plans#certification",
          tag: "Buy more",
          type: 0,
        });
      } else {
        const blobError = err.response?.data as { err?: string } | undefined;
        setToastState({ html: blobError?.err || "Some error occurred!", show: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStartTraining = async () => {
    if (!course) {
      return;
    }

    if (!customer.isAuthenticated) {
      router.replace("/user/login");
      setToastState({ html: "Please login first to start training!", show: true });
      return;
    }

    if (customer.accountType !== "PDEV_USER" && customer.accountType !== "GENERAL") {
      setToastState({
        html: "Only General users and Professional Development users can start training!",
        show: true,
      });
      return;
    }

    setFileId(course.fileId);
    await getTrainingFile(course.fileId);
  };

  const handleStartQuiz = async () => {
    if (!course) {
      return;
    }

    setFileId(course.fileId);
    await getTrainingFile(course.fileId, false);
    const params = new URLSearchParams();
    if (course.name?.trim()) {
      params.set("title", course.name.trim());
    }
    router.push(params.size > 0 ? `/training-quiz?${params.toString()}` : "/training-quiz");
  };

  if (isLoadingCourse) {
    return (
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 px-6 py-14 text-center">
          <h1 className="text-2xl font-semibold text-slate-950">Loading course...</h1>
        </div>
      </section>
    );
  }

  if (!course) {
    return (
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-dashed border-slate-300 px-6 py-14 text-center">
          <h1 className="text-2xl font-semibold text-slate-950">Course not found</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            We could not load the requested professional development resource.
          </p>
          <Link
            href="/training"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#0E74BC] px-6 text-sm font-semibold text-white transition hover:bg-[#0b5f98]"
          >
            Back to training
          </Link>
        </div>
      </section>
    );
  }

  const focusAreas = buildList(course.features);
  const participants = buildList(course.courseFor);
  const objectives = buildList(course.objectives);
  const sessionIncludes = buildList(course.includes);

  return (
    <>
      <section className="bg-white px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <Link href="/training" className="text-sm font-medium text-[#0E74BC] transition hover:text-[#0b5f98]">
              Back to training
            </Link>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_420px]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{course.fileId}</p>
              <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-[3.15rem]">
                {course.name}
              </h1>
              {course.description ? (
                <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-600 sm:text-base">
                  {course.description}
                </p>
              ) : null}

              <div className="mt-12 space-y-10">
                {focusAreas.length > 0 ? (
                  <section>
                    <h2 className="text-2xl font-semibold tracking-tight text-red-600">Core Focus Areas</h2>
                    <DetailList items={focusAreas} />
                  </section>
                ) : null}

                {participants.length > 0 ? (
                  <section>
                    <h2 className="text-2xl font-semibold tracking-tight text-red-600">Who Should Participate</h2>
                    <p className="mt-4 text-sm font-medium text-slate-700">This session is tailored for:</p>
                    <DetailList items={participants} />
                  </section>
                ) : null}

                {objectives.length > 0 ? (
                  <section>
                    <h2 className="text-2xl font-semibold tracking-tight text-red-600">Learning Objectives</h2>
                    <p className="mt-4 text-sm font-medium text-slate-700">Participants will:</p>
                    <DetailList items={objectives} />
                  </section>
                ) : null}

                {sessionIncludes.length > 0 ? (
                  <section>
                    <h2 className="text-2xl font-semibold tracking-tight text-red-600">This Session Includes</h2>
                    <DetailList items={sessionIncludes} />
                  </section>
                ) : null}
              </div>
            </div>

            <aside>
              <div className="space-y-5 lg:sticky lg:top-28">
                <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                  <div className="relative aspect-[16/10] overflow-hidden bg-black">
                    <Image
                      src={course.iconUrl || pdHeroImage}
                      alt={course.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1280px) 420px, (min-width: 1024px) 360px, 100vw"
                    />
                  </div>
                </div>

                <div className="px-1 py-1">
                  <p className="text-[13px] font-semibold leading-5 text-slate-900">{course.name}</p>
                  <div className="mt-2 flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <StarRoundedIcon key={`${course._id}-star-${index}`} className="!text-[18px]" />
                    ))}
                    <span className="ml-2 text-xs font-medium text-slate-500">(32 reviews)</span>
                  </div>

                  <div className="mt-4 flex items-end gap-2">
                    {showFreePdevPricing ? (
                      <>
                        <p className="text-3xl font-semibold leading-none text-slate-500 line-through">${formatPrice(course.salePrice)}</p>
                        <span className="pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-600">Free with PD credits</span>
                      </>
                    ) : (
                      <>
                        <p className="text-3xl font-semibold leading-none text-slate-950">${formatPrice(course.salePrice)}</p>
                        <p className="pb-1 text-sm text-slate-400 line-through">$78</p>
                        <span className="pb-1 text-[11px] font-semibold text-emerald-500">save $23</span>
                      </>
                    )}
                  </div>

                  {course.purchased ? (
                    <div className="mt-5 space-y-3">
                      <button
                        type="button"
                        onClick={() => void handleStartQuiz()}
                        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#1D2955] px-5 text-sm font-semibold text-white transition hover:bg-[#162045]"
                      >
                        <QuizOutlinedIcon className="mr-2 !text-[18px]" />
                        Start Quiz
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleStartTraining()}
                        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#1D2955] px-5 text-sm font-semibold text-[#1D2955] transition hover:bg-slate-50"
                      >
                        <MenuBookOutlinedIcon className="!text-[18px]" />
                        Start Training
                      </button>
                    </div>
                  ) : isInCart ? (
                    <Link
                      href="/accounts/cart"
                      className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                      <ShoppingCartOutlinedIcon className="!text-[18px]" />
                      Go to Cart
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void handleAddToCart()}
                      className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0E74BC] px-5 text-sm font-semibold text-white transition hover:bg-[#0b5f98]"
                    >
                      <ShoppingCartOutlinedIcon className="!text-[18px]" />
                      Add to Cart
                    </button>
                  )}
                </div>

                <EnquireNowCard
                  className="mx-auto w-full max-w-[420px] lg:ml-auto lg:mr-0 lg:max-w-[420px]"
                  variant="compact"
                  defaultResource={course.fileId || ""}
                  contextLabel={`${course.fileId} - ${course.name}`}
                />
              </div>
            </aside>
          </div>

          {relatedCourses.length > 0 ? (
            <section className="mt-16">
              <h2 className="text-center text-3xl font-semibold tracking-tight text-slate-950">
                You <span className="text-red-600">might</span> also need
              </h2>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {relatedCourses.map((item) => (
                  <article
                    key={item._id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
                  >
                    <Link href={`/training/${item._id}`} className="block">
                      <div className="relative aspect-[16/9.2] overflow-hidden bg-black">
                        <Image
                          src={item.iconUrl || pdHeroImage}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1280px) 20vw, (min-width: 640px) 50vw, 100vw"
                        />
                      </div>
                    </Link>

                    <div className="p-3.5">
                      <Link href={`/training/${item._id}`} className="block">
                        <h3 className="line-clamp-3 min-h-[4.2rem] text-sm font-medium leading-6 text-slate-950 sm:text-base">
                          {item.name}
                        </h3>
                      </Link>

                      <div className="mt-3 flex items-end justify-between gap-2">
                        <div className="flex items-end gap-2">
                          <p className="text-xl font-semibold leading-none text-slate-950">${formatPrice(item.salePrice)}</p>
                          <p className="pb-0.5 text-xs text-slate-400 line-through">$78</p>
                        </div>

                        <Link
                          href={`/training/${item._id}`}
                          className="inline-flex min-h-9 items-center justify-center rounded-full bg-[#0E74BC] px-4 text-xs font-semibold text-white transition hover:bg-[#0b5f98] sm:text-sm"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>

      <TrainingModal
        isModalOpen={showTrainingModal}
        setShowModal={setShowTrainingModal}
        file={trainingFile}
        courseTitle={course?.name}
      />
    </>
  );
}
