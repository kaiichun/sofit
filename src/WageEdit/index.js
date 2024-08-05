import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Space,
  Card,
  Grid,
  TextInput,
  NumberInput,
  Button,
  Group,
  Select,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { fetchBranch, fetchUsers } from "../api/auth";
import { fetchPMS } from "../api/pms";
import { fetchOrders } from "../api/order";
import { getWage, updateWage } from "../api/wage";
import { fetchCoaching } from "../api/calendar2";
import { set } from "date-fns";

function WageEdit() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState("");
  const [staffId, setStaffId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [year, setYear] = useState("");
  const [basic, setBasic] = useState("");
  const [pcd, setPcd] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [claims, setClaims] = useState(0);
  const [overtime, setOvertime] = useState(0);
  const [nettPay, setNettPay] = useState(0);
  const [totalIncome, setTotalIncome] = useState("");
  const [totalDeduction, setTotalDeduction] = useState(0);
  const [commission, setCommission] = useState("");
  const [name, setName] = useState("");
  const [ic, setIc] = useState("");
  const [order, setOrder] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankName, setBankName] = useState("");
  const [department, setDepartment] = useState("");
  const [epfNo, setEpfNo] = useState("");
  const [socsoNo, setSocsoNo] = useState("");
  const [eisNo, setEisNo] = useState("");
  const [bonus, setBonus] = useState(0);
  // const [employerEpf, setEmployerEpf] = useState("");
  // const [employerSocso, setEmployerSocso] = useState("");
  // const [employerEis, setEmployerEis] = useState("");
  // const [epf, setEpf] = useState("");
  // const [socso, setSocso] = useState("");
  // const [eis, setEis] = useState("");
  // const [coachingFee, setCoachingFee] = useState("");
  const [sessions, setSessions] = useState(0);
  const [sessionsS, setSessionsS] = useState(0);
  const [sessionsAvd, setSessionsAvd] = useState(0);
  const [juniorRate, setJuniorRate] = useState(0);
  const [seniorRate, setSeniorRate] = useState(0);
  const [advancedSeniorRate, setAdvancedSeniorRate] = useState(0);
  const [selectedPMS1, setSelectedPMS1] = useState(null);
  const [selectedPMS2, setSelectedPMS2] = useState(null);
  const [selectedPMS3, setSelectedPMS3] = useState(null);
  const { isLoading } = useQuery({
    queryKey: ["wage", id],
    queryFn: () => getWage(id),
    onSuccess: (data) => {
      setStaffId(data.staffId || "");
      setName(data.name || "");
      setIc(data.ic || "");
      setCoachingFee(data.coachingFee || "");
      setYear(data.year || "");
      setSelectedMonth(data.month || "");
      setBasic(data.basic || "");
      setEpfNo(data.epfNo || "");
      setSocsoNo(data.socsoNo || "");
      setBonus(data.pms || 0);
      setEisNo(data.eisNo || "");
      setBankAccount(data.bankacc || "");
      setBankName(data.bankname || "");
      setNettPay(data.nettPay || "");
      setOvertime(data.overtime || 0);
      setTotalDeduction(data.totalDeduction || 0);
      setTotalIncome(data.totalIncome || 0);
      setOrder(data.order || 0);
      setCommission(data.commission || "");
      setClaims(data.claims || 0);
      setAllowance(data.allowance || 0);
      setPcd(data.pcd || 0);
    },
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });

  const { data: coaching = [] } = useQuery({
    queryKey: ["calendar"],
    queryFn: () => fetchCoaching(),
  });

  const { data: pms3 = [] } = useQuery({
    queryKey: ["pms3"],
    queryFn: () => fetchPMS(),
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(currentUser ? currentUser.token : ""),
  });

  // useEffect(() => {
  //   if (selectedUser && users) {
  //     const selectedUserSalary =
  //       users.find((u) => u._id === selectedUser)?.salary || 0;
  //     setBasic(selectedUserSalary);
  //   }
  // }, [selectedUser, users]);

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
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ];

  const calculateCoachingFee = () => {
    // Check if a user is selected
    if (!staffId) {
      return 0; // Return 0 if no user is selected
    }
    const currentUser = users.find((u) => u._id === selectedUser);

    // Return the calculated fee
    return juniorRate * sessions;
  };

  const calculateSCoachingFee = () => {
    // Check if a user is selected
    if (!staffId) {
      return 0; // Return 0 if no user is selected
    }

    // Find the selected user
    const currentUser = users.find((u) => u._id === selectedUser);

    // Return the calculated fee
    return seniorRate * sessionsS;
  };

  const calculateAvdCoachingFee = () => {
    // Check if a user is selected
    if (!staffId) {
      return 0; // Return 0 if no user is selected
    }

    // Find the selected user
    const currentUser = users.find((u) => u._id === selectedUser);

    // Return the calculated fee
    return advancedSeniorRate * sessionsAvd;
  };

  const [coachingFee, setCoachingFee] = useState();

  const calculateTotalCoachingFee =
    parseFloat(calculateCoachingFee()) +
    parseFloat(calculateSCoachingFee()) +
    parseFloat(calculateAvdCoachingFee());

  const calculateTotalIncomeWithoutAllowClaim = () => {
    const totalcom = parseFloat(calculateTotalCom()) || 0;
    const totalPMS = parseFloat(calculateTotalPMS()) || 0;
    const bonusValue = parseFloat(bonus) || 0;
    const coachingFee = parseFloat(calculateTotalCoachingFee) || 0;
    const basicValue = parseFloat(basic) || 0;
    const overtimeValue = parseFloat(overtime) || 0;

    // Calculate the total income
    const totalIncome =
      totalcom +
      totalPMS +
      bonusValue +
      calculateTotalCoachingFee +
      basicValue +
      overtimeValue;

    return totalIncome.toFixed(2);
  };

  const totalIncomeWithoutAllowClaim = parseFloat(
    calculateTotalIncomeWithoutAllowClaim()
  );

  const calculateEPF = (totalIncomeWithoutAllowClaim) => {
    let employerEpfRate;
    let employeeEpfRate;

    if (totalIncomeWithoutAllowClaim <= 10) {
      employerEpfRate = 0;
      employeeEpfRate = 0;
    } else if (totalIncomeWithoutAllowClaim <= 20) {
      employerEpfRate = 3;
      employeeEpfRate = 3;
    } else if (totalIncomeWithoutAllowClaim <= 40) {
      employerEpfRate = 6;
      employeeEpfRate = 5;
    } else if (totalIncomeWithoutAllowClaim <= 60) {
      employerEpfRate = 8;
      employeeEpfRate = 7;
    } else if (totalIncomeWithoutAllowClaim <= 80) {
      employerEpfRate = 11;
      employeeEpfRate = 9;
    } else if (totalIncomeWithoutAllowClaim <= 100) {
      employerEpfRate = 13;
      employeeEpfRate = 11;
    } else if (totalIncomeWithoutAllowClaim <= 120) {
      employerEpfRate = 16;
      employeeEpfRate = 14;
    } else if (totalIncomeWithoutAllowClaim <= 140) {
      employerEpfRate = 19;
      employeeEpfRate = 16;
    } else if (totalIncomeWithoutAllowClaim <= 160) {
      employerEpfRate = 21;
      employeeEpfRate = 18;
    } else if (totalIncomeWithoutAllowClaim <= 180) {
      employerEpfRate = 24;
      employeeEpfRate = 20;
    } else if (totalIncomeWithoutAllowClaim <= 200) {
      employerEpfRate = 26;
      employeeEpfRate = 22;
    } else if (totalIncomeWithoutAllowClaim <= 220) {
      employerEpfRate = 29;
      employeeEpfRate = 25;
    } else if (totalIncomeWithoutAllowClaim <= 240) {
      employerEpfRate = 32;
      employeeEpfRate = 27;
    } else if (totalIncomeWithoutAllowClaim <= 260) {
      employerEpfRate = 34;
      employeeEpfRate = 29;
    } else if (totalIncomeWithoutAllowClaim <= 280) {
      employerEpfRate = 37;
      employeeEpfRate = 31;
    } else if (totalIncomeWithoutAllowClaim <= 300) {
      employerEpfRate = 39;
      employeeEpfRate = 33;
    } else if (totalIncomeWithoutAllowClaim <= 320) {
      employerEpfRate = 42;
      employeeEpfRate = 36;
    } else if (totalIncomeWithoutAllowClaim <= 340) {
      employerEpfRate = 45;
      employeeEpfRate = 38;
    } else if (totalIncomeWithoutAllowClaim <= 360) {
      employerEpfRate = 47;
      employeeEpfRate = 40;
    } else if (totalIncomeWithoutAllowClaim <= 380) {
      employerEpfRate = 50;
      employeeEpfRate = 42;
    } else if (totalIncomeWithoutAllowClaim <= 400) {
      employerEpfRate = 52;
      employeeEpfRate = 44;
    } else if (totalIncomeWithoutAllowClaim <= 420) {
      employerEpfRate = 55;
      employeeEpfRate = 47;
    } else if (totalIncomeWithoutAllowClaim <= 440) {
      employerEpfRate = 58;
      employeeEpfRate = 49;
    } else if (totalIncomeWithoutAllowClaim <= 460) {
      employerEpfRate = 60;
      employeeEpfRate = 51;
    } else if (totalIncomeWithoutAllowClaim <= 480) {
      employerEpfRate = 63;
      employeeEpfRate = 53;
    } else if (totalIncomeWithoutAllowClaim <= 500) {
      employerEpfRate = 65;
      employeeEpfRate = 55;
    } else if (totalIncomeWithoutAllowClaim <= 520) {
      employerEpfRate = 68;
      employeeEpfRate = 58;
    } else if (totalIncomeWithoutAllowClaim <= 540) {
      employerEpfRate = 71;
      employeeEpfRate = 60;
    } else if (totalIncomeWithoutAllowClaim <= 560) {
      employerEpfRate = 73;
      employeeEpfRate = 62;
    } else if (totalIncomeWithoutAllowClaim <= 580) {
      employerEpfRate = 76;
      employeeEpfRate = 64;
    } else if (totalIncomeWithoutAllowClaim <= 600) {
      employerEpfRate = 78;
      employeeEpfRate = 66;
    } else if (totalIncomeWithoutAllowClaim <= 620) {
      employerEpfRate = 81;
      employeeEpfRate = 69;
    } else if (totalIncomeWithoutAllowClaim <= 640) {
      employerEpfRate = 84;
      employeeEpfRate = 71;
    } else if (totalIncomeWithoutAllowClaim <= 660) {
      employerEpfRate = 86;
      employeeEpfRate = 73;
    } else if (totalIncomeWithoutAllowClaim <= 680) {
      employerEpfRate = 89;
      employeeEpfRate = 75;
    } else if (totalIncomeWithoutAllowClaim <= 700) {
      employerEpfRate = 91;
      employeeEpfRate = 77;
    } else if (totalIncomeWithoutAllowClaim <= 720) {
      employerEpfRate = 94;
      employeeEpfRate = 80;
    } else if (totalIncomeWithoutAllowClaim <= 740) {
      employerEpfRate = 97;
      employeeEpfRate = 82;
    } else if (totalIncomeWithoutAllowClaim <= 760) {
      employerEpfRate = 99;
      employeeEpfRate = 84;
    } else if (totalIncomeWithoutAllowClaim <= 780) {
      employerEpfRate = 102;
      employeeEpfRate = 86;
    } else if (totalIncomeWithoutAllowClaim <= 800) {
      employerEpfRate = 104;
      employeeEpfRate = 88;
    } else if (totalIncomeWithoutAllowClaim <= 820) {
      employerEpfRate = 107;
      employeeEpfRate = 91;
    } else if (totalIncomeWithoutAllowClaim <= 840) {
      employerEpfRate = 110;
      employeeEpfRate = 93;
    } else if (totalIncomeWithoutAllowClaim <= 860) {
      employerEpfRate = 112;
      employeeEpfRate = 95;
    } else if (totalIncomeWithoutAllowClaim <= 880) {
      employerEpfRate = 115;
      employeeEpfRate = 97;
    } else if (totalIncomeWithoutAllowClaim <= 900) {
      employerEpfRate = 117;
      employeeEpfRate = 99;
    } else if (totalIncomeWithoutAllowClaim <= 920) {
      employerEpfRate = 120;
      employeeEpfRate = 102;
    } else if (totalIncomeWithoutAllowClaim <= 940) {
      employerEpfRate = 123;
      employeeEpfRate = 104;
    } else if (totalIncomeWithoutAllowClaim <= 960) {
      employerEpfRate = 125;
      employeeEpfRate = 106;
    } else if (totalIncomeWithoutAllowClaim <= 980) {
      employerEpfRate = 128;
      employeeEpfRate = 108;
    } else if (totalIncomeWithoutAllowClaim <= 1000) {
      employerEpfRate = 130;
      employeeEpfRate = 110;
    } else if (totalIncomeWithoutAllowClaim <= 1020) {
      employerEpfRate = 133;
      employeeEpfRate = 113;
    } else if (totalIncomeWithoutAllowClaim <= 1040) {
      employerEpfRate = 136;
      employeeEpfRate = 115;
    } else if (totalIncomeWithoutAllowClaim <= 1060) {
      employerEpfRate = 138;
      employeeEpfRate = 117;
    } else if (totalIncomeWithoutAllowClaim <= 1080) {
      employerEpfRate = 141;
      employeeEpfRate = 119;
    } else if (totalIncomeWithoutAllowClaim <= 1100) {
      employerEpfRate = 143;
      employeeEpfRate = 121;
    } else if (totalIncomeWithoutAllowClaim <= 1120) {
      employerEpfRate = 146;
      employeeEpfRate = 124;
    } else if (totalIncomeWithoutAllowClaim <= 1140) {
      employerEpfRate = 149;
      employeeEpfRate = 126;
    } else if (totalIncomeWithoutAllowClaim <= 1160) {
      employerEpfRate = 151;
      employeeEpfRate = 128;
    } else if (totalIncomeWithoutAllowClaim <= 1180) {
      employerEpfRate = 154;
      employeeEpfRate = 130;
    } else if (totalIncomeWithoutAllowClaim <= 1200) {
      employerEpfRate = 156;
      employeeEpfRate = 132;
    } else if (totalIncomeWithoutAllowClaim <= 1220) {
      employerEpfRate = 159;
      employeeEpfRate = 135;
    } else if (totalIncomeWithoutAllowClaim <= 1240) {
      employerEpfRate = 162;
      employeeEpfRate = 137;
    } else if (totalIncomeWithoutAllowClaim <= 1260) {
      employerEpfRate = 164;
      employeeEpfRate = 139;
    } else if (totalIncomeWithoutAllowClaim <= 1280) {
      employerEpfRate = 167;
      employeeEpfRate = 141;
    } else if (totalIncomeWithoutAllowClaim <= 1300) {
      employerEpfRate = 169;
      employeeEpfRate = 143;
    } else if (totalIncomeWithoutAllowClaim <= 1320) {
      employerEpfRate = 172;
      employeeEpfRate = 146;
    } else if (totalIncomeWithoutAllowClaim <= 1340) {
      employerEpfRate = 175;
      employeeEpfRate = 148;
    } else if (totalIncomeWithoutAllowClaim <= 1360) {
      employerEpfRate = 177;
      employeeEpfRate = 150;
    } else if (totalIncomeWithoutAllowClaim <= 1380) {
      employerEpfRate = 180;
      employeeEpfRate = 152;
    } else if (totalIncomeWithoutAllowClaim <= 1400) {
      employerEpfRate = 182;
      employeeEpfRate = 154;
    } else if (totalIncomeWithoutAllowClaim <= 1420) {
      employerEpfRate = 185;
      employeeEpfRate = 157;
    } else if (totalIncomeWithoutAllowClaim <= 1440) {
      employerEpfRate = 188;
      employeeEpfRate = 159;
    } else if (totalIncomeWithoutAllowClaim <= 1460) {
      employerEpfRate = 190;
      employeeEpfRate = 161;
    } else if (totalIncomeWithoutAllowClaim <= 1480) {
      employerEpfRate = 193;
      employeeEpfRate = 163;
    } else if (totalIncomeWithoutAllowClaim <= 1500) {
      employerEpfRate = 195;
      employeeEpfRate = 165;
    } else if (totalIncomeWithoutAllowClaim <= 1520) {
      employerEpfRate = 198;
      employeeEpfRate = 168;
    } else if (totalIncomeWithoutAllowClaim <= 1540) {
      employerEpfRate = 201;
      employeeEpfRate = 170;
    } else if (totalIncomeWithoutAllowClaim <= 1560) {
      employerEpfRate = 203;
      employeeEpfRate = 172;
    } else if (totalIncomeWithoutAllowClaim <= 1580) {
      employerEpfRate = 206;
      employeeEpfRate = 174;
    } else if (totalIncomeWithoutAllowClaim <= 1600) {
      employerEpfRate = 208;
      employeeEpfRate = 176;
    } else if (totalIncomeWithoutAllowClaim <= 1620) {
      employerEpfRate = 211;
      employeeEpfRate = 179;
    } else if (totalIncomeWithoutAllowClaim <= 1640) {
      employerEpfRate = 214;
      employeeEpfRate = 181;
    } else if (totalIncomeWithoutAllowClaim <= 1660) {
      employerEpfRate = 216;
      employeeEpfRate = 183;
    } else if (totalIncomeWithoutAllowClaim <= 1680) {
      employerEpfRate = 219;
      employeeEpfRate = 185;
    } else if (totalIncomeWithoutAllowClaim <= 1700) {
      employerEpfRate = 221;
      employeeEpfRate = 187;
    } else if (totalIncomeWithoutAllowClaim <= 1720) {
      employerEpfRate = 224;
      employeeEpfRate = 190;
    } else if (totalIncomeWithoutAllowClaim <= 1740) {
      employerEpfRate = 227;
      employeeEpfRate = 192;
    } else if (totalIncomeWithoutAllowClaim <= 1760) {
      employerEpfRate = 229;
      employeeEpfRate = 194;
    } else if (totalIncomeWithoutAllowClaim <= 1780) {
      employerEpfRate = 232;
      employeeEpfRate = 196;
    } else if (totalIncomeWithoutAllowClaim <= 1800) {
      employerEpfRate = 234;
      employeeEpfRate = 198;
    } else if (totalIncomeWithoutAllowClaim <= 1820) {
      employerEpfRate = 237;
      employeeEpfRate = 201;
    } else if (totalIncomeWithoutAllowClaim <= 1840) {
      employerEpfRate = 240;
      employeeEpfRate = 203;
    } else if (totalIncomeWithoutAllowClaim <= 1860) {
      employerEpfRate = 242;
      employeeEpfRate = 205;
    } else if (totalIncomeWithoutAllowClaim <= 1880) {
      employerEpfRate = 245;
      employeeEpfRate = 207;
    } else if (totalIncomeWithoutAllowClaim <= 1900) {
      employerEpfRate = 247;
      employeeEpfRate = 209;
    } else if (totalIncomeWithoutAllowClaim <= 1920) {
      employerEpfRate = 250;
      employeeEpfRate = 212;
    } else if (totalIncomeWithoutAllowClaim <= 1940) {
      employerEpfRate = 253;
      employeeEpfRate = 214;
    } else if (totalIncomeWithoutAllowClaim <= 1960) {
      employerEpfRate = 255;
      employeeEpfRate = 216;
    } else if (totalIncomeWithoutAllowClaim <= 1980) {
      employerEpfRate = 258;
      employeeEpfRate = 218;
    } else if (totalIncomeWithoutAllowClaim <= 2000) {
      employerEpfRate = 260;
      employeeEpfRate = 220;
    } else if (totalIncomeWithoutAllowClaim <= 2020) {
      employerEpfRate = 263;
      employeeEpfRate = 223;
    } else if (totalIncomeWithoutAllowClaim <= 2040) {
      employerEpfRate = 266;
      employeeEpfRate = 225;
    } else if (totalIncomeWithoutAllowClaim <= 2060) {
      employerEpfRate = 268;
      employeeEpfRate = 227;
    } else if (totalIncomeWithoutAllowClaim <= 2080) {
      employerEpfRate = 271;
      employeeEpfRate = 229;
    } else if (totalIncomeWithoutAllowClaim <= 2100) {
      employerEpfRate = 273;
      employeeEpfRate = 231;
    } else if (totalIncomeWithoutAllowClaim <= 2110) {
      employerEpfRate = 276;
      employeeEpfRate = 234;
    } else if (totalIncomeWithoutAllowClaim <= 2140) {
      employerEpfRate = 279;
      employeeEpfRate = 236;
    } else if (totalIncomeWithoutAllowClaim <= 2160) {
      employerEpfRate = 281;
      employeeEpfRate = 238;
    } else if (totalIncomeWithoutAllowClaim <= 2180) {
      employerEpfRate = 284;
      employeeEpfRate = 240;
    } else if (totalIncomeWithoutAllowClaim <= 2200) {
      employerEpfRate = 286;
      employeeEpfRate = 242;
    } else if (totalIncomeWithoutAllowClaim <= 2220) {
      employerEpfRate = 289;
      employeeEpfRate = 245;
    } else if (totalIncomeWithoutAllowClaim <= 2240) {
      employerEpfRate = 292;
      employeeEpfRate = 247;
    } else if (totalIncomeWithoutAllowClaim <= 2260) {
      employerEpfRate = 294;
      employeeEpfRate = 249;
    } else if (totalIncomeWithoutAllowClaim <= 2280) {
      employerEpfRate = 297;
      employeeEpfRate = 251;
    } else if (totalIncomeWithoutAllowClaim <= 2300) {
      employerEpfRate = 299;
      employeeEpfRate = 253;
    } else if (totalIncomeWithoutAllowClaim <= 2320) {
      employerEpfRate = 302;
      employeeEpfRate = 256;
    } else if (totalIncomeWithoutAllowClaim <= 2340) {
      employerEpfRate = 305;
      employeeEpfRate = 258;
    } else if (totalIncomeWithoutAllowClaim <= 2360) {
      employerEpfRate = 307;
      employeeEpfRate = 260;
    } else if (totalIncomeWithoutAllowClaim <= 2380) {
      employerEpfRate = 310;
      employeeEpfRate = 262;
    } else if (totalIncomeWithoutAllowClaim <= 2400) {
      employerEpfRate = 312;
      employeeEpfRate = 264;
    } else if (totalIncomeWithoutAllowClaim <= 2420) {
      employerEpfRate = 315;
      employeeEpfRate = 267;
    } else if (totalIncomeWithoutAllowClaim <= 2440) {
      employerEpfRate = 318;
      employeeEpfRate = 269;
    } else if (totalIncomeWithoutAllowClaim <= 2460) {
      employerEpfRate = 320;
      employeeEpfRate = 271;
    } else if (totalIncomeWithoutAllowClaim <= 2480) {
      employerEpfRate = 323;
      employeeEpfRate = 273;
    } else if (totalIncomeWithoutAllowClaim <= 2500) {
      employerEpfRate = 325;
      employeeEpfRate = 275;
    } else if (totalIncomeWithoutAllowClaim <= 2520) {
      employerEpfRate = 328;
      employeeEpfRate = 278;
    } else if (totalIncomeWithoutAllowClaim <= 2540) {
      employerEpfRate = 331;
      employeeEpfRate = 280;
    } else if (totalIncomeWithoutAllowClaim <= 2560) {
      employerEpfRate = 333;
      employeeEpfRate = 282;
    } else if (totalIncomeWithoutAllowClaim <= 2580) {
      employerEpfRate = 3336;
      employeeEpfRate = 284;
    } else if (totalIncomeWithoutAllowClaim <= 2600) {
      employerEpfRate = 338;
      employeeEpfRate = 286;
    } else if (totalIncomeWithoutAllowClaim <= 2620) {
      employerEpfRate = 341;
      employeeEpfRate = 289;
    } else if (totalIncomeWithoutAllowClaim <= 2640) {
      employerEpfRate = 344;
      employeeEpfRate = 291;
    } else if (totalIncomeWithoutAllowClaim <= 2660) {
      employerEpfRate = 346;
      employeeEpfRate = 293;
    } else if (totalIncomeWithoutAllowClaim <= 2680) {
      employerEpfRate = 349;
      employeeEpfRate = 295;
    } else if (totalIncomeWithoutAllowClaim <= 2700) {
      employerEpfRate = 351;
      employeeEpfRate = 297;
    } else if (totalIncomeWithoutAllowClaim <= 2720) {
      employerEpfRate = 354;
      employeeEpfRate = 300;
    } else if (totalIncomeWithoutAllowClaim <= 2740) {
      employerEpfRate = 357;
      employeeEpfRate = 302;
    } else if (totalIncomeWithoutAllowClaim <= 2760) {
      employerEpfRate = 359;
      employeeEpfRate = 304;
    } else if (totalIncomeWithoutAllowClaim <= 2780) {
      employerEpfRate = 362;
      employeeEpfRate = 306;
    } else if (totalIncomeWithoutAllowClaim <= 2800) {
      employerEpfRate = 364;
      employeeEpfRate = 308;
    } else if (totalIncomeWithoutAllowClaim <= 2820) {
      employerEpfRate = 367;
      employeeEpfRate = 311;
    } else if (totalIncomeWithoutAllowClaim <= 2840) {
      employerEpfRate = 370;
      employeeEpfRate = 313;
    } else if (totalIncomeWithoutAllowClaim <= 2860) {
      employerEpfRate = 372;
      employeeEpfRate = 315;
    } else if (totalIncomeWithoutAllowClaim <= 2880) {
      employerEpfRate = 375;
      employeeEpfRate = 317;
    } else if (totalIncomeWithoutAllowClaim <= 2900) {
      employerEpfRate = 377;
      employeeEpfRate = 319;
    } else if (totalIncomeWithoutAllowClaim <= 2920) {
      employerEpfRate = 380;
      employeeEpfRate = 322;
    } else if (totalIncomeWithoutAllowClaim <= 2940) {
      employerEpfRate = 383;
      employeeEpfRate = 324;
    } else if (totalIncomeWithoutAllowClaim <= 2960) {
      employerEpfRate = 385;
      employeeEpfRate = 326;
    } else if (totalIncomeWithoutAllowClaim <= 2980) {
      employerEpfRate = 388;
      employeeEpfRate = 328;
    } else if (totalIncomeWithoutAllowClaim <= 3000) {
      employerEpfRate = 390;
      employeeEpfRate = 330;
    } else if (totalIncomeWithoutAllowClaim <= 3020) {
      employerEpfRate = 393;
      employeeEpfRate = 333;
    } else if (totalIncomeWithoutAllowClaim <= 3040) {
      employerEpfRate = 396;
      employeeEpfRate = 335;
    } else if (totalIncomeWithoutAllowClaim <= 3060) {
      employerEpfRate = 398;
      employeeEpfRate = 337;
    } else if (totalIncomeWithoutAllowClaim <= 3080) {
      employerEpfRate = 401;
      employeeEpfRate = 339;
    } else if (totalIncomeWithoutAllowClaim <= 3100) {
      employerEpfRate = 403;
      employeeEpfRate = 341;
    } else if (totalIncomeWithoutAllowClaim <= 3120) {
      employerEpfRate = 406;
      employeeEpfRate = 344;
    } else if (totalIncomeWithoutAllowClaim <= 3140) {
      employerEpfRate = 409;
      employeeEpfRate = 346;
    } else if (totalIncomeWithoutAllowClaim <= 3160) {
      employerEpfRate = 411;
      employeeEpfRate = 348;
    } else if (totalIncomeWithoutAllowClaim <= 3180) {
      employerEpfRate = 414;
      employeeEpfRate = 350;
    } else if (totalIncomeWithoutAllowClaim <= 3200) {
      employerEpfRate = 416;
      employeeEpfRate = 352;
    } else if (totalIncomeWithoutAllowClaim <= 3220) {
      employerEpfRate = 419;
      employeeEpfRate = 355;
    } else if (totalIncomeWithoutAllowClaim <= 3240) {
      employerEpfRate = 422;
      employeeEpfRate = 357;
    } else if (totalIncomeWithoutAllowClaim <= 3260) {
      employerEpfRate = 424;
      employeeEpfRate = 359;
    } else if (totalIncomeWithoutAllowClaim <= 3280) {
      employerEpfRate = 427;
      employeeEpfRate = 361;
    } else if (totalIncomeWithoutAllowClaim <= 3300) {
      employerEpfRate = 429;
      employeeEpfRate = 363;
    } else if (totalIncomeWithoutAllowClaim <= 3320) {
      employerEpfRate = 432;
      employeeEpfRate = 366;
    } else if (totalIncomeWithoutAllowClaim <= 3340) {
      employerEpfRate = 435;
      employeeEpfRate = 368;
    } else if (totalIncomeWithoutAllowClaim <= 3360) {
      employerEpfRate = 437;
      employeeEpfRate = 370;
    } else if (totalIncomeWithoutAllowClaim <= 3380) {
      employerEpfRate = 440;
      employeeEpfRate = 372;
    } else if (totalIncomeWithoutAllowClaim <= 3400) {
      employerEpfRate = 442;
      employeeEpfRate = 374;
    } else if (totalIncomeWithoutAllowClaim <= 3420) {
      employerEpfRate = 445;
      employeeEpfRate = 377;
    } else if (totalIncomeWithoutAllowClaim <= 3440) {
      employerEpfRate = 448;
      employeeEpfRate = 379;
    } else if (totalIncomeWithoutAllowClaim <= 3460) {
      employerEpfRate = 450;
      employeeEpfRate = 381;
    } else if (totalIncomeWithoutAllowClaim <= 3480) {
      employerEpfRate = 453;
      employeeEpfRate = 383;
    } else if (totalIncomeWithoutAllowClaim <= 3500) {
      employerEpfRate = 455;
      employeeEpfRate = 385;
    } else if (totalIncomeWithoutAllowClaim <= 3520) {
      employerEpfRate = 458;
      employeeEpfRate = 388;
    } else if (totalIncomeWithoutAllowClaim <= 3540) {
      employerEpfRate = 461;
      employeeEpfRate = 390;
    } else if (totalIncomeWithoutAllowClaim <= 3560) {
      employerEpfRate = 463;
      employeeEpfRate = 392;
    } else if (totalIncomeWithoutAllowClaim <= 3580) {
      employerEpfRate = 466;
      employeeEpfRate = 394;
    } else if (totalIncomeWithoutAllowClaim <= 3600) {
      employerEpfRate = 468;
      employeeEpfRate = 396;
    } else if (totalIncomeWithoutAllowClaim <= 3620) {
      employerEpfRate = 471;
      employeeEpfRate = 399;
    } else if (totalIncomeWithoutAllowClaim <= 3640) {
      employerEpfRate = 474;
      employeeEpfRate = 401;
    } else if (totalIncomeWithoutAllowClaim <= 3660) {
      employerEpfRate = 476;
      employeeEpfRate = 403;
    } else if (totalIncomeWithoutAllowClaim <= 3680) {
      employerEpfRate = 479;
      employeeEpfRate = 405;
    } else if (totalIncomeWithoutAllowClaim <= 3700) {
      employerEpfRate = 481;
      employeeEpfRate = 407;
    } else if (totalIncomeWithoutAllowClaim <= 3720) {
      employerEpfRate = 484;
      employeeEpfRate = 410;
    } else if (totalIncomeWithoutAllowClaim <= 3740) {
      employerEpfRate = 487;
      employeeEpfRate = 412;
    } else if (totalIncomeWithoutAllowClaim <= 3760) {
      employerEpfRate = 489;
      employeeEpfRate = 414;
    } else if (totalIncomeWithoutAllowClaim <= 3780) {
      employerEpfRate = 492;
      employeeEpfRate = 416;
    } else if (totalIncomeWithoutAllowClaim <= 3800) {
      employerEpfRate = 494;
      employeeEpfRate = 418;
    } else if (totalIncomeWithoutAllowClaim <= 3820) {
      employerEpfRate = 497;
      employeeEpfRate = 421;
    } else if (totalIncomeWithoutAllowClaim <= 3840) {
      employerEpfRate = 500;
      employeeEpfRate = 423;
    } else if (totalIncomeWithoutAllowClaim <= 3860) {
      employerEpfRate = 502;
      employeeEpfRate = 425;
    } else if (totalIncomeWithoutAllowClaim <= 3880) {
      employerEpfRate = 505;
      employeeEpfRate = 427;
    } else if (totalIncomeWithoutAllowClaim <= 3900) {
      employerEpfRate = 507;
      employeeEpfRate = 429;
    } else if (totalIncomeWithoutAllowClaim <= 3920) {
      employerEpfRate = 510;
      employeeEpfRate = 432;
    } else if (totalIncomeWithoutAllowClaim <= 3940) {
      employerEpfRate = 513;
      employeeEpfRate = 434;
    } else if (totalIncomeWithoutAllowClaim <= 3960) {
      employerEpfRate = 515;
      employeeEpfRate = 436;
    } else if (totalIncomeWithoutAllowClaim <= 3980) {
      employerEpfRate = 518;
      employeeEpfRate = 438;
    } else if (totalIncomeWithoutAllowClaim <= 4000) {
      employerEpfRate = 520;
      employeeEpfRate = 440;
    } else if (totalIncomeWithoutAllowClaim <= 4020) {
      employerEpfRate = 523;
      employeeEpfRate = 443;
    } else if (totalIncomeWithoutAllowClaim <= 4040) {
      employerEpfRate = 526;
      employeeEpfRate = 445;
    } else if (totalIncomeWithoutAllowClaim <= 4060) {
      employerEpfRate = 528;
      employeeEpfRate = 447;
    } else if (totalIncomeWithoutAllowClaim <= 4080) {
      employerEpfRate = 531;
      employeeEpfRate = 449;
    } else if (totalIncomeWithoutAllowClaim <= 4100) {
      employerEpfRate = 533;
      employeeEpfRate = 451;
    } else if (totalIncomeWithoutAllowClaim <= 4120) {
      employerEpfRate = 536;
      employeeEpfRate = 454;
    } else if (totalIncomeWithoutAllowClaim <= 4140) {
      employerEpfRate = 539;
      employeeEpfRate = 456;
    } else if (totalIncomeWithoutAllowClaim <= 4160) {
      employerEpfRate = 541;
      employeeEpfRate = 458;
    } else if (totalIncomeWithoutAllowClaim <= 4180) {
      employerEpfRate = 544;
      employeeEpfRate = 460;
    } else if (totalIncomeWithoutAllowClaim <= 4200) {
      employerEpfRate = 546;
      employeeEpfRate = 462;
    } else if (totalIncomeWithoutAllowClaim <= 4220) {
      employerEpfRate = 549;
      employeeEpfRate = 465;
    } else if (totalIncomeWithoutAllowClaim <= 4240) {
      employerEpfRate = 552;
      employeeEpfRate = 467;
    } else if (totalIncomeWithoutAllowClaim <= 4260) {
      employerEpfRate = 554;
      employeeEpfRate = 469;
    } else if (totalIncomeWithoutAllowClaim <= 4280) {
      employerEpfRate = 557;
      employeeEpfRate = 471;
    } else if (totalIncomeWithoutAllowClaim <= 4300) {
      employerEpfRate = 559;
      employeeEpfRate = 473;
    } else if (totalIncomeWithoutAllowClaim <= 4320) {
      employerEpfRate = 562;
      employeeEpfRate = 476;
    } else if (totalIncomeWithoutAllowClaim <= 4340) {
      employerEpfRate = 565;
      employeeEpfRate = 478;
    } else if (totalIncomeWithoutAllowClaim <= 4360) {
      employerEpfRate = 567;
      employeeEpfRate = 480;
    } else if (totalIncomeWithoutAllowClaim <= 4380) {
      employerEpfRate = 570;
      employeeEpfRate = 482;
    } else if (totalIncomeWithoutAllowClaim <= 4400) {
      employerEpfRate = 572;
      employeeEpfRate = 484;
    } else if (totalIncomeWithoutAllowClaim <= 4420) {
      employerEpfRate = 575;
      employeeEpfRate = 487;
    } else if (totalIncomeWithoutAllowClaim <= 4440) {
      employerEpfRate = 578;
      employeeEpfRate = 489;
    } else if (totalIncomeWithoutAllowClaim <= 4460) {
      employerEpfRate = 580;
      employeeEpfRate = 491;
    } else if (totalIncomeWithoutAllowClaim <= 4480) {
      employerEpfRate = 583;
      employeeEpfRate = 493;
    } else if (totalIncomeWithoutAllowClaim <= 4500) {
      employerEpfRate = 585;
      employeeEpfRate = 495;
    } else if (totalIncomeWithoutAllowClaim <= 4520) {
      employerEpfRate = 588;
      employeeEpfRate = 498;
    } else if (totalIncomeWithoutAllowClaim <= 4540) {
      employerEpfRate = 591;
      employeeEpfRate = 500;
    } else if (totalIncomeWithoutAllowClaim <= 4560) {
      employerEpfRate = 593;
      employeeEpfRate = 502;
    } else if (totalIncomeWithoutAllowClaim <= 4580) {
      employerEpfRate = 596;
      employeeEpfRate = 504;
    } else if (totalIncomeWithoutAllowClaim <= 4600) {
      employerEpfRate = 598;
      employeeEpfRate = 506;
    } else if (totalIncomeWithoutAllowClaim <= 4620) {
      employerEpfRate = 601;
      employeeEpfRate = 509;
    } else if (totalIncomeWithoutAllowClaim <= 4640) {
      employerEpfRate = 604;
      employeeEpfRate = 511;
    } else if (totalIncomeWithoutAllowClaim <= 4660) {
      employerEpfRate = 606;
      employeeEpfRate = 513;
    } else if (totalIncomeWithoutAllowClaim <= 4680) {
      employerEpfRate = 609;
      employeeEpfRate = 515;
    } else if (totalIncomeWithoutAllowClaim <= 4700) {
      employerEpfRate = 611;
      employeeEpfRate = 517;
    } else if (totalIncomeWithoutAllowClaim <= 4720) {
      employerEpfRate = 614;
      employeeEpfRate = 520;
    } else if (totalIncomeWithoutAllowClaim <= 4740) {
      employerEpfRate = 617;
      employeeEpfRate = 522;
    } else if (totalIncomeWithoutAllowClaim <= 4760) {
      employerEpfRate = 619;
      employeeEpfRate = 524;
    } else if (totalIncomeWithoutAllowClaim <= 4780) {
      employerEpfRate = 622;
      employeeEpfRate = 526;
    } else if (totalIncomeWithoutAllowClaim <= 4800) {
      employerEpfRate = 624;
      employeeEpfRate = 528;
    } else if (totalIncomeWithoutAllowClaim <= 4820) {
      employerEpfRate = 627;
      employeeEpfRate = 531;
    } else if (totalIncomeWithoutAllowClaim <= 4840) {
      employerEpfRate = 630;
      employeeEpfRate = 533;
    } else if (totalIncomeWithoutAllowClaim <= 4860) {
      employerEpfRate = 632;
      employeeEpfRate = 533;
    } else if (totalIncomeWithoutAllowClaim <= 4880) {
      employerEpfRate = 635;
      employeeEpfRate = 537;
    } else if (totalIncomeWithoutAllowClaim <= 4900) {
      employerEpfRate = 637;
      employeeEpfRate = 539;
    } else if (totalIncomeWithoutAllowClaim <= 4920) {
      employerEpfRate = 640;
      employeeEpfRate = 542;
    } else if (totalIncomeWithoutAllowClaim <= 4940) {
      employerEpfRate = 643;
      employeeEpfRate = 544;
    } else if (totalIncomeWithoutAllowClaim <= 4960) {
      employerEpfRate = 645;
      employeeEpfRate = 546;
    } else if (totalIncomeWithoutAllowClaim <= 4980) {
      employerEpfRate = 648;
      employeeEpfRate = 548;
    } else if (totalIncomeWithoutAllowClaim <= 5000) {
      employerEpfRate = 650;
      employeeEpfRate = 550;
    } else if (totalIncomeWithoutAllowClaim <= 5100) {
      employerEpfRate = 612;
      employeeEpfRate = 561;
    } else if (totalIncomeWithoutAllowClaim <= 5200) {
      employerEpfRate = 624;
      employeeEpfRate = 572;
    } else if (totalIncomeWithoutAllowClaim <= 5300) {
      employerEpfRate = 636;
      employeeEpfRate = 583;
    } else if (totalIncomeWithoutAllowClaim <= 5400) {
      employerEpfRate = 648;
      employeeEpfRate = 594;
    } else if (totalIncomeWithoutAllowClaim <= 5500) {
      employerEpfRate = 660;
      employeeEpfRate = 605;
    } else if (totalIncomeWithoutAllowClaim <= 5600) {
      employerEpfRate = 672;
      employeeEpfRate = 616;
    } else if (totalIncomeWithoutAllowClaim <= 5700) {
      employerEpfRate = 684;
      employeeEpfRate = 627;
    } else if (totalIncomeWithoutAllowClaim <= 5800) {
      employerEpfRate = 696;
      employeeEpfRate = 638;
    } else if (totalIncomeWithoutAllowClaim <= 5900) {
      employerEpfRate = 708;
      employeeEpfRate = 649;
    } else if (totalIncomeWithoutAllowClaim <= 6000) {
      employerEpfRate = 720;
      employeeEpfRate = 660;
    } else if (totalIncomeWithoutAllowClaim <= 6100) {
      employerEpfRate = 732;
      employeeEpfRate = 671;
    } else if (totalIncomeWithoutAllowClaim <= 6200) {
      employerEpfRate = 744;
      employeeEpfRate = 682;
    } else if (totalIncomeWithoutAllowClaim <= 6300) {
      employerEpfRate = 756;
      employeeEpfRate = 693;
    } else if (totalIncomeWithoutAllowClaim <= 6400) {
      employerEpfRate = 768;
      employeeEpfRate = 704;
    } else if (totalIncomeWithoutAllowClaim <= 6500) {
      employerEpfRate = 780;
      employeeEpfRate = 715;
    } else if (totalIncomeWithoutAllowClaim <= 6600) {
      employerEpfRate = 792;
      employeeEpfRate = 726;
    } else if (totalIncomeWithoutAllowClaim <= 6700) {
      employerEpfRate = 804;
      employeeEpfRate = 737;
    } else if (totalIncomeWithoutAllowClaim <= 6800) {
      employerEpfRate = 816;
      employeeEpfRate = 748;
    } else if (totalIncomeWithoutAllowClaim <= 6900) {
      employerEpfRate = 828;
      employeeEpfRate = 759;
    } else if (totalIncomeWithoutAllowClaim <= 7000) {
      employerEpfRate = 840;
      employeeEpfRate = 770;
    } else if (totalIncomeWithoutAllowClaim <= 7100) {
      employerEpfRate = 852;
      employeeEpfRate = 781;
    } else if (totalIncomeWithoutAllowClaim <= 7200) {
      employerEpfRate = 864;
      employeeEpfRate = 792;
    } else if (totalIncomeWithoutAllowClaim <= 7300) {
      employerEpfRate = 876;
      employeeEpfRate = 803;
    } else if (totalIncomeWithoutAllowClaim <= 7400) {
      employerEpfRate = 888;
      employeeEpfRate = 814;
    } else if (totalIncomeWithoutAllowClaim <= 7500) {
      employerEpfRate = 900;
      employeeEpfRate = 825;
    } else if (totalIncomeWithoutAllowClaim <= 7600) {
      employerEpfRate = 912;
      employeeEpfRate = 836;
    } else if (totalIncomeWithoutAllowClaim <= 7700) {
      employerEpfRate = 924;
      employeeEpfRate = 847;
    } else if (totalIncomeWithoutAllowClaim <= 7800) {
      employerEpfRate = 936;
      employeeEpfRate = 858;
    } else if (totalIncomeWithoutAllowClaim <= 7900) {
      employerEpfRate = 948;
      employeeEpfRate = 869;
    } else if (totalIncomeWithoutAllowClaim <= 8000) {
      employerEpfRate = 960;
      employeeEpfRate = 880;
    } else if (totalIncomeWithoutAllowClaim <= 8100) {
      employerEpfRate = 972;
      employeeEpfRate = 891;
    } else if (totalIncomeWithoutAllowClaim <= 8200) {
      employerEpfRate = 984;
      employeeEpfRate = 902;
    } else if (totalIncomeWithoutAllowClaim <= 8300) {
      employerEpfRate = 996;
      employeeEpfRate = 913;
    } else if (totalIncomeWithoutAllowClaim <= 8400) {
      employerEpfRate = 1008;
      employeeEpfRate = 924;
    } else if (totalIncomeWithoutAllowClaim <= 8500) {
      employerEpfRate = 1020;
      employeeEpfRate = 935;
    } else if (totalIncomeWithoutAllowClaim <= 8600) {
      employerEpfRate = 1032;
      employeeEpfRate = 946;
    } else if (totalIncomeWithoutAllowClaim <= 8700) {
      employerEpfRate = 1044;
      employeeEpfRate = 957;
    } else if (totalIncomeWithoutAllowClaim <= 8800) {
      employerEpfRate = 1056;
      employeeEpfRate = 968;
    } else if (totalIncomeWithoutAllowClaim <= 8900) {
      employerEpfRate = 1068;
      employeeEpfRate = 979;
    } else if (totalIncomeWithoutAllowClaim <= 9000) {
      employerEpfRate = 1080;
      employeeEpfRate = 990;
    } else if (totalIncomeWithoutAllowClaim <= 9100) {
      employerEpfRate = 1092;
      employeeEpfRate = 1001;
    } else if (totalIncomeWithoutAllowClaim <= 9200) {
      employerEpfRate = 1104;
      employeeEpfRate = 1012;
    } else if (totalIncomeWithoutAllowClaim <= 9300) {
      employerEpfRate = 1116;
      employeeEpfRate = 1023;
    } else if (totalIncomeWithoutAllowClaim <= 9400) {
      employerEpfRate = 1128;
      employeeEpfRate = 1034;
    } else if (totalIncomeWithoutAllowClaim <= 9500) {
      employerEpfRate = 1140;
      employeeEpfRate = 1045;
    } else if (totalIncomeWithoutAllowClaim <= 9600) {
      employerEpfRate = 1152;
      employeeEpfRate = 1056;
    } else if (totalIncomeWithoutAllowClaim <= 9700) {
      employerEpfRate = 1164;
      employeeEpfRate = 1067;
    } else if (totalIncomeWithoutAllowClaim <= 9800) {
      employerEpfRate = 1176;
      employeeEpfRate = 1078;
    } else if (totalIncomeWithoutAllowClaim <= 9900) {
      employerEpfRate = 1188;
      employeeEpfRate = 1089;
    } else if (totalIncomeWithoutAllowClaim <= 10000) {
      employerEpfRate = 1200;
      employeeEpfRate = 1100;
    } else if (totalIncomeWithoutAllowClaim <= 10100) {
      employerEpfRate = 1212;
      employeeEpfRate = 1111;
    } else if (totalIncomeWithoutAllowClaim <= 10200) {
      employerEpfRate = 1224;
      employeeEpfRate = 1122;
    } else if (totalIncomeWithoutAllowClaim <= 10300) {
      employerEpfRate = 1236;
      employeeEpfRate = 1133;
    } else if (totalIncomeWithoutAllowClaim <= 10400) {
      employerEpfRate = 1248;
      employeeEpfRate = 1144;
    } else if (totalIncomeWithoutAllowClaim <= 10500) {
      employerEpfRate = 1260;
      employeeEpfRate = 1155;
    } else if (totalIncomeWithoutAllowClaim <= 10600) {
      employerEpfRate = 1272;
      employeeEpfRate = 1166;
    } else if (totalIncomeWithoutAllowClaim <= 10700) {
      employerEpfRate = 1284;
      employeeEpfRate = 1177;
    } else if (totalIncomeWithoutAllowClaim <= 10800) {
      employerEpfRate = 1296;
      employeeEpfRate = 1188;
    } else if (totalIncomeWithoutAllowClaim <= 10900) {
      employerEpfRate = 1308;
      employeeEpfRate = 1199;
    } else if (totalIncomeWithoutAllowClaim <= 11000) {
      employerEpfRate = 1320;
      employeeEpfRate = 1210;
    } else if (totalIncomeWithoutAllowClaim <= 11100) {
      employerEpfRate = 1332;
      employeeEpfRate = 1221;
    } else if (totalIncomeWithoutAllowClaim <= 11200) {
      employerEpfRate = 0;
      employeeEpfRate = 0;
    } else if (totalIncomeWithoutAllowClaim <= 11300) {
      employerEpfRate = 0;
      employeeEpfRate = 0;
    } else if (totalIncomeWithoutAllowClaim <= 11400) {
      employerEpfRate = 0;
      employeeEpfRate = 0;
    } else if (totalIncomeWithoutAllowClaim <= 11500) {
      employerEpfRate = 0;
      employeeEpfRate = 0;
    } else if (totalIncomeWithoutAllowClaim <= 11600) {
      employerEpfRate = 0;
      employeeEpfRate = 0;
    } else if (totalIncomeWithoutAllowClaim <= 11700) {
      employerEpfRate = 0;
      employeeEpfRate = 0;
    } else if (totalIncomeWithoutAllowClaim <= 11800) {
      employerEpfRate = 0;
      employeeEpfRate = 0;
    } else if (totalIncomeWithoutAllowClaim <= 11900) {
      employerEpfRate = 0;
      employeeEpfRate = 0;
    } else if (totalIncomeWithoutAllowClaim <= 12000) {
      employerEpfRate = 0;
      employeeEpfRate = 0;
    } else if (totalIncomeWithoutAllowClaim <= 11100) {
      employerEpfRate = 1332;
      employeeEpfRate = 1221;
    } else if (totalIncomeWithoutAllowClaim <= 11200) {
      employerEpfRate = 1344;
      employeeEpfRate = 1232;
    } else if (totalIncomeWithoutAllowClaim <= 11300) {
      employerEpfRate = 1356;
      employeeEpfRate = 1243;
    } else if (totalIncomeWithoutAllowClaim <= 11400) {
      employerEpfRate = 1368;
      employeeEpfRate = 1254;
    } else if (totalIncomeWithoutAllowClaim <= 11500) {
      employerEpfRate = 1380;
      employeeEpfRate = 1265;
    } else if (totalIncomeWithoutAllowClaim <= 11600) {
      employerEpfRate = 1392;
      employeeEpfRate = 1276;
    } else if (totalIncomeWithoutAllowClaim <= 11700) {
      employerEpfRate = 1404;
      employeeEpfRate = 1287;
    } else if (totalIncomeWithoutAllowClaim <= 11800) {
      employerEpfRate = 1416;
      employeeEpfRate = 1298;
    } else if (totalIncomeWithoutAllowClaim <= 11900) {
      employerEpfRate = 1428;
      employeeEpfRate = 1309;
    } else if (totalIncomeWithoutAllowClaim <= 12000) {
      employerEpfRate = 1440;
      employeeEpfRate = 1320;
    } else if (totalIncomeWithoutAllowClaim <= 12100) {
      employerEpfRate = 1452;
      employeeEpfRate = 1331;
    } else if (totalIncomeWithoutAllowClaim <= 12200) {
      employerEpfRate = 1464;
      employeeEpfRate = 1342;
    } else if (totalIncomeWithoutAllowClaim <= 12300) {
      employerEpfRate = 1476;
      employeeEpfRate = 1353;
    } else if (totalIncomeWithoutAllowClaim <= 12400) {
      employerEpfRate = 1488;
      employeeEpfRate = 1362;
    } else if (totalIncomeWithoutAllowClaim <= 12500) {
      employerEpfRate = 1500;
      employeeEpfRate = 1375;
    } else if (totalIncomeWithoutAllowClaim <= 12600) {
      employerEpfRate = 1512;
      employeeEpfRate = 1386;
    } else if (totalIncomeWithoutAllowClaim <= 12700) {
      employerEpfRate = 1524;
      employeeEpfRate = 1397;
    } else if (totalIncomeWithoutAllowClaim <= 12800) {
      employerEpfRate = 1536;
      employeeEpfRate = 1408;
    } else if (totalIncomeWithoutAllowClaim <= 12900) {
      employerEpfRate = 1548;
      employeeEpfRate = 1419;
    } else if (totalIncomeWithoutAllowClaim <= 13000) {
      employerEpfRate = 1560;
      employeeEpfRate = 1430;
    } else if (totalIncomeWithoutAllowClaim <= 13100) {
      employerEpfRate = 1572;
      employeeEpfRate = 1441;
    } else if (totalIncomeWithoutAllowClaim <= 13200) {
      employerEpfRate = 1584;
      employeeEpfRate = 1452;
    } else if (totalIncomeWithoutAllowClaim <= 13300) {
      employerEpfRate = 1596;
      employeeEpfRate = 1463;
    } else if (totalIncomeWithoutAllowClaim <= 13400) {
      employerEpfRate = 1608;
      employeeEpfRate = 1474;
    } else if (totalIncomeWithoutAllowClaim <= 13500) {
      employerEpfRate = 1620;
      employeeEpfRate = 1485;
    } else if (totalIncomeWithoutAllowClaim <= 13600) {
      employerEpfRate = 1632;
      employeeEpfRate = 1496;
    } else if (totalIncomeWithoutAllowClaim <= 13700) {
      employerEpfRate = 1644;
      employeeEpfRate = 1507;
    } else if (totalIncomeWithoutAllowClaim <= 13800) {
      employerEpfRate = 1656;
      employeeEpfRate = 1518;
    } else if (totalIncomeWithoutAllowClaim <= 13900) {
      employerEpfRate = 1668;
      employeeEpfRate = 1529;
    } else if (totalIncomeWithoutAllowClaim <= 14000) {
      employerEpfRate = 1680;
      employeeEpfRate = 1540;
    } else if (totalIncomeWithoutAllowClaim <= 14100) {
      employerEpfRate = 1692;
      employeeEpfRate = 1551;
    } else if (totalIncomeWithoutAllowClaim <= 14200) {
      employerEpfRate = 1704;
      employeeEpfRate = 1562;
    } else if (totalIncomeWithoutAllowClaim <= 14300) {
      employerEpfRate = 1716;
      employeeEpfRate = 1573;
    } else if (totalIncomeWithoutAllowClaim <= 14400) {
      employerEpfRate = 1728;
      employeeEpfRate = 1584;
    } else if (totalIncomeWithoutAllowClaim <= 14500) {
      employerEpfRate = 1740;
      employeeEpfRate = 1595;
    } else if (totalIncomeWithoutAllowClaim <= 14600) {
      employerEpfRate = 1752;
      employeeEpfRate = 1606;
    } else if (totalIncomeWithoutAllowClaim <= 14700) {
      employerEpfRate = 1764;
      employeeEpfRate = 1617;
    } else if (totalIncomeWithoutAllowClaim <= 14800) {
      employerEpfRate = 1776;
      employeeEpfRate = 1628;
    } else if (totalIncomeWithoutAllowClaim <= 14900) {
      employerEpfRate = 1788;
      employeeEpfRate = 1639;
    } else if (totalIncomeWithoutAllowClaim <= 15000) {
      employerEpfRate = 1800;
      employeeEpfRate = 1650;
    } else if (totalIncomeWithoutAllowClaim <= 15100) {
      employerEpfRate = 1812;
      employeeEpfRate = 1661;
    } else if (totalIncomeWithoutAllowClaim <= 15200) {
      employerEpfRate = 1824;
      employeeEpfRate = 1672;
    } else if (totalIncomeWithoutAllowClaim <= 15300) {
      employerEpfRate = 1836;
      employeeEpfRate = 1683;
    } else if (totalIncomeWithoutAllowClaim <= 15400) {
      employerEpfRate = 1848;
      employeeEpfRate = 1694;
    } else if (totalIncomeWithoutAllowClaim <= 15500) {
      employerEpfRate = 1860;
      employeeEpfRate = 1705;
    } else if (totalIncomeWithoutAllowClaim <= 15600) {
      employerEpfRate = 1872;
      employeeEpfRate = 1716;
    } else if (totalIncomeWithoutAllowClaim <= 15700) {
      employerEpfRate = 1884;
      employeeEpfRate = 1727;
    } else if (totalIncomeWithoutAllowClaim <= 15800) {
      employerEpfRate = 1896;
      employeeEpfRate = 1738;
    } else if (totalIncomeWithoutAllowClaim <= 15900) {
      employerEpfRate = 1908;
      employeeEpfRate = 1749;
    } else if (totalIncomeWithoutAllowClaim <= 16000) {
      employerEpfRate = 1920;
      employeeEpfRate = 1760;
    } else if (totalIncomeWithoutAllowClaim <= 16100) {
      employerEpfRate = 1932;
      employeeEpfRate = 1771;
    } else if (totalIncomeWithoutAllowClaim <= 16200) {
      employerEpfRate = 1944;
      employeeEpfRate = 1782;
    } else if (totalIncomeWithoutAllowClaim <= 16300) {
      employerEpfRate = 1956;
      employeeEpfRate = 1793;
    } else if (totalIncomeWithoutAllowClaim <= 16400) {
      employerEpfRate = 1968;
      employeeEpfRate = 1804;
    } else if (totalIncomeWithoutAllowClaim <= 16500) {
      employerEpfRate = 1980;
      employeeEpfRate = 1815;
    } else if (totalIncomeWithoutAllowClaim <= 16600) {
      employerEpfRate = 1992;
      employeeEpfRate = 1826;
    } else if (totalIncomeWithoutAllowClaim <= 16700) {
      employerEpfRate = 2004;
      employeeEpfRate = 1837;
    } else if (totalIncomeWithoutAllowClaim <= 16800) {
      employerEpfRate = 2016;
      employeeEpfRate = 1848;
    } else if (totalIncomeWithoutAllowClaim <= 16900) {
      employerEpfRate = 2028;
      employeeEpfRate = 1859;
    } else if (totalIncomeWithoutAllowClaim <= 17000) {
      employerEpfRate = 2040;
      employeeEpfRate = 1870;
    } else {
      employerEpfRate = 0;
      employeeEpfRate = 0;
    }

    return {
      epf: employeeEpfRate.toFixed(2),
      employerEpf: employerEpfRate.toFixed(2),
    };
  };

  // const calculateEPF = (totalIncomeWithoutAllowClaim) => {
  //   let employerEPFRate;
  //   let employeeEPFRate;

  //   // Check if the total income is less than or equal to RM5,000
  //   if (totalIncomeWithoutAllowClaim <= 5000) {
  //     // For monthly salary of RM5,000 or less
  //     employerEPFRate = 0.13; // Employer contributes ~13% of the employee’s salary
  //     employeeEPFRate = 0.11; // Employee contributes ~11% of their monthly salary
  //   } else {
  //     // For monthly salary greater than RM5,000
  //     employerEPFRate = 0.12; // Employer contributes ~12% of the employee’s salary
  //     employeeEPFRate = 0.11; // Employee contributes ~11% of their monthly salary
  //   }

  //   // Calculate employer and employee EPF contributions
  //   const employerContribution = totalIncomeWithoutAllowClaim * employerEPFRate;
  //   const employeeContribution = totalIncomeWithoutAllowClaim * employeeEPFRate;

  //   return {
  //     employerEpf: employerContribution.toFixed(2),
  //     epf: employeeContribution.toFixed(2),
  //   };
  // };

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
  // useEffect(() => {
  //   const { employerEis: newEmployerEis, employeeEis: newEis } = calculateESI(
  //     totalIncomeWithoutAllowClaim
  //   );
  //   setEmployerEis(newEmployerEis);
  //   setEis(newEis);
  // }, [totalIncomeWithoutAllowClaim]);
  const { eis, employerEis } = calculateESI(totalIncomeWithoutAllowClaim);

  const calculateTotalIncome = () => {
    const totalcom = parseFloat(calculateTotalCom()) || 0;
    const totalPMS = parseFloat(calculateTotalPMS()) || 0;
    const totalCoachingFee = parseFloat(calculateTotalCoachingFee) || 0;
    const basicValue = parseFloat(basic) || 0;
    const bonusValue = parseFloat(bonus) || 0;

    const allowanceValue = parseFloat(allowance) || 0;
    const pmsValue = parseFloat(calculateReward()) || 0;
    const claimsValue = parseFloat(claims) || 0;
    const overtimeValue = parseFloat(overtime) || 0;

    // Calculate the total income
    const totalIncome =
      totalcom +
      totalPMS +
      bonusValue +
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
    mutationFn: updateWage,
    onSuccess: (data) => {
      notifications.show({
        title: "Wage Updated",
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

  const handleUpdateStaffWage = async (event) => {
    event.preventDefault();
    createMutation.mutate({
      id: id,
      data: JSON.stringify({
        user: currentUser._id,
        staffId: staffId,
        coachingFee: coachingFee,
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
      }),
      token: currentUser ? currentUser.token : "",
    });
  };

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
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={6}></Grid.Col>
          <Space h={100} />
          <Grid.Col span={3}>
            <Select
              value={staffId}
              onChange={setStaffId}
              label="Staff"
              placeholder="Select a Staff"
              data={users.map((user) => ({
                value: user._id,
                label: user.name,
              }))}
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Select
              value={staffId}
              onChange={setDepartment}
              label="Identity Card No"
              data={users.map((user) => ({
                value: user._id,
                label: user.department,
              }))}
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Select
              value={staffId}
              onChange={setIc}
              label="Identity Card No"
              data={users.map((user) => ({
                value: user._id,
                label: user.ic,
              }))}
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={3}></Grid.Col>
          <Grid.Col span={3}>
            <TextInput label="Bank Name" value={bankName} readOnly />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput label="Bank Account" value={bankAccount} readOnly />
          </Grid.Col>
          <Grid.Col span={6}></Grid.Col>
          <Grid.Col span={3}>
            <TextInput label="EPF Account" value={epfNo} readOnly />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput label="SOSCO Account" value={socsoNo} readOnly />
          </Grid.Col>
          {/* <Grid.Col span={3}>
          <TextInput label="EIS Account" value={eisno} readOnly />
        </Grid.Col> */}
          <Grid.Col span={3}>
            <TextInput
              label="Bacis Salary"
              value={basic ? basic.toFixed(2) : 0}
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
              readOnly={!selectedMonth || !staffId}
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
              readOnly={!selectedMonth || !staffId}
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
              readOnly={!selectedMonth || !staffId}
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
              readOnly={!selectedMonth || !staffId}
              onChange={(event) => setAllowance(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              value={claims}
              label="Claims"
              readOnly={!selectedMonth || !staffId}
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
              readOnly={!selectedMonth || !staffId}
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
            <TextInput value={calculateReward()} label="PMS Bonus" readOnly />
          </Grid.Col>{" "}
          <Grid.Col span={4}>
            <TextInput
              value={bonus}
              onChange={(event) => setBonus(event.target.value)}
              label="Bonus"
            />
          </Grid.Col>
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
        <Button loading={isLoading} fullWidth onClick={handleUpdateStaffWage}>
          Update
        </Button>
      </Card>
      <Space h="50px" />
    </Container>
  );
}

export default WageEdit;
