"use client";

import { useAllOrganizations } from "@/utils/api";
import type { Organization } from "@/utils/api.schemas";
import routes from "@/utils/routes";
import CreateOrganizationModal from "@components/CreateOrganizationModal/CreateOrganizationModal";
import UpdateOrganizationModal from "@components/UpdateOrganizationModal/UpdateOrganizationModal";
import { ActionIcon, Button, Container, Flex, ScrollArea, Stack, Table, Text, Title, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconPlus, IconTrash, IconUsersGroup } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

const ManageOrganizationsPage = () => {
  const [isCreateOrganizationModalOpen, { open: openAddOrganizationModal, close: closeAddOrganizationModal }] =
    useDisclosure(false);
  const [isUpdateOrganizationModalOpen, { open: openUpdateOrganizationModal, close: closeUpdateOrganizationModal }] =
    useDisclosure(false);

  const [activeOrganisation, setActiveOrganisation] = useState<Organization | null>(null);

  const { data: organisationsList, refetch: refetchOrganisationsList } = useAllOrganizations();

  const handleRefetch = () => {
    setActiveOrganisation(null);
    refetchOrganisationsList();
  };

  const rows = organisationsList?.map((organization, index) => (
    <Table.Tr key={`event-${index}-${organization.id}`}>
      <Table.Td>{organization.name}</Table.Td>
      <Table.Td>{organization.cin}</Table.Td>
      <Table.Td>
        <Flex direction="column" justify="start" align="start">
          <Text>{`${organization.address.street} ${organization.address.houseNumber}`}</Text>
          <Text>{`${organization.address.zip}, ${organization.address.city}`}</Text>
          <Text>{organization.address.country}</Text>
        </Flex>
      </Table.Td>
      {organization.manager ? (
        <>
          <Table.Td>{`${organization.manager.firstName} ${organization.manager.lastName}`}</Table.Td>
          <Table.Td>{organization.manager.username}</Table.Td>
        </>
      ) : (
        <>
          <Table.Td>N/A</Table.Td>
          <Table.Td>N/A</Table.Td>
        </>
      )}
      <Table.Td>
        <Flex justify="space-evenly" gap={16}>
          <Tooltip label="Organization Members">
            <ActionIcon
              component={Link}
              href={routes.ORGANIZATION_MEMBERS({ id: organization.id })}
              variant="subtle"
              size={48}
              color="black"
            >
              <IconUsersGroup width={32} height={32} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Edit Organization">
            <ActionIcon
              variant="subtle"
              size={48}
              color="blue"
              onClick={() => {
                setActiveOrganisation(organization);
                openUpdateOrganizationModal();
              }}
            >
              <IconEdit width={32} height={32} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete Organization">
            {/*TODO - delete organization*/}
            <ActionIcon variant="subtle" size={48} color="red" disabled>
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
                  <Table.Th h="100%" miw={96} maw={128}>
                    Name
                  </Table.Th>
                  <Table.Th miw={64} maw={64}>
                    CIN
                  </Table.Th>
                  <Table.Th miw={148} maw={148}>
                    Address
                  </Table.Th>
                  <Table.Th miw={148} maw={148}>
                    Manager&apos;s Name
                  </Table.Th>
                  <Table.Th miw={148} maw={148}>
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
        handleSuccess={handleRefetch}
        isOpened={isCreateOrganizationModalOpen}
        closeModal={closeAddOrganizationModal}
      />
      {activeOrganisation && (
        <UpdateOrganizationModal
          activeOrganization={activeOrganisation}
          handleSuccess={handleRefetch}
          isOpened={isUpdateOrganizationModalOpen}
          closeModal={closeUpdateOrganizationModal}
        />
      )}
    </Container>
  );
};
export default ManageOrganizationsPage;
