import { lazy } from 'react';
import RtoWhyRegisterTile from "./whyregister/RtoWhyRegisterTile";
const ShapeOne = lazy(() => import("./ShapeOne"));
const ShapeTwo = lazy(() => import("./ShapeTwo"));

interface TileDataItem {
  heading: string;
  body: string;
  icon: React.ReactNode;
}

interface RtoConsultingWhyRegsiterProps {
  tileData: TileDataItem[];
  heading: string;
  secondary: string;
}

export default function RtoConsultingWhyRegsiter({ tileData, heading, secondary }: RtoConsultingWhyRegsiterProps) {
  return (
    <section className="relative z-[1] overflow-hidden bg-[#f9fafb] py-14 text-[#18181b] dark:bg-slate-900 dark:text-slate-100 md:py-12 md:pb-24">
      <ShapeOne />
      <ShapeTwo />
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold leading-relaxed dark:text-white sm:text-3xl md:text-[2.5rem]">{heading}</h2>
          <p className="mb-16 text-base leading-relaxed text-[#1D1D1D] dark:text-slate-300 md:mb-24">{secondary}</p>
        </div>
        <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-${tileData.length === 4 ? '4' : '3'}`}>
          {tileData.map(({ heading, body, icon }, index) => (
            <RtoWhyRegisterTile heading={heading} body={body} icon={icon} key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
