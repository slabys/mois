import styles from "@components/layout/LayoutFooter.module.css";
import { Anchor, Container, Group } from "@mantine/core";

const LayoutFooter = () => {
  const userLinks = [
    { link: "#", label: "Privacy Policy" },
    { link: "#", label: "Terms and Conditions" },
  ];

  return (
    <footer className={styles.footer}>
      <Container size={"xl"}>
        <Group justify={"end"}>
          {userLinks.map((item) => (
            <Anchor href={item.link} key={item.label} c={"gray"} size={"sm"}>
              {item.label}
            </Anchor>
          ))}
        </Group>
      </Container>
    </footer>
  );
};

export default LayoutFooter;
