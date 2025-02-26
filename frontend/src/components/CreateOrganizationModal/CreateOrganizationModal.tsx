import { useCreateOrganization } from "@/utils/api";
import { CreateOrganization } from "@/utils/api.schemas";
import { Button, Grid, Group, Modal, TextInput } from "@mantine/core";
import { Form, isNotEmpty, useForm } from "@mantine/form";
import React from "react";

interface CrateOrganizationModalProps {
  isOpened: boolean;
  closeModal: () => void;
  handleSuccess: () => void;
}

const CreateOrganizationModal = ({ isOpened, closeModal, handleSuccess }: CrateOrganizationModalProps) => {
  const form = useForm<Partial<CreateOrganization>>({
    initialValues: {
      name: undefined,
      cin: undefined,
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
      cin: isNotEmpty("This field should not be empty"),
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
      onSuccess: () => {
        handleSuccess();
        form.reset();
        closeModal();
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
        <Grid>
          <Grid.Col span={6}>
            <TextInput label="Organisation Name" {...form.getInputProps("name")} />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput label="Organisation CIN" {...form.getInputProps("cin")} />
          </Grid.Col>
          <Grid.Col span={8}>
            <TextInput label="Street" {...form.getInputProps("address.street")} />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput label="House Number" {...form.getInputProps("address.houseNumber")} />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput label="ZIP code" {...form.getInputProps("address.zip")} />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput label="City" {...form.getInputProps("address.city")} />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput label="Country" {...form.getInputProps("address.country")} />
          </Grid.Col>
        </Grid>
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
