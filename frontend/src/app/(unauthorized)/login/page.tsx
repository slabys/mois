import routes from "@/utils/routes";
import LoginForm from "@components/auth/LoginForm";
import { Anchor, Container, Flex, Title } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

const LoginPage = () => {
  return (
    <Container h="100vh">
      <Flex direction="column" justify="center" align="center" h="100%" gap={8}>
        <Flex direction="column" justify="center" align="center" maw={512} w="100%">
          <Title>Login</Title>
          <LoginForm />
        </Flex>
        <Flex justify="end" w="100%" maw={512}>
          <Anchor component={Link} href={routes.REGISTER} display="flex">
            <IconArrowRight />
            Register
          </Anchor>
        </Flex>
      </Flex>
    </Container>
  );
};

export default LoginPage;
