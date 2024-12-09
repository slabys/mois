"use client";

import { useCreateUser } from "@/utils/api";
import { CreateUser, CreateUserGender } from "@/utils/api.schemas";
import routes from "@/utils/routes";
import { Box, Button, Flex, Select, SimpleGrid, Text, TextInput } from "@mantine/core";
import { Form, hasLength, isEmail, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import React from "react";

interface FormInitialTypes extends Partial<CreateUser> {
  confirmPassword: string | undefined;
}

const RegistrationForm = () => {
  const router = useRouter();
  const registerUserMutation = useCreateUser({
    mutation: {
      onMutate: () => {
        notifications.show({
          id: "register-event",
          loading: true,
          title: "Loading! Please wait...",
          message: "We are processing your registration information.",
          autoClose: false,
        });
      },
      onSuccess: () => {
        notifications.update({
          id: "register-event",
          title: "Registration",
          message: "You have registered successfully!",
          color: "green",
          loading: false,
          autoClose: true,
        });
        router.push(routes.LOGIN);
      },
      onError: (mutationError) => {
        if (!mutationError.response?.data) return;
        const { statusCode, error, message } = mutationError.response?.data;
        console.error(statusCode, error, message);
        notifications.update({
          id: "register-event",
          title: "Something went wrong.",
          message: "Please check all information first. Then try again.",
          color: "red",
          loading: false,
          autoClose: true,
        });
        let parsedMessage: string[] = [];
        if (typeof message === "string") {
          parsedMessage.push(message);
        }
        parsedMessage.forEach((err) => {
          notifications.show({
            title: `${statusCode} ${error}`,
            message: err,
            color: "red",
          });
        });
      },
    },
  });

  const form = useForm<FormInitialTypes>({
    validateInputOnChange: true,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: undefined,
      gender: undefined,
    },
    validate: {
      firstName: isNotEmpty("Password can not be empty."),
      lastName: isNotEmpty("Password can not be empty."),
      email: isEmail("E-mail is not valid."),
      username: hasLength({ min: 6 }, "Must be at least 6 characters"),
      gender: (value) => (value ? null : "Gender is required."),
      password: hasLength({ min: 6 }, "Must be at least 6 characters"),
      confirmPassword: (value, values) => (values.password === value ? null : "Password does not match"),
      personalAddress: (address) => {
        if (!address) return null;
        if (!address.city) return "City is required.";
        if (!address.country) return "Country is required.";
        if (!address.houseNumber.match(/^(\d+)(\/\d+)?$/)) return "House number must match the required pattern.";
        if (!address.street) return "Street is required.";
        if (!address.zip) return "ZIP code is required.";
        return null;
      },
    },
  });

  const registerUser = (values: Partial<CreateUser>) => {
    form.validate();
    if (form.isValid()) {
      registerUserMutation.mutate({
        data: values as CreateUser,
      });
    }
  };

  return (
    <Box maw="32rem" w="100%">
      <Form form={form} onSubmit={registerUser}>
        <Flex direction="column" gap={12}>
          <SimpleGrid cols={2}>
            <TextInput label="First Name" {...form.getInputProps("firstName")} required />
            <TextInput label="Last Name" {...form.getInputProps("lastName")} required />
          </SimpleGrid>
          <TextInput label="Email" {...form.getInputProps("email")} required />
          <SimpleGrid cols={2}>
            <TextInput label="Username" {...form.getInputProps("username")} required />
            <Select
              label="Gender"
              {...form.getInputProps("gender")}
              data={Object.entries(CreateUserGender).map(([key, gender]) => {
                return {
                  label: (String(gender).charAt(0).toUpperCase() + String(gender).slice(1)).replaceAll("-", " "),
                  value: key,
                };
              })}
              required
            />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <TextInput label="Password" type="password" {...form.getInputProps("password")} required />
            <TextInput label="Confirm Password" type="password" {...form.getInputProps("confirmPassword")} required />
          </SimpleGrid>
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
