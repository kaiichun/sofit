import React, { useState, useEffect, useMemo } from "react";

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
import { fetchBranch, fetchUsers } from "../api/auth";
import { fetchPMS, fetchUserPMS } from "../api/pms";
import { fetchOrders } from "../api/order";
import { addWage } from "../api/wage";
import { fetchCoaching } from "../api/calendar2";

function WageAdd() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedPMS1, setSelectedPMS1] = useState(null);
  const [selectedPMS2, setSelectedPMS2] = useState(null);
  const [selectedPMS3, setSelectedPMS3] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState("");
  const [pmsTotal, setPMSTotal] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(); // Initialize with January as default
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [basic, setBasic] = useState("");
  const [pcd, setPcd] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [claims, setClaims] = useState(0);
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
  const [sessionsS, setSessionsS] = useState("");
  const [sessionsAvd, setSessionsAvd] = useState("");
  const [juniorRate, setJuniorRate] = useState(0);
  const [seniorRate, setSeniorRate] = useState(0);
  const [advancedSeniorRate, setAdvancedSeniorRate] = useState(0);

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });

  const { isLoading, data: coaching = [] } = useQuery({
    queryKey: ["calendar"],
    queryFn: () => fetchCoaching(),
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

  const findStaffCoaching =
    selectedUser && coaching
      ? coaching
          .filter((s) => {
            const sessionDate = new Date(s.date);
            const sessionMonth = sessionDate.getMonth() + 1; // getMonth() is zero-based, so add 1
            const sessionYear = sessionDate.getFullYear();
            return (
              s.staffId === selectedUser &&
              sessionMonth === parseInt(selectedMonth) &&
              sessionYear === year
            );
          })
          .map((s) => s)
      : [];

  const totalSessions = findStaffCoaching.reduce((total, session) => {
    return total + (session.sessions || 0); // assuming each session has a 'sessions' property
  }, 0);

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
            label: `Year: ${pmsRecord.year}, Month: ${pmsRecord.month} (Score: ${pmsRecord.total})`, // You can change the label format as needed
          }))
      : [];

  const calculateTotalPMS = () => {
    let total = 0;
    let validCount = 0;

    const pmsValues = [selectedPMS1, selectedPMS2, selectedPMS3];

    pmsValues.forEach((pmsValue) => {
      if (pmsValue) {
        total += parseFloat(pmsValue);
        validCount++;
      } else {
        total += 0;
        validCount++;
      }
    });

    if (validCount === 0) {
      return 0;
    }

    // 计算百分比
    const percentage = ((total / (validCount * 100)) * 100).toFixed(2);
    return percentage;
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

  const { data: branchs } = useQuery({
    queryKey: ["branch"],
    queryFn: () => fetchBranch(),
  });

  const currentUserBranch = useMemo(() => {
    return cookies?.selectedUser?.branch;
  }, [cookies]);

  const selectedUserBranch =
    selectedUser && users
      ? users.find((c) => c._id === selectedUser)?.branch || ""
      : "-";

  const selectedUserName =
    selectedUser && users
      ? users.find((c) => c._id === selectedUser)?.name || ""
      : "-";

  const selectedUserIC =
    selectedUser && users
      ? users.find((c) => c._id === selectedUser)?.ic || ""
      : "-";

  const bankname =
    selectedUser && users
      ? users.find((u) => u._id === selectedUser)?.bankname
      : undefined;

  const bankacc =
    selectedUser && users
      ? users.find((u) => u._id === selectedUser)?.bankacc
      : undefined;

  const epfno =
    selectedUser && users
      ? users.find((u) => u._id === selectedUser)?.epf
      : undefined;

  const soscono =
    selectedUser && users
      ? users.find((u) => u._id === selectedUser)?.socso
      : undefined;

  const eisno =
    selectedUser && users
      ? users.find((u) => u._id === selectedUser)?.eis
      : undefined;

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
    // Check if a user is selected
    if (!selectedUser) {
      return 0; // Return 0 if no user is selected
    }
    const currentUser = users.find((u) => u._id === selectedUser);

    // Return the calculated fee
    return juniorRate * sessions;
  };

  const calculateSCoachingFee = () => {
    // Check if a user is selected
    if (!selectedUser) {
      return 0; // Return 0 if no user is selected
    }

    // Find the selected user
    const currentUser = users.find((u) => u._id === selectedUser);

    // Return the calculated fee
    return seniorRate * sessionsS;
  };

  const calculateAvdCoachingFee = () => {
    // Check if a user is selected
    if (!selectedUser) {
      return 0; // Return 0 if no user is selected
    }

    // Find the selected user
    const currentUser = users.find((u) => u._id === selectedUser);

    // Return the calculated fee
    return advancedSeniorRate * sessionsAvd;
  };

  // const calculateCoachingFee = () => {
  //   if (!selectedUser) {
  //     return 0;
  //   }
  //   let rate;

  //   const currentUser = users.find((u) => u._id === selectedUser);
  //   if (currentUser.department === "Junior Trainee") {
  //     if (sessions <= 50) {
  //       rate = 30;
  //     } else if (sessions <= 80) {
  //       rate = 35;
  //     } else {
  //       rate = 40;
  //     }
  //   } else if (currentUser.department === "Senior Trainee") {
  //     if (sessions <= 50) {
  //       rate = 40;
  //     } else if (sessions <= 80) {
  //       rate = 45;
  //     } else {
  //       rate = 50;
  //     }
  //   } else if (currentUser.department === "Advanced Senior Trainee") {
  //     if (sessions <= 50) {
  //       rate = 50;
  //     } else if (sessions <= 80) {
  //       rate = 55;
  //     } else {
  //       rate = 60;
  //     }
  //   } else {
  //     // Default to a rate of 0 for unknown departments
  //     rate = 0;
  //   }

  //   return rate * sessions;
  // };

  const [coachingFee, setCoachingFee] = useState();

  const calculateTotalCoachingFee =
    parseFloat(calculateCoachingFee()) +
    parseFloat(calculateSCoachingFee()) +
    parseFloat(calculateAvdCoachingFee());

  const calculateTotalIncomeWithoutAllowClaim = () => {
    const totalcom = parseFloat(calculateTotalCom()) || 0;
    const totalPMS = parseFloat(calculateTotalPMS()) || 0;
    const coachingFee = parseFloat(calculateTotalCoachingFee) || 0;
    const basicValue = parseFloat(basic) || 0;
    const overtimeValue = parseFloat(overtime) || 0;

    // Calculate the total income
    const totalIncome =
      totalcom +
      totalPMS +
      calculateTotalCoachingFee +
      basicValue +
      overtimeValue;

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

    return {
      employerEpf: employerContribution.toFixed(2),
      epf: employeeContribution.toFixed(2),
    };
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

    return {
      socso: employeeSocsoRate.toFixed(2),
      employerSocso: employerSocsoRate.toFixed(2),
    };
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

    return {
      eis: employerESIRate.toFixed(2),
      employerEis: employeeESIRate.toFixed(2),
    };
  };
  const { eis, employerEis } = calculateESI(totalIncomeWithoutAllowClaim);

  const calculateTotalIncome = () => {
    const totalcom = parseFloat(calculateTotalCom()) || 0;
    const totalPMS = parseFloat(calculateTotalPMS()) || 0;
    const totalCoachingFee = parseFloat(calculateTotalCoachingFee) || 0;
    const basicValue = parseFloat(basic) || 0;
    const allowanceValue = parseFloat(allowance) || 0;
    const pmsValue = parseFloat(calculateReward()) || 0;
    const claimsValue = parseFloat(claims) || 0;
    const overtimeValue = parseFloat(overtime) || 0;

    // Calculate the total income
    const totalIncome =
      totalcom +
      totalPMS +
      totalCoachingFee +
      basicValue +
      allowanceValue +
      claimsValue +
      pmsValue +
      overtimeValue;

    return totalIncome.toFixed(2); // Return the total income rounded to 2 decimal places
  };

  const calculateTotalDeduction = () => {
    const epfValue = parseFloat(epf) || 0;
    const socsoValue = parseFloat(socso) || 0;
    const eisValue = parseFloat(eis) || 0;
    const pcdValue = parseFloat(pcd) || 0;

    // Calculate the total income
    const totalDeduction = epfValue + socsoValue + eisValue + pcdValue;

    return totalDeduction.toFixed(2); // Return the total income rounded to 2 decimal places
  };

  const calculateNetpay = () => {
    const deductionValue = parseFloat(calculateTotalDeduction()) || 0;
    const totalIncomeValue = parseFloat(calculateTotalIncome()) || 0;

    // Calculate the total income
    const net = totalIncomeValue - deductionValue;

    return net.toFixed(2); // Return the total income rounded to 2 decimal places
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
        ic: selectedUserIC,
        totalpms: calculateReward(),
        coachingFee: calculateTotalCoachingFee,
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
        totalDeduction: calculateTotalDeduction(),
        overtime: overtime,
        nettPay: calculateNetpay(),
        bankname: bankname,
        bankacc: bankacc,
        epfNo: epfno,
        socsoNo: soscono,
        eisNo: eisno,
        branch: selectedUserBranch,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };
  console.log(selectedUserBranch);

  return (
    <Container>
      <Space h="100px" />
      <Card withBorder shadow="md" p="20px">
        <Grid grow gutter="xs">
          <Grid.Col span={3}>
            <TextInput label="Year" value={year} readOnly />
          </Grid.Col>
          <Grid.Col span={3}>
            <Select
              data={months}
              value={selectedMonth}
              onChange={(value) => setSelectedMonth(value)}
              label="Month"
              placeholder="Select a month"
            />
          </Grid.Col>
          <Grid.Col span={6}></Grid.Col>
          <Space h={100} />
          <Grid.Col span={3}>
            <Select
              data={users.map((user) => ({
                value: user._id,
                label: `${user.name} (${user.ic})`,
              }))}
              value={selectedUser}
              onChange={(value) => setSelectedUser(value)}
              label="Staff"
              placeholder="Select a Staff"
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              label="Department"
              value={
                selectedUser && users
                  ? users.find((u) => u._id === selectedUser)?.department ||
                    "pls contact your supervisor to add to system"
                  : ""
              }
              onChange={(e) => setDepartment(e.target.value)}
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              label="Identity Card No"
              value={selectedUserIC}
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={3}></Grid.Col>
          <Grid.Col span={3}>
            <TextInput label="Bank Name" value={bankname} readOnly />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput label="Bank Account" value={bankacc} readOnly />
          </Grid.Col>
          <Grid.Col span={6}></Grid.Col>
          <Grid.Col span={3}>
            <TextInput label="EPF Account" value={epfno} readOnly />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput label="SOSCO Account" value={soscono} readOnly />
          </Grid.Col>
          {/* <Grid.Col span={3}>
            <TextInput label="EIS Account" value={eisno} readOnly />
          </Grid.Col> */}
          <Grid.Col span={3}>
            <TextInput
              label="Bacis Salary"
              value={
                selectedUser && users
                  ? users
                      .find((u) => u._id === selectedUser)
                      ?.salary.toFixed(2) || ""
                  : 0
              }
              onChange={(event) => setBasic(event.target.value)}
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={3}></Grid.Col>
          <Space h={100} />
          <Grid.Col span={3}>
            <NumberInput
              value={totalSessions}
              label="Total Sessions"
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={9}></Grid.Col>
          <Grid.Col span={1}>
            <NumberInput
              value={sessions}
              label="Sessions"
              precision={0}
              onChange={(value) => setSessions(value)}
              readOnly={!selectedMonth || !selectedUser}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <NumberInput
              value={juniorRate}
              label="Rate"
              precision={0}
              onChange={(value) => setJuniorRate(value)}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <TextInput
              value={calculateCoachingFee().toFixed(2)}
              label="Junior"
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <NumberInput
              value={sessionsS}
              label="Sessions"
              precision={0}
              onChange={(value) => setSessionsS(value)}
              readOnly={!selectedMonth || !selectedUser}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <NumberInput
              value={seniorRate}
              label="Rate"
              precision={0}
              onChange={(value) => setSeniorRate(value)}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <TextInput
              value={calculateSCoachingFee().toFixed(2)}
              label="Senior"
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <NumberInput
              value={sessionsAvd}
              label="Sessions"
              precision={0}
              onChange={(value) => setSessionsAvd(value)}
              readOnly={!selectedMonth || !selectedUser}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <NumberInput
              value={advancedSeniorRate}
              label="Rate"
              precision={0}
              onChange={(value) => setAdvancedSeniorRate(value)}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <TextInput
              value={calculateAvdCoachingFee().toFixed(2)}
              label="Advanced Senior"
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              value={calculateTotalCoachingFee.toFixed(2)}
              label="Total Coaching Fee"
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={9}></Grid.Col>
          <Grid.Col span={3}>
            {" "}
            <TextInput
              value={calculateTotalCom()}
              label="Commission"
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              value={allowance}
              label="Allowance"
              readOnly={!selectedMonth || !selectedUser}
              onChange={(event) => setAllowance(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              value={claims}
              label="Claims"
              readOnly={!selectedMonth || !selectedUser}
              onChange={(event) => setClaims(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={3}></Grid.Col>
          <Grid.Col span={3}>
            <TextInput value={epf} label="Epf" readOnly />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput value={socso} label="Socso" readOnly />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput value={eis} label="Eis" readOnly />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              value={pcd}
              label="PCD"
              onChange={(event) => setPcd(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput value={employerEpf} label="Employer EPF" readOnly />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput value={employerSocso} label="Employer Socso" readOnly />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput value={employerEis} label="Employer EIS" readOnly />
          </Grid.Col>
          <Grid.Col span={3}></Grid.Col>
          <Space h={100} />
          <Grid.Col span={4}>
            <Select
              data={pmsdata}
              value={selectedPMS1}
              label="PMS"
              disabled={false}
              onChange={setSelectedPMS1}
              placeholder="Select a PMS"
              readOnly={!selectedMonth || !selectedUser}
            />
          </Grid.Col>
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
            {" "}
            <TextInput
              value={calculateTotalPMS()}
              label="PMS Total Score"
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput value={calculateReward()} label="Bonus" readOnly />
          </Grid.Col>{" "}
          <Grid.Col span={4}></Grid.Col>
          <Space h={100} />
          <Grid.Col span={4}>
            <TextInput
              value={calculateTotalIncome()}
              label="Total Income"
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              value={calculateTotalDeduction()}
              label="Total Deduction"
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              value={calculateNetpay()}
              label="Nett Pay (RM)"
              readOnly
            />
          </Grid.Col>
        </Grid>

        <Space h="60px" />
        <Button fullWidth onClick={handleAddNewStaffWage}>
          Create
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
