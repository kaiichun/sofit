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
  LoadingOverlay,
  NumberInput,
  NativeSelect,
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
import { fetchUsers } from "../api/auth";

export default function Checkout() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState();
  const [payby, setPayby] = useState("");
  const [installmentMonth, setInstallmentMonth] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [selectedUser, setSelectedUser] = useState("");

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => fetchClients(id),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
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

  const selectedUserName =
    selectedUser && users
      ? users.find((c) => c._id === selectedUser)?.name || ""
      : "-";

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

  const calculateTotalWithOutTax = () => {
    if (packages && selectedPackage) {
      const selectedPackageObject = packages.find(
        (p) => p._id === selectedPackage
      );
      if (selectedPackageObject) {
        return parseFloat(selectedPackageObject.price).toFixed(2);
      } else {
        return "0.00";
      }
    } else {
      return "0.00";
    }
  };

  const calculateTotalWithDiscount = () => {
    let total = parseFloat(calculateTotalWithOutTax());

    // Apply discount rate if provided
    if (discountRate > 0) {
      total -= (total * discountRate) / 100;
    }

    // Apply direct discount value if provided
    if (discount > 0) {
      total -= discount;
    }

    return total.toFixed(2);
  };

  const calculateTax = () => {
    const totalWithDiscount = parseFloat(calculateTotalWithDiscount());
    const taxAmount = totalWithDiscount * 0.08; // Calculate 8% of the discounted total
    return taxAmount.toFixed(2); // Ensure taxAmount has two decimal places
  };

  const calculateFinalTotal = () => {
    const totalWithDiscount = parseFloat(calculateTotalWithDiscount());
    const taxAmount = parseFloat(calculateTax());
    const finalTotal = totalWithDiscount + taxAmount;
    return finalTotal.toFixed(2);
  };

  const calculateOutstanding = () => {
    const finalTotal = calculateFinalTotal();
    return finalTotal;
  };

  const outstandingAmount = calculateOutstanding();

  const installmentAmount = useMemo(() => {
    if (installmentMonth && outstandingAmount) {
      return (outstandingAmount / installmentMonth).toFixed(2);
    }
    return "0.00";
  }, [installmentMonth, outstandingAmount]);

  useEffect(() => {
    if (discountRate > 0) {
      const total = parseFloat(calculateTotalWithOutTax());
      const discountValue = (total * discountRate) / 100;
      setDiscount(discountValue);
    } else {
      setDiscount(0);
    }
  }, [discountRate]);

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
          totalPrice: calculateFinalTotal(),
          clientId: selectedClient,
          paymentMethod: paymentMethod,
          payby: payby,
          installmentMonth: installmentMonth,
          installmentAmount: installmentAmount,
          outstanding: calculateOutstanding(),
          tax: calculateTax(),
          user: currentUser._id,
          staffId: selectedUser,
          staffName: selectedUserName,
          discountRate: discountRate,
          discount: discount,
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
      <LoadingOverlay visible={isLoading} />
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
                value: "Bank Transfer",
                label: "Bank Transfer",
              },
              {
                value: "Cash",
                label: "Cash",
              },
              {
                value: "Credit Card",
                label: "Credit Card",
              },
              {
                value: "Debit Card",
                label: "Debit Card",
              },
              {
                value: "E-Wallet",
                label: "E-Wallet",
              },

              {
                value: "Merchant Services",
                label: "Merchant Services",
              },
            ]}
            value={payby}
            label="Select a Payment Method"
            onChange={(value) => setPayby(value)}
            placeholder="Payment Method"
          />
          <Space h="20px" />
          <NativeSelect
            data={["Full payment", "Installment"]}
            label="Gender"
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
          />
          {paymentMethod === "Installment" && (
            <Grid.Col span={12}>
              <Group>
                <Grid.Col span={4}>
                  <Select
                    data={[
                      { value: 3, label: 3 },
                      { value: 6, label: 6 },
                      { value: 12, label: 12 },
                    ]}
                    value={installmentMonth}
                    label="Select a Installment Month"
                    onChange={(value) => setInstallmentMonth(value)}
                    placeholder="Select a Package"
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <TextInput
                    label="Outstanding  "
                    value={outstandingAmount}
                    readOnly
                  />
                </Grid.Col>{" "}
                <Grid.Col span={4}>
                  <TextInput
                    label="Month Installment Amount"
                    value={installmentAmount}
                    readOnly
                  />
                </Grid.Col>
              </Group>{" "}
              <Space h="15px" />
              <Divider />
            </Grid.Col>
          )}
          <Grid.Col span={12}>
            <Group position="apart">
              <Grid.Col span={5}>
                <NumberInput
                  value={discountRate}
                  precision={0}
                  label="Discount Rate"
                  max={100}
                  onChange={setDiscountRate}
                />
              </Grid.Col>
              <Grid.Col span={5}>
                <NumberInput
                  value={discount}
                  label="Discount"
                  precision={2}
                  onChange={(value) => setDiscount(value)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Select
                  label="Select Staff"
                  data={users.map((user) => ({
                    value: user._id,
                    label: `${user.name} (${user.ic})`,
                  }))}
                  value={selectedUser}
                  onChange={(value) => setSelectedUser(value)}
                  placeholder="Select a Staff"
                />
              </Grid.Col>
            </Group>
          </Grid.Col>
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
                Discount :
              </Text>
              <Text weight="bolder" px="1px" precision={2}>
                {discount.toFixed(2)}
              </Text>
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
                {calculateFinalTotal()}
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
