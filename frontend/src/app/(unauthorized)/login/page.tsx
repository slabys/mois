"use client";

import LoginForm from "@components/auth/LoginForm";
import { Container, Title } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";

const LoginPage = () => {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: isNotEmpty("Password cannot be empty!"),
    },
  });

  console.log(form);

  return (
    <Container>
      <Title>Login</Title>
      <LoginForm />
    </Container>
  );
};

export default LoginPage;
