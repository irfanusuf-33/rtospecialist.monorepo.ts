"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CourseBody from "../../components/courses/CourseBody";
import Course from "../../components/courses/Course";
// import '../../client/scss/training/training.scss';

const Courses = () => {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    setSelectedCategory(searchParams.get("categoryId"));
  }, [searchParams]);

  return (
    <>
      <header className="bg-white px-5 py-14 text-center sm:px-6 md:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl">
            <span className="text-red-600">Professional</span> Development Library
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">
            If your RTO needs PD access for multiple staff, explore our membership options for a more
            structured and cost effective pathway.
          </p>
          <div className="mt-8">
            <Link
              href="/professional-development-plans#pricing"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-red-600 px-7 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600"
            >
              Explore PD Membership
            </Link>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 items-start gap-4 px-4 pb-10">
        <div
          className={`col-span-12 p-0 lg:sticky lg:top-[110px] lg:self-start ${
            isSidebarCollapsed ? "lg:col-span-1" : "lg:col-span-3"
          }`}
        >
          <CourseBody
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            isSidebarCollapsed={isSidebarCollapsed}
            setIsSidebarCollapsed={setIsSidebarCollapsed}
          />
        </div>
        <div className={`col-span-12 p-0 ${isSidebarCollapsed ? "lg:col-span-11" : "lg:col-span-9"}`}>
          <Course selectedCategory={selectedCategory} isSidebarCollapsed={isSidebarCollapsed} />
        </div>
      </div>
    </>
  );
};

export default Courses;
