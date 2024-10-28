import { Box, Card, Flex, Image, Stack, Text } from "@mantine/core";

interface EventCardProps {}

const EventSummaryCard = ({}: EventCardProps) => {
  return (
    <Card withBorder radius="md" p={0}>
      <Flex direction={{ base: "column", xs: "row" as "row" }} gap={0} w={"100%"}>
        <Box w={{ base: "100%", xs: "100%" }} maw={{ base: "100%", xs: 320 }} h={{ base: 200, sm: "100%" }}>
          <Image
            src="https://images.unsplash.com/photo-1602080858428-57174f9431cf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
            height={"100%"}
          />
        </Box>
        <Stack w={"100%"} justify={"center"} p={{ base: "2rem 1rem", xs: "1rem 2rem" }}>
          <Stack gap={0}>
            <Text fw={"bold"} size={"xl"}>
              NA Gottwaldov 2024
            </Text>
            <Text tt="uppercase" c="dimmed" fw={700} size="xs">
              7 Nov 2024 - 10 Nov 2024
            </Text>
          </Stack>
          <Text size="xs" lineClamp={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis neque consequat, pellentesque lectus et,
            efficitur turpis. Etiam sit amet nunc sagittis, scelerisque mi at, dignissim metus. Morbi mi risus,
            vestibulum ac pretium sit amet, lobortis ac lacus. Suspendisse a erat vitae quam rhoncus molestie. Cras
            interdum nisi sit amet diam pretium, et vulputate est pretium. Curabitur sollicitudin mauris tellus, sed
            bibendum sem suscipit in. Nam at finibus orci, vitae commodo magna. Sed pellentesque elit ante, ut tincidunt
            arcu lobortis in. Proin porta sapien tempus ligula scelerisque, nec tempor enim commodo. Morbi eget eleifend
            libero, vel efficitur leo. Ut porta dolor non odio hendrerit aliquam. Pellentesque ultricies est nulla,
            vitae varius risus dignissim sed.
          </Text>
        </Stack>
      </Flex>
    </Card>
  );
};

export default EventSummaryCard;
