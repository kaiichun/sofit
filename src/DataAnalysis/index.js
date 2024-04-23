import React, { useState } from "react";
import { Select } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { fetchUserPMS } from "../api/pms";

function DataAnalysis() {
  const [selectedPMS, setSelectedPMS] = useState("");

  const { data: pms = [] } = useQuery({
    queryKey: ["pms"],
    queryFn: () => fetchUserPMS(),
  });

  return (
    <>
      {" "}
      <Select
        data={pms.map((user) => ({
          value: user._id,
          label: `${user.total})`,
        }))}
        value={selectedPMS}
        onChange={(value) => setSelectedPMS(value)}
        label="Select Staff"
        placeholder="Select a Staff"
      />
    </>
  );
}

export default DataAnalysis;
