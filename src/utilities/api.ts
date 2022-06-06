import { IGetMarketsResponse } from 'clients/api/queries/getMarkets';
import { restService } from './restService';

export const fetchMarkets = async () =>
  restService<IGetMarketsResponse>({
    endpoint: '/markets/fnr/kcc',
    method: 'GET',
  });
