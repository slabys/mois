import { useUpdateEventSpot } from "@/utils/api";
import { EventSpotSimple, UpdateEventSpot } from "@/utils/api.schemas";
import { Button, Flex, Group, Modal, NumberInput, SimpleGrid, TextInput } from "@mantine/core";
import { Form, hasLength, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import React from "react";

interface UpdateSpotModalProps {
  currentSpot: EventSpotSimple;
  isOpened: boolean;
  closeModal: () => void;
  handleSuccess: () => void;
}

const UpdateSpotModal = ({ currentSpot, isOpened, closeModal, handleSuccess = () => {} }: UpdateSpotModalProps) => {
  const updateSpotMutation = useUpdateEventSpot({
    mutation: {
      onMutate: () => {
        notifications.show({
          id: "update-spot",
          loading: true,
          title: "Loading! Please wait...",
          message: "We are updation spot information.",
          autoClose: false,
        });
      },
      onSuccess: () => {
        notifications.update({
          id: "update-spot",
          title: "Spot Edit",
          message: "Spot updated successfully.",
          color: "green",
          loading: false,
          autoClose: true,
        });
        handleSuccess();
        closeModal();
      },
      onError: (error) => {
        notifications.update({
          id: "update-spot",
          title: "Something went wrong.",
          message: "Please check all information first. Then try again.",
          color: "red",
          loading: false,
          autoClose: true,
        });
        if (error.response?.data && error.response.data.message) {
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

  const form = useForm<Partial<EventSpotSimple>>({
    initialValues: {
      name: currentSpot.name,
      price: currentSpot.price,
    },
    validate: {
      name: hasLength({ min: 6 }, "Must be at least 6 characters."),
      price: (value) => (!!value && value < 0 ? "Must be larger than or equal to 0" : null),
    },
  });

  const handleUpdateSpot = (submitValues: Partial<UpdateEventSpot>) => {
    form.validate();
    if (form.isValid()) {
      updateSpotMutation.mutate({
        id: currentSpot.id,
        data: submitValues as UpdateEventSpot,
      });
    }
  };

  const isTouchedDirty = form.isTouched() && form.isDirty();

  return (
    <Modal size="lg" opened={isOpened} onClose={closeModal} title="Add Spot type">
      <Form form={form} onSubmit={handleUpdateSpot}>
        <Flex direction="column" gap={16}>
          <SimpleGrid cols={2}>
            <TextInput label="Spot Name" {...form.getInputProps("name")}></TextInput>
            <NumberInput label="Spot Price (CZK)" {...form.getInputProps("price")} suffix=" CZK" min={0} />
          </SimpleGrid>
        </Flex>
        <Group justify="center" mt="lg">
          <Button type="submit" disabled={!isTouchedDirty} loading={updateSpotMutation.isPending}>
            Update Spot
          </Button>
        </Group>
      </Form>
    </Modal>
  );
};

export default UpdateSpotModal;
