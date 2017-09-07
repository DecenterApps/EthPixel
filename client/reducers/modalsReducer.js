import React from 'react';
import { TOGGLE_MODAL, SELECTED_COLOR, CLOSE_MODAL } from '../actions/types';

const INITIAL_STATE = {
  currentOpen: false,
  currentModal: () => <div>error</div>,
  currentModalType: '',
  modalFormName: '',
  data: {}
};

export default (state = INITIAL_STATE, action) => {
  const payload = action.payload;

  switch (action.type) {
    case TOGGLE_MODAL:
      return {
        ...state,
        currentModal: payload.modalType,
        currentOpen: payload.state,
        currentModalType: payload.currentModalType,
        modalFormName: payload.modalFormName,
        data: payload.data
      };

    case CLOSE_MODAL:
      return {
        ...state,
        currentOpen: false,
        currentModal: () => <div>error</div>,
        currentModalType: '',
        modalFormName: '',
        data: {}
      };

    case SELECTED_COLOR:
      return {
        ...state,
        data: {
          color: payload,
          coordinates: state.data.coordinates
        }
      };

    default:
      return state;
  }
};
