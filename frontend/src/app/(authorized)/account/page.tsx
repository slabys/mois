"use client";

import { useGetCurrentUser, useUpdateCurrentUser, useUpdateCurrentUserPhoto } from "@/utils/api";
import { CreateAddress, CreateUserGender, UpdateUser } from "@/utils/api.schemas";
import { apiImageURL } from "@/utils/apiImageURL";
import { Dropzone } from "@components/Dropzone/Dropzone";
import ImageEditor from "@components/ImageEditor/ImageEditor";
import getCroppedImg from "@components/ImageEditor/imageEdit";
import Select from "@components/primitives/Select";
import {
  Accordion,
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Group,
  Image,
  Overlay,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { Form, isNotEmpty, useForm } from "@mantine/form";
import { useHover } from "@mantine/hooks";
import { IconMoodEdit } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { FileWithPath } from "react-dropzone-esm";
import { Area } from "react-easy-crop";

interface UpdateUserProps extends Partial<UpdateUser> {
  confirmPassword?: string;
}

const AccountPage = () => {
  const queryClient = useQueryClient();
  const { hovered, ref: hoverRef } = useHover();

  const [croppedArea, setCroppedArea] = useState<{ croppedArea: Area; croppedAreaPixels: Area } | null>(null);
  const [newUserPhoto, setNewUserPhoto] = useState<FileWithPath | null>(null);
  const [isUpdatingUserPhoto, setUpdatingUserPhoto] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [imageURL, _photoPreview] = useMemo(() => {
    if (!newUserPhoto) return [undefined, undefined];
    const imageUrl = URL.createObjectURL(newUserPhoto);
    return [
      imageUrl,
      <Image
        key="image-preview"
        src={imageUrl}
        w="200px"
        h="200px"
        alt="User photo preview"
        onLoad={() => URL.revokeObjectURL(imageUrl)}
      />,
    ];
  }, [newUserPhoto]);

  const isPersonalAddress = (address: CreateAddress | undefined | null) => {
    return address ? Object.entries(address).some(([_key, value]) => (value as string)?.length > 0) : undefined;
  };
  const { data: currentUser, refetch: fetchCurrentUser, isFetchedAfterMount } = useGetCurrentUser();

  useEffect(() => {
    if (!currentUser) return;
    const userValues = {
      ...form.values,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      username: currentUser.username,
      gender: currentUser.gender,
      personalAddress: currentUser.personalAddress ?? {
        street: "",
        houseNumber: "",
        zip: "",
        city: "",
        country: "",
      },
    };

    form.setInitialValues(userValues);
    form.setValues(userValues);
    form.reset();
    form.resetTouched();
  }, [currentUser, fetchCurrentUser, isFetchedAfterMount]); // eslint-disable-line react-hooks/exhaustive-deps

  const form = useForm<UpdateUserProps>({
    initialValues: {
      firstName: undefined,
      lastName: undefined,
      username: undefined,
      gender: undefined,
      password: undefined,
      confirmPassword: undefined,
      personalAddress: {
        street: "",
        houseNumber: "",
        zip: "",
        city: "",
        country: "",
      },
    },
    validate: {
      firstName: isNotEmpty("This field cannot be empty"),
      lastName: isNotEmpty("This field cannot be empty"),
      confirmPassword: (value, values) => (values.password === value ? null : "Password does not match"),
      personalAddress: {
        // houseNumber: (zipValue: string | undefined) =>
        //   zipValue ? (/^(\d+)(\/\d+)?$/.test(zipValue) ? null : "Unable to send format") : null,
        zip: isNotEmpty("This field should not be empty"),
        city: isNotEmpty("This field should not be empty"),
        country: isNotEmpty("This field should not be empty"),
      },
    },
    transformValues: (values) => {
      const isAddressActive = isPersonalAddress(values.personalAddress);

      const { personalAddress, ...restValues } = values;
      return { ...restValues, personalAddress: isAddressActive ? values.personalAddress : undefined };
    },
  });

  const updateUserMutation = useUpdateCurrentUser({
    mutation: {
      onSuccess: (data) => {
        form.setInitialValues(data);
        form.setValues(data);
        form.resetDirty();
        form.resetTouched();
        setIsEditing(false);
        fetchCurrentUser();
      },
    },
  });

  const handleUpdateUser = (values: UpdateUser) => {
    updateUserMutation.mutate({
      data: values,
    });
  };

  const isTouchedDirty = form.isTouched() && form.isDirty();

  const updateUserPhotoMutation = useUpdateCurrentUserPhoto({
    mutation: {
      onSuccess: () => {
        setCroppedArea(null);
        setNewUserPhoto(null);
        fetchCurrentUser();
      },
    },
  });

  const uploadNewUserImage = async () => {
    if (newUserPhoto && croppedArea) {
      const croppedImage = await getCroppedImg({
        imageSrc: URL.createObjectURL(newUserPhoto),
        pixelCrop: croppedArea.croppedAreaPixels,
        returnType: "Blob",
      });
      if (croppedImage instanceof Blob) {
        updateUserPhotoMutation.mutate({
          data: {
            file: croppedImage,
          },
        });
      }
    }
  };

  const cancelPhotoUpdate = () => {
    setCroppedArea(null);
    setNewUserPhoto(null);
  };

  return (
    <Container size="sm" mt="lg">
      <Flex direction="column" justify="center" align="center" gap={12}>
        <Text size="xl" ta="center">
          Account Page
        </Text>
        <Box pos="relative" w={100} h={100} ref={hoverRef}>
          <Avatar src={apiImageURL(currentUser?.photo)} alt="Avatar" radius="50%" size={100} />
          {hovered && (
            <Overlay radius="50%">
              <Button
                w="100%"
                h="100%"
                radius="50%"
                variant="transparent"
                size="xl"
                onClick={() => {
                  setNewUserPhoto(null);
                  setUpdatingUserPhoto(!isUpdatingUserPhoto);
                }}
              >
                <IconMoodEdit color="white" />
              </Button>
            </Overlay>
          )}
        </Box>
        <Group>
          {newUserPhoto && (
            <>
              <Box pos="relative" w="200px" h="200px">
                <ImageEditor
                  cropper={{
                    image: imageURL,
                    cropShape: "round",
                    onCropAreaChange: (croppedArea, croppedAreaPixels) =>
                      setCroppedArea({
                        croppedArea,
                        croppedAreaPixels,
                      }),
                  }}
                />
              </Box>
              <Stack>
                <Button onClick={uploadNewUserImage}>Update Image</Button>
                <Button onClick={cancelPhotoUpdate} color="red">
                  Cancel
                </Button>
              </Stack>
            </>
          )}

          {/*<Image*/}
          {/*  key="result-image-preview"*/}
          {/*  src={croppedImage}*/}
          {/*  w="200px"*/}
          {/*  h="200px"*/}
          {/*  alt="User photo preview"*/}
          {/*  onLoad={() => croppedImage && URL.revokeObjectURL(croppedImage)}*/}
          {/*/>*/}
        </Group>
        {isUpdatingUserPhoto && (
          <Dropzone
            handleOnDrop={(files) => {
              setNewUserPhoto(files[0]);
              setUpdatingUserPhoto(false);
            }}
            multiple={false}
            maxFiles={1}
          />
        )}
      </Flex>

      <Form form={form} onSubmit={handleUpdateUser}>
        <Flex direction="column" gap={12}>
          <SimpleGrid cols={2}>
            <TextInput label="First name" {...form.getInputProps("firstName")} disabled={!isEditing} />
            <TextInput label="Second name" {...form.getInputProps("lastName")} disabled={!isEditing} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <TextInput label="Username" {...form.getInputProps("username")} disabled={!isEditing} />
            <Select
              label="Gender"
              data={Object.entries(CreateUserGender).map(([key, gender]) => {
                return {
                  label: gender, // (String(gender).charAt(0).toUpperCase() + String(gender).slice(1)).replaceAll("-", " "),
                  value: key,
                };
              })}
              {...form.getInputProps("gender")}
              disabled={!isEditing}
            />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <TextInput
              label="Password"
              type="password"
              {...form.getInputProps("password")}
              onChange={(e) => {
                form.setFieldValue("password", e.currentTarget.value.length > 0 ? e.currentTarget.value : undefined);
              }}
              disabled={!isEditing}
            />
            <TextInput
              label="Confirm Password"
              type="password"
              {...form.getInputProps("confirmPassword")}
              onChange={(e) => {
                form.setFieldValue(
                  "confirmPassword",
                  e.currentTarget.value.length > 0 ? e.currentTarget.value : undefined,
                );
              }}
              disabled={!isEditing}
            />
          </SimpleGrid>
          <Accordion defaultValue="Apples">
            <Accordion.Item value="Personal Address">
              <Accordion.Control>Personal Address</Accordion.Control>
              <Accordion.Panel>
                <Grid>
                  <Grid.Col span={8}>
                    <TextInput
                      label="Street"
                      key={form.key("personalAddress.street")}
                      {...form.getInputProps("personalAddress.street")}
                      disabled={!isEditing}
                      required={isPersonalAddress(form.values.personalAddress)}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label="House Number"
                      key={form.key("personalAddress.houseNumber")}
                      {...form.getInputProps("personalAddress.houseNumber")}
                      disabled={!isEditing}
                      required={isPersonalAddress(form.values.personalAddress)}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="ZIP code"
                      key={form.key("personalAddress.zip")}
                      {...form.getInputProps("personalAddress.zip")}
                      disabled={!isEditing}
                      required={isPersonalAddress(form.values.personalAddress)}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="City"
                      key={form.key("personalAddress.city")}
                      {...form.getInputProps("personalAddress.city")}
                      disabled={!isEditing}
                      required={isPersonalAddress(form.values.personalAddress)}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <TextInput
                      label="Country"
                      key={form.key("personalAddress.country")}
                      {...form.getInputProps("personalAddress.country")}
                      disabled={!isEditing}
                      required={isPersonalAddress(form.values.personalAddress)}
                    />
                  </Grid.Col>
                </Grid>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Flex>
        <Group justify="center" mt="lg">
          <Button
            onClick={() => {
              form.reset();
              setIsEditing(!isEditing);
            }}
            loading={updateUserMutation.isPending}
            color={isEditing ? "red" : "blue"}
          >
            {isEditing ? "Cancel" : "Edit Info"}
          </Button>
          <Button type="submit" disabled={!isTouchedDirty} loading={updateUserMutation.isPending}>
            Save changes
          </Button>
        </Group>
      </Form>
    </Container>
  );
};
export default AccountPage;
