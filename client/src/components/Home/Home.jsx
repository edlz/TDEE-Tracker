import React, { useEffect, Fragment } from "react";

// components
import Table from "./Table/Table";
import WeightEntry from "./WeightEntry/WeightEntry";
// redux
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loadData } from "../../actions/data";
import "./Home.css";

const Home = ({ loadData, data, loading }) => {
  useEffect(() => {
    loadData();
  }, []);

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
          <div className="container">
            <Table data={data} header={columns} />
          </div>
          <div className="container">
            <WeightEntry startingDay={data[data.length - 1].date} />
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
