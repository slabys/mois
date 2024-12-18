"use client";

import {useGetEventApplications, useGetEventSpots, useUpdateEventApplication, useUpdateEventSpot} from "@/utils/api";
import CreateSpotModal from "@components/CreateSpotModal/CreateSpotModal";
import { Button, ComboboxData, ComboboxItem, Flex, Select, Table, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";

interface ManageApplicationsTableProps {
  eventId: number;
}

const ManageApplicationsTable = ({ eventId }: ManageApplicationsTableProps) => {
  const { data: eventApplications } = useGetEventApplications(eventId);
  const [isModalOpen, { open: openModal, close: closeModal }] = useDisclosure(false);

  const { data: eventSpots } = useGetEventSpots(eventId);

  const spots: ComboboxData =
    eventSpots?.map((spot) => {
      return { value: spot.id.toString(), label: spot.name };
    }) ?? [];

  const [value, setValue] = useState<ComboboxItem | null>(null);

  //TODO: update user mutation
  const updateApplicationMutation = useUpdateEventApplication({
      mutation: {
          onMutate: () => {
              notifications.show({
                  id: "event-photo-update",
                  loading: true,
                  title: "Loading! Please wait...",
                  message: "We are application spots.",
                  autoClose: false,
              });
          },
          onSuccess: () => {
              notifications.update({
                  id: "event-photo-update",
                  title: "Update User Photo",
                  message: "Application spot updated successfully.",
                  color: "green",
                  loading: false,
                  autoClose: true,
              });
              setFile(null);
              closeModal();
          },
          onError: (mutationError) => {
              if (!mutationError.response?.data) return;
              const { statusCode, error, message } = mutationError.response?.data;
              console.error(statusCode, error, message);
              notifications.update({
                  id: "event-photo-update",
                  title: "Something went wrong.",
                  message: "Please check all information first. Then try again.",
                  color: "red",
                  loading: false,
                  autoClose: true,
              });
              let parsedMessage: string[] = [];
              if (typeof message === "string") {
                  parsedMessage.push(message);
              }
              parsedMessage.forEach((err) => {
                  notifications.show({
                      title: `${statusCode} ${error}`,
                      message: err,
                      color: "red",
                  });
              });
          },
      },
  });
  })

  //TODO: hanlde spot change
  //const handleSpotChange = () => {}

  const rows = eventApplications?.map((element, index) => (
    <Table.Tr key={`application-${index}-${element.id}`}>
      <Table.Td>{element.user.firstName + " " + element.user.lastName}</Table.Td>
      <Table.Td>-</Table.Td>
      <Table.Td>{element.organization?.address.country}</Table.Td>
      <Table.Td>
        <Select
          defaultValue={element.spotType?.name}
          data={spots}
          searchable
          nothingFoundMessage="Nothing found..."
          allowDeselect
          onChange={(_value, option) => setValue(option)}
        />
      </Table.Td>
      <Table.Td>{element.spotType?.price}</Table.Td>
      <Table.Td>
        <Button>Edit</Button>
      </Table.Td>
      <Table.Td>
        <Button color="red">Delete</Button>
      </Table.Td>
    </Table.Tr>
  ));
  console.log(rows);

  return (
    <>
      <Flex justify="space-between" align="center" w="100%">
        <Title>Manage Event Applications - {eventId}</Title>
        <Button onClick={openModal} leftSection={<IconPlus />}>
          Add Spot
        </Button>
        <CreateSpotModal eventId={eventId} isOpened={isModalOpen} closeModal={closeModal} />
      </Flex>
      {rows && rows?.length > 0 ? (
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
              <Table.Th>First and Last Name</Table.Th>
              <Table.Th>Section</Table.Th>
              <Table.Th>Country</Table.Th>
              <Table.Th>Spot type</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>Edit</Table.Th>
              <Table.Th>Delete</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      ) : (
        <Text>No applications found.</Text>
      )}
    </>
  );
};

export default ManageApplicationsTable;
