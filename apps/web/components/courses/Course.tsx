"use client";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import bundleTwelveImage from "../../assets/12certificationbundleimg.svg";
import bundleSevenImage from "../../assets/7certificationbundleimg.svg";
import pdHeroImage from "../../assets/pdImg.svg";
import URLUtils from "../../scripts/UrlUtils";
import { getPdevCartCount, getRemainingPdevCredits } from "../../scripts/pdevCredits";
import { useAccountsStore } from "../../state/useAccountsStore";
import { useCartStore } from "../../state/useCartStore";
import { useGlobalToastStore } from "../../state/useGlobalToastStore";
import { useGuestCartStore } from "../../state/useGuestCartStore";
import { usePageLoaderStore } from "../../state/usePageLoaderStore";
import { usePaymentStore } from "../../state/usePaymentStore";
import CoursePagination from "./CoursePagination";
import PaymentModalSingleCertification from "../professionaldev/pdevmodal/PaymentModalSingleCertfication";

type BundleCard = {
  id: string;
  name: string;
  image: StaticImageData;
  currentPrice: number;
  oldPrice: number;
  highlights: string[];
  href: string;
  paymentPid: "STARTER" | "PREMIUM";
  creditsToAdd: number;
};

export interface Course {
  _id: string;
  id?: string;
  iconUrl?: string;
  name: string;
  fileId: string;
  purchased?: boolean;
  salePrice?: number | string;
  description?: string;
  features?: string[];
  courseFor?: string[];
  objectives?: string[];
  includes?: string[];
  parent?: {
    _id: string;
  };
}

interface CourseProps {
  selectedCategory: string | null;
  isSidebarCollapsed?: boolean;
}

const featuredBundles: BundleCard[] = [
  {
    id: "7-certification-bundle",
    name: "7 PD Bundle",
    image: bundleSevenImage,
    currentPrice: 299,
    oldPrice: 427,
    highlights: ["Includes 7 PD credits.", "Choose from all our PD certification."],
    href: "/professional-development-plans#certification",
    paymentPid: "STARTER",
    creditsToAdd: 7,
  },
  {
    id: "12-certification-bundle",
    name: "12 PD Bundle",
    image: bundleTwelveImage,
    currentPrice: 549,
    oldPrice: 784,
    highlights: ["Includes 12 PD credits.", "Choose from all our PD certification."],
    href: "/professional-development-plans#certification",
    paymentPid: "PREMIUM",
    creditsToAdd: 12,
  },
];

const formatPrice = (value?: number | string) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : 55;
};

const pushPdevAddToCartEvent = (course: Course) => {
  if (typeof window === "undefined") {
    return;
  }

  const analyticsWindow = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
  };

  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.dataLayer.push({
    event: "add_to_cart",
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

const Course = ({ selectedCategory, isSidebarCollapsed = false }: CourseProps) => {
  const router = useRouter();
  const customer = useAccountsStore((state) => state.customer);
  const cartItems = useCartStore((state) => state.items);
  const addToCartStore = useCartStore((state) => state.addToCart);
  const guestCartProducts = useGuestCartStore((state) => state.products);
  const addGuestProduct = useGuestCartStore((state) => state.addProduct);
  const setToastState = useGlobalToastStore((state) => state.setToastState);
  const setLoading = usePageLoaderStore((state) => state.setLoading);
  const setSingleCertPaymentConfig = usePaymentStore((state) => state.setSingleCertPaymentConfig);
  const [courses, setCourses] = useState<Course[]>([]);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [bundleModalOpen, setBundleModalOpen] = useState(false);

  const basketIds = useMemo(
    () =>
      Array.from(
        new Set([
          ...cartItems.map((item) => item.id),
          ...guestCartProducts.map((item) => item.productId),
        ])
      ),
    [cartItems, guestCartProducts]
  );
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
      try {
        setLoading(true);
        const res = await URLUtils.get("General-GetAllCoursesNames", { page: activePage, limit: 12 });
        if (res.status === 200 && Array.isArray(res.data.courses)) {
          setCourses(res.data.courses);
          setTotalPages(res.data.totalPages || 0);
        } else {
          setCourses([]);
          setToastState({ html: "Course Not Available!", show: true });
        }
      } catch (err: unknown) {
        const error = err as { message?: string };
        setCourses([]);
        setToastState({ html: error.message || "some error occured!", show: true });
      } finally {
        setLoading(false);
      }
    };

    void getCourses();
  }, [activePage, setLoading, setToastState]);

  const filteredCourses = (courses || []).filter((course) =>
    selectedCategory ? course.parent?._id === selectedCategory : true
  );

  const handleAddToCart = async (course: Course) => {
    if (!course._id) {
      return;
    }

    pushPdevAddToCartEvent(course);

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

  const handleBundlePurchase = (bundle: BundleCard) => {
    if (!customer.isAuthenticated) {
      router.push("/user/login");
      return;
    }

    setSingleCertPaymentConfig({
      type: "Payment-PdevBundleAddon",
      payload: { pid: bundle.paymentPid },
      meta: {
        creditsToAdd: bundle.creditsToAdd,
        priceLabel: `A$${bundle.currentPrice.toFixed(2)}`,
        productLabel: bundle.name,
        successHeading: `${bundle.name} purchased!`,
        successContent: `You can now choose up to ${bundle.creditsToAdd} professional development programs from the library.`,
        successLink: "/training",
        successTag: "go to program",
      },
    });
    setBundleModalOpen(true);
  };

  return (
    <section className="bg-white px-4 py-6 text-slate-950 sm:px-6 lg:px-8 lg:py-8">
      <div className={isSidebarCollapsed ? "max-w-none" : "mx-auto max-w-7xl"}>
        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-semibold tracking-tight text-red-600 sm:text-2xl">Featured Bundles</h2>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {featuredBundles.map((bundle) => (
                <article
                  key={bundle.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
                >
                  <div className="relative aspect-[16/7] overflow-hidden bg-black">
                    <Image
                      src={bundle.image}
                      alt={bundle.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                  </div>

                  <div className="p-4 sm:p-5">
                    <h3 className="text-lg font-semibold text-slate-950">{bundle.name}</h3>

                    <div className="mt-3 space-y-2.5">
                      {bundle.highlights.map((item) => (
                        <div key={`${bundle.id}-${item}`} className="flex items-start gap-2.5 text-xs leading-6 text-slate-700 sm:text-sm">
                          <CheckCircleRoundedIcon className="!text-[18px] !text-[#4bbf63]" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
                      <div className="flex items-end gap-2">
                        <p className="text-2xl font-semibold leading-none text-slate-950">AU${bundle.currentPrice}</p>
                        <p className="pb-0.5 text-xs text-slate-400 line-through sm:text-sm">AU${bundle.oldPrice}</p>
                      </div>

                      <button
                        type="button"
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-red-600 px-4 text-xs font-semibold text-white transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:px-5 sm:text-sm"
                        onClick={() => handleBundlePurchase(bundle)}
                      >
                        <ShoppingCartOutlinedIcon className="!text-[16px] sm:!text-[18px]" />
                        Buy
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold tracking-tight text-[#0E74BC] sm:text-2xl">All PD Resources</h2>
            </div>

            {filteredCourses.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center text-base text-slate-500">
                Courses Not Available.
              </div>
            ) : (
              <div
                className={`mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 ${
                  isSidebarCollapsed ? "xl:grid-cols-5" : "xl:grid-cols-4"
                }`}
              >
                {filteredCourses.map((course, index) => {
                  const inCart = basketIds.includes(course._id);

                  return (
                    <article
                      key={course._id || course.id || index}
                      className="cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(15,23,42,0.14)] focus-within:ring-2 focus-within:ring-[#0E74BC]/30"
                      onClick={() => router.push(`/training/${course._id}`)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          router.push(`/training/${course._id}`);
                        }
                      }}
                      role="link"
                      tabIndex={0}
                      aria-label={`View details for ${course.name}`}
                    >
                      <div className="relative aspect-[16/9.2] overflow-hidden bg-black">
                        {course.purchased ? (
                          <span className="absolute right-3 top-3 z-10 inline-flex rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm">
                            Purchased
                          </span>
                        ) : null}
                        <Image
                          src={course.iconUrl || pdHeroImage}
                          alt={course.name}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                        />
                      </div>

                      <div className="flex min-h-[142px] flex-col justify-between p-3.5">
                        <h3 className="line-clamp-3 min-h-[4.2rem] text-sm font-medium leading-6 text-slate-950 sm:text-base">
                          {course.name}
                        </h3>

                        <div className="mt-3 flex items-end justify-between gap-2">
                          <div className="flex items-end gap-2">
                            {showFreePdevPricing ? (
                              <>
                                <p className="text-xl font-semibold leading-none text-slate-500 line-through sm:text-2xl">
                                  ${formatPrice(course.salePrice)}
                                </p>
                                <p className="pb-0.5 text-xs font-semibold uppercase tracking-[0.12em] text-red-600">Free</p>
                              </>
                            ) : (
                              <>
                                <p className="text-xl font-semibold leading-none text-slate-950 sm:text-2xl">
                                  ${formatPrice(course.salePrice)}
                                </p>
                                <p className="pb-0.5 text-xs text-slate-400 line-through">$78</p>
                              </>
                            )}
                          </div>

                          {inCart ? (
                            <Link
                              href="/accounts/cart"
                              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full bg-slate-900 px-4 text-xs font-semibold text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 sm:text-sm"
                            >
                              Cart
                            </Link>
                          ) : (
                            <button
                              type="button"
                              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full bg-[#0E74BC] px-4 text-xs font-semibold text-white transition hover:bg-[#0b5f98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E74BC] sm:text-sm"
                              onClick={(event) => {
                                event.stopPropagation();
                                void handleAddToCart(course);
                              }}
                            >
                              <ShoppingCartOutlinedIcon className="!text-[16px]" />
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {totalPages > 1 ? (
              <div className="course-pagination mt-10">
                <CoursePagination setActivePage={setActivePage} totalPages={totalPages} />
              </div>
            ) : null}
          </section>
        </div>
      </div>
      <PaymentModalSingleCertification
        open1={bundleModalOpen}
        handleOpen1={() => setBundleModalOpen((curr) => !curr)}
      />
    </section>
  );
};

export default Course;
