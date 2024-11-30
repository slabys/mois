"use client";

import { useCreateUser } from "@/utils/api";
import { CreateUser } from "@/utils/api.schemas";
import routes from "@/utils/routes";
import { Box, Button, Flex, Text, TextInput } from "@mantine/core";
import { Form, isNotEmpty, useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import React from "react";

const RegistrationForm = () => {
  const router = useRouter();
  const registerUserMutation = useCreateUser({
    mutation: {
      onSuccess: () => {
        router.push(routes.LOGIN);
      },
    },
  });

  const form = useForm<CreateUser>({
    initialValues: {
      email: "",
      password: "",
      username: "",
      firstName: "",
      lastName: "",
      universityId: "",
    },
    validate: {
      email: isNotEmpty("Username can not be empty."),
      username: isNotEmpty("Username can not be empty."),
      password: isNotEmpty("Password can not be empty."),
      firstName: isNotEmpty("Password can not be empty."),
      lastName: isNotEmpty("Password can not be empty."),
    },
  });

  const registerUser = (values: CreateUser) => {
    registerUserMutation.mutate({
      data: values,
    });
  };

  return (
    <Box maw="32rem" w="100%">
      <Form form={form} onSubmit={registerUser}>
        <Flex direction="column" gap={12}>
          <TextInput label="Email" {...form.getInputProps("email")} />
          <TextInput label="Username" {...form.getInputProps("username")} />
          <TextInput label="Password" type="password" {...form.getInputProps("password")} />
          <TextInput label="First Name" {...form.getInputProps("firstName")} />
          <TextInput label="Last Name" {...form.getInputProps("lastName")} />
        </Flex>
        <Flex direction="column" gap={16} mt={16}>
          <Button loading={registerUserMutation.isPending} type="submit">
            Register
          </Button>
          {/* Register ERROR */}
          {registerUserMutation.isError && <Text c="red">Something went wrong! Please try again.</Text>}
        </Flex>
      </Form>
    </Box>
  );
};

export default RegistrationForm;
