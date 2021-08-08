import {
  GET_DATA,
  ERR_DATA,
  WEIGHT_SUCCESS,
  WEIGHT_ERR,
  CALORIE_ERR,
  CALORIE_SUCCESS,
  DELETE_SUCCESS,
  DELETE_ERR,
} from "../actions/constants";

const initialState = {
  data: [],
  loading: true,
  error: {},
};

const e = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_DATA:
      return { ...state, data: payload, loading: false };
    case ERR_DATA:
      return { ...state, error: payload, loading: false };
    case WEIGHT_SUCCESS:
    case CALORIE_SUCCESS:
    case DELETE_SUCCESS:
      return { ...state, loading: true };
    case WEIGHT_ERR:
    case CALORIE_ERR:
    case DELETE_ERR:
    default:
      return { ...state };
  }
};

export default e;
