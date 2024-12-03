import routes from "@/utils/routes";
import styles from "@components/layout/LayoutFooter.module.css";
import { Anchor, Container, Group } from "@mantine/core";
import Link from "next/link";

const LayoutFooter = () => {
  const userLinks = [
    { link: routes.PRIVACY_POLICY, label: "Privacy Policy" },
    { link: routes.TERMS_AND_CONDITIONS, label: "Terms and Conditions" },
  ];

  return (
    <footer className={styles.footer}>
      <Container size="xl">
        <Group justify="end">
          {userLinks.map((item) => (
            <Anchor component={Link} href={item.link} key={item.label} c="gray" size="sm">
              {item.label}
            </Anchor>
          ))}
        </Group>
      </Container>
    </footer>
  );
};

export default LayoutFooter;
