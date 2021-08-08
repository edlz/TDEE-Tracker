import React, { Fragment } from "react";
import { Line } from "react-chartjs-2";

import "./Graphs.css";

const Graphs = ({ data }) => {
  const dataCopy = [...data];
  dataCopy.sort((first, second) => {
    return first.day > second.day;
  });
  const weightCopy = [...dataCopy].filter((x) => x.weight);
  const wLabels = weightCopy.map((x) => x.day);
  const wData = weightCopy.map((x) => x.weight);

  const caloriesCopy = [...dataCopy].filter((x) => x.calories);
  const cLabels = caloriesCopy.map((x) => x.day);
  const cData = caloriesCopy.map((x) => x.calories);

  console.log(data[0].date);
  const weightData = {
    labels: wLabels,
    datasets: [
      {
        label: "Weight(LB)",
        data: wData,
        fill: false,
        backgroundColor: "rgb(2, 99, 132)",
        borderColor: "rgba(2, 99, 132, 0.4)",
      },
    ],
  };

  const caloriesData = {
    labels: cLabels,
    datasets: [
      {
        label: "Calories",
        data: cData,
        fill: false,
        backgroundColor: "rgb(204, 102, 0)",
        borderColor: "rgba(255, 99, 0, 0.5)",
      },
    ],
  };
  const tdeeData = {
    labels: ["..."],
    datasets: [
      {
        label: "TDEE",
        data: ["..."],
        fill: false,
        backgroundColor: "rgb(0, 0, 0)",
        borderColor: "rgba(0, 0, 0, 0.5)",
      },
    ],
  };
  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <Fragment>
      <div>
        <div className="header">
          <h3>Weight by Day</h3>
        </div>
        <Line data={weightData} options={options} />
      </div>
      <div>
        <div className="header">
          <h3>Calories by Day</h3>
        </div>
        <Line data={caloriesData} options={options} />
      </div>
      <div>
        <div className="header">
          <h3>TDEE by Week</h3>
        </div>
        <Line data={tdeeData} options={options} />
      </div>
    </Fragment>
  );
};

export default Graphs;
