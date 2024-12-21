import { useUpdateOrganization } from "@/utils/api";
import { Organization, UpdateOrganization } from "@/utils/api.schemas";
import { Button, Grid, Group, Modal, TextInput } from "@mantine/core";
import { Form, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import React from "react";

interface CrateOrganizationModalProps {
  activeOrganization: Organization;
  isOpened: boolean;
  closeModal: () => void;
  handleSuccess: () => void;
}

const UpdateOrganizationModal = ({
  activeOrganization,
  isOpened,
  closeModal,
  handleSuccess,
}: CrateOrganizationModalProps) => {
  const form = useForm<Partial<UpdateOrganization>>({
    initialValues: {
      name: activeOrganization.name,
      address: activeOrganization.address
        ? {
            street: activeOrganization.address.street,
            houseNumber: activeOrganization.address.houseNumber,
            zip: activeOrganization.address.zip,
            city: activeOrganization.address.city,
            country: activeOrganization.address.country,
          }
        : undefined,
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

  const updateOrganizationMutation = useUpdateOrganization({
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
      onSuccess: () => {
        notifications.update({
          id: "create-organization",
          title: "Organization created.",
          message: "Organization created successfully.",
          color: "green",
          loading: false,
          autoClose: true,
        });
        handleSuccess();
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

  const handleCreateOrganization = (submitValues: Partial<UpdateOrganization>) => {
    form.validate();
    if (form.isValid()) {
      updateOrganizationMutation.mutate({
        id: activeOrganization.id,
        data: submitValues as UpdateOrganization,
      });
    }
  };

  const isTouchedDirty = form.isTouched() && form.isDirty();

  const handleClose = () => {
    form.reset();
    closeModal();
  };

  return (
    <Modal size="xl" opened={isOpened} onClose={handleClose} title="Update Organization">
      <Form form={form} onSubmit={handleCreateOrganization}>
        <Grid>
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
          <Button type="submit" disabled={!isTouchedDirty} loading={updateOrganizationMutation.isPending}>
            Save changes
          </Button>
        </Group>
      </Form>
    </Modal>
  );
};
export default UpdateOrganizationModal;
