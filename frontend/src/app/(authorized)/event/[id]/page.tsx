import { getGetEventsQueryKey } from "@/utils/api";
import { EventSimple } from "@/utils/api.schemas";
import EventDetail from "@components/events/EventDetail";
import { Container } from "@mantine/core";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

const EventDetailPage = async ({ params }: EventDetailPageProps) => {
  const { id } = await params;
  const parsedId = Number.parseInt(id);
  return (
    <Container size="xl">
      <EventDetail id={parsedId} />
    </Container>
  );
};

export const revalidate = 60;

const UseFetchAllEvents = async () => {
  const queryKey = getGetEventsQueryKey();
  const events: EventSimple[] = await fetch(`${process.env.NEXT_PUBLIC_APP1_URL}${queryKey[0]}`).then((res) =>
    res.json(),
  );

  if (!events) {
    return [];
  }

  return events.map((event) => {
    return {
      id: event.id.toString(),
    };
  });
};

export async function generateStaticParams() {
  return UseFetchAllEvents();
}

export default EventDetailPage;
