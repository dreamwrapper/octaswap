import { useConnect } from 'wagmi';
import { Button } from './ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ComponentPropsWithRef, forwardRef } from 'react';

function Connectors() {
  const { connectors, connect } = useConnect();

  return connectors.map((connector) => (
    <Button variant='outline' key={connector.uid} onClick={() => connect({ connector })}>
      {/* <Image src={connector.icon as string} alt={`${connector.name} Icon`} width={20} height={20} /> */}
      {connector.name}
    </Button>
  ));
}

function Wrapper({
  title = 'Connect Wallet',
  description = 'Choose your prefered options below',
}: {
  title?: string;
  description?: string;
}) {
  const isDesktop = useMediaQuery({ query: '(min-width: 640px)' });

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <ConnectButton />
        </DialogTrigger>
        <DialogContent className='max-w-[95%] sm:max-w-[70%] md:max-w-[460.8px]'>
          <DialogHeader className='text-left'>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className='grid px-5 gap-y-3'>
            <Connectors />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <ConnectButton />
      </DrawerTrigger>
      <DrawerContent>
        <div className='px-2 py-5'>
          <DrawerHeader className='text-left'>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className='grid px-5 gap-y-3'>
            <Connectors />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

const ConnectButton = forwardRef<HTMLButtonElement, ComponentPropsWithRef<'button'>>(function ConnectButton({ ...props }, ref) {
  return (
    <Button size='sm' {...props} ref={ref}>
      <span className='font-bold'>Connect</span>
    </Button>
  );
});

export default function Connect() {
  return <Wrapper />;
}
