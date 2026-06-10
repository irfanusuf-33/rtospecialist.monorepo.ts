"use client";

import { useEffect, useMemo, useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { Drawer } from "@material-tailwind/react";
import EnquireNowCard from "../common/EnquireNowCard";
import URLUtils from "../../scripts/UrlUtils";
import { useGlobalToastStore } from "../../state/useGlobalToastStore";
import { usePageLoaderStore } from "../../state/usePageLoaderStore";
// import "../../client/scss/ecommerce/ecommercebody.scss";

interface CourseCategory {
  _id: string;
  name: string;
}

interface CourseBodyProps {
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (value: boolean | ((current: boolean) => boolean)) => void;
  showEnquireCard?: boolean;
  staticCategories?: CourseCategory[];
}

export default function CourseBody({
  selectedCategory,
  setSelectedCategory,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  showEnquireCard = true,
  staticCategories,
}: CourseBodyProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseCategories, setCourseCategories] = useState<CourseCategory[]>([]);
  const [isPackagesOpen, setIsPackagesOpen] = useState(true);
  const setLoading = usePageLoaderStore((state) => state.setLoading);
  const setToastState = useGlobalToastStore((state) => state.setToastState);

  useEffect(() => {
    if (staticCategories) {
      setCourseCategories(staticCategories);
      return;
    }

    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await URLUtils.get("General-getAllUserCourseQuizCategory");
        if (res.status === 200) {
          setCourseCategories(Array.isArray(res.data) ? res.data : []);
        }
      } catch {
        setToastState({ html: "Categories could not be found", show: true });
      } finally {
        setLoading(false);
      }
    };

    void fetchCourses();
  }, [setLoading, setToastState, staticCategories]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsSidebarCollapsed]);

  const filteredCategories = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return courseCategories;
    }

    return courseCategories.filter((category) => category.name.toLowerCase().includes(normalizedSearch));
  }, [courseCategories, searchTerm]);

  const filterPanel = (
    <div className="mx-auto w-full max-w-[320px]">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-950/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[13px] font-medium leading-5 text-blue-600 sm:text-[12px]">Filters</p>
            <h2 className="mt-1 whitespace-nowrap text-[17px] font-semibold leading-[1.15] tracking-tight text-slate-950 sm:text-[18px]">
              Professional Development
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory(null);
                setSearchTerm("");
              }}
              className="whitespace-nowrap pt-0.5 text-[13px] font-medium leading-5 text-blue-600 transition hover:text-blue-800 sm:text-[12px]"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 lg:hidden"
              aria-label="Close filters"
            >
              <CloseOutlinedIcon fontSize="small" />
            </button>
          </div>
        </div>

        <div className="relative mt-4">
          <SearchIcon className="absolute left-3 top-3 text-slate-400 !text-xl" />
          <input
            type="text"
            placeholder="Search Courses"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="min-h-11 w-full rounded-full border border-slate-300 bg-white px-10 py-2 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-950/5">
        <button
          type="button"
          onClick={() => setIsPackagesOpen((current) => !current)}
          className="flex w-full items-center gap-3 text-left"
        >
          <span className="text-slate-900">
            {isPackagesOpen ? (
              <KeyboardArrowUpOutlinedIcon className="rotate-[-90deg]" />
            ) : (
              <KeyboardArrowRightOutlinedIcon />
            )}
          </span>
          <span className="text-lg font-medium text-slate-500">Training Courses</span>
        </button>

        {isPackagesOpen ? (
          <div className="mt-4 space-y-1">
            <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-slate-700 transition hover:bg-slate-50">
              <input
                type="checkbox"
                checked={selectedCategory === null}
                onChange={() => setSelectedCategory(null)}
                className="h-4 w-4 rounded-[3px] border-2 border-slate-400 text-[#35b24a] focus:ring-[#35b24a]"
              />
              All PD options
            </label>

            {filteredCategories.map((category) => (
              <label
                key={category._id}
                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <input
                  type="checkbox"
                  checked={selectedCategory === category._id}
                  onChange={() =>
                    setSelectedCategory(selectedCategory === category._id ? null : category._id)
                  }
                  className="h-4 w-4 rounded-[3px] border-2 border-slate-400 text-[#35b24a] focus:ring-[#35b24a]"
                />
                {category.name}
              </label>
            ))}
          </div>
        ) : null}
      </div>

      {showEnquireCard ? <EnquireNowCard className="mt-4" variant="compact" /> : null}
    </div>
  );

  return (
    <>
      <div className="ecommerce-sidebar-opener lg:hidden">
        <div onClick={() => setOpen(true)} className="ecommerce-sidebar-opener-button">
          <button className="side-bar-button">
            Training Category <KeyboardArrowUpOutlinedIcon />
          </button>
        </div>
      </div>

      <div className="hidden lg:flex lg:min-h-full lg:items-start">
        <button
          type="button"
          onClick={() => setIsSidebarCollapsed((current) => !current)}
          className="sticky top-28 inline-flex h-12 w-7 items-center justify-center rounded-r-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-800"
          aria-label={isSidebarCollapsed ? "Expand filters" : "Collapse filters"}
        >
          {isSidebarCollapsed ? <KeyboardArrowRightOutlinedIcon /> : <KeyboardArrowLeftOutlinedIcon />}
        </button>
        {!isSidebarCollapsed ? filterPanel : null}
      </div>

      <Drawer
        size={380}
        placement="bottom"
        overlay={false}
        open={open}
        className="ecommerce-drawer-container !gap-0 !overflow-y-auto !bg-white !px-4 !pb-6 !pt-4 sm:!px-6 lg:!hidden"
        placeholder={undefined}
      >
        {filterPanel}
      </Drawer>
    </>
  );
}
