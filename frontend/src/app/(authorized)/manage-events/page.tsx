import type { Event } from "@/utils/api.schemas";
import { Button, Container, Image, Stack, Table, TableTbody, TableTd, TableThead, TableTr, Title } from "@mantine/core";

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

const ManageEventsPage = () => {
  const elements = [
    { photo: 6, name: 12.011, description: "C" },
    { photo: 7, name: 14.007, description: "N" },
    { photo: 39, name: 88.906, description: "Y" },
    { photo: 56, name: 137.33, description: "Ba" },
    { photo: 58, name: 140.12, description: "Ce" },
  ];

  const rows = elements.map((element) => (
    <tr key={element.name}>
      <TableThead>
        <Image
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
          h={75}
          w="auto"
          fit="contain"
        />
      </TableThead>
      <TableTd>{element.description}</TableTd>
      <TableTd>{element.description}</TableTd>
      <TableTd>
        <Button>Manage Event</Button>
      </TableTd>
      <TableTd>
        <Button>Manage People</Button>
      </TableTd>
      <TableTd>
        <Button>Duplicate</Button>
      </TableTd>
      <TableTd>
        <Button>Delete</Button>
      </TableTd>
    </tr>
  ));

  return (
    <Container size="xl">
      <Stack>
        <Title>Manage Events</Title>
        <Table withTableBorder withColumnBorders withRowBorders>
          <TableThead>
            <TableTr>
              <TableTd>Photo</TableTd>
              <TableTd>Name</TableTd>
              <TableTd>Description</TableTd>
              <TableTd>Manage Event</TableTd>
              <TableTd>Manage People</TableTd>
              <TableTd>Duplicate</TableTd>
              <TableTd>Delete</TableTd>
            </TableTr>
          </TableThead>
          <TableTbody>{rows}</TableTbody>
        </Table>
      </Stack>
    </Container>
  );
};

export default ManageEventsPage;
