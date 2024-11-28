"use client";

import { useLogoutUser } from "@/utils/api";
import routes from "@/utils/routes";
import styles from "@components/layout/LayoutHeader.module.css";
import { Anchor, Box, Burger, Button, Container, Divider, Drawer, Group, Image, Menu, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconLogout, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface MainLinksProps {
  link: string;
  label: string;
}

const mainLinks: MainLinksProps[] = [
  { link: routes.DASHBOARD, label: "Home" },
  { link: routes.MANAGE_EVENTS, label: "Manage Events" },
  { link: routes.SENT_APPLICATIONS, label: "Sent Applications" },
];

const LayoutHeader = () => {
  const router = useRouter();
  const logoutMutation = useLogoutUser({
    mutation: {
      onSuccess: () => {
        router.push(routes.LOGIN);
      },
    },
  });

  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [active, setActive] = useState(0);

  const mainItems = mainLinks.map((item, index) => (
    <Anchor
      href={item.link}
      key={item.label}
      className={styles.mainLink}
      data-active={index === active || undefined}
      onClick={(event) => {
        // TODO - remove when pages exists
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
        <Anchor href={routes.DASHBOARD}>
          <Image src="/logo_esncz.png" alt="LOGO" height={84} width="100%" />
        </Anchor>
        <Box className={styles.links} visibleFrom="sm">
          <Group gap={0} justify="flex-end">
            {mainItems}
            <Menu width={260} position="bottom-start" withinPortal>
              <Menu.Target>
                <Button
                  variant="subtle"
                  p="7px 12px"
                  lh="22px"
                  fs="14px"
                  fw={700}
                  rightSection={<IconChevronDown size={16} stroke={2} />}
                >
                  email@email.com
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconUser size={16} stroke={1.5} />}>Account</Menu.Item>
                <Menu.Divider />
                <Menu.Item leftSection={<IconLogout size={16} stroke={1.5} />} onClick={() => logoutMutation.mutate()}>
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Box>

        <Burger opened={drawerOpened} onClick={toggleDrawer} size="sm" hiddenFrom="sm" />
      </Container>
      {/*TODO - user*/}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="email@email.com"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <Divider my="sm" />

        <Stack gap={4} justify="flex-end">
          {mainItems}
        </Stack>

        <Divider my="sm" />

        <Group justify="center" grow pb="xl" px="md">
          <Button component={Link} href={routes.ACCOUNT} leftSection={<IconUser size={16} stroke={1.5} />}>
            Account
          </Button>
          <Button leftSection={<IconLogout size={16} stroke={1.5} />} onClick={() => logoutMutation.mutate()}>
            Logout
          </Button>
        </Group>
      </Drawer>
    </header>
  );
};

export default LayoutHeader;
