"use client";

import { useGetEvents } from "@/utils/api";
import { EventSimple } from "@/utils/api.schemas";
import ApiImage from "@components/ApiImage/ApiImage";
import CreateEventModal from "@components/CreateEventModal/CreateEventModal";
import RichTextRenderer from "@components/Richtext/RichTextRenderer";
import { Button, Center, Container, Flex, Loader, Stack, Table, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";

const ManageEventsPage = () => {
  const [isModalOpen, { open: openModal, close: closeModal }] = useDisclosure(false);

  const { data: upcomingEvents } = useGetEvents();

  // TODO
  const handleDuplicateEvent = (event: EventSimple) => {};

  const rows = upcomingEvents?.map((element, index) => (
    <Table.Tr key={`event-${index}-${element.id}`}>
      <Table.Td p={0} w={128} h={128}>
        <ApiImage src={element.photo?.id} w="100%" h="100%" fit="cover" />
      </Table.Td>
      <Table.Td>{element.title}</Table.Td>
      <Table.Td>
        <RichTextRenderer content={element.shortDescription} />
      </Table.Td>
      <Table.Td>
        <Button>Manage Event</Button>
      </Table.Td>
      <Table.Td>
        <Button>Manage People</Button>
      </Table.Td>
      <Table.Td>
        <Button onClick={() => handleDuplicateEvent(element)}>Duplicate</Button>
      </Table.Td>
      <Table.Td>
        <Button color="red">Delete</Button>
      </Table.Td>
    </Table.Tr>
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
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Photo</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Manage Event</Table.Th>
              <Table.Th>Manage People</Table.Th>
              <Table.Th>Duplicate</Table.Th>
              <Table.Th>Delete</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows ? (
              rows
            ) : (
              <Center>
                <Loader />
              </Center>
            )}
          </Table.Tbody>
        </Table>
      </Stack>
    </Container>
  );
};

export default ManageEventsPage;
