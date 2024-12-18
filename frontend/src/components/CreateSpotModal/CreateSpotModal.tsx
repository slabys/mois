import { useCreateEventSpot } from "@/utils/api";
import { CreateEvent, CreateEventSpot, EventDetail } from "@/utils/api.schemas";
import { Button, Flex, Group, Modal, NumberInput, TextInput } from "@mantine/core";
import { Form, hasLength, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import React from "react";

interface CreateSpotModalProps {
  isOpened: boolean;
  closeModal: () => void;
  eventId: number;
}

const CreateSpotModal = ({ isOpened, closeModal, eventId }: CreateSpotModalProps) => {
  const createSpotMutation = useCreateEventSpot({
    mutation: {
      onMutate: () => {
        notifications.show({
          id: "create-spot",
          loading: true,
          title: "Loading! Please wait...",
          message: "We are create event.",
          autoClose: false,
        });
      },
      onSuccess: () => {
        notifications.update({
          id: "create-spot",
          title: "Event Edit",
          message: "Event create updated successfully.",
          color: "green",
          loading: false,
          autoClose: true,
        });
        closeModal();
      },
      onError: (error) => {
        notifications.update({
          id: "create-spot",
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

  const form = useForm<Partial<CreateEventSpot>>({
    initialValues: {
      name: "",
      price: 0,
    },
    validate: {
      name: hasLength({ min: 3 }, "Must be at least 3 characters."),
      price: (value) => (!!value && value < 0 ? "Must be larger than or equal to 0" : null),
    },
  });

  const handleCreateSpot = (submitValues: Partial<CreateEventSpot>) => {
    form.validate();
    if (form.isValid()) {
      createSpotMutation.mutate({
        id: eventId,
        data: submitValues as CreateEventSpot,
      });
    }
  };

  const isTouchedDirty = form.isTouched() && form.isDirty();

  return (
    <Modal size="lg" opened={isOpened} onClose={closeModal} title="Add Spot type">
      <Form form={form} onSubmit={handleCreateSpot}>
        <Flex direction="column" gap={16}>
          <TextInput label="Spot Name" {...form.getInputProps("name")}></TextInput>
          <NumberInput label="Spot Price" {...form.getInputProps("price")}></NumberInput>
        </Flex>
        <Group justify="center" mt="lg">
          <Button type="submit" disabled={!isTouchedDirty} loading={createSpotMutation.isPending}>
            Create Spot
          </Button>
        </Group>
      </Form>
    </Modal>
  );
};
export default CreateSpotModal;
