import usdc from 'assets/img/coins/usdc.png';
import usdt from 'assets/img/coins/usdt.png';
// import busd from 'assets/img/coins/busd.png';
import bnb from 'assets/img/coins/bnb.png';
import btc from 'assets/img/coins/btc.png';
import eth from 'assets/img/coins/eth.png';
import cooha from 'assets/img/coins/cooha.png';
import cooga from 'assets/img/coins/cooga.png';
import wkcs from 'assets/img/coins/kcs.png';
import mana from 'assets/img/coins/mana.png';
import mjt from 'assets/img/coins/mjt.png';
import sand from 'assets/img/coins/sand.png';
import sax from 'assets/img/coins/sax.png';
// import xwg from 'assets/img/coins/xwg.png';
// import ada from 'assets/img/coins/ada.png';
// import doge from 'assets/img/coins/doge.png';
// import matic from 'assets/img/coins/matic.png';
// import cake from 'assets/img/coins/cake.png';
// import dai from 'assets/img/coins/dai.png';
// import tusd from 'assets/img/coins/tusd.png';
// import trx from 'assets/img/coins/trx.png';
// import ust from 'assets/img/coins/ust.png';
// import luna from 'assets/img/coins/luna.png';
// import vai from 'assets/img/coins/vai.svg';
// import vrt from 'assets/img/coins/vrt.svg';
// import vsxp from 'assets/img/coins/vsxp.png';
import vusdc from 'assets/img/coins/vusdc.png';
import vusdt from 'assets/img/coins/vusdt.png';
// import vbusd from 'assets/img/coins/vbusd.png';
// import vbnb from 'assets/img/coins/vbnb.png';
// import vxvs from 'assets/img/coins/vxvs.png';
import vbtc from 'assets/img/coins/vbtc.png';
import veth from 'assets/img/coins/veth.png';
// import vltc from 'assets/img/coins/vltc.png';
// import vxrp from 'assets/img/coins/vxrp.png';
// import vlink from 'assets/img/coins/vlink.png';
// import vdot from 'assets/img/coins/vdot.png';
// import vbch from 'assets/img/coins/vbch.png';
// import vdai from 'assets/img/coins/vdai.png';
// import vfil from 'assets/img/coins/vfil.png';
// import vbeth from 'assets/img/coins/vbeth.png';
// import vada from 'assets/img/coins/vada.png';
// import vdoge from 'assets/img/coins/vdoge.png';
// import vmatic from 'assets/img/coins/vmatic.png';
// import vcake from 'assets/img/coins/vcake.png';
// import vaave from 'assets/img/coins/vaave.png';
// import vtusd from 'assets/img/coins/vtusd.png';
// import vtrx from 'assets/img/coins/vtrx.png';
// import vust from 'assets/img/coins/vust.png';
// import vluna from 'assets/img/coins/vluna.png';
import { isOnTestnet } from 'config';
import TOKEN_ADDRESSES from './contracts/addresses/tokens.json';
import VBEP_TOKEN_ADDRESSES from './contracts/addresses/vBepTokens.json';

export const TOKENS = isOnTestnet
  ? {
      usdc: {
        id: 'usdc',
        symbol: 'USDC',
        decimals: 6,
        address: TOKEN_ADDRESSES.usdc[97],
        asset: usdc,
        vasset: vusdc,
      },
      usdt: {
        id: 'usdt',
        symbol: 'USDT',
        decimals: 6,
        address: TOKEN_ADDRESSES.usdt[97],
        asset: usdt,
        vasset: vusdt,
      },

      // wbnb: {
      //   id: 'wbnb',
      //   symbol: 'WBNB',
      //   decimals: 18,
      //   address: TOKEN_ADDRESSES.wbnb[97],
      //   asset: bnb,
      //   vasset: vbnb,
      // },
      // xvs: {
      //   id: 'xvs',
      //   symbol: 'XVS',
      //   decimals: 18,
      //   address: TOKEN_ADDRESSES.xvs[97],
      //   asset: xvs,
      //   vasset: vxvs,
      // },
      // btcb: {
      //   id: 'btcb',
      //   symbol: 'BTCB',
      //   decimals: 18,
      //   address: TOKEN_ADDRESSES.btck[97],
      //   asset: btc,
      //   vasset: vbtc,
      // },
      eth: {
        id: 'eth',
        symbol: 'ETH',
        decimals: 18,
        address: TOKEN_ADDRESSES.eth[97],
        asset: eth,
        vasset: veth,
      },
      // ltc: {
      //   id: 'ltc',
      //   symbol: 'LTC',
      //   decimals: 18,
      //   address: TOKEN_ADDRESSES.ltc[97],
      //   asset: ltc,
      //   vasset: vltc,
      // },
      // xrp: {
      //   id: 'xrp',
      //   symbol: 'XRP',
      //   decimals: 18,
      //   address: TOKEN_ADDRESSES.xrp[97],
      //   asset: xrp,
      //   vasset: vxrp,
      // },
      // ada: {
      //   id: 'ada',
      //   symbol: 'ADA',
      //   decimals: 18,
      //   address: TOKEN_ADDRESSES.ada[97],
      //   asset: ada,
      //   vasset: vada,
      // },
      // doge: {
      //   id: 'doge',
      //   symbol: 'DOGE',
      //   decimals: 8,
      //   address: TOKEN_ADDRESSES.doge[97],
      //   asset: doge,
      //   vasset: vdoge,
      // },
      // matic: {
      //   id: 'matic',
      //   symbol: 'MATIC',
      //   decimals: 18,
      //   address: TOKEN_ADDRESSES.matic[97],
      //   asset: matic,
      //   vasset: vmatic,
      // },
      // cake: {
      //   id: 'cake',
      //   symbol: 'CAKE',
      //   decimals: 18,
      //   address: TOKEN_ADDRESSES.cake[97],
      //   asset: cake,
      //   vasset: vcake,
      // },
      // aave: {
      //   id: 'aave',
      //   symbol: 'AAVE',
      //   decimals: 18,
      //   address: TOKEN_ADDRESSES.aave[97],
      //   asset: aave,
      //   vasset: vaave,
      // },
      // tusd: {
      //   id: 'tusd',
      //   symbol: 'TUSD',
      //   decimals: 18,
      //   address: TOKEN_ADDRESSES.tusd[97],
      //   asset: tusd,
      //   vasset: vtusd,
      // },
      // trx: {
      //   id: 'trx',
      //   symbol: 'TRX',
      //   decimals: 18,
      //   address: TOKEN_ADDRESSES.trx[97],
      //   asset: trx,
      //   vasset: vtrx,
      // },
      // ust: {
      //   id: 'ust',
      //   symbol: 'UST',
      //   decimals: 18,
      //   address: TOKEN_ADDRESSES.ust[97],
      //   asset: ust,
      //   vasset: vust,
      // },
      // luna: {
      //   id: 'luna',
      //   symbol: 'LUNA',
      //   decimals: 6,
      //   address: TOKEN_ADDRESSES.luna[97],
      //   asset: luna,
      //   vasset: vluna,
      // },
      // dai: {
      //   id: 'dai',
      //   symbol: 'DAI',
      //   decimals: 18,
      //   address: TOKEN_ADDRESSES.dai[97],
      //   asset: vai,
      // },
      // vrt: {
      //   id: 'vrt',
      //   symbol: 'VRT',
      //   decimals: 18,
      //   address: TOKEN_ADDRESSES.vrt[97],
      //   asset: vrt,
      // },
    }
  : {
      usdc: {
        id: 'usdc',
        symbol: 'USDC',
        decimals: 18,
        address: TOKEN_ADDRESSES.usdc[321],
        asset: usdc,
        vasset: vusdc,
      },
      usdt: {
        id: 'usdt',
        symbol: 'USDT',
        decimals: 18,
        address: TOKEN_ADDRESSES.usdt[321],
        asset: usdt,
        vasset: vusdt,
      },
      wkcs: {
        id: 'wkcs',
        symbol: 'WKCS',
        decimals: 18,
        address: TOKEN_ADDRESSES.wkcs[321],
        asset: wkcs,
        vasset: wkcs,
      },
      fnr: {
        id: 'fnr',
        symbol: 'FNR',
        decimals: 18,
        address: TOKEN_ADDRESSES.fnr[321],
        asset: bnb,
        vasset: bnb,
      },
      btck: {
        id: 'btck',
        symbol: 'BTCK',
        decimals: 18,
        address: TOKEN_ADDRESSES.btck[321],
        asset: btc,
        vasset: vbtc,
      },
      eth: {
        id: 'eth',
        symbol: 'ETH',
        decimals: 18,
        address: TOKEN_ADDRESSES.eth[321],
        asset: eth,
        vasset: veth,
      },
      mjt: {
        id: 'mjt',
        symbol: 'MJT',
        decimals: 18,
        address: TOKEN_ADDRESSES.mjt[321],
        asset: mjt,
        vasset: mjt,
      },
      cooga: {
        id: 'cooga',
        symbol: 'COOGA',
        decimals: 18,
        address: TOKEN_ADDRESSES.cooga[321],
        asset: cooga,
        vasset: cooga,
      },
      sand: {
        id: 'sand',
        symbol: 'SAND',
        decimals: 18,
        address: TOKEN_ADDRESSES.sand[321],
        asset: sand,
        vasset: sand,
      },
      cooha: {
        id: 'cooha',
        symbol: 'COOHA',
        decimals: 18,
        address: TOKEN_ADDRESSES.cooha[321],
        asset: cooha,
        vasset: cooha,
      },
      mana: {
        id: 'mana',
        symbol: 'MANA',
        decimals: 18,
        address: TOKEN_ADDRESSES.mana[321],
        asset: mana,
        vasset: mana,
      },
      sax: {
        id: 'sax',
        symbol: 'SAX',
        decimals: 18,
        address: TOKEN_ADDRESSES.sax[321],
        asset: sax,
        vasset: sax,
      },
    };

export const VBEP_TOKENS = isOnTestnet
  ? {
      // sxp: {
      //   id: 'sxp',
      //   symbol: 'vSXP',
      //   address: VBEP_TOKEN_ADDRESSES.sxp[97],
      // },
      usdc: {
        id: 'usdc',
        symbol: 'vUSDC',
        address: VBEP_TOKEN_ADDRESSES.usdc[97],
      },
      usdt: {
        id: 'usdt',
        symbol: 'vUSDT',
        address: VBEP_TOKEN_ADDRESSES.usdt[97],
      },
      // busd: {
      //   id: 'busd',
      //   symbol: 'vBUSD',
      //   address: VBEP_TOKEN_ADDRESSES.busd[97],
      // },
      // wbnb: {
      //   id: 'wbnb',
      //   symbol: 'fWBNB',
      //   address: VBEP_TOKEN_ADDRESSES.wbnb[97],
      // },
      // xvs: {
      //   id: 'xvs',
      //   symbol: 'vXVS',
      //   address: VBEP_TOKEN_ADDRESSES.xvs[97],
      // },
      // btcb: {
      //   id: 'btcb',
      //   symbol: 'vBTC',
      //   address: VBEP_TOKEN_ADDRESSES.btcb[97],
      // },
      eth: {
        id: 'eth',
        symbol: 'vETH',
        address: VBEP_TOKEN_ADDRESSES.eth[97],
      },
      // ltc: {
      //   id: 'ltc',
      //   symbol: 'vLTC',
      //   address: VBEP_TOKEN_ADDRESSES.ltc[97],
      // },
      // xrp: {
      //   id: 'xrp',
      //   symbol: 'vXRP',
      //   address: VBEP_TOKEN_ADDRESSES.xrp[97],
      // },
      // ada: {
      //   id: 'ada',
      //   symbol: 'vADA',
      //   address: VBEP_TOKEN_ADDRESSES.ada[97],
      // },
      // doge: {
      //   id: 'doge',
      //   symbol: 'vDOGE',
      //   address: VBEP_TOKEN_ADDRESSES.doge[97],
      // },
      // matic: {
      //   id: 'matic',
      //   symbol: 'vMATIC',
      //   address: VBEP_TOKEN_ADDRESSES.matic[97],
      // },
      // cake: {
      //   id: 'cake',
      //   symbol: 'vCAKE',
      //   address: VBEP_TOKEN_ADDRESSES.cake[97],
      // },
      // aave: {
      //   id: 'aave',
      //   symbol: 'vAAVE',
      //   address: VBEP_TOKEN_ADDRESSES.aave[97],
      // },
      // tusd: {
      //   id: 'tusd',
      //   symbol: 'vTUSD',
      //   address: VBEP_TOKEN_ADDRESSES.tusd[97],
      // },
      // trx: {
      //   id: 'trx',
      //   symbol: 'vTRX',
      //   address: VBEP_TOKEN_ADDRESSES.trx[97],
      // },
      // ust: {
      //   id: 'ust',
      //   symbol: 'vUST',
      //   address: VBEP_TOKEN_ADDRESSES.ust[97],
      // },
      // luna: {
      //   id: 'luna',
      //   symbol: 'vLUNA',
      //   address: VBEP_TOKEN_ADDRESSES.luna[97],
      // },
    }
  : {
      usdc: {
        id: 'usdc',
        symbol: 'fUSDC',
        address: VBEP_TOKEN_ADDRESSES.usdc[321],
      },
      usdt: {
        id: 'usdt',
        symbol: 'fUSDT',
        address: VBEP_TOKEN_ADDRESSES.usdt[321],
      },
      wkcs: {
        id: 'wkcs',
        symbol: 'fWKCS',
        address: VBEP_TOKEN_ADDRESSES.wkcs[321],
      },
      btck: {
        id: 'btck',
        symbol: 'fBTCK',
        address: VBEP_TOKEN_ADDRESSES.btck[321],
      },
      eth: {
        id: 'eth',
        symbol: 'fETH',
        address: VBEP_TOKEN_ADDRESSES.eth[321],
      },

      mjt: {
        id: 'mjt',
        symbol: 'fMJT',
        address: VBEP_TOKEN_ADDRESSES.mjt[321],
      },
      cooga: {
        id: 'cooga',
        symbol: 'fCOOGA',
        address: VBEP_TOKEN_ADDRESSES.cooga[321],
      },
      sand: {
        id: 'sand',
        symbol: 'fSAND',
        address: VBEP_TOKEN_ADDRESSES.sand[321],
      },
      cooha: {
        id: 'cooha',
        symbol: 'fCOOHA',
        address: VBEP_TOKEN_ADDRESSES.cooha[321],
      },
      mana: {
        id: 'mana',
        symbol: 'fMANA',
        address: VBEP_TOKEN_ADDRESSES.mana[321],
      },
      sax: {
        id: 'sax',
        symbol: 'fSAX',
        address: VBEP_TOKEN_ADDRESSES.sax[321],
      },
    };
