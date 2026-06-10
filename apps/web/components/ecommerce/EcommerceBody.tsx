"use client";

import { useState, useEffect } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import {
  Drawer,
} from "@material-tailwind/react";
import EnquireNowCard from "../common/EnquireNowCard";
import EcommerceSideLinks from './EcommerceSideLinks';
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProductPrimaryLinksStore } from '../../state/useProductPrimaryLinksStore';
import { useEcommerceFiltersStore } from "../../state/useEcommerceFiltersStore";
import { useProductCategoryPageStore } from "../../state/useProductCategoryPageStore";
import { useCartStore } from "../../state/useCartStore";
import { useGlobalToastStore } from "../../state/useGlobalToastStore";
import { usePageLoaderStore } from "../../state/usePageLoaderStore";
import URLUtils from "../../scripts/UrlUtils";

interface EcommerceBodyProps {
  selectedCategoryId?: string | null;
  selectedSubcategoryId?: string | null;
  selectedCategoryName?: string | null;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

interface subLink {
  _id:string;
  name:string;
  url:string;
  disable:boolean
}
interface ProductPrimaryLink {
  _id: string;
  name: string;
  url:string;
  subLinks: subLink[];
  disable:boolean;
  iconUrl:string
}

type ProductGroups = Record<string, unknown[]>;
type FilterSectionKey = "packages" | "availability" | "productType" | "qualification";

export default function EcommerceBody ({ selectedCategoryId, isSidebarCollapsed = false, onToggleSidebar }: EcommerceBodyProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openSections, setOpenSections] = useState<Record<FilterSectionKey, boolean>>({
    packages: true,
    availability: false,
    productType: false,
    qualification: false,
  });

  const mainLinks: ProductPrimaryLink[] = useProductPrimaryLinksStore((state) => state.productPrimaryLinks);
  const router = useRouter();
  const selectedPackageIds = useEcommerceFiltersStore((state) => state.selectedPackageIds);
  const availability = useEcommerceFiltersStore((state) => state.availability);
  const productType = useEcommerceFiltersStore((state) => state.productType);
  const qualificationLevels = useEcommerceFiltersStore((state) => state.qualificationLevels);
  const setSelectedPackageIds = useEcommerceFiltersStore((state) => state.setSelectedPackageIds);
  const setAvailability = useEcommerceFiltersStore((state) => state.setAvailability);
  const setProductType = useEcommerceFiltersStore((state) => state.setProductType);
  const toggleQualificationLevel = useEcommerceFiltersStore((state) => state.toggleQualificationLevel);
  const clearFilters = useEcommerceFiltersStore((state) => state.clearFilters);
  const setCategorySelected = useProductCategoryPageStore((state) => state.setCategorySelected);
  const setCategoryPageProducts = useProductCategoryPageStore((state) => state.setProductCategoryPage);
  const setCategorySubcategories = useProductCategoryPageStore((state) => state.setCategorySubcategories);
  const setProductUUIDS = useProductCategoryPageStore((state) => state.setProductUUIDS);
  const setActivePage = useProductCategoryPageStore((state) => state.setActivePage);
  const setTotalPages = useProductCategoryPageStore((state) => state.setTotalPages);
  const setGroupAllInCart = useCartStore((state) => state.setGroupAllInCart);
  const setToastState = useGlobalToastStore((state) => state.setToastState);
  const setLoading = usePageLoaderStore((state) => state.setLoading);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  useEffect(() => {

    const handleResize = () => {
      if (window.innerWidth >= 960) {
        setOpen(false);
      } else {
        setOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!selectedCategoryId) {
      return;
    }

    if (selectedPackageIds.length > 0) {
      return;
    }

    const nextSelectedPackageIds = [selectedCategoryId];
    setSelectedPackageIds(nextSelectedPackageIds);
  }, [selectedCategoryId, selectedPackageIds, setSelectedPackageIds]);

  const normaliseProductGroups = (products: unknown) => {
    if (products && typeof products === "object" && !Array.isArray(products)) {
      return products as ProductGroups;
    }

    if (Array.isArray(products)) {
      return { "Training Resources": products };
    }

    return {};
  };

  const getPaginationFromResponse = (data: Record<string, unknown>) => {
    const pagination = data.pagination && typeof data.pagination === "object"
      ? data.pagination as Record<string, unknown>
      : null;

    return {
      currentPage: Number(pagination?.currentPage || data.currentPage || 1),
      totalPages: Number(pagination?.totalPages || data.totalPages || 1),
    };
  };

  const getBackendAvailability = (availabilityFilters: typeof availability) => (
    availabilityFilters.map((item) => item === "pre-order" ? "preorder" : item).join(",")
  );

  const fetchProducts = async (packageIds: string[], availabilityFilters: typeof availability) => {
    setLoading(true);

    try {
      const params: Record<string, string | number> = {
        page: 1,
        limit: 20,
      };

      if (packageIds.length > 0) {
        params.categories = packageIds.join(",");
      }

      if (availabilityFilters.length > 0) {
        params.availability = getBackendAvailability(availabilityFilters);
      }

      const res = await URLUtils.get("Product-ShowAllFromCategoriesAndSubcategories", params);

      if (res.status === 200) {
        const pagination = getPaginationFromResponse(res.data as Record<string, unknown>);

        setCategorySelected(true);
        setCategoryPageProducts(normaliseProductGroups(res.data.products || res.data.data));
        setCategorySubcategories(Array.isArray(res.data.subcategories) ? res.data.subcategories : []);
        setProductUUIDS(res.data.uuids || {});
        setActivePage(pagination.currentPage);
        setTotalPages(pagination.totalPages);
        setGroupAllInCart({
          electiveUnits: Boolean(res.data.euInCart),
          coreUnits: Boolean(res.data.coreInCart ?? res.data.cuInCart),
        });
        router.replace("/ecommerce");
      }

      if (window.innerWidth < 960) {
        closeDrawer();
      }
    } catch (e: unknown) {
      const err = e as { response?: { data?: { e?: string } } };
      setToastState({ html: err.response?.data?.e || "Failed to load selected training packages!", show: true });
    } finally {
      setLoading(false);
    }
  };

  const getByCategoryProducts = async (_id: string) => {
    const nextPackageIds = selectedPackageIds.includes(_id)
      ? selectedPackageIds.filter((id) => id !== _id)
      : [...selectedPackageIds, _id];

    setSelectedPackageIds(nextPackageIds);
    await fetchProducts(nextPackageIds, availability);
  };

  const handleAvailabilityChange = async (value: typeof availability[number]) => {
    const nextAvailability = availability.includes(value)
      ? availability.filter((item) => item !== value)
      : [...availability, value];

    setAvailability(nextAvailability);
    await fetchProducts(selectedPackageIds, nextAvailability);
  };

  const searchResults = mainLinks.flatMap((cat) => {
    const results = [];
    if (cat.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      results.push({
        label: cat.name,
        href: `/ecommerce?categoryid=${cat._id}&categoryname=${encodeURIComponent(cat.name)}`
      });
    }
    return results;
  });

  const activePackageIds = selectedPackageIds;
  const availabilityOptions = [
    { label: "Ready for sale", value: "ready" },
    { label: "Pre-Order", value: "pre-order" },
  ] as const;
  const productTypeOptions = [
    { label: "All", value: "all" },
    { label: "Qualification", value: "qualification" },
    { label: "Units", value: "unit" },
  ] as const;
  const qualificationLevelOptions = [
    "Advanced Diploma",
    "Certificate I",
    "Certificate II",
    "Certificate III",
    "Certificate IV",
    "Course",
    "Diploma",
    "Graduate Certificate",
    "Graduate Diploma",
  ];

  const handleClearAll = () => {
    clearFilters();
    router.push("/ecommerce");
    void fetchProducts([], []);
  };

  const toggleSection = (section: FilterSectionKey) => {
    setOpenSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  const filterContent = (
    <div className="mx-auto w-full max-w-[320px]">
      <div className="sticky top-0 z-40 rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950 lg:static">
        <div className='flex w-full items-start justify-between gap-4'>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-sky-300">
              Filters
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">
              Training Resources
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex min-h-9 items-center gap-1 rounded-lg px-3 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-sky-300 dark:hover:bg-sky-950 dark:hover:text-sky-200"
            >
              <RestartAltOutlinedIcon className="!text-base" />
              Clear all
            </button>
            <button
              type="button"
              onClick={closeDrawer}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 lg:hidden"
              aria-label="Close filters"
            >
              <CloseOutlinedIcon fontSize="small" />
            </button>
          </div>
        </div>
        <div className='relative mt-4'>
          <input
            className='min-h-11 w-full rounded-lg border border-slate-200 bg-white px-10 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-sky-500 dark:focus:ring-sky-950'
            type='text'
            placeholder='Search packages...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon className='absolute left-3 top-3 text-slate-400 !text-xl' />
          {searchTerm && searchResults.length > 0 && (
            <div className='absolute left-0 top-12 z-50 max-h-64 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900'>
              {searchResults.map((item, index) => (
                <Link
                  href={item.href}
                  key={index}
                  className='block border-b border-slate-100 px-4 py-2 text-sm text-slate-700 last:border-none hover:bg-blue-50 hover:text-blue-700 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-sky-950 dark:hover:text-sky-300'
                  onClick={closeDrawer}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950">
        <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
          <button
            type="button"
            onClick={() => toggleSection("packages")}
            className="flex w-full items-center gap-3 text-left"
          >
            <span className="text-slate-900 transition dark:text-white">
              {openSections.packages ? <KeyboardArrowUpOutlinedIcon className="rotate-[-90deg]" /> : <KeyboardArrowRightOutlinedIcon />}
            </span>
            <span className="text-[17px] font-semibold text-slate-500 dark:text-slate-200">
              Training Packages
            </span>
          </button>
          {openSections.packages ? (
            <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-3 lg:grid-cols-3">
              {mainLinks.map((link, index) => (
                <EcommerceSideLinks
                  key={link._id || index}
                  productMainMenu={link}
                  isActive={activePackageIds.includes(link._id)}
                  onSelect={getByCategoryProducts}
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="border-b border-slate-200 py-4 dark:border-slate-800">
          <button
            type="button"
            onClick={() => toggleSection("availability")}
            className="flex w-full items-center gap-3 text-left"
          >
            <span className="text-slate-900 transition dark:text-white">
              {openSections.availability ? <KeyboardArrowUpOutlinedIcon className="rotate-[-90deg]" /> : <KeyboardArrowRightOutlinedIcon />}
            </span>
            <span className="text-[17px] font-semibold text-slate-900 dark:text-white">
              Availability
            </span>
          </button>
          {openSections.availability ? (
            <div className="mt-3 space-y-1">
              {availabilityOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex min-h-10 w-full cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-[14px] font-medium transition ${
                    availability.includes(option.value)
                      ? "text-slate-950 dark:text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={availability.includes(option.value)}
                    onChange={() => handleAvailabilityChange(option.value)}
                    className="h-4 w-4 rounded-[3px] border-2 border-slate-400 text-[#35b24a] focus:ring-[#35b24a] dark:border-slate-600 dark:bg-slate-900 dark:focus:ring-[#35b24a]"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          ) : null}
        </div>

        <div className="border-b border-slate-200 py-4 dark:border-slate-800">
          <button
            type="button"
            onClick={() => toggleSection("productType")}
            className="flex w-full items-center gap-3 text-left"
          >
            <span className="text-slate-900 transition dark:text-white">
              {openSections.productType ? <KeyboardArrowUpOutlinedIcon className="rotate-[-90deg]" /> : <KeyboardArrowRightOutlinedIcon />}
            </span>
            <span className="text-[17px] font-semibold text-slate-900 dark:text-white">
              Product Type
            </span>
          </button>
          {openSections.productType ? (
            <div className="mt-3 space-y-1">
              {productTypeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setProductType(option.value)}
                  className={`flex min-h-10 w-full items-center gap-3 rounded-md px-2 py-2 text-left text-[14px] font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                    productType === option.value
                      ? "text-slate-950 dark:text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                  }`}
                  aria-pressed={productType === option.value}
                >
                  <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 transition ${
                    productType === option.value
                      ? "border-[#35b24a] bg-white dark:bg-slate-950"
                      : "border-slate-400 bg-white dark:border-slate-600 dark:bg-slate-950"
                  }`}>
                    {productType === option.value ? <span className="h-2 w-2 rounded-full bg-[#35b24a]" /> : null}
                  </span>
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={() => toggleSection("qualification")}
            className="flex w-full items-center gap-3 text-left"
          >
            <span className="text-slate-900 transition dark:text-white">
              {openSections.qualification ? <KeyboardArrowUpOutlinedIcon className="rotate-[-90deg]" /> : <KeyboardArrowRightOutlinedIcon />}
            </span>
            <span className="text-[17px] font-semibold text-slate-900 dark:text-white">
              Qualification Type
            </span>
          </button>
          {openSections.qualification ? (
            <div className="mt-3 space-y-1">
              {qualificationLevelOptions.map((level) => (
                <label
                  key={level}
                  className={`flex min-h-10 cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-[14px] font-medium transition ${
                    qualificationLevels.includes(level)
                      ? "text-slate-950 dark:text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={qualificationLevels.includes(level)}
                    onChange={() => toggleQualificationLevel(level)}
                    className="h-4 w-4 rounded-[3px] border-2 border-slate-400 text-[#35b24a] focus:ring-[#35b24a] dark:border-slate-600 dark:bg-slate-900 dark:focus:ring-[#35b24a]"
                  />
                  {level}
                </label>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <EnquireNowCard className="mt-4" />
    </div>
  );

  return (
    <>
      <div className='ecommerce-sidebar-opener lg:hidden'>
        <div onClick={openDrawer} className='ecommerce-sidebar-opener-button'>
          <button className='side-bar-button'>Product Category <KeyboardArrowUpOutlinedIcon /></button></div>

      </div>
      <div className="hidden lg:flex lg:min-h-full lg:items-start">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="sticky top-28 inline-flex h-12 w-7 items-center justify-center rounded-r-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
          aria-label={isSidebarCollapsed ? "Expand filters" : "Collapse filters"}
        >
          {isSidebarCollapsed ? <KeyboardArrowRightOutlinedIcon /> : <KeyboardArrowLeftOutlinedIcon />}
        </button>
        {!isSidebarCollapsed && filterContent}
      </div>
      <Drawer
        size={380}
        placement='bottom'
        overlay={false}
        open={open}
        className="ecommerce-drawer-container !gap-0 !overflow-y-auto !bg-white !px-4 !pb-6 !pt-4 dark:!bg-slate-950 sm:!px-6 lg:!hidden"
        placeholder={undefined}
      >
        {filterContent}
      </Drawer>
    </>
  );
}
