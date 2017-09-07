import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import { combineReducers } from 'redux';
import modalsReducer from './modalsReducer';
import userReducer from './userReducer';
import slideMenuReducer from './slideMenuReducer';
import notificationsReducer from './notificationsReducer';

export default combineReducers({
  form: formReducer,
  routing: routerReducer,
  modals: modalsReducer,
  user: userReducer,
  slideMenu: slideMenuReducer,
  notifications: notificationsReducer
});
