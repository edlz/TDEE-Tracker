import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import data from "./data";
import tdee from "./tdee";
export default combineReducers({ alert, auth, data, tdee });
