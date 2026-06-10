"use client";

import { usePageLoaderStore } from "@/state/usePageLoaderStore";
// import "../../client/scss/pageloader.scss";

export default function PageLoader () {

  const loader = usePageLoaderStore((state) => state.isLoading);

  return (
    <div className={` ${!loader && 'hidden'} parent-page-loader fixed top-0 left-0`}>
      <div className="page-loader-line"></div>
    </div>
  );
}
