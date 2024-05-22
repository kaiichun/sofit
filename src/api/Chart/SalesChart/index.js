import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import { fetchOrderPackages } from "../../orderspackage";
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

const SalesChart = () => {
  const { isLoading, data: orderPackages = [] } = useQuery({
    queryKey: ["orderPackages"],
    queryFn: () => fetchOrderPackages(),
  });

  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (orderPackages.length > 0) {
      const data = {};
      orderPackages.forEach((order) => {
        const paidDate = new Date(order.paid_at);
        const month = paidDate.getMonth() + 1; // Months are zero-based
        const year = paidDate.getFullYear();

        const formattedDate = `${year}-${month.toString().padStart(2, "0")}`; // Format date as YYYY-MM

        if (!data[formattedDate]) {
          // Initialize data for paid_at date if it doesn't exist
          data[formattedDate] = { totalPrice: 0, outstanding: 0 };
        }
        // Update totals for the paid_at date
        data[formattedDate].totalPrice += order.totalPrice;
        data[formattedDate].outstanding += order.outstanding;
      });
      setChartData(data);
    }
  }, [orderPackages]);

  const lineChart = chartData ? (
    <Line
      data={{
        labels: Object.keys(chartData),
        datasets: [
          {
            label: "Total Price",
            data: Object.values(chartData).map((data) => data.totalPrice),
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
          {
            label: "Outstanding",
            data: Object.values(chartData).map((data) => data.outstanding),
            fill: false,
            borderColor: "rgb(255, 99, 132)",
            tension: 0.1,
          },
        ],
      }}
      options={{
        scales: {
          x: {
            type: "time",
            time: {
              unit: "month", // Display x-axis labels by month
              displayFormats: {
                month: "MMM YYYY", // Format for x-axis labels (e.g., Jan 2022)
              },
            },
          },
        },
      }}
    />
  ) : null;

  return <div>{lineChart}</div>;
};

export default SalesChart;
