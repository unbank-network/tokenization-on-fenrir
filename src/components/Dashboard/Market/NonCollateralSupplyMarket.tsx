import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
// import LoadingSpinner from 'components/Basic/LoadingSpinner';
import { Icon } from 'antd';
import { connect } from 'react-redux';
// import toast from 'components/Basic/Toast';
import { Label } from 'components/Basic/Label';
// import CollateralConfirmModal from 'components/Basic/CollateralConfirmModal';
// import Toggle from 'components/Basic/Toggle';
import SupplyModal from 'components/Basic/SupplyModal';
import NonCollateralTable from 'components/Basic/NonCollateralTable';
import PendingTransaction from 'components/Basic/PendingTransaction';
import { formatApy, format } from 'utilities/common';
// import { useWeb3Account } from 'clients/web3';
import { Asset, Setting } from 'types';
import { State } from 'core/modules/initialState';
// import { useComptrollerContract } from '../../../clients/contracts/hooks';

const SupplyMarketWrapper = styled.div`
  width: 100%;
  // height: 100%;
  padding-left: 15px;
  background-image: linear-gradient(180deg, #8fd2f2 0%, #fff 100%) !important;
`;

interface StateProps {
  settings: Setting;
}
interface Props {
  suppliedAssets: Asset[];
  remainAssets: Asset[];
}

function NonCollateralSupplyMarket({ settings, suppliedAssets, remainAssets }: Props & StateProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [remainingAsset, setremainingAsset] = useState(remainAssets);
  const [suppliedAsset, setSuppliedAsset] = useState(suppliedAssets);

  //   const [isOpenCollateralConfirm, setIsCollateralConfirm] = useState(false);
  const [record, setRecord] = useState({} as Asset);

  useEffect(() => {
    if (suppliedAssets.length > 0) {
      setSuppliedAsset(suppliedAsset);
    }
    if (remainAssets.length > 0) {
      setremainingAsset(remainingAsset);
    }
  }, [remainingAsset, suppliedAsset]);
  //   const [isCollateralEnalbe, setIsCollateralEnable] = useState(true);
  //   const { account } = useWeb3Account();
  //   const comptrollerContract = useComptrollerContract();

  //   const handleToggleCollateral = async (r: $TSFixMe) => {
  //     if (r && account && r.borrowBalance.isZero()) {
  //       if (!r.collateral) {
  //         setIsCollateralEnable(false);
  //         setIsCollateralConfirm(true);
  //         try {
  //           await comptrollerContract.methods.enterMarkets([r.vtokenAddress]).send({ from: account });
  //         } catch (error) {
  //           console.log('enter markets error :>> ', error);
  //         }
  //         setIsCollateralConfirm(false);
  //       } else if (+r.hypotheticalLiquidity['1'] > 0 || +r.hypotheticalLiquidity['2'] === 0) {
  //         setIsCollateralEnable(true);
  //         setIsCollateralConfirm(true);
  //         await comptrollerContract.methods.exitMarket(r.vtokenAddress).send({ from: account });
  //         setIsCollateralConfirm(false);
  //       } else {
  //         toast.error({
  //           title: 'Collateral Required',
  //           description: 'Please repay all borrowed assets or set other assets as collateral.',
  //         });
  //       }
  //     } else {
  //       toast.error({
  //         title: 'Collateral Required',
  //         description: 'Please repay all borrowed assets or set other assets as collateral.',
  //       });
  //     }
  //   };

  const supplyColumns = [
    {
      title: 'Asset',
      dataIndex: 'asset',
      key: 'asset',

      render(img: $TSFixMe, asset: Asset) {
        return {
          children: (
            <div className="flex align-center">
              <img src={asset.img} alt="ethereum" />
              <div className="flex flex-column align-start">
                <Label size="14" primary>
                  {asset.symbol}
                </Label>
                <Label size="14">{asset.supplyApy.dp(2, 1).toString(10)}%</Label>
              </div>
            </div>
          ),
        };
      },
    },
    {
      title: 'APY',
      dataIndex: 'supplyApy',
      key: 'supplyApy',

      render(supplyApy: $TSFixMe, asset: Asset) {
        const apy = settings.withXVS ? supplyApy.plus(asset.xvsSupplyApy) : supplyApy;

        return {
          children: (
            <div className="apy-content">
              <Icon type="arrow-up" />
              <div className="apy-green-label">{formatApy(apy)}</div>
            </div>
          ),
        };
      },
    },
    // {
    //   title: 'FNR Rewards Per Year',
    //   dataIndex: 'supplierPBFnrPerYear',
    //   key: 'supplierPBFnrPerYear',
    //   render(supplierPBFnrPerYear: $TSFixMe, asset: Asset) {
    //     return {
    //       children: (
    //         <Label size="14" primary>
    //           {format(asset.supplierPBFnrPerYear, 2)}
    //         </Label>
    //       ),
    //     };
    //   },
    // },
    {
      title: 'Wallet',
      dataIndex: 'walletBalance',
      key: 'walletBalance',

      render(walletBalance: $TSFixMe) {
        return {
          children: (
            <Label size="14" primary>
              {format(walletBalance)}
            </Label>
          ),
        };
      },
    },
    // {
    //   title: 'Collateral',
    //   dataIndex: 'collateral',
    //   key: 'collateral',

    //   render(collateral: $TSFixMe, asset: Asset) {
    //     return {
    //       children: +asset.collateralFactor.toString() ? (
    //         <Toggle checked={collateral} onChecked={() => handleToggleCollateral(asset)} />
    //       ) : null,
    //     };
    //   },
    // },
  ];

  const suppliedColumns = [
    {
      title: 'Asset',
      dataIndex: 'asset',
      key: 'asset',

      render(img: $TSFixMe, asset: Asset) {
        return {
          children: (
            <div className="flex align-center">
              <img src={asset.img} alt="ethereum" />
              <div className="flex flex-column align-start">
                <Label size="14" primary>
                  {asset.symbol}
                </Label>
                <Label size="14">{asset.supplyApy.dp(2, 1).toString(10)}%</Label>
              </div>
            </div>
          ),
        };
      },
    },
    {
      title: 'APY / Earned',
      dataIndex: 'supplyApy',
      key: 'supplyApy',

      render(supplyApy: $TSFixMe, asset: Asset) {
        const apy = settings.withXVS ? supplyApy.plus(asset.xvsSupplyApy) : supplyApy;
        return {
          children: (
            <div className="apy-content">
              <Icon type="arrow-up" />
              <div className="apy-green-label">{formatApy(apy)}</div>
            </div>
          ),
        };
      },
    },
    // {
    //   title: 'FNR Rewards Per Year',
    //   dataIndex: 'supplierPBFnrPerYear',
    //   key: 'supplierPBFnrPerYear',

    //   render(supplierPBFnrPerYear: $TSFixMe, asset: Asset) {
    //     return {
    //       children: (
    //         <div className="wallet-label flex flex-column">
    //           <Label size="14" primary>
    //             {format(asset.supplierPBFnrPerYear, 2)}
    //           </Label>
    //         </div>
    //       ),
    //     };
    //   },
    // },
    {
      title: 'Balance',
      dataIndex: 'supplyBalance',
      key: 'supplyBalance',

      render(supplyBalance: $TSFixMe, asset: Asset) {
        return {
          children: (
            <div className="wallet-label flex flex-column">
              <Label size="14" primary>
                ${format(supplyBalance.times(asset.tokenPrice))}
              </Label>
              <Label size="14">
                {format(supplyBalance, 4)} {asset.symbol}
              </Label>
            </div>
          ),
        };
      },
    },
    // {
    //   title: 'Collateral',
    //   dataIndex: 'collateral',
    //   key: 'collateral',

    //   render(collateral: $TSFixMe, asset: Asset) {
    //     return {
    //       children: +asset.collateralFactor ? (
    //         <Toggle checked={collateral} onChecked={() => handleToggleCollateral(asset)} />
    //       ) : null,
    //     };
    //   },
    // },
  ];

  const handleClickRow = (row: $TSFixMe) => {
    setRecord(row);
    setIsOpenModal(true);
  };
  return (
    <SupplyMarketWrapper>
      {suppliedAssets.length === 0 && remainAssets.length === 0 }
      {suppliedAssets.length > 0 && (
        <NonCollateralTable
          columns={suppliedColumns}
          data={suppliedAssets}
          title="Supplied Other Markets"
          handleClickRow={handleClickRow}
        />
      )}
      {settings.pendingInfo &&
        settings.pendingInfo.status &&
        ['Supply', 'Withdraw'].includes(settings.pendingInfo.type) && <PendingTransaction />}
      {remainAssets.length > 0 && (
        <NonCollateralTable
          columns={supplyColumns}
          data={remainAssets}
          title="All Other Markets"
          handleClickRow={handleClickRow}
        />
      )}
      <SupplyModal visible={isOpenModal} asset={record} onCancel={() => setIsOpenModal(false)} />
      {/* <CollateralConfirmModal
        visible={isOpenCollateralConfirm}
        isCollateralEnalbe={isCollateralEnalbe}
        onCancel={() => setIsCollateralConfirm(false)}
      /> */}
    </SupplyMarketWrapper>
  );
}
const mapStateToProps = ({ account }: State): StateProps => ({
  settings: account.setting,
});

export default connect(mapStateToProps)(NonCollateralSupplyMarket);