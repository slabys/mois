"use client";

import { useUpcomingEvents } from "@/utils/api";
import routes from "@/utils/routes";
import EventCard from "@components/events/EventCard";
import { Anchor, Container, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";

const SentApplicationsPage = () => {
  const { data: upcomingEvents } = useUpcomingEvents();

  return (
    <Container size="xl">
      <Stack>
        <Title>Sent Applications</Title>
        {upcomingEvents && (
          <Stack>
            <Text size="xl">Upcomming Events</Text>
            {upcomingEvents?.length >= 0 ? (
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
              <Text>No upcoming events</Text>
            )}
          </Stack>
        )}
        {upcomingEvents && (
          <Stack>
            <Text size="xl">Past Events</Text>
            {upcomingEvents?.length >= 0 ? (
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
              <Text>No upcoming events</Text>
            )}
          </Stack>
        )}
      </Stack>
    </Container>
  );
};

export default SentApplicationsPage;
