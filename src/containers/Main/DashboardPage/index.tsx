/* eslint-disable no-useless-escape */
import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import { Row, Column } from 'components/Basic/Style';
import { State } from 'core/modules/initialState';
// import Admin from 'components/Dashboard/Admin';
import Dashboard from 'components/Dashboard/Dashboard';

const DashboardWrapper = styled.div`
  height: 100%;
`;

const DashboardPage = () => (
  <DashboardWrapper className="flex">
    <Dashboard />
  </DashboardWrapper>
);

const mapStateToProps = ({ account }: State) => ({
  settings: account.setting,
});

export default connect(mapStateToProps)(withRouter(DashboardPage));
