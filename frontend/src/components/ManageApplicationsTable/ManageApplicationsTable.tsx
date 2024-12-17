"use client";

import { useGetEventApplications } from "@/utils/api";
import { Button, Center, Select, Table, Text } from "@mantine/core";

interface ManageApplicationsTableProps {
  eventId: number;
}

const ManageApplicationsTable = ({ eventId }: ManageApplicationsTableProps) => {
  const { data: eventApplications } = useGetEventApplications(eventId);
  //return eventApplications?.length;

  const rows = eventApplications?.map((element, index) => (
    <Table.Tr key={`application-${index}-${element.id}`}>
      <Table.Td>{element.user.firstName + element.user.lastName}</Table.Td>
      <Table.Td>-</Table.Td>
      <Table.Td>{element.organization?.country}</Table.Td>
      <Table.Td>
        <Select placeholder={element.spotType?.name} data={["React", "Angular", "Vue", "Svelte"]} />
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
              <Table.Td>First and Last Name</Table.Td>
              <Table.Td>Section</Table.Td>
              <Table.Td>Country</Table.Td>
              <Table.Td>Spot type</Table.Td>
              <Table.Td>Price</Table.Td>
              <Table.Td>Edit</Table.Td>
              <Table.Td>Delete</Table.Td>
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
