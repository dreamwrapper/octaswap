'use client';

import Logo from '../Logo';
import ThemeToggler from '../ThemeToggler';
import NavMenu from './NavbarMenu';
import { Links, links } from '@/assets/data/navbar-links';
import Connect from '../Connect';
import { useAccount } from 'wagmi';
import Disconnect from '../Disconnect';
function Nav({ logoText, links }: { logoText: string; links: Links }) {
  const { isConnected } = useAccount();

  const swapTextIndex = logoText.search('Swap');

  return (
    <div className='p-4 flex items-center justify-between'>
      <div className='flex items-center gap-x-6'>
        <Logo href='/'>
          <span className='text-2xl font-poppins font-bold'>
            <span className='text-primary'>{logoText.slice(0, swapTextIndex)}</span>
            <span>{logoText.slice(swapTextIndex)}</span>
          </span>
        </Logo>
        <NavMenu links={links} className='hidden sm:block' />
      </div>
      <div className='flex items-center gap-x-3'>
        <ThemeToggler />
        {isConnected ? <Disconnect /> : <Connect />}
      </div>
    </div>
  );
}

export default function Navbar() {
  return <Nav logoText='OctaSwap' links={links} />;
}
