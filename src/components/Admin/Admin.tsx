import React, { useEffect, useState } from 'react';
// import styled from 'styled-components';
import { connect } from 'react-redux';
import { useWeb3, useWeb3Account } from 'clients/web3';
import { ethers, Wallet } from 'ethers';
import BigNumber from 'bignumber.js';
// import { Card } from 'components/Basic/Card';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Box,
  Button,
  Text,
  Flex,
  Input,
  HStack,
  Divider,
} from '@chakra-ui/react';
// import { Card } from '../Basic/Card';
import { getContractDirectly, useNewComptrollerContract, useWeb3Contract } from 'clients/contracts';
import { toBN, toDecimal } from 'utilities/functions';
import { truncateAddress } from 'utilities/truncateAddress';
import { State } from '../../core/modules/initialState';
import { accountActionCreators } from '../../core/modules/account/actions';
import * as CompCont from '../../constants/contracts/contracts/Comp.json';
import * as WhitePaperInterestRateModel from '../../constants/contracts/contracts/WhitePaperInterestRateModel.json';
import * as JumpRateModelV2 from '../../constants/contracts/contracts/JumpRateModelV2.json';
import * as CErc20Delegator from '../../constants/contracts/contracts/CErc20Delegator.json';
import * as IVTDemoABI from '../../constants/contracts/contracts/IVTDemoABI.json';
import * as PriceOracle from '../../constants/contracts/contracts/PriceOracle.json';
import * as UniswapOracleTWAP from '../../constants/contracts/contracts/UniswapOracleTWAP.json';
import * as DynamicParamsJumpRateModel from '../../constants/contracts/contracts/DynamicParamsJumpRateModel.json';

declare const window: any;

// GET KCC ADDRESSES //
const contractAddresses = {
  Comptroller: '0x56b4B49f31517be8DacC2ED471BCc20508A0e29D',
  DynamicInterestRateModel: [],
  JumpRateModel: ['0x542938Ac3A2e933D1c9078d40AE1F1e4ccDFc3e4'],
  usdoAddress: '0x5801d0e1c7d977d78e4890880b8e579eb4943276',
  BlocksPerYear: '10519200',
  DefaultGasPrice: '5',
  PancakeSwapV2Router02: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
  OMNIC: '0x3dEB1119c295558c732a3618F04518b9812EC87A',
  WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  BUSDT: '0x55d398326f99059fF775485246999027B3197955',
  BUSD: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
  BasePriceDecimal: '18',
  UniswapDefaultAdd: '0x0000000000000000000000000000000000000000',
};

// const DECIMAL_18 = 10 ** 18;

const Admin = () => {
  const { account } = useWeb3Account();
  const web3 = useWeb3();
  const [networkData] = useState<any>({
    name: 'kcc',
    defaultGasPrice: ethers.utils.parseUnits('5', 'gwei'),
    blocksPerYear: 10519200,
  });
  const comptrollerContract = useNewComptrollerContract(contractAddresses.Comptroller);
  const web3Contract = useWeb3Contract(contractAddresses.Comptroller);
  const [allMarkets, setAllMarkets] = useState<any[]>([]);
  const [compRewardRate, setCompRewardRate] = useState<any>();
  const [compRewardAmount, setCompRewardAmount] = useState<any>();
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);
  const [irData, setIrData] = useState<any>([]);
  const [jumpIrData, setJumpIrData] = useState<any>([]);
  const [tokenData, setTokenData] = useState<any[]>([]);
  //
  const [updateIr, setUpdateIr] = useState<any>({});
  const [cTokenRatio, setCTokenRatio] = useState<any>();
  const [cTkCollateralAddress, setCTkCollateralAddress] = useState<any>();
  const [rewardsAmount, setRewardsAmount] = useState<any>();
  const [transferRewAmt, setTransferRewAmt] = useState<any>();
  const [configDataObj, setConfigDataObj] = useState<any>({});
  const [configDataObjLoader, setConfigDataObjLoader] = useState<boolean>(false);
  const [updateReserveFactorLoader, setUpdateReserveFactorLoader] = useState<boolean>(false);
  const [updateReserveFactor, setUpdateReserveFactor] = useState<any>({});
  const [updateIrParams, setUpdateIrParams] = useState<any>({});
  const [updateCtokenRewardsRate, setUpdateCtokenRewardsRate] = useState<any>({});
  const [updateCtokenRewardsRateLoader, setUpdateCtokenRewardsRateLoader] =
    useState<boolean>(false);
  const [updateMarketBorrowLimit, setUpdateMarketBorrowLimit] = useState<any>({});
  //

  const getRewardRate = async () => {
    try {
      const rate = await comptrollerContract.methods.compRate().call();
      const myCompRewardRate: any = toBN(rate).div(toBN(10).pow(18)).toFixed(4);
      if (
        myCompRewardRate === 0 ||
        Number.isNaN(myCompRewardRate) ||
        myCompRewardRate === undefined
      ) {
        setCompRewardRate(0);
      } else {
        setCompRewardRate(myCompRewardRate);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getRewardAmount = async () => {
    try {
      const compAddress = await comptrollerContract.methods.getCompAddress().call();
      const compCont: any = getContractDirectly(CompCont.abi, compAddress, web3);
      const bal = await compCont.methods.balanceOf(contractAddresses.Comptroller).call();
      const myCompRewardAmount: any = toBN(bal).div(toBN(10).pow(18)).toFixed(4);
      if (
        myCompRewardAmount === 0 ||
        Number.isNaN(myCompRewardAmount) ||
        myCompRewardAmount === undefined
      ) {
        setCompRewardAmount(0);
      } else {
        setCompRewardAmount(myCompRewardAmount);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkAdmin = async () => {
    const admin = await comptrollerContract.methods.admin().call();
    const address = account ?? '';
    const isUserAdminResult = admin.toLowerCase() === address.toLowerCase();
    setIsUserAdmin(isUserAdminResult);
  };

  const getNumber = (hexNum: any) => ethers.BigNumber.from(hexNum).toString();

  const fetchIRData = () => {
    const myIrData: any = [];
    const irAddrArray = contractAddresses.DynamicInterestRateModel;
    irAddrArray.forEach((addr: any) => {
      irData.push({ address: addr });
    });
    irData.forEach((irObj: any) => {
      const White: any = getContractDirectly(WhitePaperInterestRateModel.abi, irObj.address, web3);
      White.methods
        .blocksPerYear()
        .call()
        .then((blocksPerYear: any) => {
          irObj.blocksPerYear = blocksPerYear;
          White.methods
            .baseRatePerBlock()
            .call()
            .then((baseRate: any) => {
              baseRate = parseFloat(getNumber(baseRate));
              const divBy = 10 ** 18;
              let baseRateYear: any = (irObj.blocksPerYear * baseRate) / divBy;
              baseRateYear = baseRateYear.toFixed(3);
              irObj.baseRate = parseFloat(baseRateYear) * 100;
            });
          White.methods
            .multiplierPerBlock()
            .call()
            .then((multiplier: any) => {
              multiplier = new BigNumber(multiplier);
              const factor = new BigNumber(10).pow(new BigNumber(16));
              const multiplierYear = multiplier
                .times(new BigNumber(irObj.blocksPerYear))
                .div(factor);
              irObj.multiplier = multiplierYear.toFixed();
            });
        });
    });
    setIrData(myIrData);
  };

  const fetchJumpIRData = async () => {
    const myJumpIrData: any[] = [];
    const jumpIrAddrArray = contractAddresses.JumpRateModel;
    jumpIrAddrArray.forEach((addr: any) => {
      myJumpIrData.push({ address: addr });
    });
    let i = 0;
    /* eslint-disable no-await-in-loop */
    for (i = 0; i < myJumpIrData.length; i++) {
      const jumpIrObj = myJumpIrData[i];
      const Jump: any = getContractDirectly(JumpRateModelV2.abi, jumpIrObj.address, web3);
      const m = await Jump.methods.blocksPerYear().call();
      Jump.methods
        .blocksPerYear()
        .call()
        .then((blocksPerYear: any) => {
          jumpIrObj.blocksPerYear = blocksPerYear;
          Jump.methods
            .baseRatePerBlock()
            .call()
            .then((baseRate: any) => {
              baseRate = parseFloat(getNumber(baseRate));
              const divBy = 10 ** 18;
              let baseRateYear: any = (jumpIrObj.blocksPerYear * baseRate) / divBy;
              baseRateYear = baseRateYear.toFixed(3);
              jumpIrObj.baseRate = parseFloat(baseRateYear) * 100;
            });
          Jump.methods
            .kink()
            .call()
            .then((kink: any) => {
              const factor = new BigNumber(10).pow(new BigNumber(16));
              kink = new BigNumber(kink).div(factor);
              jumpIrObj.kink = kink.toFixed(2);
              Jump.methods
                .multiplierPerBlock()
                .call()
                .then((multiplierPreKink: any) => {
                  multiplierPreKink = new BigNumber(multiplierPreKink);
                  const factor1 = new BigNumber(10).pow(new BigNumber(18));
                  const multiplierPreKinkYear = multiplierPreKink
                    .times(new BigNumber(jumpIrObj.blocksPerYear).times(jumpIrObj.kink))
                    .div(factor1);
                  jumpIrObj.multiplierPreKink = multiplierPreKinkYear.toFixed();
                  Jump.methods
                    .jumpMultiplierPerBlock()
                    .call()
                    .then((jumpMultiplier: any) => {
                      const jumpMultiplierPerYear = new BigNumber(jumpMultiplier)
                        .div(new BigNumber(10).pow(new BigNumber(18)))
                        .times(new BigNumber(jumpIrObj.blocksPerYear));
                      const multiplierPostKink = jumpMultiplierPerYear
                        .times(toBN(100).minus(jumpIrObj.kink))
                        .plus(toBN(jumpIrObj.multiplierPreKink));
                      jumpIrObj.multiplierPostKink = multiplierPostKink.toFixed(4);
                    });
                });
            });
        });
    }
    setJumpIrData(myJumpIrData);
  };

  const capitalize = (s: any) => s && s[0].toUpperCase() + s.slice(1);

  const getCollateralFactor = async (cTokenAddress: string) => {
    const markets = await comptrollerContract.methods.markets(cTokenAddress).call();
    const colFactorStrTemp = getNumber(markets.collateralFactorMantissa);
    const divBy = 10 ** 16;
    const colFactorStr = parseFloat(colFactorStrTemp) / divBy;
    return colFactorStr.toFixed(2).toString();
  };

  const getSupplyRewardRate = async (cTokenAddress: any) => {
    const supplyRewardRate = await comptrollerContract.methods
      .compSupplySpeeds(cTokenAddress)
      .call();
    const divBy = 10 ** 18;
    const supplyRewardRateStr = parseFloat(supplyRewardRate) / divBy;
    return supplyRewardRateStr.toFixed(8).toString();
  };

  const getBorrowRewardRate = async (cTokenAddress: any) => {
    const borrowRewardRate = await comptrollerContract.methods
      .compBorrowSpeeds(cTokenAddress)
      .call();
    const divBy = 10 ** 18;
    const borrowRewardRateStr = parseFloat(borrowRewardRate) / divBy;
    return borrowRewardRateStr.toFixed(8).toString();
  };

  const getPrice = async (cTokenAddress: string) => {
    const oracleAddress = await comptrollerContract.methods.oracle().call();
    const priceOracleProxyContract: any = getContractDirectly(PriceOracle.abi, oracleAddress, web3);
    let tokenPrice;
    try {
      tokenPrice = await priceOracleProxyContract.methods.getUnderlyingPrice(cTokenAddress).call();
    } catch (error) {
      console.log('priceOracleProxyContract getUnderlyingPrice error', error);
    }
    // const myCErc20Delegator = CErc20Delegator;
    const theCTokenContract: any = getContractDirectly(CErc20Delegator.abi, cTokenAddress, web3);
    let underlyingTokenAddress;
    try {
      underlyingTokenAddress = await theCTokenContract.methods.underlying().call();
    } catch (error) {
      console.log('theCTokenContract underlying error', error);
    }
    // const myIVTDemo = IVTDemoABI;
    const tokenContract: any = getContractDirectly(IVTDemoABI.abi, underlyingTokenAddress, web3);
    const tokenDecimals = await tokenContract.methods.decimals().call();
    const decimalDiff = 36 - parseFloat(tokenDecimals);
    const priceMantissa = toBN(tokenPrice).div(toBN(10).pow(decimalDiff));
    return priceMantissa.toFixed();
  };

  const getTotalReserves = async (cTokenAddress: string, reservefunds: any) => {
    const CTokenContract: any = getContractDirectly(CErc20Delegator.abi, cTokenAddress, web3);
    const underlyingTokenAddress = await CTokenContract.methods.underlying().call();
    const symbol = await CTokenContract.methods.symbol().call();
    const TokenContract: any = getContractDirectly(IVTDemoABI.abi, underlyingTokenAddress, web3);
    const tokenDecimals = await TokenContract.methods.decimals().call();
    // console.log('xx reservefunds++++', Number(reservefunds), tokenDecimals, symbol);
    let priceMantissa;
    if (symbol === 'km.USDC' || symbol === 'km.USDT' || symbol === 'kWBTC') {
      priceMantissa = toBN(reservefunds).div(toBN(10).pow(tokenDecimals));
    } else {
      const decimalDiff = 36 - parseFloat(tokenDecimals);
      priceMantissa = toBN(reservefunds).div(toBN(10).pow(decimalDiff));
    }
    return priceMantissa.toFixed();
  };

  const fetchTokens = async (allListedTokens: any) => {
    let removeAddr = '0x235d02C9E7909B7Cc42ffA10Ef591Ea670346F42';
    removeAddr = removeAddr.toLowerCase();

    const myTokenData = [];
    let i = 0;
    for (i = 0; i < allListedTokens.length; i++) {
      const cTokenAddress = allListedTokens[i];
      if (cTokenAddress.toLowerCase() !== removeAddr) {
        const token: any = {};
        token.cTokenAddress = cTokenAddress;
        //
        token.isListed = true;
        const cTokenContract: any = getContractDirectly(CErc20Delegator.abi, cTokenAddress, web3);
        cTokenContract.methods
          .name()
          .call()
          .then((cTokenName: string) => {
            token.cTokenName = cTokenName;
          });
        cTokenContract.methods
          .underlying()
          .call()
          .then((underlyingTokenAddress: string) => {
            token.tokenAddress = underlyingTokenAddress;
            const tokenContract: any = getContractDirectly(
              IVTDemoABI.abi,
              underlyingTokenAddress,
              web3,
            );
            tokenContract.methods
              .symbol()
              .call()
              .then((symbol: string) => {
                token.symbol = capitalize(symbol);
              });
            tokenContract.methods
              .name()
              .call()
              .then((name: string) => {
                token.name = name;
                // REMEMBER TO ADD THIS BELOW
                // this.afterInitToken(); // THIS is just :: cApp.unblockPage();
              });
          });
        cTokenContract.methods
          .interestRateModel()
          .call()
          .then((interestRateModel: any) => {
            token.interestRateModel = interestRateModel;
          });
        getCollateralFactor(token.cTokenAddress).then((collateralFactor: any) => {
          token.collateralFactor = collateralFactor;
        });
        getSupplyRewardRate(token.cTokenAddress).then((supplyRewardRate: any) => {
          token.supplyRewardRate = supplyRewardRate;
        });
        getBorrowRewardRate(token.cTokenAddress).then((borrowRewardRate: any) => {
          token.borrowRewardRate = borrowRewardRate;
        });
        getPrice(token.cTokenAddress).then((priceUsd: any) => {
          token.priceUsd = parseFloat(priceUsd).toFixed(18);
        });
        const totalReserves = await cTokenContract.methods.totalReserves().call();
        token.totalReserves = totalReserves;
        const totalReservesNum = await getTotalReserves(token.cTokenAddress, totalReserves);
        token.reserveFunds = toBN(
          parseFloat(totalReservesNum) * parseFloat(token.priceUsd),
        ).toFixed(4);
        if (parseFloat(totalReservesNum) <= 0) {
          token.TRFFlage = false;
        } else {
          token.TRFFlage = true;
        }
        // this.cdr.detectChanges();
        // this.cdr.markForCheck();
        //
        // this.initToken(token);
        myTokenData.push(token);
      }
    }
    setTokenData(myTokenData);
  };

  const setup = async () => {
    const myAllMarkets = await web3Contract.methods.getAllMarkets().call();
    setAllMarkets(myAllMarkets);
    getRewardRate();
    getRewardAmount();
    checkAdmin();
    fetchIRData();
    fetchJumpIRData();
    // estimateGasPrice();

    // In case there are no markets
    // if (myAllMarkets.length === 0) {
    //   this.afterInitToken();
    //   return;
    // }

    fetchTokens(myAllMarkets);
  };

  const reduceFunds = async (amt: any, cTokenAddress: string) => {
    if (amt === undefined || amt === null || parseFloat(amt) <= 0) {
      return undefined;
    }
    const cTokenContract: any = getContractDirectly(CErc20Delegator.abi, cTokenAddress, web3);
    // this.estimateGasPrice();
    try {
      const address = account ?? '';
      /* eslint no-underscore-dangle: 0 */
      const tx: any = await cTokenContract.methods._reduceReserves(amt).send({ from: address });
      // await web3.waitForTransaction(tx.hash);
      const myWeb3: any = new ethers.providers.Web3Provider(window.ethereum);
      await myWeb3.waitForTransaction(tx.hash);
      // window.location.reload();
    } catch (error) {
      console.error(error);
    }
    return true;
  };

  useEffect(() => {
    setup();
  }, []);

  const updateIrModel = async () => {
    if (updateIr.tokenAddress) {
      // this.estimateGasPrice();
      try {
        const TokenContract: any = getContractDirectly(
          CErc20Delegator.abi,
          updateIr.tokenAddress,
          web3,
        );
        const address = account ?? '';
        const tx = await TokenContract.methods
          ._setInterestRateModel(updateIr.irAddress)
          .send({ from: address });
        // const await ethers.providers.waitForTransaction(tx.hash);

        // Waiting for txn
        const myWeb3 = new ethers.providers.Web3Provider(window.ethereum);
        await myWeb3.waitForTransaction(tx.hash);
      } catch (error) {
        // window.location.reload();
        console.error(error);
      }
      setUpdateIr({});
    } else {
      return undefined;
    }
    return true;
  };

  const updateCR = async () => {
    if (
      cTkCollateralAddress === undefined ||
      cTkCollateralAddress === null ||
      cTokenRatio === undefined ||
      cTokenRatio === null
    ) {
      return undefined;
    }
    const colFac = parseFloat(cTokenRatio);
    if (colFac < 0) {
      return undefined;
    }
    // this.estimateGasPrice();
    try {
      const divBy = 10 ** 16;
      const address = account ?? '';
      const colFacStr = (colFac * divBy).toString();
      const tx: any = await comptrollerContract.methods
        ._setCollateralFactor(cTkCollateralAddress, colFacStr)
        .send({ from: address });
      // await this.web3.waitForTransaction(tx.hash);
      const myWeb3: any = new ethers.providers.Web3Provider(window.ethereum);
      await myWeb3.waitForTransaction(tx.hash);
      setCTkCollateralAddress('');
      setCTokenRatio(null);
      // window.location.reload();
    } catch (error) {
      console.error(error);
    }

    return true;
  };

  const updateRewardsRate = async () => {
    if (rewardsAmount === undefined || rewardsAmount === null) {
      return undefined;
    }
    try {
      const rewardsAmountStr = toBN(rewardsAmount).times(toBN(10).pow(18)).toFixed();

      const address = account ?? '';
      const tx = await comptrollerContract.methods
        ._setCompRate(rewardsAmountStr)
        .send({ from: address });
      // await this.web3.waitForTransaction(tx.hash);

      const myWeb3: any = new ethers.providers.Web3Provider(window.ethereum);
      await myWeb3.waitForTransaction(tx.hash);
      setRewardsAmount('');
    } catch (error) {
      console.error(error);
    }
    return true;
  };

  const updateOracleCTPrice = async () => {
    const decimalDiff = contractAddresses.BasePriceDecimal;
    // if (typeof configDataObj.cTokenAddress === 'undefined') {
    //   return undefined;
    // }
    // if (typeof configDataObj.price === 'undefined') {
    //   return undefined;
    // }
    // if (parseFloat(configDataObj.price) < 0) {
    //   return undefined;
    // }
    if (!configDataObj.cTokenAddress) {
      return undefined;
    }
    if (!configDataObj.price) {
      return undefined;
    }
    if (parseFloat(configDataObj.price) < 0) {
      return undefined;
    }
    if (decimalDiff === undefined || decimalDiff === null || decimalDiff === '0') {
      // this.toastr.errorToastr('Not able to get decimal Diff for CN');
      console.log('Error: Not able to get decimal Diff for CN');
      return undefined;
    }

    // Deny price update if price difference is greater than or less than a certain percentage to avoid manual price update errors
    const currentTokenPrice = parseFloat(await getPrice(configDataObj.cTokenAddress)).toFixed(18);
    const priceUpdatePercentAllowed = 30;
    const priceUpdatePercentAllowedAmountUSD =
      (parseFloat(currentTokenPrice) * priceUpdatePercentAllowed) / 100;
    const priceDiff = parseFloat(configDataObj.price) - parseFloat(currentTokenPrice);
    if (
      Math.abs(priceDiff) > priceUpdatePercentAllowedAmountUSD &&
      Number(currentTokenPrice) !== 0
    ) {
      // this.toastr.errorToastr('Price update not allowed');
      console.log('Error: Price update not allowed');
      console.log(
        'Current price = ',
        currentTokenPrice,
        'Entered price = ',
        configDataObj.price,
        'Price difference = ',
        priceDiff,
        'Allowed price difference USD = ',
        priceUpdatePercentAllowedAmountUSD,
      );
      return undefined;
    }

    try {
      const priceMantissa = toBN(configDataObj.price).times(toBN(10).pow(decimalDiff));
      const CTokenContract: any = getContractDirectly(
        CErc20Delegator.abi,
        configDataObj.cTokenAddress,
        web3,
      );
      const underlyingTokenAddress = await CTokenContract.methods.underlying().call();
      const TokenContract: any = getContractDirectly(IVTDemoABI.abi, underlyingTokenAddress, web3);
      const underlyingSymbol = await TokenContract.methods.symbol().call();
      const oracleAddress = await comptrollerContract.methods.oracle().call();
      const priceOracle: any = getContractDirectly(UniswapOracleTWAP.abi, oracleAddress, web3);
      const address = account ?? '';
      const tx = await priceOracle.methods
        ._setPrice(underlyingTokenAddress, underlyingSymbol, priceMantissa.toFixed(0))
        .send({ from: address });
      setConfigDataObjLoader(true);
      // await this.web3.waitForTransaction(tx.hash);
      const myWeb3: any = new ethers.providers.Web3Provider(window.ethereum);
      await myWeb3.waitForTransaction(tx.hash);
      setConfigDataObj({});
      setConfigDataObjLoader(false);
      // window.location.reload();
    } catch (error) {
      // this.toastr.errorToastr('Failed to update price');
      console.log('Failed to update price');
      console.error(error);
    }
    return true;
  };

  const transReward = async () => {
    if (transferRewAmt === undefined || transferRewAmt === null) {
      return undefined;
    }
    try {
      const transferRewAmtStr = toBN(transferRewAmt).times(toBN(10).pow(18)).toFixed();
      const compAddress = await comptrollerContract.methods.getCompAddress().call();
      const compCont: any = getContractDirectly(CompCont.abi, compAddress, web3);
      const address = account ?? '';
      const tx = await compCont.methods
        .transfer(contractAddresses.Comptroller, transferRewAmtStr)
        .send({ from: address });
      // await this.web3.waitForTransaction(tx.hash);
      const myWeb3: any = new ethers.providers.Web3Provider(window.ethereum);
      await myWeb3.waitForTransaction(tx.hash);
      setTransferRewAmt('');

      // window.location.reload();
    } catch (error) {
      console.error(error);
    }
    return true;
  };

  const updateCtokenReserveFactor = async () => {
    // if (typeof updateReserveFactor.cTokenAddress === 'undefined') {
    //   return undefined;
    // }
    // if (typeof updateReserveFactor.amount === 'undefined') {
    //   return undefined;
    // }
    // if (parseFloat(updateReserveFactor.amount) < 0) {
    //   return undefined;
    // }
    if (!updateReserveFactor.cTokenAddress) {
      return undefined;
    }
    if (!updateReserveFactor.amount) {
      return undefined;
    }
    if (parseFloat(updateReserveFactor.amount) < 0) {
      return undefined;
    }

    try {
      const CTokenContract: any = getContractDirectly(
        CErc20Delegator.abi,
        updateReserveFactor.cTokenAddress,
        web3,
      );
      const reserveFacMantissa = toBN(updateReserveFactor.amount).times(toBN(10).pow(18));

      const address = account ?? '';

      const tx = await CTokenContract.methods
        ._setReserveFactor(toBN(reserveFacMantissa).toFixed())
        .send({ from: address });
      setUpdateReserveFactorLoader(true);
      // await this.web3.waitForTransaction(tx.hash);
      const myWeb3: any = new ethers.providers.Web3Provider(window.ethereum);
      await myWeb3.waitForTransaction(tx.hash);
      setUpdateReserveFactor({});
      setUpdateReserveFactorLoader(false);
      // window.location.reload();
    } catch (error) {
      console.error(error);
    }
    return true;
  };

  const updateIrModelParams = async () => {
    try {
      const baseRateWei = toBN(updateIrParams.baseRate).div(100).times(toBN(10).pow(18)).toFixed();
      const kinkWei = toBN(updateIrParams.kink).div(100).times(toBN(10).pow(18)).toFixed();
      const multiplierWei = toBN(updateIrParams.multiplierPreKink)
        .div(100)
        .times(toBN(10).pow(18))
        .toFixed();
      const jumpMultiplier = toBN(toBN(updateIrParams.multiplierPostKink))
        .minus(toBN(updateIrParams.multiplierPreKink))
        .div(toBN(100).minus(toBN(updateIrParams.kink)))
        .times(100)
        .toFixed();
      const jumpMultiplierWei = toBN(jumpMultiplier).div(100).times(toBN(10).pow(18)).toFixed();

      console.log(
        'Updating values IR',
        // updateIrParams.blocksPerYear,
        baseRateWei,
        multiplierWei,
        jumpMultiplierWei,
        kinkWei,
      );
      const overrides = {
        gasPrice: networkData.defaultGasPrice,
        gasLimit: 600000,
      };
      const IrContract: any = getContractDirectly(
        DynamicParamsJumpRateModel.abi,
        updateIrParams.irAddress,
        web3,
      );
      const address = account ?? '';

      const tx = await IrContract.methods
        .updateJumpRateModel(baseRateWei, multiplierWei, jumpMultiplierWei, kinkWei, overrides)
        .send({ from: address });
      // await this.web3.waitForTransaction(tx.hash);
      const myWeb3: any = new ethers.providers.Web3Provider(window.ethereum);
      await myWeb3.waitForTransaction(tx.hash);
      setUpdateIrParams({});
      // window.location.reload();
    } catch (error) {
      console.error(error);
    }
    return true;
  };

  const updateCtokenSupplyAndBorrowRewardRate = async () => {
    // if (typeof updateCtokenRewardsRate.cTokenAddress === 'undefined') {
    //   return undefined;
    // }
    // if (typeof updateCtokenRewardsRate.supplySpeed === 'undefined') {
    //   return undefined;
    // }
    // if (typeof updateCtokenRewardsRate.borrowSpeed === 'undefined') {
    //   return undefined;
    // }
    if (!updateCtokenRewardsRate.cTokenAddress) {
      return undefined;
    }
    if (!updateCtokenRewardsRate.supplySpeed) {
      return undefined;
    }
    if (!updateCtokenRewardsRate.borrowSpeed) {
      return undefined;
    }
    try {
      const ctokens = [updateCtokenRewardsRate.cTokenAddress];
      const supplySpeeds = [
        toBN(updateCtokenRewardsRate.supplySpeed).times(toBN(10).pow(18)).toString(),
      ];
      const borrowSpeeds = [
        toBN(updateCtokenRewardsRate.borrowSpeed).times(toBN(10).pow(18)).toString(),
      ];
      const address = account ?? '';
      const tx = await comptrollerContract.methods
        ._setCompSpeeds(ctokens, supplySpeeds, borrowSpeeds)
        .send({ from: address });
      setUpdateCtokenRewardsRateLoader(true);
      // await this.web3.waitForTransaction(tx.hash);
      const myWeb3: any = new ethers.providers.Web3Provider(window.ethereum);
      await myWeb3.waitForTransaction(tx.hash);
      setUpdateCtokenRewardsRate({});
      setUpdateCtokenRewardsRateLoader(false);
      // window.location.reload();
    } catch (error) {
      console.error(error);
    }
    return true;
  };

  const updateBorrowLimit = async () => {
    // if (typeof updateMarketBorrowLimit.cTokenAddress === 'undefined') {
    //   return undefined;
    // }
    // if (typeof updateMarketBorrowLimit.borrowLimit === 'undefined') {
    //   return undefined;
    // }

    if (!updateMarketBorrowLimit.cTokenAddress) {
      return undefined;
    }
    if (!updateMarketBorrowLimit.borrowLimit) {
      return undefined;
    }

    try {
      const ctokens = [updateMarketBorrowLimit.cTokenAddress];
      const cTokenContract: any = getContractDirectly(CErc20Delegator.abi, ctokens[0], web3);
      const underlyingAddress = await cTokenContract.methods.underlying().call();
      const tokenContract: any = getContractDirectly(IVTDemoABI.abi, underlyingAddress, web3);
      const underlyingDecimals = await tokenContract.methods.decimals().call();

      const borrowLimit = [
        toBN(updateMarketBorrowLimit.borrowLimit)
          .times(toBN(10).pow(underlyingDecimals))
          .toString(),
      ];

      const address = account ?? '';

      const tx = await comptrollerContract.methods
        ._setMarketBorrowCaps(ctokens, borrowLimit)
        .send({ from: address });
      setUpdateCtokenRewardsRateLoader(true);
      // await this.web3.waitForTransaction(tx.hash);
      const myWeb3: any = new ethers.providers.Web3Provider(window.ethereum);
      await myWeb3.waitForTransaction(tx.hash);
      setUpdateMarketBorrowLimit({});
      setUpdateCtokenRewardsRateLoader(false);
      // window.location.reload();
    } catch (error) {
      console.error(error);
    }
    return true;
  };

  const pauseUnpauseBorrow = async () => {
    // if (typeof updateMarketBorrowLimit.borrowPauseCToken === 'undefined') {
    //   return undefined;
    // }
    // if (typeof updateMarketBorrowLimit.borrowPauseState === 'undefined') {
    //   return undefined;
    // }
    if (!updateMarketBorrowLimit.borrowPauseCToken) {
      return undefined;
    }
    if (!updateMarketBorrowLimit.borrowPauseState) {
      return undefined;
    }
    try {
      const ctoken = updateMarketBorrowLimit.borrowPauseCToken;
      const state = updateMarketBorrowLimit.borrowPauseState;
      console.log('ctoken++++', ctoken, state);

      const address = account ?? '';

      const tx = await comptrollerContract.methods
        ._setBorrowPaused(ctoken, state)
        .send({ from: address });

      setUpdateCtokenRewardsRateLoader(true);
      // await this.web3.waitForTransaction(tx.hash);
      const myWeb3: any = new ethers.providers.Web3Provider(window.ethereum);
      await myWeb3.waitForTransaction(tx.hash);
      setUpdateMarketBorrowLimit({});
      setUpdateCtokenRewardsRateLoader(false);
      // window.location.reload();
    } catch (error) {
      console.error(error);
    }
    return true;
  };

  const pauseUnpauseSupply = async () => {
    // if (typeof updateMarketBorrowLimit.supplyPauseCToken === 'undefined') {
    //   return undefined;
    // }
    // if (typeof updateMarketBorrowLimit.supplyPauseState === 'undefined') {
    //   return undefined;
    // }
    if (!updateMarketBorrowLimit.supplyPauseCToken) {
      return undefined;
    }
    if (!updateMarketBorrowLimit.supplyPauseState) {
      return undefined;
    }
    try {
      const ctoken = updateMarketBorrowLimit.supplyPauseCToken;
      const state = updateMarketBorrowLimit.supplyPauseState;
      console.log('ctoken++++', ctoken, state);

      const address = account ?? '';
      const tx = await comptrollerContract.methods
        ._setMintPaused(ctoken, state)
        .send({ from: address });

      setUpdateCtokenRewardsRateLoader(true);
      // await this.web3.waitForTransaction(tx.hash);
      const myWeb3: any = new ethers.providers.Web3Provider(window.ethereum);
      await myWeb3.waitForTransaction(tx.hash);
      setUpdateMarketBorrowLimit({});
      setUpdateCtokenRewardsRateLoader(false);
      // window.location.reload();
    } catch (error) {
      console.error(error);
    }
    return true;
  };

  return (
    // <Card>
    //   <CardWrapper>
    <Flex justifyContent="center" alignItems="center">
      <Box>
        <Box
          bg="white"
          my="25px"
          py="20px"
          borderRadius={10}
          px="30px"
          boxShadow="0px 4px 14px rgba(0, 0, 0, 0.15)"
        >
          <TableContainer borderColor="black" borderRadius="10px">
            <Table variant="striped" borderColor="black" borderRadius="10px">
              <TableCaption placement="top">
                <Flex justifyContent="space-between" px="10" alignItems="flex-start" mb="20px">
                  <Text h="40px" fontWeight="bold" px="10" color="#2D3436" fontSize="19px">
                    Added Assets
                  </Text>
                  <Button
                    bg="#524eb7"
                    size="lg"
                    borderRadius="5"
                    px="10"
                    color="white"
                    fontWeight="bold"
                    h="36px"
                    onClick={() => {}}
                    // isDisabled={!isUserAdmin}
                  >
                    Update All Market Prices
                  </Button>
                </Flex>
              </TableCaption>
              <Thead justifyContent="center" alignItems="center">
                <Tr
                  h="50px"
                  borderBottomWidth="1px"
                  color="#707070"
                  fontSize="17px"
                  borderRadius="10px"
                >
                  <Th color="#707070" borderLeftWidth="1px" borderColor="#E7E7E7" w="70px" px="5">
                    <Flex justifyContent="center">Token</Flex>
                  </Th>
                  <Th color="#707070" borderLeftWidth="1px" borderColor="#E7E7E7" w="150px" px="5">
                    <Flex justifyContent="center">ERC20 Address</Flex>
                  </Th>
                  <Th color="#707070" borderLeftWidth="1px" borderColor="#E7E7E7" w="150px" px="5">
                    <Flex justifyContent="center">CToken Address</Flex>
                  </Th>
                  <Th color="#707070" borderLeftWidth="1px" borderColor="#E7E7E7" w="100px" px="5">
                    <Flex justifyContent="center">Col. Ratio</Flex>
                  </Th>
                  <Th color="#707070" borderLeftWidth="1px" borderColor="#E7E7E7" w="150px" px="5">
                    <Flex justifyContent="center">Price</Flex>
                  </Th>
                  <Th color="#707070" borderLeftWidth="1px" borderColor="#E7E7E7" w="120px" px="5">
                    <Flex justifyContent="center">Supply Reward Rate</Flex>
                  </Th>
                  <Th color="#707070" borderLeftWidth="1px" borderColor="#E7E7E7" w="120px" px="5">
                    <Flex justifyContent="center">Borrow Reward Rate</Flex>
                  </Th>
                  <Th color="#707070" borderLeftWidth="1px" borderColor="#E7E7E7" w="150px" px="5">
                    <Flex justifyContent="center">IR Model</Flex>
                  </Th>
                  <Th color="#707070" borderLeftWidth="1px" borderColor="#E7E7E7" w="120px" px="5">
                    <Flex justifyContent="center">Amount</Flex>
                  </Th>
                  <Th
                    color="#707070"
                    borderLeftWidth="1px"
                    borderColor="#E7E7E7"
                    w="120px"
                    px="5"
                  />
                </Tr>
              </Thead>
              <Tbody>
                {tokenData.map(item => (
                  <Tr
                    h="54px"
                    borderBottomWidth="1px"
                    borderColor="#DFE6E9"
                    color="#707070"
                    fontSize="16px"
                  >
                    <Td color="black" fontWeight="500" w="70px" px="5">
                      {item.symbol}
                    </Td>
                    <Td
                      color="#2D3436"
                      w="250px"
                      px="5"
                      borderBottomWidth="1px"
                      borderColor="#DFE6E9"
                    >
                      {item.tokenAddress}
                    </Td>
                    <Td
                      color="#2D3436"
                      w="150px"
                      px="5"
                      borderBottomWidth="1px"
                      borderColor="#DFE6E9"
                    >
                      {truncateAddress(item.cTokenAddress)}
                    </Td>
                    <Td
                      color="#2D3436"
                      w="100px"
                      px="5"
                      borderBottomWidth="1px"
                      borderColor="#DFE6E9"
                    >
                      {item.collateralFactor}
                    </Td>
                    <Td
                      color="#2D3436"
                      w="150px"
                      px="5"
                      borderBottomWidth="1px"
                      borderColor="#DFE6E9"
                    >
                      {`$${toDecimal(item.priceUsd, 8)}`}
                    </Td>
                    <Td
                      color="#2D3436"
                      w="150px"
                      px="5"
                      borderBottomWidth="1px"
                      borderColor="#DFE6E9"
                    >
                      {toDecimal(item.supplyRewardRate, 6)}
                    </Td>
                    <Td
                      color="#2D3436"
                      w="150px"
                      px="5"
                      borderBottomWidth="1px"
                      borderColor="#DFE6E9"
                    >
                      {toDecimal(item.borrowRewardRate, 6)}
                    </Td>
                    <Td
                      color="#2D3436"
                      w="150px"
                      px="5"
                      borderBottomWidth="1px"
                      borderColor="#DFE6E9"
                    >
                      {truncateAddress(item.interestRateModel)}
                    </Td>
                    <Td
                      color="#2D3436"
                      w="120px"
                      px="5"
                      borderBottomWidth="1px"
                      borderColor="#DFE6E9"
                    >
                      {`$${item.reserveFunds}`}
                    </Td>
                    <Td
                      color="#2D3436"
                      w="120px"
                      px="5"
                      borderBottomWidth="1px"
                      borderColor="#DFE6E9"
                    >
                      <Flex justifyContent="center">
                        <Button
                          bg="#5a72c6"
                          // size="xl"
                          h="30px"
                          w="95px"
                          fontSize="15px"
                          borderRadius="5"
                          px="10"
                          color="white"
                          fontWeight="bold"
                          isDisabled={!isUserAdmin}
                          onClick={() => reduceFunds(item.totalReserves, item.cTokenAddress)}
                        >
                          Withdraw
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
        <Box
          bg="white"
          my="35px"
          py="20px"
          borderRadius={10}
          px="30px"
          boxShadow="0px 4px 14px rgba(0, 0, 0, 0.15)"
        >
          <TableContainer borderColor="black" borderRadius="10px">
            <Table variant="striped" borderColor="black" borderRadius="10px">
              <TableCaption placement="top">
                <Flex justifyContent="flex-start" px="10">
                  <Text h="40px" fontWeight="bold" px="10" color="#2D3436" fontSize="19px">
                    Interest Rate Models
                  </Text>
                </Flex>
              </TableCaption>
              <Thead justifyContent="center" alignItems="center">
                <Tr
                  h="50px"
                  borderBottomWidth="1px"
                  color="#707070"
                  fontSize="17px"
                  borderRadius="10px"
                >
                  <Th color="#707070" borderLeftWidth="1px" borderColor="#E7E7E7" w="390px" px="5">
                    <Flex justifyContent="center">Address</Flex>
                  </Th>
                  <Th color="#707070" borderLeftWidth="1px" borderColor="#E7E7E7" w="350px" px="5">
                    <Flex justifyContent="center">Blocks per year</Flex>
                  </Th>
                  <Th color="#707070" borderLeftWidth="1px" borderColor="#E7E7E7" w="350px" px="5">
                    <Flex justifyContent="center">Base Rate</Flex>
                  </Th>
                  <Th color="#707070" borderLeftWidth="1px" borderColor="#E7E7E7" w="350px" px="5">
                    <Flex justifyContent="center">Utilization Multiplier</Flex>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {irData.map((item: any) => (
                  <Tr
                    h="50px"
                    borderBottomWidth="1px"
                    borderColor="#DFE6E9"
                    color="#707070"
                    fontSize="16px"
                  >
                    <Td
                      color="#2D3436"
                      w="390px"
                      px="5"
                      borderBottomWidth="1px"
                      borderColor="#DFE6E9"
                    >
                      <Flex justifyContent="center">{item.address}</Flex>
                    </Td>
                    <Td color="black" fontWeight="500" w="350px" px="5">
                      <Flex justifyContent="center">{item.blocksPerYear}</Flex>
                    </Td>
                    <Td color="black" fontWeight="500" w="350px" px="5">
                      <Flex justifyContent="center">{`${toDecimal(item.baseRate, 2)}%`}</Flex>
                    </Td>
                    <Td color="black" fontWeight="500" w="350px" px="5">
                      <Flex justifyContent="center">{`${toDecimal(item.multiplier, 2)}%`}</Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
        <Box
          bg="white"
          my="35px"
          py="20px"
          borderRadius={10}
          px="30px"
          boxShadow="0px 4px 14px rgba(0, 0, 0, 0.15)"
        >
          <TableContainer borderColor="black" borderRadius="10px">
            <Table variant="striped" borderColor="black" borderRadius="10px">
              <TableCaption placement="top">
                <Flex justifyContent="flex-start" px="10">
                  <Text h="40px" fontWeight="bold" px="10" color="#2D3436" fontSize="19px">
                    Jump Rate Models
                  </Text>
                </Flex>
              </TableCaption>
              <Thead justifyContent="center" alignItems="center">
                <Tr
                  h="50px"
                  borderBottomWidth="1px"
                  color="#707070"
                  fontSize="17px"
                  borderRadius="10px"
                >
                  <Th color="#707070" borderLeftWidth="1px" borderColor="#E7E7E7" w="390px" px="5">
                    <Flex justifyContent="center">ERC20 Address</Flex>
                  </Th>
                  <Th color="#707070" borderLeftWidth="1px" borderColor="#E7E7E7" w="250px" px="5">
                    <Flex justifyContent="center">Blocks per year</Flex>
                  </Th>
                  <Th color="#707070" borderLeftWidth="1px" borderColor="#E7E7E7" w="150px" px="5">
                    <Flex justifyContent="center">Base Rate</Flex>
                  </Th>
                  <Th color="#707070" borderLeftWidth="1px" borderColor="#E7E7E7" w="150px" px="5">
                    <Flex justifyContent="center">Kink</Flex>
                  </Th>
                  <Th color="#707070" borderLeftWidth="1px" borderColor="#E7E7E7" w="250px" px="5">
                    <Flex justifyContent="center">Multiplier Pre Kink</Flex>
                  </Th>
                  <Th color="#707070" borderLeftWidth="1px" borderColor="#E7E7E7" w="250px" px="5">
                    <Flex justifyContent="center">Multiplier Post Kink</Flex>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {jumpIrData.map((item: any) => (
                  <Tr
                    h="50px"
                    borderBottomWidth="1px"
                    borderColor="#DFE6E9"
                    color="#707070"
                    fontSize="16px"
                  >
                    <Td
                      color="#2D3436"
                      w="390px"
                      px="5"
                      borderBottomWidth="1px"
                      borderColor="#DFE6E9"
                    >
                      <Flex justifyContent="center">{item.address}</Flex>
                    </Td>
                    <Td color="black" fontWeight="500" w="250px" px="5">
                      <Flex justifyContent="center">{item.blocksPerYear}</Flex>
                    </Td>
                    <Td color="black" fontWeight="500" w="150px" px="5">
                      <Flex justifyContent="center">{`${toDecimal(item.baseRate, 2)}%`}</Flex>
                    </Td>
                    <Td color="black" fontWeight="500" w="150px" px="5">
                      <Flex justifyContent="center">{`${toDecimal(item.kink, 0)}%`}</Flex>
                    </Td>
                    <Td color="black" fontWeight="500" w="250px" px="5">
                      <Flex justifyContent="center">
                        {`${toDecimal(item.multiplierPreKink, 2)}%`}
                      </Flex>
                    </Td>
                    <Td color="black" fontWeight="500" w="250px" px="5">
                      <Flex justifyContent="center">
                        {`${toDecimal(item.multiplierPostKink, 2)}%`}
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
        {/* First DUO */}
        <Flex justifyContent="space-between" alignItems="center">
          <Box
            bg="white"
            minW="49%"
            minH="280px"
            my="25px"
            py="20px"
            borderRadius={10}
            px="30px"
            boxShadow="0px 4px 14px rgba(0, 0, 0, 0.15)"
          >
            <HStack justifyContent="space-between" pb="10" display={['none', 'flex']}>
              <Text fontSize="19px" fontWeight="bold" color="#2D3436">
                Update Interest Rate Model
              </Text>
            </HStack>
            <Flex flexDirection="column">
              <Input
                variant="filled"
                placeholder="CToken Address"
                w="100%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                onChange={e => setUpdateIr({ ...updateIr, tokenAddress: e.target.value })}
              />
              <Input
                variant="filled"
                placeholder="IR Model Address"
                w="100%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                onChange={e => setUpdateIr({ ...updateIr, irAddress: e.target.value })}
              />
              <Flex justifyContent="center">
                <Button
                  bg="#524eb7"
                  size="lg"
                  borderRadius="5"
                  px="10"
                  my={20}
                  color="white"
                  fontWeight="bold"
                  h="50px"
                  w="30%"
                  fontSize="18px"
                  justifySelf="center"
                  onClick={() => updateIrModel()}
                  isDisabled={!isUserAdmin}
                >
                  Submit
                </Button>
              </Flex>
            </Flex>
          </Box>
          <Box
            bg="white"
            minW="49%"
            minH="280px"
            my="25px"
            py="20px"
            borderRadius={10}
            px="30px"
            boxShadow="0px 4px 14px rgba(0, 0, 0, 0.15)"
          >
            <HStack justifyContent="space-between" pb="10" display={['none', 'flex']}>
              <Text fontSize="19px" fontWeight="bold" color="#2D3436">
                Update Collateralization Ratio
              </Text>
            </HStack>
            <Flex flexDirection="column">
              <Input
                variant="filled"
                placeholder="CToken Address"
                w="100%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                onChange={e => setCTkCollateralAddress(e.target.value)}
              />
              <Input
                variant="filled"
                placeholder="New Collateralization Ratio"
                w="100%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                onChange={e => setCTokenRatio(e.target.value)}
              />
              <Flex justifyContent="center">
                <Button
                  bg="#524eb7"
                  size="lg"
                  borderRadius="5"
                  px="10"
                  my={20}
                  color="white"
                  fontWeight="bold"
                  h="50px"
                  w="30%"
                  fontSize="18px"
                  justifySelf="center"
                  isDisabled={!isUserAdmin}
                  onClick={() => updateCR()}
                >
                  Submit
                </Button>
              </Flex>
            </Flex>
          </Box>
        </Flex>
        {/* Second DUO */}
        <Flex justifyContent="space-between" alignItems="center">
          <Box
            bg="white"
            minW="49%"
            minH="280px"
            my="25px"
            py="20px"
            borderRadius={10}
            px="30px"
            boxShadow="0px 4px 14px rgba(0, 0, 0, 0.15)"
          >
            <HStack justifyContent="space-between" pb="10" display={['none', 'flex']}>
              <Text fontSize="19px" fontWeight="bold" color="#2D3436">
                Set Reward Rate
              </Text>
            </HStack>
            <Flex flexDirection="column">
              <Text mx={10} mb={8} mt={10} px={2} color="black" fontWeight="600" fontSize="18px">
                Current Reward Rate: {compRewardRate}
              </Text>
              <Input
                variant="filled"
                placeholder="Amount"
                w="100%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                onChange={e => setRewardsAmount(e.target.value)}
              />
              <Flex justifyContent="center">
                <Button
                  bg="#524eb7"
                  size="lg"
                  borderRadius="5"
                  px="10"
                  my={20}
                  color="white"
                  fontWeight="bold"
                  h="50px"
                  w="30%"
                  fontSize="18px"
                  justifySelf="center"
                  isDisabled={!isUserAdmin}
                  onClick={() => updateRewardsRate()}
                >
                  Submit
                </Button>
              </Flex>
            </Flex>
          </Box>
          <Box
            bg="white"
            minW="49%"
            minH="280px"
            my="25px"
            py="20px"
            borderRadius={10}
            px="30px"
            boxShadow="0px 4px 14px rgba(0, 0, 0, 0.15)"
          >
            <HStack justifyContent="space-between" pb="10" display={['none', 'flex']}>
              <Text fontSize="19px" fontWeight="bold" color="#2D3436">
                Transfer Rewards
              </Text>
            </HStack>
            <Flex flexDirection="column">
              <Text mx={10} mb={8} mt={10} px={2} color="black" fontWeight="600" fontSize="18px">
                Current Reward Amount: {compRewardAmount}
              </Text>
              <Input
                variant="filled"
                placeholder="Amount"
                w="100%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                onChange={e => {
                  setTransferRewAmt(e.target.value);
                }}
              />
              <Flex justifyContent="center">
                <Button
                  bg="#524eb7"
                  size="lg"
                  borderRadius="5"
                  px="10"
                  my={20}
                  color="white"
                  fontWeight="bold"
                  h="50px"
                  w="30%"
                  fontSize="18px"
                  justifySelf="center"
                  isDisabled={!isUserAdmin}
                  onClick={() => transReward()}
                >
                  Submit
                </Button>
              </Flex>
            </Flex>
          </Box>
        </Flex>
        {/* Third DUO */}
        <Flex justifyContent="space-between" alignItems="center">
          <Box
            bg="white"
            minW="49%"
            minH="280px"
            my="25px"
            py="20px"
            borderRadius={10}
            px="30px"
            boxShadow="0px 4px 14px rgba(0, 0, 0, 0.15)"
          >
            <HStack justifyContent="space-between" pb="10" display={['none', 'flex']}>
              <Text fontSize="19px" fontWeight="bold" color="#2D3436">
                Set New Oracle CToken Price
              </Text>
            </HStack>
            <Flex flexDirection="column">
              <Input
                variant="filled"
                placeholder="CToken Address"
                w="100%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                onChange={e =>
                  setConfigDataObj({ ...configDataObj, cTokenAddress: e.target.value })
                }
              />
              <Input
                variant="filled"
                placeholder="Price in USD"
                w="100%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                onChange={e => setConfigDataObj({ ...configDataObj, price: e.target.value })}
              />
              <Flex justifyContent="center">
                <Button
                  bg="#524eb7"
                  size="lg"
                  borderRadius="5"
                  px="10"
                  my={20}
                  color="white"
                  fontWeight="bold"
                  h="50px"
                  w="30%"
                  fontSize="18px"
                  justifySelf="center"
                  isDisabled={!isUserAdmin}
                  onClick={() => updateOracleCTPrice()}
                >
                  Submit
                </Button>
              </Flex>
            </Flex>
          </Box>
          <Box
            bg="white"
            minW="49%"
            minH="280px"
            my="25px"
            py="20px"
            borderRadius={10}
            px="30px"
            boxShadow="0px 4px 14px rgba(0, 0, 0, 0.15)"
          >
            <HStack justifyContent="space-between" pb="10" display={['none', 'flex']}>
              <Text fontSize="19px" fontWeight="bold" color="#2D3436">
                Set Reserve Factor
              </Text>
            </HStack>
            <Flex flexDirection="column">
              <Input
                variant="filled"
                placeholder="CToken Address"
                w="100%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                onChange={e =>
                  setUpdateReserveFactor({ ...updateReserveFactor, cTokenAddress: e.target.value })
                }
              />
              <Input
                variant="filled"
                placeholder="Amount"
                w="100%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                onChange={e =>
                  setUpdateReserveFactor({ ...updateReserveFactor, amount: e.target.value })
                }
              />
              <Flex justifyContent="center">
                <Button
                  bg="#524eb7"
                  size="lg"
                  borderRadius="5"
                  px="10"
                  my={20}
                  color="white"
                  fontWeight="bold"
                  h="50px"
                  w="30%"
                  fontSize="18px"
                  justifySelf="center"
                  isDisabled={!isUserAdmin}
                  onClick={() => updateCtokenReserveFactor()}
                >
                  Submit
                </Button>
              </Flex>
            </Flex>
          </Box>
        </Flex>
        {/* Fourth DUO */}
        <Flex justifyContent="space-between" alignItems="center">
          <Box
            bg="white"
            minW="49%"
            minH="280px"
            my="25px"
            py="20px"
            borderRadius={10}
            px="30px"
            boxShadow="0px 4px 14px rgba(0, 0, 0, 0.15)"
          >
            <HStack justifyContent="space-between" pb="10" display={['none', 'flex']}>
              <Text fontSize="19px" fontWeight="bold" color="#2D3436">
                Update Interest Rate Model Parameters
              </Text>
            </HStack>
            <Flex flexDirection="column">
              <Flex justifyContent="space-between" alignItems="center">
                <Input
                  variant="filled"
                  placeholder="IR Model Address"
                  w="100%"
                  mx={10}
                  my={20}
                  px={8}
                  h="45px"
                  borderWidth="1px"
                  borderColor="#d3d3d3"
                  focusBorderColor="#d3d3d3"
                  borderRadius="5px"
                  // updateIrParams.irAddress
                  onChange={e =>
                    setUpdateIrParams({ ...updateIrParams, irAddress: e.target.value })
                  }
                />
              </Flex>
              <Flex justifyContent="space-between" alignItems="center">
                <Input
                  variant="filled"
                  placeholder="Base Rate"
                  w="100%"
                  mx={10}
                  my={20}
                  px={8}
                  h="45px"
                  borderWidth="1px"
                  borderColor="#d3d3d3"
                  focusBorderColor="#d3d3d3"
                  borderRadius="5px"
                  // updateIrParams.baseRate
                  onChange={e => setUpdateIrParams({ ...updateIrParams, baseRate: e.target.value })}
                />
                <Input
                  variant="filled"
                  placeholder="Kink"
                  w="100%"
                  mx={10}
                  my={20}
                  px={8}
                  h="45px"
                  borderWidth="1px"
                  borderColor="#d3d3d3"
                  focusBorderColor="#d3d3d3"
                  borderRadius="5px"
                  // updateIrParams.kink
                  onChange={e => setUpdateIrParams({ ...updateIrParams, kink: e.target.value })}
                />
              </Flex>
              <Flex justifyContent="space-between" alignItems="center">
                <Input
                  variant="filled"
                  placeholder="Multiplier Pre Kink"
                  w="100%"
                  mx={10}
                  my={20}
                  px={8}
                  h="45px"
                  borderWidth="1px"
                  borderColor="#d3d3d3"
                  focusBorderColor="#d3d3d3"
                  borderRadius="5px"
                  // updateIrParams.multiplierPreKink
                  onChange={e =>
                    setUpdateIrParams({ ...updateIrParams, multiplierPreKink: e.target.value })
                  }
                />
                <Input
                  variant="filled"
                  placeholder="Multiplier Post Kink"
                  w="100%"
                  mx={10}
                  my={20}
                  px={8}
                  h="45px"
                  borderWidth="1px"
                  borderColor="#d3d3d3"
                  focusBorderColor="#d3d3d3"
                  borderRadius="5px"
                  // updateIrParams.multiplierPostKink
                  onChange={e =>
                    setUpdateIrParams({ ...updateIrParams, multiplierPostKink: e.target.value })
                  }
                />
              </Flex>
              <Flex justifyContent="center">
                <Button
                  bg="#524eb7"
                  size="lg"
                  borderRadius="5"
                  px="10"
                  my={20}
                  color="white"
                  fontWeight="bold"
                  h="50px"
                  w="30%"
                  fontSize="18px"
                  justifySelf="center"
                  onClick={() => updateIrModelParams()}
                  isDisabled={!isUserAdmin}
                >
                  Submit
                </Button>
              </Flex>
            </Flex>
          </Box>
          <Box
            bg="white"
            minW="49%"
            minH="280px"
            my="25px"
            py="20px"
            borderRadius={10}
            px="30px"
            boxShadow="0px 4px 14px rgba(0, 0, 0, 0.15)"
          >
            <HStack justifyContent="space-between" pb="10" display={['none', 'flex']}>
              <Text fontSize="19px" fontWeight="bold" color="#2D3436">
                Set Supply & Borrow Reward Rate
              </Text>
            </HStack>
            <Flex flexDirection="column">
              <Input
                variant="filled"
                placeholder="CToken Address"
                w="100%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                // updateCtokenRewardsRate.cTokenAddress
                onChange={e =>
                  setUpdateCtokenRewardsRate({
                    ...updateCtokenRewardsRate,
                    cTokenAddress: e.target.value,
                  })
                }
              />
              <Input
                variant="filled"
                placeholder="Supply speeds"
                w="100%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                // updateCtokenRewardsRate.supplySpeed
                onChange={e =>
                  setUpdateCtokenRewardsRate({
                    ...updateCtokenRewardsRate,
                    supplySpeed: e.target.value,
                  })
                }
              />
              <Input
                variant="filled"
                placeholder="Borrow speeds"
                w="100%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                // updateCtokenRewardsRate.borrowSpeed
                onChange={e =>
                  setUpdateCtokenRewardsRate({
                    ...updateCtokenRewardsRate,
                    borrowSpeed: e.target.value,
                  })
                }
              />
              <Flex justifyContent="center">
                <Button
                  bg="#524eb7"
                  size="lg"
                  borderRadius="5"
                  px="10"
                  my={20}
                  color="white"
                  fontWeight="bold"
                  h="50px"
                  w="30%"
                  fontSize="18px"
                  justifySelf="center"
                  isDisabled={!isUserAdmin}
                  onClick={() => updateCtokenSupplyAndBorrowRewardRate()}
                >
                  Submit
                </Button>
              </Flex>
            </Flex>
          </Box>
        </Flex>
        {/* Fifth DUO */}
        <Flex justifyContent="space-between" alignItems="center">
          <Box
            bg="white"
            minW="49%"
            minH="280px"
            my="25px"
            py="20px"
            borderRadius={10}
            px="30px"
            boxShadow="0px 4px 14px rgba(0, 0, 0, 0.15)"
          >
            <HStack justifyContent="space-between" pb="10" display={['none', 'flex']}>
              <Text fontSize="19px" fontWeight="bold" color="#2D3436">
                Set Market Borrow Limit
              </Text>
            </HStack>
            <Flex flexDirection="column">
              <Input
                variant="filled"
                placeholder="CToken Address"
                w="100%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                // updateMarketBorrowLimit.cTokenAddress
                onChange={e =>
                  setUpdateMarketBorrowLimit({
                    ...updateMarketBorrowLimit,
                    cTokenAddress: e.target.value,
                  })
                }
              />
              <Input
                variant="filled"
                placeholder="Market Borrow Limit (# of Underlying Tokens)"
                w="100%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                onChange={e =>
                  setUpdateMarketBorrowLimit({
                    ...updateMarketBorrowLimit,
                    borrowLimit: e.target.value,
                  })
                }
              />
              <Flex justifyContent="center">
                <Button
                  bg="#524eb7"
                  size="lg"
                  borderRadius="5"
                  px="10"
                  my={20}
                  color="white"
                  fontWeight="bold"
                  h="50px"
                  w="30%"
                  fontSize="18px"
                  justifySelf="center"
                  isDisabled={!isUserAdmin}
                  onClick={() => updateBorrowLimit()}
                >
                  Submit
                </Button>
              </Flex>
            </Flex>
          </Box>
          <Box
            bg="white"
            minW="49%"
            minH="280px"
            my="25px"
            py="20px"
            borderRadius={10}
            px="30px"
            boxShadow="0px 4px 14px rgba(0, 0, 0, 0.15)"
          >
            <HStack justifyContent="space-between" pb="10" display={['none', 'flex']}>
              <Text fontSize="19px" fontWeight="bold" color="#2D3436">
                Pause/Unpause Borrow
              </Text>
            </HStack>
            <Flex flexDirection="column">
              <Input
                variant="filled"
                placeholder="CToken Address"
                w="100%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                onChange={e =>
                  setUpdateMarketBorrowLimit({
                    ...updateMarketBorrowLimit,
                    borrowPauseCToken: e.target.value,
                  })
                }
              />
              <Input
                variant="filled"
                placeholder="State (true for paused, false for unpaused)"
                w="100%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                onChange={e =>
                  setUpdateMarketBorrowLimit({
                    ...updateMarketBorrowLimit,
                    borrowPauseState: e.target.value,
                  })
                }
              />
              <Flex justifyContent="center">
                <Button
                  bg="#524eb7"
                  size="lg"
                  borderRadius="5"
                  px="10"
                  my={20}
                  color="white"
                  fontWeight="bold"
                  h="50px"
                  w="30%"
                  fontSize="18px"
                  justifySelf="center"
                  isDisabled={!isUserAdmin}
                  onClick={() => pauseUnpauseBorrow()}
                >
                  Submit
                </Button>
              </Flex>
            </Flex>
          </Box>
        </Flex>
        {/* Sixth SOLO */}
        <Flex justifyContent="space-between" alignItems="center">
          <Box
            bg="white"
            minW="49%"
            minH="280px"
            my="25px"
            py="20px"
            borderRadius={10}
            px="30px"
            boxShadow="0px 4px 14px rgba(0, 0, 0, 0.15)"
          >
            <HStack justifyContent="space-between" pb="10" display={['none', 'flex']}>
              <Text fontSize="19px" fontWeight="bold" color="#2D3436">
                Pause/Unpause Supply
              </Text>
            </HStack>
            <Flex flexDirection="column">
              <Input
                variant="filled"
                placeholder="CToken Address"
                w="100%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                // updateMarketBorrowLimit.supplyPauseCToken"
                onChange={e =>
                  setUpdateMarketBorrowLimit({
                    ...updateMarketBorrowLimit,
                    supplyPauseCToken: e.target.value,
                  })
                }
              />
              <Input
                variant="filled"
                placeholder="State (true for paused, false for unpaused)"
                w="100%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                // updateMarketBorrowLimit.supplyPauseState
                onChange={e =>
                  setUpdateMarketBorrowLimit({
                    ...updateMarketBorrowLimit,
                    supplyPauseState: e.target.value,
                  })
                }
              />
              <Flex justifyContent="center">
                <Button
                  bg="#524eb7"
                  size="lg"
                  borderRadius="5"
                  px="10"
                  my={20}
                  color="white"
                  fontWeight="bold"
                  h="50px"
                  w="30%"
                  fontSize="18px"
                  justifySelf="center"
                  isDisabled={!isUserAdmin}
                  onClick={() => pauseUnpauseSupply()}
                >
                  Submit
                </Button>
              </Flex>
            </Flex>
          </Box>
        </Flex>
        {/* Cards End Here */}
      </Box>
    </Flex>
  );
};

const mapStateToProps = ({ account }: State) => ({
  settings: account.setting,
});

export default connect(mapStateToProps, accountActionCreators)(Admin);
