import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { NavigationMenuLink } from '../ui/navigation-menu';
import { cn } from '@/lib/utils';
import { LinkItem } from '@/assets/data/navbar-links';

export default function NavbarLink({ href, text }: LinkItem) {
  const pathname = usePathname();

  return (
    <NextLink href={href} legacyBehavior passHref>
      <NavigationMenuLink active={href === pathname}>
        <span className={cn('text-lg font-medium', href !== pathname && 'text-muted-foreground')}>{text}</span>
      </NavigationMenuLink>
    </NextLink>
  );
}
