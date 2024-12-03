import type { Event } from "@/utils/api.schemas";
import routes from "@/utils/routes";
import EventCard from "@components/events/EventCard";
import { Anchor, Container, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";

const mockData: Event[] = [
  {
    id: "d6f51ab3-4f5e-4542-9ae8-b0b25084c71a",
    slug: "na-test",
    title: "NA Test",
    description: "NA Test Description",
    since: "2024-12-06T20:39:11.000Z",
    until: "2024-12-08T20:39:18.000Z",
    createdAt: "2024-12-01T19:42:48.132Z",
    createdBy: {
      id: "1",
      createdAt: "2024-12-01T19:42:41.274Z",
      organization: {
        id: "0",
        name: "ESN Hradec Králové",
        createdAt: "2024-12-01T20:27:07.000Z",
      },
      user: {
        id: "a6486560-977d-4eae-8d86-d31a68a8bb21",
        email: "test@test.cz",
        username: "string",
        firstName: "Test",
        lastName: "string",
        createdAt: "2024-11-19T20:43:43.048Z",
        updatedAt: "2024-12-02T00:34:25.196Z",
        photo: {
          id: "4666bd02-7678-4c92-989c-669afef39291",
          filename: "user_photo/4352d323-2ea3-4836-b981-8a1d7dec6e35",
          createdAt: "2024-12-02T00:15:24.605Z",
        },
      },
      roles: [],
    },
    photo: null,
  },
];

const SentApplicationsPage = () => {
  return (
    <Container size="xl">
      <Stack>
        <Title>Sent Applications</Title>
        {mockData && (
          <Stack>
            {mockData?.length >= 0 ? (
              mockData?.map((event, index) => (
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
