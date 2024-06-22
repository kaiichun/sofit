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
  NumberInput,
  Grid,
  Title,
  Group,
  ScrollArea,
  Select,
  Modal,
} from "@mantine/core";
import { Pagination } from "@mantine/core";

import { notifications } from "@mantine/notifications";
import { useParams } from "react-router-dom";
import { MdDownloadForOffline, MdDelete } from "react-icons/md";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../Logo/sofit-black.png";
import { useCookies } from "react-cookie";
import { fetchClients } from "../api/client";
import { fetchUsers, fetchBranch } from "../api/auth";
import {
  deleteOrderPackage,
  fetchOrderPackages,
  updateOrderPackage,
} from "../api/orderspackage";
import HeaderClient from "../HeaderClient";
import { Line, Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { openConfirmModal } from "@mantine/modals";
import HeaderData from "../HeaderData";

export default function DataAnalysisPackages() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const { id } = useParams();
  const queryClient = useQueryClient();
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

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(currentUser ? currentUser.token : ""),
  });

  const { data: branchs = [] } = useQuery({
    queryKey: ["branches"],
    queryFn: () => fetchBranch(),
  });

  const currentUserBranch = useMemo(() => {
    return cookies?.currentUser?.branch;
  }, [cookies]);

  const isAdminHQ = useMemo(() => {
    return cookies?.currentUser?.role === "Admin HQ";
  }, [cookies]);

  const isAdminBranch = useMemo(() => {
    return cookies?.currentUser?.role === "Admin Branch";
  }, [cookies]);

  const currentMonth = new Date().getMonth() + 1; // Current month (1-based)
  const currentYear = new Date().getFullYear(); // Current year
  const [selectedBranch, setSelectedBranch] = useState(currentUserBranch);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedChartType, setSelectedChartType] = useState("bar");

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
        title: "Outstanding Updated",
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

  const getDayOptions = (month, year) => {
    const daysInMonth = new Date(year, month, 0).getDate(); // Get number of days in selected month
    const options = Array.from({ length: daysInMonth }, (_, i) => ({
      value: (i + 1).toString(),
      label: (i + 1).toString(),
    }));
    return options;
  };

  const filteredOrders = useMemo(() => {
    let filtered = orderspackage || [];

    if (isAdminHQ && selectedBranch) {
      filtered = filtered.filter((order) => {
        const user = users.find((user) => user._id === order.user);
        return user && user.branch === selectedBranch;
      });
    } else if (isAdminBranch) {
      filtered = filtered.filter((order) => {
        const user = users.find((user) => user._id === order.user);
        return user && user.branch === currentUserBranch;
      });
    } else {
      filtered = filtered.filter((order) => order.user === currentUser._id);
    }

    if (selectedMonth) {
      filtered = filtered.filter(
        (order) =>
          new Date(order.paid_at).getMonth() + 1 === parseInt(selectedMonth)
      );
    }

    if (selectedYear) {
      filtered = filtered.filter(
        (order) =>
          new Date(order.paid_at).getFullYear() === parseInt(selectedYear)
      );
    }

    if (selectedDay) {
      filtered = filtered.filter(
        (order) => new Date(order.paid_at).getDate() === parseInt(selectedDay)
      );
    }

    return filtered;
  }, [
    orderspackage,
    users,
    currentUser,
    currentUserBranch,
    selectedBranch,
    selectedDay,
    selectedMonth,
    selectedYear,
    isAdminHQ,
    isAdminBranch,
  ]);

  const productOrderData = useMemo(() => {
    const productOrderCount = {};

    filteredOrders.forEach((order) => {
      order.packages.forEach((pack) => {
        if (productOrderCount[pack.sofitpackage]) {
          productOrderCount[pack.sofitpackage] += 1;
        } else {
          productOrderCount[pack.sofitpackage] = 1;
        }
      });
    });

    const sortedProducts = Object.entries(productOrderCount).sort(
      ([, countA], [, countB]) => countB - countA
    );

    const labels = sortedProducts.map(([packageName]) => packageName);
    const data = sortedProducts.map(([, count]) => count);

    return {
      labels,
      datasets: [
        {
          label: "Product Orders",
          data,
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(199, 199, 199, 0.6)",
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(199, 199, 199, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [filteredOrders]);

  const chartData = useMemo(() => {
    if (selectedYear && selectedMonth && selectedDay) {
      const dailyOrders = filteredOrders.filter(
        (order) => new Date(order.paid_at).getDate() === parseInt(selectedDay)
      );

      if (dailyOrders.length === 0) {
        return {
          labels: [],
          datasets: [],
        };
      }

      const labels = dailyOrders.map((order, index) => {
        const client = clients.find((client) => client._id === order.clientId);
        const clientName = client ? client.clientName : "Unknown Client";
        return `${clientName} (Order ${index + 1})`;
      });
      const totalPrices = dailyOrders.map((order) => order.totalPrice);
      const outstandingPrices = dailyOrders.map((order) => order.outstanding);

      return {
        labels,
        datasets: [
          {
            label: `Total Price for ${selectedDay}/${selectedMonth}/${selectedYear}`,
            data: totalPrices,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: `Outstanding Price for ${selectedDay}/${selectedMonth}/${selectedYear}`,
            data: outstandingPrices,
            backgroundColor: "rgba(255, 99, 132, 0.6)", // Different color for outstanding
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      };
    }

    if (selectedYear && selectedMonth) {
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate(); // Get number of days in selected month
      const dailyTotals = Array(daysInMonth).fill(0); // Initialize array to hold daily totals
      const dailyOutstandingTotals = Array(daysInMonth).fill(0); // Initialize array to hold daily outstanding totals

      filteredOrders.forEach((order) => {
        const orderDate = new Date(order.paid_at);
        const orderDay = orderDate.getDate() - 1; // Get day of the month (0-indexed)
        dailyTotals[orderDay] += order.totalPrice; // Accumulate total amount for each day
        dailyOutstandingTotals[orderDay] += order.outstanding; // Accumulate outstanding amount for each day
      });

      const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1); // Create labels for each day (1-indexed)
      const backgroundColors = Array.from(
        { length: daysInMonth },
        () =>
          `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
            Math.random() * 256
          )}, ${Math.floor(Math.random() * 256)}, 0.6)`
      );

      return {
        labels,
        datasets: [
          {
            label: `Total Sales in ${selectedMonth}/${selectedYear}`,
            data: dailyTotals,
            backgroundColor: backgroundColors,
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: `Total Outstanding in ${selectedMonth}/${selectedYear}`,
            data: dailyOutstandingTotals,
            backgroundColor: "rgba(255, 99, 132, 0.6)", // Different color for outstanding
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      };
    } else {
      return {
        labels: [],
        datasets: [],
      };
    }
  }, [filteredOrders, selectedDay, selectedMonth, selectedYear]);

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
    // if (user && user.name) {
    //   doc.text(`Staff: ${user.name}`, 160, groupYPos + 10);
    // }
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
    doc.text(`Discount:`, 140, 208);
    doc.text(
      `${order.discount ? order.discount.toFixed(2) : "0.00"}`,
      182.3,
      208
    );
    doc.text(`Total Price:`, 140, 213);
    doc.text(
      `${order.totalPrice ? order.totalPrice.toFixed(2) : "0.00"}`,
      182.3,
      213
    );
    // doc.text(`Service Tax (8%) :`, 140, 208);
    // doc.text(`${order.tax.toFixed(2)}`, 184.2, 208);
    // doc.text(`Total Price:`, 140, 213);
    // doc.text(`${order.totalPrice.toFixed(2)}`, 182.3, 213);

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

  const chartTypeOptions = [
    { value: "line", label: "Line" },
    { value: "bar", label: "Bar" },
    { value: "pie", label: "Pie" },
  ];

  return (
    <Container size="100%">
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      <HeaderData title="Packages" page="Packages" />
      <Space h="xl" />
      <Title align="center">Packages Sales Data</Title>
      <Space h="xl" />
      <Grid>
        <Grid.Col span={9}></Grid.Col>
        <Grid.Col span={3}>
          <Select
            label="Chart Type"
            placeholder="Select chart type"
            value={selectedChartType}
            onChange={setSelectedChartType}
            data={chartTypeOptions}
          />
        </Grid.Col>
        {isAdminHQ && (
          <Grid.Col span={3}>
            <Select
              label="Branch"
              placeholder="Select branch"
              value={selectedBranch}
              onChange={setSelectedBranch}
              data={branchs.map((branch) => ({
                value: branch._id,
                label: branch.branch,
              }))}
              disabled={!isAdminHQ}
            />
          </Grid.Col>
        )}
        <Grid.Col span={3} md={3}>
          <Select
            label="Month"
            placeholder="Select month"
            value={selectedMonth}
            onChange={setSelectedMonth}
            data={[
              { value: "1", label: "January" },
              { value: "2", label: "February" },
              { value: "3", label: "March" },
              { value: "4", label: "April" },
              { value: "5", label: "May" },
              { value: "6", label: "June" },
              { value: "7", label: "July" },
              { value: "8", label: "August" },
              { value: "9", label: "September" },
              { value: "10", label: "October" },
              { value: "11", label: "November" },
              { value: "12", label: "December" },
            ]}
          />
        </Grid.Col>
        <Grid.Col span={3} md={3}>
          <Select
            label="Year"
            placeholder="Select year"
            value={selectedYear}
            onChange={setSelectedYear}
            data={Array.from(
              { length: new Date().getFullYear() - 2020 + 1 },
              (_, index) => {
                const year = 2020 + index;
                return { value: year.toString(), label: year.toString() };
              }
            )}
          />
        </Grid.Col>
        <Grid.Col span={3} md={3}>
          <Select
            label="Day"
            placeholder="Select day"
            value={selectedDay}
            onChange={setSelectedDay}
            data={getDayOptions(selectedMonth, selectedYear)}
            clearable
          />
        </Grid.Col>
      </Grid>

      <Space h="lg" />
      <Title order={2}>Package SalesChart</Title>
      <Space h="md" />
      {chartData.labels.length === 0 ? (
        <Group position="center">
          <Title order={5} mt="lg">
            - No data found -
          </Title>
        </Group>
      ) : (
        <>
          {selectedChartType === "line" && <Line data={chartData} />}
          {selectedChartType === "bar" && <Bar data={chartData} />}
          {selectedChartType === "pie" && <Pie data={chartData} />}
        </>
      )}
      <Space h="md" />
      <Title order={2}>Product OrdersChart</Title>
      <Space h="md" />
      {chartData.labels.length === 0 ? (
        <Group position="center">
          <Title order={5} mt="lg">
            - No data found -
          </Title>
        </Group>
      ) : (
        <>
          {" "}
          {selectedChartType === "line" && <Line data={productOrderData} />}
          {selectedChartType === "bar" && <Bar data={productOrderData} />}
          {selectedChartType === "pie" && <Pie data={productOrderData} />}
        </>
      )}
      <Space h="xl" />
      <Space h="xl" />
      <ScrollArea>
        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Member Details</th>
              <th>Package</th>
              <th>Amount</th>
              <th>Pay By</th>
              <th>Payment Method</th>
              <th>Installment Month</th>
              <th>Monthly Payment</th>
              <th>Outstanding</th>
              <th>Update</th>
              <th>Sales Date</th>
              <th>Sales By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders
                .slice((currentPage - 1) * perPage, currentPage * perPage)
                .map((order) => {
                  const client = clients.find(
                    (client) => client._id === order.clientId
                  );
                  const orderUser = users.find(
                    (user) => user._id === order.staffId
                  );
                  const paidDate = new Date(order.paid_at);

                  // Get day, month, and year
                  const day = paidDate.getDate().toString().padStart(2, "0"); // Add leading zero if needed
                  const month = (paidDate.getMonth() + 1)
                    .toString()
                    .padStart(2, "0"); // Add leading zero if needed
                  const year = paidDate.getFullYear();

                  // Format as DD MM YYYY
                  const formattedDate = `${day}-${month}-${year}`;
                  return (
                    <tr key={order._id}>
                      <td>{order.invoiceNo}</td>
                      <td>{client ? client.clientName : "Unknown Client"}</td>

                      <td>
                        {order.packages.map((p, index) => (
                          <div key={index}>
                            <p>{p.sofitpackage}</p>
                          </div>
                        ))}
                      </td>
                      <td>MYR {order.totalPrice.toFixed(2)}</td>
                      <td>{order.payby}</td>
                      <td>{order.paymentMethod}</td>
                      <td>
                        {order.installmentMonth ? order.installmentMonth : "-"}
                      </td>
                      <td>
                        {order.installmentAmount
                          ? order.installmentAmount.toFixed(2)
                          : "0.00"}
                      </td>
                      <td>
                        {order.outstanding
                          ? order.outstanding.toFixed(2)
                          : "0.00"}
                      </td>
                      <td>
                        {order.outstanding ? (
                          <>
                            <Modal
                              opened={openedOrderId === order._id}
                              onClose={closeModal}
                              title="Outstanding Update"
                            >
                              <NumberInput
                                label="Balance"
                                value={order.outstanding}
                                placeholder={order.outstanding}
                                precision={2}
                                onChange={(value) => setOutStanding(value)}
                                readOnly
                              />

                              <NumberInput
                                label="Payment"
                                value={currentOutstanding}
                                precision={2}
                                onChange={(value) => {
                                  const newOutstanding =
                                    parseFloat(order.outstanding) -
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
                                  handleUpdateOutstanding(order._id);
                                  setCurrentOutStanding("");
                                  setOutStanding("");
                                }}
                              >
                                Submit
                              </Button>
                            </Modal>

                            <Button
                              disabled={order.outstanding === 0} // Disable the button if outstanding is 0
                              onClick={() => openModal(order._id)}
                            >
                              Update
                            </Button>
                          </>
                        ) : (
                          <Button
                            disabled={order.outstanding === 0} // Disable the button if outstanding is 0
                            onClick={() => openModal(order._id)}
                          >
                            Update
                          </Button>
                        )}
                      </td>
                      <td>{formattedDate}</td>
                      <td> {orderUser && orderUser.name}</td>
                      <td>
                        <HoverCard shadow="md">
                          <HoverCard.Target>
                            <Button
                              variant="subtle"
                              color="gray"
                              radius="xl"
                              size="sm"
                              onClick={() => handleDownloadPDF(order)}
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
                                onClick={() => handleDeleteClick(order._id)}
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
            ) : (
              <tr>
                <td colSpan="12">
                  <Space h={100} />
                  <Text align="center">No orders found</Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>
      <Space h="md" />
      <Pagination
        page={currentPage}
        onChange={setCurrentPage}
        total={Math.ceil(filteredOrders.length / perPage)}
      />
    </Container>
  );
}
