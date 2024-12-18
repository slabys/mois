import { getGetEventsQueryKey } from "@/utils/api";
import { EventSimple } from "@/utils/api.schemas";
import ManageApplicationsTable from "@components/ManageApplicationsTable/ManageApplicationsTable";
import { Container, Stack } from "@mantine/core";

interface ManageEventApplicationsProps {
  params: Promise<{ id: string }>;
}

const ManageEventApplications = async ({ params }: ManageEventApplicationsProps) => {
  const { id } = await params;

  return (
    <Container size="xl">
      <Stack>
        <ManageApplicationsTable eventId={Number.parseInt(id)} />
      </Stack>
    </Container>
  );
};

export const revalidate = 60;

const UseFetchEventApplications = async () => {
  const queryKey = getGetEventsQueryKey();
  const events: EventSimple[] = await fetch(`${process.env.NEXT_PUBLIC_APP1_URL}${queryKey[0]}`).then((res) =>
    res.json(),
  );

  return events.map((event) => {
    return {
      id: event.id.toString(),
    };
  });
};

export async function generateStaticParams() {
  return UseFetchEventApplications();
}

export default ManageEventApplications;
