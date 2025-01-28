"use client";

import { useGetCurrentUser, useLogoutUser } from "@/utils/api";
import routes from "@/utils/routes";
import styles from "@components/layout/LayoutHeader.module.css";
import {
  Anchor,
  Box,
  Burger,
  Button,
  Container,
  Divider,
  Drawer,
  Flex,
  Group,
  Image,
  Menu,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconLogout, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type MainLink = {
  link: string;
  label: string;
};

type GroupedLinks = {
  label: string;
  children: MainLink[];
};

type MainLinksProps = (MainLink | GroupedLinks)[];

const mainLinks: MainLinksProps = [
  { link: routes.DASHBOARD, label: "Home" },
  { link: routes.SENT_APPLICATIONS, label: "Sent Applications" },
  {
    label: "Management",
    children: [
      { link: routes.MANAGE_EVENTS, label: "Manage Events" },
      { link: routes.MANAGE_ORGANIZATIONS, label: "Manage Organizations" },
      { link: routes.MANAGE_PEOPLE, label: "Manage People" },
    ],
  },
];

const LayoutHeader = () => {
  const router = useRouter();
  const pathname = usePathname();

  const logoutMutation = useLogoutUser({
    mutation: {
      onSuccess: () => {
        router.push(routes.LOGIN);
      },
    },
  });

  const { data: currentUser } = useGetCurrentUser();

  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

  const mainItems = mainLinks.map((item, index) => {
    if ("children" in item) {
      return (
        <Box key={`dropdown-menu-${index}`}>
          <Menu shadow="md" trigger="hover" position="bottom-start">
            <Menu.Target>
              <Button
                component={Anchor}
                variant="subtle"
                className={styles.mainLink}
                data-active={item.children.some((f) => f.link === pathname) || undefined}
                rightSection={<IconChevronDown />}
              >
                {item.label}
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              {item.children.map((subItem, jIndex) => {
                return (
                  <Menu.Item
                    key={`dropdown-menu-${index}-item-${jIndex}`}
                    component={Link}
                    href={subItem.link}
                    classNames={{ item: styles.subLink }}
                    data-active={pathname === subItem.link || undefined}
                  >
                    {subItem.label}
                  </Menu.Item>
                );
              })}
            </Menu.Dropdown>
          </Menu>
        </Box>
      );
    }

    return (
      <Anchor
        component={Link}
        key={`main-link-${index}-${item.label}`}
        href={item.link}
        className={styles.mainLink}
        data-active={pathname === item.link || undefined}
        onClick={() => {
          closeDrawer();
        }}
      >
        {item.label}
      </Anchor>
    );
  });

  return (
    <header className={styles.header}>
      <Container size="xl" className={styles.inner}>
        <Anchor component={Link} href={routes.DASHBOARD}>
          <Flex direction="row" justify="center" align="center" gap={8}>
            <Image src="/icon.svg" alt="LOGO" height={64} width="100%" />
            <Text size="xl" c="black" display={{ base: "none", lg: "block" }}>
              Event Registration System
            </Text>
          </Flex>
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
                  loading={!currentUser?.email}
                >
                  {currentUser?.email}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Anchor component={Link} href={routes.ACCOUNT} underline="never" onClick={closeDrawer}>
                  <Menu.Item leftSection={<IconUser size={16} stroke={1.5} />}>Account</Menu.Item>
                </Anchor>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<IconLogout size={16} stroke={1.5} />}
                  onClick={() => {
                    logoutMutation.mutate();
                    closeDrawer();
                  }}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Box>

        <Burger opened={drawerOpened} onClick={toggleDrawer} size="sm" hiddenFrom="sm" />
      </Container>
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title={currentUser?.email}
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <Divider my="sm" />

        <Stack gap={4} justify="flex-end">
          {mainItems}
        </Stack>

        <Divider my="sm" />

        <Group justify="center" grow pb="xl" px="md">
          <Button
            component={Link}
            href={routes.ACCOUNT}
            onClick={closeDrawer}
            leftSection={<IconUser size={16} stroke={1.5} />}
          >
            Account
          </Button>
          <Button
            leftSection={<IconLogout size={16} stroke={1.5} />}
            onClick={() => {
              logoutMutation.mutate();
              closeDrawer();
            }}
          >
            Logout
          </Button>
        </Group>
      </Drawer>
    </header>
  );
};

export default LayoutHeader;
