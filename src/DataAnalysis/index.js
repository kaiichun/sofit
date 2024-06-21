import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  Container,
  Group,
  Space,
  Text,
  Select,
  Title,
  Grid,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import HeaderData from "../HeaderData";
import { fetchOrders, deleteOrder, updateOrder } from "../api/order";
import { fetchClients } from "../api/client";
import { fetchBranch, fetchUsers } from "../api/auth";
import { fetchOrderPackages } from "../api/orderspackage";

export default function DataAnalysis() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { isLoading, data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrderPackages(currentUser ? currentUser.token : ""),
  });

  const { data: ordersProduct = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(currentUser ? currentUser.token : ""),
  });

  const { data: branches = [] } = useQuery({
    queryKey: ["fetchB"],
    queryFn: () => fetchBranch(),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(currentUser ? currentUser.token : ""),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => fetchClients(id),
  });

  const currentMonth = new Date().getMonth() + 1; // Current month (1-based)
  const currentYear = new Date().getFullYear(); // Current year
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedChartType, setSelectedChartType] = useState("bar");

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      notifications.show({
        title: "Order Deleted",
        color: "green",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      notifications.show({
        title: "Status Edited",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleDeleteClick = (orderId) => {
    openConfirmModal({
      title: "Confirm Deletion",
      children: <Text>Are you sure you want to delete this order?</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        deleteMutation.mutate({
          id: orderId,
          token: currentUser ? currentUser.token : "",
        });
      },
    });
  };

  const filteredOrders = useMemo(() => {
    let filtered = orders || ordersProduct;

    if (selectedMonth) {
      filtered = filtered.filter(
        (order) =>
          new Date(order.paid_at).getMonth() + 1 === parseInt(selectedMonth)
      );
    }

    if (selectedYear) {
      filtered = filtered.filter(
        (order) =>
          new Date(order.paid_at).getFullYear() === parseInt(selectedYear)
      );
    }

    return filtered;
  }, [orders, selectedMonth, selectedYear]);

  const aggregatedBranchData = useMemo(() => {
    const branchData = {};

    filteredOrders.forEach((order) => {
      const user = users.find((user) => user._id === order.user);
      const branch = user ? branches.find((b) => b._id === user.branch) : null;
      const branchName = branch ? branch.branch : "Unknown";
      const branchSsm = branch ? branch.ssm : "Unknown SSM";
      const orderDate = new Date(order.paid_at);
      const day = orderDate.getDate();

      if (!branchData[branchName]) {
        branchData[branchName] = {
          ssm: branchSsm,
          totalSales: Array.from(
            { length: new Date(selectedYear, selectedMonth, 0).getDate() },
            () => 0
          ),
          totalOutstanding: Array.from(
            { length: new Date(selectedYear, selectedMonth, 0).getDate() },
            () => 0
          ),
          dailyPackageSales: Array.from(
            { length: new Date(selectedYear, selectedMonth, 0).getDate() },
            () => ({})
          ),
        };
      }

      branchData[branchName].totalSales[day - 1] += order.totalPrice || 0;
      branchData[branchName].totalOutstanding[day - 1] +=
        order.outstanding || 0;

      (order.packages || []).forEach((pack) => {
        const packageName = pack.sofitpackage || "Unknown Package";
        if (branchData[branchName].dailyPackageSales[day - 1][packageName]) {
          branchData[branchName].dailyPackageSales[day - 1][packageName] += 1;
        } else {
          branchData[branchName].dailyPackageSales[day - 1][packageName] = 1;
        }
      });
    });

    return branchData;
  }, [filteredOrders, users, branches, selectedMonth, selectedYear]);

  const aggregatedBranchProductData = useMemo(() => {
    const branchData = {};

    filteredOrders.forEach((order) => {
      const user = users.find((user) => user._id === order.user);
      const branch = user ? branches.find((b) => b._id === user.branch) : null;
      const branchName = branch ? branch.branch : "Unknown";
      const branchSsm = branch ? branch.ssm : "Unknown SSM";
      const orderDate = new Date(order.paid_at);
      const day = orderDate.getDate();

      if (!branchData[branchName]) {
        branchData[branchName] = {
          ssm: branchSsm,
          totalSales: Array.from(
            { length: new Date(selectedYear, selectedMonth, 0).getDate() },
            () => 0
          ),
          dailyPackageSales: Array.from(
            { length: new Date(selectedYear, selectedMonth, 0).getDate() },
            () => ({})
          ),
        };
      }

      branchData[branchName].totalSales[day - 1] += order.totalPrice || 0;

      (order.products || []).forEach((pack) => {
        const packageName = pack.name || "Unknown Package";
        if (branchData[branchName].dailyPackageSales[day - 1][packageName]) {
          branchData[branchName].dailyPackageSales[day - 1][packageName] += 1;
        } else {
          branchData[branchName].dailyPackageSales[day - 1][packageName] = 1;
        }
      });
    });

    return branchData;
  }, [filteredOrders, users, branches, selectedMonth, selectedYear]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const renderProductSalesChart = () => {
    const branches = Object.keys(aggregatedBranchProductData);
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    const datasets = branches.flatMap((branch, index) => [
      {
        label: `${branch} (${aggregatedBranchProductData[branch].ssm}) Total Sales`,
        data: aggregatedBranchProductData[branch].totalSales,
        backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)}, 0.6)`,
        borderColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)}, 1)`,
        borderWidth: 1,
      },
    ]);

    const chartData = {
      labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      datasets,
    };

    if (branches.length === 0) {
      return null;
    }

    return (
      <Container size="100%" style={{ marginBottom: "40px" }}>
        <Title order={5} align="left">
          Product Daily Sales
        </Title>
        <Space h="xl" />
        <Bar data={chartData} options={chartOptions} />
      </Container>
    );
  };

  const renderSalesChart = () => {
    const branches = Object.keys(aggregatedBranchData);
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    const datasets = branches.flatMap((branch, index) => [
      {
        label: `${branch} (${aggregatedBranchData[branch].ssm}) Total Sales`,
        data: aggregatedBranchData[branch].totalSales,
        backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)}, 0.6)`,
        borderColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)}, 1)`,
        borderWidth: 1,
      },
      {
        label: `${branch} (${aggregatedBranchData[branch].ssm}) Outstanding`,
        data: aggregatedBranchData[branch].totalOutstanding,
        backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)}, 0.3)`,
        borderColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)}, 1)`,
        borderWidth: 1,
      },
    ]);

    const chartData = {
      labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      datasets,
    };

    if (branches.length === 0) {
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

    return (
      <Container size="100%" style={{ marginBottom: "40px" }}>
        <Space h="xl" />
        <Title order={5} align="left">
          Package Daily Sales
        </Title>

        <Space h="xl" />
        <Bar data={chartData} options={chartOptions} />
      </Container>
    );
  };

  const renderPackageChart = () => {
    const branches = Object.keys(aggregatedBranchData);
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    const datasets = branches.flatMap((branch, index) => {
      const packageNames = new Set();
      const dailyCounts = Array.from({ length: daysInMonth }, (_, dayIndex) => {
        const dayData =
          aggregatedBranchData[branch].dailyPackageSales[dayIndex];
        if (dayData) {
          Object.keys(dayData).forEach((pkg) => packageNames.add(pkg));
        }
        return dayData || {};
      });

      return Array.from(packageNames).map((pkgName) => {
        const counts = dailyCounts.map((dayData) => dayData[pkgName] || 0);
        return {
          label: `${branch} (${aggregatedBranchData[branch].ssm}) ${pkgName}`,
          data: counts,
          backgroundColor: `rgba(${Math.floor(
            Math.random() * 256
          )}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
            Math.random() * 256
          )}, 0.6)`,
          borderColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
            Math.random() * 256
          )}, ${Math.floor(Math.random() * 256)}, 1)`,
          borderWidth: 1,
        };
      });
    });

    const chartData = {
      labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      datasets,
    };

    if (branches.length === 0) {
      return null;
    }

    return (
      <Container size="100%" style={{ marginBottom: "40px" }}>
        <Title order={5} align="left">
          Package
        </Title>
        <Space h="xl" />
        <Bar data={chartData} options={chartOptions} />
      </Container>
    );
  };

  return (
    <>
      <Container size="100%">
        <HeaderData title="" page="" />
        <Space h="xl" />
        <Title order={1} align="center">
          Branch Daily Sales Data Analysis
        </Title>
        <Space h="40px" />
        <Group grow>
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
        </Group>
        <Space h="20px" />
        <Grid>
          <Grid.Col span={2}></Grid.Col>
          <Grid.Col span={8}>
            <Space h="15px" />
            {renderSalesChart()}
            {renderProductSalesChart()}
            <Space h="15px" />
            {renderPackageChart()}
          </Grid.Col>
          <Grid.Col span={2}></Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
