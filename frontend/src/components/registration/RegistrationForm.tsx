"use client";

import { useCreateUser } from "@/utils/api";
import { CreateUser } from "@/utils/api.schemas";
import routes from "@/utils/routes";
import { Box, Button, Flex, Text, TextInput } from "@mantine/core";
import { Form, hasLength, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import React from "react";

const RegistrationForm = () => {
  const router = useRouter();
  const registerUserMutation = useCreateUser({
    mutation: {
      onSuccess: () => {
        notifications.show({
          title: "Registration",
          message: "You have registered successfully!",
          color: "green",
        });
        router.push(routes.LOGIN);
      },
      onError: (error) => {
        // @ts-ignore - message
        if (error.response?.data && error.response.data.message) {
          // @ts-ignore - message
          (error.response.data.message as string[]).forEach((err) => {
            notifications.show({
              title: "Error",
              message: err,
              color: "red",
            });
          });
        }
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
      // email: isEmail("E-mail is not valid."),
      // username: hasLength({ min: 6 }, "Must be at least 6 characters"),
      password: hasLength({ min: 6 }, "Must be at least 6 characters"),
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
          <Flex direction="row">
            {registerUserMutation.isError && <Text c="red">Something went wrong! Please try again.</Text>}
          </Flex>
        </Flex>
      </Form>
    </Box>
  );
};

export default RegistrationForm;
