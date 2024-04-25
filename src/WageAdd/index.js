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
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { fetchUsers } from "../api/auth";
import { fetchPMS, fetchUserPMS } from "../api/pms";
import { fetchOrders } from "../api/order";
import { addWage } from "../api/wage";

function WageAdd() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
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
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [basic, setBasic] = useState(0);
  const [pcd, setPcd] = useState("");
  const [allowance, setAllowance] = useState("");
  const [claims, setClaims] = useState("");
  const [totalIncome, setTotalIncome] = useState("");
  const [overtime, setOvertime] = useState(0);
  const [nettPay, setNettPay] = useState(0);
  const [commission, setCommission] = useState("");
  const [name, setName] = useState();
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
    queryFn: () => fetchOrders(currentUser ? currentUser.token : ""),
  });

  useEffect(() => {
    if (selectedUser && users) {
      const selectedUserSalary =
        users.find((u) => u._id === selectedUser)?.salary || 0;
      setBasic(selectedUserSalary);
    }
  }, [selectedUser, users]);

  const findStaffOrderC =
    selectedUser && orders
      ? orders
          .filter(
            (order) =>
              order.user === selectedUser && order.month === selectedMonth
          )
          .map((order) => order)
      : [];

  const calculateTotalCom = () => {
    const staffCom = findStaffOrderC;
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

    pmsValues.forEach((pmsValue) => {
      if (pmsValue) {
        total += parseFloat(pmsValue);
        validCount++;
      }
    });

    if (validCount === 0) {
      return 0;
    }

    // 计算百分比
    const percentage = ((total / (validCount * 100)) * 100).toFixed(2);
    return percentage + "%"; // 返回百分比
  };

  const calculateReward = () => {
    const totalPMS = parseFloat(calculateTotalPMS());
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

  const selectedUserName =
    selectedUser && users
      ? users.find((c) => c._id === selectedUser)?.name || ""
      : "-";

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

    const currentUser = users.find((u) => u._id === selectedUser);
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

  const calculateTotalIncomeWithoutAllowClaim = () => {
    const totalcom = parseFloat(calculateTotalCom()) || 0;
    const totalPMS = parseFloat(calculateTotalPMS()) || 0;
    const coachingFee = parseFloat(calculateCoachingFee()) || 0;
    const basicValue = parseFloat(basic) || 0;
    const overtimeValue = parseFloat(overtime) || 0;

    // Calculate the total income
    const totalIncome =
      totalcom + totalPMS + coachingFee + basicValue + overtimeValue;

    return totalIncome.toFixed(2);
  };

  const totalIncomeWithoutAllowClaim = parseFloat(
    calculateTotalIncomeWithoutAllowClaim()
  );

  const calculateEPF = (totalIncomeWithoutAllowClaim) => {
    let employerEPFRate;
    let employeeEPFRate;

    // Check if the total income is less than or equal to RM5,000
    if (totalIncomeWithoutAllowClaim <= 5000) {
      // For monthly salary of RM5,000 or less
      employerEPFRate = 0.13; // Employer contributes ~13% of the employee’s salary
      employeeEPFRate = 0.11; // Employee contributes ~11% of their monthly salary
    } else {
      // For monthly salary greater than RM5,000
      employerEPFRate = 0.12; // Employer contributes ~12% of the employee’s salary
      employeeEPFRate = 0.11; // Employee contributes ~11% of their monthly salary
    }

    // Calculate employer and employee EPF contributions
    const employerContribution = totalIncomeWithoutAllowClaim * employerEPFRate;
    const employeeContribution = totalIncomeWithoutAllowClaim * employeeEPFRate;

    return { employerEpf: employerContribution, epf: employeeContribution };
  };

  const { epf, employerEpf } = calculateEPF(totalIncomeWithoutAllowClaim);

  const calculateSocso = (totalIncomeWithoutAllowClaim) => {
    let employerSocsoRate;
    let employeeSocsoRate;

    if (totalIncomeWithoutAllowClaim <= 30) {
      employerSocsoRate = 0.4;
      employeeSocsoRate = 0.1;
    } else if (totalIncomeWithoutAllowClaim <= 50) {
      employerSocsoRate = 0.7;
      employeeSocsoRate = 0.2;
    } else if (totalIncomeWithoutAllowClaim <= 70) {
      employerSocsoRate = 1.1;
      employeeSocsoRate = 0.3;
    } else if (totalIncomeWithoutAllowClaim <= 100) {
      employerSocsoRate = 1.5;
      employeeSocsoRate = 0.4;
    } else if (totalIncomeWithoutAllowClaim <= 140) {
      employerSocsoRate = 2.1;
      employeeSocsoRate = 0.6;
    } else if (totalIncomeWithoutAllowClaim <= 200) {
      employerSocsoRate = 2.95;
      employeeSocsoRate = 0.85;
    } else if (totalIncomeWithoutAllowClaim <= 300) {
      employerSocsoRate = 4.35;
      employeeSocsoRate = 1.25;
    } else if (totalIncomeWithoutAllowClaim <= 400) {
      employerSocsoRate = 6.15;
      employeeSocsoRate = 1.75;
    } else if (totalIncomeWithoutAllowClaim <= 500) {
      employerSocsoRate = 7.85;
      employeeSocsoRate = 2.25;
    } else if (totalIncomeWithoutAllowClaim <= 600) {
      employerSocsoRate = 9.65;
      employeeSocsoRate = 2.75;
    } else if (totalIncomeWithoutAllowClaim <= 700) {
      employerSocsoRate = 11.35;
      employeeSocsoRate = 3.25;
    } else if (totalIncomeWithoutAllowClaim <= 800) {
      employerSocsoRate = 13.15;
      employeeSocsoRate = 3.75;
    } else if (totalIncomeWithoutAllowClaim <= 900) {
      employerSocsoRate = 14.85;
      employeeSocsoRate = 4.25;
    } else if (totalIncomeWithoutAllowClaim <= 1000) {
      employerSocsoRate = 16.65;
      employeeSocsoRate = 4.75;
    } else if (totalIncomeWithoutAllowClaim <= 1100) {
      employerSocsoRate = 18.35;
      employeeSocsoRate = 5.25;
    } else if (totalIncomeWithoutAllowClaim <= 1200) {
      employerSocsoRate = 20.15;
      employeeSocsoRate = 5.75;
    } else if (totalIncomeWithoutAllowClaim <= 1300) {
      employerSocsoRate = 21.85;
      employeeSocsoRate = 6.25;
    } else if (totalIncomeWithoutAllowClaim <= 1400) {
      employerSocsoRate = 23.65;
      employeeSocsoRate = 6.75;
    } else if (totalIncomeWithoutAllowClaim <= 1500) {
      employerSocsoRate = 25.35;
      employeeSocsoRate = 7.25;
    } else if (totalIncomeWithoutAllowClaim <= 1600) {
      employerSocsoRate = 27.15;
      employeeSocsoRate = 7.75;
    } else if (totalIncomeWithoutAllowClaim <= 1700) {
      employerSocsoRate = 28.85;
      employeeSocsoRate = 8.25;
    } else if (totalIncomeWithoutAllowClaim <= 1800) {
      employerSocsoRate = 30.65;
      employeeSocsoRate = 8.75;
    } else if (totalIncomeWithoutAllowClaim <= 1900) {
      employerSocsoRate = 32.35;
      employeeSocsoRate = 9.25;
    } else if (totalIncomeWithoutAllowClaim <= 2000) {
      employerSocsoRate = 34.15;
      employeeSocsoRate = 9.75;
    } else if (totalIncomeWithoutAllowClaim <= 2100) {
      employerSocsoRate = 35.85;
      employeeSocsoRate = 10.25;
    } else if (totalIncomeWithoutAllowClaim <= 2200) {
      employerSocsoRate = 37.65;
      employeeSocsoRate = 10.75;
    } else if (totalIncomeWithoutAllowClaim <= 2300) {
      employerSocsoRate = 39.35;
      employeeSocsoRate = 11.25;
    } else if (totalIncomeWithoutAllowClaim <= 2400) {
      employerSocsoRate = 41.15;
      employeeSocsoRate = 11.75;
    } else if (totalIncomeWithoutAllowClaim <= 2500) {
      employerSocsoRate = 42.85;
      employeeSocsoRate = 12.25;
    } else if (totalIncomeWithoutAllowClaim <= 2600) {
      employerSocsoRate = 44.65;
      employeeSocsoRate = 12.75;
    } else if (totalIncomeWithoutAllowClaim <= 2700) {
      employerSocsoRate = 46.35;
      employeeSocsoRate = 13.25;
    } else if (totalIncomeWithoutAllowClaim <= 2800) {
      employerSocsoRate = 48.15;
      employeeSocsoRate = 13.75;
    } else if (totalIncomeWithoutAllowClaim <= 2900) {
      employerSocsoRate = 49.85;
      employeeSocsoRate = 14.25;
    } else if (totalIncomeWithoutAllowClaim <= 3000) {
      employerSocsoRate = 51.65;
      employeeSocsoRate = 14.75;
    } else if (totalIncomeWithoutAllowClaim <= 3100) {
      employerSocsoRate = 53.35;
      employeeSocsoRate = 15.25;
    } else if (totalIncomeWithoutAllowClaim <= 3200) {
      employerSocsoRate = 55.15;
      employeeSocsoRate = 15.75;
    } else if (totalIncomeWithoutAllowClaim <= 3300) {
      employerSocsoRate = 56.85;
      employeeSocsoRate = 16.25;
    } else if (totalIncomeWithoutAllowClaim <= 3400) {
      employerSocsoRate = 58.65;
      employeeSocsoRate = 16.75;
    } else if (totalIncomeWithoutAllowClaim <= 3500) {
      employerSocsoRate = 60.35;
      employeeSocsoRate = 17.25;
    } else if (totalIncomeWithoutAllowClaim <= 3600) {
      employerSocsoRate = 62.15;
      employeeSocsoRate = 17.75;
    } else if (totalIncomeWithoutAllowClaim <= 3700) {
      employerSocsoRate = 43.85;
      employeeSocsoRate = 18.25;
    } else if (totalIncomeWithoutAllowClaim <= 3800) {
      employerSocsoRate = 65.65;
      employeeSocsoRate = 18.75;
    } else if (totalIncomeWithoutAllowClaim <= 3900) {
      employerSocsoRate = 67.35;
      employeeSocsoRate = 19.25;
    } else if (totalIncomeWithoutAllowClaim <= 4000) {
      employerSocsoRate = 69.15;
      employeeSocsoRate = 19.75;
    } else if (totalIncomeWithoutAllowClaim <= 4100) {
      employerSocsoRate = 70.85;
      employeeSocsoRate = 20.25;
    } else if (totalIncomeWithoutAllowClaim <= 4200) {
      employerSocsoRate = 72.65;
      employeeSocsoRate = 20.75;
    } else if (totalIncomeWithoutAllowClaim <= 4300) {
      employerSocsoRate = 74.35;
      employeeSocsoRate = 21.25;
    } else if (totalIncomeWithoutAllowClaim <= 4400) {
      employerSocsoRate = 76.15;
      employeeSocsoRate = 21.75;
    } else if (totalIncomeWithoutAllowClaim <= 4500) {
      employerSocsoRate = 77.85;
      employeeSocsoRate = 22.25;
    } else if (totalIncomeWithoutAllowClaim <= 4600) {
      employerSocsoRate = 79.65;
      employeeSocsoRate = 22.75;
    } else if (totalIncomeWithoutAllowClaim <= 4700) {
      employerSocsoRate = 81.35;
      employeeSocsoRate = 23.25;
    } else if (totalIncomeWithoutAllowClaim <= 4800) {
      employerSocsoRate = 83.15;
      employeeSocsoRate = 23.75;
    } else if (totalIncomeWithoutAllowClaim <= 4900) {
      employerSocsoRate = 84.85;
      employeeSocsoRate = 24.25;
    } else if (totalIncomeWithoutAllowClaim <= 5000) {
      employerSocsoRate = 86.65;
      employeeSocsoRate = 24.75;
    } else {
      employerSocsoRate = 86.65;
      employeeSocsoRate = 24.75;
    }

    return { socso: employeeSocsoRate, employerSocso: employerSocsoRate };
  };

  const { socso, employerSocso } = calculateSocso(totalIncomeWithoutAllowClaim);

  const calculateESI = (totalIncomeWithoutAllowClaim) => {
    let employerESIRate;
    let employeeESIRate;

    if (totalIncomeWithoutAllowClaim <= 30) {
      employerESIRate = 0.05;
      employeeESIRate = 0.05;
    } else if (totalIncomeWithoutAllowClaim <= 50) {
      employerESIRate = 0.1;
      employeeESIRate = 0.1;
    } else if (totalIncomeWithoutAllowClaim <= 70) {
      employerESIRate = 0.15;
      employeeESIRate = 0.15;
    } else if (totalIncomeWithoutAllowClaim <= 100) {
      employerESIRate = 0.2;
      employeeESIRate = 0.2;
    } else if (totalIncomeWithoutAllowClaim <= 140) {
      employerESIRate = 0.25;
      employeeESIRate = 0.25;
    } else if (totalIncomeWithoutAllowClaim <= 200) {
      employerESIRate = 0.35;
      employeeESIRate = 0.35;
    } else if (totalIncomeWithoutAllowClaim <= 300) {
      employerESIRate = 0.5;
      employeeESIRate = 0.5;
    } else if (totalIncomeWithoutAllowClaim <= 400) {
      employerESIRate = 0.7;
      employeeESIRate = 0.7;
    } else if (totalIncomeWithoutAllowClaim <= 500) {
      employerESIRate = 0.9;
      employeeESIRate = 0.9;
    } else if (totalIncomeWithoutAllowClaim <= 600) {
      employerESIRate = 1.1;
      employeeESIRate = 1.1;
    } else if (totalIncomeWithoutAllowClaim <= 700) {
      employerESIRate = 1.3;
      employeeESIRate = 1.3;
    } else if (totalIncomeWithoutAllowClaim <= 800) {
      employerESIRate = 1.5;
      employeeESIRate = 1.5;
    } else if (totalIncomeWithoutAllowClaim <= 900) {
      employerESIRate = 1.7;
      employeeESIRate = 1.7;
    } else if (totalIncomeWithoutAllowClaim <= 1000) {
      employerESIRate = 1.9;
      employeeESIRate = 1.9;
    } else if (totalIncomeWithoutAllowClaim <= 1100) {
      employerESIRate = 2.1;
      employeeESIRate = 2.1;
    } else if (totalIncomeWithoutAllowClaim <= 1200) {
      employerESIRate = 2.3;
      employeeESIRate = 2.3;
    } else if (totalIncomeWithoutAllowClaim <= 1300) {
      employerESIRate = 2.5;
      employeeESIRate = 2.5;
    } else if (totalIncomeWithoutAllowClaim <= 1400) {
      employerESIRate = 2.7;
      employeeESIRate = 2.7;
    } else if (totalIncomeWithoutAllowClaim <= 1500) {
      employerESIRate = 2.9;
      employeeESIRate = 2.9;
    } else if (totalIncomeWithoutAllowClaim <= 1600) {
      employerESIRate = 3.1;
      employeeESIRate = 3.1;
    } else if (totalIncomeWithoutAllowClaim <= 1700) {
      employerESIRate = 3.3;
      employeeESIRate = 3.3;
    } else if (totalIncomeWithoutAllowClaim <= 1800) {
      employerESIRate = 3.5;
      employeeESIRate = 3.5;
    } else if (totalIncomeWithoutAllowClaim <= 1900) {
      employerESIRate = 3.7;
      employeeESIRate = 3.7;
    } else if (totalIncomeWithoutAllowClaim <= 2000) {
      employerESIRate = 3.9;
      employeeESIRate = 3.9;
    } else if (totalIncomeWithoutAllowClaim <= 2100) {
      employerESIRate = 4.1;
      employeeESIRate = 4.1;
    } else if (totalIncomeWithoutAllowClaim <= 2200) {
      employerESIRate = 4.3;
      employeeESIRate = 4.3;
    } else if (totalIncomeWithoutAllowClaim <= 2300) {
      employerESIRate = 4.5;
      employeeESIRate = 4.5;
    } else if (totalIncomeWithoutAllowClaim <= 2400) {
      employerESIRate = 4.7;
      employeeESIRate = 4.7;
    } else if (totalIncomeWithoutAllowClaim <= 2500) {
      employerESIRate = 4.9;
      employeeESIRate = 4.9;
    } else if (totalIncomeWithoutAllowClaim <= 2600) {
      employerESIRate = 5.1;
      employeeESIRate = 5.1;
    } else if (totalIncomeWithoutAllowClaim <= 2700) {
      employerESIRate = 5.3;
      employeeESIRate = 5.3;
    } else if (totalIncomeWithoutAllowClaim <= 2800) {
      employerESIRate = 5.5;
      employeeESIRate = 5.5;
    } else if (totalIncomeWithoutAllowClaim <= 2900) {
      employerESIRate = 5.7;
      employeeESIRate = 5.7;
    } else if (totalIncomeWithoutAllowClaim <= 3000) {
      employerESIRate = 5.9;
      employeeESIRate = 5.9;
    } else if (totalIncomeWithoutAllowClaim <= 3100) {
      employerESIRate = 6.1;
      employeeESIRate = 6.1;
    } else if (totalIncomeWithoutAllowClaim <= 3200) {
      employerESIRate = 6.3;
      employeeESIRate = 6.3;
    } else if (totalIncomeWithoutAllowClaim <= 3300) {
      employerESIRate = 6.5;
      employeeESIRate = 6.5;
    } else if (totalIncomeWithoutAllowClaim <= 3400) {
      employerESIRate = 6.7;
      employeeESIRate = 6.7;
    } else if (totalIncomeWithoutAllowClaim <= 3500) {
      employerESIRate = 6.9;
      employeeESIRate = 6.9;
    } else if (totalIncomeWithoutAllowClaim <= 3600) {
      employerESIRate = 7.1;
      employeeESIRate = 7.1;
    } else if (totalIncomeWithoutAllowClaim <= 3700) {
      employerESIRate = 7.3;
      employeeESIRate = 7.3;
    } else if (totalIncomeWithoutAllowClaim <= 3800) {
      employerESIRate = 7.5;
      employeeESIRate = 7.5;
    } else if (totalIncomeWithoutAllowClaim <= 3900) {
      employerESIRate = 7.7;
      employeeESIRate = 7.7;
    } else if (totalIncomeWithoutAllowClaim <= 4000) {
      employerESIRate = 7.9;
      employeeESIRate = 7.9;
    } else if (totalIncomeWithoutAllowClaim <= 4100) {
      employerESIRate = 8.1;
      employeeESIRate = 8.1;
    } else if (totalIncomeWithoutAllowClaim <= 4200) {
      employerESIRate = 8.3;
      employeeESIRate = 8.3;
    } else if (totalIncomeWithoutAllowClaim <= 4300) {
      employerESIRate = 8.5;
      employeeESIRate = 8.5;
    } else if (totalIncomeWithoutAllowClaim <= 4400) {
      employerESIRate = 8.7;
      employeeESIRate = 8.7;
    } else if (totalIncomeWithoutAllowClaim <= 4500) {
      employerESIRate = 8.9;
      employeeESIRate = 8.9;
    } else if (totalIncomeWithoutAllowClaim <= 4600) {
      employerESIRate = 9.1;
      employeeESIRate = 9.1;
    } else if (totalIncomeWithoutAllowClaim <= 4700) {
      employerESIRate = 9.3;
      employeeESIRate = 9.3;
    } else if (totalIncomeWithoutAllowClaim <= 4800) {
      employerESIRate = 9.5;
      employeeESIRate = 9.5;
    } else if (totalIncomeWithoutAllowClaim <= 4900) {
      employerESIRate = 9.7;
      employeeESIRate = 9.7;
    } else if (totalIncomeWithoutAllowClaim <= 5000) {
      employerESIRate = 9.9;
      employeeESIRate = 9.9;
    } else {
      employerESIRate = 9.9; // Default rate for income above RM 5000
      employeeESIRate = 9.9; // Default rate for income above RM 5000
    }

    return { eis: employerESIRate, employerEis: employeeESIRate };
  };
  const { eis, employerEis } = calculateESI(totalIncomeWithoutAllowClaim);

  const calculateTotalIncome = () => {
    const totalcom = parseFloat(calculateTotalCom()) || 0;
    const totalPMS = parseFloat(calculateTotalPMS()) || 0;
    const coachingFee = parseFloat(calculateCoachingFee()) || 0;
    const basicValue = parseFloat(basic) || 0;
    const allowanceValue = parseFloat(allowance) || 0;
    const pmsValue = parseFloat(calculateReward()) || 0;
    const claimsValue = parseFloat(claims) || 0;
    const overtimeValue = parseFloat(overtime) || 0;

    // Calculate the total income
    const totalIncome =
      totalcom +
      totalPMS +
      coachingFee +
      basicValue +
      allowanceValue +
      claimsValue +
      pmsValue +
      overtimeValue;

    return totalIncome.toFixed(2); // Return the total income rounded to 2 decimal places
  };

  const createMutation = useMutation({
    mutationFn: addWage,
    onSuccess: (data) => {
      notifications.show({
        title: "New Wage Added",
        color: "green",
      });
      navigate("/wage");
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
      data: JSON.stringify({
        user: currentUser._id,
        staffId: selectedUser,
        name: selectedUserName,
        totalpms: calculateTotalPMS(),
        coachingFee: calculateCoachingFee(),
        year: year,
        month: selectedMonth,
        basic: basic,
        epf: epf,
        socso: socso,
        eis: eis,
        pcd: pcd,
        allowance: allowance,
        claims: claims,
        commission: calculateTotalCom(),
        order: calculateTotalCom(),
        employerEpf: employerEpf,
        employerSocso: employerSocso,
        employerEis: employerEis,
        totalIncome: calculateTotalIncome(),
        overtime: overtime,
        nettPay: nettPay,
      }),
      token: currentUser ? currentUser.token : "",
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
          <Select
            data={pmsdata}
            value={selectedPMS1}
            label=" "
            disabled={false}
            onChange={setSelectedPMS1}
            placeholder="Select a PMS"
          />
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS2}
              label=" "
              disabled={!selectedPMS1}
              onChange={setSelectedPMS2}
              placeholder="Select a PMS"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS3}
              label=" "
              disabled={!selectedPMS2}
              onChange={setSelectedPMS3}
              placeholder="Select a PMS"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS4}
              disabled={!selectedPMS3}
              label=" "
              onChange={setSelectedPMS4}
              placeholder="Select a PMS"
            />
          </Grid.Col>{" "}
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS5}
              disabled={!selectedPMS4}
              onChange={setSelectedPMS5}
              placeholder="Select a PMS"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS6}
              disabled={!selectedPMS5}
              onChange={setSelectedPMS6}
              placeholder="Select a PMS"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS7}
              disabled={!selectedPMS6}
              onChange={setSelectedPMS7}
              placeholder="Select a PMS"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS8}
              disabled={!selectedPMS7}
              onChange={setSelectedPMS8}
              placeholder="Select a PMS"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS9}
              disabled={!selectedPMS8}
              onChange={setSelectedPMS9}
              placeholder="Select a PMS"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS10}
              disabled={!selectedPMS9}
              onChange={setSelectedPMS10}
              placeholder="Select a PMS"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              disabled={!selectedPMS10}
              onChange={setSelectedPMS11}
              placeholder="Select a PMS"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS12}
              disabled={!selectedPMS11}
              onChange={setSelectedPMS12}
              placeholder="Select a PMS"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS13}
              disabled={!selectedPMS12}
              onChange={setSelectedPMS13}
              placeholder="Select a PMS"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS14}
              disabled={!selectedPMS13}
              onChange={setSelectedPMS14}
              placeholder="Select a PMS"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS15}
              disabled={!selectedPMS14}
              onChange={setSelectedPMS15}
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
              value={calculateCoachingFee()}
              label="Coaching Fee"
              disabled
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              value={calculateTotalIncome()}
              label="Total Income"
              disabled
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              value={totalIncomeWithoutAllowClaim}
              label="Total Income Without Claim"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput value={epf} label="Epf" disabled />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput value={socso} label="Socso" disabled />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput value={eis} label="Eis" disabled />
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
            <TextInput value={employerEpf} label="Employer EPF" disabled />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput value={employerSocso} label="Employer Socso" disabled />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput value={employerEis} label="Employer EIS" disabled />
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
