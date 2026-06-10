import RtoTipsImg from "./tips/RtoTipsImg";
import RtoTipsTile from "./tips/RtoTipsTile";

interface TileDataItem {
  heading: string;
  body: string;
  icon: React.ReactNode;
}

interface RtoConsultationTipsProps {
  heading: string;
  tileData: TileDataItem[];
}

export default function RtoConsultationTips({ heading, tileData }: RtoConsultationTipsProps) {
  return (
    <section className="overflow-hidden bg-[#f9fafb] py-14 dark:bg-slate-900 md:py-24">
      <div className="mx-auto px-4">
        <div className="mx-auto mb-10 flex max-w-4xl justify-center text-center md:mb-12">
          <h2 className="text-xl font-bold leading-tight dark:text-white sm:text-2xl md:text-[2.5rem]">{heading}</h2>
        </div>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:pt-12 lg:grid-cols-2">
          <RtoTipsImg />
          <div>
            {tileData.map(({ heading, body, icon }, index) => (
              <RtoTipsTile heading={heading} body={body} icon={icon} key={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
