"use client";

import { useUpcomingEvents } from "@/utils/api";
import routes from "@/utils/routes";
import EventCard from "@components/events/EventCard";
import { Anchor, Center, Container, Loader, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";

const Home = () => {
  const { data: upcomingEvents } = useUpcomingEvents();

  return (
    <Container size="xl">
      <Stack>
        <Title>Upcoming Events</Title>
        {upcomingEvents ? (
          <Stack>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, index) => (
                <Anchor
                  component={Link}
                  key={`event-card-${index}-${event.id}`}
                  href={routes.EVENT_DETAIL({ id: event.id })}
                  underline="never"
                >
                  <EventCard event={event} />
                </Anchor>
              ))
            ) : (
              <Text>No upcoming events</Text>
            )}
          </Stack>
        ) : (
          <Center>
            <Loader />
          </Center>
        )}
      </Stack>
    </Container>
  );
};

export default Home;
