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
  NumberInput,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import Header from "../Header";
import { API_URL } from "../api/data";
import { createOrder } from "../api/order";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import { fetchClients } from "../api/client";
import "./checkout.css";
import { fetchBranch, fetchUsers } from "../api/auth";
import noImageIcon from "../Logo/no_image.png";

export default function Checkout() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [tax, setTax] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [status, setStatus] = useState("Pending");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [orderNumber, setOrderNumber] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [paid_at, setPaid_At] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartItems,
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => fetchClients(id),
  });

  const { data: branches = [] } = useQuery({
    queryKey: ["branches"],
    queryFn: () => fetchBranch(),
  });

  const currentUserBranch = useMemo(() => {
    return cookies?.currentUser?.branch;
  }, [cookies]);

  // Filter users by currentUser's branch
  const filteredUsers = users.filter(
    (user) => user.branch === currentUserBranch
  );

  const filteredClients = clients.filter((c) => c.branch === currentUserBranch);

  const calculateTotal = () => {
    let total = 0;
    cart.map((item) => (total = total + item.quantity * item.price));
    return total;
  };

  const calculateTotalWithDiscount = () => {
    let total = parseFloat(calculateTotal());

    // Calculate discount based on either discount rate or direct discount value
    let discountAmount;
    if (discountRate > 0) {
      discountAmount = (total * discountRate) / 100;
    } else {
      discountAmount = parseFloat(discount);
    }

    // Apply discount
    total -= discountAmount;

    return total;
  };

  useEffect(() => {
    if (discountRate > 0) {
      const total = parseFloat(calculateTotal());
      const discountValue = (total * discountRate) / 100;
      setDiscount(discountValue);
    } else {
      setDiscount(0);
    }
  }, [discountRate]);

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      clearCartItems();
      navigate("/orders");
    },
    onError: (error) => {
      // when there is an error in API call
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

  const doCheckout = () => {
    let error = false;

    if (!selectedUser) {
      notifications.show({
        title: "Please fill in all fields",
        color: "red",
      });
    } else {
      // if no error, trigger the order API to create a new order
      createOrderMutation.mutate({
        data: JSON.stringify({
          name: name,
          phone: phone,
          address: address,
          status: status,
          month: month,
          paid_at: new Date(),
          products: cart.map((i) => i._id),
          description: cart.map((i) => i.name).join(", "),
          discountRate: discountRate,
          discount: discount,
          totalPrice: calculateTotalWithDiscount().toFixed(2),
          clientId: selectedClient,
          user: currentUser._id,
          staffId: selectedUser,
          staffName: selectedUserName,
        }),
        token: currentUser ? currentUser.token : "",
      });
      setLoading(true);

      // Increment the order number for the month after creating an order
    }
  };

  return (
    <>
      <Header title="Checkout" page="checkout" />
      <Space h="35px" />
      <Grid span={12}>
        <Grid.Col span={3}></Grid.Col>
        <Grid.Col span={6}>
          <Title order={6} align="center">
            Contact Information
          </Title>
          <Space h="20px" />
          <Select
            data={filteredClients.map((client) => ({
              value: client._id,
              label: `Name: ${client.clientName}, IC: ${client.clientIc}`,
            }))}
            value={selectedClient}
            onChange={(value) => setSelectedClient(value)}
            placeholder="Select a client"
            label="Select a client"
          />
          {/* <Group position="center">
            <Space h="50px" />
            <Text fw={700}>---- IF NOT A MEMBER ----</Text>
            <Space h="50px" />
          </Group>
          <TextInput
            value={name}
            placeholder="Name"
            label="Name"
            required
            disabled={!!selectedClient} // Disable if selectedClient has a value
            onChange={(event) => setName(event.target.value)}
          />
          <TextInput
            value={phone}
            label="Phone Number"
            required
            disabled={!!selectedClient} // Disable if selectedClient has a value
            onChange={(event) => setPhone(event.target.value)}
          />
          <TextInput
            value={address}
            label="Address"
            required
            disabled={!!selectedClient} // Disable if selectedClient has a value
            onChange={(event) => setAddress(event.target.value)}
          />
          <Space h="20px" /> */}
          <p>Your order summary</p>
          <Table>
            <tbody>
              {cart ? (
                cart.map((c) => {
                  return (
                    <tr key={c._id}>
                      <td
                        style={{
                          borderTop: "none",
                        }}
                      >
                        {c.productImage && c.productImage !== "" ? (
                          <>
                            <Image
                              src={API_URL + "/" + c.productImage}
                              width="100px"
                            />
                          </>
                        ) : (
                          <Image src={noImageIcon} width="100px" />
                        )}
                      </td>
                      <td
                        style={{
                          borderTop: "none",
                        }}
                      >
                        {" "}
                        {c.name}
                      </td>
                      <td
                        style={{
                          borderTop: "none",
                        }}
                      >
                        {c.price.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6}>No Product Added Yet!</td>
                </tr>
              )}
              <Space h={50} />
              <tr>
                <td>Discount:</td>
                <td>
                  <NumberInput
                    value={discountRate}
                    precision={0}
                    max={100}
                    onChange={setDiscountRate}
                  />
                </td>
                <td>
                  <NumberInput
                    value={discount}
                    precision={2}
                    onChange={(value) => setDiscount(value)}
                  />
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    borderTop: "none",
                  }}
                >
                  Select a Staff:
                </td>{" "}
                <td
                  style={{
                    borderTop: "none",
                  }}
                >
                  <Select
                    data={filteredUsers.map((user) => ({
                      value: user._id,
                      label: `${user.name} (${user.ic})`,
                    }))}
                    value={selectedUser}
                    onChange={(value) => setSelectedUser(value)}
                    placeholder="Select a Staff"
                  />
                </td>{" "}
                <td
                  style={{
                    borderTop: "none",
                  }}
                ></td>
              </tr>
              <tr>
                <td>Total Amount:</td>
                <td></td>
                <td>{calculateTotalWithDiscount().toFixed(2)}</td>
              </tr>{" "}
            </tbody>
          </Table>

          <Space h="20px" />
          <Space h="20px" />
          <Button
            loading={loading}
            fullWidth
            onClick={() => {
              doCheckout();
            }}
          >
            Pay
            <Text weight="bolder" px="5px" precision={2}>
              ${calculateTotalWithDiscount().toFixed(2)}
            </Text>{" "}
            Now
          </Button>
        </Grid.Col>
        <Grid.Col span={3}></Grid.Col>
      </Grid>
    </>
  );
}
