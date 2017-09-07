import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ChromePicker } from 'react-color';
import formGroup from './FormComponent';
import SmallBlockLoader from '../Decorative/SmallBlockLoader/SmallBlockLoader';
import { submitBuyPixelForm, handleChangeColorComplete, handleChangeColorInput, buyPixelFormValidator, getPixelData } from '../../actions/userActions';

const formStyle = require('./forms.scss');

class BuyPixelForm extends Component {
  componentDidMount() {
    this.props.$getPixelData(this.props.data.coordinates.x, this.props.data.coordinates.y);
  }

  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <div className={formStyle['coors-info-wrapper']}>
          <div>Column: <span>{ this.props.data.coordinates.x + 1 }</span></div>
          <div>Row: <span>{ this.props.data.coordinates.y + 1 }</span></div>
        </div>

        { this.props.gettingPixel && <SmallBlockLoader />}

        { !this.props.gettingPixel &&
          <div>
            {
              this.props.getPixelError &&
              <div className="get-pixel-error">{this.props.getPixelError }</div>
            }

            {
              this.props.loggedOut &&
              <div className="pixel-status smaller">
                You need to be logged into Metamask to buy a pixel
              </div>
            }

            {
              this.props.ownerLessPixel &&
              <div className="pixel-status">This pixel has not been bought yet!</div>
            }

            {
              !this.props.ownerLessPixel &&
              this.props.singlePixel.color &&
              this.props.isYourPixel &&
              <div className="pixel-status">
                This is your pixel you can not buy it again!
              </div>
            }

            {
              !this.props.ownerLessPixel &&
              this.props.singlePixel.color &&
              !this.props.isYourPixel &&
              <div className="single-pixel-info">
                <span>
                  <span className={formStyle['portion-name']}>Holder:</span>
                  <a href={`https://etherscan.io/address/${this.props.singlePixel.holder}`} target="_blank" rel="noopener noreferrer">
                    {this.props.singlePixel.holder}
                  </a>
                </span>
                <span>
                  <span className={formStyle['portion-name']}>Bought for:</span>
                  <span className={formStyle['pixel-amount']}>{this.props.singlePixel.amount} ETH</span>
                </span>
                <span className="price-info">
                  *You need to pay more than the current bought for value to get the this pixel
                </span>
              </div>
            }

            <div className={formStyle['picker-wrapper']}>
              <div className="example-color" style={{ backgroundColor: this.props.data.color }} />

              <ChromePicker
                disableAlpha
                color={this.props.data.color}
                onChangeComplete={this.props.$handleChangeColorComplete}
              />

              <Field
                name="color"
                showErrorText
                component={formGroup}
                placeholder="Color hex"
                type="text"
                wrapperClassName="form-item-wrapper color-input"
                inputClassName="form-item"
                errorClassName="form-item-error"
                onChangeAction={this.props.$handleChangeColorInput}
              />
            </div>

            <Field
              name="price"
              showErrorText
              component={formGroup}
              placeholder="Amount in ETH"
              type="text"
              wrapperClassName="form-item-wrapper"
              inputClassName="form-item"
              errorClassName="form-item-error"
            />

            {
              this.props.buyingPixelError &&
              <div className="submit-error">Error: {this.props.buyingPixelError}</div>
            }

            <button
              className="submit-button"
              type="submit"
              disabled={
                this.props.pristine || this.props.buyingPixel ||
                this.props.invalid || this.props.isYourPixel ||
                this.props.loggedOut
              }
            >
              { this.props.buyingPixel && <SmallBlockLoader /> }
              <span>{ this.props.buyingPixel ? 'Buying' : 'Buy' }</span>
            </button>
          </div>
        }
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.modals.data,
  initialValues: { color: state.modals.data.color },
  gettingPixel: state.user.gettingPixel,
  getPixelError: state.user.getPixelError,
  singlePixel: state.user.singlePixel,
  ownerLessPixel: state.user.ownerLessPixel,
  buyingPixel: state.user.buyingPixel,
  buyingPixelError: state.user.buyingPixelError,
  isYourPixel: !state.user.ownerLessPixel && (state.user.singlePixel.holder === state.user.address),
  loggedOut: state.user.loggedOut
});

BuyPixelForm.propTypes = {
  data: PropTypes.shape({
    coordinates: PropTypes.PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }).isRequired,
    color: PropTypes.string.isRequired
  }).isRequired,
  $handleChangeColorComplete: PropTypes.func.isRequired,
  $handleChangeColorInput: PropTypes.func.isRequired,
  $getPixelData: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  gettingPixel: PropTypes.bool.isRequired,
  singlePixel: PropTypes.shape({
    color: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    holder: PropTypes.string.isRequired
  }).isRequired,
  ownerLessPixel: PropTypes.bool.isRequired,
  buyingPixel: PropTypes.bool.isRequired,
  buyingPixelError: PropTypes.string.isRequired,
  getPixelError: PropTypes.string.isRequired,
  isYourPixel: PropTypes.bool.isRequired,
  loggedOut: PropTypes.bool.isRequired
};

const validate = buyPixelFormValidator;

BuyPixelForm = reduxForm({ form: 'buyPixelForm', validate })(BuyPixelForm); // eslint-disable-line

export default connect(mapStateToProps, {
  $getPixelData: getPixelData,
  onSubmit: submitBuyPixelForm,
  $handleChangeColorComplete: handleChangeColorComplete,
  $handleChangeColorInput: handleChangeColorInput
})(BuyPixelForm);
