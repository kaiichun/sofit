import React, { useState, useEffect } from "react";
import {
  Container,
  Space,
  Card,
  Grid,
  TextInput,
  Text,
  Button,
  Group,
  Select,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { fetchUsers } from "../api/auth";
import { fetchUserPMS } from "../api/pms";
import { fetchOrders } from "../api/order";
import { addWage } from "../api/wage";

function WageAdd() {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedPMS, setSelectedPMS] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [coachingFee, setCoachingFee] = useState("");
  const [epf, setEpf] = useState("");
  const [basic, setBasic] = useState("");
  const [socso, setSocso] = useState("");
  const [eis, setEis] = useState("");
  const [pcd, setPcd] = useState("");
  const [allowance, setAllowance] = useState("");
  const [claims, setClaims] = useState("");
  const [employerEpf, setEmployerEpf] = useState("");
  const [employerSocso, setEmployerSocso] = useState("");
  const [employerEis, setEmployerEis] = useState("");
  const [totalIncome, setTotalIncome] = useState("");
  const [overtime, setOvertime] = useState("");
  const [nettPay, setNettPay] = useState("");
  const [commission, setCommission] = useState("");

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });

  const { data: pms = [] } = useQuery({
    queryKey: ["pms"],
    queryFn: () => fetchUserPMS(),
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(),
  });

  const createMutation = useMutation({
    mutationFn: addWage,
    onSuccess: () => {
      notifications.show({
        title: "New Wage Added",
        color: "green",
      });
      navigate("/home");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleAddNewStaffWage = async () => {
    const filteredOrders = orders.filter(
      (order) =>
        new Date(order.date).getMonth() === parseInt(month, 10) - 1 &&
        new Date(order.date).getFullYear() === parseInt(year, 10)
    );

    const totalCommission = filteredOrders.reduce(
      (total, order) => total + parseFloat(order.commission),
      0
    );
    setCommission(totalCommission);

    createMutation.mutate({
      user: selectedUser ? selectedUser._id : null,
      pms: selectedPMS ? selectedPMS._id : null,
      order: selectedOrder ? selectedOrder._id : null,
      month: month,
      year: year,
      coachingFee: coachingFee,
      basic: basic,
      epf: epf,
      socso: socso,
      eis: eis,
      pcd: pcd,
      allowance: allowance,
      claims: claims,
      employerEpf: employerEpf,
      employerSocso: employerSocso,
      employerEis: employerEis,
      totalIncome: totalIncome,
      overtime: overtime,
      nettPay: nettPay,
      commission: totalCommission,
    });
  };

  return (
    <Container>
      <Space h="100px" />
      <Card withBorder shadow="md" p="20px">
        <Grid grow gutter="xs">
          <Grid.Col span={4}>
            <Select
              data={users.map((user) => ({
                value: user._id,
                label: `${user.name} (${user.ic})`,
              }))}
              value={selectedUser}
              onChange={(value) => setSelectedUser(value)}
              label="Select Staff"
              placeholder="Select a Staff"
            />
            <Grid.Col span={4}>
              <TextInput
                value={selectedUser.salary}
                label="Basic"
                onChange={(event) => setBasic(event.target.value)}
              />
            </Grid.Col>
          </Grid.Col>
          <Grid.Col span={4}>
            <Text>PMS result</Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Text>commission:{commission}</Text>
          </Grid.Col>

          <Grid.Col span={4}>
            <TextInput
              value={coachingFee}
              label="Coaching Fee"
              onChange={(event) => setCoachingFee(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              value={totalIncome}
              label="Total Income"
              onChange={(event) => setTotalIncome(event.target.value)}
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <TextInput
              value={epf}
              label="Epf"
              onChange={(event) => setEpf(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              value={socso}
              label="Socso"
              onChange={(event) => setSocso(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              value={eis}
              label="Eis"
              onChange={(event) => setEis(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              value={pcd}
              label="PCD"
              onChange={(event) => setPcd(event.target.value)}
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <TextInput
              value={allowance}
              label="Allowance"
              onChange={(event) => setAllowance(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              value={claims}
              label="Claims"
              onChange={(event) => setClaims(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              value={employerEpf}
              label="Employer EPF"
              onChange={(event) => setEmployerEpf(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              value={employerSocso}
              label="Employer Socso"
              onChange={(event) => setEmployerSocso(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              value={employerEis}
              label="Employer Socso"
              onChange={(event) => setEmployerEis(event.target.value)}
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <Select
              data={[
                { value: "01", label: "January" },
                { value: "02", label: "February" },
                { value: "03", label: "March" },
                { value: "04", label: "April" },
                { value: "05", label: "May" },
                { value: "06", label: "June" },
                { value: "07", label: "July" },
                { value: "08", label: "August" },
                { value: "09", label: "September" },
                { value: "10", label: "October" },
                { value: "11", label: "November" },
                { value: "12", label: "December" },
              ]}
              value={month}
              onChange={(value) => setMonth(value)}
              label="Select Month"
              placeholder="Select a Month"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={orders.map((order) => ({
                value: new Date(order.paid_at).getFullYear(),
                label: new Date(order.paid_at).getFullYear(),
              }))}
              value={year}
              onChange={(value) => setYear(value)}
              label="Select Year"
              placeholder="Select a Year"
            />
          </Grid.Col>
        </Grid>

        <Space h="20px" />
        <Button fullWidth onClick={handleAddNewStaffWage}>
          Add New
        </Button>
      </Card>
      <Space h="50px" />
      <Group position="center">
        <Button
          component={Link}
          to="/product"
          variant="subtle"
          size="xs"
          color="gray"
        >
          Go back to Home
        </Button>
      </Group>
      <Space h="50px" />
    </Container>
  );
}

export default WageAdd;
