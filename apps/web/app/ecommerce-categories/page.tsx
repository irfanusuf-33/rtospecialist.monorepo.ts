"use client";

import { useEffect, useState } from "react";
import EcommerceCategoryItems, { type CategoryListItem } from "@/components/ecommerce/EcommerceCategoryItems";
import URLUtils from "@/scripts/UrlUtils";
import { useGlobalToastStore } from "@/state/useGlobalToastStore";

interface CategoryApiItem {
  _id?: string;
  name?: string;
  description?: string;
  headline?: string;
  subheadline?: string;
  iconUrl?: string;
  subLinks?: Array<{ _id?: string; name?: string } | string>;
}

export default function EcommerceCategoryList() {
  const [data, setData] = useState<CategoryListItem[]>([]);
  const setToastState = useGlobalToastStore((state) => state.setToastState);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await URLUtils.get("Category-Show");
        console.log("Category-Show response:", res.data);

        if (res.status === 200) {
          const formatted = (res.data as CategoryApiItem[]).map((item) => ({
            _id: item._id || "",
            name: item.name || "Untitled Category",
            icon: item.iconUrl,
            description: item.description,
            subheadline: item.subheadline || item.headline,
            subLinks: (item.subLinks || [])
              .map((subLink) => (typeof subLink === "string" ? subLink : subLink.name))
              .filter((subLink): subLink is string => Boolean(subLink)),
          }));

          setData(formatted);
        }
      } catch (e: unknown) {
        const err = e as { response?: { data?: { err?: string } } };
        setToastState({ html: err.response?.data?.err || "Failed to load categories!", show: true });
      }
    };

    void fetchCategories();
  }, [setToastState]);

  return <EcommerceCategoryItems data={data} />;
}
