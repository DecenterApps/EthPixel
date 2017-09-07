import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from '../Grid/Grid.jsx';
import ModalWrapper from '../Modals/ModalWrapper/ModalWrapper';
import BigBlockLoader from '../Decorative/BigBlockLoader/BigBlockLoader';
import SlideMenuInfo from '../SlideMenu/SlideMenuInfo';
import SlideMenuAccount from '../SlideMenu/SlideMenuAccount';

const style = require('./landing.scss');

const Landing = ({ loadingPixels, loggedOut }) => (
  <div className={style['landing-wrapper']}>

    {!loadingPixels && <SlideMenuInfo />}
    {!loggedOut && !loadingPixels && <SlideMenuAccount />}

    {loadingPixels && <BigBlockLoader />}
    {!loadingPixels && <Grid />}

    <ModalWrapper />
  </div>
);

const mapStateToProps = (state) => ({
  loadingPixels: state.user.loadingPixels,
  loggedOut: state.user.loggedOut,
});

Landing.propTypes = {
  loadingPixels: PropTypes.bool.isRequired,
  loggedOut: PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(Landing);
