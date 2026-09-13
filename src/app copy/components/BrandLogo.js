import Image from 'next/image';
import logo from '../LOGO.png';

export default function BrandLogo() {
  return (
    <Image
      src={logo}
      alt="AskMyMoon"
      className="h-10 w-auto max-w-[180px] object-contain sm:h-12 sm:max-w-[220px]"
    />
  );
}
