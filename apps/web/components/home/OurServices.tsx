"use client";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useEffect, useMemo, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import OurServicesCard from "./OurServicesCard";
import URLUtils from "../../scripts/UrlUtils";
import { useGlobalToastStore } from "../../state/useGlobalToastStore";

interface ServiceItem {
  _id?: string;
  name?: string;
  abbreviation: string;
  iconUrl?: string;
  isNewlyUpdated?: boolean;
  newProductFlagExpiry?: string | null;
}

interface FormattedService {
  heading: string;
  key: string;
  categoryId: string;
  categoryName: string;
  iconUrl: string;
  isNewlyUpdated: boolean;
  newProductFlagExpiry: string | null;
}

export default function OurServices () {
  const [swiperData, setSwiperData] = useState<FormattedService[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const setToastState = useGlobalToastStore((state) => state.setToastState);
  const filteredServices = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return swiperData;
    }

    return swiperData.filter((service) => service.heading.toLowerCase().includes(query));
  }, [searchTerm, swiperData]);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: filteredServices.length > 5,
      drag: true,
      mode: "snap",
      rubberband: true,
      renderMode: "performance",
      slides: {
        perView: "auto",
        origin: "center",
        spacing: 24,
      },
    },
    [
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;

        const clearNextTimeout = () => clearTimeout(timeout);
        const nextTimeout = () => {
          clearTimeout(timeout);
          if (mouseOver || filteredServices.length === 0 || searchTerm.trim()) {
            return;
          }
          timeout = setTimeout(() => {
            slider.next();
          }, 2500);
        };

        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  useEffect(() => {
    const fetchAbbreviations = async () => {
      try {
        const res = await URLUtils.get("Category-Abbreviations", {
          withCredentials: true,
        });
        if (res.status === 200) {
          const formatted = res.data.map((item: ServiceItem) => ({
            heading: `${item.abbreviation} Services`,
            key: item.abbreviation,
            categoryId: item._id || "",
            categoryName: item.name || item.abbreviation,
            iconUrl: item.iconUrl || "",
            isNewlyUpdated: item.isNewlyUpdated || false,
            newProductFlagExpiry: item.newProductFlagExpiry || null,
          }));
          setSwiperData(formatted);
        }
      } catch (e: unknown) {
        const err = e as { response?: { data?: { err?: string } } };
        setToastState({ html: err.response?.data?.err || "Failed to load abbreviations!", show: true });
      }
    };

    fetchAbbreviations();
  }, [setToastState]);

  useEffect(() => {
    instanceRef.current?.update();
  }, [filteredServices, instanceRef]);

  return (
    <section className="relative flex flex-col items-center bg-[rgba(14,116,188,0.06)] px-4 py-8 dark:bg-slate-950 md:px-4 lg:px-8">
      {/* <Image loading="lazy" src={triangleImg.src} alt="Decorative triangle design element on top left" className="absolute left-0 top-5 hidden md:block" width={80} height={80} />
      <Image loading="lazy" src={triangleImg.src} alt="Decorative triangle design element on top right" className="absolute right-0 top-5 hidden scale-x-[-1] md:block" width={80} height={80} /> */}
      <div className="mb-2 max-w-[1220px]">
        <div className="relative mb-6">
          <h1 className="text-left text-2xl font-semibold text-slate-950 dark:text-white md:text-center md:text-[42px]">
            Training and assessment resources for RTOs
          </h1>
        </div>
        <div className="mx-auto mt-5 max-w-xl">
          <label className="relative block">
            <span className="sr-only">Search services</span>
            <SearchOutlinedIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 !text-[22px] !text-blue-500 dark:!text-sky-300" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search services..."
              className="h-12 w-full rounded-full border-2 border-blue-500 bg-white pl-12 pr-5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:border-sky-400 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-sky-300 dark:focus:ring-sky-900/50"
            />
          </label>
        </div>
        {/* <p className="text-left text-lg text-slate-950 dark:text-slate-300 md:text-center">
          RTO specialist resources are developed by a carefully selected team of skilled instructional designers, in collaboration with subject matter experts, vocational trainers, and Registered Training Organisations (RTOs). The resource development process focuses on producing high-quality, compliant training materials tailored to a broad range of subject areas and industries. This collaborative approach ensures that all materials align with current standards and effectively support the educational needs of learners within the vocational education and training sector.
        </p> */}
      </div>
      <div className="relative flex min-h-[420px] w-full items-center justify-center px-4 py-4 md:px-6">
        <button onClick={() => instanceRef.current?.prev()} className={`z-10 hidden min-h-10 min-w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-[18px] font-bold text-blue-600 transition hover:bg-blue-600 hover:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-sky-300 dark:hover:bg-sky-600 md:flex ${searchTerm.trim() ? "md:invisible" : ""}`}>
          {"<"}
        </button>
        <div className="w-full overflow-hidden px-0 py-9 sm:px-2">
          {searchTerm.trim() ? (
            filteredServices.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-10">
                {filteredServices.map((service, idx) => (
                  <div key={service.heading + idx} className="flex w-[210px] justify-center">
                    <OurServicesCard
                      service={service}
                      icon={service.iconUrl}
                      isNewlyUpdated={service.isNewlyUpdated}
                      newProductFlagExpiry={service.newProductFlagExpiry}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                No services match your search.
              </div>
            )
          ) : (
            <div ref={sliderRef} className="keen-slider !overflow-visible">
              {filteredServices.map((service, idx) => (
                <div key={service.heading + idx} className="keen-slider__slide !flex !w-[210px] !min-w-[210px] !max-w-[210px] !shrink-0 !grow-0 !basis-[210px] !justify-center !overflow-visible">
                  <OurServicesCard
                    service={service}
                    icon={service.iconUrl}
                    isNewlyUpdated={service.isNewlyUpdated}
                    newProductFlagExpiry={service.newProductFlagExpiry}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => instanceRef.current?.next()} className={`z-10 hidden min-h-10 min-w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-[18px] font-bold text-blue-600 transition hover:bg-blue-600 hover:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-sky-300 dark:hover:bg-sky-600 md:flex ${searchTerm.trim() ? "md:invisible" : ""}`}>
          {">"}
        </button>
      </div>
    </section>
  );
}
