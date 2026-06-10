"use client"

import { useState, useEffect } from "react";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLeadStore } from "@/state/useLeadStore";
import { useMobileSidebarStore } from "@/state/useMobileSidebarStore";
import { useProductStore } from "@/state/useProductStore";
import { useAllProductsStore, type StoredProduct } from "@/state/useAllProductsStore";
import { useTrainingResourcesStore } from "@/state/useTrainingResourcesStore";
import { MobileNavSideBar } from "./MobileNavSideBar";
import URLUtils from "@/scripts/UrlUtils";
import type { TrainingCategory, TrainingSubcategory } from "@/state/useTrainingResourcesStore";

interface TrainingProduct extends StoredProduct {
  _id: string;
  imageUrl: string;
  productId: string;
  name: string;
  description: string;
  salePrice: number | string;
  price: number | string;
  preOrder?: boolean;
  inCart?: boolean;
  link?: string;
}

interface PdevCategory {
  _id: string;
  name: string;
}

interface PdevCourse {
  _id: string;
  fileId?: string;
  name: string;
  parent?: {
    _id?: string;
  };
}

// Shared class strings
const navLinkBase = "relative text-[15px] font-medium normal-case tracking-normal text-white transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-[width] after:duration-300 hover:text-white/80 hover:after:w-full focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";
const dropdownWrapper = "absolute top-[22px] left-0 z-[99999] hidden h-auto group-hover:grid group-focus-within:grid";
const dropdownInner = "mt-3 w-max min-w-[280px] rounded-lg border border-slate-300 bg-white p-[30px] shadow-lg dark:border-slate-700 dark:bg-slate-900";
const dropdownGrid = "grid grid-cols-2 gap-x-10 gap-y-2.5";
const dropdownSingle = "grid grid-cols-1 gap-x-5 gap-y-2";
const dropdownLi = "rounded-lg px-3 py-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800";
const ulLink = "whitespace-nowrap text-[13px] font-medium uppercase text-slate-800 transition-colors hover:text-slate-950 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E74BC] dark:text-slate-100 dark:hover:text-white dark:focus-visible:outline-sky-300";
const trainingDropdownInner = "mt-2.5 max-h-[min(35rem,calc(100vh-7.5rem))] w-fit max-w-[calc(100vw-4rem)] overflow-hidden p-0 rounded-lg border border-slate-300 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900";
const trainingMenuColumn = "flex max-h-[inherit] min-w-[16.25rem] flex-col gap-1 overflow-y-auto border-r border-slate-200 p-4 last:border-r-0 dark:border-slate-700";
const trainingMenuItem = "flex items-start justify-between gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E74BC] dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white dark:focus-visible:outline-sky-300";
const trainingProductItem = "flex flex-col items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white px-2.5 py-2 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E74BC] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white dark:focus-visible:outline-sky-300";
const trainingMenuEmpty = "px-2.5 py-2 text-xs text-slate-500 dark:text-slate-400";
const linkIcon = "transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180";

function TrainingResourcesMenu() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [activeSubcategoryId, setActiveSubcategoryId] = useState<string | null>(null);
  const [productsBySubcategory, setProductsBySubcategory] = useState<Record<string, TrainingProduct[]>>({});
  const [productsByCategory, setProductsByCategory] = useState<Record<string, TrainingProduct[]>>({});
  const [loadingCategoryId, setLoadingCategoryId] = useState<string | null>(null);
  const [loadingSubcategoryId, setLoadingSubcategoryId] = useState<string | null>(null);
  const setProduct = useProductStore((state) => state.setProduct);
  const upsertProducts = useAllProductsStore((state) => state.upsertProducts);
  const categories = useTrainingResourcesStore((state) => state.categories);
  const hasLoadedCategories = useTrainingResourcesStore((state) => state.hasLoadedCategories);
  const fetchCategories = useTrainingResourcesStore((state) => state.fetchCategories);

  const activeCategory = categories.find((c) => c._id === activeCategoryId) || null;
  const activeSubcategories = activeCategory?.subLinks || [];
  const activeSubcategory = activeSubcategories.find((s) => s._id === activeSubcategoryId) || null;
  const activeProducts = activeSubcategoryId
    ? (productsBySubcategory[activeSubcategoryId] || [])
    : activeCategoryId
      ? (productsByCategory[activeCategoryId] || [])
      : [];

  const fetchSubcategoryProducts = async (subcategoryId: string, categoryName: string) => {
    if (productsBySubcategory[subcategoryId]) return productsBySubcategory[subcategoryId];
    try {
      setLoadingSubcategoryId(subcategoryId);
      const res = await URLUtils.get("Product-ShowBySubCategory", { cid: subcategoryId, name: categoryName?.toUpperCase() });
      if (res.status === 200) {
        const flat = Object.values((res.data?.products || {}) as Record<string, TrainingProduct[]>).flat();
        setProductsBySubcategory((c) => ({ ...c, [subcategoryId]: flat }));
        upsertProducts(flat, `nav-subcategory:${subcategoryId}`);
        return flat;
      }
    } catch {
      setProductsBySubcategory((c) => ({ ...c, [subcategoryId]: [] }));
    } finally {
      setLoadingSubcategoryId((c) => c === subcategoryId ? null : c);
    }
    return [];
  };

  const fetchCategoryProducts = async (categoryId: string, categoryName: string) => {
    if (productsByCategory[categoryId]) return productsByCategory[categoryId];
    try {
      setLoadingCategoryId(categoryId);
      const res = await URLUtils.get("Product-ShowByCategory", { cid: categoryId, name: categoryName?.toUpperCase() });
      if (res.status === 200) {
        const flat = Object.values((res.data?.products || {}) as Record<string, TrainingProduct[]>).flat();
        setProductsByCategory((c) => ({ ...c, [categoryId]: flat }));
        upsertProducts(flat, `nav-category:${categoryId}`);
        return flat;
      }
    } catch {
      setProductsByCategory((c) => ({ ...c, [categoryId]: [] }));
    } finally {
      setLoadingCategoryId((c) => c === categoryId ? null : c);
    }
    return [];
  };

  const handleMenuEnter = () => { if (!hasLoadedCategories) void fetchCategories(); };
  const handleMenuLeave = () => { setActiveCategoryId(null); setActiveSubcategoryId(null); };
  const handleCategoryHover = (category: TrainingCategory) => {
    setActiveCategoryId(category._id);
    setActiveSubcategoryId(null);
    if (!category.subLinks || category.subLinks.length === 0) void fetchCategoryProducts(category._id, category.name);
  };
  const handleSubcategoryHover = (subcategory: TrainingSubcategory, categoryName: string) => {
    setActiveSubcategoryId(subcategory._id);
    void fetchSubcategoryProducts(subcategory._id, categoryName);
  };
  const handleProductClick = (product: TrainingProduct) => setProduct(product);

  const getCategoryLabel = (category: TrainingCategory) => {
    const abbr = category.abbreviation?.trim();
    if (abbr) return abbr;
    return category.name.trim().split(/\s+/)[0] || category.name;
  };

  const getCategoryHref = (category: TrainingCategory) =>
    `/ecommerce?categoryid=${category._id}&categoryname=${encodeURIComponent(category.name)}`;

  const getSubcategoryHref = (subcategory: TrainingSubcategory, category: TrainingCategory) =>
    `/ecommerce-categories/subcategory/${subcategory._id}?name=${encodeURIComponent(subcategory.name)}&categoryId=${encodeURIComponent(category._id)}&categoryName=${encodeURIComponent(category.name)}`;

  return (
    <div className="relative flex items-center group" onMouseEnter={handleMenuEnter} onMouseLeave={handleMenuLeave}>
      <Link href="/ecommerce-categories" className={`${navLinkBase} inline-flex items-center gap-1`}>
        Training Resources
        <KeyboardArrowDownOutlinedIcon className={linkIcon} />
      </Link>
      <div className={dropdownWrapper}>
        <div className={trainingDropdownInner}>
          <div className="inline-flex min-h-[26.25rem] max-h-[min(35rem,calc(100vh-7.5rem))]">
            <div className={trainingMenuColumn}>
              <p className="mb-1 text-base font-bold text-slate-800 dark:text-slate-100">Training Packages</p>
              {categories.length === 0 ? (
                <p className={trainingMenuEmpty}>Loading packages...</p>
              ) : (
                categories.map((category) => (
                  <Link
                    href={getCategoryHref(category)}
                    key={category._id}
                    className={`${trainingMenuItem} ${activeCategoryId === category._id ? "bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white" : ""}`}
                    onMouseEnter={() => handleCategoryHover(category)}
                  >
                    <span>{getCategoryLabel(category)}</span>
                    {category.subLinks && category.subLinks.length > 0 && (
                      <KeyboardArrowRightOutlinedIcon className="shrink-0 text-xl text-inherit" />
                    )}
                  </Link>
                ))
              )}
            </div>

            {activeCategory && (
              <div className={trainingMenuColumn}>
                <p className="mb-1 text-base font-bold text-slate-800 dark:text-slate-100">
                  {activeSubcategories.length > 0 ? "Qualifications" : `${activeCategory.name} Products`}
                </p>
                {activeSubcategories.length === 0 ? (
                  loadingCategoryId === activeCategory._id ? (
                    <p className={trainingMenuEmpty}>Loading products...</p>
                  ) : activeProducts.length === 0 ? (
                    <p className={trainingMenuEmpty}>No products available.</p>
                  ) : (
                    activeProducts.slice(0, 12).map((product) => (
                      <Link href={`/product/${product._id}`} key={product._id} className={trainingProductItem} onClick={() => handleProductClick(product)}>
                        <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">{product.productId}</span>
                        <span className="text-xs font-medium leading-6 text-inherit">{product.name}</span>
                      </Link>
                    ))
                  )
                ) : (
                  activeSubcategories.map((subcategory) => (
                    <Link
                      href={getSubcategoryHref(subcategory, activeCategory)}
                      key={subcategory._id}
                      className={`${trainingMenuItem} ${activeSubcategoryId === subcategory._id ? "bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white" : ""}`}
                      onMouseEnter={() => handleSubcategoryHover(subcategory, activeCategory.name)}
                    >
                      <span>{subcategory.name}</span>
                      <KeyboardArrowRightOutlinedIcon className="shrink-0 text-xl text-inherit" />
                    </Link>
                  ))
                )}
              </div>
            )}

            {activeSubcategoryId && (
              <div className={`${trainingMenuColumn} min-w-80 bg-slate-50 dark:bg-slate-950`}>
                <p className="mb-1 text-base font-bold text-slate-800 dark:text-slate-100">
                  {activeSubcategory ? `${activeSubcategory.name} Products` : "Products"}
                </p>
                {loadingSubcategoryId === activeSubcategoryId ? (
                  <p className={trainingMenuEmpty}>Loading products...</p>
                ) : activeProducts.length === 0 ? (
                  <p className={trainingMenuEmpty}>No products available.</p>
                ) : (
                  activeProducts.slice(0, 12).map((product) => (
                    <Link href={`/product/${product._id}`} key={product._id} className={trainingProductItem} onClick={() => handleProductClick(product)}>
                      <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">{product.productId}</span>
                      <span className="text-xs font-medium leading-6 text-inherit">{product.name}</span>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfessionalDevelopmentMenu() {
  const [categories, setCategories] = useState<PdevCategory[]>([]);
  const [coursesByCategory, setCoursesByCategory] = useState<Record<string, PdevCourse[]>>({});
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [loadingCategoryId, setLoadingCategoryId] = useState<string | null>(null);
  const [hasLoadedCategories, setHasLoadedCategories] = useState(false);

  const activeCategory = categories.find((c) => c._id === activeCategoryId) || null;
  const activeCourses = activeCategoryId ? (coursesByCategory[activeCategoryId] || []) : [];

  const fetchCategoriesFn = async () => {
    if (hasLoadedCategories) return;
    try {
      const res = await URLUtils.get("General-getAllUserCourseQuizCategory");
      if (res.status === 200) { setCategories(Array.isArray(res.data) ? res.data : []); setHasLoadedCategories(true); }
    } catch { setCategories([]); }
  };

  const fetchCoursesByCategory = async (categoryId: string) => {
    if (coursesByCategory[categoryId]) return;
    try {
      setLoadingCategoryId(categoryId);
      const res = await URLUtils.get("General-GetAllCoursesNames", { page: 1, limit: 500 });
      if (res.status === 200 && Array.isArray(res.data.courses)) {
        const filtered = (res.data.courses as PdevCourse[]).filter((c) => c.parent?._id === categoryId);
        setCoursesByCategory((cur) => ({ ...cur, [categoryId]: filtered }));
        return;
      }
    } catch { /* fall through */ } finally {
      setLoadingCategoryId((c) => c === categoryId ? null : c);
    }
    setCoursesByCategory((cur) => ({ ...cur, [categoryId]: [] }));
  };

  const getCategoryHref = (category: PdevCategory) =>
    `/training?categoryId=${encodeURIComponent(category._id)}&categoryName=${encodeURIComponent(category.name)}`;

  return (
    <div className="relative flex items-center group"
      onMouseEnter={() => void fetchCategoriesFn()}
      onMouseLeave={() => setActiveCategoryId(null)}
    >
      <Link href="/professional-development-plans" className={navLinkBase}>
        Professional Development
      </Link>
      <div className={dropdownWrapper}>
        <div className={trainingDropdownInner}>
          <div className="inline-flex min-h-[26.25rem] max-h-[min(35rem,calc(100vh-7.5rem))]">
            <div className={trainingMenuColumn}>
              <p className="mb-1 text-base font-bold text-slate-800 dark:text-slate-100">PD Categories</p>
              {categories.length === 0 ? (
                <p className={trainingMenuEmpty}>Loading categories...</p>
              ) : (
                categories.map((category) => (
                  <Link
                    href={getCategoryHref(category)}
                    key={category._id}
                    className={`${trainingMenuItem} ${activeCategoryId === category._id ? "bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white" : ""}`}
                    onMouseEnter={() => { setActiveCategoryId(category._id); void fetchCoursesByCategory(category._id); }}
                  >
                    <span>{category.name}</span>
                    <KeyboardArrowRightOutlinedIcon className="shrink-0 text-xl text-inherit" />
                  </Link>
                ))
              )}
            </div>

            {activeCategory && (
              <div className={`${trainingMenuColumn} min-w-80 bg-slate-50 dark:bg-slate-950`}>
                <p className="mb-1 text-base font-bold text-slate-800 dark:text-slate-100">{activeCategory.name} Courses</p>
                {loadingCategoryId === activeCategory._id ? (
                  <p className={trainingMenuEmpty}>Loading courses...</p>
                ) : activeCourses.length === 0 ? (
                  <p className={trainingMenuEmpty}>No courses available.</p>
                ) : (
                  activeCourses.slice(0, 12).map((course) => (
                    <Link href={`/training/${course._id}`} key={course._id} className={trainingProductItem}>
                      <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">{course.fileId || "PD"}</span>
                      <span className="text-xs font-medium leading-6 text-inherit">{course.name}</span>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConsultingMenu() {
  const setActiveLead = useLeadStore((state) => state.setActiveConsultingLead);

  const handleLead = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const lead = e.currentTarget.dataset.lead;
    if (lead) setActiveLead(lead);
  };

  return (
    <div className="relative flex items-center group">
      <Link href="" className={`${navLinkBase} inline-flex items-center gap-1`}>
        Consulting
        <KeyboardArrowDownOutlinedIcon className={linkIcon} />
      </Link>
      <div className={dropdownWrapper}>
        <div className={dropdownInner}>
          <ul className={dropdownGrid}>
            <li className={dropdownLi}><Link className={ulLink} href="/rto-registration" onClick={handleLead} data-lead="new rto registration">New RTO Registration</Link></li>
            <li className={dropdownLi}><Link className={ulLink} href="/rto-cricos-registration" onClick={handleLead} data-lead="new rto cricos registration">New RTO CRICOS Registration</Link></li>
            <li className={dropdownLi}><Link className={ulLink} href="/rto-elicos-registration" onClick={handleLead} data-lead="new elicos registration">New ELICOS Registration</Link></li>
            <li className={dropdownLi}><Link className={ulLink} href="/rto-renew-registration-service" onClick={handleLead} data-lead="renew registration">Renew Registration</Link></li>
            <li className={dropdownLi}><Link className={ulLink} href="/rto-compliance-consulting" onClick={handleLead} data-lead="rto compliance consulting">RTO Compliance Consulting</Link></li>
            <li className={dropdownLi}><Link className={ulLink} href="/rto-audit-service" onClick={handleLead} data-lead="rto audit services">RTO Audit Services</Link></li>
            <li className={dropdownLi}><Link className={ulLink} href="/rto-due-deligence-consulting" onClick={handleLead} data-lead="rto due diligence">RTO Due Diligence</Link></li>
            <li className={dropdownLi}><Link className={ulLink} href="/rto-website-development-service" onClick={handleLead} data-lead="website development">Website Development</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function SellMenu() {
  return (
    <div className="relative flex items-center group">
      <Link href="#" className={`${navLinkBase} inline-flex items-center gap-1`}>
        Buy Sell Lease
        <KeyboardArrowDownOutlinedIcon className={linkIcon} />
      </Link>
      <div className={dropdownWrapper}>
        <div className={dropdownInner}>
          <ul className={dropdownSingle}>
            <li className={dropdownLi}><Link href="/rto-Buy-service" className={ulLink}>Buy RTO</Link></li>
            <li className={dropdownLi}><Link href="/rto-sell-service" className={ulLink}>Sell RTO</Link></li>
            <li className={dropdownLi}><Link href="/rto-lease-delivery-location-service" className={ulLink}>Lease Delivery Location</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function NavList() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex flex-row items-center justify-center gap-x-12 p-0 m-0 w-full">
      <div className="flex items-center">
        <Link href="/" className={`${navLinkBase} ${isActive("/") ? "after:w-full" : ""}`}>Home</Link>
      </div>
      <TrainingResourcesMenu />
      <ProfessionalDevelopmentMenu />
      <ConsultingMenu />
      <SellMenu />
      <div className="flex items-center">
        <Link href="/membership-plans" className={`${navLinkBase} ${isActive("/membership-plans") ? "after:w-full" : ""}`}>Membership</Link>
      </div>
      <div className="flex items-center">
        <Link href="/book-appointment" className={`${navLinkBase} ${isActive("/book-appointment") ? "after:w-full" : ""}`}>Contact</Link>
      </div>
    </div>
  );
}

export default function Main() {
  const [scrolled, setScrolled] = useState(false);
  const openMobileSidebar = useMobileSidebarStore((state) => state.open);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`mx-auto min-w-full min-h-[58px] border-b-0 bg-[#0E74BC] px-4 py-0 text-white dark:bg-sky-900 ${scrolled ? "shadow-lg" : ""}`}>
        <div className="relative mx-auto flex min-h-[58px] max-w-[1180px] items-center justify-center">
          <div className="hidden items-center justify-center lg:flex">
            <NavList />
          </div>
          <div className="lg:hidden">
            <MenuOpenIcon
              onClick={openMobileSidebar}
              className="absolute left-0 order-first cursor-pointer rounded-lg p-1 text-[40px] text-white transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            />
          </div>
        </div>
      </nav>
      <MobileNavSideBar />
    </>
  );
}
