interface RtoTipsTileProps {
  heading: string;
  body: string;
  icon: React.ReactNode;
}

export default function RtoTipsTile({ heading, body, icon }: RtoTipsTileProps) {
  return (
    <div className="lg:ml-6 xl:ml-12">
      <div className="relative mb-4 flex flex-col gap-4 bg-white p-4 shadow-[rgba(0,0,0,0.24)_1px_1px_8px] dark:bg-slate-800 dark:shadow-slate-950 sm:flex-row sm:p-6 lg:mb-6 xl:p-10">
        <div className="shrink-0 text-[2.625rem] text-[#1E88E5] dark:text-sky-400">
          {icon}
        </div>
        <div>
          <h4 className="mb-3 text-lg font-medium leading-[1.875rem] dark:text-white sm:text-[1.375rem]">{heading}</h4>
          <p className="text-sm leading-5 text-[#1D1D1D] dark:text-slate-300">{body}</p>
        </div>
      </div>
    </div>
  );
}
