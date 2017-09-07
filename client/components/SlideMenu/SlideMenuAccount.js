import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SlideMenuWrapper from './SlideMenuWrapper';
import AccountIcon from '../Decorative/AccountIcon/AccountIcon';
import CloseIcon from '../Decorative/CloseIcon/CloseIcon';
import toggleSlideMenu from '../../actions/slideMenuActions';
import { ACCOUNT_SLIDE_MENU, NEW_PIXEL_NOTIFICATION, LOST_PIXEL_NOTIFICATION } from '../../actions/types';
import { getPixelRowAndColumn, getTotal } from '../../actions/utils';
import { hideNotification } from '../../actions/notificationsActions';
import { goToPixel } from '../../actions/userActions';

require('./slide-menu-account.scss');
require('../../common-styles/table.scss');

const SlideMenuAccount = ({
  menuOpen, $toggleSlideMenu, userPixels, address, alert, notifications,
  $hideNotification, $goToPixel
}) => (
  <div className="slide-menu-wrapper slide-menu-account-wrapper">
    <span
      role="button"
      tabIndex={0}
      className={`toggle-menu-icon ${alert ? 'shake' : ''}`}
      onClick={() => { $toggleSlideMenu(ACCOUNT_SLIDE_MENU, true); }}
    >
      <AccountIcon size="30" />
    </span>

    <SlideMenuWrapper open={menuOpen} menuType={ACCOUNT_SLIDE_MENU}>
      <h3>Your bought pixels</h3>

      <div className="slide-menu-body">
        <h4 className="address">Address: { address }</h4>

        {
          userPixels.length > 0 &&
          <h4 className="total">Total in pixels: { getTotal(userPixels) } ETH</h4>
        }

        {
          !userPixels.length &&
          <div className="no-pixels">
            You have not bought any pixels yet!
          </div>
        }

        {
          notifications.length > 0 &&
          <div className="notifications-wrapper">
            {
              notifications.map((pixel, index) => (
                <div
                  key={pixel.coors + Math.random()}
                  className={`notification ${pixel.type === NEW_PIXEL_NOTIFICATION ? 'success' : ''} ${pixel.type === LOST_PIXEL_NOTIFICATION ? 'error' : ''}`}
                >
                  <span
                    role="button"
                    tabIndex={0}
                    className={`toggle-menu-icon ${alert ? 'shake' : ''}`}
                    onClick={() => { $hideNotification(index); }}
                  >
                    <CloseIcon size="20" />
                  </span>
                  <span
                    className="color"
                    style={{ backgroundColor: pixel.color }}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      $goToPixel(pixel.coors);
                      $toggleSlideMenu(ACCOUNT_SLIDE_MENU, false);
                    }}
                  />
                  <span>
                    {
                      pixel.type === NEW_PIXEL_NOTIFICATION && 'Successfully bought pixel at '
                    }
                    {
                      pixel.type === LOST_PIXEL_NOTIFICATION && 'Lost pixel at '
                    }
                    column { getPixelRowAndColumn(pixel.coors).column },{ ' ' }
                    row { getPixelRowAndColumn(pixel.coors).row }{ ' ' }
                    for { pixel.amount } ETH
                  </span>
                </div>
              ))
            }
          </div>
        }

        {
          userPixels.length > 0 &&
          <div>*Click on a pixel to go to it (it will be at the center)</div>
        }

        {
          userPixels.length > 0 &&
          <div className="table">
            <div className="tr">
              <div className="td">Color</div>
              <div className="td">Column</div>
              <div className="td">Row</div>
              <div className="td amount-cell">ETH</div>
            </div>
            {
              userPixels.map((pixel) => (
                // checks if pixel has been bought from user
                pixel.color &&
                <div className="tr" key={pixel.coors}>
                  <span className="td">
                    <div
                      className="pixel-color-box"
                      role="button"
                      tabIndex={-1}
                      onClick={() => {
                        $goToPixel(pixel.coors);
                        $toggleSlideMenu(ACCOUNT_SLIDE_MENU, false);
                      }}
                      style={{ backgroundColor: pixel.color }}
                    />
                  </span>
                  <span className="td">{ getPixelRowAndColumn(pixel.coors).column }</span>
                  <span className="td">{ getPixelRowAndColumn(pixel.coors).row }</span>
                  <span className="td amount-cell">{pixel.amount}</span>
                </div>
              ))
            }
          </div>
        }
      </div>
    </SlideMenuWrapper>
  </div>
);

SlideMenuAccount.propTypes = {
  address: PropTypes.string.isRequired,
  menuOpen: PropTypes.bool.isRequired,
  userPixels: PropTypes.array.isRequired,
  $toggleSlideMenu: PropTypes.func.isRequired,
  $hideNotification: PropTypes.func.isRequired,
  $goToPixel: PropTypes.func.isRequired,
  alert: PropTypes.bool.isRequired,
  notifications: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  address: state.user.address,
  menuOpen: state.slideMenu.currentType === ACCOUNT_SLIDE_MENU && state.slideMenu.currentOpen,
  userPixels: state.user.myPixelsArr,
  alert: state.notifications.alert,
  notifications: state.notifications.notifications
});

const mapDispatchToProps = {
  $toggleSlideMenu: toggleSlideMenu,
  $hideNotification: hideNotification,
  $goToPixel: goToPixel
};

export default connect(mapStateToProps, mapDispatchToProps)(SlideMenuAccount);

