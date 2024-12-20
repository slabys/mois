"use client";

import { useAllOrganizations } from "@/utils/api";
import CreateOrganizationModal from "@components/CreateOrganizationModal/CreateOrganizationModal";
import { ActionIcon, Button, Container, Flex, ScrollArea, Stack, Table, Text, Title, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";

const ManageOrganizationsPage = () => {
  const [isAddOrganizationModalOpen, { open: openAddOrganizationModal, close: closeAddOrganizationModal }] =
    useDisclosure(false);

  const { data: organizationsList, refetch: refetchOrganizationsList } = useAllOrganizations();

  const rows = organizationsList?.map((organization, index) => (
    <Table.Tr key={`event-${index}-${organization.id}`}>
      <Table.Td>{organization.name}</Table.Td>
      <Table.Td>
        {organization.address.street +
          " " +
          organization.address.houseNumber +
          ", " +
          organization.address.zip +
          " " +
          organization.address.city +
          ", " +
          organization.address.country}
      </Table.Td>
      {organization.manager ? (
        <>
          <Table.Td>{organization.manager.firstName + " " + organization.manager.lastName}</Table.Td>
          <Table.Td>{organization.manager.username}</Table.Td>
        </>
      ) : (
        <>
          <Table.Td>-</Table.Td>
          <Table.Td>-</Table.Td>
        </>
      )}
      <Table.Td>
        <Flex justify="space-around" gap={16}>
          <Tooltip label="Edit Organization">
            <ActionIcon>
              <IconEdit width={32} height={32} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete Organization">
            {/*TODO - delete organization*/}
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
          <Title>Manage Organizations</Title>
          <Button onClick={openAddOrganizationModal} leftSection={<IconPlus />}>
            Add Organization
          </Button>
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
                    Name
                  </Table.Th>
                  <Table.Th w={148} miw={148}>
                    Address
                  </Table.Th>
                  <Table.Th w={148} miw={148}>
                    Manager&apos;s Name
                  </Table.Th>
                  <Table.Th w={148} miw={148}>
                    Manager&apos;s Username
                  </Table.Th>
                  <Table.Th w={200}>Operations</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          ) : (
            <Text>No Organizations...</Text>
          )}
        </ScrollArea>
      </Stack>
      <CreateOrganizationModal
        onCreateSuccess={refetchOrganizationsList}
        isOpened={isAddOrganizationModalOpen}
        closeModal={closeAddOrganizationModal}
      />
    </Container>
  );
};
export default ManageOrganizationsPage;
