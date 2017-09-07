import { reset } from 'redux-form';
import { TOGGLE_MODAL, BUY_PIXEL_MODAL, CLOSE_MODAL, CLEAR_BUY_PIXEL_ERROR } from './types';
import { rgbaToHex } from './utils';
import BuyPixelModal from '../components/Modals/BuyPixelModal';

/**
 * Extracts canvas pixel coordinates and color from event
 *
 * @param {Event} event
 * @param {Object} context
 * @return {Object}
 */
export const getDataForBuyPixelModal = (coordinates, context) => {
  const uiInt8Color = context.getImageData(coordinates.x, coordinates.y, 1, 1).data;
  const color = rgbaToHex(uiInt8Color);

  return { coordinates, color };
};

/**
 * Opens or closes modal based on state (true === open, false === close)
 * Clears any form in that modal if the modal form name is specified
 *
 * @param {String} modalType
 * @param {Boolean} state
 * @param {Object} data
 * @param {String} modalFormName
 */
export const toggleModal = (modalType, state, data, modalFormName) => (
  (dispatch) => {
    if (state === false && modalFormName) dispatch(reset(modalFormName));

    switch (modalType) {
      case BUY_PIXEL_MODAL:

        if (state === false) {
          dispatch({ type: CLEAR_BUY_PIXEL_ERROR });
          return dispatch({ type: CLOSE_MODAL });
        }

        return dispatch({
          type: TOGGLE_MODAL,
          payload: {
            modalType: BuyPixelModal,
            currentModalType: BUY_PIXEL_MODAL,
            state,
            data,
            modalFormName
          }
        });
      default:
        return false;
    }
  }
);
