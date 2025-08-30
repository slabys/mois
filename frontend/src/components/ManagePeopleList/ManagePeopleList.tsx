"use client";

import { useGenerateSheetUsers, useGetAllUsers, useGetCurrentUser } from "@/utils/api";
import { RolePermissionsItem, User } from "@/utils/api.schemas";
import { downloadFile } from "@/utils/downloadFile";
import ChangeRoleModal from "@components/modals/ChangeRoleModal/ChangeRoleModal";
import CreateRoleModal from "@components/modals/CreateRoleModal/CreateRoleModal";
import DynamicSearch from "@components/shared/DynamicSearch";
import { Button, Flex, Stack, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconTableExport } from "@tabler/icons-react";
import React, { useState } from "react";

interface ManagePeopleListProps {}

const ManagePeopleList = ({}: ManagePeopleListProps) => {
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const [isChangeRoleModalOpen, { open: openChangeRoleModal, close: closeChangeRoleModal }] = useDisclosure(false);
  const [isCreateRoleModal, { open: openCreateRoleModal, close: closeCreateRoleModal }] = useDisclosure(false);

  const { data: currentUser } = useGetCurrentUser();
  const { data: allUsers, refetch: refetchUsers } = useGetAllUsers({ all: true });

  const exportToSheet = useGenerateSheetUsers({
    request: {
      responseType: "blob",
    },
  });

  const exportDataXLSX = () => {
    exportToSheet.refetch().then((response) => {
      downloadFile(response?.data);
    });
  };

  if (!currentUser || !allUsers?.data) return null;

  return (
    <Stack>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "start", md: "center" }}
        w="100%"
        gap={24}
      >
        <Title order={1}>All Users</Title>
        <Flex gap={16}>
          <Button onClick={exportDataXLSX} leftSection={<IconTableExport />} color="green" variant="outline">
            Export Data
          </Button>
          <Button onClick={openCreateRoleModal} leftSection={<IconPlus />}>
            Add Role
          </Button>
        </Flex>
      </Flex>
      <DynamicSearch<User>
        filterData={allUsers.data}
        dataColumns={["firstName", "lastName", "username", "email", "birthDate", "nationality", "role.name"]}
        customColumns={
          currentUser.role.permissions.includes(RolePermissionsItem.userupdateRole)
            ? [
                {
                  type: "button",
                  children: "Change Role",
                  headerLabel: "Change Role",
                  handleOnChange: (rowId) => {
                    setSelectedUserId(rowId);
                    openChangeRoleModal();
                  },
                },
              ]
            : []
        }
      />
      {selectedUserId && (
        <ChangeRoleModal
          user={allUsers.data.find((f) => f.id === selectedUserId)}
          isOpened={isChangeRoleModalOpen}
          closeModal={closeChangeRoleModal}
          handleOnSuccess={() => {
            refetchUsers();
          }}
        />
      )}
      <CreateRoleModal isOpened={isCreateRoleModal} closeModal={closeCreateRoleModal} />
    </Stack>
  );
};

export default ManagePeopleList;
