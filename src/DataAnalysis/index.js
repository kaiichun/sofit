import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchWages2 } from "../api/wage";
import { fetchUsers } from "../api/auth";
import { fetchOrderPackages } from "../api/orderspackage";
import WageChart from "../api/Chart/WageChart";
import OutstandingChart from "../api/Chart/OutstandingChart";
import SalesChart from "../api/Chart/SalesChart";
import { Group, Text, Avatar } from "@mantine/core";
import settingLogo from "../Logo/setting.gif";

const DataAnalysis = () => {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const { id } = useParams();
  const [currentWage, setCurrentWage] = useState([]);
  const [currentPackage, setCurrentPackage] = useState([]);

  const { isLoading: wagesLoading, data: wages = [] } = useQuery({
    queryKey: ["wages"],
    queryFn: () => fetchWages2(currentUser ? currentUser.token : ""),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(currentUser ? currentUser.token : ""),
  });

  const { isLoading: packagesLoading, data: ordersPackages = [] } = useQuery({
    queryKey: ["ordersPackages"],
    queryFn: () => fetchOrderPackages(),
  });

  useEffect(() => {
    setCurrentWage(wages);
    setCurrentPackage(ordersPackages);
  }, [wages, ordersPackages]); // Fix dependency array

  return (
    <>
      {/* Render WageChart */}
      {/* {currentWage && currentWage.length > 0 && (
        <WageChart wages={currentWage} />
      )} */}

      {/* Render SalesChart */}

      {/* <SalesChart /> */}

      {/* Render OutstandingChart */}
      {/* <OutstandingChart /> */}

      <Group position="center" mt={300}>
        <Avatar
          src={settingLogo}
          style={{ width: "60px", height: "60px" }}
        ></Avatar>
        <Text size="xl" fw={500}>
          Coming Soon...
        </Text>
      </Group>
    </>
  );
};

export default DataAnalysis;
