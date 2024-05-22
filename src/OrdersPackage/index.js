import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  Container,
  Table,
  Button,
  Space,
  HoverCard,
  Text,
  LoadingOverlay,
  Checkbox,
  Modal,
  NumberInput,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useParams } from "react-router-dom";
import { MdDownloadForOffline, MdDelete } from "react-icons/md";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useCookies } from "react-cookie";
import { fetchClients } from "../api/client";
import logo from "../Logo/sofit-black.png";
import { fetchUsers } from "../api/auth";
import {
  deleteOrderPackage,
  fetchOrderPackages,
  updateOrderPackage,
} from "../api/orderspackage";
import HeaderClient from "../HeaderClient";

export default function OrdersPackage() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const [openedOrderId, setOpenedOrderId] = useState(null);

  const [currentProducts, setCurrentProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [outstanding, setOutStanding] = useState("");
  const [currentOutstanding, setCurrentOutStanding] = useState("");
  const [totalPages, setTotalPages] = useState([]);
  const { isLoading, data: orderspackage = [] } = useQuery({
    queryKey: ["orderspackage"],
    queryFn: () => fetchOrderPackages(currentUser ? currentUser.token : ""),
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
    mutationFn: deleteOrderPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orderspackage"],
      });
      notifications.show({
        title: "Order Deleted",
        color: "green",
      });
    },
  });

  const openModal = (orderId) => {
    setOpenedOrderId(orderId);
  };

  const closeModal = () => {
    setOpenedOrderId(null);
  };

  const updateMutation = useMutation({
    mutationFn: updateOrderPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orderspackage"],
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

  const handleUpdateOutstanding = (orderId) => {
    updateMutation.mutate({
      id: orderId,
      data: JSON.stringify({
        outstanding: outstanding,
      }),
      token: currentUser ? currentUser.token : "",
    });
    closeModal(); // Close the modal after updating
  };

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
    if (user && user.name) {
      doc.text(`Staff: ${user.name}`, 160, groupYPos + 10);
    }
    doc.setLineWidth(0.3);
    doc.line(10, 75, 200, 75);
    const group2YPos = 45;
    doc.text(`Name:`, 10, 50);
    doc.text(`Phone Number:`, 10, 55);
    doc.text(`Adress:`, 10, 60);
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

    doc.setFontSize(10);
    doc.setFontSize(11);
    doc.setFont("bold");
    doc.text(`DESCRIPTION`, 13, 82);
    doc.text(`AMOUNT (RM)`, 170, 82);
    doc.setLineWidth(0.1);
    doc.line(12, 84, 198, 84);

    let tableYPos = 86;
    const tableData = order.packages.map((packages) => [
      packages.sofitpackage,
      `${packages.price.toFixed(2)}`,
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
    doc.setLineWidth(0.2);
    doc.line(12, 203, 198, 203);
    doc.setFontSize(10);
    doc.text(`Service Tax (8%) :`, 140, 208);
    doc.text(`${order.tax.toFixed(2)}`, 184.2, 208);
    doc.text(`Total Price:`, 140, 213);
    doc.text(`${order.totalPrice.toFixed(2)}`, 182.3, 213);

    doc.setFontSize(10);
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

    doc.save(`invoice_${order.invoiceNo}.pdf`);
  };

  useEffect(() => {
    let newList = orderspackage ? [...orderspackage] : [];
    // filter by category
    if (category !== "") {
      newList = newList.filter((p) => p.paid_at === category);
    }
    const total = Math.ceil(newList.length / perPage);
    // convert the total number into array
    const pages = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    setTotalPages(pages);

    switch (sort) {
      case "name":
        newList = newList.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
        break;
      case "price":
        newList = newList.sort((a, b) => {
          return a.price - b.price;
        });
        break;
      default:
        break;
    }
    // do pagination
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    newList = newList.slice(start, end);

    setCurrentPage(newList);
  }, [orderspackage, category, sort, perPage, currentPage]);

  const categoryOptions = useMemo(() => {
    let options = [];
    if (orderspackage && orderspackage.length > 0) {
      orderspackage.forEach((product) => {
        if (!options.includes(product.category)) {
          options.push(product.category);
        }
      });
    }
    return options;
  }, [orderspackage]);

  return (
    <>
      <Container size="100%">
        <HeaderClient title="My Orders" page="orders" />
        <Space h="35px" />
        <LoadingOverlay visible={isLoading} />
        <Table>
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Member Details</th>
              <th>Package</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>First Payment</th>
              <th>Second Payment</th>
              <th>Third Payment</th>
              <th>Outstanding</th>
              <th>Update</th>
              <th>Sales Date</th>
              <th>Sales By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orderspackage
              ? orderspackage.map((o) => {
                  const client = clients.find(
                    (client) => client._id === o.clientId
                  );
                  const user = users.find((user) => user._id === o.user);
                  // Assuming o.paid_at is in ISO 8601 format (e.g., "2024-04-08T12:00:00.000Z")
                  const paidDate = new Date(o.paid_at);

                  // Get day, month, and year
                  const day = paidDate.getDate().toString().padStart(2, "0"); // Add leading zero if needed
                  const month = (paidDate.getMonth() + 1)
                    .toString()
                    .padStart(2, "0"); // Add leading zero if needed
                  const year = paidDate.getFullYear();

                  // Format as DD MM YYYY
                  const formattedDate = `${day}-${month}-${year}`;

                  return (
                    <tr key={o._id}>
                      <td>{o.invoiceNo}</td>
                      <td>
                        {client ? client.clientName : ""}
                        <br />
                        HP: {client ? client.clientPhonenumber : ""}
                      </td>

                      <td>
                        {o.packages.map((p, index) => (
                          <div key={index}>
                            <p>{p.sofitpackage}</p>
                          </div>
                        ))}
                      </td>
                      <td>MYR {o.totalPrice.toFixed(2)}</td>
                      <td>{o.paymentMethod}</td>
                      <td>{o.installmentAmount1}</td>
                      <td>{o.installmentAmount2}</td>
                      <td>{o.installmentAmount3}</td>
                      <td>{o.outstanding ? o.outstanding.toFixed(2) : 0.0}</td>

                      <td>
                        {o.outstanding ? (
                          <>
                            <Modal
                              opened={openedOrderId === o._id}
                              onClose={closeModal}
                              title="Outstanding Update"
                            >
                              <NumberInput
                                label="Balance"
                                value={o.outstanding}
                                placeholder={o.outstanding}
                                precision={2}
                                onChange={(value) => setOutStanding(value)}
                                readOnly
                              />

                              {/* <NumberInput
                            label="Payment"
                            value={currentOutstanding}
                            precision={2}
                            onChange={(value) => setCurrentOutStanding(value)}
                          /> */}

                              <NumberInput
                                label="Payment"
                                value={currentOutstanding}
                                precision={2}
                                onChange={(value) => {
                                  const newOutstanding =
                                    parseFloat(o.outstanding) -
                                    parseFloat(value);
                                  setCurrentOutStanding(value);
                                  setOutStanding(newOutstanding);
                                }}
                              />

                              <NumberInput
                                label="New Balance"
                                value={outstanding} // Assuming `outstanding` is the state variable where you store the new outstanding balance
                                precision={2}
                              />

                              <Button
                                onClick={() => {
                                  // Handle submission
                                  // After submission, clear the currentOutstanding value
                                  handleUpdateOutstanding(o._id);
                                  setCurrentOutStanding("");
                                  setOutStanding("");
                                }}
                              >
                                Submit
                              </Button>
                            </Modal>

                            <Button
                              disabled={o.outstanding === 0} // Disable the button if outstanding is 0
                              onClick={() => openModal(o._id)}
                            >
                              Update
                            </Button>
                          </>
                        ) : (
                          <Button
                            disabled={o.outstanding === 0} // Disable the button if outstanding is 0
                            onClick={() => openModal(o._id)}
                          >
                            Update
                          </Button>
                        )}

                        {/* <TextInput
                          value={o.outstanding}
                          placeholder=""
                          label=" Sessions"
                          onChange={(event) => {
                            const newValue = event.currentTarget.value;
                            updateMutation.mutate({
                              id: o._id,
                              data: JSON.stringify({
                                outstanding: newValue,
                              }),
                              token: currentUser ? currentUser.token : "",
                            });
                          }}
                        />{" "} */}
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
                        {isAdmin && (
                          <HoverCard shadow="md">
                            <HoverCard.Target>
                              <Button
                                variant="subtle"
                                color="red"
                                radius="xl"
                                size="sm"
                                onClick={() => {
                                  deleteMutation.mutate({
                                    id: o._id,
                                    token: currentUser ? currentUser.token : "",
                                  });
                                }}
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
        <Space h="20px" />
      </Container>
    </>
  );
}
