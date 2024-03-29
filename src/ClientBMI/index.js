import "../App.css";
import React, { useRef, useState, useMemo } from "react";
import noDataIcon from "../Logo/no-data-found.png";
import { useCookies } from "react-cookie";
import { useParams, Link } from "react-router-dom";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { MdUpload } from "react-icons/md";
import { FaPhotoVideo } from "react-icons/fa";
import { IoImages } from "react-icons/io5";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { Dropzone, IMAGE_MIME_TYPE, MIME_TYPES } from "@mantine/dropzone";
import {
  Container,
  Space,
  TextInput,
  Card,
  Modal,
  Button,
  Image,
  Group,
  Grid,
  Text,
  Table,
  Title,
  ScrollArea,
  UnstyledButton,
  Divider,
} from "@mantine/core";

import {
  addClientBMI,
  deleteClientBMI,
  deleteClientBMIAdmin,
  fetchClientsBMI,
  uploadClientFrontImage,
  uploadClientBackImage,
  uploadClientLeftImage,
  uploadClientRightImage,
  uploadClientVideo,
} from "../api/clients-composition";
import { getClients } from "../api/client";

export default function Video({ videoSource }) {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const { id } = useParams();
  const [opened, { open, close }] = useDisclosure(false);
  const [clientBmi, setClientBmi] = useState("");
  const [clientKg, setClientKg] = useState("");
  const [clientBodyAge, setClientBodyAge] = useState("");
  const [clientVFat, setClientVFat] = useState("");
  const [clientBodyFat, setClientBodyFat] = useState("");
  const [clientImageFront, setClientImageFront] = useState("");
  const [clientImageBack, setClientImageBack] = useState("");
  const [clientImageLeft, setClientImageLeft] = useState("");
  const [clientImageRight, setClientImageRight] = useState("");
  const [clientVideo, setClientVideo] = useState("");
  const queryClient = useQueryClient();
  const videoRef = useRef(null);

  const { isLoading, data: client = {} } = useQuery({
    queryKey: ["client"],
    queryFn: () => getClients(id),
  });

  const { data: clientBmis = [] } = useQuery({
    queryKey: ["clientBmis"],
    queryFn: () => fetchClientsBMI(id),
  });

  const createClientBmiMutation = useMutation({
    mutationFn: addClientBMI,
    onSuccess: () => {
      close();
      queryClient.invalidateQueries({
        queryKey: ["clientBmis"],
      });
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleAddNewClientBmi = async (event) => {
    event.preventDefault();
    createClientBmiMutation.mutate({
      data: JSON.stringify({
        clientBmi: clientBmi,
        clientKg: clientKg,
        clientBodyAge: clientBodyAge,
        clientVFat: clientVFat,
        clientBodyFat: clientBodyFat,
        clientImageFront: clientImageFront,
        clientImageBack: clientImageBack,
        clientImageLeft: clientImageLeft,
        clientImageRight: clientImageRight,
        clientVideo: clientVideo,
        clientId: id,
      }),
      token: currentUser ? currentUser.token : "",
    });
    setClientBmi("");
    setClientKg("");
    setClientBodyAge("");
    setClientVFat("");
    setClientBodyFat("");
    setClientImageFront("");
    setClientImageBack("");
    setClientImageLeft("");
    setClientImageRight("");
    setClientVideo("");
  };

  const deleteClientBmiMutation = useMutation({
    mutationFn: deleteClientBMI,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clientBmis"],
      });
    },
  });

  const deleteClientBmiAdminMutation = useMutation({
    mutationFn: deleteClientBMIAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clientBmis"],
      });
      notifications.show({
        title: currentUser.name + "(Admin) DELETE client BMI",
        color: "yellow",
      });
    },
  });

  const uploadClientFrontImageMutation = useMutation({
    mutationFn: uploadClientFrontImage,
    onSuccess: (data) => {
      setClientImageFront(data.clientimagefront_url);
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleClientFrontImageUpload = (files) => {
    uploadClientFrontImageMutation.mutate(files[0]);
  };

  const uploadClientBackImageMutation = useMutation({
    mutationFn: uploadClientBackImage,
    onSuccess: (data) => {
      setClientImageBack(data.clientimageback_url);
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleClientBackImageUpload = (files) => {
    uploadClientBackImageMutation.mutate(files[0]);
  };

  const uploadClientLeftImageMutation = useMutation({
    mutationFn: uploadClientLeftImage,
    onSuccess: (data) => {
      setClientImageLeft(data.clientimageleft_url);
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleClientLeftImageUpload = (files) => {
    uploadClientLeftImageMutation.mutate(files[0]);
  };

  const uploadClientRightImageMutation = useMutation({
    mutationFn: uploadClientRightImage,
    onSuccess: (data) => {
      setClientImageRight(data.clientimageright_url);
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleClientRightImageUpload = (files) => {
    uploadClientRightImageMutation.mutate(files[0]);
  };

  const uploadClientVideoMutation = useMutation({
    mutationFn: uploadClientVideo,
    onSuccess: (data) => {
      setClientVideo(data.clientvideo_url);
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleClientVideoUpload = (files) => {
    uploadClientVideoMutation.mutate(files[0]);
  };

  const isAdmin = useMemo(() => {
    console.log(cookies);
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  return (
    <Container>
      <Space h={20} />
      <div>
        <Group position="apart">
          <div>
            <Text fw={700} fz="40px">
              {client.clientName}
            </Text>
          </div>
          <Button
            variant="gradient"
            gradient={{ from: "yellow", to: "purple", deg: 105 }}
            onClick={open}
          >
            Add BMI
          </Button>
        </Group>
      </div>
      <Modal
        opened={opened}
        onClose={close}
        size="lg"
        title="Client Composition"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 5,
        }}
      >
        <Container fluid>
          <Space h={20} />
          <Grid>
            <Grid.Col span={4}>
              <TextInput
                value={clientBmi}
                placeholder="XXX"
                radius="md"
                label="BMI:"
                onChange={(event) => setClientBmi(event.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                value={clientKg}
                placeholder="XXX"
                radius="md"
                label="KG:"
                onChange={(event) => setClientKg(event.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                value={clientBodyAge}
                placeholder="XXX"
                radius="md"
                label="Body Age:"
                onChange={(event) => setClientBodyAge(event.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                value={clientBodyFat}
                placeholder="XXX"
                radius="md"
                label="Body Fat:"
                onChange={(event) => setClientBodyFat(event.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                value={clientVFat}
                placeholder="XXX"
                radius="md"
                label="V Fat:"
                onChange={(event) => setClientVFat(event.target.value)}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text>Front</Text>
              {clientImageFront && clientImageFront !== "" ? (
                <>
                  <Image
                    src={"http://localhost:2019/" + clientImageFront}
                    width="100%"
                    height="300px"
                  />
                  <Button
                    color="dark"
                    mt="15px"
                    mb="15px"
                    onClick={() => setClientImageFront("")}
                  >
                    Remove
                  </Button>
                </>
              ) : (
                <Dropzone
                  multiple={false}
                  accept={IMAGE_MIME_TYPE}
                  h={300}
                  onDrop={(files) => {
                    handleClientFrontImageUpload(files);
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
                      <IoImages
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
                      Drag or drop image files to upload
                    </Text>
                  </Group>

                  <Group position="center">
                    <Text size="xs" c="dimmed">
                      upload client front image
                    </Text>
                  </Group>
                  <Space h="50px" />
                </Dropzone>
              )}
            </Grid.Col>

            <Grid.Col span={6}>
              <Text>Back</Text>
              {clientImageBack && clientImageBack !== "" ? (
                <>
                  <Image
                    src={"http://localhost:2019/" + clientImageBack}
                    width="100%"
                    height="300px"
                  />
                  <Button
                    color="dark"
                    mt="15px"
                    mb="15px"
                    onClick={() => setClientImageBack("")}
                  >
                    Remove
                  </Button>
                </>
              ) : (
                <Dropzone
                  multiple={false}
                  accept={IMAGE_MIME_TYPE}
                  h={300}
                  onDrop={(files) => {
                    handleClientBackImageUpload(files);
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
                      <IoImages
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
                      Drag or drop image files to upload
                    </Text>
                  </Group>

                  <Group position="center">
                    <Text size="xs" c="dimmed">
                      upload client back image
                    </Text>
                  </Group>
                  <Space h="50px" />
                </Dropzone>
              )}
            </Grid.Col>
            <Grid.Col span={6}>
              <Text>Left</Text>
              {clientImageLeft && clientImageLeft !== "" ? (
                <>
                  <Image
                    src={"http://localhost:2019/" + clientImageLeft}
                    width="100%"
                    height="300px"
                  />
                  <Button
                    color="dark"
                    mt="15px"
                    mb="15px"
                    onClick={() => setClientImageLeft("")}
                  >
                    Remove
                  </Button>
                </>
              ) : (
                <Dropzone
                  multiple={false}
                  accept={IMAGE_MIME_TYPE}
                  h={300}
                  onDrop={(files) => {
                    handleClientLeftImageUpload(files);
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
                      <IoImages
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
                      Drag or drop image files to upload
                    </Text>
                  </Group>

                  <Group position="center">
                    <Text size="xs" c="dimmed">
                      upload client left image
                    </Text>
                  </Group>
                  <Space h="50px" />
                </Dropzone>
              )}
            </Grid.Col>

            <Grid.Col span={6}>
              <Text>Right</Text>
              {clientImageRight && clientImageRight !== "" ? (
                <>
                  <Image
                    src={"http://localhost:2019/" + clientImageRight}
                    width="100%"
                    height="300px"
                  />
                  <Button
                    color="dark"
                    mt="15px"
                    mb="15px"
                    onClick={() => setClientImageRight("")}
                  >
                    Remove
                  </Button>
                </>
              ) : (
                <Dropzone
                  multiple={false}
                  accept={IMAGE_MIME_TYPE}
                  h={300}
                  onDrop={(files) => {
                    handleClientRightImageUpload(files);
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
                      <IoImages
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
                      Drag or drop image files to upload
                    </Text>
                  </Group>

                  <Group position="center">
                    <Text size="xs" c="dimmed">
                      upload client right image
                    </Text>
                  </Group>
                  <Space h="50px" />
                </Dropzone>
              )}
            </Grid.Col>

            <Grid.Col span={12}>
              <Text>Video</Text>
              {clientVideo && clientVideo !== "" ? (
                <Group position="center">
                  <Card radius="md">
                    <Title order={6}>Video Preview</Title>
                    <Group>
                      <video ref={videoRef} controls height="300" width="100%">
                        <source
                          src={"http://localhost:2019/" + clientVideo}
                          type="video/mp4"
                          frameborder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowfullscreen
                        />
                      </video>
                    </Group>
                    <Group position="center">
                      <Button
                        color="red"
                        size="xs"
                        onClick={() => setClientVideo("")}
                      >
                        Remove
                      </Button>
                    </Group>
                  </Card>
                </Group>
              ) : (
                <>
                  <Dropzone
                    multiple={false}
                    accept={[MIME_TYPES.mp4]}
                    border="none"
                    h={300}
                    onDrop={(files) => {
                      handleClientVideoUpload(files);
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
                        <FaPhotoVideo
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
                        Drag or drop video files to upload
                      </Text>
                    </Group>

                    <Group position="center">
                      <Text size="xs" c="dimmed">
                        Your videos will be private until you publish them.
                      </Text>
                    </Group>
                    <Space h="50px" />
                  </Dropzone>
                </>
              )}
            </Grid.Col>
          </Grid>

          <Space h={40} />
          <Group position="center">
            <Button onClick={handleAddNewClientBmi}>Add BMI</Button>
          </Group>
        </Container>
      </Modal>
      <Space h={50} />
      <ScrollArea h={800} width="100%" offsetScrollbars scrollHideDelay={300}>
        {clientBmis && clientBmis.length > 0 ? (
          <Table
            highlightOnHover
            withColumnBorders
            horizontalSpacing="md"
            verticalSpacing="sm"
            withBorder
          >
            <thead>
              <tr>
                <th>Date</th>
                <th>BMI</th>
                <th>KG</th>
                <th>Body Age</th>
                <th>V Fat</th>
                <th>Body Fat</th>
                <th>Add By</th>
              </tr>
            </thead>
            <tbody>
              {clientBmis.map((cBMI) => (
                <tr key={cBMI._id}>
                  <td>
                    {cBMI.createdAt
                      ? new Date(cBMI.createdAt).toISOString().split("T")[0]
                      : null}
                  </td>
                  <td>{cBMI.clientBmi}</td>
                  <td>{cBMI.clientKg}</td>
                  <td>{cBMI.clientBodyAge}</td>
                  <td>{cBMI.clientVFat}</td>
                  <td>{cBMI.clientBodyFat}</td>
                  <td>{cBMI.user.name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <>
            <Image height={600} src={noDataIcon} width="100%" />
          </>
        )}
      </ScrollArea>

      <Text ta="center" fw={500} fz="xl">
        Image Composition
      </Text>
      <Space h={5} />
      <Text ta="center" fw={500} fz="lg">
        (Front)
      </Text>
      <Group position="apart">
        <Grid>
          {clientBmis ? (
            <>
              {clientBmis.length > 0 ? (
                <>
                  <Grid.Col span={clientBmis.length > 1 ? 6 : 12}>
                    <Image
                      src={
                        "http://localhost:2019/" +
                        clientBmis[0].clientImageFront
                      }
                      height={clientBmis.length > 1 ? 300 : 600}
                      width="100%"
                    />

                    <Text ta="center" fw={500} fz="md">
                      {clientBmis[0].createdAt
                        ? new Date(clientBmis[0].createdAt)
                            .toISOString()
                            .split("T")[0]
                        : null}
                    </Text>
                  </Grid.Col>

                  {/* Display the last video if more than one */}
                  {clientBmis.length > 1 && (
                    <Grid.Col span={6}>
                      <Image
                        height={300}
                        src={
                          "http://localhost:2019/" +
                          clientBmis[clientBmis.length - 1].clientImageFront
                        }
                        width="100%"
                      />
                      <Text ta="center" fw={500} fz="md">
                        {clientBmis[clientBmis.length - 1].createdAt
                          ? new Date(
                              clientBmis[clientBmis.length - 1].createdAt
                            )
                              .toISOString()
                              .split("T")[0]
                          : null}
                      </Text>
                    </Grid.Col>
                  )}
                </>
              ) : (
                // Display a message if clientBmis is empty
                <Grid.Col span={12}>
                  <Image height={600} src={noDataIcon} width="100%" />
                </Grid.Col>
              )}
            </>
          ) : (
            // Display a message if clientBmis is null
            <Grid.Col span={12}>
              <Image height={600} src={noDataIcon} width="100%" />
            </Grid.Col>
          )}
        </Grid>
      </Group>
      <Space h={100} />
      <Text ta="center" fw={500} fz="lg">
        (Back)
      </Text>
      <Group position="apart">
        <Grid>
          {clientBmis ? (
            <>
              {clientBmis.length > 0 ? (
                <>
                  <Grid.Col span={clientBmis.length > 1 ? 6 : 12}>
                    <Image
                      src={
                        "http://localhost:2019/" + clientBmis[0].clientImageBack
                      }
                      height={clientBmis.length > 1 ? 300 : 600}
                      width="100%"
                    />

                    <Text ta="center" fw={500} fz="md">
                      {clientBmis[0].createdAt
                        ? new Date(clientBmis[0].createdAt)
                            .toISOString()
                            .split("T")[0]
                        : null}
                    </Text>
                  </Grid.Col>

                  {/* Display the last video if more than one */}
                  {clientBmis.length > 1 && (
                    <Grid.Col span={6}>
                      <Image
                        height={300}
                        src={
                          "http://localhost:2019/" +
                          clientBmis[clientBmis.length - 1].clientImageBack
                        }
                        width="100%"
                      />
                      <Text ta="center" fw={500} fz="md">
                        {clientBmis[clientBmis.length - 1].createdAt
                          ? new Date(
                              clientBmis[clientBmis.length - 1].createdAt
                            )
                              .toISOString()
                              .split("T")[0]
                          : null}
                      </Text>
                    </Grid.Col>
                  )}
                </>
              ) : (
                <Grid.Col span={12}>
                  <Image height={600} src={noDataIcon} width="100%" />
                </Grid.Col>
              )}
            </>
          ) : (
            // Display a message if clientBmis is null
            <Grid.Col span={12}>
              <Image height={600} src={noDataIcon} width="100%" />
            </Grid.Col>
          )}
        </Grid>
      </Group>
      <Space h={100} />
      <Text ta="center" fw={500} fz="lg">
        (Left)
      </Text>
      <Group position="apart">
        <Grid>
          {clientBmis ? (
            <>
              {clientBmis.length > 0 ? (
                <>
                  <Grid.Col span={clientBmis.length > 1 ? 6 : 12}>
                    <Image
                      src={
                        "http://localhost:2019/" + clientBmis[0].clientImageLeft
                      }
                      height={clientBmis.length > 1 ? 300 : 600}
                      width="100%"
                    />
                    <Text ta="center" fw={500} fz="md">
                      {clientBmis[0].createdAt
                        ? new Date(clientBmis[0].createdAt)
                            .toISOString()
                            .split("T")[0]
                        : null}
                    </Text>
                  </Grid.Col>

                  {/* Display the last image if more than one */}
                  {clientBmis.length > 1 && (
                    <Grid.Col span={6}>
                      <Image
                        height={300}
                        src={
                          "http://localhost:2019/" +
                          clientBmis[clientBmis.length - 1].clientImageLeft
                        }
                        width="100%"
                      />
                      <Text ta="center" fw={500} fz="md">
                        {clientBmis[clientBmis.length - 1].createdAt
                          ? new Date(
                              clientBmis[clientBmis.length - 1].createdAt
                            )
                              .toISOString()
                              .split("T")[0]
                          : null}
                      </Text>
                    </Grid.Col>
                  )}
                </>
              ) : (
                // Display a message if clientBmis is empty
                <Grid.Col span={12}>
                  <Image height={600} src={noDataIcon} width="100%" />
                </Grid.Col>
              )}
            </>
          ) : (
            // Display a message if clientBmis is null
            <Grid.Col span={12}>
              <Image height={600} src={noDataIcon} width="100%" />
            </Grid.Col>
          )}
        </Grid>
      </Group>
      <Space h={100} />
      <Text ta="center" fw={500} fz="lg">
        (Right)
      </Text>
      <Group position="apart">
        <Grid>
          {clientBmis ? (
            <>
              {clientBmis.length > 0 ? (
                <>
                  <Grid.Col span={clientBmis.length > 1 ? 6 : 12}>
                    <Image
                      src={
                        "http://localhost:2019/" +
                        clientBmis[0].clientImageRight
                      }
                      height={clientBmis.length > 1 ? 300 : 600}
                      width="100%"
                    />

                    <Text ta="center" fw={500} fz="md">
                      {clientBmis[0].createdAt
                        ? new Date(clientBmis[0].createdAt)
                            .toISOString()
                            .split("T")[0]
                        : null}
                    </Text>
                  </Grid.Col>

                  {/* Display the last video if more than one */}
                  {clientBmis.length > 1 && (
                    <Grid.Col span={6}>
                      <Image
                        height={300}
                        src={
                          "http://localhost:2019/" +
                          clientBmis[clientBmis.length - 1].clientImageRight
                        }
                        width="100%"
                      />
                      <Text ta="center" fw={500} fz="md">
                        {clientBmis[clientBmis.length - 1].createdAt
                          ? new Date(
                              clientBmis[clientBmis.length - 1].createdAt
                            )
                              .toISOString()
                              .split("T")[0]
                          : null}
                      </Text>
                    </Grid.Col>
                  )}
                </>
              ) : (
                // Display a message if clientBmis is empty
                <Grid.Col span={12}>
                  <Image height={600} src={noDataIcon} width="100%" />
                </Grid.Col>
              )}
            </>
          ) : (
            // Display a message if clientBmis is null
            <Grid.Col span={12}>
              <Image height={600} src={noDataIcon} width="100%" />
            </Grid.Col>
          )}
        </Grid>
      </Group>
      <Space h={100} />
      <Text ta="center" fw={500} fz="lg">
        Video Composition
      </Text>
      <Group position="apart">
        <Grid>
          {clientBmis ? (
            <>
              {clientBmis.length > 0 ? (
                <>
                  <Grid.Col span={clientBmis.length > 1 ? 6 : 12}>
                    <video
                      controls
                      height={clientBmis.length > 1 ? 300 : 600}
                      width="100%"
                    >
                      <source
                        src={
                          "http://localhost:2019/" + clientBmis[0].clientVideo
                        }
                        type="video/mp4"
                      />
                    </video>
                    <Text ta="center" fw={500} fz="md">
                      {clientBmis[0].createdAt
                        ? new Date(clientBmis[0].createdAt)
                            .toISOString()
                            .split("T")[0]
                        : null}
                    </Text>
                  </Grid.Col>

                  {/* Display the last video if more than one */}
                  {clientBmis.length > 1 && (
                    <Grid.Col span={6}>
                      <video controls height={300} width="100%">
                        <source
                          src={
                            "http://localhost:2019/" +
                            clientBmis[clientBmis.length - 1].clientVideo
                          }
                          type="video/mp4"
                        />
                      </video>

                      <Text ta="center" fw={500} fz="md">
                        {clientBmis[clientBmis.length - 1].createdAt
                          ? new Date(
                              clientBmis[clientBmis.length - 1].createdAt
                            )
                              .toISOString()
                              .split("T")[0]
                          : null}
                      </Text>
                    </Grid.Col>
                  )}
                </>
              ) : (
                // Display a message if clientBmis is empty
                <Grid.Col span={12}>
                  <Image height={600} src={noDataIcon} width="100%" />
                </Grid.Col>
              )}
            </>
          ) : (
            // Display a message if clientBmis is null
            <Grid.Col span={12}>
              <Image height={600} src={noDataIcon} width="100%" />
            </Grid.Col>
          )}
        </Grid>
      </Group>
    </Container>
  );
}
