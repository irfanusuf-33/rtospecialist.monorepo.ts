interface KeyConsTileProps {
  heading: string;
  body: string;
  icon: React.ReactNode;
}

export default function KeyConsTile({ heading, body, icon }: KeyConsTileProps) {
  return (
    <div className="mb-0">
      <div className="h-full rounded-2xl bg-white px-6 pb-12 pt-6 shadow-[0_2px_16px_rgba(0,0,0,0.12)] dark:bg-slate-800 dark:shadow-[0_2px_16px_rgba(0,0,0,0.40)]">
        <div className="flex h-20 w-20 -translate-y-16 items-center justify-center rounded-full bg-white text-3xl text-[#1E88E5] shadow-[0_2px_12px_rgba(0,0,0,0.12)] dark:bg-slate-700 dark:text-sky-400 dark:shadow-[0_2px_12px_rgba(0,0,0,0.40)]">
          {icon}
        </div>
        <div className="-mt-8">
          <h3 className="mb-4 text-[1.375rem] font-medium leading-[1.875rem] dark:text-white">{heading}</h3>
          <p className="text-sm leading-5 text-[#1D1D1D] dark:text-slate-300">{body}</p>
        </div>
      </div>
    </div>
  );
}
