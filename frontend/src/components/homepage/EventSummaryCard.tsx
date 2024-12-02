import { Event } from "@/utils/api.schemas";
import { dayMonthYear } from "@/utils/time";
import ApiImage from "@components/ApiImage/ApiImage";
import styles from "@components/homepage/EventSummaryCard.module.css";
import { Box, Card, Flex, Stack, Text, Title } from "@mantine/core";

interface EventCardProps {
  event: Event;
}

const EventSummaryCard = ({ event }: EventCardProps) => {
  return (
    <Card withBorder radius="md" p={0} className={styles.card}>
      <Flex direction={{ base: "column", xs: "row" }} gap={0} w="100%">
        <Box w={{ base: "100%", xs: "100%" }} maw={{ base: "100%", xs: 320 }} h={{ base: 200, sm: "100%" }}>
          <ApiImage
            // src={event.id}
            src="https://images.unsplash.com/photo-1602080858428-57174f9431cf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
            h="100%"
          />
        </Box>
        <Stack w="100%" justify="center" p={{ base: "2rem 1rem", xs: "1rem 2rem" }}>
          <Stack gap={0}>
            <Title fw="bold" size="xl">
              {event.title}
            </Title>
            <Text tt="uppercase" c="dimmed" fw={700} size="xs">
              {dayMonthYear(event.since)} - {dayMonthYear(event.until)}
            </Text>
          </Stack>
          <Text size="xs" lineClamp={4}>
            {event.description}
          </Text>
        </Stack>
      </Flex>
    </Card>
  );
};

export default EventSummaryCard;
