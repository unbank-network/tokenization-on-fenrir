/** @jsxImportSource @emotion/react */
import React from 'react';

import Typography from '@mui/material/Typography';
import {
  BASE_BSC_SCAN_URL,
  VENUS_DISCORD_URL,
  VENUS_TWITTER_URL,
  FNR_GITHUB_URL,
  FNR_GITBOOK_URL,
  // BSCSCAN_FNR_CONTRACT_ADDRESS,
} from 'config';
// import { generateBscScanUrl } from 'utilities';
import { useBlock } from 'hooks/useBlock';
import { useTranslation } from 'translation';
import { Icon } from 'components/v2/Icon';
import { useStyles } from './styles';

export interface IFooterProps {
  currentBlockNumber: number;
}

export const Footer: React.FC<IFooterProps> = ({ currentBlockNumber }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <div css={styles.container}>
      <Typography
        component="a"
        variant="small2"
        css={styles.blockInfo}
        href={BASE_BSC_SCAN_URL}
        target="_blank"
        rel="noreferrer"
      >
        {t('footer.latestNumber')}
        <br css={styles.blockInfoMobileLineBreak} />
        <span css={styles.blockInfoNumber}>{currentBlockNumber}</span>
      </Typography>

      <div css={styles.links}>
        <a
          css={styles.link}
          href="https://bscscan.com/address/0xA919C7eDeAb294DD15939c443BCacA1FA1a1850f"
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="fnr" color={styles.theme.palette.text.primary} size="12px" />
        </a>

        <a css={styles.link} href={FNR_GITBOOK_URL} target="_blank" rel="noreferrer">
          <Icon name="gitbook" color={styles.theme.palette.text.primary} size="12px" />
        </a>

        <a css={styles.link} href={VENUS_DISCORD_URL} target="_blank" rel="noreferrer">
          <Icon name="discord" color={styles.theme.palette.text.primary} size="12px" />
        </a>

        <a css={styles.link} href={VENUS_TWITTER_URL} target="_blank" rel="noreferrer">
          <Icon name="twitter" color={styles.theme.palette.text.primary} size="12px" />
        </a>

        <a css={styles.link} href={FNR_GITHUB_URL} target="_blank" rel="noreferrer">
          <Icon name="github" color={styles.theme.palette.text.primary} size="12px" />
        </a>
      </div>
    </div>
  );
};

const FooterContainer: React.FC = () => {
  const currentBlockNumber = useBlock();
  return <Footer currentBlockNumber={currentBlockNumber} />;
};

export default FooterContainer;
