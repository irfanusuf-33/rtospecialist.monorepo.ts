"use client";

import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import Link from "next/link";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import StarIcon from '@mui/icons-material/Star';
import Image from "next/image";
import { useState } from "react";
import { useProductStore } from "../../state/useProductStore";
import trainingResourcesImage from "../../assets/trainingresources.svg";
import unitDetailsImage from "../../assets/unitdetails.svg";

interface Product {
  _id: string;
  imageUrl?: string;
  productId: string;
  name: string;
  description: string;
  salePrice: number | string;
  price: number | string;
  preOrder?: boolean;
  inCart?: boolean;
  link?: string;
}

interface QualificationCard {
  _id: string;
  name: string;
  url?: string;
  categoryId?: string;
  categoryName?: string;
}

interface ProductTileProps {
  addToCart?: (product: Product) => void;
  addQualificationToCart?: (qualificationId: string) => Promise<void>;
  product?: Product;
  qualification?: QualificationCard;
  basket?: string[];
  groupName?: string;
  variant?: "core" | "elective" | "qualification";
}

const variantStyles = {
  core: {
    accent: "text-red-600 dark:text-red-400",
    button: "bg-red-500 hover:bg-red-600 focus-visible:outline-red-600",
    member: "text-red-500 dark:text-red-400",
    border: "hover:border-red-200 dark:hover:border-red-800",
    tag: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300",
  },
  elective: {
    accent: "text-blue-600 dark:text-sky-300",
    button: "bg-[#0E74BC] hover:bg-[#0b5f98] focus-visible:outline-blue-600",
    member: "text-[#0E74BC] dark:text-sky-300",
    border: "hover:border-blue-200 dark:hover:border-sky-800",
    tag: "bg-blue-50 text-blue-600 dark:bg-sky-950 dark:text-sky-300",
  },
  qualification: {
    accent: "text-[#39B349] dark:text-emerald-400",
    button: "bg-[#39B349] hover:bg-[#2f973d] focus-visible:outline-emerald-600",
    member: "text-[#39B349] dark:text-emerald-400",
    border: "hover:border-emerald-200 dark:hover:border-emerald-800",
    tag: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
} as const;

export default function ProductTile ({ addToCart, addQualificationToCart, product, qualification, basket = [], groupName, variant = "elective" }: ProductTileProps) {
  const setProduct = useProductStore((state) => state.setProduct);
  const [qualificationAdding, setQualificationAdding] = useState(false);
  const [qualificationAdded, setQualificationAdded] = useState(false);
  const isQualificationCard = Boolean(qualification);
  const isInCart = product ? product.inCart || basket.includes(product._id) : false;
  const styles = variantStyles[variant];

  if (isQualificationCard && qualification) {
    const qualificationHref = `/ecommerce-categories/subcategory/${qualification._id}?name=${encodeURIComponent(qualification.name)}&categoryId=${encodeURIComponent(qualification.categoryId || "")}&categoryName=${encodeURIComponent(qualification.categoryName || "")}`;
    const handleQualificationAdd = async () => {
      if (!addQualificationToCart) {
        return;
      }

      setQualificationAdding(true);
      try {
        await addQualificationToCart(qualification._id);
        setQualificationAdded(true);
      } finally {
        setQualificationAdding(false);
      }
    };

    return (
      <article className={`group flex min-h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-950/5 transition hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20 ${styles.border}`}>
        <Link
          href={qualificationHref}
          className="relative block min-h-36 overflow-hidden bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          aria-label={`View details for ${qualification.name}`}
        >
        <Image
          loading="lazy"
          src={unitDetailsImage}
          width={586}
          height={196}
          alt={qualification.name}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute left-3 top-3 rounded-md bg-white px-2.5 py-1 text-[10px] font-medium text-[#0E74BC] shadow-sm">
          Learning & Assessment Kit
        </div>

          <div className="absolute left-3 bottom-3 rounded-md bg-white px-2.5 py-1 text-[10px] font-medium text-[#0E74BC] shadow-sm">
            Qualification
          </div>
        </Link>

        <div className="flex flex-1 flex-col p-4">
          <Link
            href={qualificationHref}
            className="block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex min-h-6 items-center rounded-full px-2.5 text-[10px] font-semibold ${styles.tag}`}>
                Qualification
              </span>
            </div>

            <h3 className="mt-4 line-clamp-3 min-h-[4.75rem] text-base font-medium leading-6 text-slate-950 dark:text-white">
              {qualification.name}
            </h3>
          </Link>

          <div className="mt-5 flex items-end justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.08em] ${styles.accent}`}>
                Qualifications
              </p>
            </div>
            {qualificationAdded ? (
              <Link href="/accounts/cart" className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-white transition ${styles.button}`}>
                <CheckCircleOutlineIcon className="!text-[18px]" />
                Cart
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => void handleQualificationAdd()}
                disabled={qualificationAdding}
                className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${styles.button}`}
              >
                <AddShoppingCartOutlinedIcon className="!text-[18px]" />
                {qualificationAdding ? "Adding..." : "Add"}
              </button>
            )}
          </div>
        </div>
      </article>
    );
  }

  if (!product || !addToCart) {
    return null;
  }

  const salePrice = product.salePrice || product.price;
  const originalPrice = product.price || product.salePrice;
  const memberPrice = Math.round(Number(salePrice) * 0.85);
  const productHref = `/product/${product._id}`;
  const numericPrice = Number(salePrice) || 0;

  const handleAddToCartClick = () => {
    if (typeof window !== "undefined") {
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
              item_category: groupName || variant,
              item_type: "trainingProduct",
              price: numericPrice,
            },
          ],
        },
      });
    }

    addToCart(product);
  };

  return (
    <article className={`group flex min-h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-950/5 transition hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20 ${styles.border}`}>
      <Link
        href={productHref}
        onClick={() => setProduct(product)}
        className="relative block min-h-36 overflow-hidden bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        aria-label={`View details for ${product.name}`}
      >
        <Image
          loading="lazy"
          src={product.imageUrl || trainingResourcesImage}
          width={586}
          height={196}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute left-3 top-3 rounded-md bg-white px-2.5 py-1 text-[10px] font-medium text-[#0E74BC] shadow-sm">
          Learning & Assessment Kit
        </div>

        <div className="absolute left-3 bottom-3 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-[#0E74BC] shadow-sm">
          {product.productId}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link
          href={productHref}
          onClick={() => setProduct(product)}
          className="block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex min-h-6 items-center rounded-full px-2.5 text-[10px] font-semibold ${
              product.preOrder
                ? "bg-blue-50 text-blue-700 dark:bg-sky-950 dark:text-sky-300"
                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
            }`}>
              {product.preOrder ? "Pre-Order" : "Ready"}
            </span>
            <span className="inline-flex min-h-6 items-center gap-1 rounded-full bg-amber-50 px-2.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              <StarIcon className="!text-sm" />
              Enterprise Member
            </span>
          </div>

          <h3 className="mt-4 line-clamp-3 min-h-[4.75rem] text-base font-medium leading-6 text-slate-950 dark:text-white">
            {product.name}
          </h3>
        </Link>

        <div className="mt-5 flex items-end justify-between gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-semibold leading-none text-slate-950 dark:text-white">
                ${salePrice}
              </p>
              <p className="text-sm font-medium text-slate-400 line-through dark:text-slate-500">
                ${originalPrice}
              </p>
            </div>
            <p className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${styles.member}`}>
              <StarIcon className="!text-sm" />
              Members: ${memberPrice}
            </p>
          </div>

          {isInCart ? (
            <Link href="/accounts/cart" className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-white transition ${styles.button}`}>
              <CheckCircleOutlineIcon className="!text-[18px]" />
              Cart
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAddToCartClick}
              className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-white transition ${styles.button}`}
            >
              <AddShoppingCartOutlinedIcon className="!text-[18px]" />
              Add
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
