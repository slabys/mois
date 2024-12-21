"use client";

import {
  useAddOrganizationMembers,
  useDeleteOrganizationMembers,
  useGetAllUsers,
  useOrganizationMembers,
} from "@/utils/api";
import ApiImage from "@components/ApiImage/ApiImage";
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconEdit, IconUserX } from "@tabler/icons-react";
import { useMemo, useState } from "react";

interface OrganizationMemberListProps {
  organizationId: string;
}

const OrganizationMemberList = ({ organizationId }: OrganizationMemberListProps) => {
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);

  const { data: allUsersList, refetch: refetchAllUsers } = useGetAllUsers(
    { take: 100 },
    {
      query: {
        enabled: !!searchValue,
      },
    },
  );
  const { data: organizationMembers, refetch: refetchOrganisationMembers } = useOrganizationMembers(organizationId);
  const addOrganizationMemberMutation = useAddOrganizationMembers({
    mutation: {
      onSuccess: () => {
        refetchOrganisationMembersInfo();
      },
    },
  });
  const deleteOrganizationMemberMutation = useDeleteOrganizationMembers({
    mutation: {
      onSuccess: () => {
        refetchOrganisationMembersInfo();
      },
    },
  });

  const filteredUserList = useMemo(() => {
    return (
      allUsersList?.filter((user) => {
        // Check if is not in organisation already, if yes, then it will not be added
        // Check if firstName, lastName, username or e-mail is included in search field
        return (
          !organizationMembers?.find((member) => member.user.id === user.id) &&
          [user.firstName, user.lastName, user.username, user.email].some((value) => value.includes(searchValue ?? ""))
        );
      }) ?? []
    );
  }, [allUsersList, searchValue, organizationMembers]);

  const handleDeleteOrganizationMembers = (memberId: number) => {
    deleteOrganizationMemberMutation.mutate({
      id: organizationId,
      data: {
        memberIds: [memberId],
      },
    });
  };

  const handleAddMemberToOrganization = (userId: string) => {
    addOrganizationMemberMutation.mutate({
      id: organizationId,
      data: {
        userIds: [userId],
      },
    });
  };

  const refetchOrganisationMembersInfo = () => {
    refetchAllUsers();
    refetchOrganisationMembers();
  };

  return (
    <Stack>
      <Flex justify="space-between" align="center" w="100%">
        <Title>Manage Organisation Members</Title>
      </Flex>
      <Flex direction="column" gap={8}>
        <Box>
          <TextInput
            label="Search Users"
            placeholder="Search Users"
            value={searchValue}
            onChange={(value) => {
              setSearchValue(value.currentTarget.value);
            }}
          />
        </Box>
        {allUsersList && !!searchValue ? (
          <>
            {filteredUserList?.map((user, index) => {
              return (
                <Box bg={index % 2 === 0 ? "lightGray" : "gray.3"} key={`user-listed-${user.id}-${index}`}>
                  <Flex align="center" gap={16} direction={{ base: "column", sm: "row" }}>
                    <Flex justify="space-between" align="center" gap={16} wrap="wrap" w="100%" p={8}>
                      <Text miw={156}>{`${user.firstName} ${user.lastName}`}</Text>
                      <Text miw={156}>{user.username}</Text>
                      <Text miw={156}>{user.email}</Text>
                      <Text miw={156}>{user.gender}</Text>
                    </Flex>
                    <Button
                      w={{ base: "100%", sm: 128 }}
                      onClick={() => handleAddMemberToOrganization(user.id)}
                      loading={addOrganizationMemberMutation.isPending}
                    >
                      Add
                    </Button>
                  </Flex>
                </Box>
              );
            })}
          </>
        ) : null}
      </Flex>
      <ScrollArea w="100%">
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
              <Table.Th h="100%" w={148}>
                Full Name
              </Table.Th>
              <Table.Th w={148} miw={148}>
                Address
              </Table.Th>
              <Table.Th w={148} miw={148}>
                Gender
              </Table.Th>
              <Table.Th w={148} miw={148}>
                E-mail
              </Table.Th>
              <Table.Th w={148}>Role</Table.Th>
              <Table.Th w={200}>Operations</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {organizationMembers?.map((member, index) => {
              const { user } = member;
              const { personalAddress } = user;
              return (
                <Table.Tr key={`member-${index}-${member.id}`}>
                  <Table.Td>
                    <Box>
                      <ApiImage src={user.photo?.id} />
                    </Box>
                  </Table.Td>
                  <Table.Td>{`${user.firstName} ${user.lastName}`}</Table.Td>
                  <Table.Td>
                    {personalAddress ? (
                      <Flex direction="column" justify="start" align="start">
                        <Text>{`${personalAddress.street} ${personalAddress.houseNumber}`}</Text>
                        <Text>{`${personalAddress.zip}, ${personalAddress.city}`}</Text>
                        <Text>{personalAddress.country}</Text>
                      </Flex>
                    ) : (
                      `N/A`
                    )}
                  </Table.Td>
                  <Table.Td>{user.gender}</Table.Td>
                  <Table.Td>{user.email}</Table.Td>
                  <Table.Td>{user.role?.name ?? "N/A"}</Table.Td>
                  <Table.Td>
                    <Flex justify="space-evenly" gap={16}>
                      <Tooltip label="Edit Organization">
                        {/*TODO - edit organization*/}
                        <ActionIcon variant="subtle" size={48} color="blue">
                          <IconEdit width={32} height={32} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Remove from Organization">
                        <ActionIcon
                          variant="subtle"
                          size={48}
                          color="red"
                          loading={deleteOrganizationMemberMutation.isPending}
                          onClick={() => handleDeleteOrganizationMembers(Number.parseInt(member.id))}
                        >
                          <IconUserX width={32} height={32} />
                        </ActionIcon>
                      </Tooltip>
                    </Flex>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Stack>
  );
};

export default OrganizationMemberList;
