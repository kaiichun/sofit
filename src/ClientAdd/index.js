import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  Container,
  Space,
  Select,
  TextInput,
  Card,
  Button,
  Group,
  Image,
  Grid,
  Radio,
  Textarea,
  NativeSelect,
  Text,
  Title,
} from "@mantine/core";
import {
  fetchClients,
  addClientDetails,
  uploadClientImage,
} from "../api/client";
import { IoImages } from "react-icons/io5";
import HeaderClient from "../HeaderClient";
import { fetchUsers } from "../api/auth";
import { API_URL } from "../api/data";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

const ClientAdd = () => {
  const [cookies, setCookie] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const [selectedUser, setSelectedUser] = useState("");
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
  const [sessions, setSessions] = useState("");
  const [clientImage, setClientImage] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [visible, { toggle }] = useDisclosure(false);

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });

  const createMutation = useMutation({
    mutationFn: addClientDetails,
    onSuccess: (data) => {
      navigate("/clients");
      notifications.show({
        title: "Member created successfully, please select a package",
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

  const uploadMutation = useMutation({
    mutationFn: uploadClientImage,
    onSuccess: (data) => {
      setClientImage(data.clientImage_url);
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleImageUpload = (files) => {
    if (files.length === 0) {
      notifications.show({
        title: "No file selected",
        color: "red",
      });
      return;
    }

    uploadMutation.mutate(files[0], {
      onSuccess: (data) => {
        setClientImage(data.clientImage_url);
        notifications.show({
          title: "Image uploaded successfully",
          color: "green",
        });
      },
      onError: (error) => {
        notifications.show({
          title: error.message || "Image upload failed",
          color: "red",
        });
      },
    });
  };

  const handleSubmit = () => {
    const missingFields = [];

    if (!clientName) missingFields.push("Client Name");
    if (!clientGender) missingFields.push("Gender");
    if (!clientIc) missingFields.push("IC");
    if (!clientHeight) missingFields.push("Height");
    if (!clientWeight) missingFields.push("Weight");
    if (!clientEmail) missingFields.push("Email");
    if (!clientPhonenumber) missingFields.push("Phone Number");
    if (!clientEmergencycontactname)
      missingFields.push("Emergency Contact Name");
    if (!clientEmergencycontact) missingFields.push("Emergency Contact");
    if (!clientAddress1) missingFields.push("Address");
    if (!clientZip) missingFields.push("Zip Code");
    if (!clientState) missingFields.push("State");

    if (missingFields.length > 0) {
      notifications.show({
        title: "Please fill in the following fields",
        message: missingFields.join(", "),
        color: "red",
      });
    } else {
      createMutation.mutate({
        data: JSON.stringify({
          clientName,
          clientGender,
          clientIc,
          clientHeight,
          clientWeight,
          clientEmail,
          clientPhonenumber,
          clientEmergencycontactname,
          clientEmergencycontact,
          clientAddress1,
          clientAddress2,
          clientZip,
          clientState,
          exeQ1,
          exeQ2,
          exeQ3a,
          exeQ3b,
          exeQ3c,
          exeQ3d,
          dietQ1,
          dietQ2,
          dietQ3,
          dietQ4,
          dietQ5,
          dietQ6,
          dietQ7,
          dietQ8,
          lifeQ1,
          lifeQ2,
          lifeQ3,
          lifeQ4,
          occupationQ1,
          occupationQ2,
          occupationQ3,
          occupationQ4,
          rQ1,
          rQ2,
          medQ1,
          medQ2,
          medQ3,
          medQ4,
          medQ5,
          addNote,
          coachId: selectedUser,
          clientImage,
        }),
        token: currentUser ? currentUser.token : "",
      });
    }
  };

  return (
    <>
      <HeaderClient page="AddMember" />
      <Container>
        <Space h="20px" />
        <Title order={2} align="center">
          Add a new Client
        </Title>
        <Text align="center" order={6}>
          Enter all details
        </Text>
        <Space h="20px" />
        <Card
          withBorder
          p="20px"
          mx="auto"
          sx={{
            maxWidth: "800px",
          }}
        >
          <Space h="20px" />

          <Grid grow gutter="xs">
            <Grid.Col span={4}></Grid.Col>
            <Grid.Col span={4}>
              {clientImage && clientImage !== "" ? (
                <>
                  <Image src={API_URL + "/" + clientImage} w={180} h={180} />
                  <Group position="center">
                    <Button
                      color="dark"
                      mt="-50px"
                      onClick={() => setClientImage("")}
                    >
                      Remove
                    </Button>
                  </Group>
                </>
              ) : (
                <Dropzone
                  multiple={false}
                  accept={IMAGE_MIME_TYPE}
                  h={180}
                  w={180}
                  onDrop={(files) => {
                    handleImageUpload(files);
                  }}
                >
                  <Space h="25px" />
                  <Group position="center">
                    <Group
                      style={{
                        width: "50px",
                        height: "50px",
                        background: "#C1C2C5",
                        borderRadius: "50%",
                      }}
                    >
                      <IoImages
                        style={{
                          margin: "auto",
                          width: "30px",
                          height: "30px",
                        }}
                      />
                    </Group>
                  </Group>
                  <Space h="20px" />
                  <Group position="center">
                    <Text size="xs" fw={500}>
                      Drag or drop image files to upload
                    </Text>
                  </Group>
                  <Group position="center">
                    <Text size="xs" c="dimmed">
                      upload Client Image
                    </Text>
                  </Group>
                  <Space h="50px" />
                </Dropzone>
              )}
            </Grid.Col>
            <Grid.Col span={4}></Grid.Col>
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
                onChange={(event) =>
                  setClientAddress1(event.currentTarget.value)
                }
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
                3. On a scale of 0 to 10, how important are the following
                fitness goals to you?
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
              value={selectedUser}
              onChange={(value) => setSelectedUser(value)}
              label="Staff"
              placeholder="Select a Staff"
            />
          </Grid>
          <Space h="50px" />
          <Group position="center">
            <Button onClick={handleSubmit}>Add New Client</Button>
          </Group>
          <Space h="20px" />
        </Card>
        <Space h="10px" />
      </Container>
    </>
  );
};

export default ClientAdd;
