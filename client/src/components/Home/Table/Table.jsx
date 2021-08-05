import React, { Fragment } from "react";

import "./Table.css";
const Table = ({ data, header }) => {
  const accessors = header.map((x) => x["accessor"]);
  const headers = header.map((x) => x["Header"]);
  const createRow = (arr, key) => {
    return (
      <tr key={key}>
        {arr.map((x, i) => (
          <th key={i}>{x}</th>
        ))}
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
          {data.map((d, i) => createRow(createAccessorArray(d, accessors), i))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default Table;
