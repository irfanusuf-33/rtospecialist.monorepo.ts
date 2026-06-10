"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import StarIcon from "@mui/icons-material/Star";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import URLUtils from "@/scripts/UrlUtils";
import { useCartStore } from "@/state/useCartStore";
import { usePageLoaderStore } from "@/state/usePageLoaderStore";
import { useAccountsStore } from "@/state/useAccountsStore";
import EnquireNowCard from "@/components/common/EnquireNowCard";
import unitDetailsImage from "@/assets/unitdetails.svg";
import { useAllProductsStore, type StoredProduct } from "@/state/useAllProductsStore";
import { useGuestCartStore } from "@/state/useGuestCartStore";

type QualificationUnit = {
  _id: string;
  productId: string;
  name: string;
  description?: string;
  price: number | string;
  salePrice: number | string;
  group?: string;
  preOrder?: boolean;
  fileUploaded?: boolean;
};

type QualificationDetailsResponse = {
  subcategory?: {
    _id: string;
    name: string;
    url?: string;
    disable?: boolean;
    categoryName?: string;
  };
  coreUnits?: QualificationUnit[];
  electiveUnits?: QualificationUnit[];
  totalProducts?: number;
  totalCoreUnitsAmount?: string;
  orderHistory?: Array<{
    productId: string;
    productCode: string;
    status: string;
    placedAt: string;
  }>;
};

type CategoryQualification = {
  _id: string;
  name: string;
  code?: string;
  categoryId?: string;
  categoryName?: string;
  totalPrice?: number | string;
};

const formatUnitArrays = (coreUnits = [], electiveUnits = []) => {
  // Merge the two arrays into one
  const combined = [...coreUnits, ...electiveUnits];

  // Map to the required object structure
  return combined.map(currentProduct => ({
    productId: currentProduct._id, // Mapping pid to productId
    salePrice: currentProduct.salePrice,
    price: currentProduct.price,
    name: currentProduct.name,
    productCode: currentProduct.productId, // Mapping internal productId to productCode
    type: 'trainingProduct',
  }));
};

const formatPrice = (value: number | string) => Number(value || 0).toFixed(0);

export default function EcommerceSubcategoryDetailsPage() {
  const params = useParams<{ subcategoryId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const subcategoryId = Array.isArray(params?.subcategoryId) ? params.subcategoryId[0] : params?.subcategoryId || "";
  const fallbackSubcategoryName = searchParams.get("name") || "Subcategory";
  const categoryId = searchParams.get("categoryId") || "";
  const fallbackCategoryName = searchParams.get("categoryName") || "Category";
  const [data, setData] = useState<QualificationDetailsResponse | null>(null);
  const [recommendedQualifications, setRecommendedQualifications] = useState<CategoryQualification[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingQualification, setAddingQualification] = useState(false);
  const [addingElectiveId, setAddingElectiveId] = useState<string | null>(null);
  const [removedCoreUnitIds, setRemovedCoreUnitIds] = useState<Set<string>>(new Set());
  const cartItems = useCartStore((state) => state.items);
  const addToCartStore = useCartStore((state) => state.addToCart);
  const setLoadingState = usePageLoaderStore((state) => state.setLoading);
  const setAllProductsForContext = useAllProductsStore((state) => state.setContextProducts);
  const isAuthenticated = useAccountsStore((state) => state.customer.isAuthenticated);
  const addGuestProducts = useGuestCartStore((state) => state.addProducts);

  useEffect(() => {
    if (!subcategoryId) {
      setLoading(false);
      return;
    }

    const fetchSubcategoryDetails = async () => {
      try {
        setLoading(true);
        const res = await URLUtils.get(`SubCategory-GetSingle/${subcategoryId}`);
        const nextData = res.data as QualificationDetailsResponse;
        setData(nextData);
        setAllProductsForContext(
          `subcategory:${subcategoryId}`,
          [
            ...((nextData.coreUnits || []) as StoredProduct[]),
            ...((nextData.electiveUnits || []) as StoredProduct[]),
          ],
        );
      } catch (error) {
        console.error("SubCategory-GetSingle error:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchSubcategoryDetails();
  }, [setAllProductsForContext, subcategoryId]);

  useEffect(() => {
    const fetchRecommendedQualifications = async () => {
      try {
        const res = await URLUtils.get("SubCategory-ShowAllSubCategory", {
          page: 1,
          limit: 8,
        });

        const rawSubcategories = Array.isArray(res.data)
          ? res.data
          : (
            (res.data as Record<string, unknown>)?.subcategories ||
            (res.data as Record<string, unknown>)?.data ||
            (res.data as Record<string, unknown>)?.items ||
            []
          );

        const nextQualifications = Array.isArray(rawSubcategories)
          ? rawSubcategories.reduce<CategoryQualification[]>((items, item) => {
            if (!item || typeof item !== "object") {
              return items;
            }

            const subcategory = item as Record<string, unknown>;
            const id = typeof subcategory._id === "string" ? subcategory._id : "";
            const name = typeof subcategory.name === "string" ? subcategory.name.trim() : "";
            const disabled = Boolean(subcategory.disable);

            if (!id || !name || disabled || id === subcategoryId) {
              return items;
            }

            items.push({
              _id: id,
              name,
              code: typeof subcategory.code === "string" ? subcategory.code : undefined,
              categoryId: typeof subcategory.categoryId === "string" ? subcategory.categoryId : undefined,
              categoryName: typeof subcategory.categoryName === "string" ? subcategory.categoryName : undefined,
              totalPrice: typeof subcategory.totalPrice === "number" || typeof subcategory.totalPrice === "string"
                ? subcategory.totalPrice
                : undefined,
            });

            return items;
          }, []).slice(0, 4)
          : [];

        setRecommendedQualifications(nextQualifications);
      } catch (error) {
        console.error("SubCategory-ShowAllSubCategory error:", error);
        setRecommendedQualifications([]);
      }
    };

    void fetchRecommendedQualifications();
  }, [subcategoryId]);

  const qualificationName = data?.subcategory?.name || fallbackSubcategoryName;
  const categoryName = data?.subcategory?.categoryName || fallbackCategoryName;
  const allCoreUnits = data?.coreUnits || [];
  const coreUnits = allCoreUnits.filter((unit) => !removedCoreUnitIds.has(unit._id));
  const electiveUnits = data?.electiveUnits || [];
  const orderHistory = data?.orderHistory || [];
  const totalProducts = data?.totalProducts || allCoreUnits.length + electiveUnits.length;
  
  const totalCartAmount = useMemo(() => {
    return coreUnits.reduce((sum, unit) => sum + Number(unit.salePrice || unit.price || 0), 0).toFixed(0);
  }, [coreUnits]);
  const memberPrice = (Number(totalCartAmount) * 0.9).toFixed(0);
  const coreInCart = coreUnits.length > 0 && coreUnits.every((unit) => cartItems.some((item) => item.id === unit._id));

  const isPurchased = (productId: string) => {
    return orderHistory.some((order) => order.productId === productId && order.status === "success");
  };

  const toggleRemoveCoreUnit = (unitId: string) => {
    setRemovedCoreUnitIds((prev) => {
      const next = new Set(prev);
      if (next.has(unitId)) {
        next.delete(unitId);
      } else {
        next.add(unitId);
      }
      return next;
    });
  };

  const pushQualificationAddToCartEvent = (units: QualificationUnit[]) => {
    if (typeof window === "undefined" || units.length === 0) {
      return;
    }

    const analyticsWindow = window as Window & {
      dataLayer?: Array<Record<string, unknown>>;
    };

    analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
    analyticsWindow.dataLayer.push({
      event: "add_to_cart",
      ecommerce: {
        items: units.map((unit) => ({
          item_id: unit.productId || unit._id,
          item_name: unit.name,
          item_category: qualificationName || categoryName || "qualification",
          item_type: "trainingProduct",
          price: Number(unit.salePrice || unit.price || 0),
        })),
      },
    });
  };

  const addElectiveToCart = async (unit: QualificationUnit) => {
    setAddingElectiveId(unit._id);
    setLoadingState(true);
    try {
      const res = await URLUtils.post("Cart-AddProduct", { pid: unit._id, type: "trainingProduct" });
      if (res.status === 200) {
        addToCartStore({ id: unit._id });
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { errorCode?: string } } };
      if (err.response?.data?.errorCode === "CUSTOMER_AUTH_ERR") {
        router.push("/user/login");
        return;
      }
      console.error("Cart-AddProduct error:", error);
    } finally {
      setAddingElectiveId(null);
      setLoadingState(false);
    }
  };

  const addQualificationToCart = async () => {
    if (coreUnits.length === 0) {
      return;
    }

    pushQualificationAddToCartEvent([...coreUnits, ...electiveUnits]);
    setAddingQualification(true);
    setLoadingState(true);
    try {
      if (!isAuthenticated) {
        const productsToBeAdded = formatUnitArrays(coreUnits, electiveUnits);
        addGuestProducts(productsToBeAdded);
        return;
      }
      const unitIds = coreUnits.map((unit) => unit._id);
      const res = await URLUtils.post("Cart-AddMultipleProducts", { uuids: unitIds });
      if (res.status === 200) {
        coreUnits.forEach((unit) => {
          addToCartStore({ id: unit._id });
        });
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { errorCode?: string } } };
      if (err.response?.data?.errorCode === "CUSTOMER_AUTH_ERR") {
        router.push("/user/login");
        return;
      }
      console.error("Add qualification to cart error:", error);
    } finally {
      setAddingQualification(false);
      setLoadingState(false);
    }
  };

  return (
    <main className="bg-white px-3 py-8 text-slate-950 sm:px-4 lg:px-5 lg:py-12">
      <div className="mx-auto max-w-[1240px]">
        <Link
          href={`/ecommerce-categories/${categoryId}?name=${encodeURIComponent(categoryName)}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-800"
        >
          <ArrowForwardRoundedIcon className="!text-base rotate-180" />
          Back to {categoryName}
        </Link>

        <div className="mt-6">
          <section className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)] lg:items-start lg:gap-x-10">
            <section>
              <div className="overflow-hidden rounded-[5px] bg-[#123B73]">
                <Image
                  src={unitDetailsImage}
                  alt={qualificationName}
                  width={720}
                  height={420}
                  className="h-auto w-full"
                  priority
                />
              </div>
            </section>

            <aside className="lg:pt-1">
              <div className="flex flex-col">
                <h2 className="max-w-[360px] text-[17px] font-bold leading-[1.35] text-[#151515]">
                  {qualificationName}
                </h2>
                <p className="mt-4 text-[13px] text-[#2d2d2d]">
                  {totalProducts} products inside this qualification package
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-[5px] bg-[#243B7B] text-[10px] font-semibold leading-none text-white">
                    5.0
                  </span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <StarIcon key={index} className="!text-[17px] !text-[#F8B400]" />
                    ))}
                  </div>
                  <span className="text-[12px] text-[#151515]">(32 reviews)</span>
                </div>

                <div className="mt-9 flex items-end gap-3">
                  <p className="text-[32px] font-bold leading-none text-[#151515]">
                    ${formatPrice(totalCartAmount)}
                  </p>
                </div>

                <div className="mt-5 rounded-[5px] border border-[#FDBD3B] bg-[#FFF8E9] px-3 py-3 text-[12px] leading-4 text-[#EF9B00]">
                  Members pay ${memberPrice}. Save an extra 10% on units, qualification and more with membership for better value across your purchases.
                </div>

                {coreInCart ? (
                  <Link
                    href="/accounts/cart"
                    className="mt-5 inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-[#1D2955] px-5 text-[15px] font-semibold text-white transition hover:bg-[#273770]"
                  >
                    <CheckCircleOutlineIcon className="!text-base" />
                    Go to Cart
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => void addQualificationToCart()}
                    disabled={addingQualification || coreUnits.length === 0}
                    className="mt-5 inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-[#1D2955] px-5 text-[15px] font-semibold text-white transition hover:bg-[#273770] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <AddShoppingCartOutlinedIcon className="!text-base" />
                    {addingQualification ? "Adding qualification..." : "Add qualification to Cart"}
                  </button>
                )}

                <Link
                  href={`/ecommerce-categories/${categoryId}?name=${encodeURIComponent(categoryName)}`}
                  className="mt-3 inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full border border-[#1D2955] px-5 text-[15px] font-semibold text-[#1D2955] transition hover:bg-[#eef2ff]"
                >
                  <LaunchRoundedIcon className="!text-base" />
                  Return to Category
                </Link>
              </div>
            </aside>
          </section>

          <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)] lg:items-start lg:gap-x-10">
            <section className="min-w-0 space-y-7">
                <article className="overflow-hidden rounded-[5px] border border-[#d6dbe6] bg-white">
                  <div className="bg-[#ff1616] px-4 py-2 text-[13px] font-bold text-white">
                    Core Units
                  </div>
                  {loading ? (
                    <div className="px-4 py-6 text-sm text-slate-500">Loading core units...</div>
                  ) : allCoreUnits.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left text-[13px]">
                        <thead className="border-b border-[#dfe5ef] bg-white text-[#1f2937]">
                          <tr>
                            <th className="border-r border-[#dfe5ef] px-4 py-3 font-bold">Product ID</th>
                            <th className="border-r border-[#dfe5ef] px-4 py-3 font-bold">Product Name</th>
                            {isAuthenticated && <th className="border-r border-[#dfe5ef] px-4 py-3 font-bold">Status</th>}
                            <th className="px-4 py-3 font-bold">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allCoreUnits.map((unit, index) => {
                            const isRemoved = removedCoreUnitIds.has(unit._id);
                            const purchased = isPurchased(unit._id);
                            return (
                              <tr key={unit._id} className={`${index % 2 === 0 ? "bg-white" : "bg-[#fbfdff]"} ${isRemoved ? 'opacity-60' : ''}`}>
                                <td className="border-r border-[#dfe5ef] px-4 py-3 font-bold">
                                  <Link
                                    href={`/product/${unit._id}`}
                                    className="text-[#0E74BC] transition hover:underline"
                                  >
                                    {unit.productId}
                                  </Link>
                                </td>
                                <td className="border-r border-[#dfe5ef] min-w-[280px] px-4 py-3">
                                  <button
                                    type="button"
                                    onClick={() => router.push(`/product/${unit._id}`)}
                                    className="text-left font-medium leading-5 text-[#202939] transition hover:text-[#0E74BC]"
                                  >
                                    {unit.name}
                                  </button>
                                </td>
                                {isAuthenticated && (
                                <td className="border-r border-[#dfe5ef] whitespace-nowrap px-4 py-3">
                                  {purchased ? (
                                    <span className="inline-flex items-center gap-1 text-[#49b43f] font-semibold">
                                      <CheckCircleOutlineIcon className="!text-sm" /> Purchased
                                    </span>
                                  ) : (
                                    <span className="text-slate-500">Not Purchased</span>
                                  )}
                                </td>
                                )}
                                <td className="whitespace-nowrap px-4 py-3">
                                  <button
                                    type="button"
                                    onClick={() => toggleRemoveCoreUnit(unit._id)}
                                    className={`inline-flex min-h-8 items-center justify-center rounded-full border px-3.5 text-[12px] font-semibold transition ${
                                      isRemoved
                                        ? 'border-[#49b43f] text-[#49b43f] hover:bg-[#eefbea]'
                                        : 'border-[#ff1616] text-[#ff1616] hover:bg-[#fff5f5]'
                                    }`}
                                  >
                                    {isRemoved ? 'Restore' : 'Remove'}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-sm text-slate-500">No core units found for this qualification.</div>
                  )}
                </article>

                <article className="overflow-hidden rounded-[5px] border border-[#d6dbe6] bg-white">
                  <div className="bg-[#0E74BC] px-4 py-2 text-[13px] font-bold text-white">
                    Elective Units
                  </div>
                  {loading ? (
                    <div className="px-4 py-6 text-sm text-slate-500">Loading elective units...</div>
                  ) : electiveUnits.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left text-[13px]">
                        <thead className="border-b border-[#dfe5ef] bg-white text-[#1f2937]">
                          <tr>
                            <th className="border-r border-[#dfe5ef] px-4 py-3 font-bold">Product ID</th>
                            <th className="border-r border-[#dfe5ef] px-4 py-3 font-bold">Product Name</th>
                            <th className="border-r border-[#dfe5ef] px-4 py-3 font-bold">Price</th>
                            {isAuthenticated && <th className="border-r border-[#dfe5ef] px-4 py-3 font-bold">Status</th>}
                            <th className="px-4 py-3 font-bold">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {electiveUnits.map((unit, index) => {
                            const inCart = cartItems.some((item) => item.id === unit._id);
                            const purchased = isPurchased(unit._id);

                            return (
                              <tr key={unit._id} className={index % 2 === 0 ? "bg-white" : "bg-[#fbfdff]"}>
                                <td className="border-r border-[#dfe5ef] px-4 py-3 font-bold">
                                  <Link
                                    href={`/product/${unit._id}`}
                                    className="text-[#0E74BC] transition hover:underline"
                                  >
                                    {unit.productId}
                                  </Link>
                                </td>
                                <td className="border-r border-[#dfe5ef] min-w-[280px] px-4 py-3">
                                  <button
                                    type="button"
                                    onClick={() => router.push(`/product/${unit._id}`)}
                                    className="text-left font-medium leading-5 text-[#202939] transition hover:text-[#0E74BC]"
                                  >
                                    {unit.name}
                                  </button>
                                </td>
                                <td className="border-r border-[#dfe5ef] whitespace-nowrap px-4 py-3">
                                  <span className="font-semibold text-slate-600">${formatPrice(unit.salePrice)}</span>
                                <span className="ml-2 text-sm font-medium text-slate-400 line-through">${formatPrice(unit.price)}</span>
                                </td>
                                {isAuthenticated && (
                                <td className="border-r border-[#dfe5ef] whitespace-nowrap px-4 py-3">
                                  {purchased ? (
                                    <span className="inline-flex items-center gap-1 text-[#49b43f] font-semibold">
                                      <CheckCircleOutlineIcon className="!text-sm" /> Purchased
                                    </span>
                                  ) : (
                                    <span className="text-slate-500">Not Purchased</span>
                                  )}
                                </td>
                                )}
                                <td className="whitespace-nowrap px-4 py-3">
                                  {inCart ? (
                                    <Link
                                      href="/accounts/cart"
                                      className="inline-flex min-h-8 items-center justify-center rounded-full border border-[#49b43f] px-3.5 text-[12px] font-semibold text-[#49b43f]"
                                    >
                                      Go to Cart
                                    </Link>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => void addElectiveToCart(unit)}
                                      disabled={addingElectiveId === unit._id}
                                      className="inline-flex min-h-8 items-center justify-center rounded-full border border-[#49b43f] px-3.5 text-[12px] font-semibold text-[#49b43f] transition hover:bg-[#eefbea] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                      {addingElectiveId === unit._id ? "Adding..." : "Add to Cart"}
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-sm text-slate-500">
                      No elective units are available for this qualification.
                    </div>
                  )}
                </article>
            </section>

            <aside className="lg:-mt-0.5">
                <EnquireNowCard
                  className="mx-auto w-full max-w-[420px] lg:ml-auto lg:mr-0 lg:max-w-none"
                  variant="compact"
                  contextLabel={qualificationName}
                />
            </aside>
          </div>

          {recommendedQualifications.length ? (
            <section className="mt-12">
              <h2 className="text-center text-4xl font-semibold tracking-tight text-slate-900">
                Recommended <span className="text-[#ff2b2b]">qualifications</span>
              </h2>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {recommendedQualifications.map((qualification) => {
                  const recommendedCategoryId = qualification.categoryId || categoryId;
                  const recommendedCategoryName = qualification.categoryName || categoryName;
                  const qualificationHref = `/ecommerce-categories/subcategory/${qualification._id}?name=${encodeURIComponent(qualification.name)}&categoryId=${encodeURIComponent(recommendedCategoryId)}&categoryName=${encodeURIComponent(recommendedCategoryName)}`;

                  return (
                    <article
                      key={qualification._id}
                      className="overflow-hidden rounded-[16px] bg-white shadow-[0_14px_30px_rgba(15,23,42,0.08)]"
                    >
                      <Link href={qualificationHref} className="block">
                        <Image
                          src={unitDetailsImage}
                          alt={qualification.name}
                          width={420}
                          height={230}
                          className="h-auto w-full"
                        />
                      </Link>
                      <div className="p-4">
                        <Link href={qualificationHref} className="block">
                          <h3 className="min-h-[72px] text-base font-semibold leading-6 text-slate-900">
                            {qualification.name}
                          </h3>
                        </Link>
                        <Link
                          href={qualificationHref}
                          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#1D2955] px-4 text-sm font-semibold text-white transition hover:bg-[#273770]"
                        >
                          See details
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </main>
  );
}
