import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import {
  Container,
  Title,
  Group,
  Button,
  Select,
  LoadingOverlay,
  TextInput,
  Space,
} from "@mantine/core";
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { fetchUsers, fetchBranch } from "../api/auth";
import { fetchWages2 } from "../api/wage";
import { Line, Bar, Pie } from "react-chartjs-2";
import "chart.js/auto"; // Auto-imports the required chart components
import HeaderData from "../HeaderData";

export default function DataAnalysisWages() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedChartType, setSelectedChartType] = useState("line");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [currentWage, setCurrentWage] = useState([]);
  const { isLoading, data: wages = [] } = useQuery({
    queryKey: ["wages"],
    queryFn: () => fetchWages2(currentUser ? currentUser.token : ""),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(currentUser ? currentUser.token : ""),
  });

  const { data: branches = [] } = useQuery({
    queryKey: ["fetchB"],
    queryFn: () => fetchBranch(),
  });

  const currentUserBranch = useMemo(() => {
    return cookies?.currentUser?.branch;
  }, [cookies]);

  const isAdminBranch = useMemo(() => {
    return cookies?.currentUser?.role === "Admin Branch";
  }, [cookies]);

  const isAdminHQ = useMemo(() => {
    return cookies?.currentUser?.role === "Admin HQ";
  }, [cookies]);

  const monthOptions = [
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
  ];

  const yearOptions = Array.from(new Array(5), (_, index) => {
    const year = new Date().getFullYear() - index;
    return { value: year.toString(), label: year.toString() };
  });

  useEffect(() => {
    let newList = wages ? [...wages] : [];

    if (searchTerm) {
      newList = newList.filter(
        (i) =>
          i.name.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0 ||
          i.payslipNo.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0
      );
    }

    if (isAdminHQ && selectedBranch !== null) {
      newList = newList.filter((wage) => wage.branch === selectedBranch);
    }
    if (selectedMonth) {
      newList = newList.filter((wage) => wage.month === selectedMonth);
    }

    if (selectedYear) {
      newList = newList.filter((wage) => wage.year === selectedYear);
    }

    // Sort by year and month
    newList.sort((a, b) => {
      // Construct date strings from year and month fields
      const dateA = `${a.year}-${a.month.padStart(2, "0")}`;
      const dateB = `${b.year}-${b.month.padStart(2, "0")}`;

      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
      return 0;
    });

    setCurrentWage(newList);
  }, [
    wages,
    searchTerm,
    selectedBranch,
    selectedMonth,
    selectedYear,
    currentUserBranch,
    isAdminBranch,
    isAdminHQ,
  ]);

  const chartData = useMemo(() => {
    const labels = currentWage.map(
      (wage) => `${wage.name} (${wage.year}/${wage.month})`
    );
    const totalIncomeData = currentWage.map((wage) => wage.totalIncome);
    const totalDeductionData = currentWage.map((wage) => wage.totalDeduction);
    const nettPayData = currentWage.map((wage) => wage.nettPay);

    const backgroundColors = [
      "rgba(255, 99, 132, 0.6)", // Red
      "rgba(54, 162, 235, 0.6)", // Blue
      "rgba(255, 206, 86, 0.6)", // Yellow
    ]; // Add more colors as needed

    return {
      labels,
      datasets: [
        {
          label: "Total Income",
          data: totalIncomeData,
          backgroundColor: backgroundColors[0],
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
        {
          label: "Total Deduction",
          data: totalDeductionData,
          backgroundColor: backgroundColors[1],
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
        {
          label: "Nett Pay",
          data: nettPayData,
          backgroundColor: backgroundColors[2],
          borderColor: "rgba(255, 206, 86, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [currentWage]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Wages Chart",
      },
    },
  };

  const renderChart = () => {
    // Check if currentWage has data
    if (currentWage.length === 0) {
      return (
        <Container size="100%" style={{ textAlign: "center" }}>
          <Space h={180} />
          <Title order={3} align="center" mt="md" mb="md">
            No data available for selected filters
          </Title>
        </Container>
      );
    }

    // Render chart based on selectedChartType
    switch (selectedChartType) {
      case "line":
        return <Line data={chartData} options={chartOptions} />;
      case "bar":
        return <Bar data={chartData} options={chartOptions} />;
      case "pie":
        return <Pie data={chartData} options={chartOptions} />;
      default:
        return <Line data={chartData} options={chartOptions} />;
    }
  };

  return (
    <>
      {" "}
      <Container size="100%">
        <LoadingOverlay visible={isLoading} overlayBlur={2} />
        <HeaderData title="Wages" page="Wages" />
        <Space h="xl" />
        <Title align="center">Wages Data</Title>
        <Space h="xl" />
        <Group position="right" mb="lg">
          <TextInput
            w="200px"
            value={searchTerm}
            placeholder="Search"
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <Select
            placeholder="Select branch"
            value={selectedBranch}
            onChange={setSelectedBranch}
            data={[
              { value: null, label: "All Branches" },
              ...branches.map((branch) => ({
                value: branch._id,
                label: branch.branch,
              })),
            ]}
            clearable
            disabled={!isAdminHQ}
          />

          <Select
            placeholder="Select month"
            value={selectedMonth}
            onChange={(value) => setSelectedMonth(value)}
            data={monthOptions}
            clearable
          />
          <Select
            placeholder="Select year"
            value={selectedYear}
            onChange={(value) => setSelectedYear(value)}
            data={yearOptions}
            clearable
          />
          <Select
            placeholder="Select chart type"
            value={selectedChartType}
            onChange={setSelectedChartType}
            data={[
              { value: "line", label: "Line Chart" },
              { value: "bar", label: "Bar Chart" },
              { value: "pie", label: "Pie Chart" },
            ]}
          />
        </Group>
        {renderChart()}
      </Container>
    </>
  );
}
