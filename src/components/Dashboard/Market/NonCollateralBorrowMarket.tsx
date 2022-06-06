import React, { useState } from 'react';
import styled from 'styled-components';
// import LoadingSpinner from 'components/Basic/LoadingSpinner';
import { Icon } from 'antd';
import { connect } from 'react-redux';
import { Label } from 'components/Basic/Label';
import BorrowModal from 'components/Basic/BorrowModal';
import NonCollateralTable from 'components/Basic/NonCollateralTable';
import PendingTransaction from 'components/Basic/PendingTransaction';
import { getBigNumber, formatApy, format } from 'utilities/common';
import { Asset, Setting } from 'types';
import { State } from 'core/modules/initialState';

const BorrowMarketWrapper = styled.div`
  background-image: linear-gradient(180deg, #8FD2F2 0%, #FFF 100%) !important;
  width: 100%;
//   height: 100%;
  padding-left: 15px;
`;

interface StateProps {
  settings: Setting;
}

interface Props {
  borrowedAssets: Asset[];
  remainAssets: Asset[];
}

function NonCollateralBorrowMarket({ borrowedAssets, remainAssets, settings }: Props & StateProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [record, setRecord] = useState({});

  const handleClickRow = (row: $TSFixMe) => {
    setRecord(row);
    setIsOpenModal(true);
  };

  const remainColumns = [
    {
      title: 'Asset',
      dataIndex: 'img',
      key: 'img',

      render(img: $TSFixMe, asset: Asset) {
        return {
          children: (
            <div className="flex align-center">
              <img src={asset.img} alt="ethereum" />
              <div className="flex flex-column align-start">
                <Label size="14" primary>
                  {asset.symbol}
                </Label>
                <Label size="14">{asset.borrowApy.dp(2, 1).toString(10)}%</Label>
              </div>
            </div>
          ),
        };
      },
    },
    {
      title: 'APY',
      dataIndex: 'borrowApy',
      key: 'borrowApy',

      render(borrowApy: $TSFixMe, asset: Asset) {
        const apy = settings.withXVS ? getBigNumber(asset.xvsBorrowApy).plus(borrowApy) : borrowApy;
        return {
          children: (
            <div className="apy-content">
              {!settings.withXVS || apy.isNegative() ? (
                <Icon type="arrow-down" style={{ color: '#f9053e' }} />
              ) : (
                <Icon type="arrow-up" />
              )}
              <div
                className={
                  !settings.withXVS || apy.isNegative() ? 'apy-red-label' : 'apy-green-label'
                }
              >
                {formatApy(apy)}
              </div>
            </div>
          ),
        };
      },
    },
    // {
    //   title: 'FNR Rewards Per Year',
    //   dataIndex: 'borrowerPBFnrPerYear',
    //   key: 'borrowerPBFnrPerYear',
    //   render(borrowerPBFnrPerYear: $TSFixMe, asset: Asset) {
    //     return {
    //       children: (
    //         <div className="wallet-label flex flex-column">
    //           <Label size="14" primary>
    //             {format(asset.borrowerPBFnrPerYear, 2)}
    //           </Label>
    //         </div>
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
    {
      title: 'Liquidity',
      dataIndex: 'liquidity',
      key: 'liquidity',
      width: '150px',

      render(liquidity: $TSFixMe) {
        return {
          children: (
            <Label size="14" primary>
              ${format(liquidity)}
            </Label>
          ),
        };
      },
    },
  ];

  const borrowColumns = [
    {
      title: 'Asset',
      dataIndex: 'img',
      key: 'img',

      render(img: $TSFixMe, asset: Asset) {
        return {
          children: (
            <div className="flex align-center">
              <img src={asset.img} alt="ethereum" />
              <div className="flex flex-column align-start">
                <Label size="14" primary>
                  {asset.symbol}
                </Label>
                <Label size="14">{asset.borrowApy.dp(2, 1).toString(10)}%</Label>
              </div>
            </div>
          ),
        };
      },
    },
    {
      title: 'APY / Accrued',
      dataIndex: 'borrowApy',
      key: 'borrowApy',

      render(borrowApy: $TSFixMe, asset: Asset) {
        const apy = settings.withXVS ? getBigNumber(asset.xvsBorrowApy).plus(borrowApy) : borrowApy;
        return {
          children: (
            <div className="apy-content">
              {!settings.withXVS || apy.isNegative() ? (
                <Icon type="arrow-down" style={{ color: '#f9053e' }} />
              ) : (
                <Icon type="arrow-up" />
              )}
              <div
                className={
                  !settings.withXVS || apy.isNegative() ? 'apy-red-label' : 'apy-green-label'
                }
              >
                {formatApy(apy)}
              </div>
            </div>
          ),
        };
      },
    },
    {
      title: 'Balance',
      dataIndex: 'borrowBalance',
      key: 'borrowBalance',

      render(borrowBalance: $TSFixMe, asset: Asset) {
        return {
          children: (
            <div className="wallet-label flex flex-column">
              <Label size="14" primary>
                ${format(borrowBalance.times(asset.tokenPrice))}
              </Label>
              <Label size="14">
                {format(borrowBalance, 4)} {asset.symbol}
              </Label>
            </div>
          ),
        };
      },
    },
    {
      title: '% Of Limit',
      dataIndex: 'percentOfLimit',
      key: 'percentOfLimit',
      width: '150px',

      render(percentOfLimit: $TSFixMe) {
        const children = <Label size="14">{percentOfLimit}%</Label>;
        return {
          children,
        };
      },
    },
  ];

  return (
    <BorrowMarketWrapper>
      {/* {borrowedAssets.length === 0 && remainAssets.length === 0 && <LoadingSpinner />} */}
      {borrowedAssets.length > 0 && (
        <NonCollateralTable
          columns={borrowColumns}
          data={borrowedAssets}
          title="Borrowing Other Markets"
          handleClickRow={handleClickRow}
        />
      )}
      {settings.pendingInfo &&
        settings.pendingInfo.status &&
        ['Borrow', 'Repay Borrow'].includes(settings.pendingInfo.type) && <PendingTransaction />}
      {remainAssets.length > 0 && (
        <NonCollateralTable
          columns={remainColumns}
          data={remainAssets}
          title="All Other Markets"
          handleClickRow={handleClickRow}
        />
      )}
      <BorrowModal
        visible={isOpenModal}
        // @ts-expect-error This is set as an empty object in state
        asset={record}
        onCancel={() => setIsOpenModal(false)}
      />
    </BorrowMarketWrapper>
  );
}

const mapStateToProps = ({ account }: State): StateProps => ({
  settings: account.setting,
});

export default connect(mapStateToProps)(NonCollateralBorrowMarket);
