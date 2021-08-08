import { ERR_TDEE, GET_TDEE } from "../actions/constants";

const initialState = {
  tdee: "",
  loading: true,
};

const e = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_TDEE:
      return { ...state, loading: false, tdee: payload };
    case ERR_TDEE:
      return { ...state, loading: false, tdee: "?" };
    default:
      return state;
  }
};

export default e;
