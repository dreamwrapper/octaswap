'use client';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dispatch, SetStateAction, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import Image from 'next/image';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Config, useAccount, useReadContract, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { SALE_ABI, SALE_ADDRESS, saleContractConfig } from '@/config/sale-contract';
import { lbcContractConfig } from '@/config/lbc-contract';
import { WriteContractMutate } from 'wagmi/query';
import { parseEther } from 'viem';

const DECIMALS_N = 10n ** 18n;

function SaleButton({ enableBonus, burnAmounts, purchaseAmounts }: { enableBonus: boolean; burnAmounts: string; purchaseAmounts: string }) {
  const lbcBurnAmount = parseEther(burnAmounts, 'wei');
  const octaPurchaseAmount = parseEther(purchaseAmounts, 'wei');

  const { address } = useAccount();
  const formattedAddress = address as `0x${string}`;

  const isMinPurchase = enableBonus ? (Number(burnAmounts) < 1 ? true : false) : Number(purchaseAmounts) < 1 ? true : false;

  const { data: lbcAllowance } = useReadContract({
    ...lbcContractConfig,
    functionName: 'allowance',
    args: [formattedAddress, SALE_ADDRESS],
    query: {
      enabled: enableBonus,
      refetchInterval: 1000,
    },
  });

  const { data: hash, writeContract, isPending } = useWriteContract();

  const { isLoading } = useWaitForTransactionReceipt({ hash });

  const handleOctaPurchase = () => {
    writeContract({
      abi: SALE_ABI,
      address: SALE_ADDRESS,
      functionName: 'buyTokens',
      args: [formattedAddress],
      value: octaPurchaseAmount,
    });
  };

  const handleLbcApprove = () => {
    writeContract({
      ...lbcContractConfig,
      functionName: 'approve',
      args: [SALE_ADDRESS, lbcBurnAmount],
    });
  };

  const handleLbcPurchase = () => {
    writeContract({
      abi: SALE_ABI,
      address: SALE_ADDRESS,
      functionName: 'buyTokensWithLbc',
      args: [formattedAddress, lbcBurnAmount],
    });
  };

  return (
    <Button
      className='w-full'
      size='lg'
      disabled={isMinPurchase || isPending || isLoading}
      onClick={enableBonus ? handleLbcPurchase : handleOctaPurchase}
    >
      <span className='font-bold'>{isPending || isLoading ? 'Loading...' : 'Purchase OCS'}</span>
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
  const placeholder = enableBonus ? 'Burn amount' : 'Purchase amount';
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
}: {
  id: string;
  label: string;
  enableBonus: boolean;
  onCheckEnableBonus: Dispatch<SetStateAction<boolean>>;
}) {
  const isEligible = true;

  return (
    <div className='flex items-center gap-x-2 mt-5'>
      <Switch id={id} checked={enableBonus} onCheckedChange={onCheckEnableBonus} disabled={!isEligible} />
      <Label htmlFor={id}>{label}</Label>
      {isEligible ? <Badge>Eligible</Badge> : <Badge variant='destructive'>Not Eligible</Badge>}
    </div>
  );
}

function SaleProgress() {
  const { data: sold } = useReadContract({ ...saleContractConfig, functionName: 'ocsSold', query: { refetchInterval: 1000 } });

  const ocsSold = Number(sold ? sold / DECIMALS_N : 0n);
  const PERCENT = 100;
  const SALE_ALLOCATION = 30000000;
  const progress = (ocsSold / SALE_ALLOCATION) * PERCENT;

  return (
    <div className='space-y-1'>
      <div className='flex items-center justify-between text-sm'>
        <p>
          Sold <span className='tabular-nums'> {progress.toFixed(1)} </span>%
        </p>
        <p>
          <span className='tabular-nums'>30.000.000</span> OCS
        </p>
      </div>
      <Progress value={progress} max={100} />
    </div>
  );
}

function SaleDetails() {
  const { data } = useReadContracts({
    contracts: [
      {
        ...saleContractConfig,
        functionName: 'lbcRaised',
      },
      {
        ...saleContractConfig,
        functionName: 'octaRaised',
      },
    ],
    query: {
      refetchInterval: 1000,
    },
  });

  const [lbcRaised, octaRaised] = data || [];

  const formattedLbcRaised = Number(lbcRaised?.result ? lbcRaised.result / DECIMALS_N : 0n);
  const formattedOctaRaised = Number(octaRaised?.result ? octaRaised.result / DECIMALS_N : 0n);

  return (
    <ul className='list-disc list-inside space-y-1 mt-5'>
      <li>Raised OCTA : {formattedOctaRaised} </li>
      <li>Burned LBC : {formattedLbcRaised} </li>
      <li>Min Purchase : 28 OCTA</li>
      <li>Max Purchase : 1388 OCTA</li>
      <li>Rate : 0.0068 OCTA = 1 OCS</li>
    </ul>
  );
}

export default function Sale({ title, description }: { title: string; description: string }) {
  const [enableBonus, setEnableBonus] = useState(false);
  const [burnAmounts, setBurnAmounts] = useState('');
  const [purchaseAmounts, setPurchaseAmounts] = useState('');

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
        <SaleDetails />
        <EnableBonus id='ocsBonus' label='Burn LBC for OCS' enableBonus={enableBonus} onCheckEnableBonus={setEnableBonus} />
        <SaleInput
          enableBonus={enableBonus}
          burnAmounts={burnAmounts}
          onBurnAmountsChange={setBurnAmounts}
          purchaseAmounts={purchaseAmounts}
          onPurchaseAmountsChange={setPurchaseAmounts}
        />
        <SaleButton enableBonus={enableBonus} burnAmounts={burnAmounts} purchaseAmounts={purchaseAmounts} />
      </CardContent>
    </Card>
  );
}
