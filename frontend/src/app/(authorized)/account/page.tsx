"use client";

import { useGetCurrentUser, useUpdateCurrentUser, useUpdateCurrentUserPhoto } from "@/utils/api";
import type { UpdateUser } from "@/utils/api.schemas";
import { Dropzone } from "@components/Dropzone/Dropzone";
import ImageEditor from "@components/ImageEditor/ImageEditor";
import getCroppedImg from "@components/ImageEditor/imageEdit";
import { Avatar, Box, Button, Container, Flex, Group, Image, Overlay, Stack, Text, TextInput } from "@mantine/core";
import { Form, isNotEmpty, useForm } from "@mantine/form";
import { useHover } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconMoodEdit } from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { FileWithPath } from "react-dropzone-esm";
import { Area } from "react-easy-crop";

const AccountPage = () => {
  const dropzoneRef = useRef<() => void>(null);
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

  const { data: currentUser, refetch: refetchCurrectUser } = useGetCurrentUser();

  const form = useForm<UpdateUser>({
    initialValues: {
      username: "",
      firstName: "",
      lastName: "",
    },
    validate: {
      // username: hasLength({ min: 6 }, "Must be at least 6 characters"),
      firstName: isNotEmpty("This field cannot be empty"),
      lastName: isNotEmpty("This field cannot be empty"),
    },
  });

  useEffect(() => {
    if (!currentUser) return;

    form.setInitialValues(currentUser);
    form.setValues({
      username: currentUser.username,
      lastName: currentUser.lastName,
      firstName: currentUser.firstName,
    });
    form.resetDirty();
    form.resetTouched();
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateUserMutation = useUpdateCurrentUser({
    mutation: {
      onMutate: () => {
        notifications.show({
          id: "user-mutation",
          loading: true,
          title: "Loading! Please wait...",
          message: "We are updating your information.",
          autoClose: false,
        });
      },
      onSuccess: () => {
        notifications.update({
          id: "user-mutation",
          title: "Account Edit",
          message: "Account information updated successfully.",
          color: "green",
          loading: false,
          autoClose: true,
        });
        refetchCurrectUser();
        setIsEditing(false);
      },
      onError: (error) => {
        notifications.update({
          id: "user-mutation",
          title: "Something went wrong.",
          message: "Please check all information first. Then try again.",
          color: "red",
          loading: false,
          autoClose: true,
        });
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

  const handleUpdateUser = (values: UpdateUser) => {
    updateUserMutation.mutate({
      data: form.values,
    });
  };

  const isTouchedDirty = form.isTouched() && form.isDirty();

  const updateUserPhotoMutation = useUpdateCurrentUserPhoto({
    mutation: {
      onMutate: () => {
        notifications.show({
          id: "photo-update-mutation",
          loading: true,
          title: "Loading! Please wait...",
          message: "We are updating your photo information.",
          autoClose: false,
        });
      },
      onSuccess: () => {
        notifications.update({
          id: "photo-update-mutation",
          title: "Update User Photo",
          message: "Account photo updated successfully.",
          color: "green",
          loading: false,
          autoClose: true,
        });
        setCroppedArea(null);
        setNewUserPhoto(null);
        refetchCurrectUser();
      },
      onError: (error) => {
        notifications.update({
          id: "photo-update-mutation",
          title: "Something went wrong.",
          message: "Please, try again.",
          color: "red",
          loading: false,
          autoClose: true,
        });
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
          <Avatar src="" alt="Avatar" radius="50%" size={100} />
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
            openRef={dropzoneRef}
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
        <TextInput label="First name" {...form.getInputProps("firstName")} disabled={!isEditing} />
        <TextInput label="Second name" {...form.getInputProps("lastName")} disabled={!isEditing} />
        <TextInput label="Username" {...form.getInputProps("username")} disabled={!isEditing} />
        <Group justify="center" mt="lg">
          <Button
            onClick={() => setIsEditing(!isEditing)}
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
