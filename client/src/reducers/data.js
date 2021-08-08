import {
  GET_DATA,
  ERR_DATA,
  WEIGHT_SUCCESS,
  WEIGHT_ERR,
  CALORIE_ERR,
  CALORIE_SUCCESS,
} from "../actions/constants";

const initialState = {
  username: "",
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
    case WEIGHT_ERR:
    case CALORIE_SUCCESS:
    case CALORIE_ERR:
      return { ...state, loading: true };
    default:
      return { ...state };
  }
};

export default e;
