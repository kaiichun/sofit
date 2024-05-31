import { useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  Container,
  Space,
  TextInput,
  Card,
  Button,
  Select,
  Group,
  Grid,
  Radio,
  Textarea,
  NativeSelect,
  Text,
  Title,
  Avatar,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { getClients, updateClient } from "../api/client";
import sofitLogo from "../Logo/sofit-black.png";
import { MdUpload } from "react-icons/md";
import { fetchUsers } from "../api/auth";

const ClientEdit = () => {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const { id } = useParams();
  const navigate = useNavigate();
  const [coachId, setcoachId] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientGender, setClientGender] = useState("Male");
  const [clientIc, setClientIc] = useState();
  const [clientHeight, setClientHeight] = useState("");
  const [clientWeight, setClientWeight] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhonenumber, setClientPhonenumber] = useState();
  const [clientEmergencycontactname, setClientEmergencycontactname] =
    useState();
  const [clientEmergencycontact, setClientEmergencycontact] = useState();
  const [clientAddress1, setClientAddress1] = useState();
  const [clientAddress2, setClientAddress2] = useState();
  const [clientZip, setClientZip] = useState();
  const [clientState, setClientState] = useState("Selangor");
  const [exeQ1, setExeQ1] = useState("");
  const [exeQ2, setExeQ2] = useState("");
  const [exeQ3a, setExeQ3a] = useState("");
  const [exeQ3b, setExeQ3b] = useState("");
  const [exeQ3c, setExeQ3c] = useState("");
  const [exeQ3d, setExeQ3d] = useState("");
  const [dietQ1, setDietQ1] = useState("");
  const [dietQ2, setDietQ2] = useState("");
  const [dietQ3, setDietQ3] = useState("");
  const [dietQ4, setDietQ4] = useState("");
  const [dietQ5, setDietQ5] = useState("");
  const [dietQ6, setDietQ6] = useState("");
  const [dietQ7, setDietQ7] = useState("");
  const [dietQ8, setDietQ8] = useState("");
  const [lifeQ1, setLifeQ1] = useState("");
  const [lifeQ2, setLifeQ2] = useState("");
  const [lifeQ3, setLifeQ3] = useState("");
  const [lifeQ4, setLifeQ4] = useState("");
  const [occupationQ1, setOccupationQ1] = useState("");
  const [occupationQ2, setOccupationQ2] = useState("");
  const [occupationQ3, setOccupationQ3] = useState("");
  const [occupationQ4, setOccupationQ4] = useState("");
  const [rQ1, setRQ1] = useState();
  const [rQ2, setRQ2] = useState();
  const [medQ1, setMedQ1] = useState();
  const [medQ2, setMedQ2] = useState();
  const [medQ3, setMedQ3] = useState();
  const [medQ4, setMedQ4] = useState();
  const [medQ5, setMedQ5] = useState();
  const [addNote, setAddNote] = useState();
  const [packageValidityPeriod, setPackageValidityPeriod] = useState();
  const [clientPackage, setClientPackage] = useState("");

  const [visible, { toggle }] = useDisclosure(false);
  const { isLoading } = useQuery({
    queryKey: ["videos", id],
    queryFn: () => getClients(id),
    onSuccess: (data) => {
      setClientName(data.clientName);
      setClientGender(data.clientGender);
      setClientIc(data.clientIc);
      setClientHeight(data.clientHeight);
      setClientWeight(data.clientWeight);
      setClientEmail(data.clientEmail);
      setClientPhonenumber(data.clientPhonenumber);
      setClientEmergencycontact(data.clientEmergencycontact);
      setClientEmergencycontactname(data.clientEmergencycontactname);
      setClientAddress1(data.clientAddress1);
      setClientAddress2(data.clientAddress2);
      setClientZip(data.clientZip);
      setClientState(data.clientState);
      setExeQ1(data.exeQ1);
      setExeQ2(data.exeQ2);
      setExeQ3a(data.exeQ3a);
      setExeQ3b(data.exeQ3b);
      setExeQ3c(data.exeQ3c);
      setExeQ3d(data.exeQ3d);
      setDietQ1(data.dietQ1);
      setDietQ2(data.dietQ2);
      setDietQ3(data.dietQ3);
      setDietQ4(data.dietQ4);
      setDietQ5(data.dietQ5);
      setDietQ6(data.dietQ6);
      setDietQ7(data.dietQ7);
      setDietQ8(data.dietQ8);
      setLifeQ1(data.lifeQ1);
      setLifeQ2(data.lifeQ2);
      setLifeQ3(data.lifeQ3);
      setLifeQ4(data.lifeQ4);
      setOccupationQ1(data.occupationQ1);
      setOccupationQ2(data.occupationQ2);
      setOccupationQ3(data.occupationQ3);
      setOccupationQ4(data.occupationQ4);
      setRQ1(data.rQ1);
      setRQ2(data.rQ2);
      setMedQ1(data.medQ1);
      setMedQ2(data.medQ2);
      setMedQ3(data.medQ3);
      setMedQ4(data.medQ4);
      setMedQ5(data.medQ5);
      setAddNote(data.addNote);
      setcoachId(data.coachId);
    },
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });

  const selectedUserName =
    coachId && users ? users.find((c) => c._id === coachId)?.name || "" : "-";

  const updateMutation = useMutation({
    mutationFn: updateClient,
    onSuccess: () => {
      // show add success message
      // 显示添加成功消息
      notifications.show({
        title: "Client info updated successfully",
        color: "green",
      });

      navigate("/clients");
    },
    onError: (error) => {
      console.log(error);
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleUpdateClient = async (event) => {
    // 阻止表单默认提交行为
    event.preventDefault();
    // 使用updateMutation mutation来更新商品信息
    updateMutation.mutate({
      id: id,
      data: JSON.stringify({
        clientName: clientName,
        clientGender: clientGender,
        clientIc: clientIc,
        clientHeight: clientHeight,
        clientWeight: clientWeight,
        clientEmail: clientEmail,
        clientPhonenumber: clientPhonenumber,
        clientEmergencycontactname: clientEmergencycontactname,
        clientEmergencycontact: clientEmergencycontact,
        clientAddress1: clientAddress1,
        clientAddress2: clientAddress2,
        clientZip: clientZip,
        clientState: clientState,
        exeQ1: exeQ1,
        exeQ2: exeQ2,
        exeQ3a: exeQ3a,
        exeQ3b: exeQ3b,
        exeQ3c: exeQ3c,
        exeQ3d: exeQ3d,
        dietQ1: dietQ1,
        dietQ2: dietQ2,
        dietQ3: dietQ3,
        dietQ4: dietQ4,
        dietQ5: dietQ5,
        dietQ6: dietQ6,
        dietQ7: dietQ7,
        dietQ8: dietQ8,
        lifeQ1: lifeQ1,
        lifeQ2: lifeQ2,
        lifeQ3: lifeQ3,
        lifeQ4: lifeQ4,
        occupationQ1: occupationQ1,
        occupationQ2: occupationQ2,
        occupationQ3: occupationQ3,
        occupationQ4: occupationQ4,
        rQ1: rQ1,
        rQ2: rQ2,
        medQ1: medQ1,
        medQ2: medQ2,
        medQ3: medQ3,
        medQ4: medQ4,
        medQ5: medQ5,
        addNote: addNote,
        packageValidityPeriod: packageValidityPeriod,
        clientPackage: clientPackage,
        coachId: coachId,
        coachName: selectedUserName,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };

  return (
    <Container>
      <Space h="120px" />
      <Card
        withBorder
        p="20px"
        mx="auto"
        sx={{
          maxWidth: "800px",
        }}
      >
        <Space h="20px" />
        <Group position="center">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Avatar
              src={sofitLogo}
              style={{ width: "90px", height: "90px" }}
            ></Avatar>
          </Link>
        </Group>
        <Title order={4} align="center">
          Add a new Client
        </Title>
        <Text align="center" order={6}>
          Enter all details
        </Text>
        <Space h="20px" />
        <Grid grow gutter="xs">
          <Grid.Col span={4}>
            <TextInput
              value={clientName}
              placeholder="Name"
              label="Full Name"
              onChange={(event) => setClientName(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NativeSelect
              data={["Male", "Female"]}
              label="Gender"
              value={clientGender}
              onChange={(event) => setClientGender(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              value={clientIc}
              placeholder="000000-00-00"
              label="Identity Card No"
              onChange={(event) => setClientIc(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              value={clientHeight}
              placeholder="180"
              label="Height(cm)"
              onChange={(event) => setClientHeight(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              value={clientWeight}
              placeholder="60"
              label="Weight(kg)"
              onChange={(event) => setClientWeight(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              value={clientEmail}
              placeholder="example@sofit.com.my"
              label="Email"
              onChange={(event) => setClientEmail(event.target.value)}
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <TextInput
              value={clientPhonenumber}
              placeholder="+6012-3456789"
              label="Phone Number"
              onChange={(event) => setClientPhonenumber(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              value={clientEmergencycontactname}
              placeholder="XXX"
              label="Emergency Contact Name"
              onChange={(event) =>
                setClientEmergencycontactname(event.target.value)
              }
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              value={clientEmergencycontact}
              placeholder="+6012-3456789"
              label="Emergency Contact Number"
              onChange={(event) =>
                setClientEmergencycontact(event.target.value)
              }
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Address 1"
              value={clientAddress1}
              onChange={(event) => setClientAddress1(event.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Address 2"
              value={clientAddress2}
              onChange={(event) => {
                const newValue = event.currentTarget.value || "-";
                setClientAddress2(newValue);
              }}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              label="Zip"
              value={clientZip}
              onChange={(event) => setClientZip(event.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NativeSelect
              data={[
                "Selangor",
                "Perak",
                "Pahang",
                "Pulau Pinang",
                "Perlis",
                "Kelantan",
                "Kedah",
                "Johor",
                "Melaka",
                "Negeri Sembilan",
                "Terengganu",
                "W.P.Labuan",
                "W.P.Kualu Lumpur",
                "Sabah",
                "Sarawak",
              ]}
              label="State"
              value={clientState}
              placeholder=""
              onChange={(event) => setClientState(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <>
              <Space h={15} />
              <hr color="gray" />
              <Space h={15} />
              <Group position="center">
                <Text fw={900} fz="xl">
                  Lifestyle and Health History Questionnaire
                </Text>
              </Group>
              <Space h={15} />
              <Text fw={700} td="underline">
                Exercise
              </Text>
            </>
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              value={exeQ1}
              placeholder="1000"
              label="1. What exercise activities do you currently take part in (e.g., running, weightlifting, group exercise, etc.)?"
              onChange={(event) => setExeQ1(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              value={exeQ2}
              placeholder="1000"
              label="2. How many days per week do you get at least 60 minutes of moderate-intensity exercise?"
              onChange={(event) => setExeQ2(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Text>
              3. On a scale of 0 to 10, how important are the following fitness
              goals to you?
            </Text>
          </Grid.Col>
          <Grid.Col span={12}>
            <Radio.Group
              value={exeQ3a}
              onChange={setExeQ3a}
              label="Weight loss:"
            >
              <Group mt={5}>
                <Radio value="1" label="1" />
                <Radio value="2" label="2" />
                <Radio value="3" label="3" />
                <Radio value="4" label="4" />
                <Radio value="5" label="5" />
                <Radio value="6" label="6" />
                <Radio value="7" label="7" />
                <Radio value="8" label="8" />
                <Radio value="9" label="9" />
                <Radio value="10" label="10" />
              </Group>
            </Radio.Group>
          </Grid.Col>
          <Grid.Col span={12}>
            <Radio.Group
              value={exeQ3b}
              onChange={setExeQ3b}
              label="Muscle gain:"
            >
              <Group mt={5}>
                <Radio value="1" label="1" />
                <Radio value="2" label="2" />
                <Radio value="3" label="3" />
                <Radio value="4" label="4" />
                <Radio value="5" label="5" />
                <Radio value="6" label="6" />
                <Radio value="7" label="7" />
                <Radio value="8" label="8" />
                <Radio value="9" label="9" />
                <Radio value="10" label="10" />
              </Group>
            </Radio.Group>
          </Grid.Col>
          <Grid.Col span={12}>
            <Radio.Group
              value={exeQ3c}
              onChange={setExeQ3c}
              label="Sports performance:"
            >
              <Group mt={5}>
                <Radio value="1" label="1" />
                <Radio value="2" label="2" />
                <Radio value="3" label="3" />
                <Radio value="4" label="4" />
                <Radio value="5" label="5" />
                <Radio value="6" label="6" />
                <Radio value="7" label="7" />
                <Radio value="8" label="8" />
                <Radio value="9" label="9" />
                <Radio value="10" label="10" />
              </Group>
            </Radio.Group>
          </Grid.Col>
          <Grid.Col span={12}>
            <Radio.Group
              value={exeQ3d}
              onChange={setExeQ3d}
              label="Health improvement:"
            >
              <Group mt={5}>
                <Radio value="1" label="1" />
                <Radio value="2" label="2" />
                <Radio value="3" label="3" />
                <Radio value="4" label="4" />
                <Radio value="5" label="5" />
                <Radio value="6" label="6" />
                <Radio value="7" label="7" />
                <Radio value="8" label="8" />
                <Radio value="9" label="9" />
                <Radio value="10" label="10" />
              </Group>
            </Radio.Group>
          </Grid.Col>
          <Grid.Col span={12}>
            <Text fw={700} td="underline">
              Diet
            </Text>
          </Grid.Col>
          <Grid.Col span={12}>
            <Radio.Group
              value={dietQ1}
              onChange={setDietQ1}
              label="1. On a scale of 0 to 10, do you consider your overall diet to be healthy?"
            >
              <Group mt={5}>
                <Radio value="1" label="1" />
                <Radio value="2" label="2" />
                <Radio value="3" label="3" />
                <Radio value="4" label="4" />
                <Radio value="5" label="5" />
                <Radio value="6" label="6" />
                <Radio value="7" label="7" />
                <Radio value="8" label="8" />
                <Radio value="9" label="9" />
                <Radio value="10" label="10" />
              </Group>
            </Radio.Group>
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              value={dietQ2}
              placeholder=""
              label="2. Are you currently following any kind of diet? If so, what diet and for what reason(s)?"
              onChange={(event) => setDietQ2(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Radio.Group
              value={dietQ3}
              onChange={setDietQ3}
              label="3. How would you rank your daily salt intake:"
            >
              <Group mt={5}>
                <Radio value="Low" label="Low" />
                <Radio value="Medium" label="Medium" />
                <Radio value="High" label="High" />
              </Group>
            </Radio.Group>
          </Grid.Col>
          <Grid.Col span={12}>
            <Radio.Group
              value={dietQ4}
              onChange={setDietQ4}
              label="4. How would you rank your daily sugar intake:"
            >
              <Group mt={5}>
                <Radio value="Low" label="Low" />
                <Radio value="Medium" label="Medium" />
                <Radio value="High" label="High" />
              </Group>
            </Radio.Group>
          </Grid.Col>
          <Grid.Col span={12}>
            <Radio.Group
              value={dietQ5}
              onChange={setDietQ5}
              label="5. How would you rank your daily fat intake:"
            >
              <Group mt={5}>
                <Radio value="Low" label="Low" />
                <Radio value="Medium" label="Medium" />
                <Radio value="High" label="High" />
              </Group>
            </Radio.Group>
          </Grid.Col>
          <Grid.Col span={12}>
            <Radio.Group
              value={dietQ6}
              onChange={setDietQ6}
              label="6. On a scale of 0 to 10, do you consider your overall diet to be healthy?"
            >
              <Group mt={5}>
                <Radio value="1" label="1" />
                <Radio value="2" label="2" />
                <Radio value="3" label="3" />
                <Radio value="4" label="4" />
                <Radio value="5" label="5" />
                <Radio value="6" label="6" />
                <Radio value="7" label="7" />
                <Radio value="8" label="8" />
                <Radio value="9" label="9" />
                <Radio value="10" label="10" />
              </Group>
            </Radio.Group>
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              value={dietQ7}
              placeholder=""
              label="7. How many alcoholic drinks do you consume per week?"
              onChange={(event) => setDietQ7(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              value={dietQ8}
              placeholder=""
              label="8.Do you consume caffeinated beverages such as coffee, tea, soda, and/or energy drinks? How many per week?"
              onChange={(event) => setDietQ8(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Text fw={700} td="underline">
              LifeStyle
            </Text>
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              value={lifeQ1}
              placeholder=""
              label="1. Do you feel like you get enough sleep and wake up feeling rested each day?"
              onChange={(event) => setLifeQ1(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Radio.Group
              value={lifeQ2}
              onChange={setLifeQ2}
              label="2. On a scale of 0 to 10, how would you rate your average level of stress?"
            >
              <Group mt={5}>
                <Radio value="1" label="1" />
                <Radio value="2" label="2" />
                <Radio value="3" label="3" />
                <Radio value="4" label="4" />
                <Radio value="5" label="5" />
                <Radio value="6" label="6" />
                <Radio value="7" label="7" />
                <Radio value="8" label="8" />
                <Radio value="9" label="9" />
                <Radio value="10" label="10" />
              </Group>
            </Radio.Group>
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              value={lifeQ3}
              placeholder=""
              label="3. What techniques do you currently use to manage your stress levels?"
              onChange={(event) => setLifeQ3(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              value={lifeQ4}
              placeholder=""
              label="4. Do you smoke tobacco or use a vaporizer alternative?"
              onChange={(event) => setLifeQ4(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Text fw={700} td="underline">
              Occupation
            </Text>
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              value={occupationQ1}
              placeholder=""
              label="1. What is your occupation?"
              onChange={(event) => setOccupationQ1(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              value={occupationQ2}
              placeholder=""
              label="2. Does your occupation require extended periods of sitting? (If YES, please explain.)"
              onChange={(event) => setOccupationQ2(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              value={occupationQ3}
              placeholder=""
              label="3. Does your occupation require repetitive movements? (If YES, please explain.)"
              onChange={(event) => setOccupationQ3(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              value={occupationQ4}
              placeholder=""
              label="4. Does your occupation require you to wear shoes with a heel (e.g., dress shoes, work boots)?"
              onChange={(event) => setOccupationQ4(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Text fw={700} td="underline">
              Recreation
            </Text>
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              value={rQ1}
              placeholder=""
              label="1. Do you partake in any recreational physical activities (golf, skiing, etc.)? (If YES, please explain.)"
              onChange={(event) => setRQ1(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              value={rQ2}
              placeholder=""
              label="2. Do you have any additional hobbies (gardening, fishing, music, etc.)? (If YES, please explain.)"
              onChange={(event) => setRQ2(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Text fw={700} td="underline">
              Medical
            </Text>
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              value={medQ1}
              placeholder=""
              label="1. Please list out any past musculoskeletal injuries: "
              onChange={(event) => setMedQ1(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              value={medQ2}
              placeholder=""
              label="2. Please list out any past surgeries: "
              onChange={(event) => setMedQ2(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              value={medQ3}
              placeholder=""
              label="3. If you have experienced injuries or surgeries, were they properly rehabilitated and did you receive clearance from a doctor to return to physical activity? "
              onChange={(event) => setMedQ3(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              value={medQ4}
              placeholder=""
              label="4. Do you have any chronic health conditions (such as, but not limited to, cardiovascular disease, pulmonary disorders, hypertension, diabetes, or cancer)? (If YES, please explain.)"
              onChange={(event) => setMedQ4(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              value={medQ5}
              placeholder=""
              label="5. Are you on any medications, and if so, have you received clearance from your doctor to take part in physical activity? "
              onChange={(event) => setMedQ5(event.target.value)}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Textarea
              value={addNote}
              label="Additional Notes"
              onChange={(event) => setAddNote(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Text fw={700} td="underline">
              Coach
            </Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              data={users
                .filter((user) =>
                  [
                    "Junior Trainee",
                    "Senior Trainee",
                    "Advanced Senior Trainee",
                  ].includes(user.department)
                )
                .map((user) => ({
                  value: user._id,
                  label: `${user.name} (${user.department})`,
                }))}
              value={coachId}
              onChange={(value) => setcoachId(value)}
              label="Staff"
              placeholder="Select a Staff"
            />
          </Grid.Col>
        </Grid>
        <Space h="50px" />
        <Group position="center">
          <Button onClick={handleUpdateClient}>
            Update Client Information
          </Button>
        </Group>
        <Space h="20px" />
      </Card>
      <Space h="10px" />
      <Group
        position="apart"
        mx="auto"
        sx={{
          maxWidth: "500px",
        }}
      >
        <div></div>
        <Button
          component={Link}
          to="/clients"
          variant="subtle"
          size="xs"
          color="gray"
        >
          Go back
        </Button>
      </Group>
    </Container>
  );
};

export default ClientEdit;
