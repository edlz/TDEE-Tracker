import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Landing.css";

const Landing = ({ isAuthenticated }) => {
  return (
    <div className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="title">Total Daily Energy Expenditure Tracker</h1>
          <p>
            Your TDEE is the number of calories you burn in a day. This app
            calculates your TDEE by inputting your daily calories consumed and
            your weight.
          </p>
          <div className="buttons">
            {!isAuthenticated ? (
              <Fragment>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
                <Link to="/login" className="btn btn-light">
                  Login
                </Link>
              </Fragment>
            ) : (
              <Link to="/home" className="btn btn-primary">
                Home
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
