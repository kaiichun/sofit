import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  Container,
  Title,
  Table,
  Group,
  Button,
  Image,
  Space,
  HoverCard,
  TextInput,
  Divider,
  Grid,
  Text,
  Select,
  LoadingOverlay,
} from "@mantine/core";
import { Checkbox } from "@mantine/core";
import { useNavigate, Link } from "react-router-dom";
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
import { fetchWages2 } from "../api/wage";

export default function Wages() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { isLoading, data: wages = [] } = useQuery({
    queryKey: ["wages"],
    queryFn: () => fetchWages2(currentUser ? currentUser.token : ""),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => fetchClients(id),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(currentUser ? currentUser.token : ""),
  });

  const handleDownloadPDF = (order) => {
    const doc = new jsPDF();
    const wage = wages.find((w) => w._id);
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

    doc.text(`PAYSLIP: ${order.payslipNo}`, 160, groupYPos);
    const paidDate = new Date(order.paid_at);
    const year = paidDate.getFullYear();
    const month = String(paidDate.getMonth() + 1).padStart(2, "0");
    const day = String(paidDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    doc.text(`Date: ${formattedDate}`, 160, groupYPos + 5);
    if (user && user.name) {
      doc.text(`Staff: ${user.name}`, 160, groupYPos + 10);
    }

    const group2YPos = 45;
    doc.text(`Name:`, 10, 50);
    doc.text(`Identity Card:`, 10, 55);
    doc.text(`Bank Name:`, 10, 60);
    doc.text(`Bank Name:`, 10, 65);

    doc.setFontSize(8);
    doc.text(`${order.name}`, 40, group2YPos + 5);
    doc.text(`${order.ic}`, 40, group2YPos + 10);
    doc.text(`${order.bankacc}`, 40, group2YPos + 15);
    doc.text(`${order.bankname}`, 40, group2YPos + 20);

    doc.setLineWidth(0.3);
    doc.line(10, 75, 200, 75);
    doc.line(10, 75, 10, 175);
    doc.line(10, 175, 200, 175);
    doc.line(200, 75, 200, 175);

    const group3YPos = 70;
    doc.text(`Bacis:`, 10, 75);
    doc.text(`Coaching Fee:`, 10, 80);
    doc.text(`Commission`, 10, 85);
    doc.text(`PMS:`, 10, 90);

    doc.setFontSize(8);
    doc.text(`${order.basic}`, 40, group3YPos + 5);
    doc.text(`${order.coachingFee}`, 40, group3YPos + 10);
    doc.text(`${order.commission}`, 40, group3YPos + 15);
    doc.text(`${order.totalpms}`, 40, group3YPos + 20);

    // Save the PDF
    doc.save(`invoice_${order.invoiceNo}.pdf`);
  };

  return (
    <>
      <Container size="100%">
        <Header title="My Orders" page="orders" />
        <Space h="35px" />
        {/* <LoadingOverlay visible={isLoading} /> */}
        <Table>
          <thead>
            <tr>
              <th>PaySlip No</th>
              <th>Staff Name</th>
              <th>Bacis</th>
              <th>Coaching Fee</th>
              <th>Commission</th>
              <th>EPF</th>
              <th>SOCSO</th>
              <th>EIS</th>
              <th>PCD</th>
              <th>Employer EPF</th>
              <th>Employer SOCSO</th>
              <th>EmployerEIS</th>
              <th>Total Income</th>
              <th>Nett Pay</th>
            </tr>
          </thead>
          <tbody>
            {wages
              ? wages.map((wage) => {
                  return (
                    <tr key={wage._id}>
                      <td>{wage.payslipNo}</td>
                      <td>{wage.name}</td>
                      <td>{wage.basic}</td>
                      <td>{wage.coachingFee}</td>
                      <td>{wage.commission}</td>
                      <td>{wage.epf}</td>
                      <td>{wage.socso}</td>
                      <td>{wage.eis}</td>
                      <td>{wage.pcd}</td>
                      <td>{wage.employerEpf}</td>
                      <td>{wage.employerSocso}</td>
                      <td>{wage.employerEis}</td>
                      <td>{wage.totalIncome}</td>
                      <td>{wage.nettPay}</td>
                      <td>
                        <HoverCard shadow="md">
                          <HoverCard.Target>
                            <Button
                              variant="subtle"
                              color="gray"
                              radius="xl"
                              size="sm"
                              onClick={() => handleDownloadPDF(wage)}
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
