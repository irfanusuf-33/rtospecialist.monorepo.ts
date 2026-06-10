import KeyConsTile from "./keyconsiderations/KeyConsTile";

interface TileDataItem {
  heading: string;
  body: string;
  icon: React.ReactNode;
}

interface RtokeyConsiderationsProps {
  heading: string;
  tileData: TileDataItem[];
}

export default function RtokeyConsiderations({ heading, tileData }: RtokeyConsiderationsProps) {
  return (
    <section className="relative z-[1] overflow-hidden bg-white py-14 text-[#18181b] dark:bg-slate-950 dark:text-slate-100 md:py-24">
      <div className="container relative mx-auto px-4">
        <div className="absolute bottom-16 left-1/2 right-0 top-16 -z-10 w-screen rounded-[30px_0_0_30px] bg-[rgba(37,99,235,0.08)] dark:bg-[rgba(37,99,235,0.15)] lg:left-[60%]" />
        <div className="mb-12 w-full max-w-xl">
          <h4 className="mb-4 text-2xl font-bold leading-none dark:text-white sm:text-3xl md:text-[2.5rem]">{heading}</h4>
        </div>
        <div className="mt-20 grid grid-cols-1 gap-x-6 gap-y-32 sm:grid-cols-2 md:grid-cols-3 md:gap-y-16">
          {tileData.map(({ heading, body, icon }, index) => (
            <KeyConsTile heading={heading} body={body} icon={icon} key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
