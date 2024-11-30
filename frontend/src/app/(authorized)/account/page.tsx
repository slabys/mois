"use client";

import { Avatar, Box, Button, Container, Group, Overlay, Text, TextInput } from "@mantine/core";
import { IconMoodEdit } from "@tabler/icons-react";
import { ChangeEvent, useState } from "react";

const AccountPage = () => {
  const [hovered, setHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "Jan",
    lastName: "Novák",
    nickname: "Honza",
    email: "jan.novak@example.com",
    university: "Univerzita Karlova",
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    <Container size="sm" mt="lg">
      <Text size="xl" mb="lg" ta="center">
        Account Page
      </Text>
      <Box
        style={{ position: "relative", width: 100, height: 100, margin: "0 auto" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Avatar src="" alt="Avatar" radius="50%" size={100} />
        {hovered && isEditing && (
          <Overlay
            color="rgba(0, 0, 0, 0.8)"
            radius="50%"
            opacity={1}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button variant="light" size="xs" onClick={() => alert("Change image.")}>
              <IconMoodEdit color="white" />
            </Button>
          </Overlay>
        )}
      </Box>

      <form>
        <TextInput
          label="First name"
          value={formData.firstName}
          onChange={(e) => handleInputChange("firstName", e.target.value)}
          disabled={!isEditing}
          mt="md"
        />
        <TextInput
          label="Second name"
          value={formData.lastName}
          onChange={(e) => handleInputChange("lastName", e.target.value)}
          disabled={!isEditing}
          mt="md"
        />
        <TextInput
          label="Username"
          value={formData.nickname}
          onChange={(e) => handleInputChange("nickname", e.target.value)}
          disabled={!isEditing}
          mt="md"
        />
        <TextInput
          label="Email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          disabled={!isEditing}
          mt="md"
        />
        <TextInput
          label="My university"
          value={formData.university}
          onChange={(e) => handleInputChange("university", e.target.value)}
          disabled={true}
          mt="md"
        />
        <Group justify="center" mt="lg">
          <Button onClick={toggleEditing}>{isEditing ? "Save changes" : "Edit account"}</Button>
        </Group>
      </form>
    </Container>
  );
};
export default AccountPage;
