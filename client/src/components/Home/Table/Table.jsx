import React, { Fragment } from "react";
// redux
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { deleteData } from "../../../actions/data";

import "./Table.css";

const Table = ({ data, header, deleteData }) => {
  const accessors = header.map((x) => x["accessor"]);
  const headers = header.map((x) => x["Header"]);

  const onClick = (date) => {
    deleteData(date);
  };

  const createRow = (arr, key, btn) => {
    return (
      <tr key={key}>
        {arr.map((x, i) => (
          <th key={i}>{x}</th>
        ))}
        <th>
          {btn && (
            <button
              className="btn-delete"
              value={arr["date"]}
              onClick={() => onClick(arr[3])}
            >
              x
            </button>
          )}
        </th>
      </tr>
    );
  };
  const createAccessorArray = (obj, accessors) => {
    const row = [];
    accessors.forEach((acc) => row.push(obj[acc]));
    return row;
  };
  return (
    <Fragment>
      <table>
        <thead>{createRow(headers)}</thead>
        <tbody>
          {data.map((d, i) =>
            createRow(createAccessorArray(d, accessors), i, true)
          )}
        </tbody>
      </table>
    </Fragment>
  );
};

Table.propTypes = {
  deleteData: PropTypes.func.isRequired,
};

export default connect(null, { deleteData })(Table);
