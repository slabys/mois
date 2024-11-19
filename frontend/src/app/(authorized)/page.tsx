import EventSummaryCard from "@components/homepage/EventSummaryCard";
import { Container, Stack, Title } from "@mantine/core";

const Home = () => {
  return (
    <Container size="xl">
      <Stack>
        <Title>Upcoming Events</Title>
        <Stack>
          <EventSummaryCard />
          <EventSummaryCard />
          <EventSummaryCard />
        </Stack>
      </Stack>
    </Container>
  );
};

export default Home;
