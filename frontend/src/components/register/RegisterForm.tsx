"use client";

import { apiFetch } from "@/utils/apiFetch";
import { Button, Flex, Select, Text, TextInput } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import React from "react";

export interface RegisterFormType {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  username: string;
  universityId: string;
}

interface RegisterFormProps {}

const RegisterForm = () => {
  const form = useForm<RegisterFormType>({
    initialValues: {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      username: "",
      universityId: "",
    },
    validate: {
      email: isEmail("Must be a valid email"),
      password: isNotEmpty("Password can not be empty."),
      firstname: isNotEmpty("First name can not be empty."),
      lastname: isNotEmpty("Last name can not be empty."),
      username: isNotEmpty("User name can not be empty."),
      universityId: isNotEmpty("University must be selected."),
    },
  });

  const registerUser = async (values: RegisterFormType) => {
    const res = await apiFetch("/auth/register", {
      method: "POST",
      data: {
        email: "mlejnpe1@gmail.com",
        password: "password",
        firstname: "Petr",
        lastname: "Mlejnek",
        username: "Mlejnas",
        universityId: "changeme",
      },
    });
    console.log(res);
  };

  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          registerUser(values);
        })}
      >
        <Flex direction="column" gap={12}>
          <TextInput label="Email" />
          <TextInput label="Password" type="password" />
          <TextInput label="FirstName" />
          <TextInput label="LastName" />
          <TextInput label="UserName" />
          <Select
            label="University"
            placeholder="Select your university"
            data={["UHK", "UPCE", "MUNI", "ČVUT", "VUT"]}
          />
        </Flex>
        <Flex direction="column" gap={16} mt={16}>
          <Button loading={false} type="submit">
            Register
          </Button>
          {/* REGISTER ERROR*/}
          <Text c="bfiRed.6">Something went wrong! Please try again.</Text>
        </Flex>
      </form>
    </>
  );
};

export default RegisterForm;
