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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const WageChart = () => {
  // Fetch wages data using useQuery hook
  const { isLoading, data: wages = [] } = useQuery({
    queryKey: ["wages"],
    queryFn: () => fetchWages2(),
  });

  // Extract labels and data from wages
  const monthlyData = wages.reduce((acc, wage) => {
    // If the month already exists in the accumulator, add to the respective values, else initialize it
    if (acc[wage.month]) {
      acc[wage.month].nettPay += wage.nettPay;
      acc[wage.month].commission += wage.commission;
      acc[wage.month].totalIncome += wage.totalIncome;
      acc[wage.month].coachingFee += wage.coachingFee;
      acc[wage.month].totalpms += wage.totalpms;
    } else {
      acc[wage.month] = {
        nettPay: wage.nettPay,
        commission: wage.commission,
        totalIncome: wage.totalIncome,
        coachingFee: wage.coachingFee,
        totalpms: wage.totalpms,
      };
    }
    return acc;
  }, {});

  // Extracting the unique months and corresponding values for nettPay, commission, totalIncome, and chochingFee
  const labels = Object.keys(monthlyData);
  const nettPayData = labels.map((month) => monthlyData[month].nettPay);
  const commissionData = labels.map((month) => monthlyData[month].commission);
  const totalIncomeData = labels.map((month) => monthlyData[month].totalIncome);
  const chochingFeeData = labels.map((month) => monthlyData[month].coachingFee);
  const pmsData = labels.map((month) => monthlyData[month].totalpms);

  // Chart data configuration
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Nett Pay",
        data: nettPayData,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Commission",
        data: commissionData,
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: "Total Income",
        data: totalIncomeData,
        fill: false,
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1,
      },
      {
        label: "Choching Fee",
        data: chochingFeeData,
        fill: false,
        borderColor: "rgb(255, 205, 86)",
        tension: 0.1,
      },
      {
        label: "Bouns",
        data: pmsData,
        fill: false,
        borderColor: "rgb(255, 44, 123)",
        tension: 0.1,
      },
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
      {isLoading ? (
        <LoadingOverlay
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      ) : (
        <div>
          <h2>Financial Overview</h2>
          {/* Render Line chart with chart data */}
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default WageChart;
