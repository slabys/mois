"use client";

import { createEvent, useCreateEvent, useGetEvents } from "@/utils/api";
import { CreateEvent, EventSimple } from "@/utils/api.schemas";
import { truncate } from "@/utils/truncate";
import CreateEventModal from "@components/CreateEventModal/CreateEventModal";
import RichTextRenderer from "@components/Richtext/RichTextRenderer";
import {
  Button,
  Center,
  Container,
  Flex,
  Image,
  Loader,
  Stack,
  Table,
  TableTbody,
  TableTd,
  TableThead,
  TableTr,
  Title,
} from "@mantine/core";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";

const ManageEventsPage = () => {
  const [isModalOpen, { open: openModal, close: closeModal }] = useDisclosure(false);

  const { data: upcomingEvents } = useGetEvents();

  const handleDuplicateEvent = (event: EventSimple) => {};

  let rows;

  if (upcomingEvents) {
    rows = upcomingEvents.map((element) => (
      <TableTr key={element.title}>
        <TableTd>
          <Image src={element.photo} h={75} alt={element.title} fit="contain" />
        </TableTd>
        <TableTd>{element.title}</TableTd>
        <TableTd>
          <RichTextRenderer content={element.shortDescription} />
        </TableTd>
        <TableTd>
          <Button>Manage Event</Button>
        </TableTd>
        <TableTd>
          <Button>Manage People</Button>
        </TableTd>
        <TableTd>
          <Button onClick={() => handleDuplicateEvent(element)}>Duplicate</Button>
        </TableTd>
        <TableTd>
          <Button color="red">Delete</Button>
        </TableTd>
      </TableTr>
    ));
  }

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
          <TableTbody>
            {rows ? (
              rows
            ) : (
              <Center>
                <Loader />
              </Center>
            )}
          </TableTbody>
        </Table>
      </Stack>
    </Container>
  );
};

export default ManageEventsPage;
