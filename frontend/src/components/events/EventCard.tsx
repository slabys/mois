"use client";

import { EventSimpleWithApplications } from "@/utils/api.schemas";
import { dayMonthYear } from "@/utils/time";
import ApiImage from "@components/ApiImage/ApiImage";
import RichTextRenderer from "@components/Richtext/RichTextRenderer";
import styles from "@components/events/EventCard.module.css";
import { Box, Card, Flex, Stack, Text, Title } from "@mantine/core";
import { IconUsersGroup } from "@tabler/icons-react";

interface EventCardProps {
  event: EventSimpleWithApplications;
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <Card withBorder radius="md" p={0} className={styles.card}>
      <Flex direction={{ base: "column", sm: "row" }} gap={0} w="100%" h="100%">
        <Box w={{ base: "100%", sm: 448 }} h={{ base: 224, sm: "auto" }}>
          <ApiImage src={event.photo?.id} h="100%" fit="cover" />
        </Box>
        <Stack w="100%" justify="center" p={{ base: "2rem 1rem", xs: "1rem 2rem" }}>
          <Stack gap={16}>
            <Title order={1}>{event.title}</Title>
            <Flex direction="column" gap={4}>
              <Text size="sm">
                <Text span fw={700}>
                  Date:
                </Text>{" "}
                <Text c="dimmed" span>
                  {dayMonthYear(event.since)} - {dayMonthYear(event.until)}
                </Text>
              </Text>
              <Flex justify="start" align="center" gap={8} wrap="wrap">
                <IconUsersGroup />
                <Text size="sm">
                  <Text c="dimmed" span>
                    {event.applications} / {event.capacity}
                  </Text>
                </Text>
              </Flex>
            </Flex>
          </Stack>
          <Text size="xs" span>
            <RichTextRenderer content={event.shortDescription} />
          </Text>
        </Stack>
      </Flex>
    </Card>
  );
};

export default EventCard;
