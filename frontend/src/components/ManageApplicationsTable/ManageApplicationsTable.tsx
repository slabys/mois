"use client";

import { useGetEventApplications, useGetEventSpots } from "@/utils/api";
import CreateSpotModal from "@components/CreateSpotModal/CreateSpotModal";
import { Button, ComboboxData, ComboboxItem, Flex, Select, Table, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
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
  //const updateUserSpotMutation =
  //TODO: hanlde spot change
  //const handleSpotChange = () => {}

  const rows = eventApplications?.map((element, index) => (
    <Table.Tr key={`application-${index}-${element.id}`}>
      <Table.Td>{element.user.firstName + " " + element.user.lastName}</Table.Td>
      <Table.Td>-</Table.Td>
      <Table.Td>{element.organization?.country}</Table.Td>
      <Table.Td>
        <Select
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
