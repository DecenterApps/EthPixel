import { TOGGLE_SLIDE_MENU } from '../actions/types';

const INITIAL_STATE = {
  currentOpen: false,
  currentType: ''
};

export default (state = INITIAL_STATE, action) => {
  const payload = action.payload;

  switch (action.type) {
    case TOGGLE_SLIDE_MENU:
      return {
        ...state,
        currentOpen: payload.currentOpen,
        currentType: payload.currentType
      };

    default:
      return state;
  }
};
