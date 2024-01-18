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
import { lbcMainnetContractConfig } from '@/config/lbc-mainnet-contract';
import { WriteContractMutate } from 'wagmi/query';
import { parseEther } from 'viem';

export const DECIMALS_N = 10n ** 18n;

function SaleButton({
  enableBonus,
  burnAmounts,
  onBurn,
  purchaseAmounts,
  onPurchase,
}: {
  enableBonus: boolean;
  burnAmounts: string;
  onBurn: Dispatch<SetStateAction<string>>;
  purchaseAmounts: string;
  onPurchase: Dispatch<SetStateAction<string>>;
}) {
  const SNAPSHOT_ID = 1n;

  const lbcBurnAmount = parseEther(burnAmounts, 'wei');
  const octaPurchaseAmount = parseEther(purchaseAmounts, 'wei');

  const { address } = useAccount();
  const formattedAddress = address as `0x${string}`;

  const isMinPurchase = enableBonus ? Number(burnAmounts) < 1 : Number(purchaseAmounts) < 1;

  const { data: isSaleOpen } = useReadContract({
    ...saleContractConfig,
    functionName: 'isOpen',
  });

  const { data: snapshotData } = useReadContract({
    ...lbcMainnetContractConfig,
    functionName: 'balanceOfAt',
    args: [address as `0x${string}`, SNAPSHOT_ID],
  });

  const { data: burnLimit } = useReadContracts({
    contracts: [
      {
        ...saleContractConfig,
        functionName: 'LBC_MAX_PURCHASE',
      },
      {
        ...saleContractConfig,
        functionName: 'lbcContributions',
        args: [formattedAddress],
      },
    ],
  });

  const [LBC_MAX_PURCHASE, lbcContributions] = burnLimit || [];

  const snapshotBalance = snapshotData ?? 0n;
  const lbcMaxPurchase = LBC_MAX_PURCHASE?.result ?? 0n;
  const currentLbcContributions = lbcContributions?.result ?? 0n;

  const lbcMaxBurn = Number(snapshotBalance > lbcMaxPurchase ? lbcMaxPurchase / DECIMALS_N : snapshotBalance / DECIMALS_N);

  const isLbcContributionsMax =
    snapshotBalance > lbcMaxPurchase ? currentLbcContributions === lbcMaxPurchase : currentLbcContributions === snapshotBalance;

  const { data: lbcAllowance } = useReadContract({
    ...lbcContractConfig,
    functionName: 'allowance',
    args: [formattedAddress, SALE_ADDRESS],
    query: {
      enabled: enableBonus,
      refetchInterval: 1000,
    },
  });

  const isLbcAllowance = (lbcAllowance as bigint) < lbcBurnAmount;
  const isMaxPurchase = enableBonus ? Number(burnAmounts) > lbcMaxBurn : Number(purchaseAmounts) > 1388;

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading } = useWaitForTransactionReceipt({ hash });

  const handleOctaPurchase = () => {
    writeContract(
      {
        abi: SALE_ABI,
        address: SALE_ADDRESS,
        functionName: 'buyTokens',
        args: [formattedAddress],
        value: octaPurchaseAmount,
      },
      { onSuccess: () => onPurchase('') }
    );
  };

  const handleLbcApprove = () => {
    writeContract({
      ...lbcContractConfig,
      functionName: 'approve',
      args: [SALE_ADDRESS, lbcBurnAmount],
    });
  };

  const handleLbcPurchase = () => {
    writeContract(
      {
        abi: SALE_ABI,
        address: SALE_ADDRESS,
        functionName: 'buyTokensWithLbc',
        args: [formattedAddress, lbcBurnAmount],
      },
      { onSuccess: () => onBurn(''), onError: (err) => console.log(err) }
    );
  };

  return enableBonus ? (
    <Button
      className='w-full'
      size='lg'
      disabled={isMinPurchase || isMaxPurchase || isPending || isLoading || isLbcContributionsMax || !isSaleOpen}
      onClick={isLbcAllowance ? handleLbcApprove : handleLbcPurchase}
    >
      {isLbcAllowance ? 'Approve' : isLbcContributionsMax ? 'MAX BURN REACHED' : 'Burn LBC'}
    </Button>
  ) : (
    <Button
      className='w-full'
      size='lg'
      disabled={isMinPurchase || isMaxPurchase || isPending || isLoading || !isSaleOpen}
      onClick={enableBonus ? handleLbcPurchase : handleOctaPurchase}
    >
      <span className='font-bold'>{isSaleOpen ? 'Purchase OCS' : 'SALE NOT OPEN'}</span>
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
  const SNAPSHOT_ID = 1n;

  const value = enableBonus ? 'lbc' : 'octa';
  const placeholder = enableBonus ? 'Burn amount' : 'Purchase amount';
  const amounts = enableBonus ? burnAmounts : purchaseAmounts;
  const onChange = enableBonus ? onBurnAmountsChange : onPurchaseAmountsChange;

  const { address } = useAccount();
  const formattedAddress = address as `0x${string}`;

  const { data: isSaleOpen } = useReadContract({
    ...saleContractConfig,
    functionName: 'isOpen',
  });

  const { data: burnLimit } = useReadContracts({
    contracts: [
      {
        ...saleContractConfig,
        functionName: 'LBC_MAX_PURCHASE',
      },
      {
        ...saleContractConfig,
        functionName: 'lbcContributions',
        args: [formattedAddress],
      },
    ],
  });

  const { data: snapshotData } = useReadContract({
    ...lbcMainnetContractConfig,
    functionName: 'balanceOfAt',
    args: [address as `0x${string}`, SNAPSHOT_ID],
  });

  const [LBC_MAX_PURCHASE, lbcContributions] = burnLimit || [];

  const snapshotBalance = snapshotData ?? 0n;
  const lbcMaxPurchase = LBC_MAX_PURCHASE?.result ?? 0n;
  const currentLbcContributions = lbcContributions?.result ?? 0n;

  const isLbcContributionsMax =
    snapshotBalance > lbcMaxPurchase ? currentLbcContributions === lbcMaxPurchase : currentLbcContributions === snapshotBalance;

  return (
    <div className='mt-5 mb-3 relative inline-block w-full'>
      <Input
        type='text'
        placeholder={placeholder}
        value={amounts}
        onChange={(e) => {
          if (!Number(e.target.value)) {
            return;
          }

          onChange(e.target.value);
        }}
        disabled={(enableBonus && isLbcContributionsMax) || !isSaleOpen}
      />

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
  const SNAPSHOT_ID = 1n;

  const { address } = useAccount();

  const { data: isSaleOpen } = useReadContract({
    ...saleContractConfig,
    functionName: 'isOpen',
  });

  const { data: snapshotData } = useReadContract({
    ...lbcMainnetContractConfig,
    functionName: 'balanceOfAt',
    args: [address as `0x${string}`, SNAPSHOT_ID],
  });

  const { data: burnLimit } = useReadContracts({
    contracts: [
      {
        ...saleContractConfig,
        functionName: 'LBC_MAX_PURCHASE',
      },
      {
        ...saleContractConfig,
        functionName: 'lbcContributions',
        args: [address as `0x${string}`],
      },
    ],
  });

  const [LBC_MAX_PURCHASE, lbcContributions] = burnLimit || [];

  const snapshotBalance = snapshotData ?? 0n;
  const lbcMaxPurchase = LBC_MAX_PURCHASE?.result ?? 0n;
  const currentLbcContributions = lbcContributions?.result ?? 0n;

  const isEligible = snapshotData ? snapshotData > parseEther('750000') : false;
  const isLbcContributionsMax =
    snapshotBalance > lbcMaxPurchase ? currentLbcContributions === lbcMaxPurchase : currentLbcContributions === snapshotBalance;

  return (
    <div className='flex items-center gap-x-2 mt-5'>
      <Switch
        id={id}
        checked={enableBonus}
        onCheckedChange={onCheckEnableBonus}
        disabled={!isEligible || isLbcContributionsMax || !isSaleOpen}
      />
      <Label htmlFor={id}>{label}</Label>
      {isEligible ? (
        isLbcContributionsMax ? (
          <Badge variant='destructive'>LIMIT REACHED</Badge>
        ) : (
          <Badge>Eligible</Badge>
        )
      ) : (
        <Badge variant='destructive'>Not Eligible</Badge>
      )}
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

  const SNAPSHOT_ID = 1n;

  const { address } = useAccount();

  const { data: snapshotData } = useReadContract({
    ...lbcMainnetContractConfig,
    functionName: 'balanceOfAt',
    args: [address as `0x${string}`, SNAPSHOT_ID],
  });

  const { data: burnLimit } = useReadContract({
    ...saleContractConfig,
    functionName: 'LBC_MAX_PURCHASE',
  });

  const snapshotBalance = snapshotData ?? 0n;
  const lbcMaxPurchase = burnLimit ?? 0n;

  const isEligible = snapshotData ? snapshotData > parseEther('750000') : false;
  const lbcMaxBurn = Number(snapshotBalance > lbcMaxPurchase ? lbcMaxPurchase / DECIMALS_N : snapshotBalance / DECIMALS_N);

  return (
    <ul className='list-disc list-inside space-y-1 mt-5'>
      <li>Raised OCTA : {formattedOctaRaised} </li>
      <li>Burned LBC : {formattedLbcRaised} </li>
      <li>Max Burn : {isEligible ? lbcMaxBurn : '0'} LBC</li>
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
        <SaleButton
          enableBonus={enableBonus}
          burnAmounts={burnAmounts}
          onBurn={setBurnAmounts}
          purchaseAmounts={purchaseAmounts}
          onPurchase={setPurchaseAmounts}
        />
      </CardContent>
    </Card>
  );
}
