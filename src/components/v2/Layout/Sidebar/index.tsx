/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';

import { ReactComponent as LogoDesktop } from 'assets/img/v2/fenrirLogoWithText.svg';
import { ReactComponent as LogoNoText } from 'assets/img/v2/fenrirLogoPure.svg';
import { ReactComponent as LogoMobile } from 'assets/img/v2/FenrirLogoMobile.svg';
import { useWeb3Account } from 'clients/web3';
import { useTranslation } from 'translation';
import { Toolbar } from '../Toolbar';
// import ClaimXvsRewardButton from '../ClaimXvsRewardButton';
import ConnectButton from '../ConnectButton';
import Link from './Link';
import { Icon } from '../../Icon';
import { menuItems } from '../constants';
import { useStyles } from './styles';

interface ISidebarProps {
  account: undefined | null | string;
}

export const SidebarUi: React.FC<ISidebarProps> = () => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();
  const styles = useStyles();

  const openMenu = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Drawer variant="permanent" css={styles.drawer}>
        <div css={styles.drawerContent}>
          <Toolbar css={styles.toolbar}>
            {/* <LogoDesktop css={styles.logo} />
            <LogoNoText css={styles.logoClosed} /> */}
            <div style={{ marginTop: '30%', marginLeft: '10%' }}>
              <ConnectButton />
            </div>
          </Toolbar>
          <List css={styles.list}>
            {menuItems.map(menuItem => (
              <ListItemButton
                key={menuItem.i18nKey}
                component="li"
                css={styles.listItem}
                disableRipple
              >
                <Link href={menuItem.href}>
                  <ListItemIcon css={styles.listItemIcon}>
                    <Icon name={menuItem.icon} />
                  </ListItemIcon>

                  <Typography variant="body2" css={styles.listItemText}>
                    {t(menuItem.i18nKey)}
                  </Typography>

                  <div className="left-border" />
                </Link>
              </ListItemButton>
            ))}
          </List>
        </div>
      </Drawer>

      <div css={styles.mobileMenuBox}>
        <div css={styles.flexRow}>
          <LogoMobile css={styles.mobileLogo} />

          <ConnectButton small fullWidth css={styles.mobileConnectButton} />

          <button type="button" onClick={openMenu} css={styles.actionButton}>
            <Icon name="burger" css={styles.burger} />
          </button>
        </div>

        <Menu
          css={styles.mobileMenu}
          className="mobile-menu"
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={closeMenu}
          transitionDuration={0}
          marginThreshold={0}
          TransitionProps={{ style: { transition: 'background 0.2s linear' } }}
        >
          <div css={[styles.flexRow, styles.doublePadding]}>
            <LogoMobile css={styles.mobileLogo} />

            <ConnectButton small fullWidth css={styles.mobileConnectButton} />

            <button type="button" onClick={closeMenu} css={styles.actionButton}>
              <Icon name="close" css={styles.burger} />
            </button>
          </div>
          <List css={styles.list}>
            {menuItems.map(({ href, icon, i18nKey }) => (
              <ListItemButton
                key={i18nKey}
                component="li"
                css={[styles.listItem, styles.mobileListItem]}
                disableRipple
              >
                <Link onClick={closeMenu} href={href}>
                  <div css={styles.mobileLabel}>
                    <ListItemIcon css={styles.listItemIcon}>
                      <Icon name={icon} />
                    </ListItemIcon>
                    <Typography
                      variant="body2"
                      component="span"
                      css={[styles.listItemText, styles.mobileListItemText]}
                    >
                      {t(i18nKey)}
                    </Typography>
                  </div>
                  <Icon name="arrowRight" css={styles.mobileArrow} />
                </Link>
              </ListItemButton>
            ))}
          </List>
          {/* <ClaimXvsRewardButton css={styles.claimXvsRewardButton} /> */}
        </Menu>
      </div>
    </>
  );
};

const Sidebar = () => {
  const { account } = useWeb3Account();
  return <SidebarUi account={account} />;
};

export default Sidebar;
