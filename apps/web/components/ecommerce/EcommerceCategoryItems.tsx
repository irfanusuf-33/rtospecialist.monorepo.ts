"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";

export interface CategoryListItem {
  _id: string;
  name: string;
  icon?: StaticImageData | string;
  description?: string;
  subheadline?: string;
  subLinks?: string[];
}

interface EcommerceCategoryItemsProps {
  data: CategoryListItem[];
}

export default function EcommerceCategoryItems({ data }: EcommerceCategoryItemsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return [];
    }

    return data.filter((category) => {
      const inName = category.name.toLowerCase().includes(term);
      const inDescription = category.description?.toLowerCase().includes(term);
      const inSubheadline = category.subheadline?.toLowerCase().includes(term);
      const inSubLinks = category.subLinks?.some((subLink) => subLink.toLowerCase().includes(term));

      return inName || inDescription || inSubheadline || inSubLinks;
    });
  }, [data, searchTerm]);

  return (
    <section className="bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_55%,#eef7ff_100%)] px-3 py-10 text-slate-950 dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_60%,#082f49_100%)] dark:text-white sm:px-4 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex rounded-full border border-blue-200 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 shadow-sm dark:border-sky-800 dark:bg-slate-950/80 dark:text-sky-300">
            Resource Categories
          </p>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
            Browse training resource categories
          </h1>
        </div>

        <div className="mx-auto mt-8 max-w-2xl">
          <div className="relative">
            <SearchOutlinedIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 !text-[22px] !text-blue-500 dark:!text-sky-300" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search category, package, or resource type"
              className="h-13 w-full rounded-full border border-blue-200 bg-white pl-12 pr-5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-sky-400 dark:focus:ring-sky-950"
            />

            {searchTerm.trim() && filteredCategories.length > 0 && (
              <div className="absolute left-0 top-16 z-20 w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.14)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_28px_70px_rgba(2,6,23,0.65)]">
                {filteredCategories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/ecommerce-categories/${category._id}?name=${encodeURIComponent(category.name)}`}
                    className="block border-b border-slate-100 px-5 py-4 text-left transition last:border-b-0 hover:bg-blue-50 dark:border-slate-800 dark:hover:bg-sky-950/50"
                  >
                    <p className="text-sm font-semibold text-slate-950 dark:text-white">{category.name}</p>
                    {category.subheadline ? (
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{category.subheadline}</p>
                    ) : null}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((category) => (
            <Link
              key={category._id}
              href={`/ecommerce-categories/${category._id}?name=${encodeURIComponent(category.name)}`}
              className="group relative overflow-hidden rounded-[2rem] border border-blue-100 bg-white/95 p-5 shadow-[0_18px_50px_rgba(14,116,188,0.10)] transition duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-[0_24px_60px_rgba(14,116,188,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 dark:border-slate-800 dark:bg-slate-950/90 dark:shadow-[0_22px_54px_rgba(2,6,23,0.45)] dark:hover:border-sky-700"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#0E74BC_0%,#39B349_55%,#EF4444_100%)]" />

              <div className="flex items-start justify-between gap-4">
                {category.icon ? (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#e8f3ff_0%,#ffffff_100%)] ring-1 ring-blue-100 dark:bg-[linear-gradient(145deg,#082f49_0%,#0f172a_100%)] dark:ring-slate-700">
                    <Image
                      src={category.icon}
                      alt={category.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 object-contain"
                    />
                  </div>
                ) : null}

                <span className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition group-hover:bg-red-500 dark:bg-white dark:text-slate-950">
                  View
                  <ArrowOutwardRoundedIcon className="!text-base" />
                </span>
              </div>

              <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-950 transition group-hover:text-blue-700 dark:text-white dark:group-hover:text-sky-300">
                {category.name}
              </h2>
              {category.subheadline ? (
                <p className="mt-3 text-sm font-medium uppercase tracking-[0.14em] text-red-500 dark:text-red-400">
                  {category.subheadline}
                </p>
              ) : null}
              {category.description ? (
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {category.description}
                </p>
              ) : null}

              {category.subLinks?.length ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {category.subLinks.slice(0, 4).map((subLink) => (
                    <span
                      key={`${category._id}-${subLink}`}
                      className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-300"
                    >
                      {subLink}
                    </span>
                  ))}
                </div>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
