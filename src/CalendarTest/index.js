import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";

const CalendarTest = () => {
  const [clientTitle, setClientTitle] = useState("");
  const { id } = useParams();
  const [cookies] = useCookies(["currentUser"]);

  return <div className="App">1</div>;
};

export default CalendarTest;
