"use client";

import { useGetEventApplications, useGetEvents, useGetUserApplications } from "@/utils/api";
import routes from "@/utils/routes";
import EventCard from "@components/events/EventCard";
import { Anchor, Container, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";
import { useMemo, useState } from "react";

const SentApplicationsPage = () => {
  const now = useMemo(() => {
    return new Date().getTime();
  }, []);
  const { data: upcomingEvents } = useGetUserApplications({ sinceSince: now });
  const { data: pastEvents } = useGetUserApplications({ toSince: now });

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
              upcomingEvents?.map((eventApplication, index) => (
                <Anchor
                  component={Link}
                  key={`event-card-${index}-${eventApplication.id}`}
                  href={routes.EVENT_DETAIL({ id: eventApplication.id })}
                  underline="never"
                >
                  <EventCard event={eventApplication.event} />
                </Anchor>
              ))
            ) : (
              <Text>No upcoming events...</Text>
            )}
          </Stack>
        )}
        {pastEvents && (
          <Stack>
            <Title order={2} size="xl">
              Past Events
            </Title>
            {pastEvents?.length >= 1 ? (
              pastEvents?.map((eventApplication, index) => (
                <Anchor
                  component={Link}
                  key={`event-card-${index}-${eventApplication.id}`}
                  href={routes.EVENT_DETAIL({ id: eventApplication.id })}
                  underline="never"
                >
                  <EventCard event={eventApplication.event} />
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
