import { useState } from "react";
import { Checkbox } from "@mantine/core";
import { useCookies } from "react-cookie";
import { Link, useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import {
  Container,
  Space,
  TextInput,
  Card,
  Button,
  Group,
  Grid,
  Text,
  Title,
  Avatar,
} from "@mantine/core";
import sofitLogo from "../Logo/sofit-black.png";
import { fetchUserPMS, updateUserPMS } from "../api/pms";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";

const PerformanceManagementSystemUpdate = () => {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const [name, setName] = useState(currentUser.name);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [renewalAndReferred1, setRenewalAndReferred1] = useState("");
  const [renewalAndReferred2, setRenewalAndReferred2] = useState("");
  const [renewalAndReferred3, setRenewalAndReferred3] = useState("");
  const [renewalAndReferred4, setRenewalAndReferred4] = useState("");
  const [renewalAndReferred5, setRenewalAndReferred5] = useState("");
  const [sA1InternalMeeting1, setSA1InternalMeeting1] = useState("");
  const [sA1InternalMeeting2, setSA1InternalMeeting2] = useState("");
  const [sA1InternalMeeting3, setSA1InternalMeeting3] = useState("");
  const [sA1InternalMeeting4, setSA1InternalMeeting4] = useState("");
  const [sA1InternalMeeting5, setSA1InternalMeeting5] = useState("");
  const [sA2InternalTraining1, setSA2InternalTraining1] = useState("");
  const [sA2InternalTraining2, setSA2InternalTraining2] = useState("");
  const [sA2InternalTraining3, setSA2InternalTraining3] = useState("");
  const [sA2InternalTraining4, setSA2InternalTraining4] = useState("");
  const [sA2InternalTraining5, setSA2InternalTraining5] = useState("");
  const [sA3CSAR, setSA3CSAR] = useState("");
  const [sA4Testimonials1, setSA4Testimonials1] = useState("");
  const [sA4Testimonials2, setSA4Testimonials2] = useState("");
  const [sA5RenewalAndReferred1, setsA5RenewalAndReferred1] = useState("");
  const [sA5RenewalAndReferred2, setsA5RenewalAndReferred2] = useState("");
  const [sA5RenewalAndReferred3, setsA5RenewalAndReferred3] = useState("");
  const [sA5RenewalAndReferred4, setsA5RenewalAndReferred4] = useState("");
  const [enrolmentGoogleReview, setEnrolmentGoogleReview] = useState("");
  const [enrolmentInvitingClients, setEnrolmentInvitingClients] = useState("");
  const [enrolmentInterviewingClients, setEnrolmentInterviewingClients] =
    useState("");
  const [enrolmentIGStory, setEnrolmentIGStory] = useState("");
  const [enrolmentIGFBPost, setEnrolmentIGFBPost] = useState("");
  const [enrolmentNewCoaches, setEnrolmentNewCoaches] = useState("");
  const [engagementSOFITevent, setEngagementSOFITevent] = useState("");
  const [engagementIGStory, setEngagementIGStory] = useState("");
  const [engagementIGFBPost, setEngagementIGFBPost] = useState("");
  const [engagementVideoShooting, setEngagementVideoShooting] = useState("");
  const [engagementTeamBuilding, setEngagementTeamBuilding] = useState("");
  const [engagementSuggestion, setEngagementSuggestion] = useState("");
  const [engagementRepostStory, setEngagementRepostStory] = useState("");
  const [additional1, setAdditional1] = useState("");
  const [additional2, setAdditional2] = useState("");
  const [additional3, setAdditional3] = useState("");
  const [bonus, setBonus] = useState(0);
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [visible, { toggle }] = useDisclosure(false);
  const { isLoading } = useQuery({
    queryKey: ["pms3", id],
    queryFn: () => fetchUserPMS(id),
    onSuccess: (data) => {
      setRenewalAndReferred1(data.renewalAndReferred1);
      setRenewalAndReferred2(data.renewalAndReferred2);
      setRenewalAndReferred3(data.renewalAndReferred3);
      setRenewalAndReferred4(data.renewalAndReferred4);
      setRenewalAndReferred5(data.renewalAndReferred5);
      setSA1InternalMeeting1(data.sA1InternalMeeting1);
      setSA1InternalMeeting2(data.sA1InternalMeeting2);
      setSA1InternalMeeting3(data.sA1InternalMeeting3);
      setSA1InternalMeeting4(data.sA1InternalMeeting4);
      setSA1InternalMeeting5(data.sA1InternalMeeting5);
      setSA2InternalTraining1(data.sA2InternalTraining1);
      setSA2InternalTraining2(data.sA2InternalTraining2);
      setSA2InternalTraining3(data.sA2InternalTraining3);
      setSA2InternalTraining4(data.sA2InternalTraining4);
      setSA2InternalTraining5(data.sA2InternalTraining5);
      setSA3CSAR(data.sA3CSAR);
      setSA4Testimonials1(data.sA4Testimonials1);
      setSA4Testimonials2(data.sA4Testimonials2);
      setsA5RenewalAndReferred1(data.sA5RenewalAndReferred1);
      setsA5RenewalAndReferred2(data.sA5RenewalAndReferred2);
      setsA5RenewalAndReferred3(data.sA5RenewalAndReferred3);
      setsA5RenewalAndReferred4(data.sA5RenewalAndReferred4);
      setEnrolmentGoogleReview(data.enrolmentGoogleReview);
      setEnrolmentInvitingClients(data.enrolmentInvitingClients);
      setEnrolmentIGStory(data.enrolmentIGStory);
      setEnrolmentIGFBPost(data.enrolmentIGFBPost);
      setEnrolmentNewCoaches(data.enrolmentNewCoaches);
      setEngagementSOFITevent(data.engagementSOFITevent);
      setEngagementIGFBPost(data.engagementIGFBPost);
      setEngagementVideoShooting(data.engagementVideoShooting);
      setEngagementTeamBuilding(data.engagementTeamBuilding);
      setEngagementSuggestion(data.engagementSuggestion);
      setEngagementRepostStory(data.engagementRepostStory);
      setAdditional1(data.additional1);
      setAdditional2(data.additional2);
      setAdditional3(data.additional3);
      setBonus(data.bonus);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateUserPMS,
    onSuccess: () => {
      // show add success message
      // 显示添加成功消息
      notifications.show({
        title: "PMS updated success",
        color: "green",
      });

      navigate("/performance-management-system");
    },
    onError: (error) => {
      console.log(error);
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleUpdatePMS = async (event) => {
    // 阻止表单默认提交行为
    event.preventDefault();
    // 使用updateMutation mutation来更新商品信息
    updateMutation.mutate({
      id: id,
      data: JSON.stringify({
        // week: week,
        month: month,
        name: name,
        year: year,
        renewalAndReferred1: renewalAndReferred1,
        renewalAndReferred2: renewalAndReferred2,
        renewalAndReferred3: renewalAndReferred3,
        renewalAndReferred4: renewalAndReferred4,
        renewalAndReferred5: renewalAndReferred5,
        sA1InternalMeeting1: sA1InternalMeeting1,
        sA1InternalMeeting2: sA1InternalMeeting2,
        sA1InternalMeeting3: sA1InternalMeeting3,
        sA1InternalMeeting4: sA1InternalMeeting4,
        sA1InternalMeeting5: sA1InternalMeeting5,
        sA2InternalTraining1: sA2InternalTraining1,
        sA2InternalTraining2: sA2InternalTraining2,
        sA2InternalTraining3: sA2InternalTraining3,
        sA2InternalTraining4: sA2InternalTraining4,
        sA2InternalTraining5: sA2InternalTraining5,
        sA3CSAR: sA3CSAR,
        sA4Testimonials1: sA4Testimonials1,
        sA4Testimonials2: sA4Testimonials2,
        sA5RenewalAndReferred1: sA5RenewalAndReferred1,
        sA5RenewalAndReferred2: sA5RenewalAndReferred2,
        sA5RenewalAndReferred3: sA5RenewalAndReferred3,
        sA5RenewalAndReferred4: sA5RenewalAndReferred4,
        contribution: contribution,
        commitment: commitment,
        sBe1Enrolment: sBe1Enrolment,
        enrolmentGoogleReview: enrolmentGoogleReview,
        enrolmentInvitingClients: enrolmentInvitingClients,
        enrolmentInterviewingClients: enrolmentInterviewingClients,
        enrolmentIGStory: enrolmentIGStory,
        enrolmentIGFBPost: enrolmentIGFBPost,
        enrolmentNewCoaches: enrolmentNewCoaches,
        sBe2Engagement: sBe2Engagement,
        engagementSOFITevent: engagementSOFITevent,
        engagementIGStory: engagementIGStory,
        engagementIGFBPost: engagementIGFBPost,
        engagementVideoShooting: engagementVideoShooting,
        engagementTeamBuilding: engagementTeamBuilding,
        engagementSuggestion: engagementSuggestion,
        engagementRepostStory: engagementRepostStory,
        sBe5Core: sBe5Core,
        additional1: additional1,
        additional2: additional2,
        additional3: additional3,
        sectionA: sectionA,
        sectionB: sectionB,
        bonus: bonus,
        total: total,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };

  console.log(handleUpdatePMS);

  // Calculate Commitment
  const calculateCommitment = () => {
    // Initialize total commitment
    let totalCommitment = 0;

    // Calculate commitment for internal meetings and trainings (each input contributes 2%)
    const commitmentInputs = [
      sA1InternalMeeting1,
      sA1InternalMeeting2,
      sA1InternalMeeting3,
      sA1InternalMeeting4,
      sA1InternalMeeting5,
      sA2InternalTraining1,
      sA2InternalTraining2,
      sA2InternalTraining3,
      sA2InternalTraining4,
      sA2InternalTraining5,
    ];

    // Iterate over each input and calculate commitment
    commitmentInputs.forEach((input) => {
      if (input) {
        totalCommitment += 2; // Each input contributes 2% to commitment
      }
    });

    // Calculate commitment for Coaching Session Attendance Rate
    // Here, use the value directly if it's provided, or default to 0 otherwise
    const coachingSessionAttendanceRate = parseFloat(sA3CSAR) || 0;

    // Add points based on coaching session attendance rate
    if (
      coachingSessionAttendanceRate >= 60 &&
      coachingSessionAttendanceRate < 80
    ) {
      totalCommitment += 10;
    } else if (
      coachingSessionAttendanceRate >= 80 &&
      coachingSessionAttendanceRate < 100
    ) {
      totalCommitment += 15;
    } else if (
      coachingSessionAttendanceRate >= 100 &&
      coachingSessionAttendanceRate < 120
    ) {
      totalCommitment += 20;
    } else if (
      coachingSessionAttendanceRate >= 120 &&
      coachingSessionAttendanceRate < 150
    ) {
      totalCommitment += 22;
    } else if (coachingSessionAttendanceRate >= 150) {
      totalCommitment += 24;
    }
    if (totalCommitment > 40) {
      totalCommitment = 40;
    }
    // Return the total commitment
    return totalCommitment;
  };

  const calculateContribution = () => {
    // Initialize total contribution percentage
    let totalContribution = 0;

    const testimonialsPercentage =
      (sA4Testimonials1 ? 6 : 0) + (sA4Testimonials2 ? 6 : 0);

    // Calculate contribution for Renewal & Referred
    let referralPercentage =
      (sA5RenewalAndReferred1 ? 6 : 0) +
      (sA5RenewalAndReferred2 ? 6 : 0) +
      (sA5RenewalAndReferred3 ? 9 : 0) +
      (sA5RenewalAndReferred4 ? 18 : 0);

    // Cap the contribution at 18%
    if (referralPercentage > 18) {
      referralPercentage = 18;
    }
    // Total contribution is the sum of testimonial and referral percentages
    totalContribution = testimonialsPercentage + referralPercentage;

    // Return total contribution percentage
    return totalContribution;
  };

  // Call the functions to calculate commitment and contribution
  const commitment = calculateCommitment();
  const contribution = calculateContribution();

  // Calculate total of Section A (combining commitment and contribution)
  const sectionA = commitment + contribution;

  // Calculate total percentage for Section B
  const calculateEnrolment = () => {
    // Initialize total for Section B
    let totalEnrolment = 0;
    // Calculate Enrolment total
    let sBe1Enrolment =
      (enrolmentGoogleReview ? 5 : 0) +
      (enrolmentInvitingClients ? 5 : 0) +
      (enrolmentInterviewingClients ? 10 : 0) +
      (enrolmentIGStory ? 2 : 0) +
      (enrolmentIGFBPost ? 5 : 0) +
      (enrolmentNewCoaches ? 10 : 0);

    totalEnrolment = sBe1Enrolment;

    if (totalEnrolment > 10) {
      totalEnrolment = 10;
    }
    return totalEnrolment;
  };

  const calculateEngagement = () => {
    let totalEngagement = 0;
    // Calculate Engagement total
    let sBe2Engagement =
      (engagementSOFITevent ? 3 : 0) +
      (engagementIGStory ? 2 : 0) +
      (engagementIGFBPost ? 10 : 0) +
      (engagementVideoShooting ? 8 : 0) +
      (engagementTeamBuilding ? 3 : 0) +
      (engagementSuggestion ? 2 : 0) +
      (engagementRepostStory ? 2 : 0);

    totalEngagement = sBe2Engagement;

    if (totalEngagement > 10) {
      totalEngagement = 10;
    }
    return totalEngagement;
  };

  const sBe2Engagement = calculateEngagement();
  const sBe1Enrolment = calculateEnrolment();
  const sBe5Core = 10;
  const sectionB = sBe1Enrolment + sBe2Engagement + sBe5Core;

  const calculateTotal = () => {
    let total = sectionA + sectionB;
    if (bonus) {
      // Calculate the remaining percentage that can be allocated to the bonus
      const remainingPercentage = 100 - total;
      // Calculate the bonus percentage considering the remaining percentage
      const bonusPercentage = Math.min(bonus, remainingPercentage);
      // Add the bonus percentage to the total
      total += bonusPercentage;
    }
    // Ensure the total doesn't exceed 100%
    if (total > 100) {
      total = 100;
    }
    return total;
  };

  const total = calculateTotal();

  return (
    <Container>
      <>
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
            Performance Management System
          </Title>
          <Text align="center" order={6}>
            Please Enter all details
          </Text>
          <Space h="20px" />
          <Grid grow gutter="xs">
            <Grid.Col span={4}>
              <TextInput
                value={name}
                placeholder="Name"
                label="Name"
                readOnly
              />
            </Grid.Col>

            <Grid.Col span={2}>
              {/* <TextInput
                value={week}
                disabled
                label="Week"
                onChange={(event) => setWeek(event.target.value)}
              /> */}
            </Grid.Col>
            <Grid.Col span={2}></Grid.Col>
            <Grid.Col span={2}>
              <TextInput
                value={year}
                readOnly
                label="Year"
                onChange={(event) => setYear(event.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <TextInput
                value={month}
                readOnly
                label="Month"
                onChange={(event) => setMonth(event.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={6}></Grid.Col>
            <Space h={20} />
            <Grid.Col span={12}>
              <TextInput
                value={renewalAndReferred1}
                label="Renewal And Referred"
                onChange={(event) => setRenewalAndReferred1(event.target.value)}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                value={renewalAndReferred2}
                onChange={(event) => setRenewalAndReferred2(event.target.value)}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                value={renewalAndReferred3}
                onChange={(event) => setRenewalAndReferred3(event.target.value)}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                value={renewalAndReferred4}
                onChange={(event) => setRenewalAndReferred4(event.target.value)}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                value={renewalAndReferred5}
                onChange={(event) => setRenewalAndReferred5(event.target.value)}
              />
            </Grid.Col>
          </Grid>
          <Space h={20} />
          <hr />
          <Space h={20} />
          <Text align="center" order={3} fw={700}>
            Section A
          </Text>
          <Space h={20} />
          <Group position="apart">
            <Text align="center" fz={12} fw={500} td="underline">
              Commitment (40%)
            </Text>
          </Group>
          <Grid grow gutter="xs">
            <Grid.Col span={6}>
              <Grid.Col span={12}>
                <TextInput
                  value={sA1InternalMeeting1}
                  label="Internal Meeting (10%)"
                  onChange={(event) =>
                    setSA1InternalMeeting1(event.target.value)
                  }
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  value={sA1InternalMeeting2}
                  onChange={(event) =>
                    setSA1InternalMeeting2(event.target.value)
                  }
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  value={sA1InternalMeeting3}
                  onChange={(event) =>
                    setSA1InternalMeeting3(event.target.value)
                  }
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  value={sA1InternalMeeting4}
                  onChange={(event) =>
                    setSA1InternalMeeting4(event.target.value)
                  }
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  value={sA1InternalMeeting5}
                  onChange={(event) =>
                    setSA1InternalMeeting5(event.target.value)
                  }
                />
              </Grid.Col>
            </Grid.Col>
            <Grid.Col span={6}>
              <Grid.Col span={12}>
                <TextInput
                  value={sA2InternalTraining1}
                  label="Internal Training (10%)"
                  onChange={(event) =>
                    setSA2InternalTraining1(event.target.value)
                  }
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  value={sA2InternalTraining2}
                  onChange={(event) =>
                    setSA2InternalTraining2(event.target.value)
                  }
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  value={sA2InternalTraining3}
                  onChange={(event) =>
                    setSA2InternalTraining3(event.target.value)
                  }
                />
              </Grid.Col>{" "}
              <Grid.Col span={12}>
                <TextInput
                  value={sA2InternalTraining4}
                  onChange={(event) =>
                    setSA2InternalTraining4(event.target.value)
                  }
                />
              </Grid.Col>{" "}
              <Grid.Col span={12}>
                <TextInput
                  value={sA2InternalTraining5}
                  onChange={(event) =>
                    setSA2InternalTraining5(event.target.value)
                  }
                />
              </Grid.Col>
            </Grid.Col>
            <Grid.Col span={6}>
              <Space h={10} />
              <Text align="center" fz={12} fw={500}>
                ≥ 60 sessions = 2pts
                <br />≥ 80 sessions = 4pts
                <br /> ≥ 100 sessions = 6pts
                <br /> ≥ 120 sessions = 8pts
                <br /> ≥ 150 sessions = 10pts
              </Text>
              <Space h={5} />
              <TextInput
                size="xs"
                value={sA3CSAR}
                label="Coaching Session Attendance Rate (6Points = 20%)"
                onChange={(event) => setSA3CSAR(event.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={6}></Grid.Col>
          </Grid>
          <Space h={20} />
          <Group position="apart">
            <Text align="center" fz={12} fw={500} td="underline">
              Contribution (30%)
            </Text>
          </Group>
          <Group position="apart" c="dimmed">
            <Text align="center" fz={12} fw={500}>
              *if no just empty
            </Text>
          </Group>
          <Grid>
            <Grid.Col span={6}>
              <Grid.Col span={12}>
                <Text align="start" fz={14} fw={500}>
                  Testimonials (1pts = 6% /Each) (Max 2pts)
                </Text>
                <Space h={5} />
                <TextInput
                  value={sA4Testimonials1}
                  label=" "
                  onChange={(event) => setSA4Testimonials1(event.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  value={sA4Testimonials2}
                  label=" "
                  onChange={(event) => setSA4Testimonials2(event.target.value)}
                />
              </Grid.Col>
            </Grid.Col>
            <Grid.Col span={6}>
              <Grid.Col span={12}>
                <Text align="start" fz={14} fw={500}>
                  Renewal & Referred (1pts = 3% /Each) (Max 6pts)
                </Text>
                <Space h={5} />
                <TextInput
                  value={sA5RenewalAndReferred1}
                  label="One Reffered/2pts"
                  onChange={(event) =>
                    setsA5RenewalAndReferred1(event.target.value)
                  }
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  value={sA5RenewalAndReferred2}
                  label="24 Sessions/2pts"
                  onChange={(event) =>
                    setsA5RenewalAndReferred2(event.target.value)
                  }
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  value={sA5RenewalAndReferred3}
                  label="48 Sessions/3pts"
                  onChange={(event) =>
                    setsA5RenewalAndReferred3(event.target.value)
                  }
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  value={sA5RenewalAndReferred4}
                  label="60 Sessions/6pts"
                  onChange={(event) =>
                    setsA5RenewalAndReferred4(event.target.value)
                  }
                />
              </Grid.Col>
            </Grid.Col>
          </Grid>
          <Space h="50px" />
          <Text align="center" fz={16} fw={500}>
            Total : Commitment: {commitment}/40% + Contribution: {contribution}
            /30% = {sectionA}/70%
          </Text>
          <Space h={20} />
          <hr />
          <Space h={20} />
          <Text align="center" order={3} fw={700}>
            Section B
          </Text>
          <Space h={20} />
          <Grid grow gutter="xs">
            <Grid.Col span={6}>
              <Grid.Col span={12}>
                <Group position="apart">
                  <Text align="center" fz={12} fw={500} td="underline">
                    Enrolment (10%)
                  </Text>
                </Group>
                <Space h={5} />
                <TextInput
                  value={enrolmentGoogleReview}
                  label="Google Review [1] 5%"
                  onChange={(event) =>
                    setEnrolmentGoogleReview(event.target.value)
                  }
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  value={enrolmentInvitingClients}
                  label="Inviting Clients [2] 5%"
                  onChange={(event) =>
                    setEnrolmentInvitingClients(event.target.value)
                  }
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  value={enrolmentInterviewingClients}
                  label="Interviewing Clients [3] 10%"
                  onChange={(event) =>
                    setEnrolmentInterviewingClients(event.target.value)
                  }
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  value={enrolmentIGStory}
                  label="IG Story [4] 2%"
                  onChange={(event) => setEnrolmentIGStory(event.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  value={enrolmentIGFBPost}
                  label="IG/FB Post [5] 5%"
                  onChange={(event) => setEnrolmentIGFBPost(event.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  value={enrolmentNewCoaches}
                  label="New Coaches [6] 10%"
                  onChange={(event) =>
                    setEnrolmentNewCoaches(event.target.value)
                  }
                />
              </Grid.Col>
            </Grid.Col>
            <Grid.Col span={6}>
              <Grid.Col span={12}>
                <Group position="apart">
                  <Text align="center" fz={12} fw={500} td="underline">
                    Engagement (10%)
                  </Text>
                </Group>
                <Space h={5} />
                <TextInput
                  value={engagementSOFITevent}
                  label="Joined SOFIT's Event [7] 5%"
                  onChange={(event) =>
                    setEngagementSOFITevent(event.target.value)
                  }
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  value={engagementIGStory}
                  label="IG Story [8] 2%"
                  onChange={(event) => setEngagementIGStory(event.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  value={engagementIGFBPost}
                  label="IG/FB Post [9] 10%"
                  onChange={(event) =>
                    setEngagementIGFBPost(event.target.value)
                  }
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  value={engagementVideoShooting}
                  label="Video Shooting [10] 8%"
                  onChange={(event) =>
                    setEngagementVideoShooting(event.target.value)
                  }
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  value={engagementTeamBuilding}
                  label="Team Building [11] 3%"
                  onChange={(event) =>
                    setEngagementTeamBuilding(event.target.value)
                  }
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  value={engagementSuggestion}
                  label="Suggestion on new Idea [12] 2%"
                  onChange={(event) =>
                    setEngagementSuggestion(event.target.value)
                  }
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  value={engagementRepostStory}
                  label="Repost Story [13] 2%"
                  onChange={(event) =>
                    setEngagementRepostStory(event.target.value)
                  }
                />
              </Grid.Col>
            </Grid.Col>
            <Grid.Col span={6}>
              <Grid.Col span={12}>
                <Group position="apart">
                  <Text align="center" fz={12} fw={500} td="underline">
                    5 Core Values (10%)
                  </Text>
                </Group>
                <Space h={5} />
                <TextInput disabled placeholder="S- Support" />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput disabled placeholder="O- Ownership" />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput disabled placeholder="F - Futuristic" />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput disabled placeholder="I - Inspiring" />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput disabled placeholder="T - Transformative" />
              </Grid.Col>
            </Grid.Col>
            <Grid.Col span={6}></Grid.Col>
          </Grid>
          <Space h="50px" />
          <Text align="center" fz={16} fw={500}>
            Total : Enrolment: {sBe1Enrolment}/10% + Engagement:{" "}
            {sBe2Engagement}
            /10% + 5 Core Values: {sBe5Core}/10% = {sectionB}/30%
          </Text>
          <Space h={20} />
          <hr />
          <Space h={20} />
          <Grid grow gutter="xs">
            <Grid.Col span={6}>
              <Grid.Col span={12}>
                <TextInput
                  value={additional1}
                  label="Additional Contribution:"
                  onChange={(event) => setAdditional1(event.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  value={additional2}
                  onChange={(event) => setAdditional2(event.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  value={additional3}
                  onChange={(event) => setAdditional3(event.target.value)}
                />
              </Grid.Col>
            </Grid.Col>
          </Grid>
          <Grid grow gutter="xs">
            <Grid.Col span={3}>
              <TextInput
                placeholder={` ${sectionA} /70% `}
                disabled
                label="Section A"
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <TextInput
                placeholder={` ${sectionB} /30% `}
                disabled
                label="Section B"
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <TextInput
                value={bonus}
                label="Bonus"
                onChange={(event) => setBonus(event.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <TextInput
                placeholder={` ${total} /100% `}
                disabled
                label="Total"
              />
            </Grid.Col>
          </Grid>
          <Space h="20px" />

          <Checkbox
            checked={checked}
            onChange={(event) => setChecked(event.currentTarget.checked)}
            label={`I (${name}) sure that the content I filled in is true. If it is not true, I am willing to pay legal responsibility for it. `}
          />
          <Space h="60px" />
          <Group position="center">
            <Button disabled={!checked} onClick={handleUpdatePMS}>
              Submit
            </Button>
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
          <Button
            component={Link}
            to="/home"
            variant="subtle"
            size="xs"
            color="gray"
          >
            Home
          </Button>
          <Space h="50px" />
        </Group>
      </>
    </Container>
  );
};

export default PerformanceManagementSystemUpdate;
