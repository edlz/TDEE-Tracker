import React, { useEffect, Fragment } from "react";

// components
import Table from "./Table/Table";
import WeightEntry from "./WeightEntry/WeightEntry";
import TDEE from "./TDEE/TDEE";
// redux
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loadData } from "../../actions/data";
import "./Home.css";

const Home = ({ loadData, data, loading }) => {
  useEffect(() => {
    loadData();
  }, [loading]);

  const columns = [
    { Header: "Day", accessor: "day" },
    { Header: "Weight", accessor: "weight" },
    { Header: "Calories", accessor: "calories" },
    { Header: "Date", accessor: "date" },
  ];

  return (
    <div className="home">
      {!loading && (
        <Fragment>
          <TDEE date={data && data[0].date} />
          <div className="container">
            <WeightEntry startingDay={data[data.length - 1].date} />
          </div>
          <div className="container">
            <div>
              <input type="radio"></input>
              <input type="radio"></input>
            </div>

            <Table data={data} header={columns} />
          </div>
        </Fragment>
      )}
    </div>
  );
};

Home.propTypes = {
  loadData: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data.data,
  loading: state.data.loading,
});

export default connect(mapStateToProps, { loadData })(Home);
