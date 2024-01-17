'use client';

import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dispatch, SetStateAction, useState } from 'react';
import { Switch } from './ui/switch';
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { ovfContractConfig } from '@/config/ocs-vesting-factory';
import { OCS_VESTING_ABI } from '@/config/ocs-vesting';
import { OCS_ADDRESS, ocsContractConfig } from '@/config/ocs-contract';
import { DECIMALS_N } from './Sale';
import Countdown from 'react-countdown';
import { getFormattedDate } from '@/lib/getFormattedDate';
import { lbcMainnetContractConfig } from '@/config/lbc-mainnet-contract';
import { SALE_ABI, SALE_ADDRESS, saleContractConfig } from '@/config/sale-contract';
import { parseEther } from 'viem';

function ClaimButton() {
  return (
    <Button className='w-full mt-5' size='lg'>
      <span className='font-bold'>Claim OCS</span>
    </Button>
  );
}

function FreeClaim({
  id,
  label,
  enableFreeClaim,
  onCheckFreeClaim,
}: {
  id: string;
  label: string;
  enableFreeClaim: boolean;
  onCheckFreeClaim: Dispatch<SetStateAction<boolean>>;
}) {
  const SNAPSHOT_ID = 1n;

  const { address } = useAccount();

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

  const isEligible = snapshotData && lbcContributions?.result ? snapshotData > parseEther('750000') : false;

  const isLbcContributionsMax =
    snapshotData && lbcContributions?.result && LBC_MAX_PURCHASE?.result
      ? snapshotData >= LBC_MAX_PURCHASE?.result
        ? lbcContributions?.result === LBC_MAX_PURCHASE.result
          ? true
          : false
        : lbcContributions?.result === snapshotData
        ? true
        : false
      : false;

  return (
    <div className='flex items-center gap-x-2'>
      <Switch id={id} checked={enableFreeClaim} onCheckedChange={onCheckFreeClaim} disabled={!isEligible || isLbcContributionsMax} />
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

function ClaimInfo() {
  const { address } = useAccount();
  const formattedAddress = address as `0x${string}`;

  const { data: vestingContract } = useReadContract({
    ...ovfContractConfig,
    functionName: 'getBelongsTo',
    args: [formattedAddress],
  });

  console.log(vestingContract);

  const { data: vestedTokens } = useReadContract({
    ...ocsContractConfig,
    functionName: 'balanceOf',
    args: [vestingContract as `0x${string}`],
  });

  const formattedVestedTokens = Number(vestedTokens ? vestedTokens / DECIMALS_N : 0n);

  const ovContractConfig = {
    abi: OCS_VESTING_ABI,
    address: vestingContract,
  };

  const { data: vestingData } = useReadContracts({
    contracts: [
      {
        ...ovContractConfig,
        functionName: 'released',
        args: [OCS_ADDRESS],
      },
      {
        ...ovContractConfig,
        functionName: 'releasable',
        args: [OCS_ADDRESS],
      },
      {
        ...ovContractConfig,
        functionName: 'start',
      },
    ],
  });

  const [released, releasable, startTimestamp] = vestingData || [];
  const SIX_MONTHS_IN_MS = 15778476n;
  const vestingTimestamp = Number(startTimestamp?.result ? startTimestamp.result + SIX_MONTHS_IN_MS : 0n);
  const vestingDate = getFormattedDate(vestingTimestamp);

  const totalClaimed = Number(released?.result ? released.result / DECIMALS_N : 0n);
  const claimableTokens = Number(releasable?.result ? releasable.result / DECIMALS_N : 0n);

  return (
    <div className='mt-5'>
      <div>
        <ul className='list-disc list-inside space-y-1 '>
          <li>
            Locked : <span className='tabular-nums'> {formattedVestedTokens} </span> OCS
          </li>
          <li>
            Total Claimed : <span className='tabular-nums'> {totalClaimed} </span> OCS
          </li>
          <li>
            Vested Tokens : <span className='tabular-nums'> {claimableTokens} </span> OCS
          </li>
          <li>Vesting End Date : {vestingTimestamp ? vestingDate : '00:00:00:00'}</li>
        </ul>
      </div>
    </div>
  );
}

export default function Claim({ title, description }: { title: string; description: string }) {
  const [enableFreeClaim, setEnableFreeClaim] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className='space-y-3'>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <FreeClaim id='freeOcs' label='OCS Free Claim' enableFreeClaim={enableFreeClaim} onCheckFreeClaim={setEnableFreeClaim} />
        <ClaimInfo />
        <ClaimButton />
      </CardContent>
    </Card>
  );
}
