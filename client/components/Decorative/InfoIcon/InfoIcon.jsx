import React from 'react';
import PropTypes from 'prop-types';

const InfoIcon = ({ size }) => (
  <svg fill="#ffd024" height={size} className="info-icon" viewBox="0 0 24 24" width={size} xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48
      10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
    />
  </svg>
);

InfoIcon.propTypes = {
  size: PropTypes.string
};
InfoIcon.defaultProps = {
  size: '18'
};

export default InfoIcon;