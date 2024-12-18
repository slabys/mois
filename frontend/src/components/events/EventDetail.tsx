"use client";

import { useGetCurrentUser, useGetEvent, useGetUserApplications } from "@/utils/api";
import routes from "@/utils/routes";
import { dateWithTime, dayMonthYear } from "@/utils/time";
import ApiImage from "@components/ApiImage/ApiImage";
import JoinEventModal from "@components/JoinEventModal/JoinEventModal";
import RichTextRenderer from "@components/Richtext/RichTextRenderer";
import UpdateEventPhotoModal from "@components/UpdateEventPhotoModal/UpdateEventPhotoModal";
import EventEditModal from "@components/events/modals/EventEditModal";
import { Button, Collapse, Divider, Flex, Grid, SimpleGrid, Skeleton, Text, Title } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconCash,
  IconChevronDown,
  IconEdit,
  IconInvoice,
  IconPhoto,
  IconUsersGroup,
  IconWritingSign,
} from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

interface EventDetailProps {
  id: number;
}

const EventDetail = ({ id }: EventDetailProps) => {
  const isPhone = useMediaQuery("(min-width: 62em)");
  const [opened, { toggle }] = useDisclosure(isPhone);

  const [isModalEditOpen, { open: openModalEdit, close: closeModalEdit }] = useDisclosure(false);
  const [isModalUploadPhotoOpen, { open: openModalUploadPhoto, close: closeModalUploadPhoto }] = useDisclosure(false);
  const [isModalJoinEventOpen, { open: openModalJoinEvent, close: closeModalJoinEvent }] = useDisclosure(false);

  const { data: userApplicationList } = useGetUserApplications();
  const { data: eventDetail, refetch: refetchEvent } = useGetEvent(id);
  const { data: userData } = useGetCurrentUser();

  const isUserRegistered = userApplicationList?.some((f) => f.event.id === id);

  return eventDetail ? (
    <>
      <Grid>
        <Grid.Col span={{ base: 12, md: 9 }} order={{ base: 2, md: 1 }}>
          <Flex direction="column" w="100%" gap={16}>
            <Flex direction="column" w="100%" gap={8}>
              {eventDetail.photo?.id ? <ApiImage src={eventDetail.photo.id} mah="180px" h="100%" fit="cover" /> : null}
              <Title order={1}>{eventDetail.title}</Title>
              <Text>
                <Text span fw="bold">
                  Registration Deadline:
                </Text>{" "}
                <Text span c="dark">
                  {dateWithTime(eventDetail.registrationDeadline)}
                </Text>
              </Text>
              <Text>
                <Text span fw="bold">
                  Date:
                </Text>{" "}
                <Text span c="dark">
                  {dayMonthYear(eventDetail.since)} - {dayMonthYear(eventDetail.until)}
                </Text>
              </Text>
            </Flex>
            <RichTextRenderer content={eventDetail.longDescription} />
          </Flex>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }} order={{ base: 1, md: 2 }}>
          <Flex direction="column" gap={8}>
            <Button
              maw={{ base: 180, md: "100%" }}
              mb={8}
              variant="light"
              onClick={toggle}
              justify="space-between"
              rightSection={
                <IconChevronDown
                  style={{ rotate: (isPhone ? !opened : opened) ? "0deg" : "180deg", transition: "rotate 300ms" }}
                />
              }
              size="compact"
            >
              Show options
            </Button>
            <Collapse in={isPhone ? !opened : opened}>
              <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 1, xl: 1 }}>
                <Button onClick={openModalEdit} leftSection={<IconEdit />}>
                  Edit Event
                </Button>
                <Button onClick={openModalUploadPhoto} leftSection={<IconPhoto />}>
                  Upload Image
                </Button>
                <Button component={Link} href={routes.EVENT_MANAGE({ id: id })} leftSection={<IconUsersGroup />}>
                  Manage Applications
                </Button>
              </SimpleGrid>

              <Divider my={16} />
              <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 1, xl: 1 }}>
                {/* TODO */}
                <Button component={Link} href={routes.EVENT_MANAGE({ id: id })} leftSection={<IconInvoice />}>
                  Show Invoice
                </Button>
                {/* TODO */}
                <Button component={Link} href={routes.EVENT_MANAGE({ id: id })} leftSection={<IconCash />}>
                  Upload Payment
                </Button>
                <Divider my={16} />
                <Button
                  onClick={openModalJoinEvent}
                  disabled={isUserRegistered}
                  color="green"
                  leftSection={<IconWritingSign />}
                >
                  {isUserRegistered ? "Already registered" : "Register to Event"}
                </Button>
              </SimpleGrid>
            </Collapse>
          </Flex>
        </Grid.Col>
      </Grid>
      <UpdateEventPhotoModal
        eventId={eventDetail.id}
        onSuccessUpdate={refetchEvent}
        isOpened={isModalUploadPhotoOpen}
        closeModal={closeModalUploadPhoto}
      />
      <EventEditModal
        eventDetail={eventDetail}
        onSuccessEdit={() => {
          refetchEvent();
        }}
        isOpened={isModalEditOpen}
        close={closeModalEdit}
      />
      {!!userData ? (
        <JoinEventModal
          userData={userData}
          eventId={eventDetail.id}
          isOpened={isModalJoinEventOpen}
          closeModal={closeModalJoinEvent}
        />
      ) : null}
    </>
  ) : (
    <Grid>
      <Grid.Col span={{ base: 12, md: 9 }} order={{ base: 2, md: 1 }}>
        <Skeleton height={500} radius="md" animate={true} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 3 }} order={{ base: 1, md: 2 }}>
        <Skeleton height={500} radius="md" animate={true} />
      </Grid.Col>
    </Grid>
  );
};

export default EventDetail;
