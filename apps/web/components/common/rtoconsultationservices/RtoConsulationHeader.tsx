import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Link from 'next/link';

interface RtoConsulationHeaderprops {
  mainheading?: string;
  heading?: string;
  secondary: string;
  isAuthenticated?: boolean;
}

export default function RtoConsulationHeader({ mainheading, heading, secondary }: RtoConsulationHeaderprops) {
  return (
    <div className="mb-10 ml-auto mr-auto flex flex-col bg-gradient-to-r from-[#BBDEFB] to-[#C5CAE9] px-4 dark:from-sky-950 dark:to-slate-900">
      <h1 className="mx-auto mb-6 mt-12 text-center text-3xl font-semibold leading-tight text-[#1D1D1D] dark:text-white sm:text-4xl lg:text-5xl">{mainheading}</h1>
      <h1 className="mx-auto text-center text-2xl font-semibold leading-tight text-[#374151] dark:text-slate-300 sm:text-3xl lg:text-4xl">{heading}</h1>
      <p className="mx-auto mt-4 hidden max-w-4xl text-center text-base text-[#1D1D1D] dark:text-slate-300 sm:mt-8 sm:block sm:text-lg sm:leading-7">{secondary}</p>
      <div className="mx-auto mb-20 mt-8 flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-6">
        <Link
          href="/book-appointment"
          className="rounded-lg bg-black px-10 py-3 text-center font-medium text-white transition-all duration-300 hover:scale-110 hover:opacity-80 hover:shadow-[rgba(0,0,0,0.24)_0px_3px_8px] dark:bg-sky-600 dark:hover:bg-sky-700"
        >
          Contact us <KeyboardArrowRightIcon />
        </Link>
      </div>
    </div>
  );
}
