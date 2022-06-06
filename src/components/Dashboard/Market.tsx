import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import SupplyMarket from 'components/Dashboard/Market/SupplyMarket';
import NonCollateralSupplyMarket from 'components/Dashboard/Market/NonCollateralSupplyMarket';
import NonCollateralBorrowMarket from 'components/Dashboard/Market/NonCollateralBorrowMarket';
import BorrowMarket from 'components/Dashboard/Market/BorrowMarket';
import { Card } from 'components/Basic/Card';
// import MintTab from 'components/Basic/VaiTabs/MintTab';
// import RepayVaiTab from 'components/Basic/VaiTabs/RepayVaiTab';
import { State } from 'core/modules/initialState';
import { accountActionCreators } from 'core/modules/account/actions';
import { Asset, Setting } from 'types';
import { useMarketsUser } from '../../hooks/useMarketsUser';

const CardWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-color: var(--color-bg-primary);
  padding: 15px 14px;
  border: 1px solid var(--color-bg-active);
`;

const Tabs = styled.div`
  display: flex;
  align-items: center;
  .tab-item {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 199px;
    height: 41px;
    color: var(--color-text-inactive);
  }
  .tab-active {
    border-radius: 3px;
    font-weight: 600;
    color: var(--color-text-main);
    background-color: var(--color-bg-active);
  }
`;

const TabContent = styled.div`
  width: 100%;
  height: calc(100% - 75px);
  margin-top: 35px;
  // display: flex;
  justify-content: center;
`;

// const TabGradient = styled.div`
//   // background-image: linear-gradient(180deg, #8FD2F2 0%, #FFF 100%) !important;
// `;

const TabContentBorrow = styled.div`
  width: 100%;
  height: calc(100% - 75px);
  margin-top: 35px;
  // display: flex;
  justify-content: center;
`;

const MintRepayVai = styled.div`
  @media only screen and (max-width: 1300px) {
    flex-direction: column;
    // justify-content: flex-start;
  }
`;

interface MarketProps {
  settings: Setting;
  setSetting: (setting: Partial<Setting> | undefined) => void;
}

const Market = ({ setSetting }: MarketProps) => {
  const [currentTab, setCurrentTab] = useState('supply');
  const [suppliedAssets, setSuppliedAssets] = useState<Asset[]>([]);
  const [nonSuppliedAssets, setNonSuppliedAssets] = useState<Asset[]>([]);
  const [suppliedOtherAssets, setSuppliedOtherAssets] = useState<Asset[]>([]);
  const [nonSuppliedOtherAssets, setNonSuppliedOtherAssets] = useState<Asset[]>([]);

  const [borrowedAssets, setBorrowedAssets] = useState<Asset[]>([]);
  const [nonBorrowedAssets, setNonBorrowedAssets] = useState<Asset[]>([]);
  const [borrowedOtherAssets, setBorrowedOtherAssets] = useState<Asset[]>([]);
  const [nonBorrowedOtherAssets, setNonBorrowedOtherAssets] = useState<Asset[]>([]);
  const { userMarketInfo } = useMarketsUser();

  const updateMarketTable = () => {
    const tempSuppliedData: Asset[] = [];
    const tempNonSuppliableData: Asset[] = [];
    const tempOtherSuppliedData: Asset[] = [];
    const tempOtherNonSuppliableData: Asset[] = [];
    const tempBorrowedData: Asset[] = [];
    const tempNonBorrowedData: Asset[] = [];
    const tempOtherBorrowedData: Asset[] = [];
    const tempOtherNonBorrowedData: Asset[] = [];
    userMarketInfo.forEach((element: Asset) => {
      if (element.supplyBalance.isZero() && Number(element.collateralFactor) <= 0) {
        tempOtherNonSuppliableData.push(element);
      } else if (element.supplyBalance.isZero() && Number(element.collateralFactor) > 0) {
        tempNonSuppliableData.push(element);
      } else if (Number(element.supplyBalance) > 0 && Number(element.collateralFactor) <= 0) {
        tempOtherSuppliedData.push(element);
      } else {
        tempSuppliedData.push(element);
      }

      // if (element.borrowBalance.isZero() && Number(element.collateralFactor) <= 0 && (element.supplyBalance.isZero())) {
      //   tempOtherNonBorrowedData.push(element);
      // } else if (element.borrowBalance.isZero() && Number(element.collateralFactor) > 0 && (element.supplyBalance.isZero())) {
      //   tempNonBorrowedData.push(element);
      // } else if (
      //   Number(element.borrowBalance) > 0 &&
      //   Number(element.collateralFactor) <= 0 &&
      //   element.supplyBalance.isZero()
      // ) {
      //   tempOtherBorrowedData.push(element);
      // } else if (element.supplyBalance.isZero()) {
      //   tempBorrowedData.push(element);
      // }
      if (element.borrowBalance.isZero() && Number(element.collateralFactor) <= 0) {
        tempOtherNonBorrowedData.push(element);
      } else if (element.borrowBalance.isZero() && Number(element.collateralFactor) > 0) {
        tempNonBorrowedData.push(element);
      } else if (
        Number(element.borrowBalance) > 0 &&
        Number(element.collateralFactor) <= 0
      ) {
        tempOtherBorrowedData.push(element);
      } else {
        tempBorrowedData.push(element);
      }
    });
    setSuppliedAssets([...tempSuppliedData]);
    setNonSuppliedAssets([...tempNonSuppliableData]);
    setSuppliedOtherAssets([...tempOtherSuppliedData]);
    setNonSuppliedOtherAssets([...tempOtherNonSuppliableData]);
    setBorrowedAssets([...tempBorrowedData]);
    setNonBorrowedAssets([...tempNonBorrowedData]);
    setBorrowedOtherAssets([...tempOtherBorrowedData]);
    setNonBorrowedOtherAssets([...tempOtherNonBorrowedData]);
  };

  useEffect(() => {
    if (userMarketInfo && userMarketInfo.length > 0) {
      updateMarketTable();
    }
  }, [userMarketInfo]);

  useEffect(() => {
    if (currentTab !== 'vai') {
      setSetting({ marketType: currentTab });
    }
  }, [currentTab, setSetting]);

  return (
    <Card>
      <CardWrapper>
        <Tabs>
          <div
            className={`tab-item center ${currentTab === 'supply' ? 'tab-active' : ''}`}
            onClick={() => {
              setCurrentTab('supply');
            }}
          >
            Supply Market
          </div>
          <div
            className={`tab-item center ${currentTab === 'borrow' ? 'tab-active' : ''}`}
            onClick={() => {
              setCurrentTab('borrow');
            }}
          >
            Borrow Market
          </div>
          {/* <div
            className={`tab-item center ${currentTab === 'vai' ? 'tab-active' : ''}`}
            onClick={() => {
              setCurrentTab('vai');
            }}
          >
            Mint / Repay VAI
          </div> */}
        </Tabs>
        <TabContent>
          {currentTab === 'supply' && (
            <MintRepayVai className="flex">
              <SupplyMarket suppliedAssets={suppliedAssets} remainAssets={nonSuppliedAssets} />
              <NonCollateralSupplyMarket
                suppliedAssets={suppliedOtherAssets}
                remainAssets={nonSuppliedOtherAssets}
              />
            </MintRepayVai>
          )}
        </TabContent>
        <TabContentBorrow>
          {currentTab === 'borrow' && (
            <MintRepayVai className="flex">
              <BorrowMarket borrowedAssets={borrowedAssets} remainAssets={nonBorrowedAssets} />
              <NonCollateralBorrowMarket
                borrowedAssets={borrowedOtherAssets}
                remainAssets={nonBorrowedOtherAssets}
              />
            </MintRepayVai>
          )}

          {/* {currentTab === 'vai' && (
            <MintRepayVai className="flex align-center">
              <MintTab />
              <RepayVaiTab />
            </MintRepayVai>
          )} */}
        </TabContentBorrow>
      </CardWrapper>
    </Card>
  );
};

const mapStateToProps = ({ account }: State) => ({
  settings: account.setting,
});

export default connect(mapStateToProps, accountActionCreators)(Market);
