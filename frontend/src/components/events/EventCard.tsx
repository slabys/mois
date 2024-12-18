"use client";

import { EventSimple } from "@/utils/api.schemas";
import { dayMonthYear } from "@/utils/time";
import ApiImage from "@components/ApiImage/ApiImage";
import RichTextRenderer from "@components/Richtext/RichTextRenderer";
import styles from "@components/events/EventCard.module.css";
import { Box, Card, Flex, Stack, Text, Title } from "@mantine/core";

interface EventCardProps {
  event: EventSimple;
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <Card withBorder radius="md" p={0} className={styles.card}>
      <Flex direction={{ base: "column", xs: "row" }} gap={0} w="100%">
        <Flex justify="center" align="center" miw={{ base: 240, sm: 320 }}>
          <ApiImage src={event.photo?.id} mah={224} h="100%" w={{ base: "100%", sm: 320 }} fit="cover" />
        </Flex>
        <Stack w="100%" justify="center" p={{ base: "2rem 1rem", xs: "1rem 2rem" }}>
          <Stack gap={0}>
            <Title order={1}>{event.title}</Title>
            <Box mt={8}>
              <Text size="sm">
                <Text span fw={700}>
                  Date:
                </Text>{" "}
                <Text c="dimmed" span>
                  {dayMonthYear(event.since)} - {dayMonthYear(event.until)}
                </Text>
              </Text>
            </Box>
          </Stack>
          <Text size="xs" lineClamp={4} span>
            <RichTextRenderer content={event.shortDescription} />
          </Text>
        </Stack>
      </Flex>
    </Card>
  );
};

export default EventCard;
