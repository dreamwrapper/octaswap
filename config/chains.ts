import { Chain } from 'wagmi/chains';

export const octaSpace = {
  id: 800001,
  name: 'Octa Space',
  nativeCurrency: {
    decimals: 18,
    name: 'Octa Space',
    symbol: 'OCTA',
  },
  rpcUrls: {
    public: { http: ['https://rpc.octa.space/'] },
    default: { http: ['https://rpc.octa.space/'] },
  },
  blockExplorers: {
    default: { name: 'BlockScout', url: 'https://explorer.octa.space/' },
  },
  testnet: false,
} as const satisfies Chain;

export const octaTestnet = {
  id: 800002,
  name: 'Octa Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Octa Testnet',
    symbol: 'OCTA',
  },
  rpcUrls: {
    public: { http: ['https://testnet-rpc.octa.space/'] },
    default: { http: ['https://testnet-rpc.octa.space/'] },
  },
  blockExplorers: {
    default: {
      name: 'BlockScout',
      url: 'https://testnet-explorer.octa.space/',
    },
  },
  testnet: true,
} as const satisfies Chain;
