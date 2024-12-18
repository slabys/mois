"use client";

import { useGetEvents } from "@/utils/api";
import routes from "@/utils/routes";
import EventCard from "@components/events/EventCard";
import { Anchor, Container, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";

const SentApplicationsPage = () => {
  const { data: upcomingEvents } = useGetEvents();

  return (
    <Container size="xl">
      <Stack>
        <Title>Sent Applications</Title>
        {upcomingEvents && (
          <Stack>
            <Title order={2} size="xl">
              Upcoming Events
            </Title>
            {upcomingEvents?.length >= 1 ? (
              upcomingEvents?.map((event, index) => (
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
              <Text>No upcoming events...</Text>
            )}
          </Stack>
        )}
        {upcomingEvents && (
          <Stack>
            <Title order={2} size="xl">
              Past Events
            </Title>
            {upcomingEvents?.length >= 1 ? (
              upcomingEvents?.map((event, index) => (
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
              <Text>No past events...</Text>
            )}
          </Stack>
        )}
      </Stack>
    </Container>
  );
};

export default SentApplicationsPage;
