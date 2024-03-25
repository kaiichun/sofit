import {
  SimpleGrid,
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Progress,
  RingProgress,
  UnstyledButton,
} from "@mantine/core";
import React from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { fetchClients } from "../api/client";

export default function Clients() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const { isLoading, data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => fetchClients(),
  });
  return (
    <>
      {" "}
      <SimpleGrid
        cols={4}
        spacing="lg"
        breakpoints={[
          { maxWidth: 980, cols: 4, spacing: "md" },
          { maxWidth: 755, cols: 3, spacing: "sm" },
          { maxWidth: 600, cols: 2, spacing: "sm" },
        ]}
      >
        {clients
          ? clients.map((c) => {
              return (
                <UnstyledButton
                  component={Link}
                  to={"/composition-client/" + c._id}
                  variant="transparent"
                >
                  <Card shadow="sm" p="lg" radius="md" withBorder>
                    <Card.Section>
                      <Image
                        src="https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=1483"
                        height={220}
                        alt="Norway"
                      />
                    </Card.Section>

                    <Group position="apart" mt="md" mb="xs">
                      <Text fw={700}>{c.clientName}</Text>

                      <Button
                        variant="outline"
                        color="red"
                        radius="md"
                        size="xs"
                        compact
                        component={Link}
                        to={"/edit-client-info/" + c._id}
                      >
                        EDIT
                      </Button>
                    </Group>

                    <Text size="sm" color="dimmed">
                      Gender: {c.clientGender}
                    </Text>
                    <Text size="sm" color="dimmed">
                      Height: {c.clientHeight} (CM)
                    </Text>
                    <Text size="sm" color="dimmed">
                      Weight: {c.clientWeight} (KG)
                    </Text>
                    <Text size="sm" color="dimmed">
                      Package validity period: {c.packageValidityPeriod}
                    </Text>
                    <Text size="sm" color="dimmed">
                      Staff: {c.user.name}
                    </Text>
                  </Card>
                </UnstyledButton>
              );
            })
          : null}
      </SimpleGrid>
      <Group position="apart" mt={300}>
        <div></div>
        <div>
          <Button
            color="red"
            radius="xl"
            size="xl"
            compact
            component={Link}
            to={"/add-client"}
          >
            +
          </Button>
        </div>
      </Group>
    </>
  );
}
