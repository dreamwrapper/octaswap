'use client';

import { ChevronDown, HelpCircle, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useMediaQuery } from 'react-responsive';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { Input } from './ui/input';
import { Label } from './ui/label';

const togglerItems = [
  {
    value: 'auto',
    text: 'Auto',
  },
  {
    value: 'custom',
    text: 'Custom',
  },
];

type TogglerItems = typeof togglerItems;

function SettingInput({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <>
      <Label className='absolute right-4'>{label}</Label>
      <Input
        type='text'
        className='rounded-[0.7rem]'
        placeholder={placeholder}
      />
    </>
  );
}

function SettingTogglerItem({ value, text }: { value: string; text: string }) {
  return (
    <ToggleGroupItem
      value={value}
      className='rounded-[1rem] hover:bg-background'
    >
      {text}
    </ToggleGroupItem>
  );
}

function SettingToggler({
  type,
  defaultValue,
  togglerItems,
}: {
  type: any;
  defaultValue: string;
  togglerItems: TogglerItems;
}) {
  return (
    <ToggleGroup
      type={type}
      className='border rounded-[1rem]'
      defaultValue={defaultValue}
    >
      {togglerItems.map((item) => (
        <SettingTogglerItem
          key={item.value}
          value={item.value}
          text={item.text}
        />
      ))}
    </ToggleGroup>
  );
}

function SettingTrigger({ text, value }: { text: string; value: string }) {
  return (
    <AccordionTrigger className='!no-underline'>
      <span className='text-muted-foreground'>{text}</span>
      <span className='ml-auto mr-2 capitalize'>{value}</span>
    </AccordionTrigger>
  );
}

function Setting({
  value,
  triggerText,
  triggerValue,
  className,
  children,
}: {
  value: string;
  triggerText: string;
  triggerValue: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <AccordionItem value={value} className={className}>
      <SettingTrigger text={triggerText} value={triggerValue} />
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  );
}

export default function SettingButton() {
  const isDesktop = useMediaQuery({ query: '(min-width: 640px)' });

  if (isDesktop) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='ghost' size='icon'>
            <Settings size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='rounded-[1rem]' align='end' alignOffset={-4}>
          <Accordion type='multiple'>
            <Setting
              value='slippage'
              triggerText='Max. slippage'
              triggerValue='auto'
            >
              <div className='flex items-center gap-x-3 mt-2 px-1 relative'>
                <SettingToggler
                  type='single'
                  defaultValue='auto'
                  togglerItems={togglerItems}
                />
                <SettingInput label='%' placeholder='0.5' />
              </div>
            </Setting>
            <Setting
              value='deadline'
              triggerText='Transaction deadline'
              triggerValue='10m'
              className='border-none'
            >
              <div className='mt-2 px-1 relative flex items-center'>
                <SettingInput label='minutes' placeholder='10' />
              </div>
            </Setting>
          </Accordion>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant='ghost' size='icon'>
          <Settings size={20} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <Accordion type='multiple'>
          <Setting
            value='slippage'
            triggerText='Max. slippage'
            triggerValue='auto'
            className='px-4'
          >
            <div className='flex items-center gap-x-3 mt-2 px-1 relative'>
              <SettingToggler
                type='single'
                defaultValue='auto'
                togglerItems={togglerItems}
              />
              <SettingInput label='%' placeholder='0.5' />
            </div>
          </Setting>
          <Setting
            value='deadline'
            triggerText='Transaction deadline'
            triggerValue='10m'
            className='px-4'
          >
            <div className='mt-2 px-1 relative flex items-center'>
              <SettingInput label='minutes' placeholder='10' />
            </div>
          </Setting>
        </Accordion>
      </DrawerContent>
    </Drawer>
  );
}
