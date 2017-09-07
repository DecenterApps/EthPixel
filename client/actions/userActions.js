import { change } from 'redux-form';
import {
  SELECTED_COLOR, GENERATED_CANVAS_IMG, PIXEL_BOUGHT, GET_PIXEL,
  GET_PIXEL_SUCCESS, GET_PIXEL_ERROR, OWNERLESS_PIXEL,
  BUY_PIXEL, BUY_PIXEL_SUCCESS, BUY_PIXEL_ERROR, BUY_PIXEL_MODAL,
  PIXEL_ADDED_WHILE_LOADING, ADD_PIXELS_ADDED_WHILE_LOADING, GET_ETH_ADDRESS,
  SET_USER_PIXELS, PIXEL_BOUGHT_FROM_YOU, PIXEL_BOUGHT_FROM_YOU_WHILE_LOADING,
  NEW_PIXEL_NOTIFICATION, LOST_PIXEL_NOTIFICATION, GO_TO_PIXEL, LOGGED_OUT,
  LOGGED_IN
} from '../actions/types';
import * as eth from '../modules/ethereumService';
import { hexToRgb, formatLargeNumber } from './utils';
import * as modalActions from './modalActions';
import { newNotification } from './notificationsActions';

/**
 * Validator that checks form values from buyPixelForm <Fields>
 *
 * @param {Object} values
 */
export const buyPixelFormValidator = (values) => {
  const errors = {};

  if (!values.color) errors.color = 'Required';
  if (!values.price) errors.price = 'Required';

  if (values.color && !/^#[0-9a-fA-F]{6}$/.test(values.color)) {
    errors.color = 'Must be a full valid color hex';
  }

  if (values.price) {
    const commaError = values.price && values.price.indexOf(',') > 0;
    const nanError = isNaN(parseFloat(values.price));
    const toSmallError = !nanError && parseInt(web3.toWei(values.price, 'ether'), 10) < 1;

    if (commaError) errors.price = 'Use a full stop as a delimiter instead of a comma';
    if (toSmallError) errors.price = 'Smallest price is one wei';
    if (nanError) errors.price = 'The provided input is not a number';
  }

  return errors;
};

/**
 * Gets single pixel data from blockchain based on coordinates and writes it to the state
 *
 * @param {Number} x
 * @param {Number} y
 */
export const getPixelData = (x, y) => async (dispatch) => {
  let pixel = {};
  dispatch({ type: GET_PIXEL });

  try {
    pixel = await eth.getPixel(x, y);
  } catch (err) {
    return dispatch({ type: GET_PIXEL_ERROR });
  }

  const color = web3.toUtf8(pixel[0]);
  if (!color) return dispatch({ type: OWNERLESS_PIXEL });

  const singlePixel = {
    color,
    amount: formatLargeNumber(parseFloat(web3.fromWei(pixel[1].toString()))),
    holder: pixel[2]
  };

  return dispatch({ type: GET_PIXEL_SUCCESS, payload: { singlePixel } });
};

/**
 * Adds pixel that you lost to the que if you lost it while the app was loading
 *
 * @param {Function} dispatch
 * @param {Number} coordinates
 */
const handlePixelBoughtFromYouWhileLoading = (dispatch, coordinates) => {
  dispatch({
    type: PIXEL_BOUGHT_FROM_YOU_WHILE_LOADING,
    payload: coordinates
  });
};

/**
 * Removes pixel that you lost from account slide menu and notifies you
 *
 * @param {Function} dispatch
 * @param {Number} pixelCoors
 * @param {Object} userState
 * @param {Number} amount
 */
const handlePixelBoughtFromYou = (dispatch, pixelCoors, userState, amount) => {
  const deletedPixelArrayIndex = userState.myPixelsObj[pixelCoors];
  const userPixelArr = [...userState.myPixelsArr];
  const pixel = {
    amount,
    color: userPixelArr[deletedPixelArrayIndex].color,
    coors: userPixelArr[deletedPixelArrayIndex].coors
  };

  userPixelArr[deletedPixelArrayIndex].color = '';
  dispatch({ type: PIXEL_BOUGHT_FROM_YOU, payload: userPixelArr });
  dispatch(newNotification(LOST_PIXEL_NOTIFICATION, pixel));
};

/**
 * Adds pixel that you bought to the account slide menu and notifies you
 *
 * @param {Function} dispatch
 * @param {Number} amount
 * @param {String} color
 * @param {Object} userState
 * @param {Number} pixelCoors
 */
const handleAddYourBoughtPixel = (dispatch, amount, color, userState, pixelCoors) => {
  const pixel = {
    color,
    coors: pixelCoors,
    amount
  };
  const userPixelsArr = [pixel, ...userState.myPixelsArr];
  const userPixelObj = userState.myPixelsObj;

  userPixelObj[pixelCoors] = userPixelsArr.length - 1;

  dispatch({ type: SET_USER_PIXELS, payload: { userPixelsArr, userPixelObj } });
  dispatch(newNotification(NEW_PIXEL_NOTIFICATION, pixel));
};

/**
 * Handles pixels from BoughtPixels event while the app is loading
 *
 * @param {Function} dispatch
 * @param {Object} userState
 * @param {Object} data
 * @param {Number} canvasCoors (bits pixel coors)
 * @param {Number} pixelCoors
 * @param {Object} rgba
 */
const handlePixelsLoading = (dispatch, userState, data, canvasCoors, pixelCoors, rgba) => {
  if (userState.address === data.args.boughtFrom) {
    handlePixelBoughtFromYouWhileLoading(pixelCoors);
  }

  dispatch({ type: PIXEL_ADDED_WHILE_LOADING, payload: { pixel: { coors: canvasCoors, rgba } } });
};

/**
 * Handles pixels from BoughtPixels event
 *
 */
export const pixelBoughtEventListener = () => (dispatch, getState) => {
  eth.PixelBoughtEvent((error, data) => {
    if (error) return;

    const userState = getState().user;
    const canvasArr = [...userState.canvasArr];
    const color = web3.toUtf8(data.args.color);
    const pixelCoors = parseInt(data.args.coordinates.toString(), 10);
    const amount = formatLargeNumber(parseFloat(web3.fromWei(data.args.amount.toString())));
    const canvasCoors = pixelCoors * 4;
    const rgba = hexToRgb(color);

    // HANDLE WHEN SOMEONE ADDS PIXELS OR SOMEONE BUYS PIXEL YOU OWNED WHILE WHILE LOADING
    if (userState.loadingPixels) {
      handlePixelsLoading(dispatch, userState, data, canvasCoors, pixelCoors, rgba);
      return;
    }

    // REMOVE PIXEL FROM USER PIXELS
    if (userState.address === data.args.boughtFrom) {
      handlePixelBoughtFromYou(dispatch, pixelCoors, userState, amount);
    }

    // ADD YOUR BOUGHT PIXEL
    if (userState.address === data.args.holder) {
      handleAddYourBoughtPixel(dispatch, amount, color, userState, pixelCoors);
    }

    canvasArr[canvasCoors] = rgba.r;
    canvasArr[canvasCoors + 1] = rgba.g;
    canvasArr[canvasCoors + 2] = rgba.b;
    canvasArr[canvasCoors + 3] = rgba.a;

    dispatch({ type: PIXEL_BOUGHT, payload: { canvasArr } });
  });
};

/**
 * Generates canvas bits array. Removes duplicates from all bought pixels and gets user pixels
 *
 */
export function removeDuplicatesByAndGetUserPixels(keyFn, array, userAddress) {
  let canvasArr = new Uint8ClampedArray(4000000);

  canvasArr.fill(255);

  let userPixelsArr = [];
  let userPixelObj = {};
  let newCount = 0;

  let mySet = new Set();

  for (let i = 0; i < array.length; i++) {
    let x = array[i].args;
    let key = keyFn(array[i]);
    let isNew = !mySet.has(key);

    if (!isNew) continue; // eslint-disable-line

    mySet.add(key);

    newCount++;

    let color = web3.toUtf8(x.color);
    const coors = parseInt(x.coordinates.toString(), 10) * 4;
    const rgba = hexToRgb(color);
    const pixelAddress = x.holder;

    if (userAddress === pixelAddress) {
      const gridCoors = parseInt(x.coordinates.toString(), 10);

      userPixelsArr = [...userPixelsArr, {
        color,
        coors: gridCoors,
        amount: formatLargeNumber(parseFloat(web3.fromWei(x.amount.toString())))
      }];
      userPixelObj[gridCoors] = userPixelsArr.length - 1;
    }

    canvasArr[coors] = rgba.r;
    canvasArr[coors + 1] = rgba.g;
    canvasArr[coors + 2] = rgba.b;
    canvasArr[coors + 3] = rgba.a;

    // stop if all pixels are found
    if (newCount === 1000000) break;
  }

  return { canvasArr, userPixelObj, userPixelsArr };
}

/**
 * Gets all bought pixels from contract event and generates a grid from the
 * newest 1000000 pixels
 *
 * @param {Boolean} getAddress
 */
export const getAllBoughtPixels = (getAddress) => (dispatch, getState) => {
  eth.GetAllBoughtPixels((error, data) => {
    if (error) return;
    if (getState().currentOpen) {
      dispatch(modalActions.toggleModal(BUY_PIXEL_MODAL, false, {}, 'buyPixelForm'));
    }

    let userAddress = '';

    if (getAddress) {
      userAddress = eth.getAccount();

      if (!userAddress) dispatch({ type: LOGGED_OUT });

      dispatch({ type: GET_ETH_ADDRESS, payload: userAddress });
    } else {
      userAddress = getState().user.address;
    }

    const uniqueData = removeDuplicatesByAndGetUserPixels(
      x => x.args.coordinates.toString(),
      data.reverse(),
      userAddress
    );

    dispatch({
      type: SET_USER_PIXELS,
      payload: { userPixelsArr: uniqueData.userPixelsArr, userPixelObj: uniqueData.userPixelObj }
    });

    dispatch({ type: GENERATED_CANVAS_IMG, payload: { canvasArr: uniqueData.canvasArr } });

    // checks if any pixels where added by the PixelBought event listener
    if (getState().user.storedPixelArray.length > 0) {
      dispatch({ type: ADD_PIXELS_ADDED_WHILE_LOADING });
    }

    // checks if any pixels were bought from you while loading
    if (getState().user.storedPixelCoorsBoughtFromYou.length > 0) {
      const userState = getState().user;
      const storedPixelCoorsBoughtFromYou = userState.storedPixelCoorsBoughtFromYou;
      const userPixelArr = [...userState.myPixelsArr];

      storedPixelCoorsBoughtFromYou.forEach((storedPixelCoors) => {
        const deletedPixelArrayIndex = userState.myPixelsObj[storedPixelCoors];
        userPixelArr[deletedPixelArrayIndex].color = '';
      });

      dispatch({ type: PIXEL_BOUGHT_FROM_YOU, payload: userPixelArr });
    }
  });
};

/**
 * Sends form data to contract
 *
 * @param {Object} data
 */
export const submitBuyPixelForm = (data) => async (dispatch, getState) => {
  let coordinates = getState().modals.data.coordinates;
  coordinates = (coordinates.y * 1000) + coordinates.x;
  const price = parseFloat(data.price);
  const color = web3.toHex(data.color);
  const ownerlessPixel = getState().user.ownerLessPixel;

  if (!ownerlessPixel && (parseFloat(getState().user.singlePixel.amount) >= price)) {
    return dispatch({ type: BUY_PIXEL_ERROR, payload: 'You must pay more than the current bought for amount' });
  }

  dispatch({ type: BUY_PIXEL });

  try {
    await eth._buyPixel(coordinates, color, price);
  } catch (err) {
    return dispatch({ type: BUY_PIXEL_ERROR });
  }

  dispatch({ type: BUY_PIXEL_SUCCESS });
  return dispatch(modalActions.toggleModal(BUY_PIXEL_MODAL, false, {}, 'buyPixelForm'));
};

/**
 * Changes buyPixelForm color input when users changes react-color color
 *
 * @param {Object} color Object got from react-color
 */
export const handleChangeColorComplete = (color) => (dispatch) => {
  dispatch({ type: SELECTED_COLOR, payload: color.hex });
  dispatch(change('buyPixelForm', 'color', color.hex));
};

/**
 * Intended to change react-color color when user changes buyPixelForm color input
 *
 * @param {String} color
 */
export const handleChangeColorInput = (color) => (
  (dispatch) => { dispatch({ type: SELECTED_COLOR, payload: color }); }
);

/**
 * Listens for posible user change of metaMask account/address
 *
 */
export const pollForAddressChange = () => (dispatch, getState) => {
  setInterval(() => {
    if (getState().user.loadingPixels) return;

    if (!web3.eth.accounts[0]) {
      dispatch({ type: LOGGED_OUT });
      return;
    }

    if (web3.eth.accounts[0] === getState().user.address) return;

    dispatch({ type: GET_ETH_ADDRESS, payload: web3.eth.accounts[0] });

    if (getState().user.loggedOut) dispatch({ type: LOGGED_IN });

    dispatch(getAllBoughtPixels());
  }, 100);
};

/**
 * Updates state with coors of the pixel that should be zoomed in
 *
 */
export const goToPixel = (coors) => (dispatch) => {
  dispatch({ type: GO_TO_PIXEL, payload: coors });
};
