"use client";

import { Container, TextInput } from "@mantine/core";
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
      <TextInput></TextInput>
    </Container>
  );
};

export default LoginPage;
