import { getGetEventApplicationsQueryKey, getGetEventsQueryKey, useGetEventApplications } from "@/utils/api";
import { EventSimple } from "@/utils/api.schemas";
import { Container, Stack, Title } from "@mantine/core";

const ManageEventApplications = () => {
  return (
    <Container size="xl">
      <Stack>
        <Title>Manage People</Title>
      </Stack>
    </Container>
  );
};

export const revalidate = 60;

// const UseFetchEventApplications = async () => {
//   const queryKey = getGetEventApplicationsQueryKey(id);
//   const events: EventSimple[] = await fetch(`${process.env.NEXT_PUBLIC_APP1_URL}${queryKey[0]}`).then((res) =>
//     res.json(),
//   );
//
//   return events.map((event) => {
//     return {
//       id: event.id.toString(),
//     };
//   });
// };
//
// export async function generateStaticParams() {
//   return UseFetchEventApplications();
// }

export default ManageEventApplications;
