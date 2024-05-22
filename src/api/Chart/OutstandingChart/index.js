import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { fetchWages2 } from "../../wage";

import { LoadingOverlay } from "@mantine/core";

import { useQuery } from "@tanstack/react-query";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchOrderPackages } from "../../orderspackage";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const OutstandingChart = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // State to hold selected month

  const { isLoading, data: orderspackage = [] } = useQuery({
    queryKey: ["orderspackage"],
    queryFn: () => fetchOrderPackages(),
  });

  // Filter orderspackage data by date
  const filteredOrdersPackage = orderspackage.map((order) => {
    // Assuming paid_at is a date string
    const orderDate = new Date(order.day);
    if (order.month === selectedMonth) {
      return orderDate.getDate() && orderDate.getMonth() + 1;
    } else {
      return "0";
    }
  });

  const monthlyData = filteredOrdersPackage.reduce((acc, order) => {
    if (acc[order.day]) {
      acc[order.day].totalPrice += order.totalPrice;
      acc[order.day].outstanding += order.outstanding;
    } else {
      acc[order.day] = {
        totalPrice: order.totalPrice,
        outstanding: order.outstanding,
      };
    }
    return acc;
  }, {});

  // Extracting the unique months and corresponding values for nettPay, commission, totalIncome, and chochingFee
  const labels = Object.keys(monthlyData);
  const totalPriceData = labels.map((day) => monthlyData[day].totalPrice);
  const outstandingData = labels.map((day) => monthlyData[day].outstanding);
  // const packagesData = labels.map((paid_at) => monthlyData[paid_at].packages);

  // Chart data configuration
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Nett Pay",
        data: totalPriceData,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Outstangding",
        data: outstandingData,
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      // {
      //   label: "Total Income",
      //   data: packagesData,
      //   fill: false,
      //   borderColor: "rgb(54, 162, 235)",
      //   tension: 0.1,
      // },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: "category", // Ensure x-axis scale type is set to "category"
      },
    },
  };

  return (
    <div>
      <div>
        <h2>Financial Overview</h2>
        <label htmlFor="monthSelect">Select Month:</label>
        <select
          id="monthSelect"
          onChange={(e) => setSelectedMonth(e.target.value)}
          value={selectedMonth}
        >
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>
      {isLoading ? (
        <LoadingOverlay
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      ) : (
        <Line data={chartData} options={chartOptions} />
      )}
    </div>
  );
};

export default OutstandingChart;

//  I want have a select button for the month then I select the month only show the whole month day date
