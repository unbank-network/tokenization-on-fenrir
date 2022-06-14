import { isOnTestnet } from 'config';
import { IconName } from '../Icon';

interface IMenuItem {
  href: string;
  /**
   * i18nKey are used for extracting texts from translation files
   *
   * avoid removing this values in order to save the content
   */
  i18nKey: string;
  icon: IconName;
}

export const menuItems: IMenuItem[] = [
  {
    href: '/dashboard',
    // Translation key: do not remove this comment
    // t('layout.menuItems.dashboard')
    i18nKey: 'layout.menuItems.dashboard',
    icon: 'dashboard',
  },
  {
    href: '/market',
    // Translation key: do not remove this comment
    // t('layout.menuItems.market')
    i18nKey: 'layout.menuItems.market',
    icon: 'market',
  },
  {
    href: '/fnr',
    // Translation key: do not remove this comment
    // t('layout.menuItems.vote')
    i18nKey: 'layout.menuItems.fnr',
    icon: 'fnr',
  },
  {
    href: '/admin',
    i18nKey: 'layout.menuItems.dashboard',
    icon: 'dashboard',
  },
  // {
  //   href: '/vault',
  //   // Translation key: do not remove this comment
  //   // t('layout.menuItems.xvs')
  //   i18nKey: 'layout.menuItems.vault',
  //   icon: 'fnr',
  // },

  // {
  //   href: '/transaction',
  //   // Translation key: do not remove this comment
  //   // t('layout.menuItems.history')
  //   i18nKey: 'layout.menuItems.history',
  //   icon: 'history',
  // },
];

if (isOnTestnet) {
  menuItems.splice(
    menuItems.length,
    0,
    // {
    //   href: '/convert-vrt',
    //   // Translation key: do not remove this comment
    //   // t('layout.menuItems.convertXvs')
    //   i18nKey: 'layout.menuItems.convertXvs',
    //   icon: 'convert',
    // },
    // {
    //   href: '/faucet',
    //   // Translation key: do not remove this comment
    //   // t('layout.menuItems.faucet')
    //   i18nKey: 'layout.menuItems.faucet',
    //   icon: 'info',
    // },
  );
}
