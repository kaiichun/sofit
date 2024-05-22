import React from "react";
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
  // Fetch wages data using useQuery hook
  const { data: wages = [] } = useQuery({
    queryKey: ["wages"],
    queryFn: () => fetchWages2(),
  });

  const { isLoading, data: orderspackage = [] } = useQuery({
    queryKey: ["orderspackage"],
    queryFn: () => fetchOrderPackages(),
  });

  // Filter orderspackage data by date
  const filteredOrdersPackage = orderspackage.filter((order) => {
    // Assuming paid_at is a date string
    const orderDate = new Date(order.day);
    // Assuming you want to filter data for a specific date, change the comparison logic accordingly

    return (
      orderDate.getDate() && orderDate.getMonth() && orderDate.getFullYear()
    );
  });

  // Extract labels and data from filteredOrdersPackage
  const monthlyData = filteredOrdersPackage.reduce((acc, order) => {
    // If the month already exists in the accumulator, add to the respective values, else initialize it
    if (acc[order.day]) {
      acc[order.day].totalPrice += order.totalPrice;
      acc[order.day].outstanding += order.outstanding;
      // acc[order.day].packages += order.packages;
    } else {
      acc[order.day] = {
        totalPrice: order.totalPrice,
        outstanding: order.outstanding,
        // packages: order.packages,
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
      {/* Display loading indicator if data is still loading */}
      {isLoading ? (
        <LoadingOverlay
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      ) : (
        <div>
          <h2>Financial Overview</h2>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default OutstandingChart;

//  I want have a select button for the month then I select the month only show the whole month day date
