import LoginForm from "@components/auth/LoginForm";
import { Container, Flex, Title } from "@mantine/core";

const LoginPage = () => {
  return (
    <Container h="100vh">
      <Flex direction="column" justify="center" align="center" h="100%">
        <Title>Login</Title>
        <LoginForm />
      </Flex>
    </Container>
  );
};

export default LoginPage;
