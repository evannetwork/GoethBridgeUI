import * as actionTypes from './actionTypes';

export const initializeNetwork = (network, provider, pubKey) => {
  return (dispatch) => {
    dispatch({
      type: actionTypes.INITIALIZE_NETWORK,
      payload: { network, provider, pubKey },
    });
  };
};

// will tell us what component we need to render
// 0 - form not submitted
// 1 - waiting for events to return
// 2 - display TX data
export const setAppComponentState = (index) => {
  return (dispatch) => {
    dispatch({
      type: actionTypes.SET_APP_COMPONENT_STATE,
      payload: index,
    });
  };
}