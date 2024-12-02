"use client";

import { useUpcomingEvents } from "@/utils/api";
import routes from "@/utils/routes";
import EventSummaryCard from "@components/homepage/EventSummaryCard";
import { Anchor, Container, Stack, Text, Title } from "@mantine/core";

const Home = () => {
  const { data: upcomingEvents } = useUpcomingEvents();
  return (
    <Container size="xl">
      <Stack>
        <Title>Upcoming Events</Title>
        {upcomingEvents && (
          <Stack>
            {upcomingEvents?.length >= 0 ? (
              upcomingEvents?.map((event, index) => (
                <Anchor
                  key={`event-card-${index}-${event.id}`}
                  href={routes.EVENT_DETAIL({ id: event.id })}
                  underline="never"
                >
                  <EventSummaryCard event={event} />
                </Anchor>
              ))
            ) : (
              <Text>No upcoming events</Text>
            )}
          </Stack>
        )}
      </Stack>
    </Container>
  );
};

export default Home;
