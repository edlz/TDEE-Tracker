import React, { Fragment, useState } from "react";
// redux
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { newData } from "../../../actions/data";

const WeightEntry = ({ newData, startingDay, lastDay, lastDate }) => {
  const startingDate = new Date(startingDay);
  const ini = new Date(lastDate);
  ini.setDate(ini.getDate() + 1);

  console.log(ini);
  const [formData, updateFormData] = useState({
    weight: "",
    calories: "",
    day: lastDay + 1,
    date: ini.toISOString().split("T")[0],
  });

  const { weight, calories, day, date } = formData;
  const onChange = (e) => {
    updateFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onChangeDate = (e) => {
    const newDate = new Date(e.target.value);
    const day =
      Math.floor((newDate - startingDate) / (24 * 60 * 60 * 1000)) + 1;
    updateFormData({ ...formData, date: e.target.value, day });
  };

  const onChangeDay = (e) => {
    const date = new Date(
      startingDate.getTime() + 24 * 60 * 60 * 1000 * (e.target.value - 1)
    );
    updateFormData({
      ...formData,
      day: e.target.value,
      date: date.toISOString().split("T")[0],
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    newData(formData);
  };

  return (
    <Fragment>
      <p className="lead">
        <i className="fas fa-plus"></i> New Entry
      </p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <label>Weight (LB) </label>
          <input
            type="number"
            name="weight"
            placeholder="ex: 200.3"
            value={weight}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label>Calories</label>
          <input
            type="number"
            name="calories"
            placeholder="Calories"
            value={calories}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label>Day</label>
          <input
            type="number"
            name="day"
            placeholder="Day"
            value={day}
            onChange={onChangeDay}
          />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            placeholder="Date"
            value={date}
            onChange={onChangeDate}
          />
        </div>

        <input
          type="submit"
          className="btn btn-primary"
          value="Submit"
          onChange={onChangeDate}
        />
      </form>
    </Fragment>
  );
};

WeightEntry.propTypes = {
  newData: PropTypes.func.isRequired,
};

export default connect(null, { newData })(WeightEntry);
