import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { getCartItems, clearCartItems } from "../api/cart";
import {
  Container,
  Title,
  Table,
  Group,
  Select,
  Button,
  Image,
  Space,
  TextInput,
  Divider,
  Grid,
  Text,
  Card,
  Modal,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import Header from "../Header";
import { createOrder } from "../api/order";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import { fetchClients } from "../api/client";
import "./checkout.css";
import { fetchPackage } from "../api/package";
import { createOrderPackage } from "../api/orderspackage";
import HeaderClient from "../HeaderClient";

export default function Checkout() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [installmentMonth, setInstallmentMonth] = useState("");

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => fetchClients(id),
  });

  const { isLoading, data: packages } = useQuery({
    queryKey: ["packages"],
    queryFn: () => fetchPackage(currentUser ? currentUser.token : ""),
  });

  const createOrderMutation = useMutation({
    mutationFn: createOrderPackage,
    onSuccess: (data) => {
      navigate("/client-orders-summary");
    },
    onError: (error) => {
      // when this is an error in API call
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
      setLoading(false);
    },
  });

  const calculateTax = () => {
    if (packages && selectedPackage) {
      const selectedPackageObject = packages.find(
        (p) => p._id === selectedPackage
      );
      if (selectedPackageObject) {
        const totalPrice = parseFloat(selectedPackageObject.price);
        const taxAmount = totalPrice * 0.08; // Calculate 8% of the total price
        return taxAmount.toFixed(2); // Ensure taxAmount has two decimal places
      } else {
        return "0.00"; // Or any default value if the package is not found
      }
    } else {
      return "0.00"; // Handle the case when packages or selectedPackage is undefined
    }
  };

  const calculateTotal = () => {
    if (packages && selectedPackage) {
      const selectedPackageObject = packages.find(
        (p) => p._id === selectedPackage
      );
      if (selectedPackageObject) {
        const totalPrice =
          parseFloat(selectedPackageObject.price) + parseFloat(calculateTax());
        return totalPrice.toFixed(2); // Ensure totalPrice has two decimal places
      } else {
        return "0.00";
      }
    } else {
      return "0.00";
    }
  };

  const calculateOutstanding = () => {
    const price = calculateTotal();
    return price;
  };

  const outstandingAmount = calculateOutstanding();
  let installmentAmount1Percentage = 0;
  let installmentAmount2Percentage = 0;
  let installmentAmount3Percentage = 0;

  if (installmentMonth === 1) {
    installmentAmount1Percentage = 1; // 100%
  } else if (installmentMonth === 2) {
    installmentAmount1Percentage = 0.6; // 60%
    installmentAmount2Percentage = 0.4; // 40%
  } else if (installmentMonth === 3) {
    installmentAmount1Percentage = 0.4; // 40%
    installmentAmount2Percentage = 0.3; // 30%
    installmentAmount3Percentage = 0.3; // 30%
  }

  const installmentAmount1 = (
    outstandingAmount * installmentAmount1Percentage
  ).toFixed(2);
  const installmentAmount2 = (
    outstandingAmount * installmentAmount2Percentage
  ).toFixed(2);
  const installmentAmount3 = (
    outstandingAmount * installmentAmount3Percentage
  ).toFixed(2);

  const doCheckout = () => {
    let error = false;

    let calculatedOutstanding = outstandingAmount; // Initialize calculatedOutstanding with the current outstanding amount

    if (paymentMethod === "Full payment") {
      // If payment method is full payment, set outstanding amount to 0
      calculatedOutstanding = 0;
    }

    if (error) {
      notifications.show({
        title: error,
        color: "red",
      });
    } else {
      // Trigger the order API to create a new order
      createOrderMutation.mutate({
        data: JSON.stringify({
          paid_at: new Date(),
          packages: selectedPackage,
          totalPrice: calculateTotal(),
          clientId: selectedClient,
          paymentMethod: paymentMethod,
          installmentMonth: installmentMonth,
          installmentAmount1: installmentAmount1,
          installmentAmount2: installmentAmount2,
          installmentAmount3: installmentAmount3,
          outstanding: calculatedOutstanding,
          tax: calculateTax(),
          user: currentUser._id,
          year: new Date().getFullYear(), // Get the current year
          month: new Date().getMonth() + 1, // Get the current month (adding 1 because months are zero-based)
          day: new Date().getDate(), // Get the current day of the month
        }),
        token: currentUser ? currentUser.token : "",
      });
      setLoading(true);
    }
  };

  return (
    <>
      <HeaderClient page="Package" />
      <Grid span={12}>
        <Grid.Col span={2}></Grid.Col>
        <Grid.Col span={8}>
          <Title order={1} align="center">
            Package
          </Title>
          <Space h="30px" />
          <Select
            data={clients.map((client) => ({
              value: client._id,
              label: `Name:  ${client.clientName} ,  IC:  ${client.clientIc}`,
            }))}
            value={selectedClient}
            onChange={(value) => setSelectedClient(value)}
            placeholder="Select a client"
            label="Select a client"
          />{" "}
          <Space h="20px" />
          <Select
            data={
              packages
                ? packages.map((p) => ({
                    value: p._id,
                    label: `${p.sofitpackage}  (MYR ${p.price})`,
                  }))
                : []
            }
            value={selectedPackage}
            label="Select a package"
            onChange={(value) => setSelectedPackage(value)}
            placeholder="Select a Package"
          />
          <Space h="20px" />
          <Select
            data={[
              {
                value: "Full payment",
                label: "Full payment",
              },
              {
                value: "Installment",
                label: "Installment",
              },
            ]}
            value={paymentMethod}
            label="Select a Payment Method"
            onChange={(value) => setPaymentMethod(value)}
            placeholder="Select a Package"
          />
          {paymentMethod === "Installment" && (
            <Grid.Col span={12}>
              {/* Installment month selection and installment amounts */}
              <Group position="apart">
                <Grid.Col span={5}>
                  <Select
                    data={[
                      { value: 1, label: 1 },
                      { value: 2, label: 2 },
                      { value: 3, label: 3 },
                    ]}
                    value={installmentMonth}
                    label="Select a Installment Month"
                    onChange={(value) => setInstallmentMonth(value)}
                    placeholder="Select a Package"
                  />
                </Grid.Col>
                <Grid.Col span={5}>
                  <TextInput
                    label="Outstanding  "
                    value={outstandingAmount}
                    readOnly
                  />
                </Grid.Col>
              </Group>
              <Space h="5px" />
              <Grid.Col span={12}>
                <Group position="apart">
                  {" "}
                  <Grid.Col span={3}>
                    <TextInput
                      label="First Month"
                      value={installmentAmount1}
                      readOnly
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <TextInput
                      label="Second Month"
                      value={installmentAmount2}
                      readOnly
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <TextInput
                      label="Thrid Month"
                      value={installmentAmount3}
                      readOnly
                    />
                  </Grid.Col>
                </Group>
              </Grid.Col>
            </Grid.Col>
          )}
          <Space h="20px" />
          <Text fz={12} fw={500}>
            *Pls Check member package correct or not, only press Confirm
          </Text>
          <Space h="5px" />
          <Card>
            <Group position="left">
              <Group>
                <Text fz={15} fw={600}>
                  Name:{" "}
                  {selectedClient && clients
                    ? clients.find((c) => c._id === selectedClient)
                        ?.clientName || ""
                    : "-"}
                </Text>
                <Text fz={15} fw={600}>
                  Identity Card:{" "}
                  {selectedClient && clients
                    ? clients.find((c) => c._id === selectedClient)?.clientIc ||
                      "No selected client"
                    : "-"}
                </Text>
              </Group>
            </Group>
            <Space h="3px" />
            <Group position="left">
              <Text fz={15} fw={300}>
                Package:
              </Text>
            </Group>{" "}
            <Space h="3px" />
            <Group position="left">
              <Text fz={15} fw={700}>
                {selectedPackage && packages
                  ? packages.find((p) => p._id === selectedPackage)
                      ?.sofitpackage || "Loading..."
                  : "No selected package "}
              </Text>
            </Group>{" "}
            <Space h="10px" />
            <Divider /> <Space h="10px" />
            <Group position="apart">
              <Text fw={500} px="1px" precision={2}>
                Price:
              </Text>
              <Text weight="bolder" align="right" px="1px" precision={2}>
                {selectedPackage && packages
                  ? (
                      packages.find((p) => p._id === selectedPackage)?.price ||
                      0
                    ).toFixed(2)
                  : "0.00"}
              </Text>{" "}
            </Group>
            <Group position="apart">
              <Text fw={500} px="1px" precision={2}>
                Service Tax (8%):
              </Text>
              <Text weight="bolder" px="1px" precision={2}>
                {calculateTax()}
              </Text>
            </Group>
            <Group position="apart">
              <Text fw={500} px="1px" precision={2}>
                Total Amount (MYR):
              </Text>
              <Text fw={900} px="1px" precision={2}>
                {calculateTotal()}
              </Text>
            </Group>
          </Card>
          <Space h="30px" />
          <Group position="center">
            <Button
              loading={loading}
              onClick={() => {
                doCheckout();
              }}
            >
              Confirm Package
            </Button>
          </Group>
        </Grid.Col>
        <Grid.Col span={2}></Grid.Col>
      </Grid>
    </>
  );
}
