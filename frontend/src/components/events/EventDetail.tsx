"use client";

import { useGetEvent, useUpdateEventPhoto } from "@/utils/api";
import { dateWithTime, dayMonthYear } from "@/utils/time";
import ApiImage from "@components/ApiImage/ApiImage";
import { Dropzone } from "@components/Dropzone/Dropzone";
import RichTextRenderer from "@components/Richtext/RichTextRenderer";
import EventEditModal from "@components/events/modals/EventEditModal";
import { Button, Flex, Grid, Skeleton, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import React from "react";

interface EventDetailProps {
  id: number;
}

const EventDetail = ({ id }: EventDetailProps) => {
  const [isModalOpen, { open: openModal, close: closeModal }] = useDisclosure(false);
  const uploadEventPhoto = useUpdateEventPhoto({
    mutation: {
      onMutate: () => {
        notifications.show({
          id: "event-photo-update",
          loading: true,
          title: "Loading! Please wait...",
          message: "We are updating your photo information.",
          autoClose: false,
        });
      },
      onSuccess: () => {
        notifications.update({
          id: "event-photo-update",
          title: "Update User Photo",
          message: "Account photo updated successfully.",
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
          id: "event-photo-update",
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

  const { data: eventDetail } = useGetEvent(id);

  console.log(eventDetail);

  return eventDetail ? (
    <>
      <Grid>
        <Grid.Col span={{ base: 12, md: 9 }} order={{ base: 2, md: 1 }}>
          <Flex direction="column" w="100%" gap={16}>
            <Flex direction="column" w="100%" gap={8}>
              {eventDetail.photo?.id ? (
                <ApiImage src={eventDetail.photo.id} mah="180px" h="100%" fit="cover" />
              ) : (
                <Dropzone
                  handleOnDrop={(files) => {
                    uploadEventPhoto.mutate({
                      eventId: id,
                      data: {
                        file: files[0],
                      },
                    });
                  }}
                  multiple={false}
                  maxFiles={1}
                />
              )}
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
            <RichTextRenderer content={eventDetail.shortDescription} />
          </Flex>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }} order={{ base: 1, md: 2 }}>
          <Flex direction="column" gap={8}>
            {/*TODO - add real links*/}
            Mockup data Admin view
            <Button onClick={openModal}>Edit Event</Button>
            {[
              { label: "Applications", href: "" },
              { label: "Assign Spots", href: "" },
              { label: "Payments", href: "" },
            ].map((eventItem, index) => {
              return (
                <Button component={Link} href={eventItem.href} key={`event-detail-button-link-${index}`}>
                  {eventItem.label}
                </Button>
              );
            })}
            User view
            {[
              { label: "Agenda", href: "" },
              { label: "Invoice", href: "" },
              { label: "Payment Confirmation", href: "" },
            ].map((eventItem, index) => {
              return (
                <Button component={Link} href={eventItem.href} key={`event-detail-button-link-${index}`}>
                  {eventItem.label}
                </Button>
              );
            })}
          </Flex>
        </Grid.Col>
      </Grid>
      <EventEditModal eventDetail={eventDetail} isOpened={isModalOpen} close={closeModal} />
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
