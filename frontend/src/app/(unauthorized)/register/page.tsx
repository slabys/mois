"use-client";

import RegisterForm from "@components/register/RegisterForm";
import { Container, Title } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";

const RegisterPage = () => {
  // const form = useForm({
  //   initialValues: {
  //     email: "",
  //     password: "",
  //     firstname: "",
  //     lastname: "",
  //     username: "",
  //     universityId: "",
  //   },
  //   validate: {
  //     email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
  //     password: isNotEmpty("Password can not be empty!"),
  //     firstname: isNotEmpty("First name can not be empty!"),
  //     lastname: isNotEmpty("Last name can not be empty!"),
  //     username: isNotEmpty("Username can not be empty!"),
  //     universityId: isNotEmpty("University must be selected"),
  //   },
  // });
  //
  // console.log(form);

  return (
    <Container>
      <Title>Register</Title>
      <RegisterForm />
    </Container>
  );
};

export default RegisterPage;
