interface RtoWhyRegisterTileProps {
  heading: string;
  body: string;
  icon: React.ReactNode;
}

export default function RtoWhyRegisterTile({ heading, body, icon }: RtoWhyRegisterTileProps) {
  return (
    <div className="group h-full rounded-xl bg-white p-3 shadow-[rgba(0,0,0,0.24)_0px_3px_8px] transition-all duration-300 hover:-translate-y-7 hover:bg-[#1E88E5] hover:text-white dark:bg-slate-800 dark:shadow-slate-950 dark:hover:bg-sky-700 md:mt-4">
      <div className="p-4">
        <div className="flex h-16 w-16 items-center justify-center text-[2.5rem] text-[#1E88E5] transition-all group-hover:rounded-full group-hover:bg-white group-hover:p-2 dark:text-sky-400 dark:group-hover:bg-slate-900">
          {icon}
        </div>
        <h3 className="mt-4 text-lg font-medium leading-7 dark:text-slate-100 sm:text-[1.375rem]">{heading}</h3>
        <p className="mt-4 text-sm text-[#374151] group-hover:text-white dark:text-slate-300 dark:group-hover:text-white">{body}</p>
      </div>
    </div>
  );
}
