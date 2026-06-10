import Link from "next/link";
import Image from "next/image";

interface Service {
  heading: string;
  key: string;
  categoryId: string;
  categoryName: string;
}

interface OurServicesCardProps {
  service: Service;
  icon: string;
  isNewlyUpdated: boolean;
  newProductFlagExpiry: string | null;
}

function OurServicesCard ({ service, icon, isNewlyUpdated, newProductFlagExpiry }: OurServicesCardProps) {
  const isStillNew =
    isNewlyUpdated && newProductFlagExpiry && new Date(newProductFlagExpiry) > new Date();
  const categoryHref = service.categoryId
    ? `/ecommerce?categoryid=${service.categoryId}&categoryname=${encodeURIComponent(service.categoryName)}`
    : "/ecommerce";

  return (
    <div className="relative mt-6 flex h-[210px] w-[210px] flex-col items-center justify-center rounded-full bg-white px-6 text-center shadow-[0_14px_28px_rgba(15,23,42,0.10),0_4px_10px_rgba(15,23,42,0.06)] dark:bg-slate-900 dark:shadow-[0_16px_30px_rgba(2,6,23,0.38),0_4px_12px_rgba(2,6,23,0.24)]">
      {isStillNew && (
        <div className="relative mt-1 rounded-xl bg-emerald-700 px-2.5 py-1 text-[12px] font-semibold text-white">
          NEW RELEASE
        </div>
      )}
      <div className="absolute -top-6 flex h-[60px] w-[60px] items-center justify-center rounded-full p-3">
        {icon && (
          <Image src={icon} alt={`${service.heading} icon`} width={36} height={36} className="h-9 w-9 object-contain" loading="lazy" />
        )}
      </div>
      <div>
        <h2 className="my-6 text-[18px] font-semibold text-blue-600 dark:text-sky-300">
          {service.heading}
        </h2>
        <Link
          href={categoryHref}
          className="inline-flex items-center justify-center rounded-full bg-red-500 px-5 py-3 text-[13px] font-medium text-white shadow-lg transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600 dark:bg-red-500 dark:hover:bg-red-400 lg:px-4 lg:py-2"
          aria-label={`View more about ${service.heading}`}
        >
          Buy Now
        </Link>
      </div>
    </div>
  );
}

export default OurServicesCard;
