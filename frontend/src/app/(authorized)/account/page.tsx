"use client";

import { useGetCurrentUser, useUpdateCurrentUser, useUpdateCurrentUserPhoto } from "@/utils/api";
import type { UpdateUser } from "@/utils/api.schemas";
import { Dropzone } from "@components/Dropzone/Dropzone";
import ImageEditor from "@components/ImageEditor/ImageEditor";
import getCroppedImg from "@components/ImageEditor/imageEdit";
import { Avatar, Box, Button, Container, Flex, Group, Image, Overlay, Stack, Text, TextInput } from "@mantine/core";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { useHover } from "@mantine/hooks";
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

  const { data: currentUser } = useGetCurrentUser();

  const form = useForm<UpdateUser>({
    mode: "uncontrolled",
    initialValues: {
      username: "",
      firstName: "",
      lastName: "",
      password: "",
    },
    validate: {
      username: hasLength({ min: 6 }, "Must be at least 6 characters"),
      firstName: isNotEmpty("This field cannot be empty"),
      lastName: isNotEmpty("This field cannot be empty"),
      password: hasLength({ min: 6 }, "Must be at least 6 characters"),
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
    request: {
      data: form.values,
    },
    mutation: {
      onSuccess: ({}: UpdateUser) => {},
    },
  });

  const isTouchedDirty = form.isTouched() && form.isDirty();

  const updateUserPhotoMutation = useUpdateCurrentUserPhoto({
    mutation: {
      onSuccess: () => {
        setCroppedArea(null);
        setNewUserPhoto(null);
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

      <form>
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
          <Button disabled={!isTouchedDirty} loading={updateUserMutation.isPending}>
            Save changes
          </Button>
        </Group>
      </form>
    </Container>
  );
};
export default AccountPage;
