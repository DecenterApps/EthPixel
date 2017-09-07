import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CloseIcon from '../Decorative/CloseIcon/CloseIcon';
import toggleSlideMenu from '../../actions/slideMenuActions';

require('./slide-menu.scss');

const SlideMenuWrapper = ({ children, open, menuType, $toggleSlideMenu }) => (
  <nav className={`cbp-spmenu cbp-spmenu-vertical cbp-spmenu-left ${open ? 'menu-open' : ''}`} id="cbp-spmenu-s1" >
    <span
      role="button"
      tabIndex={0}
      onClick={() => { $toggleSlideMenu(menuType, false); }}
    >
      <CloseIcon size="30" />
    </span>
    { children }
  </nav>
);

SlideMenuWrapper.defaultProps = {
  open: false,
  menuType: ''
};

SlideMenuWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  open: PropTypes.bool,
  menuType: PropTypes.string,
  $toggleSlideMenu: PropTypes.func.isRequired
};

export default connect(null, { $toggleSlideMenu: toggleSlideMenu })(SlideMenuWrapper);
