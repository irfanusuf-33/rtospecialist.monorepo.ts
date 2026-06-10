import { StaticImageData } from 'next/image';
import Image from 'next/image';

interface RtoStepImgProps {
  image: StaticImageData;
}

export default function RtoStepImg({ image }: RtoStepImgProps) {
  return (
    <Image
      src={image.src}
      loading="lazy"
      className="block h-full overflow-hidden rounded-2xl object-cover shadow-[rgba(0,0,0,0.24)_0px_3px_8px]"
      alt="RTO Registration Image"
      height={1575}
      width={700}
    />
  );
}
