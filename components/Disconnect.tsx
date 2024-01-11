import { useAccount, useDisconnect } from 'wagmi';
import { Button } from './ui/button';

export default function Disconnect() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const formattedAddress = address?.slice(0, 4) + '...' + address?.slice(-4);

  return (
    <Button size='sm' onClick={() => disconnect()}>
      <span className='font-bold'>{formattedAddress}</span>
    </Button>
  );
}
