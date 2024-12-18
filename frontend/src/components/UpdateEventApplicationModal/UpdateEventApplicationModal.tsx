import { useUpdateEventApplication } from "@/utils/api";
import { CreateAddress, EventApplication, UpdateEventApplication } from "@/utils/api.schemas";
import { Button, Flex, Group, Modal, Text, TextInput } from "@mantine/core";
import { Form, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import React from "react";

interface UpdateEventModalProps {
  currentApplication: EventApplication;
  isOpened: boolean;
  closeModal: () => void;
}

const UpdateEventApplicationModal = ({ currentApplication, isOpened, closeModal }: UpdateEventModalProps) => {
  const form = useForm<Partial<UpdateEventApplication>>({
    initialValues: {
      invoiceAddress: {
        country: currentApplication?.invoiceAddress ? currentApplication.invoiceAddress.country : "",
        city: currentApplication.invoiceAddress ? currentApplication.invoiceAddress.city : "",
        street: currentApplication.invoiceAddress ? currentApplication.invoiceAddress.street : "",
        houseNumber: currentApplication.invoiceAddress ? currentApplication.invoiceAddress.houseNumber : "",
        zip: currentApplication.invoiceAddress ? currentApplication.invoiceAddress.zip : "",
      },
    },
    validate: {
      invoiceAddress: {
        country: isNotEmpty("This field cannot be empty."),
        city: isNotEmpty("This field cannot be empty."),
        street: isNotEmpty("This field cannot be empty."),
        houseNumber: (zipValue: string | undefined) =>
          zipValue ? (/^(\d+)(\/\d+)?$/.test(zipValue) ? null : "Unable to send format") : null,
        zip: isNotEmpty("This field cannot be empty."),
      },
    },
  });

  const isTouchedDirty = form.isTouched() && form.isDirty();

  const updateEventApplication = useUpdateEventApplication({
    mutation: {
      onMutate: () => {
        notifications.show({
          id: "event-application-update",
          loading: true,
          title: "Loading! Please wait...",
          message: "We are updating your event application.",
          autoClose: false,
        });
      },
      onSuccess: () => {
        notifications.update({
          id: "event-application-update",
          title: "Update User Photo",
          message: "Event application updated successfully.",
          color: "green",
          loading: false,
          autoClose: true,
        });
        closeModal();
      },
      onError: (mutationError) => {
        if (!mutationError.response?.data) return;
        const { statusCode, error, message } = mutationError.response?.data;
        console.error(statusCode, error, message);
        notifications.update({
          id: "event-application-update",
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

  const isInvoiceAdress = (address: CreateAddress | undefined) => {
    return address ? Object.entries(address).some(([_key, value]) => (value as string)?.length > 0) : undefined;
  };

  const handleSubmit = (data: Partial<UpdateEventApplication>) => {
    updateEventApplication.mutate({
      id: currentApplication.id,
      data: data,
    });
  };

  return (
    <Modal
      size="xl"
      opened={isOpened}
      onClose={() => {
        form.reset();
        closeModal();
      }}
      title="Update Event Applicaton"
    >
      <Form form={form} onSubmit={handleSubmit}>
        <Flex direction="column" gap={12}>
          <Text>Invoice Adress</Text>
          <TextInput
            label="Country"
            {...form.getInputProps("invoiceAddress.country")}
            required={isInvoiceAdress(form.values.invoiceAddress)}
          ></TextInput>
          <TextInput
            label="City"
            {...form.getInputProps("invoiceAddress.city")}
            required={isInvoiceAdress(form.values.invoiceAddress)}
          ></TextInput>
          <TextInput
            label="Street"
            {...form.getInputProps("invoiceAddress.street")}
            required={isInvoiceAdress(form.values.invoiceAddress)}
          ></TextInput>
          <TextInput
            label="House Number"
            {...form.getInputProps("invoiceAddress.houseNumber")}
            required={isInvoiceAdress(form.values.invoiceAddress)}
          ></TextInput>
          <TextInput
            label="zip"
            {...form.getInputProps("invoiceAddress.zip")}
            required={isInvoiceAdress(form.values.invoiceAddress)}
          ></TextInput>
        </Flex>
        <Group justify="center" mt="lg">
          <Button type="submit" disabled={!isTouchedDirty} loading={updateEventApplication.isPending}>
            Save changes
          </Button>
        </Group>
      </Form>
    </Modal>
  );
};
export default UpdateEventApplicationModal;
