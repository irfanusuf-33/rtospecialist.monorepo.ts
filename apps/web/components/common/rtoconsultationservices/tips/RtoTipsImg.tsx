import rtoTipsImg from "../../../../assets/WhyRegisterImg.jpeg";
import Image from "next/image";

export default function RtoTipsImg () {

  return (
    <div className="relative h-full z-10">
      <div
        className="absolute -top-11 -left-11 right-12 bottom-12 bg-blue-900 dark:bg-slate-700 -z-10 rounded-[200px] lg:rounded-full rounded-tl-none lg:rounded-tl-none"
      ></div>
      <div className="rounded-2xl min-h-[350px] w-full float-right shadow-xl h-full">
        <Image src={rtoTipsImg.src} className="rounded-lg" alt="" width={700} height={1575} />
      </div>
    </div>
  );
}
