import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useWeb3, useWeb3Account } from 'clients/web3';
import { ethers, Wallet } from 'ethers';
import BigNumber from 'bignumber.js';
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
  Checkbox,
  Switch,
} from '@chakra-ui/react';
// import { Card } from '../Basic/Card';
import { useContractDirectly } from 'clients/contracts';
import { toBN, toDecimal } from 'utilities/functions';
import { truncateAddress } from 'utilities/truncateAddress';
import { State } from '../../core/modules/initialState';
import { accountActionCreators } from '../../core/modules/account/actions';
import * as Master from '../../constants/contracts/contracts/Master.json';
import * as AssetToken from '../../constants/contracts/contracts/AssetToken.json';
import * as ERC20Detailed from '../../constants/contracts/contracts/ERC20Detailed.json';

declare const window: any;

const contractAddresses = {
  Master: '0xae5A9543299dfa67c2cE604DA0Fbd981625ADE38',
};

const Dashboard = () => {
  const { account } = useWeb3Account();
  const web3 = useWeb3();
  const masterContract: any = useContractDirectly(Master.abi, contractAddresses.Master, web3);
  const GAS_PRICE = ethers.utils.parseUnits('20', 'gwei');

  const initState = {
    // dueDate: '',
    // erc20Addrs: '',
    // buyerDetailSwitch: false,
    // emailid: ''
    url: '',
    name: '',
    symbol: '',
    initialSupply: '',
    positiveSBTClass: '',
    negativeSBTClass: '',
  };

  const [formState, setFormState] = useState<any>(initState);
  const [allAssetsData, setAllAssetsData] = useState<any>([]);
  const [assetData, setAssetData] = useState<any>([]);
  const [loadComplete, setLoadComplete] = useState<any>([]);
  const [userAssetData, setUserAssetData] = useState<any>([]);
  const [mintAmount, setMintAmount] = useState<any>('');

  const getNumberStr = (hexNum: any) => ethers.BigNumber.from(hexNum).toString();

  const deployNewAsset = async () => {
    const data = { ...formState };
    try {
      // data.emailid = data.buyerDetailSwitch ? data.emailid : '';
      // if (data.dueDate) {
      //   const date: any = new Date();
      //   date.setDate(date.getDate() + parseInt(data.dueDate, 10));
      //   const dueDateTS: any = Math.floor(date.getTime() / 1000);
      //   data.dueDate = dueDateTS;
      // } else {
      //   data.dueDate = 0;
      // }
      try {
        const overrides = {
          gasPrice: GAS_PRICE,
        };
        const PaymentTokenC: any = useContractDirectly(ERC20Detailed.abi, data.erc20Addrs, web3);
        data.decimals = await PaymentTokenC.methods.decimals().call();
        const mulBy = 10 ** data.decimals;
        data.initialSupply = parseFloat(data.initialSupply) * mulBy;
        data.initialSupply = data.initialSupply.toLocaleString('fullwide', { useGrouping: false });
        const address = account ?? '';
        const tx = await masterContract.methods
          .addAsset(
            // data.url,
            // data.dueDate,
            // data.buyerDetailSwitch,
            // data.emailid,
            // data.erc20Addrs,
            data.name,
            data.symbol,
            data.decimals,
            data.initialSupply,
            data.positiveSBTClass,
            data.negativeSBTClass,
            overrides,
          )
          .send({ from: address });
        // await this.provider.waitForTransaction(tx.hash);
        const myWeb3: any = new ethers.providers.Web3Provider(window.ethereum);
        await myWeb3.waitForTransaction(tx.hash);
        setFormState(initState);
        return tx;
      } catch (error) {
        throw error;
      }
    } catch (error) {
      console.error(error);
    }
    return true;
  };

  const getErc20Balance = async (contractAddress: any, userAddress: any) => {
    const TokenC: any = useContractDirectly(AssetToken.abi, contractAddress, web3);
    const decimals = await TokenC.methods.decimals().call();
    let balance = await TokenC.methods.balanceOf(userAddress).call();
    balance = getNumberStr(balance);
    const mulBy = 10 ** decimals;
    balance = parseFloat(balance) / mulBy;
    return balance;
  };

  const initCompData = async () => {
    const addressArray = await masterContract.methods.getAllAssets().call();
    // setAllAssetsData(myAllAssetData);
    const myAssetData = [];

    let i = 0;
    for (i = 0; i < addressArray.length; i++) {
      const address = addressArray[i];
      const asset = {} as any;
      asset.address = address;
      asset.id = myAssetData.length;
      // myAssetData.push(asset);
      // this.initAsset(asset);
      // //////////
      // //////////
      const AssetContract: any = useContractDirectly(AssetToken.abi, asset.address, web3);
      asset.assetToken = asset.address;
      // AssetContract.documentUrl().then((documentUrl) => {
      //   asset.documentUrl = documentUrl;
      // });
      // AssetContract.dueDate().then((dueDate) => {
      //   asset.dueDate = this.formatDate(dueDate);
      // });
      AssetContract.methods
        .symbol()
        .call()
        .then((tokenSymbol: any) => {
          asset.tokenSymbol = tokenSymbol;
        });
      AssetContract.methods
        .decimals()
        .call()
        .then((tokenDecimals: any) => {
          asset.tokenDecimals = tokenDecimals;
          AssetContract.methods
            .totalSupply()
            .call()
            .then((assetTokenSupply: any) => {
              const divBy = 10 ** tokenDecimals;
              assetTokenSupply = getNumberStr(assetTokenSupply);
              asset.assetTokenSupply = parseFloat(assetTokenSupply) / divBy;
            });
        });
      AssetContract.methods
        .owner()
        .call()
        .then((ownerAddress: any) => {
          asset.ownerAddress = ownerAddress;
        });
      AssetContract.methods
        .erc20Token()
        .call()
        .then((paymentToken: any) => {
          asset.paymentToken = paymentToken;
          const PaymentTokenC: any = useContractDirectly(
            ERC20Detailed.abi,
            asset.paymentToken,
            web3,
          );
          PaymentTokenC.methods
            .symbol()
            .call()
            .then((paymentTokenSymbol: any) => {
              asset.paymentTokenSymbol = paymentTokenSymbol;
            });
        });
      // AssetContract.methods
      //   .collectBuyerDetails()
      //   .call()
      //   .then((collectBuyerDetails: any) => {
      //     asset.collectBuyerDetails = collectBuyerDetails;
      //   });
      AssetContract.methods
        .state()
        .call()
        .then((state: any) => {
          asset.state = state;
        });
      // //////////
      // //////////
      myAssetData.push(asset);
    }
    // await this.getAllAssetData();
    // const addressArray = await this.getAllAssets();
    // setAllAssetsData(myAllAssetData);
    // return addressArray;
    // this.initAllAssetData(addressArray);
    // if (this.allAssetsData.length === 0) {
    //   cApp.unblockPage();
    //   return;
    // }

    setAllAssetsData(myAssetData);
    // await this.getAllAssetData();
    // if (this.allAssetsData.length === 0) {
    //   cApp.unblockPage();
    //   return;
    // }
    // this.userAddress = await this.web3Service.getUserAddress();
    // this.filterUserAssets();

    const myAddress = account ?? '';
    const myUserAssetData = myAssetData.filter(
      (asset: any) =>
        !!asset.ownerAddress && myAddress.toLowerCase() === asset.ownerAddress.toLowerCase(),
    );
    setUserAssetData(myUserAssetData);

    // await getUserBalances();
    //
    //
    myAssetData.forEach((asset: any) => {
      getErc20Balance(asset.assetToken, myAddress).then((assetTokenBalance: any) => {
        asset.assetTokenBalance = assetTokenBalance;
      });
      getErc20Balance(asset.paymentToken, myAddress).then((paymentTokenBalance: any) => {
        asset.paymentTokenBalance = paymentTokenBalance;
      });
    });
    //
    //
    setLoadComplete(true);
    // cApp.unblockPage();
  };

  // const mintAssetToken = async () => {
  //   try {
  //     if (!mintAmount) {
  //       return undefined;
  //     }
  //     if (parseFloat(mintAmount) < 0) {
  //       return undefined;
  //     }
  //     const assetAddress = allAssetsData[selectedAssetIndex].address;
  //     try {
  //       const overrides = {
  //         gasPrice: GAS_PRICE,
  //       };
  //       const AssetC: any = useContractDirectly(AssetToken.abi, assetAddress, web3);
  //       const tokenDecimals = await AssetC.methods.decimals().call();
  //       let amountInDec: any = parseFloat(mintAmount) * Math.pow(10, tokenDecimals);
  //       amountInDec = amountInDec.toLocaleString('fullwide', {
  //         useGrouping: false,
  //       });
  //       const tx = await AssetC.mintAssetTokens(amountInDec, overrides);
  //       const myWeb3: any = new ethers.providers.Web3Provider(window.ethereum);
  //       await myWeb3.waitForTransaction(tx.hash);
  //     } catch (error) {
  //       throw error;
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  useEffect(() => {
    initCompData();
  }, []);

  return (
    <Flex justifyContent="center" alignItems="center">
      <Box>
        <Flex justifyContent="center" alignItems="flex-start">
          <Box
            bg="white"
            my="25px"
            py="20px"
            borderRadius={10}
            px="30px"
            boxShadow="0px 4px 14px rgba(0, 0, 0, 0.15)"
            w="720px"
            mr="30px"
            minH="750px"
          >
            <TableContainer borderColor="black" borderRadius="10px">
              <Table variant="striped" borderColor="black" borderRadius="10px">
                <TableCaption placement="top">
                  <Flex justifyContent="flex-start" px="10">
                    <Text h="40px" fontWeight="bold" px="10" color="#2D3436" fontSize="19px">
                      Your Deployed Assets
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
                    <Th
                      color="#707070"
                      borderLeftWidth="1px"
                      borderColor="#E7E7E7"
                      w="150px"
                      px="5"
                    >
                      <Flex justifyContent="center">Token Name</Flex>
                    </Th>
                    <Th
                      color="#707070"
                      borderLeftWidth="1px"
                      borderColor="#E7E7E7"
                      w="250px"
                      px="5"
                    >
                      <Flex justifyContent="center">Due Date</Flex>
                    </Th>
                    <Th
                      color="#707070"
                      borderLeftWidth="1px"
                      borderColor="#E7E7E7"
                      w="250px"
                      px="5"
                    >
                      <Flex justifyContent="center">Document Url</Flex>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {userAssetData.map((item: any) => (
                    <Tr
                      h="50px"
                      borderBottomWidth="1px"
                      borderColor="#DFE6E9"
                      color="#707070"
                      fontSize="16px"
                    >
                      <Td
                        color="#2D3436"
                        w="150px"
                        px="5"
                        borderBottomWidth="1px"
                        borderColor="#DFE6E9"
                      >
                        <Flex justifyContent="center">{item.tokenSymbol}</Flex>
                      </Td>
                      <Td color="black" fontWeight="500" w="250px" px="5">
                        <Flex justifyContent="center">{item.symbol}</Flex>
                      </Td>
                      <Td color="black" fontWeight="500" w="250px" px="5">
                        <Flex justifyContent="center">{item.dueDate}</Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
          <Box
            bg="white"
            my="25px"
            py="20px"
            borderRadius={10}
            px="30px"
            boxShadow="0px 4px 14px rgba(0, 0, 0, 0.15)"
            w="880px"
            minH="750px"
          >
            <Box h="50px" borderBottomWidth="1px" borderColor="#DFE6E9" alignItems="center">
              <Text h="40px" fontWeight="bold" px="10" mt="15" color="#2D3436" fontSize="19px">
                Deploy New
              </Text>
            </Box>
            <Box>
              {/* <Input
                variant="filled"
                placeholder="Document Url"
                w="90%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                onChange={e => {
                  setFormState({ ...formState, documentUrl: e.target.value });
                }}
              />
              <Input
                variant="filled"
                placeholder="Due Time (days)"
                w="90%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                onChange={e => {
                  setFormState({ ...formState, dueTime: e.target.value });
                }}
              />
              <Input
                variant="filled"
                placeholder="Payment Token"
                w="90%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                onChange={e => {
                  setFormState({ ...formState, paymentToken: e.target.value });
                }}
              /> */}
              <Input
                variant="filled"
                placeholder="New Token Name"
                w="90%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                onChange={e => {
                  setFormState({ ...formState, newTokenName: e.target.value });
                }}
              />
              <Input
                variant="filled"
                placeholder="New Token Symbol"
                w="90%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                onChange={e => {
                  setFormState({ ...formState, newTokenSymbol: e.target.value });
                }}
              />
              <Input
                variant="filled"
                placeholder="Initial Supply"
                w="90%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                onChange={e => {
                  setFormState({ ...formState, initialSupply: e.target.value });
                }}
              />
              <Input
                variant="filled"
                placeholder="Positive SBT Class"
                w="90%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                onChange={e => {
                  setFormState({ ...formState, positiveSBTClass: e.target.value });
                }}
              />
              <Input
                variant="filled"
                placeholder="Negative SBT Class"
                w="90%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                onChange={e => {
                  setFormState({ ...formState, negativeSBTClass: e.target.value });
                }}
              />
              {/* <Checkbox borderColor="red">Buyer&apos;s Details</Checkbox> */}
              {/* <Switch
                size="md"
                isChecked
                value="qwe"
                id="qwe"
                borderWidth="1px"
                borderColor="red"
              /> */}
              {/* <Checkbox
                mx="10"
                my="10"
                onChange={e => {
                  setFormState({ ...formState, buyersDetails: e.target.checked });
                }}
              >
                Click to add Buyer&apos;s Details
              </Checkbox>
              <Input
                variant="filled"
                placeholder="Email"
                w="90%"
                mx={10}
                my={20}
                px={8}
                h="45px"
                borderWidth="1px"
                borderColor="#d3d3d3"
                focusBorderColor="#d3d3d3"
                borderRadius="5px"
                onChange={e => {
                  setFormState({ ...formState, email: e.target.value });
                }}
              /> */}
              <Flex justifyContent="center" alignItems="center">
                <Button
                  bg="#524eb7"
                  size="lg"
                  borderRadius="5"
                  px="10"
                  my={30}
                  color="white"
                  fontWeight="bold"
                  h="50px"
                  w="30%"
                  fontSize="18px"
                  justifySelf="center"
                  onClick={() => {
                    deployNewAsset();
                  }}
                >
                  Submit
                </Button>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

const mapStateToProps = ({ account }: State) => ({
  settings: account.setting,
});

export default connect(mapStateToProps, accountActionCreators)(Dashboard);
