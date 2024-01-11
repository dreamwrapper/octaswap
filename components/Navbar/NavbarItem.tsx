import { LinkItem } from '@/assets/data/navbar-links';
import { NavigationMenuItem } from '../ui/navigation-menu';
import NavbarLink from './NavbarLink';

export default function NavbarItem({ href, text }: LinkItem) {
  return (
    <NavigationMenuItem>
      <NavbarLink href={href} text={text} />
    </NavigationMenuItem>
  );
}
