import axios from "axios";
import { setAlert } from "./alert";

import {
  GET_WEIGHTS,
  ERR_WEIGHTS,
  WEIGHT_SUCCESS,
  WEIGHT_ERR,
  CALORIE_SUCCESS,
  CALORIE_ERR,
  GET_DATA,
  ERR_DATA,
} from "./constants";

// get all data
export const loadData = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/data");
    console.log(res);
    dispatch({ type: GET_DATA, payload: res.data });
    dispatch(setAlert("Data Loaded", "success"));
  } catch (err) {
    dispatch({
      type: ERR_DATA,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    dispatch(setAlert("Could Not Retrieve Data", "danger"));
  }
};

// get all weights
export const loadWeights = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/weight");
    dispatch({ type: GET_WEIGHTS, payload: res.data });
    dispatch(setAlert("Weights Retrieved", "success"));
  } catch (err) {
    dispatch({
      type: ERR_WEIGHTS,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    dispatch(setAlert("Could Not Retrive Data", "danger"));
  }
};

// enter new data
export const newData =
  ({ calories, date, weight }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (calories.length > 0) {
      try {
        const calorieBody = {
          calories,
          day: date,
        };
        const res = await axios.post("/api/calories", calorieBody, config);

        dispatch({ type: CALORIE_SUCCESS });
        dispatch(setAlert(res.data, "success"));
      } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
          type: CALORIE_ERR,
        });
      }
    }
    if (weight.length > 0) {
      try {
        const weightBody = {
          weight,
          day: date,
        };
        const res = await axios.post("/api/weight", weightBody, config);

        dispatch({ type: WEIGHT_SUCCESS });
        dispatch(setAlert(res.data, "success"));
      } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
          type: WEIGHT_ERR,
        });
      }
    }
    dispatch(loadData());
  };
