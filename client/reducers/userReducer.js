import {
  GENERATED_CANVAS_IMG, PIXEL_BOUGHT, GET_PIXEL,
  GET_PIXEL_SUCCESS, GET_PIXEL_ERROR, OWNERLESS_PIXEL,
  BUY_PIXEL, BUY_PIXEL_SUCCESS, BUY_PIXEL_ERROR, CLEAR_BUY_PIXEL_ERROR,
  PIXEL_ADDED_WHILE_LOADING, ADD_PIXELS_ADDED_WHILE_LOADING, GET_ETH_ADDRESS,
  SET_USER_PIXELS, PIXEL_BOUGHT_FROM_YOU, PIXEL_BOUGHT_FROM_YOU_WHILE_LOADING,
  GO_TO_PIXEL, LOGGED_OUT, LOGGED_IN
} from '../actions/types';

const INITIAL_STATE = {
  canvasArr: [],
  emptyAddress: '0x0000000000000000000000000000000000000000',
  address: '',
  myPixelsArr: [],
  myPixelsObj: {},
  loadingPixels: true,
  gettingPixel: false,
  getPixelError: '',
  singlePixel: {
    color: '',
    holder: '',
    amount: ''
  },
  ownerLessPixel: false,
  buyingPixel: false,
  buyingPixelError: '',
  storedPixelArray: [],
  storedPixelCoorsBoughtFromYou: [],
  centerPixel: false,
  loggedOut: false
};

export default (state = INITIAL_STATE, action) => {
  const payload = action.payload;

  switch (action.type) {
    case GET_ETH_ADDRESS:
      return { ...state, address: payload, loadingPixels: true };

    case SET_USER_PIXELS:
      return {
        ...state,
        myPixelsArr: payload.userPixelsArr,
        myPixelsObj: payload.userPixelObj
      };

    case LOGGED_OUT:
      return { ...state, loggedOut: true, address: '' };

    case LOGGED_IN:
      return { ...state, loggedOut: false };

    case GO_TO_PIXEL:
      return { ...state, centerPixel: payload };

    case PIXEL_BOUGHT_FROM_YOU:
      return { ...state, myPixelsArr: payload };

    case PIXEL_BOUGHT_FROM_YOU_WHILE_LOADING:
      return {
        ...state,
        storedPixelCoorsBoughtFromYou: [...state.storedPixelCoorsBoughtFromYou, payload]
      };

    case GENERATED_CANVAS_IMG:
      return { ...state, canvasArr: payload.canvasArr, loadingPixels: false };

    case PIXEL_BOUGHT:
      return { ...state, canvasArr: payload.canvasArr };

    // GET PIXEL
    case GET_PIXEL:
      return { ...state, gettingPixel: true };

    case GET_PIXEL_SUCCESS:
      return {
        ...state,
        gettingPixel: false,
        getPixelError: '',
        singlePixel: action.payload.singlePixel,
        ownerLessPixel: false
      };

    case GET_PIXEL_ERROR:
      return {
        ...state,
        gettingPixel: false,
        getPixelError: 'Error occurred while getting pixel data',
        ownerLessPixel: false
      };

    case PIXEL_ADDED_WHILE_LOADING:
      return {
        ...state,
        storedPixelArray: [...state.storedPixelArray, payload.pixel]
      };

    case ADD_PIXELS_ADDED_WHILE_LOADING: {
      let canvasArr = [...state.canvasArr];
      const storedPixelArray = state.storedPixelArray;

      for (let i = 0; i < storedPixelArray.length; i++) {
        let storedRgba = storedPixelArray[i].rgba;
        let storedCoors = storedPixelArray[i].coors;

        canvasArr[storedCoors] = storedRgba.r;
        canvasArr[storedCoors + 1] = storedRgba.g;
        canvasArr[storedCoors + 2] = storedRgba.b;
        canvasArr[storedCoors + 3] = storedRgba.a;
      }

      return { ...state, storedPixelArray: [], canvasArr };
    }

    case OWNERLESS_PIXEL:
      return { ...state, gettingPixel: false, ownerLessPixel: true, getPixelError: '' };

    case BUY_PIXEL:
      return { ...state, buyingPixel: true };

    case BUY_PIXEL_SUCCESS:
      return { ...state, buyingPixel: false, buyingPixelError: '' };

    case BUY_PIXEL_ERROR:
      return {
        ...state,
        buyingPixel: false,
        buyingPixelError: payload || 'Error occurred while buying pixel'
      };

    case CLEAR_BUY_PIXEL_ERROR:
      return { ...state, buyingPixel: false, buyingPixelError: '' };

    default:
      return state;
  }
};
