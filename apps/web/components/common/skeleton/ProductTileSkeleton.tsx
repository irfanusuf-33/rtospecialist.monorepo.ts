export default function ProductTileSkeleton() {
  return (
    <div className="relative mx-2 mb-2 flex w-72 animate-pulse flex-col justify-end rounded-lg border border-[#d1d5db] bg-white shadow-[rgba(0,0,0,0.24)_0px_3px_8px] dark:border-slate-700 dark:bg-slate-800 dark:shadow-slate-950">
      <div className="p-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="mb-4 h-3.5 rounded-xl bg-[#d1d5db] dark:bg-slate-600" />
        ))}
        <div className="mx-auto h-[50px] w-32 rounded-[30px] bg-[#d1d5db] dark:bg-slate-600" />
      </div>
      <div className="px-6 pb-6 pt-2">
        <button
          tabIndex={-1}
          type="button"
          className="h-12 w-full rounded-lg bg-[#d1d5db] dark:bg-slate-600"
        >
          &nbsp;
        </button>
      </div>
    </div>
  );
}
