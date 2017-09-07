import { NEW_NOTIFICATION, HIDE_NOTIFICATION, STOP_NOTIFICATION_ALERT } from '../actions/types';

const INITIAL_STATE = {
  alert: false,
  notifications: []
};

export default (state = INITIAL_STATE, action) => {
  const payload = action.payload;

  switch (action.type) {
    case NEW_NOTIFICATION:
      return {
        ...state,
        alert: payload.alert,
        notifications: [payload.notification, ...state.notifications]
      };

    case HIDE_NOTIFICATION:
      return { ...state, notifications: payload };

    case STOP_NOTIFICATION_ALERT:
      return { ...state, alert: false };

    default:
      return state;
  }
};
