"use client";

import { useGetManagementEvents } from "@/utils/api";
import { EventSimple } from "@/utils/api.schemas";
import routes from "@/utils/routes";
import ApiImage from "@components/ApiImage/ApiImage";
import CreateEventModal from "@components/CreateEventModal/CreateEventModal";
import RichTextRenderer from "@components/Richtext/RichTextRenderer";
import { ActionIcon, Button, Container, Flex, ScrollArea, Stack, Table, Text, Title, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCopy, IconPlus, IconTrash, IconZoom } from "@tabler/icons-react";
import Link from "next/link";

const ManageEventsPage = () => {
  const [isModalOpen, { open: openModal, close: closeModal }] = useDisclosure(false);

  const { data: eventList, refetch } = useGetManagementEvents();

  // TODO
  const handleDuplicateEvent = (_event: EventSimple) => {};

  const rows = eventList?.map((event, index) => (
    <Table.Tr key={`event-${index}-${event.id}`}>
      <Table.Td p={0}>
        <ApiImage src={event.photo?.id} w="100%" h="100%" fit="cover" />
      </Table.Td>
      <Table.Td>{event.title}</Table.Td>
      <Table.Td>
        <RichTextRenderer content={event.shortDescription} lineClamp={2} />
      </Table.Td>
      <Table.Td>
        <Flex justify="space-between" gap={16}>
          <Tooltip label="Event Detail">
            <ActionIcon component={Link} href={routes.EVENT_DETAIL({ id: event.id })} variant="subtle" size={48}>
              <IconZoom width={32} height={32} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Duplicate Event">
            {/*TODO - duplicate EP*/}
            <ActionIcon variant="subtle" color="purple" size={48} onClick={() => handleDuplicateEvent(event)}>
              <IconCopy width={32} height={32} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete Event">
            {/*TODO - Delete EP*/}
            <ActionIcon variant="subtle" size={48} color="red">
              <IconTrash width={32} height={32} />
            </ActionIcon>
          </Tooltip>
        </Flex>
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
          <CreateEventModal onCreateSuccess={refetch} isOpened={isModalOpen} closeModal={closeModal} />
        </Flex>
        <ScrollArea w="100%">
          {rows && rows.length > 0 ? (
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
                  <Table.Th h="100%" maw={64} w={64}>
                    Photo
                  </Table.Th>
                  <Table.Th w={148} miw={148}>
                    Event Name
                  </Table.Th>
                  <Table.Th w="60%" h={64}>
                    Short Description
                  </Table.Th>
                  <Table.Th w={200}>Operations</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          ) : (
            <Text>No Events...</Text>
          )}
        </ScrollArea>
      </Stack>
    </Container>
  );
};

export default ManageEventsPage;
