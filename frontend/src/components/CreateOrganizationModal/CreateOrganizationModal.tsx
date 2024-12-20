import { useCreateOrganization } from "@/utils/api";
import { CreateOrganization } from "@/utils/api.schemas";
import { Button, Divider, Flex, Group, Modal, Text, TextInput } from "@mantine/core";
import { Form, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import React from "react";

interface CrateOrganizationModalProps {
  isOpened: boolean;
  closeModal: () => void;
  onCreateSuccess: () => void;
}

const CreateOrganizationModal = ({ isOpened, closeModal, onCreateSuccess }: CrateOrganizationModalProps) => {
  const form = useForm<Partial<CreateOrganization>>({
    initialValues: {
      name: "",
      address: {
        street: "",
        houseNumber: "",
        zip: "",
        city: "",
        country: "",
      },
    },
    validate: {
      name: isNotEmpty("This field should not be empty"),
      address: {
        street: isNotEmpty("This field should not be empty"),
        houseNumber: (zipValue: string | undefined) =>
          zipValue ? (/^(\d+)(\/\d+)?$/.test(zipValue) ? null : "Unable to send format") : null,
        zip: isNotEmpty("This field should not be empty"),
        city: isNotEmpty("This field should not be empty"),
        country: isNotEmpty("This field should not be empty"),
      },
    },
  });

  const createOrganizationMutation = useCreateOrganization({
    mutation: {
      onMutate: () => {
        notifications.show({
          id: "create-organization",
          loading: true,
          title: "Loading! Please wait...",
          message: "We are creating organization.",
          autoClose: false,
        });
      },
      onSuccess: (data) => {
        notifications.update({
          id: "create-organization",
          title: "Organization created.",
          message: "Organization created successfully.",
          color: "green",
          loading: false,
          autoClose: true,
        });
        onCreateSuccess();
        form.reset();
        closeModal();
      },
      onError: (error) => {
        notifications.update({
          id: "create-organiztaion",
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

  const handleCreateOrganization = (submitValues: Partial<CreateOrganization>) => {
    form.validate();
    if (form.isValid()) {
      createOrganizationMutation.mutate({
        data: submitValues as CreateOrganization,
      });
    }
  };

  const isTouchedDirty = form.isTouched() && form.isDirty();

  const handleClose = () => {
    form.reset();
    closeModal();
  };

  return (
    <Modal size="xl" opened={isOpened} onClose={handleClose} title="Create Organization">
      <Form form={form} onSubmit={handleCreateOrganization}>
        <Flex direction="column" gap={16}>
          <TextInput label="Name" {...form.getInputProps("name")} />
          <TextInput label="Street" {...form.getInputProps("address.street")} />
          <TextInput label="House Number" {...form.getInputProps("address.houseNumber")} />
          <TextInput label="zip" {...form.getInputProps("address.zip")} />
          <TextInput label="City" {...form.getInputProps("address.city")} />
          <TextInput label="Country" {...form.getInputProps("address.country")} />
        </Flex>
        <Group justify="center" mt="lg">
          <Button type="submit" disabled={!isTouchedDirty} loading={createOrganizationMutation.isPending}>
            Save changes
          </Button>
        </Group>
      </Form>
    </Modal>
  );
};
export default CreateOrganizationModal;
