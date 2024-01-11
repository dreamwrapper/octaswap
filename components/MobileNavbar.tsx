'use client';

import { links } from '@/assets/data/navbar-links';
import NavbarMenu from './Navbar/NavbarMenu';

export default function MobileNavbar() {
  return (
    <div className='bg-background rounded-lg py-2 px-4 fixed bottom-4 w-fit left-1/2 transform -translate-x-1/2 sm:hidden border'>
      <NavbarMenu links={links} />
    </div>
  );
}
