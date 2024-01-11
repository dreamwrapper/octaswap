import { DEFAULT_LIST } from '@/assets/token-list/token-list';
import { Token } from '@uniswap/sdk-core';

export function initializeToken(initToken?: string) {
  const copyTokenList = [...DEFAULT_LIST];

  const [result] = copyTokenList.filter((token) => (token.symbol === initToken ? initToken : 'OCTA'));

  const token = new Token(result.chainId, result.address, result.decimals, result.symbol, result.name);

  return token;
}
