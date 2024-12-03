import EventDetail from "@components/events/EventDetail";
import { Container } from "@mantine/core";

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

const EventDetailPage = async ({ params }: EventDetailPageProps) => {
  const { slug } = await params;
  return (
    <Container my="md">
      {slug}
      <EventDetail />
    </Container>
  );
};

export default EventDetailPage;
