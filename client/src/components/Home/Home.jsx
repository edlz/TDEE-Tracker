import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Home.css";

const Home = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }
  return (
    <div className="home">
      <h1>home</h1>
    </div>
  );
};
Home.propTypes = {
  isAuthenticated: PropTypes.bool,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Home);
