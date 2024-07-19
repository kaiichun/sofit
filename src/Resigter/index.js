import { useState, useMemo } from "react";

import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  Container,
  Space,
  TextInput,
  Card,
  Button,
  Group,
  Image,
  Grid,
  PasswordInput,
  NativeSelect,
  Select,
  Text,
  Title,
  Avatar,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { fetchBranch, registerUser, uploadProfileImage } from "../api/auth";
import sofitLogo from "../Logo/sofit-black.png";
import { MdUpload } from "react-icons/md";
import { API_URL } from "../api/data";

const Resigter = () => {
  const [cookies, setCookie] = useCookies(["currentUser"]);
  const [name, setName] = useState("");
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [ic, setIc] = useState();
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Male");
  const [relationship, setRelationship] = useState("Single");
  const [phonenumber, setPhonenumber] = useState();
  const [staffemergencycontactname, setStaffemergencycontactname] = useState();
  const [staffemergencycontact, setStaffemergencycontact] = useState();
  const [address1, setAddress1] = useState();
  const [address2, setAddress2] = useState();
  const [zip, setZip] = useState();
  const [state, setState] = useState("Selangor");
  const [image, setImage] = useState("");
  const [bankname, setBankName] = useState();
  const [bankacc, setBankAcc] = useState();
  const [epf, setEPF] = useState();
  const [socso, setSocso] = useState();
  const [salary, setSalary] = useState();
  const [department, setDepartment] = useState("Junior Trainee");
  const [branch, setBranch] = useState();
  const [role, setRole] = useState("Staff");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [visible, { toggle }] = useDisclosure(false);

  const { data: branchs } = useQuery({
    queryKey: ["branch"],
    queryFn: () => fetchBranch(),
  });

  // sign up mutation
  const signMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["signup"],
      });
      navigate("/home");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  function generateRandomNumbers() {
    return Math.floor(1000 + Math.random() * 9000); // Generates a random 4-digit number
  }

  const [isDisabled, setIsDisabled] = useState(false);

  const handleBlur = () => {
    const randomNumbers = generateRandomNumbers();
    setUsername((prevUsername) => prevUsername + randomNumbers);
    setIsDisabled(true);
  };

  const handleSubmit = () => {
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !username ||
      !address1 ||
      !zip ||
      !state ||
      !role ||
      !relationship ||
      !department ||
      !salary ||
      !epf ||
      !socso ||
      !bankacc ||
      !bankname ||
      !staffemergencycontact ||
      !staffemergencycontactname ||
      !phonenumber ||
      !gender ||
      !ic ||
      !dob
    ) {
      notifications.show({
        title: "Please fill in all fields",
        color: "red",
      });
    } else if (password !== confirmPassword) {
      notifications.show({
        title: "Password not match",
        color: "red",
      });
    } else {
      signMutation.mutate(
        JSON.stringify({
          name: name,
          username: username,
          email: email,
          password: password,
          ic: ic,
          dob: dob,
          gender: gender,
          relationship: relationship,
          phonenumber: phonenumber,
          staffemergencycontact: staffemergencycontact,
          staffemergencycontactname: staffemergencycontactname,
          address1: address1,
          address2: address2,
          zip: zip,
          state: state,
          image: image,
          bankname: bankname,
          bankacc: bankacc,
          epf: epf,
          socso: socso,
          salary: salary,
          department: department,
          branch: branch,
          role: role,
        })
      );
    }
  };

  const uploadMutation = useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: (data) => {
      setImage(data.image_url);
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleImageUpload = (files) => {
    uploadMutation.mutate(files[0]);
  };

  const isAdminB = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "Admin Branch"
      ? true
      : false;
  }, [cookies]);

  const isAdminHQ = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "Admin HQ"
      ? true
      : false;
  }, [cookies]);

  return (
    <Container>
      <>
        <Space h="120px" />
        <Card
          withBorder
          p="20px"
          mx="auto"
          sx={{
            maxWidth: "700px",
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
            Add a new staff
          </Title>
          <Text align="center" order={6}>
            Enter all details
          </Text>
          <Space h="20px" />
          <Grid grow gutter="xs">
            <Grid.Col span={9}>
              {image && image !== "" ? (
                <Group position="center">
                  <Card radius="md">
                    <Image src={API_URL + "/" + image} w={300} h={300} />
                    <Group position="center">
                      <Button
                        color="red"
                        size="xs"
                        onClick={() => setImage("")}
                      >
                        Remove
                      </Button>
                    </Group>
                  </Card>
                </Group>
              ) : (
                <>
                  <Space h={15} />
                  <Group position="center">
                    <Dropzone
                      multiple={false}
                      accept={IMAGE_MIME_TYPE}
                      h={300}
                      w={300}
                      styles={{ margin: "0px" }}
                      onDrop={(files) => {
                        handleImageUpload(files);
                      }}
                    >
                      <Space h="50px" />
                      <Group position="center">
                        <Group
                          style={{
                            width: "100px",
                            height: "100px",
                            background: "#C1C2C5",
                            borderRadius: "50%",
                          }}
                        >
                          <MdUpload
                            style={{
                              margin: "auto",
                              width: "50px",
                              height: "50px",
                            }}
                          />
                        </Group>
                      </Group>
                      <Space h="20px" />
                      <Group position="center">
                        <Text size="xs" fw={500}>
                          Drag and drop photo files to upload
                        </Text>
                      </Group>

                      <Group position="center">
                        <Text size="xs" c="dimmed">
                          Please upload a Profile Picture.
                        </Text>
                      </Group>
                      <Space h="50px" />
                    </Dropzone>
                  </Group>
                  <Space h={45} />
                </>
              )}
            </Grid.Col>
            <Space h={50} />
            <Grid.Col span={4}>
              <TextInput
                value={name}
                placeholder="Name"
                label="Full Name"
                onChange={(event) => setName(event.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                value={username}
                placeholder="Username"
                label="Username"
                onChange={(event) => setUsername(event.target.value)}
                onBlur={handleBlur}
                disabled={isDisabled}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                value={email}
                placeholder="example@sofit.com.my"
                label="Email"
                onChange={(event) => setEmail(event.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <TextInput
                value={ic}
                placeholder="000000-00-00"
                label="Identity Card No"
                onChange={(event) => setIc(event.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <TextInput
                label="Date Of Birth"
                placeholder="14 Dec 1998"
                maxWidth={400} // Corrected prop name
                mx="auto"
                value={dob}
                onChange={(event) => setDob(event.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <NativeSelect
                data={["Male", "Female"]}
                label="Gender"
                value={gender}
                onChange={(event) => setGender(event.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <NativeSelect
                data={["Single", "In love", "Married", "Widowed", "Others"]}
                label="Relationship"
                value={relationship}
                placeholder=""
                onChange={(event) => setRelationship(event.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                value={phonenumber}
                placeholder="+6012-3456789"
                label="Phone Number"
                onChange={(event) => setPhonenumber(event.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                value={staffemergencycontactname}
                placeholder="XXX"
                label="Emergency Contact Name"
                onChange={(event) =>
                  setStaffemergencycontactname(event.target.value)
                }
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                value={staffemergencycontact}
                placeholder="+6012-3456789"
                label="Emergency Contact Number"
                onChange={(event) =>
                  setStaffemergencycontact(event.target.value)
                }
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Address 1"
                value={address1}
                onChange={(event) => setAddress1(event.currentTarget.value)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Address 2"
                value={address2}
                onChange={(event) => {
                  const newValue = event.currentTarget.value || "-";
                  setAddress2(newValue);
                }}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <TextInput
                label="Zip"
                value={zip}
                onChange={(event) => setZip(event.currentTarget.value)}
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
                value={state}
                placeholder=""
                onChange={(event) => setState(event.target.value)}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <PasswordInput
                value={password}
                placeholder="Password"
                label="Password"
                visible={visible}
                onVisibilityChange={toggle}
                required
                onChange={(event) => setPassword(event.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <PasswordInput
                value={confirmPassword}
                placeholder="Confirm Password"
                label="Confirm Password"
                visible={visible}
                onVisibilityChange={toggle}
                required
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </Grid.Col>

            <Grid.Col span={4}>
              <TextInput
                value={salary}
                placeholder="1000"
                label="Salary"
                onChange={(event) => setSalary(event.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                value={epf}
                placeholder="k"
                label="EPF No"
                onChange={(event) => setEPF(event.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                value={socso}
                placeholder=""
                label="Socso No"
                onChange={(event) => setSocso(event.target.value)}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput
                value={bankname}
                placeholder="XX Bank"
                label="Bank Name"
                onChange={(event) => setBankName(event.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                value={bankacc}
                placeholder="060-100-2301-1"
                label="Bank Account Number"
                onChange={(event) => setBankAcc(event.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <NativeSelect
                data={[
                  "Junior Trainee",
                  "Senior Trainee",
                  "Advanced Senior Trainee",
                  "Sales",
                  "Marketing",
                  "Management",
                  "Accounting",
                  "Other",
                ]}
                label="Department"
                value={department}
                placeholder="Select department"
                onChange={(event) => setDepartment(event.target.value)}
              />
            </Grid.Col>
            {/* <Grid.Col span={3}>
                <Select
                  data={branchs.map((user) => ({
                    value: user._id,
                    label: `${user.branch}`,
                  }))}
                  value={branch}
                  onChange={(value) => setBranch(value)}
                  label="Branch"
                  placeholder="Select a Branch"
                />
              </Grid.Col> */}
            <Grid.Col span={3}>
              <NativeSelect
                data={[
                  "Staff",
                  "Supervisor",
                  "Manager",
                  "Admin HQ",
                  "Admin Branch",
                ]}
                label="Role"
                value={role}
                placeholder=""
                onChange={(event) => setRole(event.target.value)}
              />
            </Grid.Col>
          </Grid>
          <Space h="50px" />
          <Group position="center">
            <Button onClick={handleSubmit}>Resigter</Button>
          </Group>
          <Space h="20px" />
        </Card>
        <Space h="30px" />
        <Group
          position="center"
          mx="auto"
          sx={{
            maxWidth: "500px",
          }}
        >
          <Space h="50px" />
        </Group>
      </>
    </Container>
  );
};

export default Resigter;
