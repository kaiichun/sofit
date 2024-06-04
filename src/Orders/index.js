import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  Container,
  Table,
  Group,
  Button,
  Image,
  Space,
  HoverCard,
  Text,
  Select,
  LoadingOverlay,
  ScrollArea,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { API_URL } from "../api/data";
import { notifications } from "@mantine/notifications";
import Header from "../Header";
import { useParams } from "react-router-dom";
import { MdDownloadForOffline, MdDelete } from "react-icons/md";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useCookies } from "react-cookie";
import { fetchOrders, deleteOrder, updateOrder } from "../api/order";
import { fetchClients } from "../api/client";
import logo from "../Logo/sofit-black.png";
import { fetchUsers } from "../api/auth";
import noImageIcon from "../Logo/no_image.png";

export default function Orders() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { isLoading, data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(currentUser ? currentUser.token : ""),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => fetchClients(id),
  });

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      (cookies.currentUser.role === "Admin HQ" ||
        cookies.currentUser.role === "Admin Branch")
      ? true
      : false;
  }, [cookies]);

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      notifications.show({
        title: "Order Deleted",
        color: "green",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      notifications.show({
        title: "Status Edited",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(currentUser ? currentUser.token : ""),
  });

  const handleDownloadPDF = (order) => {
    const doc = new jsPDF();
    const client = clients.find((client) => client._id === order.clientId);
    const user = users.find((user) => user._id === order.user);

    const imgData = logo;

    doc.addImage(imgData, "PNG", 10, 13, 30, 30);

    // Add group data
    const groupYPos = 20;
    doc.setFontSize(9);
    doc.text("SO FIT SDN. BHD.", 50, groupYPos);
    doc.setFontSize(8);
    doc.text("(Co. No. 202101016054 (1416354-X))", 50, groupYPos + 5);
    doc.text(
      "No. 13-2-1, 13-2-2, Jalan Setia Prima (A) U13/A,",
      50,
      groupYPos + 10
    );
    doc.text(
      "Setia Alam, Seksyen U13, 40170 Shah Alam, Selangor",
      50,
      groupYPos + 15
    );
    doc.text(
      "H/P : 016-982 9350 Email : 88sofit@gmail.com",
      50,
      groupYPos + 20
    );

    doc.text(`INVOICE: ${order.invoiceNo}`, 160, groupYPos);
    const paidDate = new Date(order.paid_at);
    const year = paidDate.getFullYear();
    const month = String(paidDate.getMonth() + 1).padStart(2, "0");
    const day = String(paidDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    doc.text(`Date: ${formattedDate}`, 160, groupYPos + 5);
    doc.text(`Staff: ${order.staffName}`, 160, groupYPos + 10);

    doc.setLineWidth(0.3);
    doc.line(10, 75, 200, 75);

    const group2YPos = 45;
    doc.text(`Name:`, 10, 50);
    doc.text(`Phone Number:`, 10, 55);
    doc.text(`Adress:`, 10, 60);

    if (client) {
      doc.setFontSize(8);
      doc.text(`${client.clientName}`, 40, group2YPos + 5);
      doc.text(`${client.clientPhonenumber}`, 40, group2YPos + 10);
      doc.text(`${client.clientAddress1}`, 40, group2YPos + 15);
      if (client.clientAddress2 && client.clientAddress2.trim() !== "") {
        doc.text(`${client.clientAddress2}`, 40, group2YPos + 20);
      }

      doc.text(
        `${client.clientZip}, ${client.clientState}.`,
        40,
        group2YPos + (client.clientAddress2 ? 25 : 20)
      );
    } else {
      doc.setFontSize(8);
      doc.text(`${order.name}`, 40, group2YPos + 5);
      doc.text(`${order.phone}`, 40, group2YPos + 10);
      doc.text(`${order.address}`, 40, group2YPos + 15);
    }

    let tableYPos = 86;
    const tableHeaders = ["DESCRIPTION", "AMOUNT (RM)"];
    doc.setFontSize(11);
    doc.setFont("bold");
    doc.text(`DESCRIPTION`, 13, 82);
    doc.text(`AMOUNT (RM)`, 170, 82);

    doc.setLineWidth(0.1);
    doc.line(12, 84, 198, 84);

    const tableData = order.products.map((product) => [
      product.name,
      `${product.price.toFixed(2)}`,
    ]);

    const options = {
      headStyles: {
        fillColor: [211, 211, 211],
        textColor: [0, 0, 0],
        0: { halign: "left" },
        1: { halign: "right" },
      },
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "right" },
      },
    };
    // Add the table
    const addTable = () => {
      doc.autoTable({
        startY: tableYPos,
        body: tableData,
        theme: "plain",
        styles: {
          cellPadding: 2,
          fontSize: 10,
          cellWidth: "wrap",
          valign: "middle",
        },
        ...options,
      });
    };

    addTable();

    const maxYPos = 200;
    if (doc.autoTable.previous.finalY > maxYPos) {
      doc.addPage();
      tableYPos = 20;
      addTable();
    }

    const totalPriceYPos = doc.autoTable.previous.finalY + 15;
    const totalPriceXPos = 160;
    doc.setLineWidth(0.5);
    // doc.line(159, totalPriceYPos - 5, 196, totalPriceYPos - 5);
    doc.setLineWidth(0.2);
    doc.line(12, 203, 198, 203);
    // doc.line(12, 84, 12, 203);
    // doc.line(198, 84, 198, 203);
    // doc.line(138, 203, 138, 215);
    // doc.line(198, 203, 198, 215);
    // doc.line(138, 215, 198, 215);
    doc.setFontSize(10);
    // doc.text(`Service Tax (8%) :`, 140, 208);
    // doc.text(`${order.tax.toFixed(2)}`, 184.2, 208);
    // doc.text(`Total Price:`, 140, 213);
    // doc.text(`${order.totalPrice.toFixed(2)}`, 182.3, 213);
    doc.text(`Discount:`, 140, 208);
    doc.text(`${order.discount ? order.discount.toFixed(2) : 0.0}`, 182.3, 208);
    doc.text(`Total Price:`, 140, 213);
    doc.text(`${order.totalPrice.toFixed(2)}`, 182.3, 213);
    // doc.text(`Total Price :`, 140, 208);
    // doc.text(`${order.totalPrice.toFixed(2)}`, 182.3, 208);

    const tableY2Pos = 235;
    doc.setLineWidth(0.2);
    doc.line(10, 250, 200, 250);

    doc.setFontSize(10);
    doc.text("Company Beneficiary: So Fit Sdn Bhd", 15, tableY2Pos + 25);
    doc.text("Beneficiary Bank: OCBC Al-Amin Bank Berhad", 15, tableY2Pos + 30);
    doc.text("Account Number: 167-101045-8", 15, tableY2Pos + 35);
    doc.text("Bank Address:", 15, tableY2Pos + 43);
    doc.text(
      "KS 7, 117, Jalan Mahogani 5, Bandar Botanik,",
      15,
      tableY2Pos + 48
    );
    doc.text("41200 Klang, Selangor.", 15, tableY2Pos + 53);

    doc.setFontSize(6);
    doc.text(
      "*Computer generated invoice, no signature required.",
      15,
      tableY2Pos + 57
    );

    // Save the PDF
    doc.save(`invoice_${order.invoiceNo}.pdf`);
  };

  const handleDeleteClick = (orderId) => {
    openConfirmModal({
      title: "Confirm Deletion",
      children: <Text>Are you sure you want to delete this order?</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        deleteMutation.mutate({
          id: orderId,
          token: currentUser ? currentUser.token : "",
        });
      },
    });
  };

  return (
    <>
      <Container size="100%">
        <Header title="My Orders" page="orders" />
        <Space h="35px" />
        <LoadingOverlay visible={isLoading} />
        <ScrollArea h={800} width="100%" offsetScrollbars scrollHideDelay={300}>
          <Table>
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Customer</th>
                <th>Products</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Payment Date</th>
                <th>Sales By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders
                ? orders.map((o) => {
                    const client = clients.find(
                      (client) => client._id === o.clientId
                    );
                    const user = users.find((user) => user._id === o.user);
                    const paidDate = new Date(o.paid_at);
                    const day = paidDate.getDate().toString().padStart(2, "0");
                    const month = (paidDate.getMonth() + 1)
                      .toString()
                      .padStart(2, "0");
                    const year = paidDate.getFullYear();
                    const formattedDate = `${day}-${month}-${year}`;

                    return (
                      <tr key={o._id}>
                        <td>{o.invoiceNo}</td>
                        <td>
                          {client ? client.clientName : o.name}
                          <br />
                          HP: {client ? client.clientPhonenumber : o.phone}
                        </td>

                        <td>
                          {o.products.map((product, index) => (
                            <div key={index}>
                              <Group>
                                {product.productImage &&
                                product.productImage !== "" ? (
                                  <>
                                    <Image
                                      src={API_URL + "/" + product.productImage}
                                      width={50}
                                      height={50}
                                      styles={{
                                        borderRadius: "20px",
                                      }}
                                    />
                                  </>
                                ) : (
                                  <Image src={noImageIcon} width="50px" />
                                )}
                                <p>{product.name}</p>
                              </Group>
                            </div>
                          ))}
                        </td>
                        <td>MYR {o.totalPrice.toFixed(2)}</td>
                        <td>
                          <Select
                            value={o.status}
                            disabled={
                              o.status === "Delivered" || !isAdmin
                                ? true
                                : false
                            }
                            data={[
                              {
                                value: "Pending",
                                label: "Pending",
                              },
                              { value: "Paid", label: "Paid" },
                              { value: "Failed", label: "Failed" },
                              { value: "Shipped", label: "Shipped" },
                              {
                                value: "Delivered",
                                label: "Delivered",
                              },
                            ]}
                            onChange={(newValue) => {
                              updateMutation.mutate({
                                id: o._id,
                                data: JSON.stringify({
                                  status: newValue,
                                }),
                                token: currentUser ? currentUser.token : "",
                              });
                            }}
                          />
                        </td>
                        <td>{formattedDate}</td>
                        <td> {user && user.name}</td>
                        <td>
                          <HoverCard shadow="md">
                            <HoverCard.Target>
                              <Button
                                variant="subtle"
                                color="gray"
                                radius="xl"
                                size="sm"
                                onClick={() => handleDownloadPDF(o)}
                              >
                                <MdDownloadForOffline
                                  style={{
                                    height: 24,
                                    width: 24,
                                  }}
                                />
                              </Button>
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                              <Text size="sm">INVOICE</Text>
                            </HoverCard.Dropdown>
                          </HoverCard>
                          {o.status === "Pending" && isAdmin && (
                            <HoverCard shadow="md">
                              <HoverCard.Target>
                                <Button
                                  variant="subtle"
                                  color="red"
                                  radius="xl"
                                  size="sm"
                                  onClick={() => handleDeleteClick(o._id)}
                                >
                                  <MdDelete
                                    style={{
                                      height: 24,
                                      width: 24,
                                    }}
                                  />
                                </Button>
                              </HoverCard.Target>
                              <HoverCard.Dropdown>
                                <Text size="sm">Delete Order</Text>
                              </HoverCard.Dropdown>
                            </HoverCard>
                          )}
                        </td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </Table>
        </ScrollArea>
        <Space h="20px" />
      </Container>
    </>
  );
}
