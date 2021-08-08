import React, { useEffect, useState } from "react";
//redux
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getTdee } from "../../../actions/tdee";

import "./TDEE.css";

const TDEE = ({ date, getTdee, tdee, loading }) => {
  const [tdeeDate, setTdeeDate] = useState(date);
  useEffect(() => {
    getTdee(tdeeDate);
  }, [tdeeDate]);

  const onChange = (e) => {
    setTdeeDate(e.target.value);
  };
  return (
    <div className="tdee">
      <div className="tdee-inner-text">
        <h1>
          <span>Total Daily Energy Expenditure: </span>
          <span className="tdee-number">{!loading ? tdee : "---"}</span>
        </h1>
      </div>

      <div className="tdee-inner-form">
        <label>Date: </label>
        <input type="date" value={tdeeDate} onChange={onChange}></input>
      </div>
    </div>
  );
};

TDEE.propTypes = {
  getTdee: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  tdee: state.tdee.tdee,
  loading: state.tdee.loading,
});
export default connect(mapStateToProps, { getTdee })(TDEE);
