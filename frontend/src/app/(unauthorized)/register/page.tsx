import routes from "@/utils/routes";
import RegisterForm from "@components/register/RegisterForm";
import { Anchor, Container, Flex, Title } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";

const RegisterPage = () => {
  return (
    <Container h="100vh">
      <Flex direction="column" justify="center" align="center" h="100%" gap={8}>
        <Flex direction="column" justify="center" align="center" maw={512} w="100%">
          <Title>Register</Title>
          <RegisterForm />
        </Flex>
        <Flex justify="end" w="100%" maw={512}>
          <Anchor href={routes.LOGIN} display="flex">
            <IconArrowRight />
            Login
          </Anchor>
        </Flex>
      </Flex>
    </Container>
  );
};

export default RegisterPage;
