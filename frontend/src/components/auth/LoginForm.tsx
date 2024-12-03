"use client";

import { LoginUserWithEmailMutationBody, LoginUserWithEmailMutationError, useLoginUserWithEmail } from "@/utils/api";
import { Function } from "@/utils/api.schemas";
import routes from "@/utils/routes";
import { Box, Button, Flex, Text, TextInput } from "@mantine/core";
import { Form, isNotEmpty, useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import React from "react";

const LoginForm = () => {
  const router = useRouter();
  const loginUserMutation = useLoginUserWithEmail<LoginUserWithEmailMutationBody, LoginUserWithEmailMutationError>({
    mutation: {
      onSuccess: () => {
        router.push(routes.DASHBOARD);
      },
      onError: (error) => {
        console.error("Login failed:", error);
      },
    },
  });

  const form = useForm<Function>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: isNotEmpty("Username can not be empty."),
      password: isNotEmpty("Password can not be empty."),
    },
  });

  const loginUser = async (values: Function) => {
    loginUserMutation.mutate({
      data: values,
    });
  };

  return (
    <Box maw="32rem" w="100%">
      <Form form={form} onSubmit={loginUser}>
        <Flex direction="column" gap={12}>
          <TextInput label="Email" {...form.getInputProps("email")} />
          <TextInput label="Password" type="password" {...form.getInputProps("password")} />
        </Flex>
        <Flex direction="column" gap={16} mt={16}>
          <Button loading={loginUserMutation.isPending} type="submit">
            Log In
          </Button>
          {/* LOGIN ERROR */}
          {loginUserMutation.isError && <Text c="red">Something went wrong! Please try again.</Text>}
        </Flex>
      </Form>
    </Box>
  );
};

export default LoginForm;
