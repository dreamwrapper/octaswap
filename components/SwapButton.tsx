import { useAccount } from 'wagmi';
import { Button } from './ui/button';

export default function SwapButton({
  inputToken,
  outputToken,
  text,
}: {
  inputToken: string;
  outputToken: string;
  text: string;
}) {
  const { isConnected, isDisconnected } = useAccount();

  return (
    <Button
      className='w-full rounded-[0.9rem] py-7'
      disabled={isDisconnected || !inputToken || !outputToken}
    >
      <span className='text-xl font-bold'>
        {isDisconnected && 'Not connected'}
        {isConnected && inputToken && outputToken && text}
        {isConnected && (!inputToken || !outputToken) && 'Select token'}
      </span>
    </Button>
  );
}
