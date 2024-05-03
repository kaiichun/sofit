import React, { useState, useEffect } from "react";
import { Select } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../api/order";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import WageChart from "../chart"; // Assuming you place the charts in a separate file
import { useCookies } from "react-cookie";
import { fetchWages2 } from "../api/wage"; // Import fetchWages2 function
import { fetchUsers } from "../api/auth"; // Import fetchUsers function

const DataAnalysis = () => {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const { id } = useParams();
  const [currentWage, setCurrentWage] = useState([]);
  const { isLoading, data: wages = [] } = useQuery({
    queryKey: ["wages"],
    queryFn: () => fetchWages2(currentUser ? currentUser.token : ""),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(currentUser ? currentUser.token : ""),
  });

  useEffect(() => {
    // Update currentWage state when wages data changes
    setCurrentWage(wages);
  }, [wages]);

  return (
    <>
      {currentWage && currentWage.length > 0 ? (
        <WageChart wages={currentWage} />
      ) : null}
    </>
  );
};

export default DataAnalysis;
