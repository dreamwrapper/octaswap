import { Links } from '@/assets/data/navbar-links';
import { NavigationMenu, NavigationMenuList } from '../ui/navigation-menu';
import NavbarItem from './NavbarItem';

export default function NavbarMenu({
  links,
  className,
  orientation = 'horizontal',
}: {
  links: Links;
  className?: string;
  orientation?: 'vertical' | 'horizontal';
}) {
  return (
    <NavigationMenu className={className} orientation={orientation}>
      <NavigationMenuList className='flex items-center gap-x-3'>
        {links.map((link) => (
          <NavbarItem key={link.text} href={link.href} text={link.text} />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
