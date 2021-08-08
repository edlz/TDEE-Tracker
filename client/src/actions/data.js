import axios from "axios";
import { setAlert } from "./alert";

import {
  WEIGHT_SUCCESS,
  WEIGHT_ERR,
  CALORIE_SUCCESS,
  CALORIE_ERR,
  GET_DATA,
  ERR_DATA,
  DELETE_ERR,
  DELETE_SUCCESS,
} from "./constants";

// get all data
export const loadData = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/data");

    dispatch({ type: GET_DATA, payload: res.data });
  } catch (err) {
    dispatch({
      type: ERR_DATA,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    dispatch(setAlert("Could Not Retrieve Data", "danger"));
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
    let caloriesUpdated = false;
    let weightUpdated = false;
    if (calories.length > 0) {
      try {
        const calorieBody = {
          calories,
          day: date,
        };
        const res = await axios.post("/api/calories", calorieBody, config);
        caloriesUpdated = res.data;
        dispatch({ type: CALORIE_SUCCESS });
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
        weightUpdated = res.data;
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
    if (caloriesUpdated && weightUpdated) {
      dispatch(setAlert("Calories and " + weightUpdated, "success"));
    } else if (caloriesUpdated) {
      dispatch(setAlert(caloriesUpdated, "success"));
    } else if (weightUpdated) {
      dispatch(setAlert(weightUpdated, "success"));
    }
  };

// delete data
export const deleteData = (date) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/data/${date}`);

    dispatch({
      type: DELETE_SUCCESS,
    });
    dispatch(setAlert(res.data, "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: DELETE_ERR,
    });
  }
};
