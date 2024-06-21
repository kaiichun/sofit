import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
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
  ScrollArea,
  Text,
  Select,
  LoadingOverlay,
} from "@mantine/core";
import { useNavigate, Link } from "react-router-dom";
import Header from "../Header";
import { useParams } from "react-router-dom";
import { MdDownloadForOffline } from "react-icons/md";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useCookies } from "react-cookie";
import logo from "../Logo/sofit-black.png";
import { fetchUsers } from "../api/auth";
import { fetchWages2 } from "../api/wage";
import { MdOutlineMoneyOffCsred } from "react-icons/md";

export default function WagesAll() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(null); // Add state for selected branch
  const [currentWage, setCurrentWage] = useState([]);
  const { isLoading, data: wages = [] } = useQuery({
    queryKey: ["wages"],
    queryFn: () => fetchWages2(currentUser ? currentUser.token : ""),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(currentUser ? currentUser.token : ""),
  });

  const { data: branches = [] } = useQuery({
    queryKey: ["fetchB"],
    queryFn: () => fetchBranch(),
  });

  const currentUserBranch = useMemo(() => {
    return cookies?.currentUser?.branch;
  }, [cookies]);

  const isAdminBranch = useMemo(() => {
    return cookies?.currentUser?.role === "Admin Branch";
  }, [cookies]);

  const isAdminHQ = useMemo(() => {
    return cookies?.currentUser?.role === "Admin HQ";
  }, [cookies]);

  useEffect(() => {
    let newList = wages ? [...wages] : [];

    if (searchTerm) {
      newList = newList.filter(
        (i) =>
          i.name.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0 ||
          i.payslipNo.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0
      );
    }

    if (isAdminHQ && selectedBranch !== null) {
      newList = newList.filter((wage) => wage.branch === selectedBranch);
    } else if (isAdminBranch) {
      newList = newList.filter((wage) => wage.branch === currentUserBranch);
    }

    setCurrentWage(newList);
  }, [
    wages,
    searchTerm,
    selectedBranch,
    currentUserBranch,
    isAdminBranch,
    isAdminHQ,
  ]);
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

    doc.text(`PAYSLIP`, 160, groupYPos);
    doc.text(`: ${order.payslipNo}`, 173, groupYPos);

    // const paidDate = new Date(order.month);
    // const year = paidDate.getFullYear();
    // const month = String(paidDate.getMonth() + 1).padStart(2, "0");
    const formattedDate = `${order.year} / ${order.month}`;

    doc.text(`Date`, 160, groupYPos + 5);
    doc.text(`: ${formattedDate}`, 173, groupYPos + 5);
    doc.setFontSize(10);
    const group2YPos = 45;
    doc.text(`Name`, 12, 50);
    doc.text(`Identity Card`, 12, 55);
    doc.text(`Bank Name`, 12, 60);
    doc.text(`Bank Account`, 12, 65);

    doc.text(`: ${order.name}`, 40, group2YPos + 5);
    doc.text(`: ${order.ic}`, 40, group2YPos + 10);
    doc.text(`: ${order.bankname}`, 40, group2YPos + 15);
    doc.text(`: ${order.bankacc}`, 40, group2YPos + 20);

    doc.text(`EPF No`, 108, 50);
    doc.text(`SOSCO No`, 108, 55);
    doc.text(`: ${order.epfNo}`, 136, group2YPos + 5);
    doc.text(`: ${order.socsoNo}`, 136, group2YPos + 10);

    doc.setLineWidth(0.3);
    doc.line(10, 70, 200, 70);
    doc.line(10, 70, 10, 161);
    doc.line(105, 70, 105, 123);
    doc.line(10, 161, 200, 161);
    doc.line(200, 70, 200, 161);

    const group3YPos = 70;
    doc.setFont("bold");
    doc.text(`IMCOME`, 12, 75);
    doc.setFontSize(10);
    doc.text(`Salary`, 12, 85);
    doc.text(`Coaching Fee`, 12, 90);
    doc.text(`Commission`, 12, 95);
    doc.text(`Allowance`, 12, 100);
    doc.text(`Claims`, 12, 105);
    doc.text(`Bouns`, 12, 110);
    doc.setFont("bold");
    doc.text(`DEDUCTION`, 108, 75);
    doc.setFontSize(10);
    doc.text(`EPF`, 108, 85);
    doc.text(`SOSCO`, 108, 90);
    doc.text(`EIS`, 108, 95);
    doc.text(`PCB`, 108, 100);

    doc.setFont("bold");
    doc.text(`RM`, 86, group3YPos + 5);
    doc.setFontSize(10);
    doc.text(
      `${order.basic !== null ? order.basic.toFixed(2) : ""}`,
      86,
      group3YPos + 15
    );
    doc.text(
      `${order.coachingFee !== null ? order.coachingFee.toFixed(2) : ""}`,
      86,
      group3YPos + 20
    );
    doc.text(
      `${order.commission !== null ? order.commission.toFixed(2) : ""}`,
      86,
      group3YPos + 25
    );
    doc.text(
      `${order.allowance !== null ? order.allowance.toFixed(2) : ""}`,
      86,
      group3YPos + 30
    );
    doc.text(
      `${order.claims !== null ? order.claims.toFixed(2) : ""}`,
      86,
      group3YPos + 35
    );
    doc.text(
      `${order.totalpms !== null ? order.totalpms.toFixed(2) : ""}`,
      86,
      group3YPos + 40
    );
    doc.setFont("bold");
    doc.text(`RM`, 182, group3YPos + 5);
    doc.setFontSize(10);
    doc.text(
      `${order.epf !== null ? order.epf.toFixed(2) : ""}`,
      182,
      group3YPos + 15
    );
    doc.text(
      `${order.socso !== null ? order.socso.toFixed(2) : ""}`,
      182,
      group3YPos + 20
    );
    doc.text(
      `${order.eis !== null ? order.eis.toFixed(2) : ""}`,
      182,
      group3YPos + 25
    );
    doc.text(
      `${order.pcd !== null ? order.pcd.toFixed(2) : ""}`,
      182,
      group3YPos + 30
    );

    doc.line(10, 115, 200, 115);
    doc.setFont("bold");
    doc.text(`TOTAL INCOME`, 12, 120);
    doc.text(
      `${order.totalIncome !== null ? order.totalIncome.toFixed(2) : ""}`,
      86,
      120
    );
    doc.text(`TOTAL DEDUCTION`, 108, 120);
    doc.text(
      `${order.totalDeduction !== null ? order.totalDeduction.toFixed(2) : ""}`,
      182,
      120
    );
    doc.line(10, 123, 200, 123);
    doc.setFont("bold");
    doc.text(`CONTRIBUTION`, 12, 128);
    doc.text(`EMPLOYER'S`, 150, 128);
    doc.text(`EMPLOYEE'S`, 176, 128);
    doc.setFontSize(10);
    doc.text(`EPF`, 12, 138);
    doc.text(`SOCSO`, 12, 143);
    doc.text(`EIS`, 12, 148);
    doc.text(
      `${order.employerEpf !== null ? order.employerEpf.toFixed(2) : ""}`,
      150,
      138
    );
    doc.text(
      `${order.employerSocso !== null ? order.employerSocso.toFixed(2) : ""}`,
      150,
      143
    );
    doc.text(
      `${order.employerEis !== null ? order.employerEis.toFixed(2) : ""}`,
      150,
      148
    );
    doc.text(`${order.epf !== null ? order.epf.toFixed(2) : ""}`, 176, 138);
    doc.text(`${order.socso !== null ? order.socso.toFixed(2) : ""}`, 176, 143);
    doc.text(`${order.eis !== null ? order.eis.toFixed(2) : ""}`, 176, 148);

    doc.line(10, 153, 200, 153);
    doc.text(`NETT PAY (RM)`, 108, 158);
    doc.text(
      `${order.nettPay !== null ? order.nettPay.toFixed(2) : ""}`,
      176,
      158
    );
    doc.line(10, 161, 200, 161);

    // Save the PDF
    doc.save(`payslip_${order.payslipNo}.pdf`);
  };

  return (
    <>
      <Container size="100%">
        <LoadingOverlay visible={isLoading} />
        <Group position="right" mb="lg">
          <Button
            color="bule"
            radius="md"
            size="xs"
            component={Link}
            to={`/wage`}
          >
            Back
          </Button>
          <TextInput
            w="200px"
            value={searchTerm}
            placeholder="Search"
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          {isAdminHQ && (
            <Select
              placeholder="Select branch"
              value={selectedBranch}
              onChange={setSelectedBranch}
              data={[
                { value: null, label: "All Branches" },
                ...branches.map((branch) => ({
                  value: branch._id,
                  label: branch.branch,
                })),
              ]}
              clearable
            />
          )}
        </Group>
        <Space h="5px" />
        <Table>
          <thead>
            <tr>
              <th>PaySlip No</th>
              <th>Staff Name</th>
              <th>Basic</th>
              <th>Coaching Fee</th>
              <th>Commission</th>
              <th>Total Income</th>
              <th>Total Deduction</th>
              <th>Nett Pay</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {currentWage.length > 0 ? (
              currentWage.map((wage) => (
                <tr key={wage._id}>
                  <td>{wage.payslipNo}</td>
                  <td>{wage.name}</td>
                  <td>
                    {wage.basic !== undefined ? wage.basic.toFixed(2) : ""}
                  </td>
                  <td>
                    {wage.coachingFee !== undefined
                      ? wage.coachingFee.toFixed(2)
                      : ""}
                  </td>
                  <td>
                    {wage.commission !== undefined
                      ? wage.commission.toFixed(2)
                      : ""}
                  </td>
                  <td>
                    {wage.totalIncome !== undefined
                      ? wage.totalIncome.toFixed(2)
                      : ""}
                  </td>
                  <td>
                    {wage.totalDeduction !== undefined
                      ? wage.totalDeduction.toFixed(2)
                      : ""}
                  </td>
                  <td>
                    {wage.nettPay !== undefined ? wage.nettPay.toFixed(2) : ""}
                  </td>
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
                        <Text size="sm">Payslip</Text>
                      </HoverCard.Dropdown>
                    </HoverCard>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  <div>
                    <Space h="105px" />
                    <Group position="center">
                      <MdOutlineMoneyOffCsred
                        style={{
                          width: "40px",
                          height: "40px",
                          margin: "15",
                        }}
                      />
                    </Group>
                    <Text align="center" size="lg" fw={700}>
                      No Wage Available
                    </Text>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
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
              to={"/wage-add"}
            >
              +
            </Button>
          </div>
        </Group>
      </Container>
    </>
  );
}
