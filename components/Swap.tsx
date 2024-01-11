'use client';

import { useMediaQuery } from 'react-responsive';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Drawer, DrawerTrigger } from './ui/drawer';
import { Button } from './ui/button';
import { Dialog, DialogTrigger } from './ui/dialog';
import { ComponentPropsWithRef, forwardRef, useState } from 'react';
import { Token } from '@uniswap/sdk-core';
import { initializeToken } from '@/lib/initializeToken';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { DEFAULT_LIST } from '@/assets/token-list/token-list';
import Image from 'next/image';

function SwapButton() {
  return (
    <Button className='rounded-[0.8rem] w-full py-7'>
      <span className='font-bold text-xl'>Swap</span>
    </Button>
  );
}

function SwitchTokenPlace() {
  return (
    <Button
      variant='outline'
      size='icon'
      className='rounded-[0.8rem] absolute inset-x-1/2 transform -translate-x-1/2 -translate-y-1/2 inset-y-[38.5%] border-4 dark:bg-slate-900 bg-slate-100 border-background'
    >
      <ArrowUpDown />
    </Button>
  );
}

function PriceAndBalance() {
  return (
    <div className='text-muted-foreground flex justify-between text-sm'>
      <span className='pl-3 invisible'>$1000</span>
      <span className='pr-1'>Balance: 0</span>
    </div>
  );
}

function TokenSelect({ tokenSymbol }: { tokenSymbol: string | undefined }) {
  const copyTokenList = [...DEFAULT_LIST];
  const [token] = copyTokenList.filter((token) => token.symbol === tokenSymbol);

  const isDesktop = useMediaQuery({ query: '(min-width: 640px)' });

  const TriggerButton = forwardRef<HTMLButtonElement, ComponentPropsWithRef<'button'>>(function TriggerButton(
    { className, children, ...props },
    ref
  ) {
    return (
      <Button variant='outline' size='sm' ref={ref} {...props} className={className}>
        {children}
      </Button>
    );
  });

  const showToken = tokenSymbol ? (
    <TriggerButton>
      <Image src={token.logoURI as string} alt={`${token.name} Logo`} width={25} height={25} priority />
      <span className='text-lg'>{token.symbol}</span>
      <ChevronDown size={22} />
    </TriggerButton>
  ) : (
    <TriggerButton>
      <span className='text-lg'>Select token</span>
      <ChevronDown size={22} />
    </TriggerButton>
  );

  if (!isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>{showToken}</DialogTrigger>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>{showToken}</DrawerTrigger>
    </Drawer>
  );
}

function SwapBox({ labelText, tokenSymbol }: { labelText: string; tokenSymbol: string | undefined }) {
  return (
    <div className='rounded-lg p-3 dark:bg-slate-900 bg-slate-100'>
      <Label className='pl-3 text-muted-foreground'>{labelText}</Label>
      <div className='flex items-center justify-between mt-1 mb-2'>
        <Input
          type='text'
          placeholder='0'
          className='border-none bg-transparent focus-visible:ring-offset-0 placeholder-shown:text-3xl text-3xl focus-visible:ring-0'
        />
        <TokenSelect tokenSymbol={tokenSymbol} />
      </div>
      <PriceAndBalance />
    </div>
  );
}

export default function Swap() {
  const [inputToken, setInputToken] = useState<Token>(initializeToken);
  const [outputToken, setOutputToken] = useState<Token>();

  return (
    <div className='space-y-1 relative'>
      <SwapBox labelText='From' tokenSymbol={inputToken.symbol} />
      <SwitchTokenPlace />
      <SwapBox labelText='To' tokenSymbol={outputToken?.symbol} />
      <SwapButton />
    </div>
  );
}
