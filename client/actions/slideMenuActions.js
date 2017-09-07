import { ACCOUNT_SLIDE_MENU, STOP_NOTIFICATION_ALERT, TOGGLE_SLIDE_MENU } from './types';

/**
 * Toggles slide menu based on state (true === open, false === close)
 *
 * @param {String} slideMenuType
 * @param {String} state
 */
export default (slideMenuType, state) => (dispatch, getState) => {
  if (state && slideMenuType === ACCOUNT_SLIDE_MENU && getState().notifications.alert) {
    dispatch({ type: STOP_NOTIFICATION_ALERT });
  }

  dispatch({
    type: TOGGLE_SLIDE_MENU,
    payload: {
      currentOpen: state,
      currentType: slideMenuType,
    }
  });
};
