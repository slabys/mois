"use client";

import { Grid, Skeleton } from "@mantine/core";

const EventDetail = () => {
  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 9 }} order={{ base: 2, md: 1 }}>
        <Skeleton height={500} radius="md" animate={true} />1
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 3 }} order={{ base: 1, md: 2 }}>
        <Skeleton height={500} radius="md" animate={true} />2
      </Grid.Col>
    </Grid>
  );
};

export default EventDetail;
