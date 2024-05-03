import React from "react";
import { Line } from "react-chartjs-2";

const WageChart = ({ wages }) => {
  // Extracting labels and data from wages
  const labels = wages.map((wage) => wage.name); // Assuming 'name' is the label/category
  const data = wages.map((wage) => wage.nettPay); // Assuming 'nettPay' is the data value

  // Chart data
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Nett Pay",
        data: data,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Employees",
        },
      },
      y: {
        title: {
          display: true,
          text: "Nett Pay",
        },
      },
    },
  };

  return (
    <div>
      <h2>Nett Pay Chart</h2>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default WageChart;
