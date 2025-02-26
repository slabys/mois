"use client";

import {
  useDeleteEventApplication,
  useDeleteEventSpot,
  useGetEventApplications,
  useGetEventSpots,
  useUpdateEventApplication,
} from "@/utils/api";
import { type EventApplicationDetailedWithApplications, type EventSpotSimple } from "@/utils/api.schemas";
import CreateSpotModal from "@components/CreateSpotModal/CreateSpotModal";
import UpdateEventApplicationModal from "@components/UpdateEventApplicationModal/UpdateEventApplicationModal";
import UpdateSpotModal from "@components/UpdateSpotModal/UpdateSpotModal";
import {
  ActionIcon,
  Box,
  Button,
  ComboboxData,
  Flex,
  List,
  ListItem,
  ScrollArea,
  Select,
  Table,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconEdit, IconFileTypePdf, IconPlus, IconTrash } from "@tabler/icons-react";
import { useMemo, useState } from "react";

interface ManageApplicationsTableProps {
  eventId: number;
}

const ManageApplicationsTable = ({ eventId }: ManageApplicationsTableProps) => {
  const { data: eventSpotsList, refetch: refetchEventSpots } = useGetEventSpots(eventId);
  const deleteEventSpotMutation = useDeleteEventSpot();

  const { data: applicationsList, refetch: refetchEventApplications } = useGetEventApplications(eventId);

  const [currentSpot, setCurrentSpot] = useState<EventSpotSimple | null>(null);
  const [currentApplication, setCurrentApplication] = useState<EventApplicationDetailedWithApplications | null>(null);

  const [isCreateSpotModalOpen, { open: openCreateSpotModal, close: closeCreateSpotModal }] = useDisclosure(false);
  const [isUpdateSpotModalOpen, { open: openUpdateSpotModal, close: closeUpdateSpotModal }] = useDisclosure(false);

  const [isEditApplicationModalOpen, { open: openEditApplicationModal, close: closeEditApplicationModal }] =
    useDisclosure(false);

  const spots: ComboboxData = useMemo(() => {
    return (
      eventSpotsList?.map((spot) => {
        return {
          value: spot.id.toString(),
          label: `${spot.name} - ${spot.price} CZK`,
        };
      }) ?? []
    );
  }, [eventSpotsList]);

  const handleRefetchApplications = () => {
    refetchEventSpots();
    refetchEventApplications();
  };

  const updateApplicationMutation = useUpdateEventApplication({
    mutation: {
      onSuccess: () => {
        refetchEventApplications();
        closeCreateSpotModal();
      },
    },
  });

  const handleSpotChange = (applicationId: number, spotId: number | null) => {
    updateApplicationMutation.mutate({
      id: applicationId,
      data: {
        spotTypeId: spotId,
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
        refetchEventApplications();
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

  const handleDeleteSpot = (spotId: number) => {
    deleteEventSpotMutation.mutate({
      id: spotId,
    });
  };

  const handleDeleteApplication = (applicationId: number) => {
    deleteApplicationMutation.mutate({
      id: applicationId,
    });
  };

  const generatePDF = () => {
    // TODO - implement
  };

  const eventApplicationsRows = applicationsList?.map((application, index) => (
    <Table.Tr key={`application-${index}-${application.id}`}>
      <Table.Td>{application.user.firstName + " " + application.user.lastName}</Table.Td>
      <Table.Td>
        {application.organization ? application.organization.name : application.customOrganization.name}
      </Table.Td>
      <Table.Td>
        {application.organization ? application.organization.address.country : application.customOrganization.country}
      </Table.Td>
      <Table.Td>
        <Select
          defaultValue={application.spotType?.id.toString()}
          data={spots}
          searchable
          nothingFoundMessage="Nothing found..."
          allowDeselect
          onChange={(value) => {
            handleSpotChange(application.id, Number(value));
          }}
        />
      </Table.Td>
      <Table.Td>{application.spotType?.price} CZK</Table.Td>
      <Table.Td>
        <Flex justify="space-evenly" gap={16}>
          <Tooltip label="Generate Invoice">
            {/*TODO - Generate Invoice*/}
            <ActionIcon variant="subtle" size={48} color="black" onClick={generatePDF} disabled>
              <IconFileTypePdf width={32} height={32} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Edit Application">
            <ActionIcon
              variant="subtle"
              color="blue"
              size={48}
              onClick={() => {
                setCurrentApplication(application);
                openEditApplicationModal();
              }}
            >
              <IconEdit width={32} height={32} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete Application">
            <ActionIcon variant="subtle" size={48} color="red" onClick={() => handleDeleteApplication(application.id)}>
              <IconTrash width={32} height={32} />
            </ActionIcon>
          </Tooltip>
        </Flex>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Flex justify="space-between" align="center" w="100%" wrap="wrap">
        <Title>Manage Event Applications</Title>
        <Button onClick={openCreateSpotModal} leftSection={<IconPlus />}>
          Add Spot
        </Button>
      </Flex>
      {eventApplicationsRows && eventApplicationsRows?.length > 0 ? (
        <List w="100%">
          {eventSpotsList?.map((spot, index) => (
            <ListItem key={`event-spot-${index}-${spot.id}`}>
              <Flex direction="row" justify={{ base: "space-between", sm: "start" }} gap={8}>
                <Box w={172}>
                  <Text style={{ wordWrap: "break-word" }}>
                    {spot.name} - {spot.price} CZK
                  </Text>
                </Box>
                <Flex direction="row" gap={8}>
                  <Tooltip label="Edit Spot">
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      size={32}
                      onClick={() => {
                        setCurrentSpot(spot);
                        openUpdateSpotModal();
                      }}
                    >
                      <IconEdit width={24} height={24} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete Spot">
                    <ActionIcon
                      variant="subtle"
                      size={32}
                      color="red"
                      onClick={() => {
                        handleDeleteSpot(spot.id);
                      }}
                    >
                      <IconTrash width={24} height={24} />
                    </ActionIcon>
                  </Tooltip>
                </Flex>
              </Flex>
            </ListItem>
          ))}
        </List>
      ) : (
        <Text>No spots created.</Text>
      )}

      <ScrollArea w="100%">
        {eventApplicationsRows && eventApplicationsRows?.length > 0 ? (
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
                <Table.Th miw={148}>First and Last Name</Table.Th>
                <Table.Th miw={148}>Section</Table.Th>
                <Table.Th miw={148}>Country</Table.Th>
                <Table.Th miw={224}>Spot type</Table.Th>
                <Table.Th miw={148}>Price</Table.Th>
                <Table.Th miw={148} w={200}>
                  Operations
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{eventApplicationsRows}</Table.Tbody>
          </Table>
        ) : (
          <Text>No applications found.</Text>
        )}
      </ScrollArea>
      {currentApplication ? (
        <UpdateEventApplicationModal
          currentApplication={currentApplication}
          isOpened={isEditApplicationModalOpen}
          handleSuccess={handleRefetchApplications}
          closeModal={closeEditApplicationModal}
        />
      ) : null}
      <CreateSpotModal
        eventId={eventId}
        isOpened={isCreateSpotModalOpen}
        handleSuccess={handleRefetchApplications}
        closeModal={closeCreateSpotModal}
      />
      {currentSpot && (
        <UpdateSpotModal
          currentSpot={currentSpot}
          isOpened={isUpdateSpotModalOpen}
          handleSuccess={handleRefetchApplications}
          closeModal={closeUpdateSpotModal}
        />
      )}
    </>
  );
};

export default ManageApplicationsTable;
