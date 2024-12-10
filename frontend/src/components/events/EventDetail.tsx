"use client";

import { useGetEvent } from "@/utils/api";
import { dayMonthYear } from "@/utils/time";
import ApiImage from "@components/ApiImage/ApiImage";
import RichTextRenderer from "@components/Richtext/RichTextRenderer";
import EventEditModal from "@components/events/modals/EventEditModal";
import { Button, Flex, Grid, Skeleton, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";

interface EventDetailProps {
  id: number;
}

const EventDetail = ({ id }: EventDetailProps) => {
  const [isModalOpen, { open: openModal, close: closeModal }] = useDisclosure(false);
  const { data: eventDetail } = useGetEvent(id);

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
