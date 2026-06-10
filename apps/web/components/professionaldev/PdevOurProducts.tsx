"use client";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import bundleTwelveImage from "../../assets/12certificationbundleimg.svg";
import bundleSevenImage from "../../assets/7certificationbundleimg.svg";
import URLUtils from "../../scripts/UrlUtils";
import { getPdevCartCount, getRemainingPdevCredits } from "../../scripts/pdevCredits";
import { useAccountsStore } from "../../state/useAccountsStore";
import { useCartStore } from "../../state/useCartStore";
import { useGlobalToastStore } from "../../state/useGlobalToastStore";
import { useGuestCartStore } from "../../state/useGuestCartStore";
import { usePageLoaderStore } from "../../state/usePageLoaderStore";
import { usePaymentStore } from "../../state/usePaymentStore";
import PaymentModalSingleCertification from "./pdevmodal/PaymentModalSingleCertfication";

interface Course {
  _id: string;
  fileId?: string;
  iconUrl?: string;
  name: string;
  purchased?: boolean;
  salePrice?: number | string;
  parent?: string | null;
}

type DisplayProduct =
  | (Course & { kind: "course" })
  | {
    kind: "bundle";
    _id: string;
    name: string;
    salePrice: number;
    iconUrl: typeof bundleSevenImage;
    href: string;
    paymentPid: "STARTER" | "PREMIUM";
    creditsToAdd: number;
  };

const featuredBundles: DisplayProduct[] = [
  {
    kind: "bundle",
    _id: "7-certification-bundle",
    name: "7 PD Bundle",
    salePrice: 299,
    iconUrl: bundleSevenImage,
    href: "/professional-development-plans#certification",
    paymentPid: "STARTER",
    creditsToAdd: 7,
  },
  {
    kind: "bundle",
    _id: "12-certification-bundle",
    name: "12 PD Bundle",
    salePrice: 549,
    iconUrl: bundleTwelveImage,
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
          item_category: course.parent || "parent",
          item_type: "pdev_courses",
          price: formatPrice(course.salePrice),
        },
      ],
    },
  });
};

export default function Products() {
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
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [bundleModalOpen, setBundleModalOpen] = useState(false);
  const courseImageMapRef = useRef<Record<string, string>>({});
  const basketIds = useMemo(
    () => Array.from(new Set([...cartItems.map((item) => item.id), ...guestCartProducts.map((item) => item.productId)])),
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
  const displayProducts = useMemo<DisplayProduct[]>(
    () => [
      ...(debouncedSearchTerm ? [] : featuredBundles),
      ...courses.slice(0, 6).map((course) => ({ ...course, kind: "course" as const })),
    ],
    [courses, debouncedSearchTerm]
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    const trimmedSearch = debouncedSearchTerm;

    const getCourses = async () => {
      try {
        setLoading(true);
        if (trimmedSearch) {
          const res = await URLUtils.get("Search-GetPdevProduct", { query: trimmedSearch });
          if (res.status === 200) {
            const searchedProducts = Array.isArray(res.data?.products) ? res.data.products : [];
            setCourses(
              searchedProducts.map((course: Course) => ({
                ...course,
                iconUrl: course.iconUrl,
              }))
            );
          }
          return;
        }

        const res = await URLUtils.get("General-GetAllCoursesName", { limit: 8 });
        if (res.status === 200 && Array.isArray(res.data.courses)) {
          setCourses(res.data.courses);
          courseImageMapRef.current = {
            ...courseImageMapRef.current,
            ...Object.fromEntries(
              res.data.courses
                .filter((course: Course) => course._id && course.iconUrl)
                .map((course: Course) => [course._id, course.iconUrl as string])
            ),
          };
        }
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    void getCourses();
  }, [debouncedSearchTerm, setLoading]);

  const handleAddToCart = async (course: Course) => {
    if (!course._id) {
      return;
    }

    pushPdevAddToCartEvent(course);

    if (!customer.isAuthenticated) {
      addGuestProduct({
        productId: course._id,
        salePrice: Number(course.salePrice) || 55,
        price: Number(course.salePrice) || 55,
        name: course.name,
        productCode: course._id,
        type: "pdev_product"
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

  const handleBundlePurchase = (bundle: Extract<DisplayProduct, { kind: "bundle" }>) => {
    if (!customer.isAuthenticated) {
      router.push("/user/login");
      return;
    }

    setSingleCertPaymentConfig({
      type: "Payment-PdevBundleAddon",
      payload: { pid: bundle.paymentPid },
      meta: {
        creditsToAdd: bundle.creditsToAdd,
        priceLabel: `A$${bundle.salePrice.toFixed(2)}`,
        productLabel: bundle.name,
        successHeading: `${bundle.name} purchased!`,
        successContent: `You can now choose up to ${bundle.creditsToAdd} professional development programs from the library.`,
        successLink: "/training",
        successTag: "go to program",
      },
    });
    setBundleModalOpen(true);
  };

  const handleProductNavigation = (product: DisplayProduct) => {
    if (product.kind === "bundle") {
      router.push(product.href);
      return;
    }

    router.push(`/training/${product._id}`);
  };

  return (
    <section className="bg-white px-4 py-14 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            <span className="lg:whitespace-nowrap">
              Explore the <span className="text-red-600 dark:text-red-400">Professional</span> Development{" "}
              <span className="text-emerald-500 dark:text-emerald-400">Library</span>
            </span>
          </h2>

          <div className="mt-6">
            <label htmlFor="pdev-course-search" className="sr-only">
              Search courses
            </label>
            <div className="relative mx-auto max-w-3xl">
              <input
                id="pdev-course-search"
                type="text"
                placeholder="Search Courses"
                className="min-h-12 w-full rounded-full border border-slate-200 bg-white px-5 pr-14 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-red-500/20"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <span className="pointer-events-none absolute inset-y-0 right-5 inline-flex items-center text-slate-500 dark:text-slate-400">
                <SearchOutlinedIcon className="!text-[20px]" />
              </span>
            </div>
          </div>
        </div>

        {displayProducts.length > 0 ? (
          <>
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {displayProducts.map((product, index) => (
                (() => {
                  const inCart = product.kind === "course" ? basketIds.includes(product._id) : false;
                  const productHref = product.kind === "bundle" ? product.href : `/training/${product._id}`;

                  return (
                    <article
                      key={product._id || index}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.14)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_10px_30px_rgba(0,0,0,0.28)]"
                      role="link"
                      tabIndex={0}
                      onClick={() => handleProductNavigation(product)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handleProductNavigation(product);
                        }
                      }}
                    >
                      <Link href={productHref} className="block" onClick={(event) => event.stopPropagation()}>
                        <div className="relative aspect-[16/10] overflow-hidden bg-white">
                          {product.kind === "course" && product.purchased ? (
                            <span className="absolute right-3 top-3 z-10 inline-flex rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm">
                              Purchased
                            </span>
                          ) : null}
                          <Image
                            src={product.iconUrl}
                            alt={product.name}
                            fill
                            className={product.kind === "bundle"
                              ? "object-contain p-3 transition duration-500 hover:scale-[1.02]"
                              : "object-cover transition duration-500 hover:scale-105"}
                            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                          />
                        </div>
                      </Link>

                      <div className="flex min-h-[134px] flex-col justify-between p-4">
                        <Link href={productHref} className="block" onClick={(event) => event.stopPropagation()}>
                          <h3 className="line-clamp-2 min-h-[3.5rem] text-base font-semibold leading-7 text-slate-950 dark:text-white">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="flex flex-col items-start">
                            {showFreePdevPricing && product.kind === "course" ? (
                              <>
                                <p className="text-lg font-semibold text-emerald-600 line-through opacity-70 dark:text-emerald-400">
                                  AU$ {formatPrice(product.salePrice)}
                                </p>
                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-red-600 dark:text-red-400">
                                  Free with PD credits
                                </p>
                              </>
                            ) : (
                              <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                                AU$ {formatPrice(product.salePrice)}
                              </p>
                            )}
                          </div>

                          {product.kind === "bundle" ? (
                            <button
                              type="button"
                              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:bg-red-500 dark:hover:bg-red-400"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleBundlePurchase(product);
                              }}
                            >
                              <ShoppingCartOutlinedIcon className="!text-[18px]" />
                              Buy
                            </button>
                          ) : inCart ? (
                            <Link
                              href="/accounts/cart"
                              onClick={(event) => event.stopPropagation()}
                              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-300"
                            >
                              Cart
                            </Link>
                          ) : (
                            <button
                              type="button"
                              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:bg-red-500 dark:hover:bg-red-400"
                              onClick={(event) => {
                                event.stopPropagation();
                                void handleAddToCart(product);
                              }}
                            >
                              <ShoppingCartOutlinedIcon className="!text-[18px]" />
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })()
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <Link
                href="/training"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-red-600 px-8 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600 dark:bg-red-500 dark:hover:bg-red-400 sm:px-12"
              >
                Browse the PD Library
              </Link>
            </div>
          </>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center text-base text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No courses available right now.
          </div>
        )}
      </div>
      <PaymentModalSingleCertification
        open1={bundleModalOpen}
        handleOpen1={() => setBundleModalOpen((current) => !current)}
      />
    </section>
  );
}
