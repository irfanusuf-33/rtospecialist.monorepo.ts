import RtoStepsImg from "./steps/RtoStepsImg";
import RtoStepsTile from "./steps/RtoStepsTile";
import { StaticImageData } from 'next/image';

interface TileDataItem {
  heading: string;
  body: string;
}

interface RtoConsultationStepsProps {
  heading?: string;
  tileData?: TileDataItem[];
  image?: StaticImageData;
}

export default function RtoConsultationSteps({ heading, tileData = [], image }: RtoConsultationStepsProps) {
  return (
    <section>
      <div className="mx-auto my-6 w-full bg-[#f9fafb] px-4 py-14 dark:bg-slate-900 sm:px-6 md:px-10 md:py-20">
        <h3 className="mb-12 text-center text-2xl font-bold leading-tight text-[#1E88E5] dark:text-sky-400 sm:text-3xl md:mb-16 md:text-[2.5rem] md:leading-none">
          {heading}
        </h3>
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex h-full flex-col [grid-area:2/1/3/2] lg:[grid-area:1/2/2/3]">
            {tileData.map(({ heading: tileHeading, body }, count) => (
              <RtoStepsTile heading={tileHeading} body={body} count={count + 1} key={count} />
            ))}
          </div>
          {image && <RtoStepsImg image={image} />}
        </div>
      </div>
    </section>
  );
}
