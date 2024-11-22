"use client";

import { useLoginUserWithEmail } from "@/utils/api";
import { LoginUser } from "@/utils/api.schemas";
import routes from "@/utils/routes";
import { Box, Button, Flex, Text, TextInput } from "@mantine/core";
import { Form, isNotEmpty, useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface LoginFormProps {}

const LoginForm = ({}: LoginFormProps) => {
  const [error, setError] = useState(false);

  const router = useRouter();
  const loginUserMutation = useLoginUserWithEmail({
    mutation: {
      onSuccess: () => {
        router.push(routes.DASHBOARD);
      },
      onError: () => {
        setError(true);
      },
    },
  });
  const form = useForm<LoginUser>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: isNotEmpty("Username can not be empty."),
      password: isNotEmpty("Password can not be empty."),
    },
  });

  const loginUser = (values: LoginUser) => {
    console.log(values);
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
          {/*TODO loading*/}
          <Button loading={false} type="submit">
            Log In
          </Button>
          {/* LOGIN ERROR */}
          {error && <Text c="red">Something went wrong! Please try again.</Text>}
        </Flex>
      </Form>
    </Box>
  );
};

export default LoginForm;
