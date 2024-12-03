"use client";

import { useGetEvent } from "@/utils/api";
import { dayMonthYear } from "@/utils/time";
import ApiImage from "@components/ApiImage/ApiImage";
import { Button, Flex, Grid, Skeleton, Text, Title } from "@mantine/core";
import Link from "next/link";

interface EventDetailProps {
  id: string;
}

const EventDetail = ({ id }: EventDetailProps) => {
  const { data: eventDetail } = useGetEvent(id);
  return eventDetail ? (
    <Grid>
      <Grid.Col span={{ base: 12, md: 9 }} order={{ base: 2, md: 1 }}>
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
          <Text>{eventDetail.description}</Text>
        </Flex>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 3 }} order={{ base: 1, md: 2 }}>
        <Flex direction="column" gap={8}>
          {/*TODO - add real links*/}
          Mockup data Admin view
          {[
            { label: "Edit Event", href: "" },
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
