'use client';

import { octaSpace } from '@/config/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, createConfig, WagmiProvider } from 'wagmi';
import { walletConnect } from 'wagmi/connectors';

const projectId = '5f8ccd61aa262f2019367d2406df4124';

export const config = createConfig({
  ssr: true,
  chains: [octaSpace],
  connectors: [
    walletConnect({
      projectId,
      metadata: {
        icons: ['/coin-token-logo/octa-logo.png'],
        name: 'OctaSwap',
        description: 'The #1 Full-fledged AMM with Staking and Farming',
        url: 'https://octaswap.io',
      },
    }),
  ],
  transports: {
    [octaSpace.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function Wagmi({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config} initialState={config.state}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
