import axios from "axios";
import { ERR_TDEE, GET_TDEE } from "./constants";

export const getTdee = (date) => async (dispatch) => {
  try {
    const res = await axios.get("/api/tdee", {
      params: {
        date,
      },
    });

    dispatch({
      type: GET_TDEE,
      payload: res.data.tdee,
    });
  } catch (err) {
    dispatch({
      type: ERR_TDEE,
    });
  }
};
