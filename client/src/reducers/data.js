import {
  GET_WEIGHTS,
  ERR_WEIGHTS,
  GET_DATA,
  ERR_DATA,
} from "../actions/constants";

const initialState = {
  username: "",
  weights: [],
  calories: [],
  data: [],
  loading: true,
  error: {},
};
const e = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_DATA:
      return { ...state, data: payload, loading: false };
    case GET_WEIGHTS:
      return { ...state, weights: payload, loading: false };
    case ERR_WEIGHTS:
    case ERR_DATA:
      return { ...state, error: payload, loading: false };
    default:
      return { ...state };
  }
};

export default e;
