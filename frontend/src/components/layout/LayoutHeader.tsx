"use client";

import styles from "@components/layout/LayoutHeader.module.css";
import { Anchor, Box, Burger, Button, Container, Divider, Drawer, Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

const mainLinks = [
  { link: "#", label: "Home" },
  { link: "#", label: "Manage Events" },
  { link: "#", label: "Sent Applications" },
  { link: "#", label: "Account" },
];

const LayoutHeader = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [active, setActive] = useState(0);

  const mainItems = mainLinks.map((item, index) => (
    <Anchor
      href={item.link}
      key={item.label}
      className={styles.mainLink}
      data-active={index === active || undefined}
      onClick={(event) => {
        event.preventDefault();
        setActive(index);
      }}
    >
      {item.label}
    </Anchor>
  ));

  return (
    <header className={styles.header}>
      <Container size="xl" className={styles.inner}>
        <img src="/logo_esncz.png" alt="" height="100%" />
        <Box className={styles.links} visibleFrom="sm">
          <Group gap={0} justify="flex-end">
            {mainItems}
          </Group>
        </Box>
        <Burger opened={drawerOpened} onClick={toggleDrawer} size="sm" hiddenFrom="sm" />
      </Container>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <Divider my="sm" />

        <Stack gap={0} justify="flex-end">
          {mainItems}
        </Stack>

        <Divider my="sm" />

        <Group justify="center" grow pb="xl" px="md">
          <Button variant="default">Log in</Button>
          <Button>Sign up</Button>
        </Group>
      </Drawer>
    </header>
  );
};

export default LayoutHeader;
