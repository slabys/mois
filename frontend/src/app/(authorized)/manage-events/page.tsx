"use client";

import { useDuplicateEvent, useGetManagementEvents } from "@/utils/api";
import { EventSimple } from "@/utils/api.schemas";
import routes from "@/utils/routes";
import ApiImage from "@components/ApiImage/ApiImage";
import CreateEventModal from "@components/CreateEventModal/CreateEventModal";
import RichTextRenderer from "@components/Richtext/RichTextRenderer";
import { ActionIcon, Button, Container, Flex, ScrollArea, Stack, Table, Text, Title, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconCopy, IconPlus, IconTrash, IconX, IconZoom } from "@tabler/icons-react";
import Link from "next/link";

const ManageEventsPage = () => {
  const [isModalOpen, { open: openModal, close: closeModal }] = useDisclosure(false);

  const duplicateEventMutation = useDuplicateEvent({
    mutation: {
      onMutate: () => {
        notifications.show({
          id: "event-duplicate-mutation",
          loading: true,
          title: "Loading! Please wait...",
          message: "We are duplicating event.",
          autoClose: false,
        });
      },
      onSuccess: () => {
        notifications.update({
          id: "event-duplicate-mutation",
          title: "Event Duplication",
          message: "Event was duplicated successfully.",
          color: "green",
          loading: false,
          autoClose: true,
        });
        refetchManagementEvents();
      },
      onError: (error) => {
        notifications.update({
          id: "event-duplicate-mutation",
          title: "Something went wrong.",
          message: "Please check all information first. Then try again.",
          color: "red",
          loading: false,
          autoClose: true,
        });
        if (error.response?.data && error.response.data.message) {
          (error.response.data.message as string[]).forEach((err) => {
            notifications.show({
              title: "Error",
              message: err,
              color: "red",
            });
          });
        }
      },
    },
  });
  const { data: eventList, refetch: refetchManagementEvents } = useGetManagementEvents();

  const handleDuplicateEvent = (event: EventSimple) => {
    duplicateEventMutation.mutate({ id: event.id });
  };

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
        {event.visible ? (
          <Tooltip label="Unpublished">
            <IconX color="red" />
          </Tooltip>
        ) : (
          <Tooltip label="Published">
            <IconCheck color="green" />
          </Tooltip>
        )}
      </Table.Td>
      <Table.Td>
        <Flex justify="space-between" gap={16}>
          <Tooltip label="Event Detail">
            <ActionIcon component={Link} href={routes.EVENT_DETAIL({ id: event.id })} variant="subtle" size={48}>
              <IconZoom width={32} height={32} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Duplicate Event">
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
          <CreateEventModal onCreateSuccess={refetchManagementEvents} isOpened={isModalOpen} closeModal={closeModal} />
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
                  <Table.Th w={56}>Published?</Table.Th>
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
