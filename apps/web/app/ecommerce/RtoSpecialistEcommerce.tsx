"use client";

// import "../../client/scss/ecommerce/ecommerce.scss";
import EcommerceBody from "../../components/ecommerce/EcommerceBody";
import EcommerceProductTiles from "../../components/ecommerce/EcommerceProductTiles";
import ProductPagnetion from "../../components/ecommerce/ProductPagnetion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import EcommerceDiscountModal from "../../components/ecommerce/EcommerceDiscountModal";
import URLUtils from "../../scripts/UrlUtils";
import { useSearchParams, usePathname } from "next/navigation";
import { useProductPrimaryLinksStore } from "../../state/useProductPrimaryLinksStore";
import { useProductCategoryPageStore } from "../../state/useProductCategoryPageStore";
import { useCartStore } from "../../state/useCartStore";
import { useGlobalToastStore } from "../../state/useGlobalToastStore";
import { MotionItem, MotionStagger } from "../../components/common/animations/MotionReveal";
import { useEcommerceFiltersStore } from "../../state/useEcommerceFiltersStore";
import { useAllProductsStore, type StoredProduct } from "../../state/useAllProductsStore";
import BookFreeSampleModal from "../../components/common/BookFreeSampleModal";

export default function RtoSpecialistEcommerce () {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const productMainLinks = useProductPrimaryLinksStore((state) => state.productPrimaryLinks);
  const setProductMainLinks = useProductPrimaryLinksStore((state) => state.setProductPrimaryLinks);
  const setCategoryPageProducts = useProductCategoryPageStore((state) => state.setProductCategoryPage);
  const setCategorySubcategories = useProductCategoryPageStore((state) => state.setCategorySubcategories);
  const setCategorySelected = useProductCategoryPageStore((state) => state.setCategorySelected);
  const setProductUUIDS = useProductCategoryPageStore((state) => state.setProductUUIDS);
  const activePage = useProductCategoryPageStore((state) => state.activePage);
  const totalPages = useProductCategoryPageStore((state) => state.totalPages);
  const setActivePage = useProductCategoryPageStore((state) => state.setActivePage);
  const setTotalPages = useProductCategoryPageStore((state) => state.setTotalPages);
  const setGroupAllInCart = useCartStore((state) => state.setGroupAllInCart);
  const setToastState = useGlobalToastStore((state) => state.setToastState);
  const selectedPackageIds = useEcommerceFiltersStore((state) => state.selectedPackageIds);
  const availability = useEcommerceFiltersStore((state) => state.availability);
  const setAllProductsForContext = useAllProductsStore((state) => state.setContextProducts);
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryid");
  const subcategoryId = searchParams.get("subcategoryid");
  const categoryName = searchParams.get("categoryname"); 
  const pathname = usePathname();
  const resolvedCategoryId = useMemo(() => {
    if (subcategoryId) {
      return null;
    }

    if (categoryId && productMainLinks.some((link) => link._id === categoryId)) {
      return categoryId;
    }

    if (!categoryName) {
      return categoryId;
    }

    const decodedCategoryName = decodeURIComponent(categoryName).trim().toLowerCase();
    const matchedCategory = productMainLinks.find((link) => link.name.trim().toLowerCase() === decodedCategoryName);

    return matchedCategory?._id || categoryId;
  }, [categoryId, categoryName, productMainLinks, subcategoryId]);
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
      (pagination?.totalItems) ||
      (pagination?.totalCount) ||
      (pagination?.total) ||
      0
    );

    if (totalItems > 0) {
      return { currentPage, totalPages: Math.ceil(totalItems / 20) };
    }

    return { currentPage, totalPages: 1 };
  };

  const normaliseProductGroups = (products: unknown) => {
    if (products && typeof products === "object" && !Array.isArray(products)) {
      return products;
    }

    if (Array.isArray(products)) {
      return { "Training Resources": products };
    }

    return {};
  };

  const flattenProductGroups = (products: unknown): StoredProduct[] => {
    const normalisedGroups = normaliseProductGroups(products);

    return Object.entries(normalisedGroups).flatMap(([groupName, productArray]) => (
      Array.isArray(productArray)
        ? productArray.map((product) => ({
          ...(product as StoredProduct),
          group: typeof (product as StoredProduct).group === "string"
            ? (product as StoredProduct).group
            : groupName,
        }))
        : []
    ));
  };

  const applyProductResponse = (res: { data: { products?: unknown; data?: unknown; subcategories?: unknown[]; euInCart?: boolean; coreInCart?: boolean; cuInCart?: boolean; uuids?: unknown; totalPages?: number; totalPage?: number; pages?: number; totalItems?: number; totalCount?: number; total?: number; count?: number; pagination?: unknown } }) => {
    const rawProducts = res.data.products || res.data.data;
    const pagination = getPaginationFromResponse(res.data as Record<string, unknown>);

    setCategorySelected(true);
    setCategoryPageProducts(normaliseProductGroups(rawProducts));
    setCategorySubcategories(Array.isArray(res.data.subcategories) ? res.data.subcategories : []);
    setGroupAllInCart({
      electiveUnits: Boolean(res.data.euInCart),
      coreUnits: Boolean(res.data.coreInCart ?? res.data.cuInCart),
    });
    setProductUUIDS(res.data.uuids || {});
    setAllProductsForContext(
      `ecommerce:${resolvedCategoryId || subcategoryId || "all"}:page:${pagination.currentPage}`,
      flattenProductGroups(rawProducts),
    );
    setActivePage(pagination.currentPage);
    setTotalPages(pagination.totalPages);
  };

  const fetchProducts = async (page = 1) => {
    try {
      const params: Record<string, string | number> = {
        page,
        limit: 20,
      };
      const routePackageId = resolvedCategoryId || subcategoryId || "";
      const activePackageIds = selectedPackageIds.length > 0
        ? selectedPackageIds
        : routePackageId
          ? [routePackageId]
          : [];

      if (activePackageIds.length > 0) {
        params.categories = activePackageIds.join(",");
      }

      if (availability.length > 0) {
        params.availability = availability.map((item) => item === "pre-order" ? "preorder" : item).join(",");
      }

      const res = await URLUtils.get("Product-ShowAllFromCategoriesAndSubcategories", params);

      if (res.status === 200) {
        applyProductResponse(res);
      }
    } catch (e : unknown) {
      const err = e as { response?: { data?: { e?: string } } };
      setToastState({ html: err.response?.data?.e || 'Failed to load products!', show: true });
    }
  };

  useEffect(() => {
    const unsubscribe = async ()=> {
      try { 
        const res = await URLUtils.get('Category-Show');
        setProductMainLinks(res.data);
      }
      catch {
        return;
      }
    };

    unsubscribe();
  }, []);

  useEffect(() => {
    if (resolvedCategoryId || subcategoryId) {
      void fetchProducts(1);
    }
  }, [resolvedCategoryId, subcategoryId, categoryName]);

// useEffect for /ecommerce in url

  useEffect(() => {
    const noParams = !resolvedCategoryId && !subcategoryId && !categoryName;
    const isEcommercePage = pathname === "/ecommerce";

    if (noParams && isEcommercePage) {
      const fetchDefaultSubcategory = async () => {
        try {
          await fetchProducts(1);
        } catch (e : unknown) {
          const err = e as { response?: { data?: { e?: string } } };
          setToastState({ html: err.response?.data?.e || 'Failed to load sub categories!', show: true });
        }
      };

      fetchDefaultSubcategory();
    }
  }, [resolvedCategoryId, subcategoryId, categoryName, pathname]);  

  return (
    <div className="ecommerce-section">
      <EcommerceDiscountModal />
      <section className="relative left-1/2 isolate w-screen -translate-x-1/2 overflow-hidden bg-white px-3 py-12 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-4 lg:px-8 lg:py-16">
        <div className="absolute right-6 top-5 z-10 hidden grid-cols-5 gap-2 sm:right-8 lg:grid">
          {Array.from({ length: 10 }).map((_, index) => (
            <span key={`ecommerce-hero-top-dot-${index}`} className="h-2.5 w-2.5 rounded-full bg-blue-100 dark:bg-sky-900/80" />
          ))}
        </div>
        <div className="absolute bottom-5 left-6 z-10 hidden grid-cols-5 gap-2 sm:left-8 lg:grid">
          {Array.from({ length: 10 }).map((_, index) => (
            <span key={`ecommerce-hero-bottom-dot-${index}`} className="h-2.5 w-2.5 rounded-full bg-blue-100 dark:bg-sky-900/80" />
          ))}
        </div>

        <MotionStagger className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          <MotionItem>
            <p className="mb-5 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:bg-sky-950 dark:text-sky-300">
              RTO Training Resources
            </p>
          </MotionItem>

          <MotionItem className="w-full">
            <h1 className="text-3xl font-semibold uppercase leading-tight tracking-tight text-slate-950 dark:text-white sm:text-[2.75rem] lg:text-5xl">
              <span className="block">Build clearer, more consistent</span>
              <span className="block text-blue-500 dark:text-sky-300">training delivery</span>
              <span className="block">with structured RTO resources</span>
            </h1>
          </MotionItem>

          <MotionItem className="mt-6 w-full">
            <p className="text-base leading-8 text-slate-700 dark:text-slate-300">
              Explore structured, audit-ready training and assessment resources built to reduce rework, improve consistency, and support stronger evidence across your RTO.
            </p>
          </MotionItem>

          <MotionItem className="mt-8 flex flex-col gap-4 sm:flex-row">
            <BookFreeSampleModal>
              <button
                type="button"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-red-500 px-12 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600 sm:w-auto"
              >
                Free Sample
              </button>
            </BookFreeSampleModal>
          </MotionItem>
        </MotionStagger>
      </section>
      <div
        className={`ecommerce-body flex flex-col gap-y-6 lg:flex-row lg:items-start lg:gap-x-6`}
        id="ecom-product"
      >
        <div
          className={`body-sidebar min-w-0 shrink-0 ${isSidebarCollapsed ? "lg:w-[28px]" : "lg:w-[320px]"}`}
        >
          <EcommerceBody
            selectedCategoryId={resolvedCategoryId}
            selectedSubcategoryId={subcategoryId}
            selectedCategoryName={categoryName}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={() => setIsSidebarCollapsed((current) => !current)}
          />
        </div>
        <div className="ecommerce-body-right min-w-0 flex-1">
          <EcommerceProductTiles isSidebarCollapsed={isSidebarCollapsed} />
          {totalPages >= 1 && (
            <div className="mt-8 flex justify-center">
              <ProductPagnetion active={activePage} pages={totalPages} onPageChange={fetchProducts} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
