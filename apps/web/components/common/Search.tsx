"use client";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CardMembershipRoundedIcon from "@mui/icons-material/CardMembershipRounded";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useRef, useState } from "react";
import URLUtils from "../../scripts/UrlUtils";
import { useProductStore } from "@/state/useProductStore";
import { useAllProductsStore, type StoredProduct } from "@/state/useAllProductsStore";
import Image from "next/image";
import Link from "next/link";

const membershipData = [
  { name: "Genral Membreship", link: "/membership-plans" },
  { name: "Professional development membership", link: "/professional-development-plans" },
  { name: "Employer Membership", link: "/employer-hiring" },
];

const proDevData = [
  { name: "Professional development membership", link: "/professional-development-plans" },
];

const employerData = [
  { name: "Employer Membership", link: "/employer-hiring" },
];

interface WebLinkType {
  name: string;
  link: string;
}

interface SearchProduct extends StoredProduct {
  _id: string;
  imageUrl?: string;
  productId?: string;
  name: string;
  link?: string;
  url?: string;
  type?: string;
  categoryId?: string;
  categoryName?: string;
  category?: Array<{ _id?: string; name?: string }> | string[];
  subLinks?: unknown[];
  coreUnits?: unknown[];
  electiveUnits?: unknown[];
  totalProducts?: number;
  totalCartAmount?: string;
}

export default function Search() {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [webLink, setWebLink] = useState<WebLinkType[]>([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const setProduct = useProductStore((state) => state.setProduct);
  const setAllProductsForContext = useAllProductsStore((state) => state.setContextProducts);

  useEffect(() => {
    if (searchText.length === 0) {
      setProducts([]);
      setWebLink([]);
      return;
    }

    const delayed = setTimeout(async () => {
      try {
        setLoading(true);

        if (searchText.startsWith("memb") || searchText.startsWith("mem")) {
          setWebLink(membershipData);
          setProducts([]);
        } else if (
          searchText.startsWith("pro") ||
          searchText.startsWith("deve") ||
          searchText.startsWith("trai")
        ) {
          setWebLink(proDevData);
          setProducts([]);
        } else if (
          searchText.startsWith("staff") ||
          searchText.startsWith("job") ||
          searchText.startsWith("emp")
        ) {
          setWebLink(employerData);
          setProducts([]);
        } else {
          setWebLink([]);

          const res = await URLUtils.post("Search-GetProduct", {
            query: searchText,
          });

          if (res.status === 200) {
            setProducts(res.data);
            setAllProductsForContext(
              `search:${searchText.trim().toLowerCase()}`,
              (Array.isArray(res.data) ? res.data : []).filter(
                (item): item is SearchProduct & { productId: string } => Boolean(item?._id && item?.productId),
              ),
            );
          }
        }
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayed);
  }, [searchText, setAllProductsForContext]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  const closeSearch = () => {
    setOpen(false);
    setSearchText("");
    setProducts([]);
    setWebLink([]);
  };

  const handlePdp = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const pid = e.currentTarget.dataset.pid;
    const data = products.find((product) => product._id === pid);

    if (data?.productId) {
      setProduct({
        ...data,
        productId: data.productId,
        imageUrl: "",
        description: "",
        salePrice: 0,
        price: 0,
      });
    }

    closeSearch();
  };

  const getCategoryMeta = (product: SearchProduct) => {
    if (product.categoryId || product.categoryName) {
      return {
        id: product.categoryId || "",
        name: product.categoryName || "",
      };
    }

    const firstCategory = Array.isArray(product.category) ? product.category[0] : null;

    if (firstCategory && typeof firstCategory !== "string") {
      return {
        id: firstCategory._id || "",
        name: firstCategory.name || "",
      };
    }

    return { id: "", name: "" };
  };

  const getResultHref = (product: SearchProduct) => {
    const resultType = product.type?.toLowerCase() || "";

    if (product.productId) {
      return `/product/${product._id}`;
    }

    if (resultType.includes("category") || product.subLinks) {
      return `/ecommerce-categories/${product._id}?name=${encodeURIComponent(product.name)}`;
    }

    if (
      resultType.includes("qualification") ||
      resultType.includes("subcategory") ||
      product.coreUnits ||
      product.electiveUnits ||
      product.totalProducts ||
      product.totalCartAmount ||
      product.url
    ) {
      const category = getCategoryMeta(product);
      const params = new URLSearchParams({
        name: product.name,
      });

      if (category.id) {
        params.set("categoryId", category.id);
      }

      if (category.name) {
        params.set("categoryName", category.name);
      }

      return `/ecommerce-categories/subcategory/${product._id}?${params.toString()}`;
    }

    return `/ecommerce-categories/${product._id}?name=${encodeURIComponent(product.name)}`;
  };

  const hasQuery = searchText.trim().length > 0;
  const hasResults = webLink.length > 0 || products.length > 0;

  return (
    <div ref={searchRef} className="relative hidden w-80 max-w-full cursor-pointer lg:block">
      <input
        type="search"
        placeholder="Search for Resources"
        className="block w-full min-h-[46px] rounded-[999px] border border-[rgba(30,136,229,0.35)] bg-[#f1f5f9] pl-[18px] pr-10 text-xs text-[#374151] shadow-[0_0_0_1px_rgba(30,136,229,0.08)] outline-none transition-[outline] duration-300 placeholder:text-xs focus:outline-2 focus:outline-black"
        value={searchText}
        onChange={(event) => {
          setSearchText(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        aria-label="Search for resources"
        aria-controls="navbar-search-results"
      />

      {searchText ? (
        <button
          type="button"
          onClick={closeSearch}
          className="absolute right-11 top-1/2 z-10 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label="Clear search"
        >
          <CloseIcon className="!text-[20px]" />
        </button>
      ) : null}

      {loading ? (
        <div className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin rounded-full border-2 border-slate-200 border-t-[#0E74BC]" />
      ) : (
        <SearchOutlinedIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E88E5]" />
      )}

      {open && hasQuery ? (
        <div
          id="navbar-search-results"
          className="absolute left-0 top-[calc(100%+10px)] z-50 max-h-[70vh] w-full min-w-[min(720px,calc(100vw-2rem))] overflow-y-auto rounded-b-2xl border border-slate-200 bg-white py-3 shadow-2xl shadow-slate-950/15 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/40"
        >
          {webLink.map((link, index) => (
            <Link
              href={link.link}
              onClick={closeSearch}
              className="flex items-center gap-4 px-5 py-3 text-slate-950 transition hover:bg-slate-50 dark:text-white dark:hover:bg-slate-900"
              key={index}
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-blue-50 text-[#0E74BC] dark:bg-sky-950 dark:text-sky-300">
                <CardMembershipRoundedIcon />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-medium uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
                  Membership we offer
                </span>
                <span className="mt-1 block truncate text-base font-medium">
                  {link.name}
                </span>
              </span>
            </Link>
          ))}

          {products.map((product, index) => (
            <Link
              href={getResultHref(product)}
              onClick={handlePdp}
              data-pid={product._id}
              className="flex items-center gap-4 px-5 py-3 text-slate-950 transition hover:bg-slate-50 dark:text-white dark:hover:bg-slate-900"
              key={index}
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-100 text-[#0E74BC] dark:bg-slate-900 dark:text-sky-300">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <DescriptionOutlinedIcon />
                )}
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-medium uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
                  {product.productId || (product.subLinks ? "Category" : "Qualification")}
                </span>
                <span className="mt-1 block truncate text-base font-medium">
                  {product.name}
                </span>
              </span>
            </Link>
          ))}

          {!loading && !hasResults ? (
            <div className="px-5 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              No results found.
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
