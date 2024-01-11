'use client';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import Image from 'next/image';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import useSWR from 'swr';
import { Progress } from './ui/progress';

const PRICE_ENDPOINT = 'https://api.octa.space/v1/network';
const fetcher = (url: string) => fetch(url).then((r) => r.json());

function SaleButton() {
  return (
    <Button className='w-full' size='lg'>
      <span className='font-bold'>Purchase OCS</span>
    </Button>
  );
}

function SaleInput({
  enableBonus,
  burnAmounts,
  onBurnAmountsChange,
  purchaseAmounts,
  onPurchaseAmountsChange,
}: {
  enableBonus: boolean;
  burnAmounts: string;
  onBurnAmountsChange: Dispatch<SetStateAction<string>>;
  purchaseAmounts: string;
  onPurchaseAmountsChange: Dispatch<SetStateAction<string>>;
}) {
  const value = enableBonus ? 'lbc' : 'octa';
  const placeholder = enableBonus ? 'Burn amounts' : 'Purchase amounts';
  const amounts = enableBonus ? burnAmounts : purchaseAmounts;
  const onChange = enableBonus ? onBurnAmountsChange : onPurchaseAmountsChange;

  return (
    <div className='mt-5 mb-3 relative inline-block w-full'>
      <Input type='text' placeholder={placeholder} value={amounts} onChange={(e) => onChange(e.target.value)} />

      <Image
        src={`/coin-token-logo/${value}-logo.png`}
        alt={`${value.toUpperCase()} Logo`}
        width={25}
        height={25}
        className='absolute top-1/2 right-2 transform -translate-y-1/2'
      />
    </div>
  );
}

function EnableBonus({
  id,
  label,
  enableBonus,
  onCheckEnableBonus,
  onClearInput,
}: {
  id: string;
  label: string;
  enableBonus: boolean;
  onCheckEnableBonus: Dispatch<SetStateAction<boolean>>;
  onClearInput: () => void;
}) {
  const isEligible = true;

  return (
    <div className='flex items-center gap-x-2 mt-5'>
      <Switch id={id} checked={enableBonus} onCheckedChange={onCheckEnableBonus} onClick={onClearInput} disabled={!isEligible} />
      <Label htmlFor={id}>{label}</Label>
      {isEligible ? <Badge>Eligible</Badge> : <Badge variant='destructive'>Not Eligible</Badge>}
    </div>
  );
}

function SaleProgress() {
  return (
    <div className='space-y-1'>
      <div className='flex items-center justify-between text-sm'>
        <p>
          Sold <span className='tabular-nums'>50</span>%
        </p>
        <p>
          <span className='tabular-nums'>30.000.000</span> OCS
        </p>
      </div>
      <Progress value={50} max={100} />
    </div>
  );
}

function SaleDetails({ price }: { price: any }) {
  const rate = 0.0049;

  const oneUsdInOcta = price?.market_price ? rate / price?.market_price : 0;
  const twentyUsdInOcta = price?.market_price ? 20 / price?.market_price : 0;
  const oneThousandUsdInOcta = price?.market_price ? 1000 / price?.market_price : 0;

  return (
    <ul className='list-disc list-inside space-y-1 text-sm mt-5 font'>
      <li>
        Min Purchase : <span className='tabular-nums'>{twentyUsdInOcta.toFixed(0).toString()}</span> OCTA
      </li>
      <li>
        Max Purchase : <span className='tabular-nums'>{oneThousandUsdInOcta.toFixed(0).toString()}</span> OCTA
      </li>
      <li>
        Rate : <span className='tabular-nums'>{oneUsdInOcta.toFixed(5).toString()}</span> OCTA = 1 OCS
      </li>
    </ul>
  );
}

export default function Sale({ title, description }: { title: string; description: string }) {
  const [enableBonus, setEnableBonus] = useState(false);
  const [burnAmounts, setBurnAmounts] = useState('');
  const [purchaseAmounts, setPurchaseAmounts] = useState('');

  const { data } = useSWR(PRICE_ENDPOINT, fetcher, { refreshInterval: 1000 });

  const handleClearInput = () => {
    setBurnAmounts('');
    setPurchaseAmounts('');
  };

  return (
    <Card>
      <CardHeader>
        <div className='space-y-3'>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <SaleProgress />
        <SaleDetails price={data} />
        <EnableBonus
          id='ocsBonus'
          label='OCS Bonus Multiplier'
          enableBonus={enableBonus}
          onCheckEnableBonus={setEnableBonus}
          onClearInput={handleClearInput}
        />
        <SaleInput
          enableBonus={enableBonus}
          burnAmounts={burnAmounts}
          onBurnAmountsChange={setBurnAmounts}
          purchaseAmounts={purchaseAmounts}
          onPurchaseAmountsChange={setPurchaseAmounts}
        />
        <SaleButton />
      </CardContent>
    </Card>
  );
}
