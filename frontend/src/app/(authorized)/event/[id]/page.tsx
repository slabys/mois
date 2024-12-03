import { EventSimple } from "@/utils/api.schemas";
import EventDetail from "@components/events/EventDetail";
import { Container } from "@mantine/core";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

const EventDetailPage = async ({ params }: EventDetailPageProps) => {
  const { id } = await params;
  return (
    <Container my="md">
      <EventDetail id={id} />
    </Container>
  );
};

export const revalidate = 60;

const UseFetchAllEvents = async () => {
  const upcomingEvents: EventSimple[] = await fetch(`${process.env.NEXT_PUBLIC_APP1_URL}/events/upcoming`).then((res) =>
    res.json(),
  );
  return upcomingEvents.map((event) => {
    return {
      id: event.id,
    };
  });
};

export async function generateStaticParams() {
  const eventsPaths = UseFetchAllEvents();
  return eventsPaths;
}

export default EventDetailPage;
