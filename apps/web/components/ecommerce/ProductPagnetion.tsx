"use client";

import WestIcon from '@mui/icons-material/West';
import EastOutlinedIcon from '@mui/icons-material/EastOutlined';

interface ProductPaginationProps {
  active: number;
  pages: number;
  onPageChange: (page: number) => void;
}

export default function ProductPagnetion ({ active, pages, onPageChange }: ProductPaginationProps) {
  const next = () => {
    if (active < pages) {
      onPageChange(active + 1);
    }
  };

  const prev = () => {
    if (active > 1) {
      onPageChange(active - 1);
    }
  };

  const getVisiblePages = () => {
    if (pages <= 3) {
      return Array.from({ length: pages }, (_, i) => i + 1);
    }

    if (active <= 2) {
      return [1, 2, 3, "...", pages];
    }

    if (active >= pages - 1) {
      return [1, "...", pages - 2, pages - 1, pages];
    }

    return [1, "...", active, "...", pages];
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
        Page {active} of {Math.max(pages, 1)}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
      <button className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900" onClick={prev} disabled={active === 1}>
        <WestIcon /> Previous
      </button>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {getVisiblePages().map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-2 text-gray-500">...</span>
          ) : (
            <button
              key={index}
              type="button"
              onClick={() => onPageChange(page as number)}
              className={`grid h-11 w-11 place-items-center rounded-lg text-sm font-semibold transition ${
                active === page
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>
      <button
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
        onClick={next}
        disabled={active === pages}
      >
        Next
        <EastOutlinedIcon />
      </button>
      </div>
    </div>
  );
}
