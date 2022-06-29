import { useMemo } from 'react';

import { TokenId, VTokenId } from 'types';
import { getWeb3NoAccount, useWeb3 } from 'clients/web3';
import Web3 from 'web3';
import {
  getComptrollerContract,
  getInterestModelContract,
  getPriceOracleContract,
  getTokenContract,
  getVaiUnitrollerContract,
  getVaiVaultContract,
  getVTokenContract,
  getVenusLensContract,
  getXvsVaultProxyContract,
  getXvsVaultContract,
  getTokenContractByAddress,
  getGovernorBravoDelegateContract,
  getVrtConverterProxyContract,
  getXvsVestingProxyContract,
  getVrtVaultProxyContract,
  getFBepWbnbFnrContract,
} from './getters';

export const useTokenContract = <T extends TokenId>(name: T) => {
  const web3 = useWeb3();
  return useMemo(() => getTokenContract<T>(name, web3), [web3, name]);
};

export const useTokenContractByAddress = (address: string) => {
  const web3 = useWeb3();
  return useMemo(() => getTokenContractByAddress(address, web3), [web3, address]);
};

export const useVTokenContract = <T extends VTokenId>(name: T) => {
  const web3 = useWeb3();
  return useMemo(() => getVTokenContract<T>(name, web3), [web3, name]);
};

export const useVaiUnitrollerContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getVaiUnitrollerContract(web3), [web3]);
};

export const useVaiVaultContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getVaiVaultContract(web3), [web3]);
};

export const useComptrollerContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getComptrollerContract(web3), [web3]);
};

export const usePriceOracleContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getPriceOracleContract(web3), [web3]);
};

export const useInterestModelContract = (address: string) => {
  const web3 = useWeb3();
  return useMemo(() => getInterestModelContract(address, web3), [web3]);
};

export const useVenusLensContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getVenusLensContract(web3), [web3]);
};

export const useXvsVaultContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getXvsVaultContract(web3), [web3]);
};

export const useXvsVaultProxyContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getXvsVaultProxyContract(web3), [web3]);
};

export const useGovernorBravoDelegateContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getGovernorBravoDelegateContract(web3), [web3]);
};

// VRT conversion
export const useVrtConverterProxyContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getVrtConverterProxyContract(web3), [web3]);
};

export const useXvsVestingProxyContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getXvsVestingProxyContract(web3), [web3]);
};

export const useVrtVaultProxyContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getVrtVaultProxyContract(web3), [web3]);
};

export const useFBepWbnbFnrContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getFBepWbnbFnrContract(web3), [web3]);
};

//

// export const useNewComptrollerContract = (address: string) => {
//   const web3 = useWeb3();
//   return useMemo(() => getNewComptrollerContract(address, web3), [web3]);
// };

export const useContractDirectly = <T>(abi: any, address: string, web3Instance: Web3) => {
  const web3 = web3Instance ?? getWeb3NoAccount();
  return new web3.eth.Contract(abi, address) as unknown as T;
};

// export const useWeb3Contract = (address: string) => {
//   const web3 = useWeb3();
//   return useMemo(() => getWeb3Contract(web3, address), [web3, address]);
// };
