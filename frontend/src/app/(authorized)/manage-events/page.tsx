"use client";

import { useGetEvents } from "@/utils/api";
import { truncate } from "@/utils/truncate";
import CreateEventModal from "@components/CreateEventModal/CreateEventModal";
import {
  Button,
  Container,
  Flex,
  Image,
  Stack,
  Table,
  TableTbody,
  TableTd,
  TableThead,
  TableTr,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";

const ManageEventsPage = () => {
  const [isModalOpen, { open: openModal, close: closeModal }] = useDisclosure(false);

  const data = useGetEvents();
  console.log("data", data.data);

  const elements = [
    {
      photo: 6,
      name: "NA Test",
      description:
        "This is a very long description fetched from the database. It contains a lot of information that might be irrelevant to show completely.",
    },
    {
      photo: 7,
      name: "NA Test",
      description:
        "This is a very long description fetched from the database. It contains a lot of information that might be irrelevant to show completely.",
    },
    {
      photo: 39,
      name: "NA Test",
      description:
        "This is a very long description fetched from the database. It contains a lot of information that might be irrelevant to show completely.",
    },
    {
      photo: 56,
      name: "NA Test",
      description:
        "This is a very long description fetched from the database. It contains a lot of information that might be irrelevant to show completely.",
    },
    {
      photo: 58,
      name: "NA Test",
      description:
        "This is a very long description fetched from the database. It contains a lot of information that might be irrelevant to show completely.",
    },
  ];

  const rows = elements.map((element) => (
    <TableTr key={element.name}>
      <TableTd>
        <Image
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
          h={75}
          alt={element.name}
          fit="contain"
        />
      </TableTd>
      <TableTd>{element.name}</TableTd>
      <TableTd>{truncate(element.description, 50)}</TableTd>
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
        <Button color="red">Delete</Button>
      </TableTd>
    </TableTr>
  ));

  return (
    <Container size="xl">
      <Stack>
        <Flex justify="space-between" align="center" w="100%">
          <Title>Manage Events</Title>
          <Button onClick={openModal} leftSection={<IconPlus />}>
            Add Event
          </Button>
          <CreateEventModal isOpened={isModalOpen} closeModal={closeModal} />
        </Flex>
        <Table
          withTableBorder
          withColumnBorders
          withRowBorders
          striped
          highlightOnHover={true}
          style={{ textAlign: "center" }}
        >
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
