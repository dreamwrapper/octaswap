'use client';

import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dispatch, SetStateAction, useState } from 'react';
import { Switch } from './ui/switch';

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
  const isEligible = true;

  return (
    <div className='flex items-center gap-x-2'>
      <Switch id={id} checked={enableFreeClaim} onCheckedChange={onCheckFreeClaim} disabled={!isEligible} />
      <Label htmlFor={id}>{label}</Label>
      {isEligible ? <Badge>Eligible</Badge> : <Badge variant='destructive'>Not Eligible</Badge>}
    </div>
  );
}

function ClaimInfo() {
  return (
    <ul className='list-disc list-inside space-y-1 mt-5'>
      <li>Vested : 0 OCS</li>
      <li>Total Claimed : 0 OCS</li>
      <li>Claimable Tokens : 0 OCS</li>
    </ul>
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
