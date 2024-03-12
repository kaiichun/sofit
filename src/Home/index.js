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
function Home() {
  return (
    <>
      <SimpleGrid
        cols={3}
        spacing="lg"
        breakpoints={[
          { maxWidth: 980, cols: 3, spacing: "md" },
          { maxWidth: 755, cols: 2, spacing: "sm" },
          { maxWidth: 600, cols: 1, spacing: "sm" },
        ]}
      >
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Group position="apart" mt="xs" mb="sm">
            <Text fw={700} fz="xl">
              Monthly Clients
            </Text>
          </Group>
          <Group>
            <Text size="xl" fw={500}>
              10,174
            </Text>
            <Text size="sm" color="pink">
              +12%
            </Text>
          </Group>
        </Card>
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Group position="apart" mt="xs" mb="sm">
            <Text fw={700} fz="xl">
              Monthly Sales
            </Text>
          </Group>
          <Group>
            <Text size="xl" fw={500}>
              100,974
            </Text>
            <Text size="sm" color="pink">
              +70%
            </Text>
          </Group>
        </Card>

        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Group position="apart" mt="xs" mb="xs">
            <Text fw={700} fz="xl">
              Monthly Goal
            </Text>
          </Group>
          <Group position="center">
            <Text Text fw={500} color="red">
              100,974
            </Text>
            <Text Text fw={700}>
              / 300,000
            </Text>
          </Group>
          <Progress color="grape" value={30} animate />
        </Card>
      </SimpleGrid>
      <Space h={30} />
      <Group position="center">
        <RingProgress
          size={400}
          thickness={20}
          roundCaps
          label={
            <Text size="lg" fw={500} align="center">
              Sales data usage
            </Text>
          }
          sections={[
            { value: 40, color: "cyan" },
            { value: 15, color: "orange" },
            { value: 15, color: "grape" },
            { value: 30, color: "red" },
          ]}
        />
      </Group>
    </>
  );
}

export default Home;
