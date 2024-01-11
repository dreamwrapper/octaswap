import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
  href: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
};

export default function Logo({
  href,
  src,
  alt,
  width,
  height,
  children,
}: LogoProps & { children?: React.ReactNode }) {
  return (
    <Link href={href}>
      {src && alt && (
        <Image src={src} alt={alt} width={width} height={height} />
      )}
      {children}
    </Link>
  );
}
