import { NEW_NOTIFICATION, HIDE_NOTIFICATION } from '../actions/types';

/**
 * Adds new notification to state
 *
 * @param {String} type
 * @param {Object} data
 */
export const newNotification = (type, data) => (dispatch, getState) => {
  const alert = !getState().slideMenu.currentOpen;
  const notification = data;
  notification.type = type;

  dispatch({ type: NEW_NOTIFICATION, payload: { notification, alert } });
};

/**
 * Hides notification based on notification index in state
 *
 * @param {Number} index
 */
export const hideNotification = (index) => (dispatch, getState) => {
  let notificationsArr = [...getState().notifications.notifications];
  notificationsArr.splice(index, 1);

  dispatch({ type: HIDE_NOTIFICATION, payload: notificationsArr });
};
