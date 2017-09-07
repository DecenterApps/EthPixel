import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SlideMenuWrapper from './SlideMenuWrapper';
import InfoIcon from '../Decorative/InfoIcon/InfoIcon';
import toggleSlideMenu from '../../actions/slideMenuActions';
import { INFO_SLIDE_MENU } from '../../actions/types';

require('./slide-menu-info.scss');

const SlideMenuInfo = ({ $toggleSlideMenu, menuOpen }) => (
  <div className="slide-menu-wrapper slide-menu-info-wrapper">
    <span
      role="button"
      tabIndex={0}
      onClick={() => { $toggleSlideMenu(INFO_SLIDE_MENU, true); }}
    >
      <InfoIcon size="30" />
    </span>

    <SlideMenuWrapper open={menuOpen} menuType={INFO_SLIDE_MENU}>
      <h3>Eth Pixel</h3>

      <div className="slide-menu-body">
        <div className="menu-section">
          <h4>What is it?</h4>
          <div>
            Eth Pixel is a project inspired by r/place. This version however
            handles all logic through a smart contract that is on the Ethereum mainnet.
            Data about every pixel is on the blockchain and is public.
            Every change by other users is realtime and is visible to everyone. It also supports
            in window change of Ethereum addresses.
          </div>
        </div>

        <div className="menu-section">
          <h4>How does it work?</h4>
          <div>
            You click on the pixel you want to buy and select the color that you
            want the pixel to be. If the pixel has not been bought before you can
            buy it for as low as 1 Wei (0.000000000000000001 ETH). You will then be asked
            to confirm the transaction. If it goes through you will see your pixel in
            your user side menu. If the pixel is already
            owned by someone else you can buy it only by paying more ETH than them.
            If you are successful in buying someones pixel then the amount of
            ETH that they bought it for goes back to them. If someone buys your
            pixel you will get a notification and the pixel will no longer be
            visible in your side menu. If you have bought any pixels the app will
            zoom to the latest bought one on load.
          </div>
        </div>

        <div className="menu-section">
          <h4>Why did you make it?</h4>
          <div>
            I thought that it would be cool to try and make r/place through a smart contract,
            I think that nobody did it before.
            All the code is <a href="https://github.com/DecenterApps/EthPixel" target="_blank" rel="noopener noreferrer">opensource</a>
            and I encourage people to go look at it.
            If anyone has any cool suggestions, shoot them my way.
            If the project gets more traction, I will continue to improve it further.
            The idea is also to raise awareness of Ethereum and blockchain in
            general and to show people that you can do cool stuff with it.
            Feel free to donate if you feel like it :) (0x90C33B4aD1FCcB244D1A9B20C7f079bF33c8f377).
          </div>
        </div>
      </div>
    </SlideMenuWrapper>
  </div>
);

SlideMenuInfo.propTypes = {
  menuOpen: PropTypes.bool.isRequired,
  $toggleSlideMenu: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  menuOpen: state.slideMenu.currentType === INFO_SLIDE_MENU && state.slideMenu.currentOpen
});

export default connect(mapStateToProps, { $toggleSlideMenu: toggleSlideMenu })(SlideMenuInfo);
