import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
// redux
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from "prop-types";

import "./Register.css";

const Register = ({ setAlert, register, isAuthenticated }) => {
  const ini = new Date();
  const [formData, updateFormData] = useState({
    username: "",
    password: "",
    password2: "",
    start_weight: "",
    start_date: ini.toISOString().split("T")[0],
  });

  const { username, password, password2, start_weight, start_date } = formData;

  const onChange = (e) => {
    updateFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert("Passwords do not match", "danger");
    } else {
      register(formData);
    }
  };
  if (isAuthenticated) {
    return <Redirect to="/home" />;
  }
  return (
    <div className="container">
      <h1 className="title text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="8"
            value={password2}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <h1>Starting Weight (LB)</h1>
          <input
            type="number"
            placeholder="Starting Weight"
            name="start_weight"
            min="50"
            value={start_weight}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <h1>Starting Date</h1>
          <input
            type="date"
            name="start_date"
            value={start_date}
            onChange={onChange}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
};
Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, register })(Register);
