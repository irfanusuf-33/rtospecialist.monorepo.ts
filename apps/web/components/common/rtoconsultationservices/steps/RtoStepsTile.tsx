interface RtoStepsTileProps {
  heading: string;
  body: string;
  count: number;
}

export default function RtoStepsTile({ heading, body, count }: RtoStepsTileProps) {
  return (
    <div className="mb-6 flex w-full max-w-[32rem] gap-4 rounded-xl border border-[#e5e7eb] px-4 py-4 text-black transition-colors hover:border-[#1E88E5] dark:border-slate-700 dark:text-slate-100 dark:hover:border-sky-500 sm:px-6 sm:py-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f1f5f9] dark:bg-slate-700">
        <p className="text-sm font-bold leading-5 text-[#1E88E5] dark:text-sky-400 sm:text-base sm:leading-6">{count}</p>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold dark:text-white sm:text-[1.375rem]">{heading}</h3>
        <p className="text-sm leading-5 text-[#1D1D1D] dark:text-slate-300">{body}</p>
      </div>
    </div>
  );
}
