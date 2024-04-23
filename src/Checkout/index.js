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
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import Header from "../Header";
import { createOrder } from "../api/order";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import { fetchClients } from "../api/client";
import "./checkout.css";

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
  const [paid_at, setPaid_At] = useState("");
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartItems,
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => fetchClients(id),
  });

  const calculateTotal = () => {
    let total = 0;
    cart.map((item) => (total = total + item.quantity * item.price));
    return total;
  };

  const calculateTax = () => {
    const taxRate = 0.08; // 8%
    const total = calculateTotal();
    return total * taxRate;
  };

  const calculateTotalWithTax = () => {
    const total = calculateTotal();
    const taxAmount = calculateTax();
    return total + taxAmount;
  };

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      clearCartItems();
      navigate("/orders");
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

  const doCheckout = () => {
    let error = false;

    if (error) {
      notifications.show({
        title: error,
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
          tax: calculateTax().toFixed(2),
          totalPrice: calculateTotalWithTax().toFixed(2),
          clientId: selectedClient,
          user: currentUser._id,
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
        <Grid.Col span={7}>
          <Title order={3} align="center">
            Contact Information
          </Title>
          <Space h="20px" />
          <Select
            data={clients.map((client) => ({
              value: client._id,
              label: `${client.clientName}  (${client.clientPhonenumber})`,
            }))}
            value={selectedClient}
            onChange={(value) => setSelectedClient(value)}
            placeholder="Select a client"
          />
          <Group position="center">
            <Space h="50px" />
            <Text fw={700}>---- IF NO A MEMBER ----</Text>
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
          <Space h="20px" />

          <Space h="20px" />
        </Grid.Col>

        <Grid.Col span={5}>
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
                              src={"http://localhost:2019/" + c.productImage}
                              width="100px"
                            />
                          </>
                        ) : (
                          <Image
                            src={
                              "https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg"
                            }
                            width="100px"
                          />
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
                  <td colSpan={6}>No Product Add Yet!</td>
                </tr>
              )}
              <tr>
                <td
                  style={{
                    borderTop: "none",
                  }}
                >
                  Price:
                </td>
                <td
                  style={{
                    borderTop: "none",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "none",
                  }}
                >
                  {calculateTotal().toFixed(2)}
                </td>
              </tr>{" "}
              <tr>
                <td
                  style={{
                    borderTop: "none",
                  }}
                >
                  Service Tax (8%):
                </td>
                <td
                  style={{
                    borderTop: "none",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "none",
                  }}
                >
                  {calculateTax().toFixed(2)}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    borderTop: "none",
                  }}
                >
                  Total Amount:
                </td>
                <td
                  style={{
                    borderTop: "none",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "none",
                  }}
                >
                  {calculateTotalWithTax().toFixed(2)}
                </td>
              </tr>{" "}
            </tbody>
          </Table>
        </Grid.Col>
        <Space h="20px" />
        <Grid.Col span={3}></Grid.Col>
        <Grid.Col span={6}>
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
              ${calculateTotalWithTax().toFixed(2)}
            </Text>{" "}
            Now
          </Button>
        </Grid.Col>
        <Grid.Col span={3}></Grid.Col>
      </Grid>
    </>
  );
}
