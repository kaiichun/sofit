import {
  Grid,
  SimpleGrid,
  Card,
  Image,
  NumberInput,
  TextInput,
  Textarea,
  Radio,
  Badge,
  Button,
  Group,
  Progress,
  RingProgress,
  Space,
  Container,
} from "@mantine/core";
import { Link } from "react-router-dom";

function ClientInfoEdit() {
  return (
    <>
      <Group position="center" style={{ marginBottom: "20px" }}>
        <Image
          src="https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=1483"
          height={400}
          width={400}
          alt="Norway"
        />
      </Group>
      <Container>
        <Grid grow gutter="xs">
          <Grid.Col span={5}>
            <TextInput placeholder="Your name" label="Full name " />
          </Grid.Col>
          <Space w={50} />
          <Grid.Col span={3}>
            <Radio.Group name="favoriteFramework" label="Gender">
              <Group mt="xs">
                <Radio value="female" label="Female" />
                <Radio value="male" label="Male" />
              </Group>
            </Radio.Group>
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput label="Day Of Brith" placeholder="10 JULY 2001" />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput label="Height (CM)" placeholder="180" />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput label="Weight (KG)" placeholder="60" />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              label="BMI"
              placeholder="22.1"
              precision={2}
              min={10}
              step={0.01}
              max={40}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput label="IC Number" placeholder="000101-10-1001" />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput label="Occupation" placeholder="Coach" />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput label="Email" placeholder="example@gmail.com" />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              placeholder="Address"
              label="Address"
              autosize
              minRows={2}
              maxRows={4}
            />
          </Grid.Col>
        </Grid>
        <Space h={50} />
        <Group position="center">
          <Button>Submit</Button>
        </Group>
      </Container>
    </>
  );
}

export default ClientInfoEdit;
