"use client";

import { useCreateUser } from "@/utils/api";
import { CreateUser } from "@/utils/api.schemas";
import routes from "@/utils/routes";
import { Button, Flex, Text, TextInput } from "@mantine/core";
import { Form, isEmail, isNotEmpty, useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface RegisterFormProps {}

const RegisterForm = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const registerMutation = useCreateUser({
    mutation: {
      onSuccess: (data) => {
        router.push(routes.LOGIN);
      },
      onError: (data) => {
        console.log(data.status);
        switch (data.status) {
          case 409:
            return setError("This e-mail is already registered!");
          default:
            return setError("Something went wrong! Please try again.");
        }
      },
    },
  });
  const form = useForm<CreateUser>({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      username: "",
      // TODO - remove
      universityId: "asddasds",
    },
    validate: {
      email: isEmail("Must be a valid email"),
      password: isNotEmpty("Password can not be empty."),
      firstName: isNotEmpty("First name can not be empty."),
      lastName: isNotEmpty("Last name can not be empty."),
      username: isNotEmpty("User name can not be empty."),
    },
  });

  const registerUser = (values: CreateUser) => {
    registerMutation.mutate({
      data: { ...values },
    });
  };

  return (
    <>
      <Form form={form} onSubmit={registerUser}>
        <Flex direction="column" gap={12}>
          <TextInput label="Email" {...form.getInputProps("email")} />
          <TextInput label="Password" type="password" {...form.getInputProps("password")} />
          <TextInput label="FirstName" {...form.getInputProps("firstName")} />
          <TextInput label="LastName" {...form.getInputProps("lastName")} />
          <TextInput label="UserName" {...form.getInputProps("username")} />
        </Flex>
        <Flex direction="column" gap={16} mt={16}>
          <Button type="submit">Register</Button>
          {/* REGISTER ERROR*/}
          {error && <Text c="red">{error}</Text>}
        </Flex>
      </Form>
    </>
  );
};

export default RegisterForm;
