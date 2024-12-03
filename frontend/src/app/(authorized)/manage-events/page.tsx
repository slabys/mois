"use client";

import { useUpcomingEvents } from "@/utils/api";
import type { Event } from "@/utils/api.schemas";
import {
  Anchor,
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
import { IconPlus } from "@tabler/icons-react";

const ManageEventsPage = () => {
  const data = useUpcomingEvents();
  console.log("data", data.data);

  const elements = [
    { photo: 6, name: "NA Test", description: "NA Test Description" },
    { photo: 7, name: "NA Test", description: "NA Test Description" },
    { photo: 39, name: "NA Test", description: "NA Test Description" },
    { photo: 56, name: "NA Test", description: "NA Test Description" },
    { photo: 58, name: "NA Test", description: "NA Test Description" },
  ];

  const rows = elements.map((element) => (
    <TableTr key={element.name}>
      <TableTd>
        <Image
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
          h={75}
          fit="contain"
        />
      </TableTd>
      <TableTd>{element.name}</TableTd>
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
        <Button color="red">Delete</Button>
      </TableTd>
    </TableTr>
  ));

  return (
    <Container size="xl">
      <Stack>
        <Title>Manage Events</Title>
        <Flex justify="end" w="100%">
          <Anchor display="flex">
            <IconPlus />
            Add Event
          </Anchor>
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
