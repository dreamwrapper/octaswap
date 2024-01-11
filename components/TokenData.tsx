// import { cn } from '@/lib/utils';
// import { useAccount, useBalance } from 'wagmi';

// function Balance({
//   balance,
//   isConnecting,
//   isDisconnected,
//   currentToken,
// }: {
//   balance: string;
//   isConnecting: boolean;
//   isDisconnected: boolean;
//   currentToken: string;
// }) {
//   return (
//     <span
//       className={cn(
//         (isConnecting || isDisconnected || !currentToken) && 'invisible'
//       )}
//     >
//       Balance: {balance ? balance : '0.00'}
//     </span>
//   );
// }

// function Price({
//   price,
//   isDisconnected,
// }: {
//   price: string;
//   isDisconnected: boolean;
// }) {
//   return <span className='invisible'>{price}</span>;
// }

// export default function TokenData({
//   currentToken,
//   currentTokenAddress,
// }: {
//   currentToken: string;
//   currentTokenAddress: string;
// }) {
//   const { isConnecting, isDisconnected, address } = useAccount();
//   const { data: balances } = useBalance({
//     address,
//     token: currentTokenAddress as `0x${string}`,
//     enabled: !!currentToken,
//   });

//   const balance = Number(balances?.formatted);
//   const formattedBalance =
//     balance % 1 !== 0 ? balance.toFixed(2) : balance.toString();

//   return (
//     <div className='text-muted-foreground mt-3 text-sm flex items-center justify-between px-2'>
//       <Price price='0' isDisconnected={isDisconnected} />
//       <Balance
//         balance={formattedBalance}
//         isConnecting={isConnecting}
//         isDisconnected={isDisconnected}
//         currentToken={currentToken}
//       />
//     </div>
//   );
// }
