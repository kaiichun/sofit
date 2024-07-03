import React from "react";
import CalendarView from "../CalendarView";
import {
  Card,
  Text,
  UnstyledButton,
  Button,
  Grid,
  Title,
  Group,
  Table,
  TextInput,
  LoadingOverlay,
  Modal,
  Divider,
  Space,
  Container,
  Select,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import HeaderCalendar from "../HeaderCalendar";

export default function CalendarAll() {
  return (
    <>
      {" "}
      <Title align="center" mt={10} mb={20}>
        Appoiment
      </Title>
      {/* <HeaderCalendar page="Calendar" /> */}
      <CalendarView />
      <Group position="apart" mt={300}>
        <div></div>
        <div>
          <Button
            color="red"
            radius="xl"
            size="xl"
            style={{
              position: "fixed",
              bottom: "15px",
              right: "15px",
            }}
            compact
            component={Link}
            to={"/calendar-add"}
          >
            +
          </Button>
        </div>
      </Group>
    </>
  );
}
