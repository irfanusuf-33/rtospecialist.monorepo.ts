"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import URLUtils from "@/scripts/UrlUtils";
import categorydetailsimage from "@/assets/categorydetailsimage.svg";
import { useCartStore } from "@/state/useCartStore";
import { usePageLoaderStore } from "@/state/usePageLoaderStore";
import BookFreeSampleModal from "@/components/common/BookFreeSampleModal";
import { useAllProductsStore, type StoredProduct } from "@/state/useAllProductsStore";

interface CategorySubLink {
  _id: string;
  name: string;
  url?: string;
  disable?: boolean;
  totalPrice?: number | string;
}

interface CategoryDetailsResponse {
  _id?: string;
  name?: string;
  abbreviation?: string;
  headline?: string;
  subheadline?: string;
  iconUrl?: string;
  url?: string;
  disable?: boolean;
  subLinks?: CategorySubLink[];
  products?: CategoryProduct[];
  totalUnits?: number;
  totalPrice?: number;
}

type CategoryRowFilter = "all" | "qualification" | "unit";

interface CategoryProduct {
  _id: string;
  productId: string;
  name: string;
  description?: string;
  link?: string;
  price: number | string;
  salePrice: number | string;
  subcategory?: string[];
  group?: string;
  preOrder?: boolean;
  fileUploaded?: boolean;
}

interface QualificationCoreUnit {
  _id: string;
  productId: string;
  name: string;
  price: number | string;
  salePrice: number | string;
}

type CategoryTableRow =
  | { type: "qualification"; item: CategorySubLink }
  | { type: "unit"; item: CategoryProduct };

const staticFeatures = [
  {
    title: "ASQA & Standards Aligned",
    description: "Built in line with current standards for RTOs, each resource is mapped to unit requirements and structured to support clearer evidence, delivery consistency, and more confident implementation.",
  },
  {
    title: "Instructional Design Quality",
    description: "Developed with structured learner flow, practical sequencing, and clearer facilitation support to improve usability across real delivery environments.",
  },
  {
    title: "Fully Editable & Contextualisable",
    description: "Delivered in editable formats so your team can contextualise content for delivery model, learner cohort, and operational requirements without rebuilding from scratch.",
  },
  {
    title: "Ongoing Support & Updates",
    description: "Stay aligned with evolving standards and industry changes through ongoing updates and structured support that help reduce maintenance pressure over time.",
  },
];

const staticSupportLinks = [
  { title: "Professional development", href: "/professional-development-plans" },
  { title: "RTO Consulting Services", href: "/rto-compliance-consulting" },
  { title: "RTO Registration Support", href: "/rto-registration" },
  { title: "Membership & Ongoing Support", href: "/membership-plans" },
];

const featureIcons = [
  AutoAwesomeOutlinedIcon,
  GppGoodOutlinedIcon,
  DescriptionOutlinedIcon,
  Groups2OutlinedIcon,
];

export default function EcommerceCategoryDetailsPage() {
  const params = useParams<{ categoryId: string }>();
  const categoryId = Array.isArray(params?.categoryId) ? params.categoryId[0] : params?.categoryId || "";
  const [categoryDetails, setCategoryDetails] = useState<CategoryDetailsResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<CategoryRowFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [addingQualificationIds, setAddingQualificationIds] = useState<string[]>([]);
  const cartItems = useCartStore((state) => state.items);
  const addToCartStore = useCartStore((state) => state.addToCart);
  const setLoading = usePageLoaderStore((state) => state.setLoading);
  const setAllProductsForContext = useAllProductsStore((state) => state.setContextProducts);
  const pageSize = 10;

  const categoryRows: CategoryTableRow[] = [
    ...((categoryDetails?.subLinks || [])
      .filter((subLink) => !subLink.disable)
      .map((subLink) => ({ type: "qualification" as const, item: subLink }))),
    ...((categoryDetails?.products || [])
      .filter((product) => product?._id)
      .map((product) => ({ type: "unit" as const, item: product }))),
  ];

  const filteredRows = categoryRows.filter((row) => {
    if (activeFilter === "all") {
      // Continue to search matching below.
    } else if (row.type !== activeFilter) {
      return false;
    }

    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return true;
    }

    const searchableText = row.type === "qualification"
      ? `${row.item.name || ""} ${row.item.url || ""}`
      : `${row.item.productId || ""} ${row.item.name || ""} ${row.item.description || ""} ${row.item.group || ""} ${row.item.link || ""}`;

    return searchableText.toLowerCase().includes(query);
  });
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const paginatedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const categoryName = categoryDetails?.name?.trim() || "";
  const categoryHeadline = categoryDetails?.headline?.trim() || "";
  const categorySubheadline = categoryDetails?.subheadline?.trim() || "";
  const categoryEyebrow = categoryDetails?.abbreviation?.trim()
    ? `${categoryDetails.abbreviation} Category`
    : "Category Details";
  const qualificationCount = categoryDetails?.subLinks?.filter((subLink) => !subLink.disable).length || 0;
  const unitCount = categoryDetails?.products?.length || 0;

  const pushUnitAddToCartEvent = (product: CategoryProduct) => {
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
            item_id: product.productId || product._id,
            item_name: product.name,
            item_category: categoryName || "unit",
            item_type: "trainingProduct",
            price: Number(product.salePrice || product.price || 0),
          },
        ],
      },
    });
  };

  const addProductToCart = async (product: CategoryProduct) => {
    const productId = product._id;
    setLoading(true);

    try {
      const res = await URLUtils.post("Cart-AddProduct", { pid: productId, type: "trainingProduct" });

      if (res.status === 200) {
        addToCartStore({ id: productId });
      }
    } catch (error) {
      console.error("Cart-AddProduct error:", error);
    } finally {
      setLoading(false);
    }
  };

  const addQualificationToCart = async (qualificationId: string) => {
    setAddingQualificationIds((current) => [...current, qualificationId]);
    setLoading(true);

    try {
      const qualificationRes = await URLUtils.get(`SubCategory-GetSingle/${qualificationId}`);
      const qualificationProducts = Array.isArray(qualificationRes.data?.coreUnits)
        ? qualificationRes.data.coreUnits as QualificationCoreUnit[]
        : [];

      for (const qualificationProduct of qualificationProducts) {
        await URLUtils.post("Cart-AddProduct", { pid: qualificationProduct._id, type: "trainingProduct" });
        addToCartStore({ id: qualificationProduct._id });
      }
    } catch (error) {
      console.error("Add qualification to cart error:", error);
    } finally {
      setAddingQualificationIds((current) => current.filter((id) => id !== qualificationId));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!categoryId) {
      return;
    }

    const fetchCategoryDetails = async () => {
      try {
        const res = await URLUtils.get(`Category-GetSingle/${categoryId}`);
        console.log("Category-GetSingle response:", res.data);
        const nextDetails = res.data as CategoryDetailsResponse;
        setCategoryDetails(nextDetails);
        setAllProductsForContext(
          `category:${categoryId}`,
          ((nextDetails.products || []) as StoredProduct[]).map((product) => ({
            ...product,
            categoryId,
            categoryName: nextDetails.name,
          })),
        );
      } catch (error) {
        console.error("Category-GetSingle error:", error);
      }
    };

    void fetchCategoryDetails();
  }, [categoryId, setAllProductsForContext]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter]);

  return (
    <main className="bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="px-3 py-8 sm:px-4 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/ecommerce-categories"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-800 dark:text-sky-300 dark:hover:text-sky-200"
          >
            <ArrowForwardRoundedIcon className="!text-base rotate-180" />
            Back to categories
          </Link>
        </div>
        <div className="mt-5 w-full">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-3 py-4 sm:px-4 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-14 lg:px-0 lg:py-6">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                {categoryEyebrow}
              </p>

              <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-[3.35rem]">
                <span className="text-slate-950 dark:text-white">{categoryName || "Category"}</span>{" "}
                <span className="text-red-500 dark:text-red-400">{categoryHeadline || "Training Resources"}</span>
              </h1>

              <p className="mt-4 max-w-3xl text-lg font-semibold leading-tight text-slate-950 dark:text-white sm:text-xl lg:text-2xl">
                {categorySubheadline || "Structured training resources built for real delivery environments"}
              </p>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-[15px]">
                Adaptable resources designed to support consistent delivery, clear assessment, and practical implementation across {categoryName || "your"} qualifications.
              </p>

              <div className="mt-6">
                <BookFreeSampleModal defaultResource={categoryName}>
                  <button
                    type="button"
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-red-500 px-5 text-sm font-semibold text-white transition hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                  >
                    Book Free Sample
                  </button>
                </BookFreeSampleModal>
              </div>
            </div>

            <div className="relative mx-auto flex w-full max-w-[440px] items-center justify-center">
              <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(239,68,68,0.16)_0%,rgba(59,130,246,0.12)_45%,rgba(255,255,255,0)_75%)] blur-3xl" />
              <Image
                src={categorydetailsimage}
                alt={categoryName || "Category"}
                width={440}
                height={310}
                className="relative h-auto w-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-3 pb-10 sm:px-4 lg:px-8 lg:pb-14">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-blue-100 bg-[#edf5fb] p-4 shadow-[0_20px_60px_rgba(14,116,188,0.08)] dark:border-slate-800 dark:bg-slate-900/80 lg:p-6">
          <div className="relative">
            <SearchOutlinedIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 !text-[20px] !text-blue-500 dark:!text-sky-300" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={categoryName ? `Search ${categoryName} qualifications and units` : "Search category qualifications and units"}
              className="h-12 w-full rounded-full border border-slate-200 bg-white px-5 pr-12 text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {[
              { label: `All (${qualificationCount + unitCount})`, value: "all" as const },
              { label: `Qualifications (${qualificationCount})`, value: "qualification" as const },
              { label: `Units (${unitCount})`, value: "unit" as const },
            ].map((filterOption) => {
              const isActive = activeFilter === filterOption.value;

              return (
                <button
                  key={filterOption.value}
                  type="button"
                  onClick={() => setActiveFilter(filterOption.value)}
                  className={`inline-flex min-h-10 items-center justify-center rounded-full px-4 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#0E74BC] text-white shadow-sm"
                      : "bg-white text-slate-700 hover:bg-blue-50 hover:text-[#0E74BC] dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                  }`}
                >
                  {filterOption.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#0E74BC] text-white dark:bg-sky-900">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="px-4 py-3 font-semibold">Price</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                    <th className="px-4 py-3 font-semibold">Bulk Enquire</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.length > 0 ? (
                    paginatedRows.map((row, index) => {
                      const isQualification = row.type === "qualification";
                      const rowKey = isQualification
                        ? row.item._id || `${row.item.name}-${index}`
                        : row.item._id;
                      const href = isQualification
                        ? `/ecommerce-categories/subcategory/${row.item._id}?name=${encodeURIComponent(row.item.name)}&categoryId=${encodeURIComponent(categoryId)}&categoryName=${encodeURIComponent(categoryName)}`
                        : `/product/${row.item._id}`;
                      const unitInCart = !isQualification && cartItems.some((item) => item.id === row.item._id);
                      const qualificationUnitIds = isQualification
                        ? (categoryDetails?.products || [])
                          .filter((product) => product.subcategory?.includes(row.item._id))
                          .map((product) => product._id)
                        : [];
                      const qualificationInCart = qualificationUnitIds.length > 0 && qualificationUnitIds.every((unitId) => cartItems.some((item) => item.id === unitId));
                      const qualificationAdding = isQualification && addingQualificationIds.includes(row.item._id);

                      return (
                        <tr
                          key={rowKey}
                          className={index % 2 === 0 ? "bg-[#f7fbff] dark:bg-slate-900/70" : "bg-white dark:bg-slate-950"}
                        >
                          <td className="min-w-[360px] px-4 py-3 font-medium">
                            <Link
                              href={href}
                              className="font-semibold text-[#0E74BC] transition hover:text-blue-700 hover:underline dark:text-sky-300 dark:hover:text-sky-200"
                            >
                              {row.item.name}
                            </Link>
                            {!isQualification ? (
                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {row.item.productId} {row.item.group ? `- ${row.item.group}` : ""}
                              </p>
                            ) : null}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              isQualification
                                ? "bg-blue-50 text-[#0E74BC] dark:bg-sky-950 dark:text-sky-300"
                                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                            }`}>
                              {isQualification ? "Qualification" : "Unit"}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                            {isQualification ? (
                              <span>${row.item.totalPrice || 0}</span>
                            ) : (
                              <span>
                                ${row.item.salePrice}
                                <span className="ml-2 text-xs font-medium text-slate-400 line-through">${row.item.price}</span>
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            {isQualification ? (
                              qualificationInCart ? (
                                <Link
                                  href="/accounts/cart"
                                  className="inline-flex min-h-9 items-center gap-1 rounded-full bg-blue-50 px-4 text-sm font-semibold text-blue-700 dark:bg-sky-950 dark:text-sky-300"
                                >
                                  <CheckCircleOutlineIcon className="!text-base" />
                                  Go to Cart
                                </Link>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => void addQualificationToCart(row.item._id)}
                                  disabled={qualificationAdding}
                                  className="inline-flex min-h-9 items-center gap-1 rounded-full bg-[#0E74BC] px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  <AddShoppingCartOutlinedIcon className="!text-base" />
                                  {qualificationAdding ? "Adding..." : "Add to Cart"}
                                </button>
                              )
                            ) : unitInCart ? (
                              <Link
                                href="/accounts/cart"
                                className="inline-flex min-h-9 items-center gap-1 rounded-full bg-blue-50 px-4 text-sm font-semibold text-blue-700 dark:bg-sky-950 dark:text-sky-300"
                              >
                                <CheckCircleOutlineIcon className="!text-base" />
                                Go to Cart
                              </Link>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  pushUnitAddToCartEvent(row.item);
                                  void addProductToCart(row.item);
                                }}
                                className="inline-flex min-h-9 items-center gap-1 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-red-500 dark:bg-white dark:text-slate-950"
                              >
                                <AddShoppingCartOutlinedIcon className="!text-base" />
                                Add to Cart
                              </button>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <button
                              type="button"
                              className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#4da3f7] bg-white px-4 text-sm font-semibold text-[#0E74BC] transition hover:bg-blue-50 dark:border-sky-700 dark:bg-slate-950 dark:text-sky-300 dark:hover:bg-slate-900"
                            >
                              Request a Sample
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">
                        No qualifications or units match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredRows.length > pageSize ? (
              <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-[#f7fbff] px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-[#0E74BC] disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-950"
                  aria-label="Previous page"
                >
                  {"<"}
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => {
                  const isActive = currentPage === pageNumber;

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-semibold transition ${
                        isActive
                          ? "bg-[#dbeafe] text-[#0E74BC] dark:bg-sky-950 dark:text-sky-200"
                          : "text-slate-500 hover:bg-white hover:text-[#0E74BC] dark:text-slate-400 dark:hover:bg-slate-950"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-[#0E74BC] disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-950"
                  aria-label="Next page"
                >
                  {">"}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="px-3 py-12 sm:px-4 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-[3.15rem]">
            Built for <span className="text-blue-500 dark:text-sky-300">Clarity</span>,{" "}
            <span className="text-green-500 dark:text-green-300">Consistency</span>, and real{" "}
            <span className="text-red-500 dark:text-red-400">Implementation</span>
          </h2>
          <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
            Our resources are designed with a focus on usability, clarity, and consistency, supporting real delivery environments, not just theoretical compliance. Used by RTOs seeking to reduce internal workload, improve documentation quality, and strengthen their evidence approach.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-4">
          {staticFeatures.map((feature, index) => {
            const FeatureIcon = featureIcons[index % featureIcons.length];

            return (
              <article
                key={feature.title}
                className="rounded-[1.15rem] border border-[#d6ddf6] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_22px_50px_rgba(2,6,23,0.35)]"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${
                    index === 0
                      ? "bg-blue-50 text-blue-600 dark:bg-sky-950 dark:text-sky-300"
                      : index === 1
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : index === 2
                          ? "bg-red-50 text-red-500 dark:bg-red-950/60 dark:text-red-300"
                          : "bg-amber-50 text-amber-500 dark:bg-amber-950/60 dark:text-amber-300"
                  }`}
                >
                  <FeatureIcon className="!text-[24px]" />
                </div>
                <h3 className="mt-6 text-[1.35rem] font-semibold leading-snug text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="mt-4 text-justify text-[15px] leading-8 text-slate-600 dark:text-slate-300">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] px-3 py-12 dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)] sm:px-4 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-[3rem]">
            <span className="text-blue-500 dark:text-sky-300">Looking</span> for more than{" "}
            <span className="text-red-500 dark:text-red-400">Resources?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-4xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
            Training resources are only one part of building a well-structured, compliant RTO. Explore additional support to strengthen your operations, documentation, and audit readiness.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
          {staticSupportLinks.map((link, index) => {
            const SupportIcon = featureIcons[index % featureIcons.length];

            return (
              <Link
                key={link.title}
                href={link.href}
                className="group flex items-center justify-between rounded-[0.9rem] border border-[#e3e8f5] bg-white px-4 py-4 text-left shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-700"
              >
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-500 dark:bg-sky-950 dark:text-sky-300">
                    <SupportIcon className="!text-[22px]" />
                  </span>
                  <span className="text-lg font-medium text-slate-900 dark:text-white">{link.title}</span>
                </div>

                <ArrowForwardRoundedIcon className="!text-[20px] text-blue-500 transition group-hover:translate-x-1 dark:text-sky-300" />
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
