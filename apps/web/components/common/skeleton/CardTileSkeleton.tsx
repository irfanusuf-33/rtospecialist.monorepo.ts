export default function CardTileSkeleton() {
  return (
    <div className="flex h-8 rounded-lg p-2 shadow-[rgba(0,0,0,0.24)_0px_3px_8px] dark:shadow-slate-950">
      <div className="flex flex-1 flex-col gap-3 p-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 w-full animate-pulse rounded-lg bg-[#e5e7eb] dark:bg-slate-700" />
        ))}
      </div>
      <div className="p-2">
        <div className="h-8 w-24 animate-pulse rounded-[20px] bg-[#e5e7eb] dark:bg-slate-700" />
      </div>
    </div>
  );
}
