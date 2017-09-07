import React from 'react';
import PropTypes from 'prop-types';

const nms = require('./no-metamask.scss');

const NoMetamask = ({ isChrome, hasMetamask }) => (
  <div className={nms['no-metamask-wrapper']}>
    {
      !hasMetamask && !isChrome &&
      <div>
        <h2>
          In order to use this app you must access it
          through the Chrome web browser
          <br />
          and install the
          <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en" target="_blank" rel="noopener noreferrer">Metamask</a>
          extension.
        </h2>
      </div>
    }
    {
      !hasMetamask && isChrome &&
      <div>
        <h2>
          In order to use this app you need to install the
          <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en" target="_blank" rel="noopener noreferrer">Metamask</a>
          extension.
        </h2>
      </div>
    }
    {
      hasMetamask && !isChrome &&
      <div>
        <h2>
          Even though you have Metamask in your browser, Metamask versions other than the Chrome
          one are still in development and are not stable for use. Please access this app from
          Chrome and install the
          <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en" target="_blank" rel="noopener noreferrer">Metamask</a>
          extension there.
        </h2>
      </div>
    }
  </div>
);

NoMetamask.propTypes = {
  isChrome: PropTypes.bool.isRequired,
  hasMetamask: PropTypes.bool.isRequired
};

export default NoMetamask;
