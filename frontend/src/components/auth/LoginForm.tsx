"use client";

import { apiFetch } from "@/utils/apiFetch";
import { Button, Flex, Stack, Text, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import React from "react";

export interface LoginFormType {
  username: string;
  password: string;
}

interface LoginFormProps {}

const LoginForm = ({}: LoginFormProps) => {
  const form = useForm<LoginFormType>({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: isNotEmpty("Username can not be empty."),
      password: isNotEmpty("Password can not be empty."),
    },
  });

  const loginUser = async (values: LoginFormType) => {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      data: {
        email: "info@slabys.cz",
        password: "password",
      },
      withCredentials: true,
    });
    console.log(res);
  };

  const testMe = async () => {
    const res = await apiFetch("/users", {
      method: "GET",
    });
    console.log(res);
  };

  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          loginUser(values);
        })}
      >
        <Flex direction="column" gap={12}>
          <TextInput label="Username" {...form.getInputProps("username")} />
          <TextInput label="Password" type="password" {...form.getInputProps("password")} />
        </Flex>
        <Flex direction="column" gap={16} mt={16}>
          {/*TODO loading*/}
          <Button loading={false} type="submit">
            Log In
          </Button>
          {/* LOGIN ERROR */}
          <Text c="bfiRed.6">Something went wrong! Please try again.</Text>
          <Stack gap={8}>
            <Text c="bfiPositive.8" fw={700}>
              Password reset has been requested.
            </Text>
            <Text c="bfiPositive.8">Email with instructions has been sent to the associated email address. </Text>
          </Stack>
        </Flex>
      </form>
      <Button loading={false} onClick={() => testMe()}>
        Funguj
      </Button>
    </>
  );
};

export default LoginForm;
