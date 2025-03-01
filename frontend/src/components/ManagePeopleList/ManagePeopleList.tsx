"use client";

import { useGenerateSheetUsers, useGetAllUsers } from "@/utils/api";
import { User } from "@/utils/api.schemas";
import { downloadFile } from "@/utils/downloadFile";
import ChangeRoleModal from "@components/modals/ChangeRoleModal/ChangeRoleModal";
import DynamicSearch from "@components/shared/DynamicSearch";
import { Button, Flex, ScrollArea, Stack, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTableExport } from "@tabler/icons-react";
import React, { useState } from "react";

interface ManagePeopleListProps {}

const ManagePeopleList = ({}: ManagePeopleListProps) => {
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const [isChangeRoleModalOpen, { open: openChangeRoleModal, close: closeChangeRoleModal }] = useDisclosure(false);
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

  if (!allUsers?.data) return null;

  return (
    <Stack>
      <Flex justify="space-between" align="center" w="100%">
        <Title>All Users</Title>
        <Flex gap={16}>
          <Button onClick={exportDataXLSX} leftSection={<IconTableExport />} color="green" variant="outline">
            Export Data
          </Button>
        </Flex>
      </Flex>
      <ScrollArea w="100%">
        <Flex direction="column" gap={8}>
          <DynamicSearch<User>
            filterData={allUsers.data}
            dataColumns={["firstName", "lastName", "username", "email", "birthDate", "nationality", "role.name"]}
            customColumns={[
              {
                type: "button",
                children: "Change Role",
                headerLabel: "Change Role",
                handleOnChange: (rowId) => {
                  setSelectedUserId(rowId);
                  openChangeRoleModal();
                },
              },
            ]}
          />
        </Flex>
      </ScrollArea>
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
    </Stack>
  );
};

export default ManagePeopleList;
