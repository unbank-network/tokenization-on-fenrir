import { TokenId, VTokenId } from 'types';
import { Bep20, VaiToken, XvsToken, VrtToken, VBep20, VBnbToken } from 'types/contracts';

export type TokenContract<T extends TokenId> = T extends 'xvs'
  ? XvsToken
  : Bep20;

export type VTokenContract<T extends VTokenId> = T extends 'bnb' ? VBnbToken : VBep20;
