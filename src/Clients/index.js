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
  Space,
} from "@mantine/core";
import { Link } from "react-router-dom";

function Clients() {
  return (
    <>
      <SimpleGrid
        cols={4}
        spacing="lg"
        breakpoints={[
          { maxWidth: 980, cols: 4, spacing: "md" },
          { maxWidth: 755, cols: 3, spacing: "sm" },
          { maxWidth: 600, cols: 2, spacing: "sm" },
        ]}
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
            <Text fw={700}>Sim Jia Keong</Text>

            <Button
              variant="outline"
              color="red"
              radius="md"
              size="xs"
              compact
              component={Link}
              to={"/client-info-edit"}
            >
              EDIT
            </Button>
          </Group>

          <Text size="sm" color="dimmed">
            BMI : 23
          </Text>
          <Text size="sm" color="dimmed">
            Weight : 50.5kg
          </Text>
          <Text size="sm" color="dimmed">
            Height : 180CM
          </Text>
          <Text size="sm" color="dimmed">
            DOB : 10-10-2000
          </Text>
          <Text size="sm" color="dimmed">
            Coach : Ali
          </Text>
        </Card>
      </SimpleGrid>
    </>
  );
}

export default Clients;
