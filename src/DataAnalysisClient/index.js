import { Select, Space, Container, Title, Group, Grid } from "@mantine/core";
import React, { useState, useMemo } from "react";
import { useCookies } from "react-cookie";
import { useQuery } from "@tanstack/react-query";
import { fetchClients } from "../api/client";
import { fetchBranch } from "../api/auth";
import HeaderData from "../HeaderData";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  ChartTitle,
  Tooltip,
  Legend
);

export default function DataAnalysisClient() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const currentUserBranch = useMemo(() => {
    return cookies?.currentUser?.branch;
  }, [cookies]);
  const currentMonth = new Date().getMonth() + 1; // Current month (1-based)
  const currentYear = new Date().getFullYear(); // Current year
  const [selectedBranch, setSelectedBranch] = useState(currentUserBranch);
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedChartType, setSelectedChartType] = useState("bar");

  const { isLoading: isLoadingBranches, data: branches = [] } = useQuery({
    queryKey: ["branches"],
    queryFn: () => fetchBranch(),
  });

  const { isLoading: isLoadingClients, data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => fetchClients(),
  });

  const filteredClients = useMemo(() => {
    let filtered = clients;

    if (selectedBranch) {
      filtered = filtered.filter((client) => client.branch === selectedBranch);
    }

    if (selectedYear) {
      filtered = filtered.filter(
        (client) =>
          new Date(client.createdAt).getFullYear() === parseInt(selectedYear)
      );
    }

    if (selectedMonth) {
      filtered = filtered.filter(
        (client) =>
          new Date(client.createdAt).getMonth() + 1 === parseInt(selectedMonth)
      );
    }

    if (selectedDay) {
      filtered = filtered.filter(
        (client) =>
          new Date(client.createdAt).getDate() === parseInt(selectedDay)
      );
    }

    return filtered;
  }, [clients, selectedBranch, selectedYear, selectedMonth, selectedDay]);

  const chartData = useMemo(() => {
    if (selectedYear && selectedMonth && selectedDay) {
      return {
        labels: filteredClients.map((client) => client.clientName),
        datasets: [
          {
            label: "Clients Added",
            data: filteredClients.map(() => 1),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      };
    } else if (selectedYear && selectedMonth) {
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      const dailyCounts = Array(daysInMonth).fill(0);

      filteredClients.forEach((client) => {
        const day = new Date(client.createdAt).getDate() - 1;
        dailyCounts[day] += 1;
      });

      return {
        labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
        datasets: [
          {
            label: "Clients Added",
            data: dailyCounts,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      };
    } else if (selectedYear) {
      const monthlyCounts = Array(12).fill(0);

      filteredClients.forEach((client) => {
        const month = new Date(client.createdAt).getMonth();
        monthlyCounts[month] += 1;
      });

      return {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            label: "Clients Added",
            data: monthlyCounts,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      };
    } else {
      return {
        labels: [],
        datasets: [],
      };
    }
  }, [filteredClients, selectedYear, selectedMonth, selectedDay]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const renderChart = () => {
    if (filteredClients.length === 0) {
      return (
        <Container size="100%" style={{ textAlign: "center" }}>
          <Space h={100} />
          <Title order={3} align="center" mt="md" mb="md">
            {selectedMonth || selectedYear
              ? "No data available for selected filters"
              : "No data available"}
          </Title>
          <Space h={100} />
        </Container>
      );
    }

    switch (selectedChartType) {
      case "line":
        return <Line data={chartData} options={chartOptions} />;
      case "bar":
        return <Bar data={chartData} options={chartOptions} />;
      case "pie":
        return <Pie data={chartData} options={chartOptions} />;
      default:
        return <Bar data={chartData} options={chartOptions} />;
    }
  };

  const isAdminHQ = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "Admin HQ"
      ? true
      : false;
  }, [cookies]);

  return (
    <Container size="100%">
      <HeaderData title="Clients" page="Clients" />
      <Space h="xl" />
      <Title align="center">Client Data</Title>
      <Space h="xl" />
      <Group grow>
        <Select
          placeholder="Select Branch"
          value={selectedBranch}
          onChange={setSelectedBranch}
          data={branches.map((branch) => ({
            value: branch._id,
            label: branch.branch,
          }))}
          disabled={!isAdminHQ}
        />
        <Select
          placeholder="Select Year"
          value={selectedYear}
          onChange={setSelectedYear}
          data={[...Array(20)].map((_, index) => {
            const year = new Date().getFullYear() - index;
            return { value: year.toString(), label: year.toString() };
          })}
        />
        {selectedYear && (
          <Select
            placeholder="Select Month"
            value={selectedMonth}
            onChange={setSelectedMonth}
            data={[
              { value: "1", label: "January" },
              { value: "2", label: "February" },
              { value: "3", label: "March" },
              { value: "4", label: "April" },
              { value: "5", label: "May" },
              { value: "6", label: "June" },
              { value: "7", label: "July" },
              { value: "8", label: "August" },
              { value: "9", label: "September" },
              { value: "10", label: "October" },
              { value: "11", label: "November" },
              { value: "12", label: "December" },
            ]}
            clearable
          />
        )}
        {selectedYear && selectedMonth && (
          <Select
            placeholder="Select Day"
            value={selectedDay}
            onChange={setSelectedDay}
            data={[
              ...Array(new Date(selectedYear, selectedMonth, 0).getDate()),
            ].map((_, index) => ({
              value: (index + 1).toString(),
              label: (index + 1).toString(),
            }))}
            clearable
          />
        )}
        <Select
          placeholder="Select Chart Type"
          value={selectedChartType}
          onChange={setSelectedChartType}
          data={[
            { value: "line", label: "Line" },
            { value: "bar", label: "Bar" },
            { value: "pie", label: "Pie" },
          ]}
        />
      </Group>
      <Space h="xl" />
      <Grid>
        <Grid.Col span={11}>{renderChart()}</Grid.Col>
      </Grid>
    </Container>
  );
}
