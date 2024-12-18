import { useUpdateEventPhoto } from "@/utils/api";
import { Dropzone } from "@components/Dropzone/Dropzone";
import { Button, Center, Group, Image, Modal } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React, { useState } from "react";
import { FileWithPath } from "react-dropzone-esm";

interface MyModalProps {
  eventId: number;
  isOpened: boolean;
  closeModal: () => void;
  onSuccessUpdate: () => void;
}

const UpdateEventPhotoModal: React.FC<MyModalProps> = ({ eventId, onSuccessUpdate, isOpened, closeModal }) => {
  const [file, setFile] = useState<FileWithPath | null>(null);

  const uploadEventPhoto = useUpdateEventPhoto({
    mutation: {
      onMutate: () => {
        notifications.show({
          id: "event-photo-update",
          loading: true,
          title: "Loading! Please wait...",
          message: "We are updating your photo information.",
          autoClose: false,
        });
      },
      onSuccess: () => {
        notifications.update({
          id: "event-photo-update",
          title: "Update User Photo",
          message: "Account photo updated successfully.",
          color: "green",
          loading: false,
          autoClose: true,
        });
        onSuccessUpdate();
        setFile(null);
        closeModal();
      },
      onError: (mutationError) => {
        if (!mutationError.response?.data) return;
        const { statusCode, error, message } = mutationError.response?.data;
        console.error(statusCode, error, message);
        notifications.update({
          id: "event-photo-update",
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

  const handleUpdateEvenPhoto = () => {
    if (!file) return;
    uploadEventPhoto.mutate({
      eventId: eventId,
      data: {
        file: file,
      },
    });
  };

  return (
    <Modal
      size="xl"
      opened={isOpened}
      onClose={() => {
        setFile(null);
        closeModal();
      }}
      title="Update Event Photo"
    >
      <Dropzone
        handleOnDrop={(files) => {
          setFile(files[0]);
        }}
        multiple={false}
        maxFiles={1}
      />
      {file && (
        <Center>
          <Image
            key="result-image-preview"
            src={URL.createObjectURL(file)}
            w="200px"
            h="200px"
            alt="User photo preview"
          />
        </Center>
      )}
      <Group justify="center" mt="lg">
        <Button onClick={handleUpdateEvenPhoto} disabled={!file} loading={uploadEventPhoto.isPending}>
          Upload Photo
        </Button>
      </Group>
    </Modal>
  );
};
export default UpdateEventPhotoModal;
