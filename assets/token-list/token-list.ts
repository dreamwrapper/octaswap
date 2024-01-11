import { TokenList } from '@uniswap/token-lists';

const OCS_LIST: TokenList = {
  name: 'OctaSwap Token List',
  version: {
    major: 1,
    minor: 0,
    patch: 0,
  },
  timestamp: '2024-01-02T23:47:00+00:00',
  tokens: [
    {
      chainId: 800002,
      name: 'Octa',
      symbol: 'OCTA',
      decimals: 18,
      address: '0x10E4883216CCBb90d30878598b288cBA30EC0B05',
      logoURI: '/coin-token-logo/octa-logo.png',
    },
    {
      chainId: 800002,
      name: 'Wrapped Octa',
      symbol: 'WOCTA',
      decimals: 18,
      address: '0x10E4883216CCBb90d30878598b288cBA30EC0B05',
      logoURI: '/coin-token-logo/octa-logo.png',
    },
    {
      chainId: 800002,
      name: 'Lucky Bucks',
      symbol: 'LBC',
      decimals: 18,
      address: '0x8BbD1689b34A838394702417C5D6587923C0733E',
      logoURI: '/coin-token-logo/lbc-logo.png',
    },
  ],
};

export const DEFAULT_LIST = [...OCS_LIST.tokens];
