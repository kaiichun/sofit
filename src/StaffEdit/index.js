import { useState, useMemo } from "react";
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
    Group,
    Image,
    Grid,
    Radio,
    Textarea,
    PasswordInput,
    NativeSelect,
    Text,
    Title,
    Avatar,
    em,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { updateUser, uploadProfileImage, getUser } from "../api/auth";
import sofitLogo from "../Logo/sofit-black.png";
import { MdUpload } from "react-icons/md";

const StaffEdit = () => {
    const { id } = useParams();
    const [cookies] = useCookies(["currentUser"]);
    const { currentUser } = cookies;
    const [name, setName] = useState(currentUser ? currentUser.name : "");
    const [username, setUsername] = useState(
        currentUser ? currentUser.username : ""
    );
    const [email, setEmail] = useState(currentUser ? currentUser.email : "");
    // const [password, setPassword] = useState();
    // const [confirmPassword, setConfirmPassword] = useState();
    const [ic, setIc] = useState(currentUser ? currentUser.ic : "");
    const [dob, setDob] = useState(currentUser ? currentUser.dob : "");
    const [gender, setGender] = useState(currentUser ? currentUser.gender : "");
    const [relationship, setRelationship] = useState(
        currentUser ? currentUser.relationship : ""
    );
    const [phonenumber, setPhonenumber] = useState(
        currentUser ? currentUser.phonenumber : ""
    );
    const [staffemergencycontactname, setStaffemergencycontactname] = useState(
        currentUser ? currentUser.staffemergencycontactname : ""
    );
    const [staffemergencycontact, setStaffemergencycontact] = useState(
        currentUser ? currentUser.staffemergencycontact : ""
    );
    const [address1, setAddress1] = useState(
        currentUser ? currentUser.address1 : ""
    );
    const [address2, setAddress2] = useState(
        currentUser ? currentUser.address2 : ""
    );
    const [zip, setZip] = useState(currentUser ? currentUser.zip : "");
    const [state, setState] = useState(currentUser ? currentUser.state : "");
    const [image, setImage] = useState(currentUser ? currentUser.image : "");
    const [bankname, setBankName] = useState(
        currentUser ? currentUser.bankname : ""
    );
    const [bankacc, setBankAcc] = useState(
        currentUser ? currentUser.bankacc : ""
    );
    const [epf, setEPF] = useState(currentUser ? currentUser.epf : "");
    const [socso, setSocso] = useState(currentUser ? currentUser.socso : "");
    const [salary, setSalary] = useState(currentUser ? currentUser.salary : "");
    const [department, setDepartment] = useState(
        currentUser ? currentUser.department : ""
    );
    const [branch, setBranch] = useState(currentUser ? currentUser.branch : "");
    const [role, setRole] = useState(currentUser ? currentUser.role : "");
    const navigate = useNavigate();
    const [visible, { toggle }] = useDisclosure(false);
    const { isLoading } = useQuery({
        queryKey: ["auth", id],
        queryFn: () => getUser(id),
        onSuccess: (data) => {
            setName(data.name);
            setUsername(data.username);
            setEmail(data.email);
            setIc(data.ic);
            setDob(data.dob);
            setGender(data.gender);
            setRelationship(data.relationship);
            setPhonenumber(data.phonenumber);
            setStaffemergencycontactname(data.staffemergencycontactname);
            setStaffemergencycontact(data.staffemergencycontact);
            setAddress1(data.address1);
            setAddress2(data.address2);
            setZip(data.zip);
            setState(data.state);
            setImage(data.image);
            setSalary(data.salary);
            setEPF(data.setEPF);
            setSocso(data.socso);
            setBankName(data.bankname);
            setBankAcc(data.bankacc);
            setDepartment(data.department);
            setBranch(data.branch);
            setRole(data.role);
        },
    });

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

    const updateUserMutation = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            notifications.show({
                title: currentUser.name + " info updated successfully",
                color: "green",
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

    const handleUserUpdate = async (event) => {
        event.preventDefault();
        updateUserMutation.mutate({
            id: id,
            data: JSON.stringify({
                name: name,
                username: username,
                ic: ic,
                dob: dob,
                email: email,
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
            }),
            token: currentUser ? currentUser.token : "",
        });
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

    return (
        <Container>
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
                    <Link
                        to="/"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
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
                                    <Image
                                        src={"http://localhost:2019/" + image}
                                        w={300}
                                        h={300}
                                    />
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
                                                Drag and drop photo files to
                                                upload
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
                            placeholder="UserName"
                            label="Username"
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                        />
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <TextInput
                            value={email}
                            placeholder="example@sofit.com"
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
                            data={[
                                "Single",
                                "In love",
                                "Married",
                                "Widowed",
                                "Others",
                            ]}
                            label="Relationship"
                            value={relationship}
                            placeholder=""
                            onChange={(event) =>
                                setRelationship(event.target.value)
                            }
                        />
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <TextInput
                            value={phonenumber}
                            placeholder="+6012-3456789"
                            label="Phone Number"
                            onChange={(event) =>
                                setPhonenumber(event.target.value)
                            }
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
                            onChange={(event) =>
                                setAddress1(event.currentTarget.value)
                            }
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <TextInput
                            label="Address 2"
                            value={address2}
                            onChange={(event) => {
                                const newValue =
                                    event.currentTarget.value || " - ";
                                setAddress2(newValue);
                            }}
                        />
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <TextInput
                            label="Zip"
                            value={zip}
                            onChange={(event) =>
                                setZip(event.currentTarget.value)
                            }
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
                    {/* <Grid.Col span={6}>
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
          </Grid.Col> */}

                    <Grid.Col span={4}>
                        <TextInput
                            value={salary}
                            placeholder="1000"
                            label="Salary"
                            onChange={(event) => setSalary(event.target.value)}
                            disabled={isAdminB || isAdminHQ ? false : true}
                        />
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <TextInput
                            value={epf}
                            placeholder="k"
                            label="EPF No"
                            onChange={(event) => setEPF(event.target.value)}
                            disabled={isAdminB || isAdminHQ ? false : true}
                        />
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <TextInput
                            value={socso}
                            placeholder=""
                            label="Socso No"
                            onChange={(event) => setSocso(event.target.value)}
                            disabled={isAdminB || isAdminHQ ? false : true}
                        />
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <TextInput
                            value={bankname}
                            placeholder="XX Bank"
                            label="Bank Name"
                            onChange={(event) =>
                                setBankName(event.target.value)
                            }
                            disabled={isAdminB || isAdminHQ ? false : true}
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <TextInput
                            value={bankacc}
                            placeholder="060-100-2301-1"
                            label="Bank Account Number"
                            onChange={(event) => setBankAcc(event.target.value)}
                            disabled={isAdminB || isAdminHQ ? false : true}
                        />
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <NativeSelect
                            data={[
                                "Management",
                                "Coach",
                                "Sales",
                                "Marketing",
                                "Accounting",
                                "Other",
                            ]}
                            label="Department"
                            value={department}
                            placeholder="Select department"
                            onChange={(event) =>
                                setDepartment(event.target.value)
                            }
                            disabled={isAdminB || isAdminHQ ? false : true}
                        />
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <NativeSelect
                            data={["Setia Alam", "Other"]}
                            label="Department"
                            value={branch}
                            placeholder="Branch"
                            onChange={(event) => setBranch(event.target.value)}
                            disabled={isAdminB || isAdminHQ ? false : true}
                        />
                    </Grid.Col>
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
                            disabled={isAdminB || isAdminHQ ? false : true}
                        />
                    </Grid.Col>
                </Grid>
                <Space h="50px" />
                <Group position="center">
                    <Button fullWidth onClick={handleUserUpdate}>
                        Update
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
                <Button
                    component={Link}
                    to="/login"
                    variant="subtle"
                    size="xs"
                    color="gray"
                >
                    Already have account
                </Button>
                <Button
                    component={Link}
                    to="/"
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

export default StaffEdit;
