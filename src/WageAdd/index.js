import React, { useState, useEffect } from "react";

import {
  Container,
  Space,
  Card,
  Grid,
  TextInput,
  NumberInput,
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
import { fetchPMS, fetchUserPMS } from "../api/pms";
import { fetchOrders } from "../api/order";
import { addWage } from "../api/wage";

function WageAdd() {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedPMS1, setSelectedPMS1] = useState(null);
  const [selectedPMS2, setSelectedPMS2] = useState();
  const [selectedPMS3, setSelectedPMS3] = useState(null);
  const [selectedPMS4, setSelectedPMS4] = useState(null);
  const [selectedPMS5, setSelectedPMS5] = useState(null);
  const [selectedPMS6, setSelectedPMS6] = useState(null);
  const [selectedPMS7, setSelectedPMS7] = useState(null);
  const [selectedPMS8, setSelectedPMS8] = useState(null);
  const [selectedPMS9, setSelectedPMS9] = useState(null);
  const [selectedPMS10, setSelectedPMS10] = useState(null);
  const [selectedPMS11, setSelectedPMS11] = useState(null);
  const [selectedPMS12, setSelectedPMS12] = useState(null);
  const [selectedPMS13, setSelectedPMS13] = useState(null);
  const [selectedPMS14, setSelectedPMS14] = useState(null);
  const [selectedPMS15, setSelectedPMS15] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [pmsTotal, setPMSTotal] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("1"); // Initialize with January as default
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

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
  const [bankAccount, setBankAccount] = useState("");
  const [bankName, setBankName] = useState("");
  const [department, setDepartment] = useState("");
  const [epfNo, setEpfNo] = useState("");
  const [socsoNo, setSocsoNo] = useState("");
  const [sessions, setSessions] = useState("");

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });

  const { data: pms3 = [] } = useQuery({
    queryKey: ["pms3"], // Pass selectedUser as part of the query key
    queryFn: () => fetchPMS(), // Pass selectedUser to the fetchUserPMS function
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(),
  });

  const findStaffOrderC = () => {
    return selectedUser && orders
      ? orders
          .filter(
            (order) =>
              order.user === selectedUser && order.month === selectedMonth
          )
          .map((order) => order)
      : [];
  };

  const calculateTotalCom = () => {
    const staffCom = findStaffOrderC();
    if (staffCom.length > 0) {
      const totalPrice = staffCom.reduce(
        (commission, order) => commission + parseFloat(order.commission),
        0.0
      );
      return totalPrice.toFixed(2);
    } else {
      return 0.0;
    }
  };

  const pmsdata =
    selectedUser && pms3
      ? pms3
          .filter((pmsRecord) => pmsRecord.user === selectedUser)
          .map((pmsRecord) => ({
            value: pmsRecord.total,
            label: `${pmsRecord.year} ${pmsRecord.month}, ${pmsRecord.week} (Score: ${pmsRecord.total})`, // You can change the label format as needed
          }))
      : [];

  const calculateTotalPMS = () => {
    let total = 0;
    let validCount = 0;

    const pmsValues = [
      selectedPMS1,
      selectedPMS2,
      selectedPMS3,
      selectedPMS4,
      selectedPMS5,
      selectedPMS6,
      selectedPMS7,
      selectedPMS8,
      selectedPMS9,
      selectedPMS10,
      selectedPMS11,
      selectedPMS12,
      selectedPMS13,
      selectedPMS14,
      selectedPMS15,
    ];

    // 计算所选 PMS 的总和和具有值的所选 PMS 项目的数量
    pmsValues.forEach((pmsValue) => {
      if (pmsValue) {
        total += parseFloat(pmsValue);
        validCount++;
      }
    });

    // 如果没有所选 PMS 项目具有值，则返回 0
    if (validCount === 0) {
      return 0;
    }

    // 计算百分比
    const percentage = ((total / (validCount * 100)) * 100).toFixed(2);
    return percentage + "%"; // 返回百分比
  };

  const calculateReward = () => {
    const totalPMS = parseFloat(calculateTotalPMS()); // 将百分比字符串转换为数字
    let reward = 0;

    if (totalPMS >= 60 && totalPMS < 70) {
      reward = 1000;
    } else if (totalPMS >= 70 && totalPMS < 80) {
      reward = 1200;
    } else if (totalPMS >= 80 && totalPMS < 90) {
      reward = 1400;
    } else if (totalPMS >= 90) {
      reward = 1800;
    }

    return reward;
  };

  const months = [
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

  const calculateCoachingFee = () => {
    if (!selectedUser) {
      return 0;
    }
    let rate;

    const currentUser = users.find((u) => u._id === selectedUser); // Find the selected user
    if (currentUser.department === "Junior Trainee") {
      if (sessions <= 50) {
        rate = 30;
      } else if (sessions <= 80) {
        rate = 35;
      } else {
        rate = 40;
      }
    } else if (currentUser.department === "Senior Trainee") {
      if (sessions <= 50) {
        rate = 40;
      } else if (sessions <= 80) {
        rate = 45;
      } else {
        rate = 50;
      }
    } else if (currentUser.department === "Advanced Senior Trainee") {
      if (sessions <= 50) {
        rate = 50;
      } else if (sessions <= 80) {
        rate = 55;
      } else {
        rate = 60;
      }
    } else {
      // Default to a rate of 0 for unknown departments
      rate = 0;
    }

    return rate * sessions;
  };

  const [coachingFee, setCoachingFee] = useState();

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
    createMutation.mutate({
      user: selectedUser ? selectedUser._id : null,
      pms: pmsTotal,
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
      commission: commission,
    });
  };

  return (
    <Container>
      <Space h="100px" />
      <Card withBorder shadow="md" p="20px">
        <Grid grow gutter="xs">
          <Grid.Col span={4}>{calculateTotalCom()}</Grid.Col>
          <Grid.Col span={4}>{calculateTotalPMS()}</Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              value={calculateReward()}
              label="Reward Amount"
              readOnly
            />
          </Grid.Col>
          <Select
            data={months}
            value={selectedMonth}
            onChange={(value) => setSelectedMonth(value)}
            label="Select Month"
            placeholder="Select a month"
          />
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
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              label="Basic"
              value={
                selectedUser && users
                  ? users.find((u) => u._id === selectedUser)?.salary || ""
                  : 0
              }
              onChange={(event) => setBasic(event.target.value)}
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              label="Department"
              value={
                selectedUser && users
                  ? users.find((u) => u._id === selectedUser)?.department ||
                    "pls contact your supervisor to add to system"
                  : "-"
              }
              onChange={(e) => setDepartment(e.target.value)}
              readOnly
            />
          </Grid.Col>
          {/* <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS1}
              label=" "
              disabled={false}
              onChange={(value) => setSelectedPMS1(value)}
              placeholder="Select a PMS"
            />
          </Grid.Col> */}
          <Select
            data={pmsdata}
            value={selectedPMS1}
            label=" "
            disabled={false}
            onChange={(value) => setSelectedPMS1(value)}
            placeholder="Select a PMS"
          />
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS2}
              label=" "
              disabled={!selectedPMS1}
              onChange={(value) => setSelectedPMS2(value)}
              placeholder="Select a PMS"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS3}
              label=" "
              disabled={!selectedPMS2}
              onChange={(value) => setSelectedPMS3(value)}
              placeholder="Select a PMS"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS4}
              disabled={!selectedPMS3}
              label=" "
              onChange={(value) => setSelectedPMS4(value)}
              placeholder="Select a PMS"
            />
          </Grid.Col>{" "}
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS5}
              disabled={!selectedPMS4}
              onChange={(value) => setSelectedPMS5(value)}
              placeholder="Select a PMS"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS6}
              disabled={!selectedPMS5}
              onChange={(value) => setSelectedPMS6(value)}
              placeholder="Select a PMS"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS7}
              disabled={!selectedPMS6}
              onChange={(value) => setSelectedPMS7(value)}
              placeholder="Select a PMS"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS8}
              disabled={!selectedPMS7}
              onChange={(value) => setSelectedPMS8(value)}
              placeholder="Select a PMS"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS9}
              disabled={!selectedPMS8}
              onChange={(value) => setSelectedPMS9(value)}
              placeholder="Select a PMS"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS10}
              disabled={!selectedPMS9}
              onChange={(value) => setSelectedPMS10(value)}
              placeholder="Select a PMS"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              disabled={!selectedPMS10}
              onChange={(value) => setSelectedPMS11(value)}
              placeholder="Select a PMS"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS12}
              disabled={!selectedPMS11}
              onChange={(value) => setSelectedPMS12(value)}
              placeholder="Select a PMS"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS13}
              disabled={!selectedPMS12}
              onChange={(value) => setSelectedPMS13(value)}
              placeholder="Select a PMS"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS14}
              disabled={!selectedPMS13}
              onChange={(value) => setSelectedPMS14(value)}
              placeholder="Select a PMS"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS15}
              disabled={!selectedPMS14}
              onChange={(value) => setSelectedPMS15(value)}
              placeholder="Select a PMS"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Text>
              Bank Name:{" "}
              {selectedUser && users
                ? users.find((u) => u._id === selectedUser)?.bankname ||
                  "pls contact your supervisor to add to system"
                : "-"}
            </Text>
            <Text>
              Bank Account:{" "}
              {selectedUser && users
                ? users.find((u) => u._id === selectedUser)?.bankacc ||
                  "pls contact your supervisor to add to system"
                : "-"}
            </Text>
          </Grid.Col>
          <Text></Text>
          <Grid.Col span={4}>
            <NumberInput
              value={sessions}
              label="Sessions"
              precision={0}
              onChange={(value) => setSessions(value)}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              value={calculateCoachingFee()} // Set the value to coachingFee
              label="Coaching Fee" // Label for the input
              readOnly // Make the input read-only
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
