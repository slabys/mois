"use client";

import {
  useDeleteEventApplication,
  useGetEventApplications,
  useGetEventSpots,
  useUpdateEventApplication,
} from "@/utils/api";
import { EventApplication } from "@/utils/api.schemas";
import routes from "@/utils/routes";
import CreateSpotModal from "@components/CreateSpotModal/CreateSpotModal";
import UpdateEventApplicationModal from "@components/UpdateEventApplicationModal/UpdateEventApplicationModal";
import { ActionIcon, Button, ComboboxData, Flex, Select, Table, Text, Title, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCopy, IconEdit, IconFileTypePdf, IconPlus, IconTrash, IconZoom } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

interface ManageApplicationsTableProps {
  eventId: number;
}

const ManageApplicationsTable = ({ eventId }: ManageApplicationsTableProps) => {
  const { data: eventApplications } = useGetEventApplications(eventId);
  const [currentApplication, setCurrentApplication] = useState<EventApplication | null>(null);
  const [isSpotModalOpen, { open: openSpotModal, close: closeSpotModal }] = useDisclosure(false);
  const [isEditModalOpen, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);

  const { data: eventSpots } = useGetEventSpots(eventId);

  const spots: ComboboxData =
    eventSpots?.map((spot) => {
      return { value: spot.id.toString(), label: spot.name };
    }) ?? [];

  const updateApplicationMutation = useUpdateEventApplication({
    mutation: {
      onMutate: () => {
        notifications.show({
          id: "event-application-update",
          loading: true,
          title: "Loading! Please wait...",
          message: "We are application spots.",
          autoClose: false,
        });
      },
      onSuccess: () => {
        notifications.update({
          id: "event-application-update",
          title: "Update User Photo",
          message: "Application spot updated successfully.",
          color: "green",
          loading: false,
          autoClose: true,
        });
        closeSpotModal();
      },
      onError: (mutationError) => {
        if (!mutationError.response?.data) return;
        const { statusCode, error, message } = mutationError.response?.data;
        console.error(statusCode, error, message);
        notifications.update({
          id: "event-application-update",
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

  const handleSpotChange = (applicationId: string, spotId: string | null) => {
    updateApplicationMutation.mutate({
      id: applicationId,
      data: {
        spotTypeId: spotId ? Number.parseInt(spotId) : null,
      },
    });
  };

  const deleteApplicationMutation = useDeleteEventApplication({
    mutation: {
      onMutate: () => {
        notifications.show({
          id: "event-application-delete",
          loading: true,
          title: "Loading! Please wait...",
          message: "We are deleting Event Application.",
          autoClose: false,
        });
      },
      onSuccess: () => {
        notifications.update({
          id: "event-application-delete",
          title: "Delete Event Application.",
          message: "Event application deleted succesfully.",
          color: "green",
          loading: false,
          autoClose: true,
        });
      },
      onError: (mutationError) => {
        if (!mutationError.response?.data) return;
        const { statusCode, error, message } = mutationError.response?.data;
        console.error(statusCode, error, message);
        notifications.update({
          id: "event-application-delete",
          title: "Something went wrong.",
          message: "Please try again.",
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

  const handleDeleteApplication = (applicationId: string) => {
    deleteApplicationMutation.mutate({
      id: applicationId,
    });
  };

  const generatePDF = () => {};

  const rows = eventApplications?.map((application, index) => (
    <Table.Tr key={`application-${index}-${application.id}`}>
      <Table.Td>{application.user.firstName + " " + application.user.lastName}</Table.Td>
      <Table.Td>-</Table.Td>
      <Table.Td>{application.organization?.address.country}</Table.Td>
      <Table.Td>
        <Select
          defaultValue={application.spotType?.id.toString()}
          data={spots}
          searchable
          nothingFoundMessage="Nothing found..."
          allowDeselect
          onChange={(value) => {
            handleSpotChange(application.id, value);
          }}
        />
      </Table.Td>
      <Table.Td>{application.spotType?.price}</Table.Td>
      <Table.Td>
        <Flex justify="space-evenly" gap={16}>
          <Tooltip label="Generate Invoice">
            {/*TODO - Generate Invoice*/}
            <ActionIcon variant="subtle" size={48} color="black" onClick={generatePDF}>
              <IconFileTypePdf width={32} height={32} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Edit Application">
            {/*TODO - edit EA*/}
            <ActionIcon
              variant="subtle"
              color="blue"
              size={48}
              onClick={() => {
                setCurrentApplication(application);
                openEditModal();
              }}
            >
              <IconEdit width={32} height={32} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete Application">
            {/*TODO - Delete EA*/}
            <ActionIcon
              variant="subtle"
              size={48}
              color="red"
              onClick={() => handleDeleteApplication(application.id.toString())}
            >
              <IconTrash width={32} height={32} />
            </ActionIcon>
          </Tooltip>
        </Flex>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Flex justify="space-between" align="center" w="100%">
        <Title>Manage Event Applications - {eventId}</Title>
        <Button onClick={openSpotModal} leftSection={<IconPlus />}>
          Add Spot
        </Button>
        <CreateSpotModal eventId={eventId} isOpened={isSpotModalOpen} closeModal={closeSpotModal} />
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
              <Table.Th w={200}>Operations</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      ) : (
        <Text>No applications found.</Text>
      )}
      {currentApplication ? (
        <UpdateEventApplicationModal
          currentApplication={currentApplication}
          isOpened={isEditModalOpen}
          closeModal={closeEditModal}
        />
      ) : null}
    </>
  );
};

export default ManageApplicationsTable;
